import React from 'react';
import { Provider } from 'react-redux';

import { store } from './redux/store'

import { MobileCompany } from "./components/MobileCompany";

export const App = () => (
    <Provider store={store}>
        <div>
            <MobileCompany />
        </div>
    </Provider>
);
