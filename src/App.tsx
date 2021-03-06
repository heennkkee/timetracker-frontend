import React, { useState, useEffect } from 'react';

import './App.css';

interface IData {
  items: null | string[]
}

function App() {

  const [ data, setData ] = useState<IData>({ items: null });

  useEffect(() => {
    const fetchAsync = async () => {
      const resp = await fetch('https://ha-timetracker-backend.herokuapp.com').then(resp => resp.json()).then(resp => {
        return resp;
      });

      console.log("Setting data to: ", resp.data);
      setData({ items: resp.data });
    }
    
    fetchAsync();

  }, []);

  return (
    <div className="App">
      <header className="App-header">
        Hola
      </header>
      <main>
        <p>Api responded with:</p>
        <ul>
          { data.items === null ? null : data.items.map((item, ix) => {
            return <li key={ix}>{item}</li>
          })}
        </ul>
      </main>
    </div>
  );
}

export default App;
