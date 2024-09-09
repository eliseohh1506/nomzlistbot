// for communication with telegram bot 

//create axios instance for telegram to make existing API calls
const {getAxiosInstance} = require("./axios");
const {errorHandler} = require("./helper");
const {doc, setDoc, getDoc} = require("firebase/firestore");
const { getFirestoreInstance } = require("./firebase");

const db = getFirestoreInstance();
const MY_TOKEN = process.env.TELEBOT_TOKEN;
const BASE_URL = `https://api.telegram.org/bot${MY_TOKEN}`;
//all API calls using axiosInstance will use BASE_URL
const axiosInstance = getAxiosInstance(BASE_URL);

function sendMessage(chatId, messageText) {
    return axiosInstance.post("sendMessage", {
        chat_id: chatId,
        text: messageText,
    })
    .catch((err) => {
        errorHandler(err, "sendMessage", "axios");
    });
}

function sendMenu(chatId, messageText, keyboardObj) {
    return axiosInstance.post("sendMessage", {
        chat_id: chatId,
        text: messageText,
        reply_markup: JSON.stringify({
            keyboard: keyboardObj.keyboard,
            resize_keyboard: keyboardObj.resize_keyboard,
            one_time_keyboard: keyboardObj.one_time_keyboard
        })
    })
    .catch((err) => {
        errorHandler(err, "sendMenu", "axios");
    })
}

//check if telegram bot is started
async function checkStatus(chatId) {
    const chatRef = doc(db, "chats", String(chatId));
    const chatDoc = await getDoc(chatRef);
    if (chatDoc.exists()) {
        const chatData = chatDoc.data();
        if (chatData.status === 1) {
            return true;
        }
    }
    return false;
}

//handle inputs from users
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
                    const keyboard = {
                        keyboard: [
                            [{text: 'new spot'}],
                            [{text: 'find/edit spot'}],
                            [{text: 'show list'}],
                            [{text: 'nearest spot'}],
                            [{text: 'quit'}]
                        ],
                        resize_keyboard: true, // Makes the keyboard smaller
                        one_time_keyboard: true,
                    }
                    //create chat collection with chat_id, set status as 1 for started
                    //console.log(db);
                    const chatRef = doc(db, "chats", String(chatId));
                    await setDoc(chatRef, {status : 1});

                    //await db.collection('chats').doc(chatID).set({status : 1});

                    return sendMenu( 
                        chatId,
                        "Welcome to nomzlist! What are we feasting on today?",
                        keyboard
                    );
                
                default: 
                    return sendMessage(chatId, "I don't understand :( type '/start' to get me started!!");
            }
        } else if (checkStatus(chatId)){
            switch(messageText) {
                case "quit":
                    const chatRef = doc(db, "chats", String(chatId));
                    await setDoc(chatRef, {status : 0});
                    return sendMessage(chatId, "eat well! bye bye~");
                //case for new spot 
                
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