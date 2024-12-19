
import { Provider } from 'react-redux';
import { store, persistor } from '../redux/store/store';
import { PersistGate } from 'redux-persist/integration/react';
import React from "react";

export const renderWithProviders= (component: JSX.Element): JSX.Element  => {
    return (
      <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        { component }
      </PersistGate>
      </Provider>
      );
    };
