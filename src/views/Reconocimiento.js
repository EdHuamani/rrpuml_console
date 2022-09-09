import React from "react";
import Footer from '../components/Footer';
import SidebarWithHeader from '../components/SideBar';
import DetectHand from '../components/DetectHand';


const Reconocimiento = () => {
    return (
        <div className="App">
        <main>
        <SidebarWithHeader>
          <DetectHand/>
        </SidebarWithHeader>
          <div>
          </div>
        </main>
        <Footer/>
      </div>
    )
}

export default Reconocimiento;