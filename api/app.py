from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from bson.objectid import ObjectId
from werkzeug.utils import secure_filename
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Pinecone
from langchain.document_loaders import UnstructuredPDFLoader, OnlinePDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
import pinecone
import pymongo
import certifi
import gridfs
import openai
import os

app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = "./temp/"
load_dotenv()
index_name = "dev"

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
        courses.insert_one(course)

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

@app.route("/resource", methods=["POST"])
def resource():
    if request.method == "POST":
        file = request.files['file']
        path = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(file.filename))
        file.save(path)

        course = request.form.get("course")
        file_metadata_id = fs.put(file, filename=file.filename)
        res = db.courses.update_one({"_id": ObjectId(course)}, {"$push": {"resources": file_metadata_id}})

        loader = UnstructuredPDFLoader(path)
        data = loader.load()
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=4096, chunk_overlap=0)
        texts = text_splitter.split_documents(data)
        os.remove(path)

        embeddings = openai.Embedding.create(input = [t.page_content for t in texts], model="text-embedding-ada-002")['data'][0]['embedding']
        index = pinecone.Index(index_name)
        index.upsert([(str(file_metadata_id), embeddings, {"course" : course})])
        # print(len(embeddings))
        # print(embeddings[0])
        # labelled_embeddings = [(e, course) for e in embeddings]
        # print(labelled_embeddings)

    return "", 200

if __name__ == "__main__":
    app.run(debug=True)