import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react'
import './ui/App.css'
import Genre from '../pages/genre/Genre';
import Song from '../pages/song/Song';
import AppContext from '../features/context/AppContext';
import Layout from '../widgets/layout/Layout';
import Home from '../pages/home/Home';
import Base64 from '../shared/base64/Base64';

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if(token){
      setUser(Base64.jwtDecodePayload(token));
    }
    else{
      setUser(null);
    }
  }, [token]);

  const backUrl = "https://localhost:7005";

  const request = (url, conf) => new Promise((resolve, reject) => {
    if(url.startsWith('/')){
      url = backUrl + url;

      if(token)
      {
        if(typeof conf == 'undefined')
        {
          conf = {};
        }
        if(typeof conf.headers == 'undefined')
        {
          conf.headers = {};
        }
        if(typeof conf.headers['Authorization'] == 'undefined'){
          conf.headers['Authorization'] = 'Bearer ' + token;
        }
      }
    }
    fetch(url, conf)
        .then(r => r.json())
        .then(j => {
            if(j.status.isOk){
                resolve(j.data);
            }
            else{
                reject(j);
            }  
        });
  });

  return <AppContext.Provider value = {{request, backUrl, user, setToken}}>
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Layout />} >
            <Route index element = {<Home />} />
            <Route path='genre/:slug' element = {<Genre />} />
            <Route path="song/:slug" element={<Song />}></Route> 
          </Route>
      </Routes>
    </BrowserRouter>
    </AppContext.Provider>
}

export default App
