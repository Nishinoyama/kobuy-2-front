import {Link, Outlet} from "react-router-dom";
import React from "react";

export default function Layout() {
  return (
    <>
      <header className="App-header">
        <h1>
          <Link to="/">Home</Link>
        </h1>
      </header>
      <main className="App-main">
        <Outlet/>
      </main>
    </>
  );
}