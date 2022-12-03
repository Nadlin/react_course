import React, { useState, useEffect, useMemo } from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {clientEvents} from './events';
import { MobileClient } from './MobileClient';
import { clientAdd, clientChange, clientDelete } from "../redux/clientsSlice.js";

export const MobileCompany = () => {
    console.log("render MobileCompany");
    const clients = useSelector(state=>state.clients);

    const [isShowBlocked, setIsShowBlocked] = useState(false);
    const [isShowActive, setIsShowActive] = useState(false);
    const [isClientChanging, setIsClientChanging] = useState(false);
    const [isNewClientAdding, setIsNewClientAdding] = useState(false);
    const [changingClient, setChangingClient] = useState({});

    useEffect(
        ()=>{
            clientEvents.addListener('EClientChanged', changeClient);
            clientEvents.addListener('EClientDeleted', deleteClient);
            //console.log("From useEffect: MobileCompany");
            return ()=>{
               // console.log('MobileCompany размонтирован');
                clientEvents.removeListener('EClientChanged', changeClient);
                clientEvents.removeListener('EClientDeleted', deleteClient);
            };
        },
        [clients]
    );

    const dispatch = useDispatch();

    const clientsCode = clients.map( (client, i) => {
            client = {...client};
            client.status = !!(client.balance > 0) ? 'active' : 'blocked';
            if ((isShowActive && client.balance > 0) ||
                (isShowBlocked && client.balance <=0) ||
                (!isShowBlocked && !isShowActive)) {
                return <MobileClient key={client.id} id={client.id} client={client} />;
            }
        });

    const newFamRef = React.createRef();
    const newImRef = React.createRef();
    const newOtchRef = React.createRef();
    const newBalanceRef = React.createRef();

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
    };

    function saveClient () {
        let cc = {...changingClient};
        if (newFamRef.current) {
            let newFam=newFamRef.current.value;
            cc.fam = newFam;
        }
        if (newImRef.current) {
            let newIm=newImRef.current.value;
            cc.im = newIm;
        }
        if (newOtchRef.current) {
            let newOtch=newOtchRef.current.value;
            cc.otch = newOtch;
        }
        if (newBalanceRef.current) {
            let newBalance=newBalanceRef.current.value;
            cc.balance = parseInt(newBalance);
        }

        if (isNewClientAdding) {
            let maxId = 1;
            clients.forEach((client, i) => {
                maxId = (client.id > 1) ? client.id : maxId;
            })
            cc.id = maxId + 5;
            setIsNewClientAdding(false);
            dispatch(clientAdd(cc));
        } else if (isClientChanging) {
            setIsClientChanging(false);
            dispatch(clientChange(cc));
        }
        setChangingClient({});
    };

    function changeClient (id) {
        let client, clientCh;
        for ( let i=0; clients.length; i++) {
            client = clients[i];
            if (client.id == id) {
                clientCh = clients[i];
                break;
            }
        }
        setChangingClient(clientCh);
        if (isClientChanging) {
            newFamRef.current.value = clientCh.fam;
            newImRef.current.value = clientCh.im;
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

    return (
        <div className='MobileCompany'>
            <input className={(!isShowActive && !isShowBlocked) ? 'active' : ''} type="button" value="Все" onClick={showAll} />
            <input className={isShowActive ? 'active' : '' } type="button" value="Активные" onClick={showActive} />
            <input className={isShowBlocked ?'active' : ''} type="button" value="Заблокированные" onClick={showBlocked} />
            <table className='MobileCompanyClients'>
                <thead>
                <tr>
                    <th>Фамилия</th>
                    <th>Имя</th>
                    <th>Отчество</th>
                    <th>Баланс</th>
                    <th>Статус</th>
                    <th>Редактировать</th>
                    <th>Удалить</th>
                </tr>
                </thead>
                <tbody>{clientsCode}</tbody>
            </table>
            <input type="button" value="Добавить клиента" onClick={addClient} />
            {
                (isClientChanging || isNewClientAdding) &&
                <div>
                    <label>Фамилия:</label>
                    <input type="text" defaultValue={changingClient.fam} ref={newFamRef} /><br/>
                    <label>Имя:</label>
                    <input type="text" defaultValue={changingClient.im} ref={newImRef} /><br/>
                    <label>Отчество:</label>
                    <input type="text" defaultValue={changingClient.otch} ref={newOtchRef} /><br/>
                    <label>Баланс:</label>
                    <input type="text" defaultValue={changingClient.balance} ref={newBalanceRef} /><br/>
                    <input type="button" value="Сохранить" onClick={saveClient} />
                </div>
            }
        </div>
    );
};
