import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import "dayjs/locale/en-gb";
import { useSelector, useDispatch } from "react-redux";

import Swal from "sweetalert2";
import { getRemarkEdit, saveRemark } from "../../service/reportSCR";

export interface REMARK {
  ym: string;
  ymd: string;
  shift: string;
  model: string;
  wcno: string;
  partno: string;
  cm: string;
  part_name: string;

  empcode: string;

  remark: string;
}
function RemarkLOG({ openDialog,editRemark, onClose,loadData }: any) {
  const dispatch = useDispatch();

  const [empcode, setempcode] = useState<string>("");
  const [remark, setremark] = useState<string>("");
  const payloadRemark = useSelector((state: any) => state.remarkStateReducer.data_click);


    useEffect(() => {
        if (openDialog == true && editRemark == true) {
            
            initData(payloadRemark)
            
        }else{
            setempcode("")
            setremark("")
        }
    }, [openDialog]);


    const initData = async(payloadRemark:any) =>{
        const result = await getRemarkEdit(payloadRemark);
        setempcode(result.empCode);
        setremark(result.remark);

    }
  const submitData = async () => {
    let data ={
        ...payloadRemark,
        empcode: empcode,
        remark: remark,
    }
   
    dispatch({
      type: "DATA_ADD",
      payload:{
      ...payloadRemark,
      data
      }
    });

 

    const result = await saveRemark(data);
    if(result == "add"){
              Swal.fire({
                position: "top-end",
                icon: "success",
                title: "เพิ่ม Remark สำเร็จ",
                showConfirmButton: false,
                timer: 1500
              });

              onClose(true)
       
    }
         else{
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "แก้ไข Remark สำเร็จ",
                showConfirmButton: false,
                timer: 1500
              });
              onClose(true)
              
            }

            loadData();
  };

  return (
    <Dialog
      open={openDialog}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        <p className="text-[27px] text-black">Remark </p>
        <p className="text-sm text-black">
          You can add or edit remark for report wip stock yourself.
        </p>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" sx={{ mt: "6px" }}>
          <TextField
            sx={{ mt: "10px", mb: "12px", backgroundColor: "#faffb3" }}
            fullWidth
            label="รหัสพนักงาน"
            variant="outlined"
            inputProps={{ maxLength: 5 }}
            onChange={(e) => setempcode(e.target.value)}
            value={empcode}
          />

          <TextField
            sx={{ mt: "10px", mb: "12px", backgroundColor: "#faffb3" }}
            fullWidth
            label="Remark"
            variant="outlined"
            onChange={(e) => setremark(e.target.value)}
            value={remark}
          />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          sx={{ color: "white" }}
          disabled={empcode != "" && remark != "" ? false : true}
          type="button"
          color={editRemark == true ? "info" : "success"}
          variant="contained"
          onClick={submitData}
        >
          {editRemark == true ? "บันทึกแก้ไข" : "บันทึก"}
        </Button>
        <Button
          type="button"
          color="error"
          variant="contained"
          onClick={onClose}
          autoFocus
        >
          ปิด
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default RemarkLOG;
