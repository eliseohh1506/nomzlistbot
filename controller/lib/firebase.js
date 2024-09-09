const{initializeApp} = require("firebase/app");
const {errorHandler} = require("./helper");
const {getFirestore} = require("firebase/firestore");
//doc to create document, setdoc to push doc into db
const {
    FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID,   
    FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APPID,
    FIREBASE_MEASUREMENTID
} = process.env

const firebaseConfig = {
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
    appId: FIREBASE_APPID,
    measurementId: FIREBASE_MEASUREMENTID
  };

let app;
let db;
//initialise firebase SDK by calling initialiseApp from firebase method
//parse firebase info from .env
const initialiseFirebaseApp = () => {
    try {
        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        return app;
    } catch (error) {
        errorHandler(error, "firebase-initialiseFirebaseApp");
    }
};

const getFirestoreInstance = () => {
    if (!db) {
        initialiseFirebaseApp();  // Initialize Firebase if it hasn't been initialized
    }
    return db;
};

//returns firebase app instance in line 24
const getFirebaseApp = () => app;

module.exports = {initialiseFirebaseApp, getFirebaseApp, getFirestoreInstance};