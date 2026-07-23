import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import "../styles/memberTasks.css";



function MemberTasks(){

    const [tasks,setTasks] = useState([]);
    const [page,setPage] = useState(1);
    const [totalPages,setTotalPages] = useState(1);
    const [search,setSearch] = useState("");
    const [status,setStatus] = useState("");
    const [priority,setPriority] = useState("");
    const [loading,setLoading] = useState(true);
    
    const navigate = useNavigate();

    useEffect(()=> {
        fetchTasks();
    }, [page, status, priority]);

    const fetchTasks = async()=> {
        
        try
            {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    `http://127.0.0.1:8000/member/tasks`,
                    {
                        params:{
                            page:page,
                            limit:5,
                            search:search,
                            status:status,
                            priority:priority
                        },
                        headers:{
                            Authorization:`Bearer ${token}`
                        }
                    }
                );
            
                setTasks(   response.data.tasks || []   );
                setTotalPages(  response.data.total_page || 1   );
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

    const handleSearch= (e)=> {
        setSearch(e.target.value);
        setPage(1);
    };

    const searchTasks= ()=> {
        setPage(1);
        fetchTasks();
    };

    if(loading){
        return <h2>Loading Tasks...</h2>;
    }



    return(

        <div className= "member-tasks-page">

            <h1>My Assigned Tasks</h1>

            <div className= "filter-section">
    
                <input
                    type= "text"
                    placeholder= "Search task..."
                    value= {search}
                    onChange= {handleSearch}
                />

                <button
                    onClick= {searchTasks}
                >
                    Search
                </button>

                <select
                    value= {status}
                    onChange= {(e)=> {
                        setStatus(e.target.value);
                        setPage(1);
                        }
                    }
                >
                    <option value= "">All Status</option>
                    <option value= "Pending">Pending</option>
                    <option value= "In Progress">In Progress</option>
                    <option value= "Completed">Completed</option>
                    <option value= "On Hold">On Hold</option>
                </select>

                <select
                    value= {priority}
                    onChange= {(e)=> {
                        setPriority(e.target.value);
                        setPage(1);
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

            <div className= "tasks-container">
                {
                    tasks.length === 0 ?
                        (<h3>No assigned tasks found</h3>) :
                        (
                            tasks.map(task=> (
                                <div
                                    className= "task-card"
                                    key= {task.id}
                                >

                                    <h2>{task.title}</h2>
                                    <p>{task.description}</p>
                                    <p> <b> Project: </b> {" "} {task.project_name} </p>
                                    <p> <b> Priority: </b> {" "} {task.priority} </p>
                                    <p> <b> Due Date: </b> {" "} {task.due_date || "No Date"} </p>
                                    <span
                                        className= {`progress-badge ${task.status.toLowerCase().replace(" ","-")}`}
                                    >
                                        {task.status}
                                    </span>

                                    <button
                                        onClick= {()=>
                                            navigate(`/member/tasks/${task.id}`)
                                        }
                                    >
                                        View Details
                                    </button>
                                </div>
                            )
                        )
                    )
                }
            </div>

            <div className= "pagination">

                <button
                    disabled= {page===1}
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

export default MemberTasks;