
const initialData = {

    data_click:{
     

        ym:'',
        ymd:'',
        shift:'',
        model:'',
        wcno:'',
        partno:'',
        cm:'',
        part_name:'',
    
        empcode:'',
      
        remark:'',

    
    },




  
   
  }
  
  
  const remarkReducer = (state = initialData  ,action:any) => {
    switch(action.type){
      case 'DATA_CLICK': 
      return{
        data_click:{
          ym:action.payload.ym,
          ymd:action.payload.ymd,
          shift:action.payload.shift,
          model:action.payload.model,
          wcno:action.payload.wcno,
          partno:action.payload.partno,
          cm:action.payload.cm,
          part_name:action.payload.part_name,
          empcode:action.payload.empcode,
          remark:action.payload.remark,
        }
          
      
        }
  
  
        
        case 'DATA_ADD': 
        return{
           
            ...state,
            data_click:{
              empcode:action.payload.empcode,          
              remark:action.payload.remark}
            
        
  
          }
  
    
         
        
    
      
   
      default:
        return state
  
  
    }
  }
  
  export default remarkReducer