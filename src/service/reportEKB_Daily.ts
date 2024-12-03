import http from "../config/_confixAxios"
// Method Get all product

// step 1 create fuction

// export interface IndicatorSubRecord {
//   indicatorDetail_Id:number;
//   indicatorBy:number;
//   empcode:string;
//   scroce:number;

export interface packPayload {
  searchDate:string
  wcno:string
  partNo:string
}

export interface packPayloadResult {
  searchDate:string
  wcno:string

}



const getReportDay =  (wcno:string,searchDate:string) => {
  

    return new Promise(resolve => {
        http.EKB_API_SERVER.get(`/ReportDaily/getDailyBarChartDay/${wcno}/${searchDate}`).then((res)=>{
          resolve(res.data)
        });
      }) 
}


  const getReportNight =  (wcno:string,searchDate:string) => {
  
    return new Promise(resolve => {
        http.EKB_API_SERVER.get(`/ReportDaily/getDailyBarChartNight/${wcno}/${searchDate}`).then((res)=>{
          resolve(res.data)
        });
      }) 

}


const getReportOverAll =  (wcno:string,searchDate:string) => {
  
    return new Promise(resolve => {
        http.EKB_API_SERVER.get(`/ReportDaily/getDailyBarChartOverAll/${wcno}/${searchDate}`).then((res)=>{
          resolve(res.data)
        });
      }) 
}


  const getReportTSCCompareData =  (wcno:string,searchDate:string) => {
  
    return new Promise(resolve => {
      http.EKB_API_SERVER.get(`/ReportDaily/getDailyCompareTSC/${wcno}/${searchDate}`).then((res)=>{
        resolve(res.data)
      });
    }) 
  }


    const getReportData =  (wcno:string,searchDate:string) => {
  
      return new Promise(resolve => {
        http.EKB_API_SERVER.get(`/ReportDaily/getDailyReportData/${wcno}/${searchDate}`).then((res)=>{
          resolve(res.data)
        });
      }) 
    }


      // const getReportDataOut=  (wcno:string,searchDate:string) => {
  
      //   return new Promise(resolve => {
      //     http.EKB_API_SERVER.get(`/ReportDaily/getDailyDataOUT/${wcno}/${searchDate}`).then((res)=>{
      //       resolve(res.data)
      //     });
      //   }) 
      // }


      // const getReportOverAllByWcno=  (wcno:string,partno:string) => {
      //   return new Promise(resolve => {
      //     http.EKB_API_SERVER.get(`/ReportDaily/getDailyBarChartOverAllByWcno/${wcno}/${partno}`).then((res)=>{
      //       resolve(res.data)
      //     });
      //   }) 
      // }

      const getReportOverAllByWcno = (payload:packPayload) => {
        return new Promise(resolve => {
          http.EKB_API_SERVER.post(`/ReportDaily/getDailyBarChartOverAllByWcno`,payload).then((res)=>{
            resolve(res.data)
          });
        }) 
      }

      const getReportResultTarget = (payload:packPayloadResult) =>{
        return new Promise(resolve => {
          http.EKB_API_SERVER.post(`/ReportDaily/getDailyTargetAndResult`,payload).then((res)=>{
    
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
    getReportOverAllByWcno,
    getReportResultTarget
};