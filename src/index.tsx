import React from 'react';
import ReactDOM from 'react-dom';
import "./styles/globals.css";
import "./styles/styles.css";
import "./styles/emotion.css";

import 'react-quill/dist/quill.snow.css';
import 'react-responsive-modal/styles.css';
// import 'react-responsive-modal/styles.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'react-perfect-scrollbar/dist/css/styles.css';

import 'react-toastify/dist/ReactToastify.css';
import App from './App';
import { ToastContainer } from 'react-toastify'
import reportWebVitals from './reportWebVitals';
import {Provider} from "react-redux";
import store from "./store/store";
import AppWrapper from './components/ui/AppWrapper';
import EmotionList from './components/emotion/EmotionList';
import { BrowserRouter } from 'react-router-dom';
ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <ToastContainer />
      <EmotionList/>
      <AppWrapper>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AppWrapper>
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
