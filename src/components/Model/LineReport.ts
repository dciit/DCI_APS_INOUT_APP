

export interface LineReportReturn {


    seq:string
    model:string
    modelCode:string
    apsPlan:number
    actual:number
    remainPlan:number
    status:string
    
}




export interface ModelInfo {

    seq : string
    model:string
    modelCode:string
    apsPlan:number,
    actual:number,
    seqStatus:string;
    lineName:lineInfo[]


}


export interface lineInfo {

    line:string
    results:resultStatusInfo[]
}



export interface resultStatusInfo {
  

    partno : string
    part_name : string

    stock :number

    remain :number

    status:string


    
    
}




export interface TRANSECTION_REMARK_RETURN {
  

    date : string
    shift : string

    wcno :string

    partno :string

    cm:string

    type:string

    qty :number

    qrcodeData:string

    createBy:string
    createDate :string
    refno:string

    
    
}

