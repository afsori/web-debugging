import React, { useState } from "react";
import "./App.css";
import GitHubLogin from "./GithubLogin";

function App() {
  const [name, setName] = useState("Samsul Arifin");

  return (
    <div className="App">
      <header className="App-header">
        {name && <h2>Hai {name}</h2>}
        <GitHubLogin
          clientId=""
          redirectUri=""
          onSuccess={(name) => setName(name)}
          onFailure={(resp) => console.log(resp)}
        />
      </header>
    </div>
  );
}

export default App;
