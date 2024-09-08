
function errorHandler(error, name,from) {
    let loggerFunction = console.log;

    loggerFunction("-------START-------");
    loggerFunction("Error occured in " + name);

    //handle errors from axios library
    if (from == "axios") {
        if(error.response) {
            //request was made but status code returned indicates error 
            loggerFunction(error.response.data);
            loggerFunction(error.response.status);
            loggerFunction(error.response.headers);
        } else if (error.request) {
            //request made but no response received
            //'error.request' is an instance of XMLHttpRequest in the browser
            // http.ClientRequest in node.js
            loggerFunction(error.request);
        } else {
            //Something happened in setting up the request 
            loggerFunction("Error ", error.message);
        }
        loggerFunction(error.toJSON());
    } else {
        loggerFunction(error);
    }

    loggerFunction("-------END-------");
}

module.exports = {errorHandler};