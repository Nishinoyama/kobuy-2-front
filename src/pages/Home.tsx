import React from "react";
import "../Home.css"
import {Link} from "react-router-dom";

export default function Home() {
  return (
    <div className="Home-main">
      <ul>
        <li><Link to={`market`}>商店</Link></li>
        <li><Link to={`provision`}>出品</Link></li>
        <li><Link to={`ledger`}>台帳</Link></li>
        <li><Link to={`payment`}>支払い</Link></li>
      </ul>
    </div>
  );
}