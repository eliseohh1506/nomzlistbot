// for communication with telegram bot 

//create axios instance for telegram to make existing API calls
const {getAxiosInstance} = require("./axios");
const {errorHandler} = require("./helper");

const MY_TOKEN = process.env.TELEBOT_TOKEN;
const BASE_URL = `https://api.telegram.org/bot${MY_TOKEN}`;
//all API calls using axiosInstance will use BASE_URL
const axiosInstance = getAxiosInstance(BASE_URL);

function sendMessage(chatId, messageText) {
    return axiosInstance.get("sendMessage", {
        chat_id: chatId,
        text: messageText,
    })
    .catch((err) => {
        errorHandler(err, "sendMessage", "axios");
    });
}

async function handleMessage(messageObj) {
    const messageText = messageObj.text || "";
    if (!messageText) {
        errorHandler("No message text", "handleMessage");
        return "";
    }

    try {
        const chatId = messageObj.chat.id;
        if (messageText.charAt(0) === "/") {
            const command = messageText.substr(1);
            switch(command) {
                case "start":
                    return sendMessage( 
                        chatId,
                        "Welcome to nomzlist! What are we feasting on today?"
                    );
                
                default: 
                    return sendMessage(chatId, "I don't understand :( type '/start' to get me started!!");
            }
        } else {
            sendMessage(chatId, "I don't understand :( type '/start' to get me started!!");
        }
    } catch (error) {
        errorHandler(error, "handleMessage");
    }
}

module.exports = {sendMessage, handleMessage};