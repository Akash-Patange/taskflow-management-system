import { useEffect, useState } from "react";

import axios from "axios";
import api from "../../services/api"

import "../styles/memberDashboard.css";



function MemberDashboard() {

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        
        try 
            {
                const response = await axios.get(
                    "/member/dashboard",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setDashboard(response.data);
            } 
        
        catch (error) 
            {
                console.log(error);
            } 
            
        finally 
            {
                setLoading(false);
            }
    };

    if (loading) {
        return <h2>Loading Dashboard...</h2>;
    }

    if (!dashboard) {
        return <h2>Unable to load dashboard.</h2>;
    }

    return (
        <div className= "member-dashboard">
            <div className= "welcome-card">
                
                <h1>Welcome, {dashboard.welcome} 👋</h1>
                <p>Here's a summary of your assigned work.</p>
            </div>

            <div className= "dashboard-cards">
                <div className= "dashboard-card">
                    
                    <h2>{dashboard.total_tasks}</h2>
                    <p>Total Tasks</p>
                </div>

                <div className= "dashboard-card">
                    
                    <h2>{dashboard.pending_tasks}</h2>
                    <p>Pending</p>
                </div>

                <div className= "dashboard-card">
                    
                    <h2>{dashboard.completed_tasks}</h2>
                    <p>Completed</p>
                </div>

                <div className= "dashboard-card">
                    
                    <h2>{dashboard.overdue_tasks}</h2>
                    <p>Overdue</p>
                </div>

                <div className= "dashboard-card">
                    
                    <h2>{dashboard.due_today}</h2>
                    <p>Due Today</p>
                </div>
            </div>

            <div className= "recent-tasks">

                <h2>Recent Assigned Tasks</h2>
                {
                    dashboard.recent_tasks.length === 0 ? (
                        <p>No assigned tasks.</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Project</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                    <th>Due Date</th>
                                </tr>
                            </thead>
                            <tbody>
                    
                                {
                                    dashboard.recent_tasks.map(task => (
                                        <tr key= {task.id}>
                                            <td>{task.title}</td>
                                            <td>{task.project_name}</td>
                                            <td>{task.priority}</td>
                                            <td>{task.status}</td>
                                            <td>{task.due_date}</td>
                                        </tr>
                                        )
                                    )
                                }
                            </tbody>
                        </table>
                    )
                }
            </div>
        </div>
    );
}

export default MemberDashboard;