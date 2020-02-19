import json
import os
import requests
import datetime

from flask import request
from flask import make_response
from flask import Flask
from flask import jsonify

app = Flask(__name__)


respone = ""


seeds = [
    {
        "text": "helloindia",
        "params": "helloworld"
    }
]


@app.route("/trial")
def home():
    print(respone)
    leaches = [
        {
            "response": respone
        }
    ]
    return jsonify(leaches)





@app.route("/check", methods=['POST'])
def checker():
    req = request.get_json(silent=True, force=True)
    global respone
    respone = str(req["queryResult"]["fulfillmentText"])
    print(respone)
  
    return jsonify(seeds)


if __name__ == "__main__":
    app.run(debug=True)
