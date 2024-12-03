import { useEffect, useState } from "react";
import {
  lineInfo,
  LineReportReturn,
  ModelInfo,
  resultStatusInfo,
} from "../Model/LineReport";
import { getLineReportData } from "../../service/lineReport";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
function LineReportSCR() {
  const [DataFinish, setDataFinish] = useState<LineReportReturn[]>([]);
  const [DataCurrent, setDataCurrent] = useState<ModelInfo[]>([]);
  const [DataWaiting, setDataWaiting] = useState<ModelInfo[]>([]);
  // const [Data2, setData2] = useState<LineReportReturn[]>([]);

  // const [plan,setplan] = useState<number>(0)

  useEffect(() => {
    inintData();
  }, []);

  const inintData = async () => {
    const res: any = await getLineReportData();
    setDataFinish(res.lineReturnReportFinish);
    setDataCurrent(res.lineReturnReportCurrent);
    setDataWaiting(res.lineReturnReportWaiting);
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center gap-2 text-sm p-4 ">
        {DataFinish.length > 0 && (
          <>
            <div className="sm:w-[100%] md:w-[100%] ">
              <table className="tbLineReport w-full  text-black shadow-xl opacity-80">
                <thead className="sticky top-0">
                  <th
                    colSpan={7}
                    className="text-left text-lg w-full p-1 font-thin text-gray-400 bg-gray-200 "
                  >
                    Complete Sequence
                  </th>

                  <tr className="bg-gray-600/20 text-gray-400">
                    <th className="font-thin">Seq.</th>
                    <th className="font-thin">Model No </th>
                    <th className="font-thin">Model</th>
                    <th className="font-thin">APS Plan </th>
                    <th className="font-thin">Actual</th>
                    <th className="font-thin">Remain Plan</th>
                    <th className="font-thin">Status</th>
                  </tr>
                  {DataFinish.map((_data2: LineReportReturn) => (
                    <>
                      <tr className="bg-gray-100 opacity-50">
                        <td className="text-center">{_data2.seq}</td>
                        <td className="text-center">{_data2.modelCode}</td>
                        <td className="text-left">{_data2.model}</td>
                        <td className="text-right">{_data2.apsPlan}</td>
                        <td className="text-right">{_data2.actual}</td>
                        <td className="text-right ">

                          <p className="text-[11px] inline">{_data2.remainPlan < 0  ? <ArrowDropUpIcon className="mb-1 text-[24px] text-red-700"/> : ""} </p> <p className="text-[17px] inline">{Math.abs(_data2.remainPlan)} </p> </td>
                        <td
                          className={`text-left ${
                            _data2.status == "FINISH"
                              ? "bg-green-300"
                              : "bg-red-300"
                          }`}
                        >
                          {_data2.status}
                        </td>
                      </tr>
                    </>
                  ))}
                </thead>
              </table>
            </div>
          </>
        )}

        {DataCurrent.length > 0 && (
          <>
            <div className="sm:w-[100%] md:w-[100%] ">
              <table className="tbLineReport w-full  text-black shadow-xl">
                <thead className="sticky top-0  ">
                  <th
                    colSpan={2}
                    className="font-thin text-lg w-full p-2 bg-[#FFA500]/60"
                  >
                    <div className="flex flex-row justify-between">
                      <div className="text-left">
                        <p className=" text-center  inline text-xl font-medium">
                          Sequence #{DataCurrent[0]?.seq}
                        </p>
                        &nbsp; (กำลังเดิน)
                      </div>
                    </div>
                  </th>
                  <th
                    colSpan={4}
                    className="font-thin text-lg w-full p-2 bg-[#FFA500]/60"
                  >
                    <p className="inline text-md">Current Plan</p>
                    &nbsp;
                    <p className="text-md inline">
                      (APS Plan = {DataCurrent[0]?.apsPlan} , Actual ={" "}
                      {DataCurrent[0]?.actual})
                    </p>
                  </th>

                  <tr className="bg-yellow-300/80 text-md">
                    <th className="font-thin w-[10%]"></th>
                    <th className="font-thin w-[20%]">Model</th>
                    <th className="font-thin w-[10%]">Part Name</th>
                    <th className="font-thin w-[12%]">Current Stock </th>
                    <th className="font-thin w-[10%]">Remain Plan</th>

                    <th className="font-thin w-[10%]">Status</th>
                  </tr>
                  <tr></tr>
                  {DataCurrent.map((data: ModelInfo) => (
                    <>
                      {data.lineName.map((data2: lineInfo) => (
                        <>
                          <tr className="bg-yellow-300/40 text-[17px]">
                            <td
                              className="text-lg rotate-[-90deg] "
                              rowSpan={data2.results.length + 1}
                            >
                              {data2.line}
                            </td>
                            <td
                              className="text-left text-md"
                              rowSpan={data2.results.length + 1}
                            >
                              {data.model}
                              <br /> {data.modelCode}
                            </td>
                          </tr>

                          {data2.results.map((result: resultStatusInfo) => (
                            <>
                              <tr className="bg-yellow-200/20">
                                <td className="text-left">
                                  <p className="font-bold">
                                    {result.part_name == "LW"
                                      ? "LOWER"
                                      : result.part_name == "HS"
                                      ? "HOUSING"
                                      : result.part_name}
                                  </p>

                                  <p className="text-md">{result.partno}</p>
                                </td>
                                <td
                                  className={`text-right text-lg ${
                                    result.stock < 0
                                      ? "bg-red-100 text-red-800 font-bold"
                                      : ""
                                  } `}
                                >
                                  {result.stock.toLocaleString("en-US")}
                                </td>
                                <td className={`text-right text-lg `}>
                                  {result.remain}
                                </td>
                                <td
                                  className={`text-left text-sm ${
                                    result.status != "เพียงพอ" &&
                                    "bg-red-300/50"
                                  }`}
                                >
                                  {result.status != "เพียงพอ" && result.status}
                                </td>
                              </tr>
                            </>
                          ))}
                        </>
                      ))}
                    </>
                  ))}
                </thead>
              </table>
            </div>
          </>
        )}

        <div className="sm:w-[100%] md:w-[100%] ">
          {DataWaiting.map((__data: ModelInfo, i: number) => (
            <>
              <table className={`tbLineReport w-full  text-black shadow-xl 
                                  ${DataCurrent.length > 0 ? "opacity-50" : ""}  mt-2`}>
                <thead className="sticky top-0  ">
                  <th
                    colSpan={2}
                    className="font-thin text-lg w-full p-2 bg-sky-600/10 "
                  >
                    <div className="flex flex-row justify-between">
                      <div className="text-left">
                        <p className=" text-center  inline text-lg font-thin">
                          Sequence #{__data.seq}
                        </p>
                        &nbsp;{" "}
                        <p className="text-[17px] inline">{__data.seqStatus == "SOME PRODUCTION"
                          ? "(ผลิตแล้วบางส่วน)"
                          : "(รอการผลิต)"}</p>
                      </div>
                      <div></div>
                    </div>
                  </th>
                  <th
                    colSpan={4}
                    className="font-thin text-lg w-full p-2 bg-sky-600/10 "
                  >
                    <p className="inline text-md">Next Plan</p>
                    &nbsp;
                    <p className="text-lg inline">
                      (APS Plan = {__data.apsPlan} , Actual ={" "}
                      {DataWaiting[i]?.actual})
                    </p>
                  </th>

                  <tr className="bg-gray-600/20 text-md">
                    <th className="font-thin w-[10%]"></th>
                    <th className="font-thin w-[20%]">Model</th>
                    <th className="font-thin w-[10%]">Part Name</th>
                    <th className="font-thin w-[12%]">Current Stock </th>
                    <th className="font-thin w-[10%]">Remain Plan</th>

                    <th className="font-thin w-[10%]">Status</th>
                  </tr>
                  <tr></tr>

                  <>
                    {__data.lineName.map((data2: lineInfo) => (
                      <>
                        <tr className="bg-yellow-200/20">
                          <td
                            className="text-lg rotate-[-90deg] "
                            rowSpan={data2.results.length + 1}
                          >
                            {data2.line}
                          </td>
                          <td
                            className="text-left text-[17px]"
                            rowSpan={data2.results.length + 1}
                          >
                            {__data.model}
                            <br /> {__data.modelCode}
                          </td>
                        </tr>

                        {data2.results.map((result: resultStatusInfo) => (
                          <>
                            <tr className="bg-yellow-200/10">
                              <td className="text-left">
                                <p className="font-bold">
                                  {result.part_name == "LW"
                                    ? "LOWER"
                                    : result.part_name == "HS"
                                    ? "HOUSING"
                                    : result.part_name}
                                </p>
                                <p className="text-md ">{result.partno}</p>
                              </td>
                              <td
                                className={`text-right text-lg ${
                                  result.stock <= 0
                                    ? "bg-red-100 text-red-800 font-bold"
                                    : ""
                                } `}
                              >
                                {result.stock.toLocaleString("en-US")}
                              </td>
                              <td className={`text-right text-lg`}>{result.remain}</td>
                              <td
                                className={`text-left ${
                                  result.status != "เพียงพอ" && "bg-red-300/80"
                                }`}
                              >
                                {result.status != "เพียงพอ" && result.status}
                                {/* {result.status == "STOCK ไม่เพียงพอต่อการผลิต" ? <p className="text-[12px]">*ต้องมี STOCK อย่างน้อย {Number(result.remain) + Number(data.apsPlan)/2} ตัว</p> : <></>}  */}
                              </td>
                            </tr>
                          </>
                        ))}
                      </>
                    ))}
                  </>
                </thead>
              </table>
            </>
          ))}
        </div>
      </div>
    </>
  );
}

export default LineReportSCR;
