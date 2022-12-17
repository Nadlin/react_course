import { updateLoadState, updateData } from "./tasksSlice.js";

export async function tasksLoad(dispatch) {
    try {
      dispatch( updateLoadState({state:1,error:null}) );
      const stringName = 'LINNIK_TO_DO_2';
        let sp = new URLSearchParams();
        sp.append('f', 'READ');
        sp.append('n', stringName);
      const response=await fetch('https://fe.it-academy.by/AjaxStringStorage2.php', {
          method : 'POST',
          body: sp
      });
      if ( response.ok ) {
        const data=await response.json();
        const dataResult = JSON.parse(data.result);
        dispatch( updateLoadState({state:2,error:null}) );
        dispatch( updateData(dataResult));
      }
      else {
        dispatch( updateLoadState({state:3,error:"HTTP error "+response.status}) );
      }
    }
    catch ( err ) {
      dispatch( updateLoadState({state:3,error:err.message}) );
    }
};
