import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/managerDashboard.css";


function ManagerDashboard(){

    const [stats,setStats] = useState({
        total_projects:0,
        active_projects:0,
        completed_tasks:0,
        pending_tasks:0,
        team_members:0
        }
    );

    useEffect(()=> {
        fetchDashboard();
    },[]);

    const fetchDashboard = async()=> {

        try
            {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    "http://127.0.0.1:8000/manager/dashboard",
                    {
                        headers:{
                            Authorization:`Bearer ${token}`
                        }
                    }
                );
                setStats(response.data);
            }

        catch(error) 
            {
                console.log(error);
            }
    }


    return(

        <div className= "dashboard-page">

            <h1>Manager Dashboard</h1>

            <div className= "stats-grid">
                <div className= "stat-card">
                    
                    <h3>Total Projects</h3>
                    <p>{stats.total_projects}</p>
                </div>

                <div className= "stat-card">
                    
                    <h3>Active Projects</h3>
                    <p>{stats.active_projects}</p>
                </div>

                <div className= "stat-card">
                    
                    <h3>Completed Tasks</h3>
                    <p>{stats.completed_tasks}</p>
                </div>

                <div className= "stat-card">
                    
                    <h3>Pending Tasks</h3>
                    <p>{stats.pending_tasks}</p>
                </div>

                <div className= "stat-card">
                    
                    <h3>Team Members</h3>
                    <p>{stats.team_members}</p>
                </div>
            </div>
        </div>
    );
}

export default ManagerDashboard;