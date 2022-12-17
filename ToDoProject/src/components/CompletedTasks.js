import React, { useState, useEffect, useMemo } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {taskEvents} from './events';
import { Task } from './Task';
import { tasksLoad } from "../redux/tasksLoad.js";
import {updateLoadState} from "../redux/tasksSlice";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import './CurrentTasks.css';

export const CompletedTasks = () => {
    //console.log("render CompletedTasks");
    const tasksRedux = useSelector(state=>state.tasks);
    const [open, setOpen] = useState(false);
    const [isConfirmation, setIsConfirmation] = useState(false);
    const [completedTaskId, setCompletedTaskId] = useState(null);
    const [confirmDeletedTaskId, setConfirmDeletedTaskId] = useState(null);

    useEffect(
        ()=>{
            if (tasksRedux.dataLoadState == 0) {
                load();
            }
            taskEvents.addListener('ETaskComplDeleted', confirmTaskRemoval);
            return ()=>{
                taskEvents.removeListener('ETaskComplDeleted', confirmTaskRemoval);
            };
        },
        [tasksRedux.dataCompleted]
    );

    const dispatch = useDispatch();
    let tasksCode = [];
    if (tasksRedux.dataCompleted) {
        tasksCode = tasksRedux.dataCompleted.map( (task) => {
            task = {...task};
            return <Task key={task.id} id={task.id} task={task} isCompleted={true} markedClass={(confirmDeletedTaskId && confirmDeletedTaskId == task.id) ? '-marked' : '-uuu'} />;
        });
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    function load () {
        dispatch(tasksLoad);
    }

    function confirmTaskRemoval (id) {
        setCompletedTaskId(id);
        setIsConfirmation(true);
        handleClickOpen();
    }

    function  deleteTaskFromCompleted () {
        let completedTasks = tasksRedux.dataCompleted.slice(), taskIndex;
        for (let i=0; completedTasks.length; i++) {
            if (completedTasks[i].id == completedTaskId) {
                taskIndex = i;
                break;
            }
        }
        completedTasks.splice(taskIndex, 1);
        handleClose();
        setIsConfirmation(false);
        setConfirmDeletedTaskId(completedTaskId);
        setTimeout(function () {
            requestTaskUpdate(tasksRedux.dataCurrent, completedTasks);
            setCompletedTaskId(null);
        }, 2000);
    };

    async function requestTaskUpdate (currentTasks, completedTasks) {
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
                sp1.append('v', JSON.stringify({current: currentTasks, completed: completedTasks}))
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

    return (
        <>
            {
                (tasksRedux.dataCompleted) &&
                <div>
                    <div className="tasks-wrapper">{tasksCode}</div>
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
                ((tasksRedux.dataLoadState == 0 || tasksRedux.dataLoadState == 1) && !tasksRedux.dataCompleted)  &&
                <div>Please wait a bit... Data is loading.</div>
            }
        </>



    );
};
