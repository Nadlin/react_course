import React from 'react';
import { Provider } from 'react-redux';

import { store } from './redux/store'

import { MobileCompany } from "./components/MobileCompany";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

export const App = () => (
    <Provider store={store}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <div>
                <MobileCompany />
            </div>
        </LocalizationProvider>

    </Provider>
);
