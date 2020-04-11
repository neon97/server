PORT_running = 2024;
const dialogflow = require('dialogflow');
const uuid = require('uuid');
var ip = require("ip");
console.dir ( ip.address() );

// npm install uuid express body-parser request execa

//this is all about webhooks node js server for the chatbot is below the code
"use strict";

const express = require("express");
const bodyParser = require("body-parser");

const restService = express();

restService.use(
	bodyParser.urlencoded({
		extended: true
	})
);

restService.use(bodyParser.json());



var list;
var result;
var place;
var apicities;

//api to check the locationn is available or not
async function httpGet() {
	return new Promise(function (resolve, reject) {
		var jsonParsed;
		const request = require('request');
		console.log(place)
		request('https://sandbox.app.repushti.com/search-city-country/' + place, function (error, response, body) {
			console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
			jsonParsed = JSON.parse(body);
			list = jsonParsed
			resolve(list)
		}
		);
	})
}



restService.post("/echo", function (req, res) {

	var reponseSpeech;
	console.log("webhooks")
	console.log(req.body.queryResult.parameters.location);

	var speechResponse = {
		google: {
			expectUserResponse: true,
			richResponse: {
				items: [
					{
						simpleResponse: {
							textToSpeech: "Please provide another City name, as we don't have any service here!"
						}
					}
				]
			}
		},
	};

	var showCity = [];
	var messages = [
		{
			quickReplies: {
				title: 'Select any one City that you prefer to stay at !',
				quickReplies: showCity,
			}

			// card: {
			// 	title: "card title",
			// 	subtitle: "card text",
			// 	imageUri: "https://cdn.britannica.com/26/84526-050-45452C37/Gateway-monument-India-entrance-Mumbai-Harbour-coast.jpg",
			// 	buttons: [
			// 		{
			// 			text: "button text",
			// 			postback: "https://example.com/path/for/end-user/to/follow"
			// 		}
			// 	]
			// }
		}
	]



	/// two different ternary operation object /////

	var speech =
		req.body.queryResult &&
			req.body.queryResult.parameters &&
			req.body.queryResult.parameters.echoText
			? req.body.queryResult.parameters.echoText
			: "Please provide another City name, as we don't have any service here!";


	var foundResponse = {
		payload: speechResponse,
		fulfillmentText: speech,
		speech: speech,
		displayText: speech,
		source: "webhook-echo-sample"
	}
	var foundObjectResponse = {
		//payload has been absent for testing and developent purpose
		fulfillmentText: "Select any one City from below: ",
		fulfillmentMessages: messages,
		speech: "Select any one City from below: ",
		displayText: "Select any one City from below: ",
		source: "webhook-echo-sample"
	}




	var notFound = { "Text": "helloworld" }

	///****end of the operations */


	//login behind to control the location flow//

	if (String(req.body.queryResult.parameters.location.city) == "undefined") {
		console.log(speech);
		result = notFound
		console.log("city absent")
		return res.json(result);

	} else if (String(req.body.queryResult.parameters.location.city) == "") {
		console.log(speech);
		result = foundResponse
		console.log(foundResponse)
		return res.json(result);
	}
	else {
		console.log("City present verification process initialized")
		console.log(speech);
		place = req.body.queryResult.parameters.location.city;
		data_response = httpGet();
		data_response.then(function (reponse) {
			// console.log("this is the result" + String(reponse));
			if (String(reponse) == "") {
				result = foundResponse
				return res.json(result);
			} else {
				if (req.body.queryResult.parameters.location.country == "") {
					console.log("the country is empty we are providing cities wth country")
					console.log(reponse)
					//providing cityList through the API reponse
					for (i = 0; i < list.length; i++) {
						showCity.unshift(String(list[i].City_Name + " " + list[i].Country_Name))
					}
					result = foundObjectResponse
					return res.json(result);
				}
				console.log("the list is printed from the list datatype")
				console.log(reponse)
				// foundResponse.payload.google.richResponse.items[0].citiesList = list
				// console.log(foundResponse.payload.google.richResponse.items[0].citiesList)
				result = notFound
				return res.json(result);
			}
		});

	}

	///****end of the logic */

});



restService.listen(process.env.PORT || 8000, function () {
	console.log("Server up and listening to 8000 port");
});


//code for node.js server



/*
env:GOOGLE_APPLICATION_CREDENTIALS="C:\Users\Qtech\Documents\JS server Socket\key.json"
	
set GOOGLE_APPLICATION_CREDENTIALS="C:\Users\Qtech\Documents\JS server Socket\key.json"
	
	
C:\Program Files (x86)\Common Files\Oracle\Java\javapath;
C:\ProgramData\Oracle\Java\javapath;%SystemRoot%\system32;
%SystemRoot%;%SystemRoot%\System32\Wbem;
%SYSTEMROOT%\System32\WindowsPowerShell\v1.0\;
C:\Program Files\Dart\dart-sdk\bin;C:\flutter\bin;
C:\Program Files\Git\cmd;
C:\Users\Qtech\AppData\Local\Android\Sdk\platform-tools;
C:\Program Files\nodejs\;
C:\Users\Qtech\AppData\Local\Programs\Python\Python38-32\Scripts;
D:\;C:\Users\Qtech\AppData\Roaming\Pub\Cache\bin;
*/
//export GOOGLE_APPLICATION_CREDENTIALS="/Library/WebServer/Documents/rahul_research/nodebotchat/chatbotpy/repushti-a7ec0779bc93.json"
//export GOOGLE_APPLICATION_CREDENTIALS="/Library/WebServer/Documents/rahul_research/nodebotchat/chatbotpy/client_secret_312638286173-n50plhad65gu6pcrpu4eqev9gicoovk7.apps.googleusercontent.com.json"
const projectId = 'repushti-d04b3';
// sessionId: Random number or hashed user identifier


// sesion id with random no generation is to be handled...




// queries: A set of sequential queries to be send to Dialogflow agent for Intent Detection


//languaceCode: Indicates the language Dialogflow agent should use to detect intents
const languageCode = 'en-US';

// Imports the Dialogflow library
//const dialogflow = require('dialogflow');

const execa = require('execa');
//const { WebhookClient } = require('dialogflow-fulfillment');



const compression = require('compression')
const http = require('http');
const StatsD = require('node-statsd');

const socketiod = require('socket.io');
const app = require('express')();
app.use(compression())
app.set('trust proxy', true);
var itsThere = false;
var lister;
var countLimit = [
	{
		"room": "1",
		"child": "3",
		"adults": "9"
	},
	{
		"room": "2",
		"child": "3",
		"adults": "9"
	},
	{
		"room": "3",
		"child": "3",
		"adults": "9"
	},

]
var changed = ""

dp = http.createServer(app).listen(PORT_running, (error) => {
	if (error) {
		console.error(error)
		return process.exit(1)
	} else {
		console.log('NON SSL Listening on port: ' + PORT_running + '.')
	}
});

var io = socketiod({
	pingInterval: 50000,
	pingTimeout: 50000,
	cookie: true,
	transports: ['websocket', 'polling'],
	//transports:['websocket'],
	httpCompression: true,
	cookiePath: '/',
	cookieHttpOnly: true
}).listen(dp);


var stats = new StatsD();
var connectionsArray = [];
stats.socket.on('error', function (error) {
	console.error(error.stack);
});
scu = 0;
socket_list = []
usr_socket = '';
io.sockets.on('connection', function (socket) {

	//console.log(socket);
	var clientIp = socket.request.connection.remoteAddress;
	r = Math.random(100000000, 11100000000)
	d = r * 10000
	sessionnum = Math.floor(d)

	const sessionId = String(socket.handshake.headers.auth + "000" + sessionnum)
	console.log("session id: " + sessionId);
	socket.handshake.sessionID = sessionId
	var uniqe_clientid = socket.handshake.sessionID;
	//console.log(socket.handshake);

	console.log(clientIp, uniqe_clientid);

	scu = scu + 1;
	socket.on("disconnect", function (socket) {
		scu = scu - 1;
	});

	socket.on('userload', function (data) {
		if (usr_socket != '') {
			usr_socket = data.id
		} else {
			usr_socket = uniqe_clientid
		}

		socket.join(usr_socket);
		if (usr_socket != null && usr_socket != '') {
			check_socket = socket_list.indexOf(usr_socket)
			if (check_socket == -1) {
				socket_list.push(usr_socket);
				connectionsArray.splice(usr_socket, 1)
			}
			try {
			} catch (err) {
			}
			socket.join(usr_socket);
		}
		//console.log(socket);
	});

	socket.on('registeruser', function (data) {


		usr_socket = uniqe_clientid

		console.log("user registered with sessionId: " + usr_socket)

		socket.join(usr_socket);
		if (usr_socket != null && usr_socket != '') {
			check_socket = socket_list.indexOf(usr_socket)
			if (check_socket == -1) {
				socket_list.push(usr_socket);
				connectionsArray.splice(usr_socket, 1)
			}
			try {

			} catch (err) {

			}
			socket.join(usr_socket);
		}

		/// user register code
		// Name, Email Id, Phone Number
		// {"name":"", email_id:"", phone_number:""}
	})

	socket.on('userchat', function (data) {



		usr_socket = uniqe_clientid

		console.log("user has sended a querry with session id: " + usr_socket)

		socket.join(usr_socket);
		if (usr_socket != null && usr_socket != '') {
			check_socket = socket_list.indexOf(usr_socket)
			if (check_socket == -1) {
				socket_list.push(usr_socket);
				connectionsArray.splice(usr_socket, 1)
			}
			try {

			} catch (err) {

			}
			socket.join(usr_socket);
		}

		user_mesg = data['text'];
		const queries = [user_mesg]

		// Instantiates a session client
		const sessionClient = new dialogflow.SessionsClient();

		async function detectIntent(
			projectId,
			sessionId,
			query,
			contexts,
			languageCode
		) {
			// The path to identify the agent that owns the created intent.
			const sessionPath = sessionClient.sessionPath(projectId, sessionId);

			// The text query request.
			const request = {
				session: sessionPath,
				queryInput: {
					text: {
						text: query,
						languageCode: languageCode,
					},
				},
			};

			if (contexts && contexts.length > 0) {
				request.queryParams = {
					contexts: contexts,
				};
			}

			const responses = await sessionClient.detectIntent(request);
			return responses[0];
		}

		async function executeQueries(projectId, sessionId, queries, languageCode) {

			// Keeping the context across queries let's us simulate an ongoing conversation with the bot
			let context;
			let intentResponse;
			for (query of queries) {
				try {
					console.log("printing its there")
					console.log(itsThere)
					console.log(`Sending Query: ${query}`);


					// itsThere == true ? changed = "Select any one location from here!!" : console.log("")
					intentResponse = await detectIntent(
						projectId,
						sessionId,
						itsThere == true ? query = "null" : query,
						context,
						languageCode
					);
					console.log("prinitng the query")
					console.log(query);

					// //************this is the logic where no manipulation is made to the dialogflow */


					intentResponse.queryResult.title = String(runningCheck(String(intentResponse.queryResult.fulfillmentText)))
					//working on to get the api reponse cities to the dynamic application reponse;

					if (String(intentResponse.queryResult.fulfillmentMessages[0].quickReplies) == "undefined") {
						lister = countLimit
					} else {
						lister = intentResponse.queryResult.fulfillmentMessages[0].quickReplies.quickReplies
					}

					res = { text: intentResponse.queryResult.fulfillmentText, show: intentResponse.queryResult.title, list: lister, }
					console.log("emiting to sessionId: " + usr_socket)
					console.log(res)

					io.to(usr_socket).emit('res_chat', res);

					//end of the logic


					//****** working on the logic to edit the parameter 

					//  if(String(query) == "Mumbai")
					//  {
					//  	console.log(intentResponse.queryResult.parameters.fields.location.structValue.fields.city.stringValue)
					//  	intentResponse.queryResult.parameters.fields.location.structValue.fields.city.stringValue = "Dubai"
					//  	console.log(intentResponse.queryResult.parameters.fields.location.structValue.fields.city.stringValue)
					//  }els0 e if(String(query) == "Dubai"){
					//  	console.log(intentResponse.queryResult.parameters.fields.location.structValue.fields.city)
					//  }else{
					//  	console.log(intentResponse.queryResult.parameters.fields.location.structValue)

					//  }

					// intentResponse.queryResult.title = String(runningCheck(String(intentResponse.queryResult.fulfillmentText)))
					// res = { text: intentResponse.queryResult.fulfillmentText, show: intentResponse.queryResult.title, list: countLimit }
					// console.log(res)

					// io.to(usr_socket).emit('res_chat', res);

					//		*******end of the logic//


					// ****************   Note upper one or lower one can be used alternaly vise-versa  ***************** //


					// the main logic that works on the Android app *******

					// 		if (findreturn(intentResponse.queryResult.fulfillmentText, "finding") == "finding") {
					// 			if (itsThere == true) {
					// 				data_response = httpGet();
					// 				data_response.then(function (result) {

					// 					if (String(result) == "") {
					// 						//querry will be checked with the list of cities if we dont hav the hotel in the city we will ask user to inout a new city
					// 						console.log("We dont have any hotels at this location !! Please Provide another location !!")
					// 						intentResponse.queryResult.fulfillmentText = "We dont have any hotels at this location !! Please Provide another location !!"
					// 					} else {
					// 						//we have the hotel in the city and we will just confirm the localtion properly as we can have same name of cities worldwide
					// 						intentResponse.queryResult.fulfillmentText = "Select any one from here!!"
					// 						intentResponse.queryResult.listCities = result;
					// 						itsThere = false;
					// 					}
					// 					intentResponse.queryResult.title = String(runningCheck(String(intentResponse.queryResult.fulfillmentText)))

					// 					res = { text: intentResponse.queryResult.fulfillmentText, show: intentResponse.queryResult.title, list: intentResponse.queryResult.listCities }
					// 					console.log(res)




					// 					io.to(usr_socket).emit('res_chat', res);
					// 					//
					// 				}, function (err) {
					// 					console.log("err:", err);
					// 					//
					// 				});
					// 			} else {
					// 				itsThere = true;
					// 				console.log(itsThere)
					// 				console.log(queries)
					// 				intentResponse.queryResult.title = String(runningCheck(String(intentResponse.queryResult.fulfillmentText)))
					// 				res = { text: intentResponse.queryResult.fulfillmentText, show: intentResponse.queryResult.title }
					// 				console.log(res)

					// 				//using for debug
					// 				// console.log("The location output is here")

					// 				// String(intentResponse.queryResult.parameters.fields.location.stringValue) == "[object Object]" ?
					// 				// 	console.log(intentResponse.queryResult.parameters.fields.location.stringValue) :
					// 				// 	console.log(intentResponse.queryResult.parameters.fields.location.structValue)

					// 				io.to(usr_socket).emit('res_chat', res);
					// 			}

					// 		}

					// 		else if (findreturn(intentResponse.queryResult.fulfillmentText, "count") == "count") {
					// 			itsThere = false
					// 			intentResponse.queryResult.title = String(runningCheck(String(intentResponse.queryResult.fulfillmentText)))
					// 			console.log(countLimit)
					// 			res = { text: intentResponse.queryResult.fulfillmentText, show: intentResponse.queryResult.title, list: countLimit }
					// 			console.log(res)

					// 			//using for debug
					// 			// console.log("The location output is here")

					// 			// String(intentResponse.queryResult.parameters.fields.location.stringValue) == "[object Object]" ?
					// 			// 	console.log(intentResponse.queryResult.parameters.fields.location.stringValue) :
					// 			// 	console.log(intentResponse.queryResult.parameters.fields.location.structValue)

					// 			io.to(usr_socket).emit('res_chat', res);
					// 		}
					// 		else {

					// 			itsThere = false
					// 			intentResponse.queryResult.title = String(runningCheck(String(intentResponse.queryResult.fulfillmentText)))
					// 			res = { text: intentResponse.queryResult.fulfillmentText, show: intentResponse.queryResult.title }
					// 			console.log(res)		

					// 			//using for debug
					// 			// console.log("The location output is here")

					// 			// String(intentResponse.queryResult.parameters.fields.location.stringValue) == "[object Object]" ?
					// 			// 	console.log(intentResponse.queryResult.parameters.fields.location.stringValue) :
					// 			// 	console.log(intentResponse.queryResult.parameters.fields.location.structValue)

					// 			io.to(usr_socket).emit('res_chat', res);									
					// 		}

					//				******* end of the logic that has been applied to the Flutter Android app easily

					dd = intentResponse.outputAudio;
				} catch (error) {
					console.log(error);
				}
			}
		}

		//function

		executeQueries(projectId, sessionId, queries, languageCode);
		console.log(itsThere)


		//function for defining the action from node.js to the application

		function runningCheck(text) {
			if (findreturn(text, "location") == "location") {

				console.log("show location card")
				return "others"
			}
			else if (findreturn(text, "When do you want to travel?") == "When do you want to travel?") {
				console.log("show calender for date")
				return "calender"
			} else if (findreturn(text, "Help us, With your date of travel.") == "Help us, With your date of travel.") {
				console.log("show calender for date")
				return "calender"
			}
			else if (findreturn(text, "count ") == "count ") {
				console.log("show count scroll")
				return "count"
			}
			else if (findreturn(text, "facilities ") == "facilities ") {
				console.log("show tab scroll text")
				return "tab"
			}
			else if (findreturn(text, "You are looking") == "You are looking") {
				console.log("show options")
				return "text"
			} else if (findreturn(text, "Select any") == "Select any") {

				return "tabCity"
			} else if (findreturn(text, "Congrats") == "Congrats") {

				return "video"
			}
			else if (findreturn(text, "Star ") == "Star ") {
				console.log("show rating stars")
				return "rating"
			}
			else {
				console.log("flow")
			}
		}

		function findreturn(text, find) {
			finder = text.search(String(find))
			if (String(finder) == "-1") {
				return "0";
			} else {
				return find;
			}
		}
	})
})

