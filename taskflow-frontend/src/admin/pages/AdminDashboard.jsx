import { useEffect, useState } from "react";
import axios from "axios";
import StatsCard from "../components/StatsCard";

import "../styles/adminDashboard.css";
import "../../styles/jira-theme.css";




function AdminDashboard(){

    const [dashboard, setDashboard] = useState({
        total_users: 0,
        total_projects: 0,
        active_projects: 0,
        completed_projects: 0
    });

    const [recentProjects, setRecentProjects] = useState([]);

    useEffect(()=> {
        fetchDashboard();
    },[]);

    const fetchDashboard = async()=> {

        try
            {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    "http://localhost:8000/dashboard",
                    {
                        headers:{
                            Authorization:`Bearer ${token}`
                        }
                    }
                );

                setDashboard(response.data.stats);
                setRecentProjects(response.data.recent_projects);
        }

        catch(error)
            {
                console.log("Dashboard Error:", error);
            }
    };



    return(

        <div className= "admin-dashboard">
            <div className= "dashboard-header">

                <h1>Admin Dashboard</h1>
                <p>Manage your TaskFlow system</p>
            </div>

            <div className= "stats-container">

                <StatsCard
                    title= "Total Users"
                    value= {dashboard.total_users}
                    icon= "👥"
                />

                <StatsCard
                    title= "Total Projects"
                    value= {dashboard.total_projects}
                    icon= "📁"
                />

                <StatsCard
                    title= "Active Projects"
                    value= {dashboard.active_projects}
                    icon= "🚀"
                />

                <StatsCard
                    title= "Completed Projects"
                    value= {dashboard.completed_projects}
                    icon= "✅"
                />
            </div>

            <div className= "recent-section">

                <h2>Recent Projects</h2>

                <div className= "recent-project-grid">

                    {
                        recentProjects.length === 0 ?
                        (
                            <p>No projects available</p>
                        )
                        :
                        recentProjects.map(project=> (
                            <div 
                                className= "recent-project-card"
                                key= {project.id}
                            >

                                <h3>{project.name}</h3>
                                <p>Manager: {" "} {project.manager}</p>
                                <span>{project.status}</span>
                            </div>
                            )
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;