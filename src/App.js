
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./views/Home";
import Login from "./views/Login";
import Registro from "./views/Registro";
import Reconocimiento from "./views/Reconocimiento";
import Alumnos from './views/Alumnos';
import Comentarios from './views/Comentarios';


function App() {
  return (
    <BrowserRouter>
    <Routes>
    <Route name="home" path='/' exact  element={<Home/>}  />
    <Route name="alumnos" path='/alumnos' exact  element={<Alumnos/>}  />
    <Route name="comentarios" path='/comentarios' exact  element={<Comentarios/>}  />
    <Route name="reconocimiento" path='/reconocimiento' exact  element={<Reconocimiento/>}  />
    <Route name="login" path='/login' exact  element={<Login/>}  />
    <Route name="registro" path='/registro' exact  element={<Registro/>}  />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
