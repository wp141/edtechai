from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from bson.objectid import ObjectId
import pymongo
import certifi
import gridfs
import os

app = Flask(__name__)
CORS(app)
load_dotenv()

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

@app.route("/course", methods=["POST", "PUT", "GET", "DELETE"])
def course():
    courses = db.courses
    if request.method == "POST":
        course = request.json
        courses.insert_one(course)

    elif request.method == "GET":
        id = request.args.get("id")
        course = courses.find_one({"_id": ObjectId(id)})
        resources = db.fs.files.find({"_id": {"$in": course["resources"]}}).sort("filename")

        course["resources"] = []
        for resource in resources:
            resource_dict = dict(resource)
            resource_dict['_id'] = str(resource_dict['_id'])
            course["resources"].append(resource_dict)
        
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
    file = request.files['file']
    course = request.form.get("course")
    file_metadata_id = fs.put(file, filename=file.filename)

    print(file_metadata_id)
    res = db.courses.update_one({"_id": ObjectId(course)}, {"$push": {"resources": file_metadata_id}})
    print(res.matched_count)

    return "", 200

if __name__ == "__main__":
    app.run(debug=True)