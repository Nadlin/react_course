import React, { useState, useEffect, useMemo } from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {clientEvents} from './events';
import { MobileClient } from './MobileClient';

import { clientsLoad } from "../redux/clientsLoad.js";
import {updateData, updateLoadState} from "../redux/clientsSlice";
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';


export const MobileCompany = () => {
    console.log("render MobileCompany");
    const clientsRedux = useSelector(state=>state.clients);
    const [isShowBlocked, setIsShowBlocked] = useState(false);
    const [isShowActive, setIsShowActive] = useState(false);
    const [isClientChanging, setIsClientChanging] = useState(false);
    const [clientChangingId, setClientChangingId] = useState(false);
    const [isNewClientAdding, setIsNewClientAdding] = useState(false);
    const [changingClient, setChangingClient] = useState({});
    const [priority, setPriority] = useState(4);
    const [itemColor, setItemColor] = useState('green');
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [isConfirmation, setIsConfirmation] = useState(false);
    const [deletedTaskId, setDeletedTaskId] = useState(null);
    const [confirmDeletedTaskId, setConfirmDeletedTaskId] = useState(null);
    const [isTaskDone, setIsTaskDone] = useState(false);
    const [doneTask, setDoneTask] = useState({});
    const [sortPriority, setSortPriority] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [isSearch, setIsSearch] = useState(false);

    const [clientsCurrent, setClientsCurrent] = useState(clientsRedux.clientsCurrent);
    const [clientsCompleted, setClientsCompleted] = useState(clientsRedux.clientsCompleted);

    useEffect(
        ()=>{
            if (clientsRedux.dataLoadState == 0) {
                load();
            }
            if (clientsCurrent != clientsRedux.dataCurrent) {
                setClientsCurrent(clientsRedux.dataCurrent);
                setClientsCompleted(clientsRedux.dataCompleted);
            }

            clientEvents.addListener('EClientChanged', changeClient);
            clientEvents.addListener('EClientDeleted', confirmTaskRemoval);
            clientEvents.addListener('ETaskCompleted', moveTaskToDone);
            return ()=>{
                // console.log('MobileCompany размонтирован');
                clientEvents.removeListener('EClientChanged', changeClient);
                clientEvents.removeListener('EClientDeleted', confirmTaskRemoval);
                clientEvents.removeListener('ETaskCompleted', moveTaskToDone);
            };
        },
        [clientsRedux, clientsCurrent, clientsCompleted]
    );

    const dispatch = useDispatch();
    let clientsCode = [];
    if (clientsCurrent) {
        clientsCode = clientsCurrent.map( (client, i) => {
            client = {...client};
            if ((sortPriority && sortPriority == client.priority) || !sortPriority
            || (isSearch && client.task.indexOf(searchValue) != -1)) {
                return <MobileClient key={client.id} id={client.id} client={client} isCompleted={false} markedClass={(confirmDeletedTaskId && confirmDeletedTaskId == client.id) ? '-marked' : ''} />;
            }
        });
    }
    const newTaskRef = React.createRef();
    const newNotesRef = React.createRef();
    const notesCompletedRef = React.createRef();


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setIsTaskDone(false);
        setIsConfirmation(false);
        setIsClientChanging(false);
        setIsNewClientAdding(false);
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


    function moveTaskToDone (client) {
        let clientNew = {...client}; // нужна ли копия
        setIsTaskDone(true);
        let dateCompleted = new Date();
        clientNew.dateCompleted = dateCompleted.getDate()+"/"+(dateCompleted.getMonth()+1)+"/"+dateCompleted.getFullYear();
        setDoneTask(clientNew);
        handleClickOpen();

    }

    function saveClient () { /*{id:101, task:"Task 1", notes:"Notes 1", dateTermination:"7/12/2022", termination:1670360400000, priority: 3, color: 'yellow', chosen: false},*/
        let cc = {};
        let newTask=newTaskRef.current.value;
        cc.task = newTask;
        let newNotes=newNotesRef.current.value;
        cc.notes = newNotes;
        let dateTerminationValue = value;
        let termination = new Date(dateTerminationValue);
        let terminationTime = termination.getTime();
        cc.termination = terminationTime;
        let dateTermination = termination.getDate()+"/"+(termination.getMonth()+1)+"/"+termination.getFullYear();
        cc.dateTermination = dateTermination; // ?
        cc.priority = priority;
        cc.color = itemColor;
        cc.chosen = false;
        let clientsNew = clientsCurrent.slice();
        if (isNewClientAdding) {
            let timeNow = new Date();
            cc.id = timeNow.getTime();
            setIsNewClientAdding(false);
            clientsNew.push(cc);
        } else if (isClientChanging) {  // как в slice/... удалить, заменить, добавить элемент
            cc.id = clientChangingId;
            let clientIndex;
            for (let i=0; clientsNew.length; i++) {
                if (clientsNew[i].id == clientChangingId) {
                    clientIndex = i;
                    break;
                }
            }
            clientsNew[clientIndex] = cc;
            setIsClientChanging(false);
            setClientChangingId(null);

        }
        setValue(null);
        handleClose();
        requestTaskUpdate(clientsNew, clientsCompleted);
        setChangingClient({});
    };

    function saveDoneTask () {
        let notesValue = notesCompletedRef.current.value;
        let completedTask = {...doneTask, notes_completed: notesValue};
        delete completedTask.chosen;
        delete completedTask.termination;
        delete completedTask.color;
        delete completedTask.priority;
        let currentTasks = clientsCurrent.slice(), taskIndex;
        for (let i=0; currentTasks.length; i++) {
            if (currentTasks[i].id == completedTask.id) {
                taskIndex = i;
                break;
            }
        }
        currentTasks.splice(taskIndex, 1);

        let completedTasks = clientsCompleted.slice();
        completedTasks.push(completedTask);



        handleClose();
        setDoneTask({});
        setIsTaskDone(false);
        requestTaskUpdate(currentTasks, completedTasks);

    };

    function changeClient (client) {/* {id:101, task:"Task 1", notes:"Notes 1", dateTermination:"7/12/2022", termination:1670360400000, priority: 3, color: 'yellow', chosen: false},*/
        setChangingClient(client); // нужен ли ChangingClient?? // нужен  надо проверить
        let timestamp = client.termination;
        let newDate = new Date(timestamp);
        setValue(dayjs(newDate.getFullYear() + '-' + (newDate.getMonth()+1) + '-' + newDate.getDate()));
        setPriority(client.priority);
        setItemColor(client.color);
        if (isClientChanging) {
            newTaskRef.current.value = client.task;
            newNotesRef.current.value = client.notes;
        } else {
            setIsClientChanging(true);
            setClientChangingId(client.id);

        }
        //client. //могу ли я тут менять клиента. Это будут мутабельные изменения?

        handleClickOpen();
    };

    function confirmTaskRemoval (id) {
        setDeletedTaskId(id);
        setIsConfirmation(true);
        handleClickOpen();
    }

    function deleteTask () {

        handleClickOpen();
        let clientsNew = clientsCurrent.slice(), clientIndex;
        for (let i=0; clientsNew.length; i++) {
            if (clientsNew[i].id == deletedTaskId) {
                clientIndex = i;
                break;
            }
        }
        clientsNew.splice(clientIndex, 1);



        handleClose();
        setIsConfirmation(false);
        setConfirmDeletedTaskId(deletedTaskId);
        setTimeout(function () {
            requestTaskUpdate(clientsNew, clientsCompleted);
            setDeletedTaskId(null);
        }, 2000);
      //

        //setConfirmDeletedTaskId(null);
      //



    };

    async function requestTaskUpdate (clientsNew, completedTasks) {
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
                const data=await response.json();
                const dataResult = JSON.parse(data.result);
                let sp1 = new URLSearchParams();
                sp1.append('f', 'UPDATE');
                sp1.append('n', stringName);
                sp1.append('p', updatePassword);
                sp1.append('v', JSON.stringify({current: clientsNew, completed: completedTasks}))
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

    function setNewPrioritySort (eo) {
        let priority = eo.target.getAttribute('data-priority');
        setSortPriority(priority);
    };

    function sortTasks (eo) {
        setSearchValue(eo.target.value);
        setIsSearch(true);
    }

    return (
        <>
            {
                (clientsCurrent) &&
                <div className='MobileCompany'>
                    <div>
                        <input className={(!isShowActive && !isShowBlocked) ? 'active' : ''} type="button" value="Все"
                               onClick={showAll}/>
                        <input className={isShowActive ? 'active' : ''} type="button" value="Активные"
                               onClick={showActive}/>
                        <input className={isShowBlocked ? 'active' : ''} type="button" value="Заблокированные"
                               onClick={showBlocked}/>
                        <input className={isShowBlocked ? 'active' : ''} type="text" value={searchValue}
                               onChange={(eo)=>sortTasks(eo)}/>
                        <fieldset>
                            <legend>Сортировать по приоритетности</legend>
                            <ul className="importance">
                                <li className={sortPriority == 1 ? 'shadow' : ''} title="максимально срочно"
                                    data-color="red" data-priority="1"
                                    onClick={(eo) => setNewPrioritySort(eo)}></li>
                                <li className={sortPriority == 2 ? 'shadow' : ''} title="срочно" data-color="orange"
                                    data-priority="2" onClick={(eo) => setNewPrioritySort(eo)}></li>
                                <li className={sortPriority == 3 ? 'shadow' : ''} title="не срочно"
                                    data-color="yellow" data-priority="3"
                                    onClick={(eo) => setNewPrioritySort(eo)}></li>
                                <li className={sortPriority == 4 ? 'shadow' : ''} title="может подождать"
                                    data-color="green" data-priority="4"
                                    onClick={(eo) => setNewPrioritySort(eo)}></li>
                            </ul>
                        </fieldset>
                        <input class="add-btn" type="button" value="Добавить задачу" onClick={addClient}/>
                    </div>

                    <div className='MobileCompanyClients'>
                        <div className="tasks-wrapper">{clientsCode}</div>
                    </div>

                    {
                        (isClientChanging || isNewClientAdding) &&
                        <Dialog
                            open={open}
                            onClose={handleClose}>

                            <DialogTitle id="alert-dialog-title" onClose={handleClose}>
                                <FontAwesomeIcon icon="fa-regular fa-xmark"/>
                                {isNewClientAdding ? 'Новая задача' : 'Редактирование Задачи'}
                            </DialogTitle>
                            <DialogContent>
                                <div>
                                    <div>
                                        <label>Задача:</label>
                                        <textarea rows="3" cols="50" defaultValue={changingClient.task}
                                                  ref={newTaskRef}></textarea>
                                        <div>
                                        </div>
                                        <label htmlFor="notes-edit">Примечания:</label>
                                        <textarea rows="2" cols="50" defaultValue={changingClient.notes}
                                                  ref={newNotesRef}></textarea>
                                    </div>
                                    <ul className="importance"><label>Приоритетность:</label>
                                        <li className={priority == 1 ? 'shadow' : ''} title="максимально срочно"
                                            data-color="red" data-priority="1"
                                            onClick={(eo) => setNewPriority(eo)}></li>
                                        <li className={priority == 2 ? 'shadow' : ''} title="срочно" data-color="orange"
                                            data-priority="2" onClick={(eo) => setNewPriority(eo)}></li>
                                        <li className={priority == 3 ? 'shadow' : ''} title="не срочно"
                                            data-color="yellow" data-priority="3"
                                            onClick={(eo) => setNewPriority(eo)}></li>
                                        <li className={priority == 4 ? 'shadow' : ''} title="может подождать"
                                            data-color="green" data-priority="4"
                                            onClick={(eo) => setNewPriority(eo)}></li>
                                    </ul>
                                    <label>Срок выполнения:</label>

                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker

                                            defaultValue={changingClient.dateTermination}
                                            inputFormat="DD/MM/YYYY"
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
                                <input type="button" value="СОХРАНИТЬ" onClick={saveClient}/>
                                <input type="button" value="Отмена" onClick={handleClose}/>
                            </DialogActions>

                        </Dialog>
                    }
                    {
                        isConfirmation &&
                        <Dialog open={open} onClose={handleClose}>
                            <DialogTitle>
                                Вы действительно хотите удалить задачу?
                            </DialogTitle>
                            <DialogActions>
                                <input type="button" value="Удалить" onClick={deleteTask}/>
                                <input type="button" value="Отмена" onClick={handleClose}/>
                            </DialogActions>
                        </Dialog>
                    }
                    {
                        isTaskDone &&
                        <Dialog
                            open={open}
                            onClose={handleClose}>
                            <DialogTitle>
                                Задача выполнена
                            </DialogTitle>
                            <DialogContent>
                                <div className="completed-task">
                                    <div className="title">{doneTask.task}</div>
                                    <div className="notes">{doneTask.notes}</div>
                                    <div>
                                        <label>Срок выполнения:</label>
                                        <span>{doneTask.dateTermination}</span>
                                    </div>
                                    <div>
                                        <label>Дата закрытия задачи:</label>
                                        <span>{doneTask.dateCompleted}</span>
                                    </div>
                                    <div>
                                        <label>Примечания:</label>
                                        <textarea rows="2" cols="50" ref={notesCompletedRef}></textarea>
                                    </div>
                                </div>
                            </DialogContent>
                            <DialogActions>
                                <input type="button" value="СОХРАНИТЬ" onClick={saveDoneTask}/>
                                <input type="button" value="Отмена" onClick={handleClose}/>
                            </DialogActions>
                        </Dialog>
                    }
                </div>
            }
            {
                ((clientsRedux.dataLoadState == 0 || clientsRedux.dataLoadState == 1) && !clientsCurrent) &&
                <div>Please wait a bit... Data is loading.</div>
            }
        </>



    );
};
