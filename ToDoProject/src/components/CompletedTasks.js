import React, { useState, useEffect, useMemo } from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {clientEvents} from './events';
import { MobileClient } from './MobileClient';
import { clientAdd, clientChange, clientDelete } from "../redux/clientsSlice.js";
import { clientsLoad } from "../redux/clientsLoad.js";
import {updateData, updateLoadState} from "../redux/clientsSlice";

//import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
//import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';


export const CompletedTasks = () => {
    console.log("render MobileCompany");
    const clientsRedux = useSelector(state=>state.clients);


    const [priority, setPriority] = useState(4);

    const [open, setOpen] = useState(false);

    const [isConfirmation, setIsConfirmation] = useState(false);
    const [completedTaskId, setCompletedTaskId] = useState(null);
    const [confirmDeletedTaskId, setConfirmDeletedTaskId] = useState(null);

    useEffect(
        ()=>{
            if (clientsRedux.dataLoadState == 0) {
                load();
            }

            clientEvents.addListener('EClientComplDeleted', confirmTaskRemoval);
            return ()=>{
                // console.log('MobileCompany размонтирован');

                clientEvents.removeListener('EClientComplDeleted', confirmTaskRemoval);
            };
        },
        [clientsRedux.dataCompleted]
    );

    /*useEffect(
        ()=>{
            clientEvents.addListener('EClientChanged', changeClient);
            clientEvents.addListener('EClientDeleted', deleteClient);
            //console.log("From useEffect: MobileCompany");
            load()
            return ()=>{
               // console.log('MobileCompany размонтирован');
                clientEvents.removeListener('EClientChanged', changeClient);
                clientEvents.removeListener('EClientDeleted', deleteClient);
            };
        },
        [clients]
    );*/

    const dispatch = useDispatch();
    let clientsCode = [];
    if (clientsRedux.dataCompleted) {
        clientsCode = clientsRedux.dataCompleted.map( (client) => {
            client = {...client};
            //client.status = !!(client.balance > 0) ? 'active' : 'blocked';
            // if ((isShowActive && client.balance > 0) ||
            //    (isShowBlocked && client.balance <=0) ||
            //    (!isShowBlocked && !isShowActive)) {
            return <MobileClient key={client.id} id={client.id} client={client} isCompleted={true} markedClass={(confirmDeletedTaskId && confirmDeletedTaskId == client.id) ? '-marked' : '-uuu'} />;
            //}
        });
    }




    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    function load () {
        dispatch(clientsLoad);
    }

    function confirmTaskRemoval (id) {
        setCompletedTaskId(id);
        setIsConfirmation(true);
        handleClickOpen();
    }

    function  deleteTaskFromCompleted () {
        let completedTasks = clientsRedux.dataCompleted.slice(), taskIndex;
        for (let i=0; completedTasks.length; i++) {
            if (completedTasks[i].id == completedTaskId) {
                taskIndex = i;
                break;
            }
        }
        completedTasks.splice(taskIndex, 1);
     //   requestTaskUpdate(clientsRedux.dataCurrent, completedTasks);
     //   handleClose();
       // setCompletedTaskId(null);


        handleClose();
        setIsConfirmation(false);
        setConfirmDeletedTaskId(completedTaskId);
        setTimeout(function () {
            requestTaskUpdate(clientsRedux.dataCurrent, completedTasks);
            setCompletedTaskId(null);
        }, 2000);
    };

    async function requestTaskUpdate (currentTasks, completedTasks) {
        try {
            //dispatch( updateLoadState({state:1,error:null}) );
            const stringName = 'LINNIK_TO_DO_2';
            const updatePassword = Math.random();
            //const dataParams =  { f: 'READ', n: stringName };
            let sp = new URLSearchParams();
            sp.append('f', 'LOCKGET');
            sp.append('n', stringName);
            sp.append('p', updatePassword);
            const response=await fetch('https://fe.it-academy.by/AjaxStringStorage2.php', {
                method : 'POST',
                body: sp
            });
            if ( response.ok ) {
                const data=await response.json();
                const dataResult = JSON.parse(data.result);
               //dispatch( updateLoadState({state:2,error:null}) );
               // dispatch( updateData(dataResult.current) );
                let sp1 = new URLSearchParams();
                sp1.append('f', 'UPDATE');
                sp1.append('n', stringName);
                sp1.append('p', updatePassword);
                sp1.append('v', JSON.stringify({current: currentTasks, completed: completedTasks}))
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



    return (
        <>
            {
                (clientsRedux.dataCompleted) &&
                <div className='MobileCompany'>
                    <div className='MobileCompanyClients'>
                        <div className="tasks-wrapper">{clientsCode}</div>
                    </div>
                    {
                        isConfirmation &&
                        <Dialog open={open} onClose={handleClose}>
                            <DialogTitle>
                                Вы действительно хотите удалить задачу?
                            </DialogTitle>
                            <DialogActions>
                                <input type="button" value="Удалить" onClick={deleteTaskFromCompleted} />
                                <input type="button" value="Отмена" onClick={handleClose} />
                            </DialogActions>
                        </Dialog>
                    }
                </div>
            }
            {
                ((clientsRedux.dataLoadState == 0 || clientsRedux.dataLoadState == 1) && !clientsRedux.dataCompleted)  &&
                <div>Please wait a bit... Data is loading.</div>
            }
        </>



    );
};
