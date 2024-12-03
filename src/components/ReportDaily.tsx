import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Divider,
  Button,
  
} from "@mui/material";
import Menu from "@mui/material/Menu";

import ChartDataLabels from "chartjs-plugin-datalabels";
import SrvEKBDaily from "../service/reportEKB_Daily";
import SrvEKB from "../service/reportEKB";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
ChartJS.defaults.font.size = 14;

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
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
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
import BarChartIcon from "@mui/icons-material/BarChart";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import { ExportCSV } from "./Excel/ExportToCSV";
import MenuItem from "@mui/material/MenuItem";
import RestoreIcon from "@mui/icons-material/Restore";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FlagIcon from '@mui/icons-material/Flag';
import styles from './Report.module.css'
import Search from "@mui/icons-material/Search";
import ResultDayDialog from "./Dialog/ResultDayDialog";

export interface dateRange {
  stDate: string;
  enDate: string;
}

export interface packPayload {
  searchDate:string;
  wcno: string;
  partNo:string
}

export interface packPayloadResult {
  searchDate:string
  wcno:string

}

export interface overAllList {
  stocks: number[];
  inData: number[];
  outData: number[];
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

export interface dataInModel {
  shiftDate: string;

  wcno: string;
  partNo: string;

  cm: string;

  qrCode:string

  timeRound: string;

  transType: string;

  transQty: number;

  totalRound: number;

  createBy: string;

  shifts: string;
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

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export interface resultAndTarget {
  shiftDate :string;
  wcno: string;
  partDesc: number;
  target: number;
  actual: number;
}


const columnsDataIN = [
  { id: "shiftDate", label: "วันที่" },
  { id: "shifts", label: "SHIFT" },
  { id: "qrcode", label: "QR-CODE" },
  { id: "wcno", label: "WCNO" },
  { id: "partNo", label: "PARTNO" },
  { id: "totalRound", label: "จำนวน" },
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

export const options_Day = {
  // onHover: (e:any, elements:any) => {
  //   if(elements.length == 1)
  //     console.log(e.native.target.style.cursor)
  //   },

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
      text: [
        "ข้อมูล OVERALL DAY (D+N)",
        "(" +
          dayjs(
            new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          ).format("DD/MM/YYYY") +
          " - " +
          dayjs(new Date()).format("DD/MM/YYYY") +
          ")",
      ],
    },
  },
};



export interface findDailyOfResultAndTargets{
  in:number;
  out:number;
  lbal:number;
  rj:number;
  partno:string
  partDesc:string
  shiftDate:string;
  wcno:string
}

var randomColorGenerator = function () {
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

const columnsTargetAndResult = [

  { id: "WCNO", label: "WCNO",classname:"bg-lime-500 text-2xl w-[100px] text-white text-center" },
  { id: "PART DESC", label: "PART DESC",classname:"bg-lime-500 text-3xl w-[300px] text-white text-center" },
  { id: "Target", label: "Target",classname:"bg-lime-500 text-3xl w-[300px] text-white text-center" },
  { id: "Result", label: "Result",classname:"bg-lime-500 text-3xl w-[300px]  text-white text-center" },
  { id: "Status", label: "Status",classname:"bg-lime-500 text-3xl w-[300px]  text-white text-center" },
  { id: "Action", label: "Action",classname:"bg-lime-500 text-3xl w-[300px]  text-white text-center" },



];

function ReportDaily() {
  const [partnos, setpartnos] = useState<string[]>([]);
  const [labelss, setLabelss] = useState<string[]>([]);
  const [dataModelReportDay, setdataModelReportDay] = useState<dataList[]>([]);
  const [dataModelReportNight, setdataModelReportNight] = useState<dataList[]>([]);
  const [dataModelReportOverAll, setdataModelReportOverAll] =useState<overAllList>();

  const [dataModelReportTscCompareData, setdataModelReportTscCompareData] = useState<headerTSCCompareData[]>([]);

  const [dataIN, setdataIN] = useState<dataInModel[]>([]);
  const [dataRJ, setdataRJ] = useState<dataInModel[]>([]);

  // const [searchDataTableDataIN, setsearchDataTableDataIN] = useState<dataInModel[]>([]);

  const [dataOut, setdataOUT] = useState<dataOutModel[]>([]);
  // const [searchDataTableDataOUT, setsearchDataTableDataOUT] = useState<dataOutModel[]>([]);

  const [labels, setLabels] = useState<string[]>([]);
  const [Tabvalue, setTabValue] = React.useState(0);

  const { searchDate } = useParams<string>();
  const [selectWCNO, setselectWCNO] = useState<boolean>(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

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

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null,newPage: number) => {
    console.log(event);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  let isData: any;
  const navigate = useNavigate();
  const { wcno } = useParams<string>();
  const [lineName,setlinename] = useState<string>("");

  const [resultTarget,setresultTarget] =useState<resultAndTarget[]>([])
  const [FindDailyByWCNO,setFindDailyByWCNO] =useState<findDailyOfResultAndTargets[]>([])
  const [resultFindResultFixDay,setresultFindResultFixDay] =useState<findDailyOfResultAndTargets[]>([])

  const [openDialog, setOpenDialog] = useState(false);
  const [Actual,setActual] = useState<string>("")

  const [loadAPI, setloadAPI] = useState<boolean>(false);



  useEffect(() => {

    if (wcno == "306") {
      setlinename("CRANK SHAFT")
    } else if (wcno == "308") {
      setlinename("FRONT HEAD")    
    } else if (wcno == "309") {
      setlinename("REAR HEAD")
    } else if (wcno == "310") {
      setlinename("CYLINDER")
    } else if (wcno == "312") {
      setlinename("PISTION")
    } else if (wcno == "314") {
      setlinename("MIDDLE PLATE")
    }

    setloadAPI(true)
    fetchPartno(wcno);
    fetchDataIn(wcno, searchDate);
    fetchChartDay(wcno, searchDate);
    fetchChartNight(wcno, searchDate);
    fetchChartOverAll(wcno, searchDate);
    fetchTSCCompateData(wcno, searchDate);
    fetchDataResultTarget(wcno,searchDate)

  }, [selectWCNO]);

  const BarChartDay: React.FC = () => {
    var dataset: any = [];
    {
      dataModelReportDay.map((dayDataList) => {
        dataset.push({
          label: dayDataList.roundDeliverlyTime,
          data: dayDataList.summaryData,
          backgroundColor: randomColorGenerator(),
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
      dataModelReportNight.map((dayDataList) => {
        dataset.push({
          label: dayDataList.roundDeliverlyTime,
          data: dayDataList.summaryData,
          backgroundColor: randomColorGenerator(),
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
    const data = {
      labels: labelss,

      datasets: [
        {
          label:
            "STOCK ENDING " +
            dayjs(new Date().setMonth(new Date().getMonth() - 1)).format(
              "YYYYMM"
            ),
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

  async function fetchPartno(wcno: any) {
    const res: any = await SrvEKB.getPartnoByWCNO(wcno);
    try {
      setpartnos(res);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchChartDay(wcno: any, searchDate: any) {
    let rLabel: string[] = [];

    const res: any = await SrvEKBDaily.getReportDay(wcno, searchDate);
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

  async function fetchChartNight(wcno: any, searchDate: any) {
    let rLabel: string[] = [];

    const res: any = await SrvEKBDaily.getReportNight(wcno, searchDate);
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

  async function fetchTSCCompateData(wcno: any, searchDate: any) {
    const res: any = await SrvEKBDaily.getReportTSCCompareData(
      wcno,
      searchDate
    );
    try {
      console.log(res.headerTSCCompareData);
      setdataModelReportTscCompareData(res.headerTSCCompareData);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchChartOverAll(wcno: any, searchDate: any) {
    let rLabelOverAll: string[] = [];

    const res: any = await SrvEKBDaily.getReportOverAll(wcno, searchDate);
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

  async function fetchChartOverAllByWcno(searchDate:any,wcno:any,partNo: string) {
    let rLabelOverAll: string[] = [];
    let payload:packPayload = {
      searchDate,
      wcno,
      partNo
    }
    const res: any = await SrvEKBDaily.getReportOverAllByWcno(payload);
    try {
      setdataModelReportOverAll(res.dataListOverAll);
      // แสดง partno ด้วย เช่น 2024-03-11 2PD040611-1
      // res.dateSearchOverAll.forEach((element: any) => {
      //   rLabelOverAll.push(element.date + " (" + element.partNo + ")");
      // });

      res.dateSearchOverAll.forEach((element: any) => {
        rLabelOverAll.push(element.date);
      });
      setLabelss(rLabelOverAll);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchDataIn(wcno: any, searchDate: any) {
    const res: any = await SrvEKBDaily.getReportData(wcno, searchDate);
    try {
      setdataIN(res.dataIN);
      setdataOUT(res.dataOut);
      setdataRJ(res.dataRJ)

    } catch (error) {
      console.log(error);
    }
  }


  async function fetchDataResultTarget(wcno:any,searchDate:any) {

    let payload: packPayloadResult = {
      searchDate,
      wcno,
    };

    const res: any = await SrvEKBDaily.getReportResultTarget(payload);
    try {
      console.log(res.resultsAllTarget)
      setresultTarget(res.resultsAllTarget);
      setFindDailyByWCNO(res.findPartnoByWCNO)
      setloadAPI(false);
    } catch (error) {
      console.log(error);
    }
  }


  const TabhandleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(event);
    setTabValue(newValue);
  };

  
  const findDay = (wcno:string,actual:string) =>{
    setOpenDialog(true);
    setresultFindResultFixDay(FindDailyByWCNO.filter(x=>x.wcno === wcno))
    setActual(actual)
}

const closeDialog = () => {
  setOpenDialog(false);
};


  // const filterDataTableIn = (
  //   event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  // ) => {
  //   const company = searchDataTableDataIN.map((com: dataInModel) => {
  //     return com;
  //   });
  //   const filteredRows = company.filter((row: dataInModel) => {
  //     return row.wcno.toLowerCase().includes(event.target.value);
  //   });
  //   setdataIN(filteredRows);
  // };

  const handleChangePartno = (event: React.ChangeEvent<HTMLSelectElement>) => {
    //setpartno(event.target.value);

    fetchChartOverAllByWcno(searchDate,wcno, event.target.value);
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const routePage = (path: string) => {
    if (path == "306") {
      setlinename("CRANK SHAFT")
    } else if (path == "308") {
      setlinename("FRONT HEAD")    
    } else if (path == "309") {
      setlinename("REAR HEAD")
    } else if (path == "310") {
      setlinename("CYLINDER")
    } else if (path == "312") {
      setlinename("PISTION")
    } else if (path == "314") {
      setlinename("MIDDLE PLATE")
    }
    navigate(`/EkbReportApp/search/${path}/${searchDate}`);

    setselectWCNO(!selectWCNO);
    setAnchorEl(null);
  };

  return (
    <>
      {/* {JSON.stringify(dataModelReportTscCompareData)} */}
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        // PaperProps={{
        //   style: {
        //     maxHeight: ITEM_HEIGHT * 4.5,
        //     width: '20ch',
        //   },
        // }}
      >
        <MenuItem onClick={() => routePage("306")}>306</MenuItem>
        <MenuItem onClick={() => routePage("308")}>308</MenuItem>
        <MenuItem onClick={() => routePage("309")}>309</MenuItem>
        <MenuItem onClick={() => routePage("310")}>310</MenuItem>
        <MenuItem onClick={() => routePage("312")}>312</MenuItem>
        <MenuItem onClick={() => routePage("314")}>314</MenuItem>
      </Menu>
      <Typography className="bg-black text-[#F5F5F5]" variant="h3">
        E-KANBAN MONITORING REPORT <br />
        <Typography className="text-center" variant="h4">
          ประจำวันที่ {dayjs(searchDate).format("DD/MM/YYYY")}

        </Typography>
      </Typography>
      <br />
      {Tabvalue != 4 &&   
          <div className="bg-teal-700 text-white text-3xl p-3 rounded-md mb-4">
          {wcno}  {lineName}          <IconButton
              aria-label="more"
              id="long-button"
              aria-controls={open ? "long-menu" : undefined}
              aria-expanded={open ? "true" : undefined}
              aria-haspopup="true"
              onClick={handleClick}
              className="text-white"
            >
              <MoreVertIcon />
            </IconButton>
        </div>
      }
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
              icon={<LocalShippingIcon className="text-4xl" />}
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
      ) : (<>
      
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
                {partnos?.map((pt) => (
                  <option value={pt}>{pt}</option>
                ))}
              </select>
            </Grid>
            <Grid item xs={4}></Grid>
            <Grid item xs={4}></Grid>
          </Grid>
        </Card>

        {dataModelReportTscCompareData.map((tsc, index) => (
          <Card className="mt-5 bg-blue-50 p-2" key={index}>
            {/* <Typography className="text-right"  variant="body1">{dayjs(new Date().setDate(new Date().getDate() -1 )).format("DD/MM/YYYY")}</Typography> */}
            <Typography className="text-right" variant="body1">
              {dayjs(searchDate).format("DD/MM/YYYY")}
            </Typography>
            <Typography variant="h4">
              {tsc?.partno} -{tsc?.cm}
            </Typography>
            <CardContent>
              {tsc?.detailTSCData.map((detail) => (
                <Grid container spacing={10}>
                  <Grid item xs={12} md={6}>
                    <Box className="bg-blue-600 text-white">
                      <Typography variant="h4">TSC ALPHA (RM+WIP)</Typography>

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
                        &nbsp;{monthName[dayjs(Date.now()).month()]}
                      </Typography>
                    </Box>

                    <Grid container spacing={0}>
                      <Grid item xs={8}>
                        <Card>
                          <Box className="bg-blue-300">
                            <Typography className="text-left p-4" variant="h5">
                              (A) LWBAL (ยอดยกมา)
                            </Typography>
                            <Divider />
                          </Box>
                          <Box className="bg-blue-300">
                            <Typography className="text-left p-4" variant="h5">
                              (B) REC (PartSupply){" "}
                            </Typography>
                            <Divider />
                          </Box>
                          <Box className="bg-blue-300">
                            <Typography className="text-left p-4" variant="h5">
                              (C) ISS (Production)
                            </Typography>
                            <Divider />
                          </Box>
                          <Box className="bg-blue-300">
                            <Typography className="text-left p-4" variant="h5">
                              (D) BAL (Remain) [(A+B)-C]
                            </Typography>
                            <Divider />
                          </Box>
                        </Card>
                      </Grid>
                      <Grid item xs={4}>
                        <Card>
                          <Box className="bg-blue-200">
                            <Typography className="text-right p-4" variant="h5">
                              {" "}
                              {detail.tsc_lbal?.toLocaleString("en")}
                            </Typography>
                            <Divider />
                          </Box>
                          <Box className="bg-blue-200">
                            <Typography className="text-right p-4" variant="h5">
                              {detail.tsc_rec?.toLocaleString("en")}
                            </Typography>
                            <Divider />
                          </Box>
                          <Box className="bg-blue-200">
                            <Typography className="text-right p-4" variant="h5">
                              {detail.tsc_iss?.toLocaleString("en")}
                            </Typography>
                            <Divider />
                          </Box>
                          <Box className="bg-blue-200">
                            <Typography className="text-right p-4" variant="h5">
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
                      {" "}
                      <Typography variant="h4">
                        หัว LINE MACHINE (RM Only)
                      </Typography>
                      <Typography
                        className="bg-blue-600 inline-block"
                        variant="h6"
                      >
                        (ยอดประจำเดือน
                        <Typography
                          className="bg-blue-600 text-red-500 inline-block"
                          variant="h6"
                        >
                          &nbsp;{monthName[dayjs(Date.now()).month()]}
                        </Typography>
                        )
                      </Typography>
                    </Box>

                    <Grid container spacing={0}>
                      <Grid item xs={8}>
                        <Card>
                          <Box className="bg-blue-300">
                            <Typography className="text-left p-4" variant="h4">
                              A ยอดยกมา
                            </Typography>
                            <Divider />
                          </Box>
                          <Box className="bg-blue-300">
                            <Typography className="text-left p-4" variant="h4">
                              B รับเข้า (PD)
                            </Typography>
                            <Divider />
                          </Box>
                          <Box className="bg-blue-300">
                            <Typography className="text-left p-4" variant="h4">
                              C ผลิตแล้ว (PD)
                            </Typography>
                            <Divider />
                          </Box>
                          <Box className="bg-blue-300">
                            <Typography className="text-left p-4" variant="h4">
                              D คงเหลือ [(A+B)-C]
                            </Typography>
                            <Divider />
                          </Box>
                        </Card>
                      </Grid>
                      <Grid item xs={4}>
                        <Card>
                          <Box className="bg-blue-200">
                            <Typography className="text-right p-4" variant="h4">
                              {detail.ekb_lbal?.toLocaleString("en")}
                            </Typography>
                            <Divider />
                          </Box>
                          <Box className="bg-blue-200">
                            <Typography className="text-right p-4" variant="h4">
                              {detail.ekb_rec?.toLocaleString("en")}
                            </Typography>
                            <Divider />
                          </Box>
                          <Box className="bg-blue-200">
                            <Typography className="text-right p-4" variant="h4">
                              {detail.ekb_iss?.toLocaleString("en")}
                            </Typography>
                            <Divider />
                          </Box>
                          <Box className="bg-blue-200">
                            <Typography className="text-right p-4" variant="h4">
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
          <Grid item xs={12} md={3}>
            {/* <Paper
              component="form"
              sx={{
                p: "6px 4px",
                display: "flex",
                alignItems: "center",
                width: "auto",
                marginTop: "10px",
                marginBottom: "20px",
              }}
            >
              <IconButton sx={{ p: "10px" }} aria-label="menu">
                <MenuIcon />
              </IconButton>
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="ค้นหา WCNO"
                inputProps={{ "aria-label": "ค้นหา WCNO" }}
                onChange={(e) => filterDataTableIn(e)}
              />
              <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
                <SearchIcon />
              </IconButton>
              <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            </Paper> */}
          </Grid>

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
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow
                      key={index}
                      // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      {/* {dayjs(row.deliverlyEntryTime).format("DD/MM/YYYY hh:mm")} */}

                      <TableCell>{row.shiftDate}</TableCell>
                      <TableCell>{row.shifts}</TableCell>
                      <TableCell>{row.qrCode}</TableCell>
                      <TableCell>{row.wcno}</TableCell>
                      <TableCell>
                        {row.partNo} - {row.cm}
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
            count={dataIN.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </CustomTabPanel>
      <CustomTabPanel value={Tabvalue} index={2}>
        <Grid container spacing={10}>
          <Grid item xs={12} md={3}>
            {/* <Paper
              component="form"
              sx={{
                p: "6px 4px",
                display: "flex",
                alignItems: "center",
                width: "auto",
                marginTop: "10px",
                marginBottom: "20px",
              }}
            >
              <IconButton sx={{ p: "10px" }} aria-label="menu">
                <MenuIcon />
              </IconButton>
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="ค้นหา WCNO"
                inputProps={{ "aria-label": "ค้นหา WCNO" }}
                onChange={(e) => filterDataTableOut(e)}
              />
              <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
                <SearchIcon />
              </IconButton>
              <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            </Paper> */}
          </Grid>

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
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.shiftDate}</TableCell>
                      <TableCell>{row.shifts}</TableCell>
                      <TableCell> {row.qrCode}</TableCell>
                      <TableCell>{row.wcno}</TableCell>
                      <TableCell>
                        {row.partNo} - {row.cm}
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
                            {dayjs(row.shiftDate).format("DD-MM-YYYY HH:mm:ss")}
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
            {/* {JSON.stringify(resultTarget)} */}
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
                          <TableCell className="text-xl bg-lime-50 text-center">{row.wcno}</TableCell>
                          <TableCell className="text-xl bg-lime-50 text-left">{row.partDesc}</TableCell>
                          <TableCell className="text-xl bg-lime-50 text-center">{row.target.toLocaleString("en-Us")}</TableCell>
                          <TableCell className="text-xl bg-lime-50 text-center"> {row.actual.toLocaleString("en-Us")} </TableCell>
                          <TableCell className={row.actual > row.target ? "text-white text-xl bg-red-500 text-center":"text-xl bg-green-300 text-center"}>{row.actual > row.target ? "OVER TARGET" : "MIN TARTGET"}</TableCell>
                          <TableCell className="text-xl bg-lime-50 text-center"><Button onClick={() => findDay(row.wcno,row.actual.toLocaleString("en-Us"))} variant="contained" color="info" className="text-lg" startIcon={<Search className="text-3xl"/>}>รายละเอียด</Button></TableCell>
                        </TableRow>
                   
                       ))}
                  </TableBody>
                </Table>
              </TableContainer>
             
            </Paper>
          </CustomTabPanel>
      </>)}

      <ResultDayDialog openDialog={openDialog} onClose={closeDialog} payload={resultFindResultFixDay} actual={Actual}/>

    
    </>
  );
}

export default ReportDaily;
