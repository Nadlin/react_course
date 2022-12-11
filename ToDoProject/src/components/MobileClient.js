import React, { useState, useEffect, useMemo } from 'react';

import {clientEvents} from './events';

import './MobileClient.css';

export const MobileClient = (props) => {
    const [client, setClient] = useState(props.client);
    useEffect(
        () => {
            if (props.client !== client) {
                setClient(props.client);
               //console.log("from useEffect: MobileClient id=" + props.id);
            }
            return () => {
                // console.log('MobileClient размонтирован');
            };
        },
        [props.client]
    );

    const memoizeedRenderResult=useMemo(()=> {
        function editCl() {
            clientEvents.emit('EClientChanged', client.id);
        };

        function deleteCl() {
            clientEvents.emit('EClientDeleted', client.id);
        };

        console.log("MobileClient id=" + props.id + " render");

        return (
            <div className={'MobileClient elem ' + client.color}>
                <div className="head"></div>
                <div className="action">
                    <span className="done" title="Отметить как выполнена"></span>
                    <span className="edit" title="Редактировать задачу" onClick={editCl}></span>
                    <span className="exit" title="Удалить задачу" onClick={deleteCl}></span>
                </div>
                <div className="content">
                    <p className="title">{client.task}</p>
                    <p className="notes">{client.notes}</p>
                    <p className="date">Срок: {client.dateTermination}</p>
                </div>
            </div>
        );
    }, [client.task, client.notes, client.dateTermination, client.balance, client.status]);

    return memoizeedRenderResult;
}
/*
{id:101, task:"Task 1", notes:"Notes 1", dateTermination:"7/12/2022", termination:1670360400000, priority: 3, color: 'yellow', chosen: false},
{id:102, task:"Task 2", notes:"Notes 2", dateTermination:"8/12/2022", termination:1670360400000, priority: 3, color: 'green', chosen: false},
{id:103, task:"Task 3", notes:"Notes 3", dateTermination:"29/12/2022", termination:1670360400000, priority: 3, color: 'red', chosen: false},
{id:104, task:"Task 4", notes:"Notes 4", dateTermination:"13/12/2022", termination:1670360400000, priority: 3, color: 'orrange', chosen: false},
 */