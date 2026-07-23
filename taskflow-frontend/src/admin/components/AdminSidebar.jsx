import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "../../admin/styles/adminLayout.css";


function AdminSidebar(){

    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();


    const handleLogout = () => {
        logout();
        navigate("/login");
    };



    return (

        <aside className= "admin-sidebar">

            <div className= "admin-logo">TaskFlow</div>

            <nav>

                <NavLink to= "/admin">Dashboard</NavLink>
                <NavLink to= "/admin/users">Users</NavLink>
                <NavLink to= "/admin/projects">Projects</NavLink>
                <NavLink to= "/admin/tasks">Tasks</NavLink>
                <NavLink to= "/admin/comments">Comments</NavLink>
                <NavLink to= "/admin/settings">Settings</NavLink>
            </nav>

            <button 
                className= "logout-btn"
                onClick= {handleLogout}
            >
                Logout
            </button>
        </aside>
    );
}

export default AdminSidebar;