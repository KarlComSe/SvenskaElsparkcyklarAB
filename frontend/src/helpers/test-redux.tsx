import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import authReducer from "../redux/slices/authLogin";
import {  persistor } from '../redux/store/store';

import { PersistGate } from 'redux-persist/integration/react';
export const renderWithProviders = (
  component: React.ReactElement,
  preloadedState = {}
  ) => {

   const store = configureStore({
      reducer: {
        auth: authReducer,
      },
      preloadedState,
    })
  return (
        <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        { component }
      </PersistGate>
      </Provider>)
};