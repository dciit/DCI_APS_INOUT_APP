import React, { useState,useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Button from "@mui/material/Button";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Divider,
} from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import dayjs, { Dayjs } from "dayjs";
import { DateRange } from "@mui/x-date-pickers-pro";
import ChartDataLabels from "chartjs-plugin-datalabels";
import SrvEkb from "../service/reportEKB";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
ChartJS.defaults.font.size = 14;
import SearchIcon from '@mui/icons-material/Search';
import CircularProgress from "@mui/material/CircularProgress";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import BarChartIcon from "@mui/icons-material/BarChart";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import FlagIcon from '@mui/icons-material/Flag';
import { ExportCSV } from "./Excel/ExportToCSV";
import RestoreIcon from "@mui/icons-material/Restore";
import styles from './Report.module.css'
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ResultDayDialog from "./Dialog/ResultDayDialog";


export interface dataIn {
  shiftDate: string;

  wcno: string;
  partNo: string;

  timeRound: string;

  TransType: string;

  totalRound: number;

  createBy: string;
}

export interface dataOut {
  shiftDate: string;

  wcno: string;

  partNo: string;

  cm: string;

  transType: string;

  transQty: number;

  qrCode: string;

  createBy: string;
}

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export interface dateRange {
  stDate: string;
  enDate: string;
}

export interface packPayload {
  stDate: string;
  enDate: string;
  wcno: string;
  partno: string;
}

export interface overAllList {
  stocks: number[];
  inData: number[];
  outData: number[];
  rjData: number[];
  remainData: number[];
}

export interface dataList {
  summaryData: number[];
  roundDeliverlyTime: string;
  type: string;
}

export interface headerTSCCompareData {
  partno: string;
  cm: string;
  detailTSCData: detailTSCCompareData[];
}

export interface detailTSCCompareData {
  tsc_lbal: number;
  tsc_rec: number;
  tsc_iss: number;
  tsc_bal: number;

  ekb_lbal: number;
  ekb_rec: number;
  ekb_iss: number;
  ekb_bal: number;
}

export interface resultAndTarget {
  shiftDate :string;
  wcno: number;
  partDesc: number;
  target: number;
  actual: number;
}

export const options_Day = {
  onHover: (e: any, elements: any) => {
    if (elements.length == 1) console.log(e.native.target.style.cursor);
  },

  plugins: {
    title: {
      display: true,
      text: "ข้อมูล (IN-OUT) DAY",
      font: {
        size: 20,
      },
    },

    datalabels: {
      display: true,
      color: "white",
    },
  },
  responsive: true,
  interaction: {
    mode: "index" as const,
    intersect: false,
  },
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};

export const options_Night = {
  plugins: {
    title: {
      display: true,
      text: "ข้อมูล (IN-OUT) NIGHT",
      font: {
        size: 20,
      },
    },
    datalabels: {
      display: true,
      color: "white",
    },
  },
  responsive: true,
  interaction: {
    mode: "index" as const,
    intersect: false,
  },
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};

export const options_Overall = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      font: {
        size: 20,
      },
      // text: ["OVERALL DAY (D+N)","(" + dayjs(new Date(new Date().getFullYear(), new Date().getMonth(), 1)).format("DD/MM/YYYY") + " - "
      //       + dayjs(new Date()).format("DD/MM/YYYY") +")"],
      text: ["OVERALL DAY (D+N)"],
    },
  },
};

export interface dataInModel {
  shiftDate: string;

  wcno: string;
  partNo: string;

  cm: string;

  timeRound: string;

  transType: string;

  totalRound: number;

  createBy: string;

  shifts: string;
  qrCode: string;
  transQty: number;
}

export interface dataOutModel {
  shiftDate: string;

  wcno: string;

  partNo: string;

  cm: string;

  transType: string;

  transQty: number;
  shifts: string;

  qrCode: string;

  createBy: string;
}

export interface findResultFixDay {
  in:number;
  out:number;
  lbal:number;
  rj:number;
  partno:string
  partDesc:string
  shiftDate:string;
  wcno:string

}

const columnsDataIN = [
  // { id: "shiftDate", label: "วันที่" },
  // { id: "shifts", label: "SHIFT" },
  // { id: "wcno", label: "WCNO" },
  // { id: "partNo", label: "PARTNO" },
  // { id: "timeRound", label: "ช่วงเวลา" },
  // { id: "totalRound", label: "จำนวนทั้งหมด" },
  // { id: "createBy", label: "จ่ายโดย" },
  { id: "shiftDate", label: "วันที่" },
  { id: "shifts", label: "SHIFT" },
  { id: "qrCode", label: "QR-CODE" },
  { id: "wcno", label: "WCNO" },
  { id: "partNo", label: "PARTNO" },
  { id: "transQty", label: "จำนวน" },
  { id: "createBy", label: "จ่ายโดย" },
];

const columnsDataOUT = [
  { id: "shiftDate", label: "วันที่" },
  { id: "shifts", label: "SHIFT" },
  { id: "qrCode", label: "QR-CODE" },
  { id: "wcno", label: "WCNO" },
  { id: "partNo", label: "PARTNO" },
  { id: "transQty", label: "จำนวน" },
  { id: "createBy", label: "ผลิตโดย" },
];


const columnsTargetAndResult = [
  // { id: "wcno", label: "WCNO",classname:"bg-lime-500 text-3xl w-96 text-white text-center" },
  // { id: "desc", label: "PART DESC",classname:"bg-lime-500 text-3xl w-96 text-white text-center" },
  { id: "date", label: "วันที่",classname:"bg-lime-500 text-2xl w-[100px] text-white text-center" },
  { id: "target", label: "Target",classname:"bg-lime-500 text-3xl w-[300px] text-white text-center" },
  { id: "Act", label: "Actual",classname:"bg-lime-500 text-3xl w-[300px] text-white text-center" },
  { id: "status", label: "Status",classname:"bg-lime-500 text-3xl w-[300px]  text-white text-center" },
  { id: "action", label: "Action",classname:"bg-lime-500 text-3xl w-[300px]  text-white text-center" },


];

var randomColorGenerator = function (index: number) {
  return index == 0
    ? "#FF5733"
    : index == 1
    ? "#F00233"
    : index == 2
    ? "#700BF0"
    : index == 3
    ? "#33ACFF"
    : index == 4
    ? "#163372"
    : index == 5
    ? "#BABF07"
    : index == 6
    ? "#BF7107"
    : index == 7
    ? "#EC16FA"
    : index == 8
    ? "#FAA716"
    : "#11A09E";
  return "#" + (Math.random().toString(16) + "0000000").slice(2, 8);
};

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Typography className="mt-5">{children}</Typography>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function Report() {
  const [wcno, setwcno] = useState<string>("308");
  const [partnos, setpartnos] = useState<string[]>([]);
  const [partno, setpartno] = useState<string>("");

  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dateRange, setdateRange] = useState<dateRange>({
    stDate: dayjs(
      new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    ).format("YYYY-MM-DD"),
    enDate: dayjs(new Date()).format("YYYY-MM-DD"),
  });

  const [checkWcno, setcheckWcno] = useState<Boolean>(true);
  // const [checkPartno, setcheckPartno] = useState<Boolean>(true);

  const [dataModelReportDay, setdataModelReportDay] = useState<dataList[]>([]);
  const [dataModelReportNight, setdataModelReportNight] = useState<dataList[]>([]);
  const [dataModelReportOverAll, setdataModelReportOverAll] =useState<overAllList>();
  const [dataModelReportTscCompareData, setdataModelReportTscCompareData] =useState<headerTSCCompareData[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [labelss, setLabelss] = useState<string[]>([]);
  const [dataIN, setdataIN] = useState<dataInModel[]>([]);
  const [dataOut, setdataOUT] = useState<dataOutModel[]>([]);
  const [dataRJ, setdataRJ] = useState<dataInModel[]>([]);
  const [resultTarget,setresultTarget] =useState<resultAndTarget[]>([])
  const [resultFindResult,setresultFindResult] = useState<findResultFixDay[]>([])
  const [resultFindResultFixDay,setresultFindResultFixDay] = useState<findResultFixDay[]>([])
  const [Actual,setActual] = useState<string>("")
  const [monthName] = useState<string[]>([
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฏาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พศจิกายน",
    "ธันวาคม",
  ]);

  const [lineName,setlinename] = useState<string>("")


  useEffect(() => {
    if(wcno == "306"){
      setlinename("CRANK SHAFT")
    }else if(wcno == "308"){
      setlinename("FRONT HEAD")
    }else if(wcno == "309"){
      setlinename("REAR HEAD")
    }else if(wcno == "310"){
      setlinename("CYLINDER")
    }else if(wcno == "312"){
      setlinename("PISTION")
    }else if(wcno == "314"){
      setlinename("MIDDLE PLATE")
    }
  }, [])
  

  let isData: any;
  const [value] = useState<DateRange<Dayjs>>([
    // null,
    // null,
    dayjs(new Date(new Date().getFullYear(), new Date().getMonth(), 1)),
    dayjs(new Date()),
  ]);

  const [Tabvalue, setTabValue] = React.useState(0);




  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const closeDialog = () => {
    setOpenDialog(false);
  };



  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [loadAPI, setloadAPI] = useState<boolean>(false);

  // @ts-ignore
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null,newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChange = (event: SelectChangeEvent<typeof wcno>) => {
    setwcno(event.target.value);
    if(event.target.value == "306"){
        setlinename("CRANK SHAFT")
    }else if(event.target.value == "308"){
      setlinename("FRONT HEAD")
    }else if(event.target.value == "309"){
      setlinename("REAR HEAD")
    }else if(event.target.value == "310"){
      setlinename("CYLINDER")
    }else if(event.target.value == "312"){
      setlinename("PISTION")
    }else if(event.target.value == "314"){
      setlinename("MIDDLE PLATE")
    }
    setcheckWcno(true);
  };

  const handleChangePartno = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setpartno(event.target.value);

    fetchChartOverAllByWcno(event.target.value);

    //   async function fetchChartOverAll() {
    //     let rLabelOverAll: string[] = [];
    //     let payload:packPayload = {
    //       stDate: dayjs(dateRange?.stDate).format("YYYY-MM-DD"),
    //       enDate: dayjs(dateRange?.enDate).format("YYYY-MM-DD"),
    //       wcno
    //     }
    //     const res: any = await SrvEkb.getReportOverAll(
    //       payload
    //     );
    //     try {
    //       setdataModelReportOverAll(res.dataListOverAll);

    //       res.dateSearchOverAll.forEach((element: any) => {
    //         rLabelOverAll.push(element.date + " (" + element.partNo + ")");
    //       });
    //       setLabels(rLabelOverAll);
    //     } catch (error) {
    //       console.log(error);
    //     }

    //   //setcheckPartno(true);
    // };
  };
  const searchDatepicker = (data: any) => {
    setdateRange({
      stDate: dayjs(data[0]).format("YYYY-MM-DD"),
      enDate: dayjs(data[1]).format("YYYY-MM-DD"),
    });
  };

  const SubmitButton: React.FC = () => {
    if (checkWcno) {
      return (
        <Button
          className="w-36 h-14 text-base"
          type="submit"
          variant="contained"
          endIcon={<SearchIcon />}
        >
          ค้นหา
        </Button>
      );
    } else {
      return (
        <Button
          type="submit"
          variant="contained"
          endIcon={<SearchIcon />}
          sx={{ width: "150px", height: "50px", padding: "28px" }}
          disabled
        >
          ค้นหา
        </Button>
      );
    }
  };

  const searchData = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setloadAPI(true);
    fetchPartno(wcno);
    fetchChartDay();
    fetchChartNight();
    fetchChartOverAll();
    fetchTSCCompateData();
    fetchDataIn(wcno,dayjs(dateRange?.stDate).format("YYYY-MM-DD"),dayjs(dateRange?.enDate).format("YYYY-MM-DD"));
    fetchDataResultTarget()

   
  
  };

  const BarChartDay: React.FC = () => {
    var dataset: any = [];
    {
      dataModelReportDay.map((dayDataList, i) => {
        dataset.push({
          label: dayDataList.roundDeliverlyTime,
          data: dayDataList.summaryData,
          backgroundColor: randomColorGenerator(i),
          stack: dayDataList.type,
        });
      });
    }
    isData = {
      labels,
      datasets: dataset,
    };
    return (
      <Bar options={options_Day} data={isData} plugins={[ChartDataLabels]} />
    );
  };

  const BarChartNight: React.FC = () => {
    var dataset: any = [];
    {
      dataModelReportNight.map((dayDataList, i) => {
        dataset.push({
          label: dayDataList.roundDeliverlyTime,
          data: dayDataList.summaryData,
          backgroundColor: randomColorGenerator(i),
          stack: dayDataList.type,
        });
      });
    }
    isData = {
      labels,
      datasets: dataset,
    };
    return (
      <Bar options={options_Night} data={isData} plugins={[ChartDataLabels]} />
    );
  };

  const BarChartOverAll: React.FC = () => {
    // labelss.push("STOCK")
    // dataModelReportOverAll?.stocks.push(1000)

    const data = {
      labels: labelss,
      datasets: [
        {
          label:
            "STOCK ENDING " +
            dayjs(dateRange?.stDate).format("DD/MM/YYYY") +
            " - " +
            dayjs(dateRange?.enDate).format("DD/MM/YYYY"),
          data: dataModelReportOverAll?.stocks,
          backgroundColor: "yellow",
        },
        {
          label: "IN (PS)",
          data: dataModelReportOverAll?.inData,
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
        {
          label: "OUT (PD)",
          data: dataModelReportOverAll?.outData,
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },

        {
          label: "RJ",
          data: dataModelReportOverAll?.rjData,
          backgroundColor: "rgba(245, 144, 39, 0.8)",
        },
        {
          label: "REMAIN (IN-OUT)",
          data: dataModelReportOverAll?.remainData,
          backgroundColor: "rgba(53, 162, 25, 0.5)",
        },
      ],
    };

    return (
      <Bar options={options_Overall} data={data} plugins={[ChartDataLabels]} />
    );
  };

  async function fetchPartno(wcno: string) {
    const res: any = await SrvEkb.getPartnoByWCNO(wcno);
    try {
      setpartnos(res);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchChartDay() {
    let rLabel: string[] = [];
    let payload: packPayload = {
      stDate: dayjs(dateRange?.stDate).format("YYYY-MM-DD"),
      enDate: dayjs(dateRange?.enDate).format("YYYY-MM-DD"),
      wcno,
      partno,
    };
    const res: any = await SrvEkb.getReportDay(payload);
    try {
      setdataModelReportDay(res.dataListDay);

      res.dateSearchListDay.forEach((element: any) => {
        rLabel.push(
          dayjs(element.date).format("DD/MM/YYYY") + " (" + element.partNo + ")"
        );
      });
      setLabels(rLabel);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchChartNight() {
    let rLabel: string[] = [];
    let payload: packPayload = {
      stDate: dayjs(dateRange?.stDate).format("YYYY-MM-DD"),
      enDate: dayjs(dateRange?.enDate).format("YYYY-MM-DD"),
      wcno,
      partno,
    };
    const res: any = await SrvEkb.getReportNight(payload);
    try {
      setdataModelReportNight(res.dataListNight);

      res.dateSearchListNight.forEach((element: any) => {
        rLabel.push(
          dayjs(element.date).format("DD/MM/YYYY") + " (" + element.partNo + ")"
        );
      });
      setLabels(rLabel);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchTSCCompateData() {
    const res: any = await SrvEkb.getReportTSCCompareData(
      wcno,
      Number(dayjs(dateRange?.stDate).format("YYYYMM"))
    );
    try {
      setdataModelReportTscCompareData(res.headerTSCCompareData);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchChartOverAll() {
    let rLabelOverAll: string[] = [];
    let payload: packPayload = {
      stDate: dayjs(dateRange?.stDate).format("YYYY-MM-DD"),
      enDate: dayjs(dateRange?.enDate).format("YYYY-MM-DD"),
      wcno,
      partno,
    };
    const res: any = await SrvEkb.getReportOverAll(payload);
    try {
      setdataModelReportOverAll(res.dataListOverAll);

      res.dateSearchOverAll.forEach((element: any) => {
        rLabelOverAll.push(dayjs(element.date).format("DD/MM/YYYY") );
      });

      setLabelss(rLabelOverAll);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchChartOverAllByWcno(partno: string) {
    let rLabelOverAll: string[] = [];
    let payload: packPayload = {
      stDate: dayjs(dateRange?.stDate).format("YYYY-MM-DD"),
      enDate: dayjs(dateRange?.enDate).format("YYYY-MM-DD"),
      wcno,
      partno,
    };
    const res: any = await SrvEkb.getReportOverAllByWcno(payload);
    try {
      setdataModelReportOverAll(res.dataListOverAll);

      res.dateSearchOverAll.forEach((element: any) => {
        rLabelOverAll.push(dayjs(element.date).format("DD/MM/YYYY"));
      });
      setLabelss(rLabelOverAll);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchDataIn(wcno: string, stDate: string, enDate: string) {
    const res: any = await SrvEkb.getReportData(wcno, stDate, enDate);
    try {
      setdataIN(res.dataIN);
      setdataOUT(res.dataOut)
      setdataRJ(res.dataRJ)
    } catch (error) {
      console.log(error);
    }
  }

  // async function fetchDataOut(wcno: string, stDate: string, enDate: string) {
  //   const res: any = await SrvEkb.getReportDataOut(wcno, stDate, enDate);
  //   try {
  //     setdataOUT(res.dataOut);
  //     setloadAPI(false);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // async function fetchDataRJ(wcno: string, stDate: string, enDate: string) {
  //   const res: any = await SrvEkb.getReportDataRJ(wcno, stDate, enDate);
  //   try {
  //     setdataRJ(res.dataRJ);
  //     setloadAPI(false);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }


  async function fetchDataResultTarget() {

    let payload: packPayload = {
      stDate: dayjs(dateRange?.stDate).format("YYYY-MM-DD"),
      enDate: dayjs(dateRange?.enDate).format("YYYY-MM-DD"),
      wcno,
      partno,
    };

    const res: any = await SrvEkb.getReportResultTarget(payload);
    try {
      setresultTarget(res.resultsAllTarget);
      setresultFindResult(res._findDayOfResultAndTargetList)
      setresultFindResultFixDay(res._findDayOfResultAndTargetList)
      setloadAPI(false);
    } catch (error) {
      console.log(error);
    }
  }


  const TabhandleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(event);
    setTabValue(newValue);
  };


  const findDay = (shiftDate:string,actual:string) =>{
     
      setOpenDialog(true);
      setresultFindResultFixDay(resultFindResult.filter(x=>dayjs(x.shiftDate).format("DD/MM/YYYY") == shiftDate))
      setActual(actual)
  }

  return (
    <>
      {/* {JSON.stringify(dataModelReportTscCompareData)} */}
      {/* {JSON.stringify(dayjs(new Date(new Date().getFullYear(), new Date().getMonth(), 12)))} */}
      <Typography className="bg-black text-[#F5F5F5]" variant="h3">
        E-KANBAN MONITORING REPORT
      </Typography>
      <Card className="bg-white mt-7 rounded-md">
        <Box className="titleBox">
          <CardContent>
            <form onSubmit={searchData}>
              <Grid container spacing={2}>
                <Grid className="text-left" item xs={12} md={3} xl={2}>
                  <FormControl className="m-2 min-w-[60%]">
                    <InputLabel id="demo-controlled-open-select-label">
                      WCNO
                    </InputLabel>
                    <Select
                      labelId="demo-controlled-open-select-label"
                      id="demo-controlled-open-select"
                      open={open}
                      onClose={handleClose}
                      onOpen={handleOpen}
                      value={wcno}
                      onChange={handleChange}
                    >
                      <MenuItem value={"306"}>306</MenuItem>
                      <MenuItem value={"308"}>308</MenuItem>
                      <MenuItem value={"309"}>309</MenuItem>
                      <MenuItem value={"310"}>310</MenuItem>
                      <MenuItem value={"312"}>312</MenuItem>
                      <MenuItem value={"314"}>314</MenuItem>
                   
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={8} xl={8}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DateRangePicker"]}>
                      <DateRangePicker
                        localeText={{ start: "Due-start", end: "Due-end" }}
                        value={value}
                        onChange={(dataValue) => searchDatepicker(dataValue)}
                        disableFuture
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} md={2} xl={2} className="text-left p-6">
                  <SubmitButton />
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Box>
      </Card>
      <br />

      <Card>
        <CardContent>
          <Tabs
            value={Tabvalue}
            onChange={TabhandleChange}
            aria-label="icon label tabs example"
            className="box-tabs"
          >
            <Tab
              icon={<BarChartIcon className="text-4xl" />}
              label="กราฟ monitor"
              className="text-lg"
              {...a11yProps(0)}
            />
            <Tab
              icon={<LocalShippingIcon  className="text-4xl" />}
              label="การรับเข้า"
              className="text-lg"
              {...a11yProps(1)}
            />
            <Tab
              icon={<PrecisionManufacturingIcon className="text-4xl" />}
              label="การผลิต"
              className="text-lg"
              {...a11yProps(2)}
            />
            <Tab
              icon={<RestoreIcon className="text-4xl" />}
              label="การคืน PART (RJ)"
              className="text-lg"
              {...a11yProps(3)}
            />
            <Tab
              icon={<FlagIcon className="text-4xl" />}
              label="Target and Result"
              className="text-lg"
              {...a11yProps(4)}
            />
          </Tabs>
        </CardContent>
      </Card>

      {loadAPI ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          marginTop={10}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <CustomTabPanel value={Tabvalue} index={0}>
             <Card className="bg-white rounded-md mt-5">
              <Box className="titleBox">
                <CardContent>
                  <BarChartDay />
                </CardContent>
              </Box>
            </Card> 

            <Card className="bg-white rounded-md mt-5">
              <Box className="titleBox">
                <CardContent>
                  <BarChartNight />
                </CardContent>
              </Box>
            </Card> 

            <Card className="bg-white rounded-md mt-5">
              <Box className="titleBox">
                <CardContent>
                  <BarChartOverAll />
                </CardContent>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={10} md={3}>
                  <select
                    className="w-64 h-8 bg-lime-400 mb-5 text-lg"
                    onChange={handleChangePartno}
                    placeholder="PARTNO"
                  >
                    {partnos?.map((pt,index) => (
                      <option key={index} value={pt}>{pt}</option>
                    ))}
                  </select>
                </Grid>
                <Grid item xs={4}></Grid>
                <Grid item xs={4}></Grid>
              </Grid>
            </Card>

            {dataModelReportTscCompareData?.map((tsc, index) => (
              <Card className="mt-5 bg-blue-50 p-2" key={index}>
                <Typography className="text-right" variant="body1">
                  {dayjs(dateRange?.stDate).format("DD/MM/YYYY")} -{" "}
                  {dayjs(dateRange?.enDate).format("DD/MM/YYYY")}
                </Typography>
                <Typography variant="h4">
                  {tsc?.partno} -{tsc?.cm}
                </Typography>
                <CardContent>
                  {tsc.detailTSCData?.map((detail) => (
                    <Grid container spacing={10}>
                      <Grid item xs={12} md={6}>
                        <Box className="bg-blue-600 text-white">
                          <Typography variant="h4">
                            TSC ALPHA (RM+WIP)
                          </Typography>
                          <Typography
                            className="bg-blue-600 inline-block"
                            variant="h6"
                          >
                            ยอดประจำเดือน
                          </Typography>
                          <Typography
                            className="text-red-500 inline-block"
                            variant="h6"
                          >
                            &nbsp;
                            {
                              monthName[
                                Number(dayjs(dateRange?.stDate).format("MM")) -
                                  1
                              ]
                            }
                          </Typography>
                        </Box>

                        <Grid container spacing={0}>
                          <Grid item xs={8}>
                            <Card>
                              <Box className="bg-blue-300">
                                <Typography
                                  className="text-left p-4"
                                  variant="h5"
                                >
                                  (A) LWBAL (ยอดยกมา)
                                </Typography>
                                <Divider />
                              </Box>
                              <Box className="bg-blue-300">
                                <Typography
                                  className="text-left p-4"
                                  variant="h5"
                                >
                                  (B) REC (PartSupply){" "}
                                </Typography>
                                <Divider />
                              </Box>
                              <Box className="bg-blue-300">
                                <Typography
                                  className="text-left p-4"
                                  variant="h5"
                                >
                                  (C) ISS (Production)
                                </Typography>
                                <Divider />
                              </Box>
                              <Box className="bg-blue-300">
                                <Typography
                                  className="text-left p-4"
                                  variant="h5"
                                >
                                  (D) BAL (Remain) [(A+B)-C]
                                </Typography>
                                <Divider />
                              </Box>
                            </Card>
                          </Grid>
                          <Grid item xs={4}>
                            <Card>
                              <Box className="bg-blue-200">
                                <Typography
                                  className="text-right p-4"
                                  variant="h5"
                                >
                                  {detail.tsc_lbal?.toLocaleString("en")}
                                </Typography>
                                <Divider />
                              </Box>
                              <Box className="bg-blue-200">
                                <Typography
                                  className="text-right p-4"
                                  variant="h5"
                                >
                                  {detail.tsc_rec?.toLocaleString("en")}
                                </Typography>
                                <Divider />
                              </Box>
                              <Box className="bg-blue-200">
                                <Typography
                                  className="text-right p-4"
                                  variant="h5"
                                >
                                  {detail.tsc_iss?.toLocaleString("en")}
                                </Typography>
                                <Divider />
                              </Box>
                              <Box className="bg-blue-200">
                                <Typography
                                  className="text-right p-4"
                                  variant="h5"
                                >
                                  {detail.tsc_bal?.toLocaleString("en")}
                                </Typography>
                                <Divider />
                              </Box>
                            </Card>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Box className="bg-blue-600 text-white">
                          <Typography variant="h4">
                            หัว LINE MACHINE (RM Only)
                          </Typography>
                          <Typography
                            className="bg-blue-600 inline-block"
                            variant="h6"
                          >
                            (ยอดประจำเดือน
                            <Typography
                              className="text-red-500 inline-block"
                              variant="h6"
                            >
                              &nbsp;{monthName[dayjs(new Date()).month()]}
                            </Typography>
                            {/* <Typography className="bg-blue-600 text-red-500 inline-block" variant="h6" >&nbsp;{dayjs(new Date()).format("DD/MM/YYYY")}</Typography> */}
                            {/* <Typography className="bg-blue-600 text-red-500 inline-block" variant="h6" >&nbsp;{dayjs(new Date(new Date().getFullYear(), new Date().getMonth(), 1)).format("DD/MM/YYYY")}</Typography> */}
                            )
                          </Typography>
                        </Box>

                        <Grid container spacing={0}>
                          <Grid item xs={8}>
                            <Card>
                              <Box className="bg-blue-300">
                                <Typography
                                  className="text-left p-4"
                                  variant="h5"
                                >
                                  A ยอดยกมา
                                </Typography>
                                <Divider />
                              </Box>
                              <Box className="bg-blue-300">
                                <Typography
                                  className="text-left p-4"
                                  variant="h5"
                                >
                                  B รับเข้า (PD)
                                </Typography>
                                <Divider />
                              </Box>
                              <Box className="bg-blue-300">
                                <Typography
                                  className="text-left p-4"
                                  variant="h5"
                                >
                                  C ผลิตแล้ว (PD)
                                </Typography>
                                <Divider />
                              </Box>
                              <Box className="bg-blue-300">
                                <Typography
                                  className="text-left p-4"
                                  variant="h5"
                                >
                                  D คงเหลือ [(A+B)-C]
                                </Typography>
                                <Divider />
                              </Box>
                            </Card>
                          </Grid>
                          <Grid item xs={4}>
                            <Card>
                              <Box className="bg-blue-200">
                                <Typography
                                  className="text-right p-4"
                                  variant="h5"
                                >
                                  {detail.ekb_lbal?.toLocaleString("en")}
                                </Typography>
                                <Divider />
                              </Box>
                              <Box className="bg-blue-200">
                                <Typography
                                  className="text-right p-4"
                                  variant="h5"
                                >
                                  {detail.ekb_rec?.toLocaleString("en")}
                                </Typography>
                                <Divider />
                              </Box>
                              <Box className="bg-blue-200">
                                <Typography
                                  className="text-right p-4"
                                  variant="h5"
                                >
                                  {detail.ekb_iss?.toLocaleString("en")}
                                </Typography>
                                <Divider />
                              </Box>
                              <Box className="bg-blue-200">
                                <Typography
                                  className="text-right p-4"
                                  variant="h5"
                                >
                                  {detail.ekb_bal?.toLocaleString("en")}
                                </Typography>
                                <Divider />
                              </Box>
                            </Card>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  ))}
                </CardContent>
              </Card>
            ))}
          </CustomTabPanel>
          <CustomTabPanel value={Tabvalue} index={1}>
            <Grid container spacing={10}>
              <Grid item xs={12} md={3}></Grid>

              <Grid item xs={12} md={6}></Grid>

              <Grid item xs={12} md={3}>
                <Typography className="text-right mt-5">
                  <ExportCSV csvData={dataIN} fileName="dataIN" />
                </Typography>
              </Grid>
            </Grid>
            <Paper sx={{ width: "100%", overflow: "auto", marginTop: 2 }}>
              <TableContainer sx={{ maxHeight: 1000 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {columnsDataIN.map((column, index) => (
                        <TableCell key={index} style={{ fontWeight: "bold" }}>
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dataIN
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, index) => (
                        <TableRow
                          key={index}
                          // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                        >
                          <TableCell>
                            {row.shiftDate}
                          </TableCell>
                          <TableCell>{row.shifts}</TableCell>
                          <TableCell> {row.qrCode}</TableCell>
                          <TableCell>{row.wcno}</TableCell>
                          <TableCell>
                            {row.partNo} {row.cm}
                          </TableCell>
                          {/* <TableCell>{row.timeRound}</TableCell>
                          <TableCell>{row.totalRound}</TableCell> */}
                          <TableCell> {row.transQty}</TableCell>
                          <TableCell>{row.createBy}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={dataIN.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>

            {/* <div >
              <table  ref={tableRefDataIn}>

               <tbody>
                  <tr>
                      <th>Firstname</th>
                      <th>Lastname</th>
                      <th>Age</th>
                      <th>Age</th>
                      <th>Age</th>
                      <th>Age</th>
                      <th>Age</th>
                  </tr>
                  
              { exportDataIn.dataIn && exportDataIn.dataIn
                  
                  .map((row:any, index:number) => (
                    <tr
                      key={index}
                      // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                            
                          <td>{row.shiftDate}</td>
                          <td>{row.shifts}</td>
                          <td>{row.wcno}</td>
                          <td>{row.partNo} {row.cm}</td>                        
                          <td>{row.timeRound}</td>
                          <td>{row.totalRound}</td>
                          <td>{row.createBy}</td>
                    </tr>
                  ))}
               
                </tbody>
              </table>

        </div> */}
          </CustomTabPanel>
          <CustomTabPanel value={Tabvalue} index={2}>
            <Grid container spacing={10}>
              <Grid item xs={12} md={3}></Grid>

              <Grid item xs={12} md={6}></Grid>

              <Grid item xs={12} md={3}>
                <Typography className="text-right mt-5">
                  <ExportCSV csvData={dataOut} fileName="dataOUT" />
                </Typography>
              </Grid>
            </Grid>
            <Paper sx={{ width: "100%", overflow: "auto", marginTop: 2 }}>
              <TableContainer sx={{ maxHeight: 1000 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {columnsDataOUT.map((column, index) => (
                        <TableCell key={index} style={{ fontWeight: "bold" }}>
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dataOut
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {row.shiftDate}
                          </TableCell>
                          <TableCell>{row.shifts}</TableCell>
                          <TableCell> {row.qrCode}</TableCell>
                          <TableCell>{row.wcno}</TableCell>
                          <TableCell>{row.partNo} {row.cm}</TableCell>
                          <TableCell> {row.transQty}</TableCell>
                          <TableCell> {row.createBy}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={dataOut.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </CustomTabPanel>
          <CustomTabPanel value={Tabvalue} index={3}>

      
            <Grid container spacing={10}>
              <Grid item xs={12} md={3}></Grid>

              <Grid item xs={12} md={6}></Grid>

              <Grid item xs={12} md={3}>
                <Typography className="text-right mt-5">
                  <ExportCSV csvData={dataRJ} fileName="dataRJ" />
                </Typography>
              </Grid>
            </Grid>
            <Paper sx={{ width: "100%", overflow: "auto", marginTop: 2 }}>
              <TableContainer sx={{ maxHeight: 1000 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {columnsDataOUT.map((column, index) => (
                        <TableCell key={index} style={{ fontWeight: "bold" }}>
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dataRJ
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {row.shiftDate}
                          </TableCell>
                          <TableCell>{row.shifts}</TableCell>
                          <TableCell> {row.qrCode}</TableCell>
                          <TableCell>{row.wcno}</TableCell>
                          <TableCell>
                            {row.partNo} {row.cm}
                          </TableCell>
                          <TableCell> {row.transQty}</TableCell>
                          <TableCell> {row.createBy}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={dataRJ.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </CustomTabPanel>

          <CustomTabPanel value={Tabvalue} index={4}>
          <div className="bg-teal-700 text-white text-3xl p-3 rounded-md">{wcno} {lineName}</div>

            <Paper sx={{ width: "auto", overflow: "auto", marginTop: 2 }}>

              <TableContainer sx={{ maxHeight: 1000 }} >
                <Table stickyHeader aria-label="sticky table" className={styles.tbMainTarget}>
                  <TableHead >
                    <TableRow>
                      {columnsTargetAndResult.map((column, index) => (
                        <TableCell key={index} className={column.classname} >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {resultTarget
                     
                      .map((row, index) => (
                        <TableRow key={index}>
                          <TableCell className="text-xl bg-lime-50 text-left">{row.shiftDate}</TableCell>
                          <TableCell className="text-xl bg-lime-50 text-center">{row.target.toLocaleString("en-Us")}</TableCell>
                          <TableCell className="text-xl bg-lime-50 text-center"> {row.actual.toLocaleString("en-Us")} </TableCell>
                          <TableCell className={row.actual > row.target ? "text-white text-xl bg-red-500 text-center":"text-xl bg-green-300 text-center"}>{row.actual > row.target ? "OVER TARGET" : "MIN TARTGET"}</TableCell>
                          <TableCell className="text-xl bg-lime-50 text-center"><Button onClick={() => findDay(row.shiftDate,row.actual.toLocaleString("en-Us"))} variant="contained" color="info" className="text-lg" startIcon={<SearchIcon className="text-3xl"/>}>รายละเอียด</Button></TableCell>
                        </TableRow>
                   
                       ))}
                  </TableBody>
                </Table>
              </TableContainer>
             
            </Paper>
          </CustomTabPanel>
           {/* {JSON.stringify(resultFindResultFixDay)} */}
          <ResultDayDialog openDialog={openDialog} onClose={closeDialog} payload={resultFindResultFixDay} actual={Actual}/>
        </>
      )}
    </>
  );
}

export default Report;
