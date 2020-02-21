PORT_running = 2024;
const dialogflow = require('dialogflow');
const uuid = require('uuid');

//export GOOGLE_APPLICATION_CREDENTIALS="/Library/WebServer/Documents/rahul_research/nodebotchat/chatbotpy/repushti-a7ec0779bc93.json"
//export GOOGLE_APPLICATION_CREDENTIALS="/Library/WebServer/Documents/rahul_research/nodebotchat/chatbotpy/client_secret_312638286173-n50plhad65gu6pcrpu4eqev9gicoovk7.apps.googleusercontent.com.json"
const projectId = 'hotel-booking-bkmmja';
// sessionId: Random number or hashed user identifier
const sessionId = "12121212";
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

dp = http.createServer(app).listen(PORT_running, (error) => {
    if (error) {
        console.error(error)
        return process.exit(1)
    }else{
        console.log('NON SSL Listening on port: ' + PORT_running + '.')
    }
});

var io = socketiod({
    pingInterval:50000,
    pingTimeout:50000,
    cookie:true,
    transports:['websocket', 'polling'],
    //transports:['websocket'],
    httpCompression:true,
    cookiePath:'/',
    cookieHttpOnly:true
}).listen(dp);


var stats = new StatsD();
var connectionsArray = [];
stats.socket.on('error', function (error) {
    console.error(error.stack);
});
scu = 0;
socket_list = []
usr_socket = '';
io.sockets.on('connection', function(socket) {

	//console.log(socket);
	var clientIp = socket.request.connection.remoteAddress;
	var uniqe_clientid = socket.handshake.sessionID;
	//console.log(socket.handshake);

	console.log(clientIp, uniqe_clientid);

	scu = scu + 1;
    socket.on("disconnect", function(socket) {
        scu = scu - 1;
    });

    socket.on('userload', function(data) {
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

	socket.on('registeruser', function(data) {
		console.log(data);
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

	socket.on('userchat', function(data) {
		console.log(data);
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
	    ){
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
	        //console.log(responses);
	        return responses[0];
	    }

	    async function executeQueries(projectId, sessionId, queries, languageCode) {
	        // Keeping the context across queries let's us simulate an ongoing conversation with the bot
	        let context;
	        let intentResponse;
	        for (const query of queries) {
	            try {
	                console.log(`Sending Query: ${query}`);
	                intentResponse = await detectIntent(
	                    projectId,
	                    sessionId,
	                    query,
	                    context,
	                    languageCode
	                );
	                console.log('Detected intent');
	                console.log(
	                    `Fulfillment Text: ${intentResponse.queryResult.fulfillmentText}`
	                );
	                dd = intentResponse.outputAudio;
	                console.log(intentResponse.responseId);
	                console.log(intentResponse.queryResult.fulfillmentText);
	                // Use the context from this response for next queries
	                //base64output = intentResponse.outputAudio
	                res = {text:intentResponse.queryResult.fulfillmentText}
					io.to(usr_socket).emit('res_chat', res);
	                

	                //context = intentResponse.queryResult.outputContexts;
	                //res.send({"response":intentResponse.queryResult.fulfillmentText})
	                //res.send({"response":intentResponse.queryResult.fulfillmentText, "b":base64output})
	            } catch (error) {
	                console.log(error);
	            }
	        }


	    }
	    executeQueries(projectId, sessionId, queries, languageCode);



		
	})
})
