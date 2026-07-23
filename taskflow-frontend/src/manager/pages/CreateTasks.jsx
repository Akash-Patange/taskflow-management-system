import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import "../styles/createTasks.css";

function CreateTask() {

    const { id } = useParams(); // project id
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [members, setMembers] = useState([]);

    const [task, setTask] = useState(
        {
            title: "",
            description: "",
            priority: "Medium",
            status: "Pending",
            due_date: "",
            assigned_to: ""
        }
    );

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {

        try 
            {
                const response = await axios.get(
                    `http://127.0.0.1:8000/projects/${id}/members`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setMembers(response.data);
            }

        catch(error) 
            {
            console.log(error);
            }
    };

    const handleChange = (e) => {
        setTask(
            {
                ...task,
                [e.target.name]: e.target.value
            }
        );
    };

    const createTask = async (e) => {

        e.preventDefault();
        try 
            {
                await axios.post(
                    `http://127.0.0.1:8000/tasks/${id}/tasks`,
                    {
                        title: task.title,
                        description: task.description,
                        priority: task.priority,
                        status: task.status,
                        due_date: task.due_date,
                        assigned_to: task.assigned_to ? Number(task.assigned_to) : null
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
            
                alert("Task created successfully");
                navigate(`/manager/projects/${id}`);
            }

        catch(error) 
            {
                console.log(error);
                alert(error.response?.data?.detail || "Unable to create task");
            }
    };


    return (

        <div className= "create-task-page">

            <h1>Create Task</h1>

            <form onSubmit= {createTask}>

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
                    rows= "5"
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
                    required
                />

                <label>Assign Member</label>
                <select
                    name= "assigned_to"
                    value= {task.assigned_to}
                    onChange= {handleChange}
                >
                    <option value= "">Select Member</option>

                    {
                        members.map(member => (
                            <option
                                key= {member.user_id}
                                value= {member.user_id}
                            >
                                {member.username}
                            </option>
                            )
                        )
                    }
                </select>

                <button type= "submit">Create Task</button>
            </form>
        </div>
    );
}

export default CreateTask;