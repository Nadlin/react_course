import React, { useState, useEffect, useMemo } from 'react';
import {taskEvents} from './events';
import './CurrentTasks.css';

export const Task = (props) => {
    const [task, setTask] = useState(props.task);
    const [markedClass, setMarkedClass] = useState(props.markedClass);

    useEffect(
        () => {
            if (props.task !== task) {
                setTask(props.task);
            }

            if (props.markedClass != markedClass) {
                setMarkedClass(props.markedClass);
            }
            return () => {
            };
        },
        [props.task, props.markedClass]
    );

    const memoizeedRenderResult=useMemo(()=> {
        function editCl() {
            taskEvents.emit('ETaskChanged', task);
        };

        function deleteCl() {
            taskEvents.emit('ETaskDeleted', task.id);
        };

        function deleteClCompl () {
            taskEvents.emit('ETaskComplDeleted', task.id);
        }

        function moveToDone () {
            taskEvents.emit('ETaskCompleted', task);
        };

       // console.log("Task id=" + props.id + " render");

        return (
            <div className={(task.color) ? 'elem ' +  task.color + ' ' + markedClass : 'elem -completed' + ' ' + markedClass}>
                <div className="head"></div>
                {
                    !props.isCompleted &&
                    <>
                        <div className="action">
                            <span className="done" title="Отметить как выполнена" onClick={moveToDone}></span>
                            <span className="edit" title="Редактировать задачу" onClick={editCl}></span>
                            <span className="exit" title="Удалить задачу" onClick={deleteCl}></span>
                        </div>
                        <div className="content">
                            <p className="title">{task.task}</p>
                            <p className="notes">{task.notes}</p>
                            <p className="date">Срок: {task.dateTermination}</p>
                        </div>
                    </>
                }
                {
                    props.isCompleted &&
                    <>
                        <div className="action">
                            <span className="exit" title="Удалить задачу" onClick={deleteClCompl}></span>
                        </div>
                        <div className="content">
                            <p className="title">{task.task}</p>
                            <p className="notes">{task.notes}</p>
                            <p className="notes">{task['notes_completed']}</p>
                            <p>Срок выполнения: {task.dateTermination}</p>
                            <p>Дата закрытия задачи: {task.dateCompleted}</p>
                        </div>
                    </>
                }
            </div>
        );
    }, [task.task, task.notes, task.dateTermination, task.balance, task.status, markedClass]);

    return memoizeedRenderResult;
}
