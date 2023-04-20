import React from 'react';
import './App.css';
import Market from "./pages/Market";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import "bootstrap/dist/css/bootstrap.min.css"
import {Provision} from "./pages/Provision";
import {Ledger} from "./pages/Ledger";
import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_KOBUY_BASE_URL

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout/>}>
            <Route index path="/" element={<Home/>}/>
            <Route path="/market" element={<Market/>}/>
            <Route path="/ledger" element={<Ledger/>}/>
            <Route path="/provision" element={<Provision/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;
