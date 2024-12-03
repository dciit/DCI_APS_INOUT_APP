
const initialData = {

    // dataIN:{
     
    //     shiftDate: '',
    //     wcno: '',
    //     partNo: '',  
    //     cm: '',  
    //     timeRound: '',  
    //     transType: '',   
    //     totalRound: 0,    
    //     createBy: '',   
    //     shifts: '',
    
    // },
    // dataOut:{

    //     shiftDate: '',
    //     wcno: '',
    //     partNo: '',    
    //     cm: '',
    //     transType: '',  
    //     transQty: 0,
    //     shifts: '',    
    //     qrCode: '',    
    //     createBy: ''
    // }

    dataIn:[],
    dataOut:[]


  
   
  }
  
  
  const exportDataInOutReducer = (state = initialData  ,action:any) => {
    switch(action.type){
      case 'DATA_IN': 
      return{
         
          ...state,
          dataIn:action.payload
        }
  
  
        case 'DATA_OUT' :
        return{
          
            ...state,
            dataOut:action.payload
        } 
      
  
    
         
        
    
      
   
      default:
        return state
  
  
    }
  }
  
  export default exportDataInOutReducer