import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";


function AdminNavbar(){

    const { user } = useContext(AuthContext);

    return (

        <header className= "admin-navbar">

            <h2>Admin Panel</h2>

            <div className= "admin-profile">

                <div className= "avatar">{user?.username?.charAt(0)}</div>

                <div className= "user-info">
                    <span>{user?.username}</span>
                    <span className="role">Admin</span>
                </div>
            </div>
        </header>
    );
}

export default AdminNavbar;