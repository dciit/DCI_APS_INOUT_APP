import React from "react";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { Button } from "@mui/material";
import GetAppIcon from '@mui/icons-material/GetApp';

type Props = {
  csvData: Object[];
  fileName: string;
};

export const ExportCSV: React.FC<Props> = ({ csvData, fileName }) => {
  
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToCSV = (csvData: Object[], fileName: string) => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });

    FileSaver.saveAs(data, fileName + fileExtension);
  };

  return (

   <>
     <Button className="bg-green-700 text-white text-base" variant="outlined" startIcon={<GetAppIcon />} onClick={() => exportToCSV(csvData,fileName)}>
                                  Export WCNO ทั้งหมด
        </Button>

    </>
  );
};
