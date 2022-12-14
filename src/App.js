
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { auth, onAuthStateChanged } from './components/firebase';
import Layout from "./components/Layout";
import { selectUser } from './redux/authSlice';
import { onUserStateChanged } from './redux/current';
import Alumnos from './views/Alumnos';
import Aprender from './views/Aprender';
import Calificaciones from './views/Calificaciones';
import CalificacionesAlumno from './views/CalificacionesAlumno';
import CalificacionesAlumnoChart from './views/CalificacionesAlumnoChart';
import Comentarios from './views/Comentarios';
import CommentDetail from './views/CommentDetail';
import ForgotPassword from "./views/ForgotPassword";
import Historial from './views/Historial';
import Home from "./views/Home";
import Login from "./views/Login";
import Reconocimiento from "./views/Reconocimiento";
import Registro from "./views/Registro";

function App() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  useEffect(() => {
    onAuthStateChanged(auth, (userAuth) => {
      // if (userAuth) {
      // user is logged in, send the user's details to redux, store the current user in the state
      dispatch(
        onUserStateChanged({ userAuth })
        // onUserStateChanged({
        //   email: userAuth.email,
        //   uid: userAuth.uid,
        //   displayName: userAuth.displayName,
        //   photoUrl: userAuth.photoURL,
        // })
      );
      // }
      //  else {
      //   dispatch(logout());
      // }
    });
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route name="home" path='/' exact element={<Home />} />
          <Route name="alumnos" path='/alumnos' exact element={<Alumnos />} />
          <Route name="comentarios" path='/comentarios' exact element={<Comentarios />} />
          <Route name="commentDetail" path='/comments/:commentId' exact element={<CommentDetail />} />
          <Route name="reconocimiento" path='/reconocimiento' exact element={<Reconocimiento />} />
          <Route name="registro" path='/registro' exact element={<Registro />} />
          <Route name="historial" path='/historial' exact element={<Historial />} />
          <Route name="mis-calificaciones" path='/mis-calificaciones' exact element={<Calificaciones />} />
          <Route name="aprender" path='/aprender' exact element={<Aprender />} />
          <Route name="calificaciones" path='/calificaciones/:uid' exact element={<CalificacionesAlumno />} />
          <Route name="calificaciones-chart" path='/calificaciones-chart/:uid' exact element={<CalificacionesAlumnoChart />} />

        </Route>
        <Route name="Recuperar" path='/forgot-password' exact element={<ForgotPassword />} />
        <Route name="login" path='/login' exact element={<Login />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
