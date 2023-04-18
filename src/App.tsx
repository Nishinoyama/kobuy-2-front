import React from 'react';
import './App.css';
import Market from "./pages/Market";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import "bootstrap/dist/css/bootstrap.min.css"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout/>}>
            <Route index path="/" element={<Home/>}/>
            <Route path="/market" element={<Market/>}/>
            <Route path="/users" element={
              [...Array(100)].map((_, i) => <p key={i}>users</p> )
            }/>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;
