import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../components/firebase";
import TableAlumnos from './TableAlumnos.js';


const Alumnos = () => {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
  }, [user, loading]);


  return (
    <div className="App">
      <main>
        <TableAlumnos />
        <div>
        </div>
      </main>
    </div>
  )
}

export default Alumnos;