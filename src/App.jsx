import {Routes, Route, Navigate} from 'react-router-dom'
import { useState } from 'react'  
import Login from './page/login/index.jsx'
import Registro from './page/registro/index.jsx'
import Home from './page/home/index.jsx'
import './App.css'

function App() {
  const [usuario, setUsuario] = useState(JSON.parse(localStorage.getItem('cuentaUsuario')) || null);


  const onLogin = (usuario) => {
    setUsuario(usuario);
  }

  return (
    <Routes>
      <Route
        path="/"
        element={usuario ? <Navigate to="/home" />  : <Login onLogin={onLogin} />}
      />
      

      <Route
        path="/home"
        element={usuario ? <Home usuario={usuario} /> : <Navigate to="/" />}
      />

      <Route path="*" element={<Navigate to={usuario ? "/home" : "/"} />} />
      <Route path="/registro" element={<Registro />} />
    </Routes>
  )
}

export default App

