import { Outlet } from "react-router-dom";
import ManagerSidebar from "../components/ManagerSidebar";
import ManagerNavbar from "../components/ManagerNavbar";

import "../styles/managerLayout.css";

function ManagerLayout() {

    return (

        <div className= "manager-layout">
   
            <ManagerSidebar />

            <div className= "main">
   
                <ManagerNavbar />

                <div className= "content">
   
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default ManagerLayout;