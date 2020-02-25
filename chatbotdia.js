PORT_running = 2024;
const dialogflow = require('dialogflow');
const uuid = require('uuid');

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


const sessionId = "weffwsgegbsf";
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
		// console.log(data);
		u_id = data['id']
		if (usr_socket != '') {
			usr_socket = u_id
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




		/// user register code
		// Name, Email Id, Phone Number
		// {"name":"", email_id:"", phone_number:""}
	})

	socket.on('userchat', function (data) {
		console.log("user has sended a querry")
		u_id = data['id']
		if (usr_socket != '') {
			usr_socket = u_id
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
			// responses[0].queryResult.fulfillmentText = "Tell what location that you are changing"
			console.log(responses[0].queryResult.parameters.fields.location);
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
					link = 'https://sandbox.app.repushti.com/search-city-country/' + String(query)
					console.log(link)
					itsThere == true ? changed = "Select any one location from here!!" : console.log("")
					intentResponse = await detectIntent(
						projectId,
						sessionId,
						itsThere == true ? query = "null" : query,
						context,
						languageCode
					);
					console.log("prinitng the query")
					console.log(query);


					// console.log(intentResponse.queryResult.parameters)

					itsThere == true ? intentResponse.queryResult.fulfillmentText = "Select any one from here!!" : console.log("")
					intentResponse.queryResult.title = String(runningCheck(String(intentResponse.queryResult.fulfillmentText)))


					if (findreturn(intentResponse.queryResult.fulfillmentText, "location") == "location") {
						itsThere = true
						console.log(itsThere)
						console.log(queries)

						res = { text: intentResponse.queryResult.fulfillmentText, show: intentResponse.queryResult.title, list: intentResponse.queryResult.listCities }
							console.log(res)
							io.to(usr_socket).emit('res_chat', res);
					} else if (intentResponse.queryResult.fulfillmentText == "Select any one from here!!") {

						//http req is to be sended here
						// list = httpGet()
						//httpGet()

						data_response = httpGet();
						data_response.then(function(result) {
							console.log(result);

							intentResponse.queryResult.listCities = result;
							itsThere = false;

							res = { text: intentResponse.queryResult.fulfillmentText, show: intentResponse.queryResult.title, list: intentResponse.queryResult.listCities }
							console.log(res)
							io.to(usr_socket).emit('res_chat', res);
							//
						}, function(err) {
							console.log("err:", err);
							//
						});

						// console.log("prinitng the list");
						// console.log(list)
						
					}
					else {
						console.log()
						itsThere = false

						res = { text: intentResponse.queryResult.fulfillmentText, show: intentResponse.queryResult.title, list: intentResponse.queryResult.listCities }
							console.log(res)
							io.to(usr_socket).emit('res_chat', res);
					}

					// console.log(intentResponse.queryResult)



					// console.log(
					// 	`Fulfillment Text: ${intentResponse.queryResult.fulfillmentText}`
					// );
					dd = intentResponse.outputAudio;
					// console.log(intentResponse.responseId);
					// console.log(intentResponse.queryResult.fulfillmentText);
					// Use the context from this response for next queries
					//base64output = intentResponse.outputAudio

					//sending to the app almost
					


					



				} catch (error) {
					console.log(error);
				}
			}


			async function httpGet() {
				return new Promise(function(resolve, reject) {
					var jsonParsed;
					const request = require('request');
					request(link, function (error, response, body) {
						console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
						jsonParsed = JSON.parse(body);
						// for (let i = 0; i < jsonParsed.length; i++) {
						// 	list.push({
						// 		"city": jsonParsed[i].City_Name,
						// 		"country": jsonParsed[i].City_Name
						// 	})
						// }
						list = jsonParsed
						resolve(list)
						// console.log(jsonParsed)

					}

					);
					//console.log("jsonparsed data")
					//console.log(list)
					
					
				})

				

				
			}

			var list = ["raj"];
			var link = "";


		}



		executeQueries(projectId, sessionId, queries, languageCode);
		console.log(itsThere)





		function runningCheck(text) {
			if (findreturn(text, "location") == "location") {

				console.log("show location card")
				return "others"
			}
			else if (findreturn(text, "date ") == "date ") {
				console.log("show calender for date")
				return "calender"
			}
			else if (findreturn(text, "count ") == "count ") {
				console.log("show count scroll")
				return "count"
			}
			else if (findreturn(text, "rating ") == "rating ") {
				console.log("show rating stars")
				return "rating"
			}
			else if (findreturn(text, "facilities ") == "facilities ") {
				console.log("show tab scroll text")
				return "tab"
			}
			else if (findreturn(text, "changes?") == "changes?") {
				console.log("show options")
				return "text"
			} else if (findreturn(text, "Select any one from here!!") == "Select any one from here!!") {

				return "tabCity"
			} else if (findreturn(text, "Congrats") == "Congrats") {

				return "video"
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


