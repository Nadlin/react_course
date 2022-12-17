import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { PageAbout } from '../pages/PageAbout';
import {CurrentTasks} from "../components/CurrentTasks";
import {CompletedTasks} from "../components/CompletedTasks";

export const PagesRouter = () => {
          
    return (
      <Routes>
          <Route path="/" element={<PageAbout/>} />
          <Route path="/current" element={<CurrentTasks />} />
          <Route path="/current:jj" element={<CurrentTasks />} />
          <Route path="/completed" element={<CompletedTasks />} />
      </Routes>
    );
    
};
