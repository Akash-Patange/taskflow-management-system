import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

import "../styles/editTask.css";

function EditTask(){

    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [task,setTask] = useState({
        title:"",
        description:"",
        priority:"Medium",
        status:"Pending",
        due_date:"",
        assigned_to:""
    });

    const [loading,setLoading] = useState(true);

    useEffect(()=> {
        fetchTask();
    },[]);

    const fetchTask = async()=> {
        
        try
            {
                const response = await axios.get(
                    `http://127.0.0.1:8000/tasks/tasks/${id}`,
                    {
                        headers:{
                            Authorization:`Bearer ${token}`
                        }
                    }
                );

                setTask(
                    {
                    title: response.data.title,
                    description: response.data.description || "",
                    priority: response.data.priority,
                    status: response.data.status,
                    due_date: response.data.due_date || "",
                    assigned_to: response.data.assigned_to || ""
                    }
                );
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

    const handleChange= (e)=> {
        setTask(
            {
                ...task,
                [e.target.name]:e.target.value
            }
        );
    };

    const updateTask = async(e)=> {
        
        e.preventDefault();
        try
            {
                await axios.put(
                    `http://127.0.0.1:8000/tasks/tasks/${id}`,
                    {
                        title:task.title,
                        description:task.description,
                        priority:task.priority,
                        status:task.status,
                        due_date:task.due_date || null,
                        assigned_to: task.assigned_to ? Number(task.assigned_to) : null
                    },
                    {
                        headers:{
                            Authorization:`Bearer ${token}`
                        }
                    }
                );
            
                alert("Task updated successfully");
                navigate("/manager/tasks");
            }

        catch(error) 
            {
                console.log(error);
                alert(error.response?.data?.detail || "Unable to update task");
            }
    };

    if(loading) 
        {
            return <h2>Loading...</h2>;
        }



    return(
        
        <div className= "edit-task-page">

            <h1>Edit Task</h1>

            <form onSubmit= {updateTask}>
        
                <label>Title</label>
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
                />

                <label>Priority</label>
                <select
                    name= "priority"
                    value= {task.priority}
                    onChange= {handleChange}
                >
                    <option value= "Low">Low</option>
                    <option value= "Medium">Medium</option>
                    <option value= "High">High</option>
                    <option value= "Critical">Critical</option>
                </select>

                <label>Status</label>
                <select
                    name= "status"
                    value= {task.status}
                    onChange= {handleChange}
                >
                    <option value= "Pending">Pending</option>
                    <option value= "In Progress">In Progress</option>
                    <option value= "Completed">Completed</option>
                </select>

                <label>Due Date</label>
                <input
                    type= "date"
                    name= "due_date"
                    value= {task.due_date}
                    onChange= {handleChange}
                />

                <label>Assigned To</label>
                <input
                    type= "number"
                    name= "assigned_to"
                    value= {task.assigned_to}
                    onChange= {handleChange}
                    placeholder= "User ID"
                />

                <button type= "submit">Update Task</button>
            </form>
        </div>
    );
}


export default EditTask;