import React, { useState, useEffect } from 'react';


import { ThemeContext, Theme } from './context/ThemeContext';
import Header from './component/Header';


import Cookies from './helper/Cookies';


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

  
  let storedMode = Cookies.get('mode');
  let defaultMode = Theme.Light;

  if (storedMode !== undefined && Object.keys(Theme).includes(storedMode as Theme)) {
    defaultMode = Theme[storedMode as keyof typeof Theme];
  }

  const [ mode, setMode ] = useState<Theme>(defaultMode);

  const toggleMode = () => {
    let newMode = (mode === Theme.Light) ? Theme.Dark : Theme.Light;
    Cookies.set("mode", newMode);
    setMode(newMode);
  }



  return (
    <ThemeContext.Provider value={{ mode: mode, toggle: toggleMode}}>
      <div className="container bg-light">
        <Header />
        
        <main>
          <p>Api responded with:</p>
          <ul>
            { data.items === null ? null : data.items.map((item, ix) => {
              return <li key={ix}>{item}</li>
            })}
          </ul>
        </main>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
