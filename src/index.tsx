import React from 'react';
import ReactDOM from 'react-dom';
import "./styles/globals.css";
import "./styles/styles.css";
import 'react-quill/dist/quill.snow.css';
import 'react-responsive-modal/styles.css';
// import 'react-responsive-modal/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';
import { ToastContainer } from 'react-toastify'
import reportWebVitals from './reportWebVitals';
import {Provider} from "react-redux";
import store from "./store/store";
import AppWrapper from './components/ui/AppWrapper';
import FetchLoading from './components/loading';
import Badge from './components/badge/Badge';
import Congrat from './components/congrat/Congrat';
ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <ToastContainer />
      <Badge/>
      <Congrat/>
      {/* <FetchLoading/> */}
      <AppWrapper>
          <App />
      </AppWrapper>
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
