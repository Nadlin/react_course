import React, { useState, useEffect, useMemo } from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {taskEvents} from './events';
import { Task } from './Task';
import './CurrentTasks.css';
import { tasksLoad } from "../redux/tasksLoad.js";
import {updateLoadState} from "../redux/tasksSlice";
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import {useSearchParams, useNavigate} from "react-router-dom";

export const CurrentTasks = () => {
    //console.log("render CurrentTasks");
    const tasksRedux = useSelector(state=>state.tasks);
    const [isShowBlocked, setIsShowBlocked] = useState(false);
    const [isShowActive, setIsShowActive] = useState(false);
    const [isTaskChanging, setIsTaskChanging] = useState(false);
    const [taskChangingId, setTaskChangingId] = useState(false);
    const [isNewTaskAdding, setIsNewTaskAdding] = useState(false);
    const [changingTask, setChangingTask] = useState({});
    const [priority, setPriority] = useState(4);
    const [itemColor, setItemColor] = useState('green');
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [isConfirmation, setIsConfirmation] = useState(false);
    const [deletedTaskId, setDeletedTaskId] = useState(null);
    const [confirmDeletedTaskId, setConfirmDeletedTaskId] = useState(null);
    const [isTaskDone, setIsTaskDone] = useState(false);
    const [doneTask, setDoneTask] = useState({});
    const [searchParams, setSearchParams] = useSearchParams();
    const [isSortByDate, setIsSortByDate] = useState(false);
    const [isSortByPriority, setIsSortByPriority] = useState(false);
    const [sortPriority, setSortPriority] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [isSearch, setIsSearch] = useState(false);
    const [isExpired, setIsExpired] = useState(false);
    const [tasksCurrent, setTasksCurrent] = useState(tasksRedux.dataCurrent);
    const [tasksCompleted, setTasksCompleted] = useState(tasksRedux.dataCompleted);

    let params = new URLSearchParams(searchParams);
    let navigate = useNavigate();

    useEffect(
        ()=>{
            if (tasksRedux.dataLoadState == 0) {
                load();
            }
            if (tasksCurrent != tasksRedux.dataCurrent) {
                setTasksCurrent(tasksRedux.dataCurrent);
                setTasksCompleted(tasksRedux.dataCompleted);
            }

            setIsSortByDate(searchParams.get('date') ? true : false);
            setIsSortByPriority(searchParams.get('priority') ? true : false);
            setSortPriority(searchParams.get('priority') ? searchParams.get('priority') : null);
            setSearchValue(searchParams.get('search') ? searchParams.get('search') : '');
            setIsSearch( searchParams.get('search') ? true : false);
            setIsExpired(searchParams.get('expired') ? true : false);

            if (tasksRedux.dataCurrent) {
                let tasksFilteredT = tasksRedux.dataCurrent,
                    tasksFiltered = tasksFilteredT.slice(),
                    dateNow = new Date(),
                    dateTime = dateNow.getTime();

                if (isSearch) {
                    tasksFiltered = tasksFiltered.filter(task => task.task.includes(searchValue) || task.notes.includes(searchValue));
                }

                if (isExpired) {
                    tasksFiltered = tasksFiltered.filter(task => task.termination < dateTime);
                }

                if (isSortByDate) {
                   tasksFiltered.sort(function(a, b) {
                        return  a.termination - b.termination;
                    });
                }

                if (isSortByPriority) {
                    tasksFiltered = tasksFiltered.filter(task => task.priority == sortPriority);
                }

                setTasksCurrent(tasksFiltered);
            }
            taskEvents.addListener('ETaskChanged', changeTask);
            taskEvents.addListener('ETaskDeleted', confirmTaskRemoval);
            taskEvents.addListener('ETaskCompleted', moveTaskToDone);
            return ()=>{
                taskEvents.removeListener('ETaskChanged', changeTask);
                taskEvents.removeListener('ETaskDeleted', confirmTaskRemoval);
                taskEvents.removeListener('ETaskCompleted', moveTaskToDone);
            };
        },
        [tasksRedux, isSearch, isExpired, isSortByDate, isSortByPriority, searchValue, sortPriority, searchParams]
    );

    const dispatch = useDispatch();
    let tasksCode = [];

    if (tasksCurrent) {
        tasksCode = tasksCurrent.map( (task, i) => {
            task = {...task};
            return <Task key={task.id} id={task.id} task={task} isCompleted={false} markedClass={(confirmDeletedTaskId && confirmDeletedTaskId == task.id) ? '-marked' : ''} />;
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
        setIsTaskChanging(false);
        setIsNewTaskAdding(false);
    };

    function load () {
        dispatch(tasksLoad);
    }

    function addTask () {
        setIsNewTaskAdding(true);
        handleClickOpen();
    };

    function moveTaskToDone (task) {
        let taskNew = {...task}; // нужна ли копия
        setIsTaskDone(true);
        let dateCompleted = new Date();
        taskNew.dateCompleted = dateCompleted.getDate()+"/"+(dateCompleted.getMonth()+1)+"/"+dateCompleted.getFullYear();
        setDoneTask(taskNew);
        handleClickOpen();

    }

    function saveTask () {
        let cc = {};
        let newTask=newTaskRef.current.value;
        cc.task = newTask;
        let newNotes=newNotesRef.current.value;
        cc.notes = newNotes;
        let dateTerminationValue = value;
        let termination = new Date(dateTerminationValue);
        let terminationTime = termination.getTime();
        cc.termination = (value) ? terminationTime : 9999999999999;
        let dateTermination = (value) ? termination.getDate()+"/"+(termination.getMonth()+1)+"/"+termination.getFullYear() : '-';
        cc.dateTermination = dateTermination;
        cc.priority = priority;
        cc.color = itemColor;
        cc.chosen = false;
        let tasksNew = tasksRedux.dataCurrent.slice();
        if (isNewTaskAdding) {
            let timeNow = new Date();
            cc.id = timeNow.getTime();
            setIsNewTaskAdding(false);
            tasksNew.push(cc);
        } else if (isTaskChanging) {
            cc.id = taskChangingId;
            let taskIndex;
            for (let i=0; tasksNew.length; i++) {
                if (tasksNew[i].id == taskChangingId) {
                    taskIndex = i;
                    break;
                }
            }
            tasksNew[taskIndex] = cc;
            setIsTaskChanging(false);
            setTaskChangingId(null);

        }
        setValue(null);
        handleClose();
        requestTaskUpdate(tasksNew, tasksCompleted);
        setChangingTask({});
    };

    function saveDoneTask () {
        let notesValue = notesCompletedRef.current.value;
        let completedTask = {...doneTask, notes_completed: notesValue};
        delete completedTask.chosen;
        delete completedTask.termination;
        delete completedTask.color;
        delete completedTask.priority;
        let currentTasks = tasksCurrent.slice(), taskIndex;
        for (let i=0; currentTasks.length; i++) {
            if (currentTasks[i].id == completedTask.id) {
                taskIndex = i;
                break;
            }
        }
        currentTasks.splice(taskIndex, 1);

        let completedTasks = tasksCompleted.slice();
        completedTasks.push(completedTask);
        handleClose();
        setDoneTask({});
        setIsTaskDone(false);
        requestTaskUpdate(currentTasks, completedTasks);
    };

    function changeTask (task) {
        setChangingTask(task);
        let timestamp = task.termination;
        let newDate = new Date(timestamp);
        setValue(dayjs(newDate.getFullYear() + '-' + (newDate.getMonth()+1) + '-' + newDate.getDate()));
        setPriority(task.priority);
        setItemColor(task.color);
        if (isTaskChanging) {
            newTaskRef.current.value = task.task;
            newNotesRef.current.value = task.notes;
        } else {
            setIsTaskChanging(true);
            setTaskChangingId(task.id);

        }
        handleClickOpen();
    };

    function confirmTaskRemoval (id) {
        setDeletedTaskId(id);
        setIsConfirmation(true);
        handleClickOpen();
    }

    function deleteTask () {
        handleClickOpen();
        let tasksNew = tasksCurrent.slice(), taskIndex;
        for (let i=0; tasksNew.length; i++) {
            if (tasksNew[i].id == deletedTaskId) {
                taskIndex = i;
                break;
            }
        }
        tasksNew.splice(taskIndex, 1);
        handleClose();
        setIsConfirmation(false);
        setConfirmDeletedTaskId(deletedTaskId);
        setTimeout(function () {
            requestTaskUpdate(tasksNew, tasksCompleted);
            setDeletedTaskId(null);
        }, 2000);
    };

    async function requestTaskUpdate (tasksNew, completedTasks) {
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
                sp1.append('v', JSON.stringify({current: tasksNew, completed: completedTasks}))
                const response1=await fetch('https://fe.it-academy.by/AjaxStringStorage2.php', {
                    method : 'POST',
                    body: sp1
                });
                if ( response1.ok ) {
                    dispatch(tasksLoad);
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

    function showByDate() {
        setIsSortByDate(!isSortByDate);
        !isSortByDate ? params.set('date', 1) : params.delete('date');
        navigate('/current?' + params.toString());
    }

    function showExpired () {
        setIsExpired(!isExpired);
        !isExpired ? params.set('expired', 1) : params.delete('expired');
        navigate('/current?' + params.toString());
    };

    function searchText (eo) {
        let newValue = eo.target.value;
        setSearchValue(newValue);
        if (newValue != '') {
            setIsSearch(true);
            params.set('search', newValue);
        } else {
            setIsSearch(false);
            if (params.has('search')) {
                params.delete('search')
            }
        }
        navigate('/current?' + params.toString());
    };

    function showByPriority (eo) {
        let priority = eo.target.getAttribute('data-priority');
        if (priority != sortPriority) {
            setIsSortByPriority(true);
            setSortPriority(priority);
            params.set('priority', priority)
        } else {
            setIsSortByPriority(false);
            setSortPriority(null);
            params.delete('priority');
        }

        (priority == sortPriority) ? params.delete('priority') : params.set('priority', priority);
        navigate('/current?' + params.toString());
    };


    function showAll () {
        setIsSortByDate(false);
        setIsExpired(false);
        setSearchValue('');
        setIsSearch(false);
        setIsSortByPriority(false);
        setSortPriority(null);
        setSearchParams({});
    };

    return (
        <>
            {
                (tasksCurrent) &&
                <div className='CurrentTasks'>
                    <div className="panel">
                        <input className={(!isSortByDate && !isExpired && !isSearch && !isSortByPriority) ? 'active' : ''} type="button" value="Все"
                               onClick={showAll}/>
                        <input className={isSortByDate ? 'active' : ''} type="button" value="По сроку выполнения"
                               onClick={showByDate}/>
                        <input className={isExpired ? 'active' : ''} type="button" value="Просроченные"
                               onClick={showExpired}/>
                        <input type="text" value={searchValue}
                               onChange={(eo)=>searchText(eo)}/>
                        <fieldset>
                            <legend>Сортировать по приоритетности</legend>
                            <ul className="importance">
                                <li className={sortPriority == 1 ? 'shadow' : ''} title="максимально срочно"
                                    data-color="red" data-priority="1"
                                    onClick={(eo) => showByPriority(eo)}></li>
                                <li className={sortPriority == 2 ? 'shadow' : ''} title="срочно" data-color="orange"
                                    data-priority="2" onClick={(eo) => showByPriority(eo)}></li>
                                <li className={sortPriority == 3 ? 'shadow' : ''} title="не срочно"
                                    data-color="yellow" data-priority="3"
                                    onClick={(eo) => showByPriority(eo)}></li>
                                <li className={sortPriority == 4 ? 'shadow' : ''} title="может подождать"
                                    data-color="green" data-priority="4"
                                    onClick={(eo) => showByPriority(eo)}></li>
                            </ul>
                        </fieldset>
                        <input className="add-btn" type="button" value="Добавить задачу" onClick={addTask}/>
                    </div>
                    <div className="tasks-wrapper">{tasksCode}</div>
                    {
                        (isTaskChanging || isNewTaskAdding) &&
                        <Dialog
                            open={open}
                            onClose={handleClose}>

                            <DialogTitle id="alert-dialog-title" onClose={handleClose}>
                                {isNewTaskAdding ? 'Новая задача' : 'Редактирование Задачи'}
                            </DialogTitle>
                            <DialogContent>
                                <div>
                                    <div>
                                        <label>Задача:</label>
                                        <textarea rows="3" cols="50" defaultValue={changingTask.task}
                                                  ref={newTaskRef}></textarea>
                                        <div>
                                        </div>
                                        <label htmlFor="notes-edit">Примечания:</label>
                                        <textarea rows="2" cols="50" defaultValue={changingTask.notes}
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

                                            defaultValue={changingTask.dateTermination}
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
                                <input type="button" value="СОХРАНИТЬ" onClick={saveTask}/>
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
                ((tasksRedux.dataLoadState == 0 || tasksRedux.dataLoadState == 1) && !tasksCurrent) &&
                <div>Please wait a bit... Data is loading.</div>
            }
        </>
    );
};
