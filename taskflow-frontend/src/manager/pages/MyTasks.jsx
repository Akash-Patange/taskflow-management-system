import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../styles/managerMyTasks.css";

function MyTasks(){

    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [tasks,setTasks] = useState([]);
    const [search,setSearch] = useState("");
    const [status,setStatus] = useState("");
    const [priority,setPriority] = useState("");
    const [page,setPage] = useState(1);
    const [totalPages,setTotalPages] = useState(1);
    const [loading,setLoading] = useState(true);

    useEffect(()=> {
        fetchTasks();
    },[
        page,
        search,
        status,
        priority
    ]);

    const fetchTasks = async()=> {
        
        try
            {
                setLoading(true);
                const response = await axios.get(
                    "http://127.0.0.1:8000/tasks/my-tasks",
                    {
                        params:{
                            page,
                            limit:5,
                            search,
                            status,
                            priority
                        },
                        headers:{
                            Authorization:`Bearer ${token}`
                        }
                    }
                );

                setTasks(response.data.tasks || response.data);
                setTotalPages(response.data.total_page || 1);
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

    const deleteTask = async(taskId)=> {
        const confirmDelete = window.confirm( "Delete this task?" );

        if(!confirmDelete)
            return;

        try
            {
                await axios.delete(
                    `http://127.0.0.1:8000/tasks/tasks/${taskId}`,
                    {
                        headers:{
                            Authorization:`Bearer ${token}`
                        }
                    }
                );

                alert("Task deleted successfully");
                fetchTasks();
            }

        catch(error) 
            {
                console.log(error);
                alert(error.response?.data?.detail ||   "Unable to delete task");
            }
    };


    return(
        <div className= "my-tasks-page">

            <h1>My Tasks</h1>

            <div className= "task-filters">

                <input
                    type= "text"
                    placeholder= "Search task..."
                    value= {search}
                    onChange= {(e)=> {
                        setPage(1);
                        setSearch(e.target.value);
                        }
                    }
                />
                <select
                    value= {status}
                    onChange= {(e)=> {
                        setPage(1);
                        setStatus(e.target.value);
                        }
                    }
                >
                    <option value= "">All Status</option>
                    <option value= "Pending">Pending</option>
                    <option value= "In Progress">In Progress</option>
                    <option value= "Completed">Completed</option>
                </select>

                <select
                    value= {priority}
                    onChange= {(e)=> {
                        setPage(1);
                        setPriority(e.target.value);
                        }
                    }
                >
                    <option value= "">All Priority</option>
                    <option value= "Low">Low</option>
                    <option value= "Medium">Medium</option>
                    <option value= "High">High</option>
                    <option value= "Critical">Critical</option>
                </select>
            </div>

            {
                loading ? <h2>Loading...</h2> : tasks.length === 0 ? <h2>No tasks found</h2> :
                    tasks.map(task=> (
                        <div
                            className= "task-card"
                            key= {task.id}
                        >

                            <h2>{task.title}</h2>
                            <p>{task.description}</p>
                            <p><b>Status:</b> {" "} {task.status}</p>
                            <p> <b>Priority:</b> {" "} {task.priority} </p>
                            <p> <b>Due Date:</b> {" "} {task.due_date || "No date"} </p>
                                
                            <div className= "task-actions">

                                <button
                                    className= "details-btn"
                                    onClick= {()=> navigate(`/manager/tasks/${task.id}`)}
                                >
                                    View Details
                                </button>

                                <button
                                    onClick= {()=> navigate(`edit/${task.id}`)}
                                >
                                    Edit
                                </button>

                                <button
                                    onClick= {()=> deleteTask(task.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    )
                )
            }

            <div className= "pagination">
                
                <button
                    disabled= {page=== 1}
                    onClick= {()=> setPage(page-1)}
                >
                    Previous
                </button>

                <span>Page {page} of {totalPages}</span>

                <button
                    disabled= {page=== totalPages}
                    onClick= {()=> setPage(page+1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
}


export default MyTasks;