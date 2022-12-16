import React, { useState, useEffect, useMemo } from 'react';

import {clientEvents} from './events';

import './MobileClient.css';

export const MobileClient = (props) => {
    const [client, setClient] = useState(props.client);
    const [markedClass, setMarkedClass] = useState(props.markedClass);

    useEffect(
        () => {
            if (props.client !== client) {
                setClient(props.client);

               //console.log("from useEffect: MobileClient id=" + props.id);
            }

            if (props.markedClass != markedClass) {

                setMarkedClass(props.markedClass);
                //console.log("from useEffect: MobileClient id=" + props.id);
            }



            return () => {
                // console.log('MobileClient размонтирован');

            };
        },
        [props.client, props.markedClass]
    );

    const memoizeedRenderResult=useMemo(()=> {
        function editCl() {
            //clientEvents.emit('EClientChanged', client.id);
            clientEvents.emit('EClientChanged', client);
        };

        function deleteCl() {  // Добавить попап/confirm на удаление
            clientEvents.emit('EClientDeleted', client.id);
        };

        function deleteClCompl () {
            clientEvents.emit('EClientComplDeleted', client.id);

        }

        function moveToDone () {
            clientEvents.emit('ETaskCompleted', client);
        };


        console.log("MobileClient id=" + props.id + " render");

        return (
            <div className={(client.color) ? 'MobileClient elem ' +  client.color + ' ' + markedClass : 'MobileClient elem -completed' + ' ' + markedClass}>
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
                            <p className="title">{client.task}</p>
                            <p className="notes">{client.notes}</p>
                            <p className="date">Срок: {client.dateTermination}</p>
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
                            <p className="title">{client.task}</p>
                            <p className="notes">{client.notes}</p>
                            <p className="notes">{client['notes_completed']}</p>
                            <p>Срок выполнения: {client.dateTermination}</p>
                            <p>Дата закрытия задачи: {client.dateCompleted}</p>
                        </div>
                    </>
                }
            </div>
        );
    }, [client.task, client.notes, client.dateTermination, client.balance, client.status, markedClass]);

    return memoizeedRenderResult;
}
