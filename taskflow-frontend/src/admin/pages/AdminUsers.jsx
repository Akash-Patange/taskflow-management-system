import { useEffect, useState } from "react";
import api from "../../services/api";
import "../styles/adminUsers.css";


function AdminUsers() {

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("All");
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try 
            {
                const response = await api.get("/admin/users");
                setUsers(response.data);
            } 
        
        catch(error) 
            {
                console.log(error);
            } 
        
        finally 
            {
                setLoading(false);
            }
    };


    useEffect(()=> {
        fetchUsers();
    },[]);

    const updateUser = async(id, data)=> {
        
        try
            {
                await api.put(
                    `/admin/users/${id}`,
                    data
                );
            
                fetchUsers();
        
            }
        
        catch(error)
            {
                console.log(error);
            }
    };

    const deleteUser = async(id)=> {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        
        if(!confirmDelete)
            return;
        
        try
            {
                await api.delete(`/admin/users/${id}`);
                fetchUsers();
            }
        
        catch(error)
            {
                console.log(error);
            }
    };


    const filteredUsers = users.filter(user=> {
            const matchSearch = user.username.toLowerCase().includes(search.toLowerCase()) || 
                                    user.email.toLowerCase().includes(search.toLowerCase());
            const matchRole = roleFilter=== "All" || user.role=== roleFilter;
    
            return matchSearch && matchRole;
        }
    );


    if(loading)
        {
            return (<div className= "loading">Loading users...</div>);
        }

    return (
        <div className= "admin-users-page">
            <div className= "page-header">
                <div>

                    <h1>Users</h1>
                    <p>Manage system users and permissions</p>
                </div>
            </div>

            <div className= "filters">

                <input
                    type= "text"
                    placeholder= "Search users..."
                    value= {search}
                    onChange= {e=> setSearch(e.target.value)}
                />

                <select
                    value= {roleFilter}
                    onChange= {e=> setRoleFilter(e.target.value)}
                >
                    <option>All</option>
                    <option>Admin</option>
                    <option>Manager</option>
                    <option>Member</option>
                </select>
            </div>

            <div className= "table-card">
            
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        {
                            filteredUsers.map(user=> (
                                <tr key= {user.id}>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <select
                                            value= {user.role}
                                            onChange= {e=> updateUser(
                                                    user.id,
                                                    {
                                                        role:e.target.value
                                                    }
                                                )
                                            }
                                        >
                                            <option>Admin</option>
                                            <option>Manager</option>
                                            <option>Member</option>
                                        </select>
                                    </td>

                                    <td>
                                        <span
                                            className= {user.is_active ?
                                                "status active" : "status inactive"
                                            }
                                        >
                                            { 
                                                user.is_active ? "Active" : "Inactive"
                                            }
                                        </span>
                                    </td>

                                    <td>
                                        <div className= "user-actions">

                                            <button
                                                className= "disable-btn"
                                                onClick= {()=> updateUser(
                                                    user.id,
                                                    {
                                                        is_active : !user.is_active
                                                    }
                                                    )
                                                }
                                            >
                                                {
                                                    user.is_active ? "Disable" : "Activate"
                                                }
                                            </button>

                                            <button
                                                className= "delete-btn"
                                                onClick= {()=> deleteUser(user.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                )
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminUsers;