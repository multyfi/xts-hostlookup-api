var axios = require("axios");
var https = require("https");
var http = require("http");
var logger = require('./logger');

module.exports.processRequest = async function(method, url, headers, data, localIP) {
    try {
        var options = {
            method: method,
            url: url,
            headers: {
                "authorization": headers.authorization
            }
        };

        // Add data for POST/PUT requests
        if (method === "POST" || method === "PUT") {
            options.data = data;
        }

        // Create HTTP/HTTPS agent with local IP binding if provided
        if (localIP) {
            const agentOptions = { localAddress: localIP };
            options.httpAgent = new http.Agent(agentOptions);
            options.httpsAgent = new https.Agent(agentOptions);
        }

        logger.logFile("request object sent to the server");
        logger.logFile(JSON.stringify({
            method: options.method,
            url: options.url,
            headers: options.headers,
            data: options.data,
            localIP: localIP || 'default'
        }));
        console.log("Request sending:", JSON.stringify({
            method: options.method,
            url: options.url,
            headers: options.headers,
            data: options.data,
            localIP: localIP || 'default'
        }));
        let response = await axios(options);
        
        logger.logFile("request object received from the server");
        logger.logFile(JSON.stringify(response.data));
        
        return response.data;
    } catch (error) {
        logger.logFile("exception object received from the server");
        logger.logFile(JSON.stringify(error.response?.data || error.message));
        
        // Re-throw the error in a format compatible with the existing error handling
        if (error.response) {
            // Server responded with error status
            const err = new Error(error.response.data?.message || error.message);
            err.statusCode = error.response.status;
            err.stack = error.stack;
            throw err;
        } else {
            // Network error or other issues
            throw error;
        }
    }
}