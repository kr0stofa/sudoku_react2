import React from "react";
import logo from "./logo.svg";
import { useMediaQuery } from "react-responsive";
import "./App.css";
import Sudoku from "./components/Sudoku";

function App() {
  const isMobile = useMediaQuery({ query: "(max-width: 800px)" });

  return (
    <div className="App">
      <header className={`App-header${isMobile ? " fixed" : ""}`}>
        <img src={logo} className="App-logo" alt="logo" /> by David Goh
      </header>

      <Sudoku mobile={isMobile} />
    </div>
  );
}

export default App;
