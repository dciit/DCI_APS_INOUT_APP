//import { EKB_REPORT_API_LOCAL } from './../config/pathService';
import http from "../config/_confixAxios"
// Method Get all product

// step 1 create fuction

// export interface IndicatorSubRecord {
//   indicatorDetail_Id:number;
//   indicatorBy:number;
//   empcode:string;
//   scroce:number;
  

export interface packPayload {
  stDate:string,
  enDate:string,
  wcno:string
}


const getReportDay =  (payload:packPayload) => {
  
  // return new Promise(resolve => {
  //   http.EKB_API_LOCAL.get(`/Report/getAssessmentDashboardBarChartDay/${stDate}/${enDate}/${wcno}`).then((res)=>{
  //     resolve(res.data)
  //   });
  // }) 

  return new Promise<any>(resolve => {
    http.EKB_API_SERVER.post(`/Report/getAssessmentDashboardBarChartDay`,payload).then((res)=>{
      resolve(res.data)
    });
  }) 
}


  const getReportNight =  (payload:packPayload) => {
  
    return new Promise<any>(resolve => {
      http.EKB_API_SERVER.post(`/Report/getAssessmentDashboardBarChartNight`,payload).then((res)=>{
        resolve(res.data)
      });
    }) 

}


const getReportOverAll =  (payload:packPayload) => {
  
  return new Promise<any>(resolve => {
    http.EKB_API_SERVER.post(`/Report/getAssessmentDashboardBarChartOverAll`,payload).then((res)=>{
      resolve(res.data)
    });
  }) 
}


const getReportOverAllByWcno = (payload:packPayload) => {
  return new Promise(resolve => {
    http.EKB_API_SERVER.post(`/Report/getAssessmentDashboardBarChartOverAllByWcno`,payload).then((res)=>{
      resolve(res.data)
    });
  }) 
}


  const getReportTSCCompareData =  (wcno:string,ym:number) => {
  
    return new Promise(resolve => {
      http.EKB_API_SERVER.get(`/Report/getAssessmentDataTableCompareTSC/${wcno}/${ym}`).then((res)=>{
        resolve(res.data)
      });
    }) 

}

const getReportData =  (wcno:string,stDate:string,enDate:string) => {
  
  return new Promise(resolve => {
    http.EKB_API_SERVER.get(`/Report/getAssessmentDataExportExcel/${wcno}/${stDate}/${enDate}`).then((res)=>{
      resolve(res.data)
    });
  }) 
}


  // const getReportDataOut=  (wcno:string,stDate:string,enDate:string) => {

  //   return new Promise(resolve => {
  //     http.EKB_API_SERVER.get(`/Report/getAssessmentDataOUT/${wcno}/${stDate}/${enDate}`).then((res)=>{
  //       resolve(res.data)
  //     });
  //   }) 
  // }


  // const getReportDataRJ=  (wcno:string,stDate:string,enDate:string) => {

  //   return new Promise(resolve => {
  //     http.EKB_API_SERVER.get(`/Report/getAssessmentDataRJ/${wcno}/${stDate}/${enDate}`).then((res)=>{
  //       resolve(res.data)
  //     });
  //   }) 
  // }

  const getPartnoByWCNO = (wcno:string) => {
    return new Promise(resolve => {
      http.EKB_API_SERVER.get(`/Report/getPartnoByWCNO/${wcno}`).then((res)=>{
        resolve(res.data)
      });
    }) 
  }

  const getReportResultTarget = (payload:packPayload) =>{
    return new Promise(resolve => {
      http.EKB_API_SERVER.post(`/Report/getTargetAndResult`,payload).then((res)=>{

        resolve(res.data)
      });
      
    }) 
  }




  
export default {
    getReportDay,
    getReportNight,
    getReportOverAll,
    getReportTSCCompareData,
    getReportData,
    // getReportDataOut,
    // getReportDataRJ,
    getPartnoByWCNO,
    getReportOverAllByWcno,
    getReportResultTarget
};