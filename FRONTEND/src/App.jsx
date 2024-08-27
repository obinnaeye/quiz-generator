import './App.css'
import Home from './pages/Home';
import { Routes, Route } from "react-router-dom"
import About from "./pages/About"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={ <Home /> } />
        <Route path="about" element={ <About /> } />
        <Route path="login" element={ <Login /> } />
        <Route path="signup" element={ <SignUp /> } />
      </Routes>
    </div>
  )
}

export default App
