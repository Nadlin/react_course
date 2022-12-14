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


export const MobileCompany = () => {
    console.log("render MobileCompany");
    const clients = useSelector(state=>state.clients);
    /*const clients = [ // ?
        {id:101, fam:"Иванов", im:"Иван", otch:"Иванович", balance:-200},
        {id:105, fam:"Сидоров", im:"Сидор", otch:"Сидорович", balance:250},
        {id:110, fam:"Петров", im:"Пётр", otch:"Петрович", balance:180},
        {id:120, fam:"Григорьев", im:"Григорий", otch:"Григорьевич", balance:-220}
    ];*/

    /*const clients = [ // ?
        {id:101, task:"Task 1", notes:"Notes 1", dateTermination:"7/12/2022", termination:1670360400000, priority: 3, color: 'yellow', chosen: false},
        {id:102, task:"Task 2", notes:"Notes 2", dateTermination:"8/12/2022", termination:1670360400000, priority: 3, color: 'green', chosen: false},
        {id:103, task:"Task 3", notes:"Notes 3", dateTermination:"29/12/2022", termination:1670360400000, priority: 3, color: 'red', chosen: false},
        {id:104, task:"Task 4", notes:"Notes 4", dateTermination:"13/12/2022", termination:1670360400000, priority: 3, color: 'orange', chosen: false},
    ];*/
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
            load();
            clientEvents.addListener('EClientChanged', changeClient);
            clientEvents.addListener('EClientDeleted', deleteClient);
            return ()=>{
                // console.log('MobileCompany размонтирован');
                clientEvents.removeListener('EClientChanged', changeClient);
                clientEvents.removeListener('EClientDeleted', deleteClient);
            };
        },
        []
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
        clientsCode = clients.dataCurrent.map( (client, i) => {
            client = {...client};
            //client.status = !!(client.balance > 0) ? 'active' : 'blocked';
            // if ((isShowActive && client.balance > 0) ||
            //    (isShowBlocked && client.balance <=0) ||
            //    (!isShowBlocked && !isShowActive)) {
            return <MobileClient key={client.id} id={client.id} client={client} />;
            //}
        });
    }


    const newFamRef = React.createRef();
    const newImRef = React.createRef();
    const newOtchRef = React.createRef();
    const newBalanceRef = React.createRef();


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    function load () {
        dispatch(clientsLoad);
    }

    function showAll () {
        setIsShowActive(false);
        setIsShowBlocked(false);
    };

    function showActive () {
        setIsShowActive(true);
        setIsShowBlocked(false);
    };

    function showBlocked () {
        setIsShowBlocked(true);
        setIsShowActive(false);
    };

    function addClient () {
        setIsNewClientAdding(true);
        handleClickOpen();
    };

    function saveClient () { /*{id:101, task:"Task 1", notes:"Notes 1", dateTermination:"7/12/2022", termination:1670360400000, priority: 3, color: 'yellow', chosen: false},*/
        let cc = {...changingClient};
        let timeNow = new Date();
        cc.id = timeNow.getTime();
   //     if (newFamRef.current) {
            let newFam=newFamRef.current.value;
            cc.task = newFam;
    //    }
    //    if (newImRef.current) {
            let newIm=newImRef.current.value;
            cc.notes = newIm;
   //     }
     //   if (newOtchRef.current) {
           // let dateTermination=newOtchRef.current.value;
        let dateTerminationValue = value;
        let termination = new Date(dateTerminationValue);
       let terminationTime = termination.getTime();
        cc.termination = terminationTime;
        let dateTermination = termination.getDate()+"/"+(termination.getMonth()+1)+"/"+termination.getFullYear();
            cc.dateTermination = dateTermination; // ?
          //  dateTermination = new Date(dateTermination);
     //   }
          //  cc.termination = dateTermination.getTime();
    //    if (newBalanceRef.current) {
          //  let newBalance=newBalanceRef.current.value;
           // cc.balance = parseInt(newBalance);
   //     }
        cc.priority = priority;
        cc.color = itemColor;
        cc.chosen = false;
        if (isNewClientAdding) {
         /*   let maxId = 1;
            clients.forEach((client, i) => {
                maxId = (client.id > 1) ? client.id : maxId;
            })
            cc.id = maxId + 5;*/
            handleClose();
            setIsNewClientAdding(false);
            setValue(null);
            //dispatch(clientAdd(cc));

            let clientsNew = clients.dataCurrent.slice();
            clientsNew.push(cc);

            requestTaskUpdate(clientsNew);



        } else if (isClientChanging) {
            setIsClientChanging(false);
            dispatch(clientChange(cc));
        }
        setChangingClient({});
    };

    function changeClient (id) {/* {id:101, task:"Task 1", notes:"Notes 1", dateTermination:"7/12/2022", termination:1670360400000, priority: 3, color: 'yellow', chosen: false},*/
        let client, clientCh;
        for ( let i=0; clients.length; i++) { // ПОЧЕМУ CLIENTS null
            client = clients[i];
            if (client.id == id) {
                clientCh = clients[i];
                break;
            }
        }
        setChangingClient(clientCh);
        if (isClientChanging) {
            newFamRef.current.value = clientCh.task;
            newImRef.current.value = clientCh.notes;
            newOtchRef.current.value = clientCh.otch;
            newBalanceRef.current.value = clientCh.balance;

        } else {
            setIsClientChanging(true);
        }
    };

    function deleteClient (id) {
        if (isClientChanging && changingClient.id == id) {
            setIsClientChanging(false);
            setChangingClient({});
        }
        dispatch(clientDelete(id));
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
                <input className={(!isShowActive && !isShowBlocked) ? 'active' : ''} type="button" value="Все" onClick={showAll} />
                <input className={isShowActive ? 'active' : '' } type="button" value="Активные" onClick={showActive} />
                <input className={isShowBlocked ?'active' : ''} type="button" value="Заблокированные" onClick={showBlocked} />
                <input type="button" value="Добавить задачу" onClick={addClient} />
                <div className='MobileCompanyClients'>
                    <div className="tasks-wrapper">{clientsCode}</div>
                </div>

                {
                    (isClientChanging || isNewClientAdding) &&
                <Dialog
                    open={open}
                    onClose={handleClose}>

                    <DialogTitle id="alert-dialog-title" onClose={handleClose}>
                        <FontAwesomeIcon icon="fa-regular fa-xmark" />
                        {isNewClientAdding ? 'Редактирование Задачи' : 'Новая задача'}
                    </DialogTitle>
                    <DialogContent>

                            <div>
                                <div class="issue">
                                    <label>Задача:</label>
                                    <textarea rows="3" cols="50" defaultValue={changingClient.task} ref={newFamRef}></textarea>
                                    <div>
                                </div>
                                    <label htmlFor="notes-edit">Примечания:</label>
                                    <textarea rows="2" cols="50" defaultValue={changingClient.notes} ref={newImRef}></textarea>
                                </div>
                                <ul className="importance"><label>Приоритетность:</label>
                                    <li className={priority == 1 ? 'shadow' : ''} title="максимально срочно" data-color="red" data-priority="1" onClick={(eo)=>setNewPriority(eo)}></li>
                                    <li className={priority == 2 ? 'shadow' : ''} title="срочно" data-color="orange" data-priority="2" onClick={(eo)=>setNewPriority(eo)}></li>
                                    <li className={priority == 3 ? 'shadow' : ''} title="не срочно" data-color="yellow" data-priority="3" onClick={(eo)=>setNewPriority(eo)}></li>
                                    <li className={priority == 4 ? 'shadow' : ''} title="может подождать" data-color="green" data-priority="4" onClick={(eo)=>setNewPriority(eo)}></li>
                                </ul>
                                <label>Срок выполнения:</label>

                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker

                                        defaultValue={changingClient.dateTermination}
                                        inputFormat="DD/MM/YY"
                                        value={value}
                                        onChange={(newValue) => {
                                            setValue(newValue);
                                        }}
                                        renderInput={(params) => <TextField {...params}  />}
                                    />
                                </LocalizationProvider>
                            </div>

                    </DialogContent>
                    <DialogActions>
                        <input type="button" value="СОХРАНИТЬ" onClick={saveClient} />
                        <input type="button" value="Отмена" onClick={handleClose} />
                    </DialogActions>

                </Dialog>
                }
            </div>

    );
};
