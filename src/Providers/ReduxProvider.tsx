"use client";
import { store } from '@/redux/store/store';
import React from 'react';
interface ReduxProviderProps {
    children: React.ReactNode;
}
import { Provider } from 'react-redux';

const ReduxProvider = ({children}:ReduxProviderProps) => {

    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
};

export default ReduxProvider;