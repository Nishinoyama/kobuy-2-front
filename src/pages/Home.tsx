import React from "react";
import "../Home.css"
import {Link} from "react-router-dom";

export default function Home() {
  return (
    <div className="Home-main">
      <ul>
        <li><Link to={`market`}>market</Link></li>
        <li><Link to={`users`}>users</Link></li>
      </ul>
    </div>
  );
}