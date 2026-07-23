import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "../styles/managerNavbar.css";

function ManagerNavbar() {

    const { user } = useContext(AuthContext);

    return (

        <header className= "topbar">
            <div className= "topbar-left">

                <h2>Manager Dashboard</h2>
                <p>Manage your projects and team</p>
            </div>

            <div className= "topbar-right">
                <div className= "manager-info">
                    <div className= "manager-avatar">

                        {
                            user?.username ? user.username.charAt(0).toUpperCase() : "M"
                        }
                    </div>

                    <div>
                        <h4>{user?.username}</h4>
                        <span>Project Manager</span>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default ManagerNavbar;