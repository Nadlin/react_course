import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { PageAbout } from '../pages/PageAbout';
//import { PageCompany } from '../pages/PageCompany';
import { PageClients } from '../pages/PageClients';
//import { PageClient } from '../pages/PageClient';
import {MobileCompany} from "../components/MobileCompany";
import {CompletedTasks} from "../components/CompletedTasks";
//import {useDispatch, useSelector} from 'react-redux';


export const PagesRouter = () => {

          
    return (
      <Routes>
          <Route path="/" element={<PageAbout/>} />
          <Route path="/current" element={<MobileCompany />} />
          <Route path="/completed" element={<CompletedTasks />} />
      </Routes>
    );
    
};
