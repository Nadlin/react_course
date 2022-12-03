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
            <tr className='MobileClient'>
                <td>{client.fam}</td>
                <td>{client.im}</td>
                <td>{client.otch}</td>
                <td>{client.balance}</td>
                <td className={client.status}>{client.status}</td>
                <td><input type="button" value="Редактировать" onClick={editCl}/></td>
                <td><input type="button" value="Удалить" onClick={deleteCl}/></td>
            </tr>
        );
    }, [client.fam, client.im, client.otch, client.balance, client.status]);

    return memoizeedRenderResult;
}

