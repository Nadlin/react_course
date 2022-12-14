import React from 'react';
import { Provider } from 'react-redux';

import { store } from './redux/store'

import { MobileCompany } from "./components/MobileCompany";


import { BrowserRouter } from 'react-router-dom';
import { PagesLinks } from './components/PagesLinks';
import { PagesRouter } from './routes/PagesRouter';

import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

export const App = () => (
    <BrowserRouter>
        <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <div>
                    <PagesLinks />
                    <PagesRouter />
                </div>
            </LocalizationProvider>

        </Provider>
    </BrowserRouter>

);
