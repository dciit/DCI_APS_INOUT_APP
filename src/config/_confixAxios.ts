// import { BASE_URL_PART } from "./constants";
import { AUTH_URL_PATH,EKB_REPORT_API_SERVER } from "./pathService"
import Axios from "axios"




const EKB_API_SERVER = Axios.create({
    
    baseURL:EKB_REPORT_API_SERVER,
    headers:{
        'Content-Type':'application/json'
    }
})




const AUTH = Axios.create({
    
    baseURL:AUTH_URL_PATH,
    headers:{
        'Content-Type':'application/json'
    }
})

export default{ 
    AUTH ,
    EKB_API_SERVER
};