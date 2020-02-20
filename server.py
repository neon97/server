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
        "fulfillmentText": "we dont have any hotels in mumbai"

    }
]

leaches = [
    {
        "response": "Working fine"
    }
]


@app.route("/trial")
def home():
    print(respone)

    return jsonify(leaches)


@app.route("/check", methods=['POST'])
def checker():
    req = request.get_json(silent=True, force=True)
    print(req)
    return jsonify(seeds)


@app.route('/webhook', methods=['POST'])
def webhook():
    data = request.get_json(silent=True, force=True)
    # print(data)
    print(data['queryResult']['queryText'])

    # if data['queryResult']['fulfillmentText'] == 'At what location you gonna stay?':
    #     reply = {
    #         "messages": [
    #             {
    #                 "platform": "Web",
    #                 "speech": "Text response",
    #                 "type": 0
    #             }
    #         ]
    #     }
    #     print(reply)
    #     res = reply

    if data['queryResult']['queryText'] == 'mumbai':
        res = get_data()
        reply = make_response(res)
        print(reply)

    else:
        res = leaches
        # message = request.form["kolkatta"]
        # print(message)
    return jsonify(res)


 def get_data():
    speech = "we dont have any location at mumbai"

    return{
        "fulfillmentText": speech
    }


if __name__ == "__main__":
    app.run(debug=True)
