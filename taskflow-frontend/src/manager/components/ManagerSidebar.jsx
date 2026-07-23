import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "../styles/managerLayout.css";

function ManagerSidebar() {

    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };


    return (
        <aside className= "sidebar">

            <h2>TaskFlow</h2>

            <NavLink to= "/manager">Dashboard</NavLink>
            <NavLink to= "/manager/projects">Projects</NavLink>
            <NavLink to= "/manager/tasks">My Tasks</NavLink>

            <button 
                className= "sidebar-logout"
                onClick= {handleLogout}
            >
                Logout
            </button>
        </aside>
    );
}

export default ManagerSidebar;