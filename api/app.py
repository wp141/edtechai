from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from bson.objectid import ObjectId
from werkzeug.utils import secure_filename
from langchain.embeddings import OpenAIEmbeddings
from langchain.llms import OpenAI
from langchain.vectorstores import Pinecone
from langchain.document_loaders import UnstructuredPDFLoader, OnlinePDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains.question_answering import load_qa_chain
import pinecone
import pymongo
import certifi
import gridfs
import openai
import os

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = "./temp/"
load_dotenv()
index_name = "dev"
CORS(app)

try:
    URI = os.getenv("MONGODB_URI")
    client = pymongo.MongoClient(URI, tlsCAFile=certifi.where())
   
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
 
except Exception as e:
    print("An Invalid URI host error was received. Is your Atlas host name correct in your connection string?")
    exit()

db = client.testing
fs = gridfs.GridFS(db)

pinecone.init(
    api_key=os.getenv("PINECONE_API_KEY"),
    environment=os.getenv("PINECONE_ENV"),
)

@app.route("/course", methods=["POST", "PUT", "GET", "DELETE"])
def course():
    courses = db.courses
    if request.method == "POST":
        course = request.json
        course["resources"] = []
        courses.insert_one(course)
        return "", 200

    elif request.method == "GET":
        id = request.args.get("id")
        course = courses.find_one({"_id": ObjectId(id)})

        if "resources" in course:
            resources = db.fs.files.find({"_id": {"$in": course["resources"]}}).sort("filename")

            course["resources"] = []
            for resource in resources:
                resource_dict = dict(resource)
                resource_dict['_id'] = str(resource_dict['_id'])
                course["resources"].append(resource_dict)
        else:
            course["resources"] = []

        course["_id"] = str(course["_id"])
        return jsonify(course), 200
    

@app.route("/courses", methods=["GET"])
def courses():
    courses = db.courses.find()
    course_arr = []
    for course in courses:
        course_dict = dict(course)
        course_dict['_id'] = str(course_dict['_id'])
        course_dict["resources"] = []
        course_arr.append(course_dict)

    return jsonify(course_arr), 200

@app.route("/resource", methods=["POST", "DELETE"])
def resource():
    if request.method == "POST":
        file = request.files['file']
        path = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(file.filename))
        file.save(path)

        course = request.form.get("course")
        file_metadata_id = fs.put(file, filename=file.filename)
        db.courses.update_one({"_id": ObjectId(course)}, {"$push": {"resources": file_metadata_id}})

        loader = UnstructuredPDFLoader(path)
        data = loader.load()
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
        texts = text_splitter.split_documents(data)
        os.remove(path) 
        for t in texts:
            t.metadata = {"course": course, "resource_id": str(file_metadata_id)}

        embeddings = OpenAIEmbeddings(model="text-embedding-ada-002", openai_api_key=os.getenv("OPENAI_API_KEY"))
        Pinecone.from_documents(texts, embeddings, index_name=index_name)

    elif request.method == "DELETE":
        course = request.args.get("course")
        resource = request.form.get("resource")

        db.courses.update_one({"_id": ObjectId(course)}, {"$pull": {"resources": resource}})
        fs.delete(resource)

        # not supported by gcp starter pinecone env -> need to upgrade
        index = pinecone.Index(index_name)
        index.delete(filter={"resource_id" : resource})

    return "", 200

@app.route("/generate-questions", methods=["POST"])
def generate_questions():
    course = request.form.get("course")
    topic = request.form.get("topic")
    number = request.form.get("number")   
    year = request.form.get("year")   
    difficulty = request.form.get("difficulty")   
    solutions = bool(request.form.get("solutions"))

    embeddings = OpenAIEmbeddings(model="text-embedding-ada-002")
    index = Pinecone.from_existing_index("dev", embeddings)

    llm = OpenAI(temperature=0.7, openai_api_key=os.getenv("OPENAI_API_KEY"))
    chain = load_qa_chain(llm, chain_type="stuff")

    i = 1
    
    question_arr = []
    while i < int(number) + 1: 
        query = f"""
        Write a question assessing a year {year} student's knowledge of {topic} that you know the answer to.
        The question should be {difficulty} difficulty and be at least two sentences. 
        """

        response = ""
        docs = index.similarity_search(query=query, filter={"course": course})
        if len(docs) > 0:
            response += chain.run(input_documents=docs, question=query)
            response += "\n"
            question_arr.append(response)

        i += 1
    
    solution_arr = []
    if solutions == True:
        for i in range (0, len(question_arr)):
            query = f"""
            Generate a year {year} student level solution to the question "{question_arr[i]}".
            The solution length should correspond to the difficulty level, which is {difficulty}.
            """
            response = ""
            docs = index.similarity_search(query=query, filter={"course": course})
            if len(docs) > 0:
                response += chain.run(input_documents=docs, question=query)
                response += "\n"
                solution_arr.append(response)


    return jsonify({
        "questions": question_arr,
        "solutions": solution_arr,
        }), 200

@app.route("/generate-assignment", methods=["POST"])
def generate_assignment():
    course = request.form.get("course")
    topic = request.form.get("topic")
    year = request.form.get("year")   
    difficulty = request.form.get("difficulty") 
    criteria = bool(request.form.get("criteria"))  
    # group = bool(request.form.get("group"))  
    form = request.form.get("form")

    embeddings = OpenAIEmbeddings(model="text-embedding-ada-002")
    index = Pinecone.from_existing_index("dev", embeddings)

    llm = OpenAI(temperature=0.7, openai_api_key=os.getenv("OPENAI_API_KEY"))
    chain = load_qa_chain(llm, chain_type="stuff")

    query = f"""
        Write an assignment specification that students will receive, assessing a year {year} student's knowledge of {topic}.
        The assignment should be {difficulty} difficulty. The assignment should be in {form} format.
        """
    response = ""
    docs = index.similarity_search(query=query, filter={"course": course})
    if len(docs) > 0:
        response += chain.run(input_documents=docs, question=query)

    return jsonify({"assignment" : response}), 200

if __name__ == "__main__":
    app.run(port=8000, debug=True)


    # print(type(embeddings))
    # print(embeddings)

    # Pinecone.add_documents(texts[0], embeddings)
    

    # embeddings = openai.Embedding.create(input = [t.page_content for t in texts], model="text-embedding-ada-002")['data'][0]['embedding']
    # documents = Pinecone(index_name, OpenAIEmbeddings().embed_query, "text").aadd_documents(embeddings)
    # index = pinecone.Index(index_name)
    # embed = OpenAIEmbeddings(model="text-embedding-ada-002", openai_api_key=os.getenv("OPENAI_API_KEY"))
    # vectorstore = Pinecone(index, embed.embed_query, "text")

    # for i, record in texts:

    # print(vectorstore)
    # print(documents)
    # index.upsert(texts)
    
    # index.upsert([{"id": str(file_metadata_id), "values": embeddings, "metadata": {"course": course, "text": ""}}])
    # labelled_embeddings = [(e, course) for e in embeddings]
    # results = pinecone.Index(index_name).query(queries=[topic], top_k=10)
    # print(results)