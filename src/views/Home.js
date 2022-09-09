import React, { useEffect, useState } from "react";
import Footer from '../components/Footer';
import SidebarWithHeader from '../components/SideBar';
import DetectHand from '../components/DetectHand';
import Intro from './Intro.js';
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout } from "../components/firebase";


const Home = () => {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
  }, [user, loading]);


    return (
        <div className="App">
        <main>
        <SidebarWithHeader>
          <Intro/>
        </SidebarWithHeader>
          <div>
          </div>
        </main>
        <Footer/>
      </div>
    )
}

export default Home;