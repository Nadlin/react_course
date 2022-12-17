import React from 'react';
import { NavLink } from 'react-router-dom';
import {useSelector} from 'react-redux';
import './PagesLinks.css';

export const PagesLinks = () => {
    const tasks = useSelector(state=>state.tasks);
    function getLinkClass(obj) {
        let className="menu-link";
        if ( obj.isActive )
            className+=" -active";
        return className;
    }

    console.log('render menu');

    return (
        <header>
            <NavLink to="/current" className={getLinkClass}>
                <span>Текущие задачи</span>
                {
                    tasks.dataLoadState == 2 &&
                    <span className="count">{tasks.dataCurrent.length}</span>
                }
            </NavLink>
            <NavLink to="/completed" className={getLinkClass}>
                <span>Выполненные задачи</span>
                {
                    tasks.dataLoadState == 2 &&
                    <span className="count">{tasks.dataCompleted.length}</span>
                }
            </NavLink>
            <NavLink to="/" className={getLinkClass}>
                <span>Lorem</span>
            </NavLink>
        </header>
    );
};
