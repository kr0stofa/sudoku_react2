import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Sudoku from "./components/Sudoku";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" /> by David Goh
      </header>

      <Sudoku />
    </div>
  );
}

export default App;
