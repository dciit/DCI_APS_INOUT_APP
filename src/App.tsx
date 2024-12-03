import './App.css'
import Report from './components/Report'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ReportDaily from './components/ReportDaily';
import ReportMonitoring from './components/Monitor/ReportMonitoring';
import ReportSCR from './components/FAC2_SCR/ReportSCR';
import LineReportSCR from './components/FAC2_SCR/LineReportSCR';


function App() {

  return (
    <>
   

      <BrowserRouter>
        <Routes>     
           <Route path="/EkbReportApp/search/:wcno/:searchDate" element={<ReportDaily/>} />    
           <Route path="/EkbReportApp/search" element={<Report/>} />
           <Route path="/EkbReportApp/Monitoring" element={<ReportMonitoring/>} />
           <Route path="/EkbReportApp/SCR" element={<ReportSCR/>} />
           <Route path="/EkbReportApp/LineReport" element={<LineReportSCR/>} />

          
        </Routes>
      </BrowserRouter>

      
     
    </>
  )
}

export default App
