
import { LineReportReturn, ModelInfo } from "../components/Model/LineReport";
import http from "../config/_confixAxios"


export function getLineReportData() {
    return new Promise<ModelInfo[] | LineReportReturn[]>(resolve => {
      http.EKB_API_SERVER.get(`/LineReport/getLineReport`).then((res)=>{
        resolve(res.data);
      }).catch((e) => {
        console.log(e);
      });
   })

   
  }

