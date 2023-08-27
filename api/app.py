from flask import Flask, request, jsonify
from flask_cors import CORS
import pymongo
import certifi
import os
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
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

@app.route("/course", methods=["POST", "PUT", "GET"])
def course():
    courses = db.courses
    if request.method == "POST":
        course = request.json
        courses.insert_one(course)

    return "", 200

@app.route("/courses", methods=["GET"])
def courses():
    courses = db.courses.find()
    course_arr = []
    for course in courses:
        course_dict = dict(course)
        course_dict['_id'] = str(course_dict['_id'])
        course_arr.append(course_dict)

    return jsonify(course_arr), 200

if __name__ == "__main__":
    app.run(debug=True)