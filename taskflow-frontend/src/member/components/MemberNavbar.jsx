import { Link, useNavigate } from "react-router-dom";

import "../styles/memberNavbar.css";

function MemberNavbar() {

    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };


    return (
        <nav className= "member-navbar">
            <div className= "navbar-logo">
                
                <h2>TaskFlow</h2>
            </div>

            <ul className= "navbar-links">

                <li><Link to= "/member">Dashboard</Link></li>
                <li><Link to= "/member/tasks">My Tasks</Link></li>
                <li><Link to= "/member/profile">Profile</Link></li>
            </ul>

            <button
                className= "logout-btn"
                onClick= {logout}
            >
                Logout
            </button>
        </nav>
    );
}

export default MemberNavbar;