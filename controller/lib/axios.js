//import axios 
const axios = require("axios");

function getAxiosInstance(BASE_URL, headers = {}) {
    return {
        //return 2 methods 

        //make get calls
        //first param : method --> method to call 
        // first param: params --> query parameters to pass 
        get(method,params) {
            // pass method we want to call
            return axios.get(`/${method}`, {
                baseURL: BASE_URL, //baseURL we will get from instance 
                params, //parameters received
                headers //any additional headers we parse to instance 
            });
        },
        //make post requests
        // instead of query params, it passes the parameters as data 
        post(method, data) {
            return axios({
                method: "post",
                baseURL: BASE_URL,
                url: `/${method}`,
                data,
                headers,
            })
        }
    }
}

module.exports= {getAxiosInstance};