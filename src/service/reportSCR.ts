
import http from "../config/_confixAxios"


export interface SCR_REPORT {
    line :string
  
    report :SCR_IN_OUT
  }

  export interface SCR_IN_OUT {
    partno :string[]

    in_stock :number[]
 
    out_stock :number[]
 
    bal_stock :number[]
  }

  export interface DATA_IN_OUT_REPORT {
    ymd  :string

    shift  :string

    wcno  :string

    partno  :string
    cm  :string
    partDesc  :string
    model  :string

    shift_lbal_stock:number
    in_stock :number
    out_stock :number
    bal_stock :number
    status:string;
    shift_bal_stock:number
    remark: string;
    remark_stauts:string;

    remark_update:string;
    remark_by:string;
  }

  export interface DATA_IN_OUT_ALL {
    part_type  :string

    reportAll  :DATA_IN_OUT_REPORT[]




}

export interface REMARK {

  ym:string;
  ymd:string;
  shift:string;
  model:string;
  wcno:string;
  partno: string;
  cm:string;
  part_name:string;

  empcode: string;

  remark: string;





}

export interface HISTORY {
  ymd  :string
 
  partno  :string

  cm  :string


  shift  :string

}

export interface HISTORY_RETURN {
  refs  :string
 
  type  :string

  transQty  :number


}

export interface HISTORY_REMARK_RETURN {
  remark_date  :string
 
  remark_by  :string

  remark_status  :string


}

  
export function getEmployeeByGroup(ym:string,ymd:string) {
    return new Promise<SCR_REPORT[]>(resolve => {
       http.EKB_API_SERVER.get(`/SCRReport/getDatasetSCR/${ym}/${ymd}`).then((res) => {
         resolve(res.data);
       }).catch((e) => {
         console.log(e);
       });
    })
  };

  export function getPartDesc() {
    return new Promise<string[]>(resolve => {
       http.EKB_API_SERVER.get(`/SCRReport/getPartDesc`).then((res) => {
         resolve(res.data);
       }).catch((e) => {
         console.log(e);
       });
    })
  };

  export function getDataReportInOut(ymd:string,shift:string,type:string,status:string,stock:string) {
    

      return new Promise<DATA_IN_OUT_ALL[] >(resolve => {
        http.EKB_API_SERVER.get(`/SCRReport/getDataReportInOut/${ymd}/${shift}/${type}/${status}/${stock}`).then((res) => {
          resolve(res.data);
        }).catch((e) => {
          console.log(e);
        });
     })
    };

    export function getRemarkEdit(payload:any) {
    

      return new Promise<any>(resolve => {
        http.EKB_API_SERVER.post(`/SCRReport/getRemarkEdit`,payload).then((res)=>{
          resolve(res.data)
        });
      }); 
    }
     
  export function saveRemark(payload:any) {
    

      return new Promise(resolve => {
        http.EKB_API_SERVER.post(`/SCRReport/remarkAction`,payload).then((res)=>{
          resolve(res.data.status)
        });
      }); 
    }


    export function findHistorys(payload:HISTORY) {
      return new Promise<any>(resolve => {
        http.EKB_API_SERVER.post(`/SCRReport/findHistoryINOUT`,payload).then((res)=>{
          resolve(res.data);
        }).catch((e) => {
          console.log(e);
        });
     })



  

     
    }




  

    
   

