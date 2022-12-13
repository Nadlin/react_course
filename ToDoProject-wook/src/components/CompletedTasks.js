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
    const clients = useSelector(state=>state.clients);

    const [isShowBlocked, setIsShowBlocked] = useState(false);
    const [isShowActive, setIsShowActive] = useState(false);
    const [isClientChanging, setIsClientChanging] = useState(false);
    const [isNewClientAdding, setIsNewClientAdding] = useState(false);
    const [changingClient, setChangingClient] = useState({});
    const [priority, setPriority] = useState(4);
    const [itemColor, setItemColor] = useState('green');
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);

    useEffect(
        ()=>{
            if (clients.dataLoadState != 2) {
                load();
            }

            clientEvents.addListener('EClientComplDeleted', deleteTaskFromCompleted);
            return ()=>{
                // console.log('MobileCompany размонтирован');

                clientEvents.removeListener('EClientComplDeleted', deleteTaskFromCompleted);
            };
        },
        [clients.dataCompleted]
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
    if (clients.dataLoadState == 2) {
        clientsCode = clients.dataCompleted.map( (client) => {
            client = {...client};
            //client.status = !!(client.balance > 0) ? 'active' : 'blocked';
            // if ((isShowActive && client.balance > 0) ||
            //    (isShowBlocked && client.balance <=0) ||
            //    (!isShowBlocked && !isShowActive)) {
            return <MobileClient key={client.id} id={client.id} client={client} isCompleted={true} />;
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

    function  deleteTaskFromCompleted (id) {
        // delete client
    };

    async function requestTaskUpdate (clientsNew) {
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

    function setNewPriority (eo) {
        let itemPriority = eo.target.getAttribute('data-priority');
        let itemColor = eo.target.getAttribute('data-color');
        if (priority != itemPriority) {
            setPriority(itemPriority);
            setItemColor(itemColor);
        }
    };

    return (
        (clients.dataLoadState == 2) &&
            <div className='MobileCompany'>
                <div className='MobileCompanyClients'>
                    <div className="tasks-wrapper">{clientsCode}</div>
                </div>
            </div>

    );
};
