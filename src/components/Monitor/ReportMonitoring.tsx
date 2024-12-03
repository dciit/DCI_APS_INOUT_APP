import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import styles from './ReportMonitoring.module.css'

const columnsData = [
  { id: "PD", label: "PD เบิก" },
  { id: "PS", label: "PS ส่ง" },
  { id: "PLAN", label: "แผน (DAY)" },
  { id: "LBAL", label: "ยกมา (LBAL)" },
  { id: "ISS", label: "ผลิต (DAY)" },
  { id: "REC", label: "ส่ง (DAY)" },
  { id: "BAL", label: "คงเหลือ (BAL)" },
];

function createData(
    PD: string,
    PS: string,
    PLAN: number,
    LBAL: number,
    ISS: number,
    REC: number,
    BAL: number,

  ) {
    return { PD, PS, PLAN, LBAL, ISS ,REC ,BAL};
  }
  
  const rows = [
    createData('08:21 - 10:20', '09:00', 24, 124, 300,400,500),
    createData('10:21 - 12:20', '11:00', 24, 124, 300,400,500),    
    createData('12:21 - 14:20', '13:00', 24, 124, 300,400,500)];
  



function ReportMonitoring() {

  const WCNO = ["306","308","309","310","312","314"]  


  return (
    <>
      <div className="overflow-hidden">
        <h1 className="font-bold  p-6 bg-indigo-300 text-5xl">
          EKB MONITORING
        </h1>
        <div className="grid grid-cols-2 gap-6 mt-10">
          {WCNO.map((item) => (
            <>
              <div className="mt-5">
                
                <Paper sx={{ width: "100%", overflow: "auto", marginTop: 2 }}>
                <h1 className="text-center text-2xl bg-red-200 p-4">WCNO : {item} <br /> รุ่นที่เดินปัจจุบัน : 2PD040601-1</h1>
                  <TableContainer sx={{ maxHeight: 1000 }}>
                    <Table stickyHeader aria-label="sticky table" className={styles.tbMainTarget}>
                      <TableHead>
                        <TableRow>
                          {columnsData.map((column, index) => (
                            <TableCell
                             className="text-lg"
                              key={index}
                              style={{ fontWeight: "bold" }}
                            >
                              {column.label}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows
                         
                          .map((row, index) => (
                            <TableRow
                              key={index}
                              className={index == 0 ? "bg-sky-400" : (index == 1 ?  "bg-yellow-400" : "bg-white")}
                              // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                            >
                              <TableCell className="w-33 text-lg">{row.PD}</TableCell>
                              <TableCell className="w-20 text-lg">{row.PS}</TableCell>
                              <TableCell className="w-24 text-lg"> {row.PLAN}</TableCell>
                              <TableCell className="w-28 text-lg">{row.LBAL}</TableCell>
                              <TableCell className="w-28 text-lg">
                                {row.ISS} 
                              </TableCell>
                              {/* <TableCell>{row.timeRound}</TableCell>
                          <TableCell>{row.totalRound}</TableCell> */}
                              <TableCell className="w-28 text-lg"> {row.REC}</TableCell>
                              <TableCell className="w-28 text-lg">{row.BAL}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                 
                </Paper>
              </div>
            </>
          ))}
        </div>
      </div>
    </>
  );
}

export default ReportMonitoring;
