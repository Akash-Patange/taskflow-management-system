import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";
import "../styles/adminTaskEdit.css";


function AdminTaskEdit(){

    const { id } = useParams();
    const navigate = useNavigate();

    const [task,setTask] = useState({
        title:"",
        description:"",
        priority:"",
        status:"",
        due_date:"",
        assigned_to:""
    });

    const [users,setUsers] = useState([]);
    const [loading,setLoading] = useState(true);

    useEffect(()=> {
        fetchTask();
        fetchUsers();
    },[]);

    const fetchTask = async()=> {

        try
            {
                const response = await api.get(`/tasks/tasks/${id}`);
                const data=response.data;
            
                setTask(
                    {
                        title:data.title || "",
                        description:data.description || "",
                        priority:data.priority || "Medium",
                        status:data.status || "Pending",
                        due_date:data.due_date || "",
                        assigned_to:data.assigned_to || ""
                    }
                );
            }

        catch(error)
            {
                console.log("Task fetch error",error);
            }

        finally
            {
                setLoading(false);
            }
    };

    const fetchUsers = async()=> {

        try
            {
                const response = await api.get("/admin/all");
            
                setUsers(response.data);
            }

        catch(error)
            {
                console.log(error);
            }
    };

    const handleChange=(e)=> {

        setTask(
            {
                ...task,
                [e.target.name]:e.target.value
            }
        );
    };

    const updateTask=async(e)=> {

        e.preventDefault();

        try
            {
                await api.put(`/tasks/tasks/${id}`,task);

                alert("Task updated successfully");
                navigate("/admin/tasks");
            }

        catch(error)
            {
                console.log(error);
                alert("Failed to update task");
            }
    };

    if(loading)
        {
            return <h2>Loading task...</h2>;
        }



    return(

        <div className= "task-edit-page">
            <div className= "task-edit-header">

                <h1>Edit Task</h1>
                
                <button
                    onClick= {()=> navigate(-1)}
                >
                    Back
                </button>
            </div>

            <form
                className= "task-edit-card"
                onSubmit= {updateTask}
            >
                
                <label>Task Title</label>
                <input
                    type= "text"
                    name= "title"
                    value= {task.title}
                    onChange= {handleChange}
                    required
                />

                <label>Description</label>
                <textarea
                    name= "description"
                    value= {task.description}
                    onChange= {handleChange}
                    rows= "5"
                />

                <div className= "form-grid">
                    <div>

                        <label>Priority</label>
                        <select
                            name= "priority"
                            value= {task.priority}
                            onChange= {handleChange}
                        >
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                        </select>
                    </div>

                    <div>

                        <label>Status</label>
                        <select
                            name= "status"
                            value= {task.status}
                            onChange= {handleChange}
                        >
                            <option>Pending</option>
                            <option>In Progress</option>
                            <option>Completed</option>
                            <option>On Hold</option>
                        </select>
                    </div>
                </div>

                <div className= "form-grid">
                    <div>

                        <label>Due Date</label>
                        <input
                            type= "date"
                            name= "due_date"
                            value= {task.due_date}
                            onChange= {handleChange}
                        />
                    </div>

                    <div>

                        <label>Assigned Member</label>
                        <select
                            name= "assigned_to"
                            value= {task.assigned_to}
                            onChange= {handleChange}
                        >
                            <option value= "">Unassigned</option>
                            {
                                users.map(user=> (
                                    <option
                                        key= {user.id}
                                        value= {user.id}
                                    >
                                        {user.username}
                                    </option>
                                    )
                                )
                            }
                        </select>
                    </div>
                </div>

                <button
                    className= "save-btn"
                    type= "submit"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
}

export default AdminTaskEdit;