import React from 'react';
import { NavLink } from 'react-router-dom';
import {useSelector} from 'react-redux';
import './PagesLinks.css';

export const PagesLinks = () => {
    const clients = useSelector(state=>state.clients);
    function getLinkClass(obj) {
        let className="menu-link";
        if ( obj.isActive )
            className+=" -active";
        return className;
    }

    return (
        <header>
            <NavLink to="/current" className={getLinkClass}>
                <span>Текущие задачи</span>
                {
                    clients.dataLoadState == 2 &&
                    <span className="count">{clients.dataCurrent.length}</span>
                }

            </NavLink>
            <NavLink to="/completed" className={getLinkClass}>
                <span>Выполненные задачи</span>
                {
                    clients.dataLoadState == 2 &&
                    <span className="count">{clients.dataCompleted.length}</span>
                }

            </NavLink>
        </header>
    );

};
