const {handleMessage, sendMessage} = require('./lib/telegram');
const {errorHandler} = require("./lib/helper");

// take all input request to server appropriately 
async function handler(req, method) {
    try {
        if(method === "GET") {
            return "Hello Get";
        }

        //pull out req body and check if there's a message
        const {body} = req;
        if (body && body.message) {
            const messageObj = body.message;
            await handleMessage(messageObj);
            return "Success";
        }

        // return String which will display in server page 
        return "Unknown Request";
    } catch (error) {
        errorHandler(error, "mainIndexHandler");
    }
}

module.exports = {handler}