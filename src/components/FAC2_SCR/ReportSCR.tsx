import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { findHistorys, getDataReportInOut } from "../../service/reportSCR";
// import {  TextField } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import RemarkLOG from "../Dialog/RemarkLOG";
import { useDispatch } from "react-redux";
import TransectionDialog from "../Dialog/TransectionDialog";
import { TRANSECTION_REMARK_RETURN } from "../Model/LineReport";

export interface SCR_REPORT {
  line: string;

  report: SCR_IN_OUT;
}

export interface SCR_IN_OUT {
  partno: string[];

  in_stock: number[];

  out_stock: number[];

  bal_stock: number[];
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
    remark:string
    remark_stauts:string

    remark_update:string
    remark_by:string


}


export interface DATA_IN_OUT_ALL {
    part_type  :string
   
    reportAll  :DATA_IN_OUT_REPORT[]




}


export interface HISTORY {
  ymd  :string
 
  wcno:string
  partno  :string

  cm  :string


  shift  :string

  type:string

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


function ReportSCR() {

  const dispatch = useDispatch();

  const [DataInOut, setDataInOut] = React.useState<DATA_IN_OUT_ALL[]>([]);


  const [PartDesc, setPartDesc] = useState<string>("ALL");
  const [Shift, setShift] = useState<string>("D");
  const [ymd,setymd] = useState<string>(dayjs().format("YYYYMMDD"));
  const [statusType,setstatusType] = useState<string>("ALL");
  const [ymdLBAL,setymdLBAL] = useState<string>();
  // const [windowHeight, setWindowHeight] = useState<number>(window.innerHeight - ((19 / 100) * window.innerHeight));
  const [loadApi, setloadApi] = useState(false);

  const [value] = React.useState<Dayjs | null>(dayjs());
  const [openDialog, setOpenDialog] = useState(false);
  const [openTransectionDialog , setopenTransectionDialog] = useState<boolean>(false);
  const [isEdit, setisEdit] = useState<boolean>(false);
  const [selectStock,setselectStock] = useState<string>("MAIN");
  const [firstOpenWeb,setfirstOpenWeb] = useState<boolean>(false);

  const [findHistoryReturn,setfindHistoryReturn] = useState<HISTORY_RETURN[]>([]);
  const [findRemarkPayload,setfindRemarkPayload] = useState<HISTORY_REMARK_RETURN[]>([]);
  const [transectionReturnPayload,settransectionReturnPayload] = useState<TRANSECTION_REMARK_RETURN[]>([]);

  const [historyPayload,sethistoryPayload] = useState<HISTORY>({ymd:"",wcno:"",partno:"",cm:"",shift:"",type:""});
  const [lbal,setlbal] = useState<number>(0)
  const [out,setout] = useState<number>(0)




  useEffect(() => {
 
    getInitData();
    setymdLBAL(Shift == "D" ? `${dayjs(ymd).subtract(1,"day").format("DD-MM-YYYY")} (N)` : `${dayjs(ymd).format("DD-MM-YYYY")} (D)`)
 
  }, [selectStock]);


  useEffect(() => {

    if(firstOpenWeb) {
      SearchData();
    }else{
      setfirstOpenWeb(true)
    } 
  }, [onclose]);



  const getInitData = async () => {

    setloadApi(true)

    const result = await getDataReportInOut(ymd,Shift,PartDesc,statusType,selectStock);
        setDataInOut(result);
        setloadApi(false)
    
  };
  const SearchData = async () => {
    setloadApi(true)
    // setWindowHeight(window.innerHeight - 200);
    const result = await getDataReportInOut(ymd,Shift,PartDesc,statusType,selectStock);
    setymdLBAL(Shift == "D" ? `${dayjs(ymd).subtract(1,"day").format("DD-MM-YYYY")} (N)` : `${dayjs(ymd).format("DD-MM-YYYY")} (D)`)
    setDataInOut(result);
    setloadApi(false)

  }

  const filterMonthDataTable = (data: any) => {
    setymd(dayjs(data).format("YYYYMMDD"));
    
  };


  const closeDialog = () => {
    setopenTransectionDialog(false)
    setOpenDialog(false)
  };

  //@ts-ignore
  const addRemark = (ym:string,shift:string,model:string,wcno:string,partno:string,cm:string,part_name:string,status_remark:String) =>{
    

    dispatch({
      type: "DATA_CLICK",
      payload:{
        ym:ym.substring(0,6),
        ymd:ymd,
        shift:shift,
        model:model,
        wcno:wcno,
        partno:partno,
        cm:cm,
        part_name:part_name.split(' ')[0],
        empcode:'',
        remark:''
} 
      
   })
    if(status_remark == "TRUE"){
    setisEdit(true)
    }else{
      setisEdit(false)
    }

  setOpenDialog(true) 
  }

  const filterStock = async(stock:string) =>{
    await setselectStock(stock)
  }


  const statusChange = async (e:any) =>{
    setstatusType(e.target.value as string)
    setloadApi(true)
    const result = await getDataReportInOut(ymd,Shift,PartDesc,e.target.value as string,selectStock);
    setymdLBAL(Shift == "D" ? `${dayjs(ymd).subtract(1,"day").format("DD-MM-YYYY")} (N)` : `${dayjs(ymd).format("DD-MM-YYYY")} (D)`)
    setDataInOut(result);
    setloadApi(false)
  }

 const findHistory = async(ymd:string,shift:string,wcno:string,partno:string,cm:string,out:number,lbal:number) =>{
  
  setout(out)
  setlbal(lbal)
  let payload: HISTORY ={
    ymd:ymd,
    wcno:wcno,
    partno:partno,
    cm:cm,
    shift:shift,
    type:selectStock
  }

  sethistoryPayload(payload)

   const result = await findHistorys(payload);
   setfindHistoryReturn(result.historyReturns)
   setfindRemarkPayload(result.historyRemarkReturnsList)
   settransectionReturnPayload(result.transectionReutrunList)
   setopenTransectionDialog(true)



 }


  return (
    <>
      <div className="overflow-hidden">
        {/* <h1 className="font-bold  p-6 bg-black text-white text-5xl">
          WIP STOCK SCROLL MONITORING
        </h1> */}
   

      <div className="border border-1 shadow-b  p-4  bg-blue-100 mt-2  rounded-lg">
        <div className="flex sm:flex-col md:flex-row flex-col justify-start gap-8 ">
         <div>
          <FormControl fullWidth className="w-full" > 
             
                <div className="datepickerColor">
               <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                        <DatePicker value={value} onChange={(newValue) => filterMonthDataTable(newValue)} label="Search Date" />
                    </DemoContainer>
                    </LocalizationProvider>
                </div>
            </FormControl>
            
            </div>

          
            <div>
            <FormControl fullWidth className="m-2 w-full bg-[#faffb3]">
              <InputLabel  id="demo-controlled-open-select-label">
                shift
              </InputLabel>
              <Select
                value={Shift}
                onChange={(e) => setShift(e.target.value as string)}
                sx={{
                    '& .MuiSelect-select': {
                      textAlign: 'left',
                    },
                  }}
              >
                <MenuItem value={"D"}>D</MenuItem>
                <MenuItem value={"N"}>N</MenuItem>
              </Select>
            </FormControl>
          </div>


          <div>
            <FormControl fullWidth className="m-2 w-full bg-[#faffb3]" > 
              <InputLabel id="demo-controlled-open-select-label">
                Part Type
              </InputLabel>
              <Select
              
                labelId="demo-controlled-open-select-label"
                id="demo-controlled-open-select"
                value={PartDesc}
                onChange={(e) => setPartDesc(e.target.value as string)}
                sx={{
                    '& .MuiSelect-select': {
                      textAlign: 'left',
                    },
                  }}
              > 
                <MenuItem value={"ALL"}>ALL</MenuItem>
                <MenuItem value={"BODY"}>BODY</MenuItem>
                <MenuItem value={"TOP"}>TOP</MenuItem>
                <MenuItem value={"BOTTOM"}>BOTTOM</MenuItem>
                <MenuItem value={"FS"}>FIXED SCROLL</MenuItem>
                <MenuItem value={"OS"}>OBTING SCROLL</MenuItem>
                <MenuItem value={"CS"}>CRANK SHAFT</MenuItem>
                <MenuItem value={"HS"}>HOUSING</MenuItem>
                <MenuItem value={"LW"}>LOWER</MenuItem>

                <MenuItem value={"STATOR"}>STATOR</MenuItem>
                <MenuItem value={"ROTOR"}>ROTOR</MenuItem>
              </Select>
            </FormControl>
          </div>


          <div>
            <FormControl fullWidth className="m-2 w-full bg-[#faffb3]">
              <InputLabel  id="demo-controlled-open-select-label">
                STATUS
              </InputLabel>
              <Select
                value={statusType}
                onChange={(e) => statusChange(e)}
                sx={{
                    '& .MuiSelect-select': {
                      textAlign: 'left',
                    },
                  }}
              > 
                {/* <MenuItem value={"ALL"}>ALL</MenuItem>
                <MenuItem value={"STATUS-1"}>SHIFT LBAL &lt; 0</MenuItem>
                <MenuItem value={"STATUS-2"}>SHIFT BAL &lt; 0</MenuItem>
                <MenuItem value={"STATUS-3"}>SHIFT (LBAL,BAL) &lt; 0</MenuItem>
                <MenuItem value={"STATUS-4"}>มียอด IN ไม่มียอด OUT</MenuItem>
                <MenuItem value={"STATUS-5"}>มียอด OUT ไม่มียอด IN</MenuItem>
                <MenuItem value={"STATUS-6"}> IN ไม่เท่ากับ  OUT (0-50%)</MenuItem>
                <MenuItem value={"STATUS-7"}> IN ไม่เท่ากับ  OUT (50-200%)</MenuItem>
                <MenuItem value={"STATUS-8"}> IN ไม่เท่ากับ  OUT (&gt;200%)</MenuItem> */}
                <MenuItem value={"ALL"}>ALL</MenuItem>
                <MenuItem value={"STATUS-0"}>STOCK ปกติ</MenuItem>
                <MenuItem value={"STATUS-1"}>STOCK ปัจจุบัน &lt; 0</MenuItem>
                <MenuItem value={"STATUS-2"}>SHIFT LBAL &lt; 0</MenuItem>
                <MenuItem value={"STATUS-3"}>SHIFT BAL &lt; 0</MenuItem>
                <MenuItem value={"STATUS-4"}>SHIFT (LBAL,BAL) &lt; 0</MenuItem>
      
       



              </Select>
            </FormControl>
          </div>

          <div className="mt-2">
            <Button
              className="w-36 h-14 text-base"
              type="submit"
              variant="contained"
              endIcon={<SearchIcon sx={{ width: "25px", height: "25px" }}/>}
              onClick={() => SearchData()}
            >
              ค้นหา
            </Button>
          </div>
        </div>
      </div>

      <ul className="hidden text-md shadow-b  text-center text-gray-500 rounded-lg shadow sm:flex  mt-4">
        
        <li className="w-full focus-within:z-10">
            <button onClick={() => filterStock("MC")} className={`inline-block w-full p-2  bg-sky-200 border-r ${selectStock === "MC" ? "text-white bg-sky-600" : ""} border-gray-200  rounded-s-lg font-bold    focus:font-bold    hover:text-white hover:bg-sky-600 text-gray-500`} aria-current="page">SUB-LINE</button>
        </li>

        <li className="w-full focus-within:z-10">
            <button  onClick={() => filterStock("MAIN")} className={`inline-block w-full p-2 bg-sky-200 border-s-0 ${selectStock === "MAIN" ? "text-white bg-sky-600" : ""} border-gray-200  rounded-e-lg hover:text-white  font-bold  focus:font-bold    text-gray-500 hover:bg-sky-600`}>MAIN</button>
        </li>
   
      </ul>

   
               
      {loadApi ? (
        <Box
          sx={{ mt: 10 }}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <CircularProgress />
        </Box>
      ) : (
       
        <div className={`grow overflow-y-auto block`} style={{ height: `${window.innerHeight - ((25 / 100) * window.innerHeight)}px` }}>
        <table className="tbApprove w-full  text-black mt-4 ">
              <thead className="sticky top-0 bg-blue-300 ">
            

                <tr className="text-sm">
                  {/* <th  className="font-normal">YMD</th>
                  <th  className="font-normal">SHIFT</th> */}
                          
                  <th  className="w-[2%] font-normal">WCNO</th>
                  <th  className="w-[8%] font-normal">PARTNO</th>
                  <th  className="w-[10%] font-normal">MODELS</th>
                  <th className="w-[8%] font-normal"> <p className="font-bold text-blue-800 text-[12px]">{ymdLBAL}</p> STOCK ก่อนหน้า<p>(A)</p></th>
                  <th className="w-[6%] font-normal"><br />IN STOCK <p>(B)</p></th>
                  <th className="w-[6%] font-normal"><br />OUT STOCK <p>(C)</p></th>   
                  <th className="w-[10%] font-normal"> <p className="font-bold text-blue-800 text-[12px]">{ymdLBAL}</p> BAL STOCK  <p className="text-md">A + (B - C) = D</p> </th>
                  <th  className="w-[8%] font-normal text-[13px]">CURRENT STOCK <br />(ยอดคงเหลือปัจจุบัน)</th>
                  <th  className="w-[12%] font-normal bg-[#15CDCA] ">STATUS</th>
                  
                  <th  className="w-[15%] font-normal bg-orange-300">Remark</th>
                  <th  className="w-[4%] font-normal bg-indigo-200">History</th>

                </tr>
                <tr>
                      
                      
                  </tr>
              </thead>
              <tbody className="text-black  text-sm">
                  <tr  className="bg-white">
                      <td  colSpan={12} className=""></td>
                  </tr>
                  {DataInOut.map((title, index) => (
                      <>
                        <tr key={index}>  
                              <td  colSpan={12} className="bg-blue-600 text-white text-md">{title.part_type}
                              </td>
                            
                          </tr>
                          {title.reportAll.length > 0 ? title.reportAll.map((row, index) => (
                              <tr className={row.shift_bal_stock < 0 || row.bal_stock < 0 ? "blinkColor-Stock-Alert " : index % 2 == 0 ? "bg-gray-200" : "bg-white"} 
                                 key={index}>
                          
                              <td className=" text-left"> {row.wcno}</td>
                              <td className=" text-left"> {row.partno}  {row.cm}</td>
                              <td className="text-left"> {row.model}</td>
                              <td className=" text-right"> {row.shift_lbal_stock}</td>
                              <td className=" text-right"> {row.in_stock}</td>
                              <td className=" text-right"> {row.out_stock}</td>
                              <td className=" text-right"> {row.shift_bal_stock}</td>
                             <td className=" text-right"> {row.bal_stock}</td>
                             <td className=" text-left "> {row.status}</td>
                             {/* <td className={` text-left  ${row.shift_bal_stock < 0 || row.bal_stock < 0 ? "cursor-pointer hover:bg-yellow-300":""} `}  
                              onClick={row.shift_bal_stock < 0 || row.bal_stock < 0 ? () => addRemark(row.ymd, row.shift,row.model, row.wcno, row.partno,row.cm,title.part_type,row.remark_stauts): () => setOpenDialog(false)} > {row.remark}</td>  */}
                              {row.remark == "" ? <>
                                <td className={` text-left } `}  > -</td> 
                              
                              </> : <>
                              <td className={` text-left } `}  > {row.remark} <br /> <p className="text-[12px]">({row.remark_by} : {row.remark_update})</p> </td> 
                              </>}
                           
                              
                              <td className="text-center">
                                <button onClick={() => findHistory(row.ymd, row.shift, row.wcno, row.partno,row.cm ,row.out_stock, row.shift_lbal_stock)}
                              type="button" className="text-white bg-indigo-500 hover:bg-indigo-700 hover:scale-110 hover:-translate-y-1 transition-all duration-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5">
                              <SearchIcon />    
                            
                            </button></td>
            
            
                             
                            </tr>
                          )) : (
                          <td className="text-lg" colSpan={12}>ไม่พบข้อมูล</td>
                         
                          )}
                          {index != DataInOut.length -1 &&
                                <tr  className="bg-white">
                                <td  colSpan={12} className="diasbleTableLine"></td>
                            </tr>
                          }
                          
                      </>
                         
                             
                        
                         
                          
                  ))}
             
            
              </tbody>
            </table>
        </div>
      )
    }

      </div>
      <RemarkLOG openDialog={openDialog} editRemark={isEdit} onClose={closeDialog} loadData = {SearchData}/>

      <TransectionDialog openDialog={openTransectionDialog}  onClose={closeDialog} Lbal={lbal} out={out} historyPayload={historyPayload} findHistoryReturn={findHistoryReturn} findRemarkPayload = {findRemarkPayload} findTransectionList = {transectionReturnPayload}/>


    </>
  );
}

export default ReportSCR;
