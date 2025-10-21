import {Routes, Route} from 'react-router-dom'
import Login from './page/login/index.jsx'
import Home from './page/home/index.jsx'
import './App.css'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route  path="/home" element={<Home />} />
      <Route path="*" element={<Login />} />
    </Routes>
  )
}

export default App

