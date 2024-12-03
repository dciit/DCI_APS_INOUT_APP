import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import dayjs from "dayjs";

export interface findResultFixDay {
  in: number;
  out: number;
  lbal: number;
  rj: number;
  partno: string;
  shiftDate: string;
  wcno:string
  partDesc:string
}

interface ChildProps {
  openDialog: boolean;
  onClose: () => void;
  payload: findResultFixDay[];
  actual: string;
}

const columnsData = [
  { id: "shiftDate", label: "No." },
  { id: "PARTNO", label: "PARTNO" },
  { id: "QTY", label: "จำนวน" },
];

function ResultDayDialog({ openDialog, onClose, payload, actual }: ChildProps) {
  return (
    <>
      <Dialog
        open={openDialog}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <h1 className="font-bold text-orange-600  text-2xl ">{payload[0]?.partDesc}</h1>


          
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          <h1 className="font-bold text-xl ">วันที่ {dayjs(payload[0]?.shiftDate).format("DD/MM/YYYY")}</h1> 

            <Paper sx={{ width: "100%", overflow: "auto", marginTop: 2 }}>
              <TableContainer sx={{ maxHeight: 1000 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {columnsData.map((column, index) => (
                        <TableCell key={index} style={{ fontWeight: "bold" }}>
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {payload.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell> {row.partno}</TableCell>
                        <TableCell>{row.lbal.toLocaleString("en-Us")}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={2}>จำนวนทั้งหมด </TableCell>
                      <TableCell align="center">
                      <p className="text-red-600 text-lg">{actual}</p>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>ปิด</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ResultDayDialog;
