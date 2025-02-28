import { createRoot } from 'react-dom/client'
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import App from './App.jsx'
import "./assets/css/plugins.css";
import "./assets/css/style.css";

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
        <App />
    </Provider>
)
