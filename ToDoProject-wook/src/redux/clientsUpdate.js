import { updateLoadState } from "./clientsSlice.js";
import {clientsLoad} from "./clientsLoad";

export async function requestTaskUpdate (clientsNew) {
    try {
        const stringName = 'LINNIK_TO_DO_2';
        const updatePassword = Math.random();
        let sp = new URLSearchParams();
        sp.append('f', 'LOCKGET');
        sp.append('n', stringName);
        sp.append('p', updatePassword);
        const response=await fetch('https://fe.it-academy.by/AjaxStringStorage2.php', {
            method : 'POST',
            body: sp
        });
        if ( response.ok ) {
           // const data=await response.json();
         //   const dataResult = JSON.parse(data.result);
            let sp1 = new URLSearchParams();
            sp1.append('f', 'UPDATE');
            sp1.append('n', stringName);
            sp1.append('p', updatePassword);
            sp1.append('v', JSON.stringify({current: clientsNew, completed: clients.dataCompleted}))
            const response1=await fetch('https://fe.it-academy.by/AjaxStringStorage2.php', {
                method : 'POST',
                body: sp1
            });
            if ( response1.ok ) {
                dispatch(clientsLoad);
            }
            else {
                dispatch( updateLoadState({state:3,error:"HTTP error "+response.status}) );
            }

        }
        else {
            dispatch( updateLoadState({state:3,error:"HTTP error "+response.status}) );
        }
    }
    catch ( err ) {
        dispatch( updateLoadState({state:3,error:err.message}) );
    }
};
