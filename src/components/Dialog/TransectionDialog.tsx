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
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { TRANSECTION_REMARK_RETURN } from "../Model/LineReport";
import { useState } from "react";

export interface HISTORY_RETURN {
  refs: string;

  type: string;

  transQty: number;
}
export interface findResultFixDay {
  in: number;
  out: number;
  lbal: number;
  rj: number;
  partno: string;
  shiftDate: string;
  wcno: string;
  partDesc: string;
}

export interface HISTORY_REMARK_RETURN {
    remark_date  :string
   
    remark_by  :string
  
    remark_status  :string
  
  
  }


  const columnsRecord = [

    { id: "date", label: "DATE" },
    { id: "shift", label: "SHIFT" },
    { id: "wcno", label: "SHIFT" },
    { id: "partno", label: "PARTNO"},
    { id: "type", label: "Type"},
    { id: "qty", label: "QTY"},
    { id: "action", label: "Action By"},
    { id: "create", label: "CreateDate"},

  
  
  ];
  
  

function ccyFormat(num: number) {
  return `${num.toFixed(2)}`;
}

function TransectionDialog({
  openDialog,
  onClose,
  Lbal,
  out,
  historyPayload,
  findHistoryReturn,
  findRemarkPayload,
  findTransectionList
}: any) {

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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

  return (
    <>
      <Dialog
        fullWidth
        maxWidth={findRemarkPayload.length > 0 ? "md" :"lg"}
        open={openDialog}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <h1 className="font-bold  text-lg ">
            {historyPayload.wcno} : {historyPayload.partno} {historyPayload.cm}
          </h1>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div className="flex md:flex-col flex-col justify-start gap-6">
             

            <div className="flex md:flex-row flex-col gap-5">
              <div className={`w-[100%]  ${findRemarkPayload.length > 0 ? "md:w-[65%]" : "md:w-[100%]"}`}>
                <TableContainer component={Paper}>
                  <Table className="tbTransection" aria-label="spanning table">
                    <TableHead>
                      <TableRow className="bg-blue-200 ">
                        <TableCell className=" text-lg" align="left">
                          รายการ
                        </TableCell>
                        <TableCell className=" text-lg" align="center">
                          IN
                        </TableCell>
                        <TableCell className=" text-lg" align="center">
                          OUT
                        </TableCell>
                        <TableCell className=" text-lg" align="center">
                          QTY
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow className="bg-yellow-200">
                        <TableCell
                          className="text-md"
                          sx={{ fontWeight: "bold" }}
                          colSpan={3}
                        >
                          ยอดยกมา (LBAL)
                        </TableCell>
                        <TableCell
                          className="text-md"
                          sx={{ fontWeight: "bold" }}
                          align="right"
                        >
                          {ccyFormat(Lbal)}
                        </TableCell>
                      </TableRow>
                      {findHistoryReturn.map(
                        (row: HISTORY_RETURN, index: number) => (
                          <TableRow key={index}>
                            <TableCell className="text-md">
                              {row.refs}
                            </TableCell>
                            {row.type === "IN" && row.transQty >= 0 ? (
                              <TableCell align="right">
                                {/* +{ccyFormat(Math.abs(row.transQty))} */}
                                {ccyFormat(row.transQty)}

                              </TableCell>
                            ) : row.type === "OUT" &&
                              row.transQty <= 0 &&
                              out == 0 ? (
                              <TableCell align="right">
                                {/* +{ccyFormat(Math.abs(row.transQty))} */}
                                {ccyFormat(row.transQty)}

                              </TableCell>
                            ) : (
                              <TableCell align="right"></TableCell>
                            )}

                            {row.type === "OUT" && row.transQty > 0 ? (
                              <TableCell align="right">
                                {/* -{ccyFormat(row.transQty)} */}
                                {ccyFormat(row.transQty)}

                              </TableCell>
                            ) : row.type === "OUT" &&
                              row.transQty <= 0 &&
                              out != 0 ? (
                              <TableCell align="right">
                                {/* +{ccyFormat(Math.abs(row.transQty))} */}
                                {ccyFormat(row.transQty)}

                              </TableCell>
                            ) : (
                              <TableCell align="right"></TableCell>
                            )}

                            <TableCell align="right">
                              {row.type == "IN"
                                ? ccyFormat((Lbal += row.transQty))
                                : ccyFormat((Lbal -= row.transQty))}
                            </TableCell>
                          </TableRow>
                        )
                      )}

                      <TableRow className=" bg-green-200">
                        <TableCell
                          className="text-md"
                          sx={{ fontWeight: "bold" }}
                          colSpan={3}
                        >
                          ยอดรวม (BAL)
                        </TableCell>
                        <TableCell
                          className="text-md"
                          sx={{ fontWeight: "bold" }}
                          align="right"
                        >
                          {ccyFormat(Lbal)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            
                <div className={`${findRemarkPayload.length <= 0 ? "hidden" : ""} space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800`}>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Remark history
                  </h3>

                  <ol className="relative ms-3 border-s border-gray-200 dark:border-gray-700">
            
            
                    {findRemarkPayload?.map((item:HISTORY_REMARK_RETURN) => (
                           <li className={`mb-10 ms-6 text-green-800`}>
                           <span className="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-green-300 ring-8 ring-white ">
                             <svg
                               className="h-4 w-4"
                               aria-hidden="true"
                               xmlns="http://www.w3.org/2000/svg"
                               width="24"
                               height="24"
                               fill="none"
                               viewBox="0 0 24 24"
                             >
                               <path
                                 stroke="currentColor"
                                 stroke-linecap="round"
                                 stroke-linejoin="round"
                                 stroke-width="2"
                                 d="M5 11.917 9.724 16.5 19 7.5"
                               />
                             </svg>
                           </span>
                           <h4 className="mb-0.5 font-bold">
                             {item.remark_date.split(" ")[0]}, {item.remark_date.split(" ")[1]}
                           </h4>
                           <p className="text-sm">
                             {item.remark_status} - {item.remark_by}
                           </p>
                         </li> 
                    ))}
                  


             
                  </ol>
                </div>
              
            </div>

            <div >
            <Paper sx={{ width: "100%", overflow: "auto" }}>

              <TableContainer>
                <Table className="tbMain">
                  <TableHead >
                    <TableRow>
                      {columnsRecord.map((column, index) => (
                        <TableCell key={index}  className="bg-blue-200  font-bold">
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {findTransectionList.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    .map((row:TRANSECTION_REMARK_RETURN, index:number) => (
                        <TableRow key={index} className={`${index % 2 == 0 ? "bg-gray-200" : "bg-white"}`}>
                          <TableCell className="text-sm  text-left">{row.date}</TableCell>
                          <TableCell className="text-sm  text-left">{row.shift}</TableCell>
                          <TableCell className="text-sm  text-left">{row.wcno}</TableCell>
                          <TableCell className="text-sm  text-left">{row.partno} {row.cm}</TableCell>
                          <TableCell className="text-sm  text-left">{row.type}</TableCell>

                          <TableCell className="text-sm  text-right"> {row.qty.toLocaleString("en-Us")} </TableCell>

                          <TableCell className="text-sm  text-left">{row.refno == "ADJUST" ? row.refno : row.createBy}</TableCell>

                          <TableCell className="text-sm  text-left">{row.createDate}</TableCell>

                         
                        </TableRow>
                   
                       ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={findTransectionList.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
                </Paper>


              </div>

            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="error" variant="contained" onClick={onClose}>
            ปิด
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default TransectionDialog;
