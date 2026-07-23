import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import "../styles/adminTasks.css";

function AdminTasks() {

    const [tasks,setTasks] = useState([]);
    const [loading,setLoading] = useState(false);
    const [page,setPage] = useState(1);
    const [totalPages,setTotalPages] = useState(1);
    const [showFilters,setShowFilters] = useState(false);

    const [filters,setFilters] = useState({
        search:"",
        status:"",
        priority:"",
        project_id:"",
        assigned_to:""
    });

    const [projects,setProjects] = useState([]);
    const [users,setUsers] = useState([]);

    const fetchTasks = async()=> {

        try
            {
                setLoading(true);
                const response = await api.get(
                    "/tasks/tasks",
                    {
                        params: {
                            page,
                            limit:10,
                            search: filters.search || undefined,
                            status: filters.status || undefined,
                            priority: filters.priority || undefined,
                            project_id: filters.project_id || undefined,
                            assigned_to: filters.assigned_to || undefined
                        }
                    }
                );

                setTasks(response.data.tasks);
                setTotalPages(response.data.total_page);
            }

        catch(error) 
            {
                console.log("Task Error:", error);
            }

        finally 
            {
                setLoading(false);
            }
    };

    const fetchProjects = async()=> {
    
        try
            {
                const response = await api.get("/projects/all");
                setProjects(response.data);
            }
        
        catch(error)
            {
                console.log(error);
            }
    };

    const fetchUsers = async()=> {
    
        try
            {
                const response = await api.get("/admin/all");
                setUsers(response.data);
            }

        catch(error) {console.log(error);}
    };

    useEffect(()=> {
        fetchTasks();
        },
        [
            page,
            filters
        ]
    );

    useEffect(()=> {
        fetchProjects();
        fetchUsers();
    },[]);

    const handleFilter= (e)=> {
        setPage(1);
        setFilters({
            ...filters,
            [e.target.name]:
            e.target.value
            }
        );
    };

    const resetFilters= ()=> {
        setFilters({
            search:"",
            status:"",
            priority:"",
            project_id:"",
            assigned_to:""
            }
        );
        setPage(1);
    };

    const statusClass= (status)=> {
        return status ?.toLowerCase().replace(" ","-");
    };

    const priorityClass= (priority)=> {
        return priority?.toLowerCase();
    };

    const deleteTask = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this task?"
        );
        
        if (!confirmDelete) return;

        try 
            {
                await api.delete(`/tasks/tasks/${id}`);

                alert("Task deleted successfully");
                fetchTasks();
            }

        catch (error) 
            {
                console.log(error);
                alert("Failed to delete task");
            }
        };


    return (
            <div className= "admin-tasks">
                <div className= "tasks-header">
                    <div>

                        <h1>All Tasks</h1>
                        <p>Manage every task across projects</p>
                    </div>

                    <button className= "create-btn">
                        + Create Task
                    </button>
                </div>

                <div className= "filter-box">

                    <input
                        type= "text"
                        name= "search"
                        placeholder= "Search tasks..."
                        value= {filters.search}
                        onChange= {handleFilter}
                    />


                    <button
                        className= "filter-toggle"
                        onClick= {()=> setShowFilters(!showFilters)}
                    >
                        Filters ⚙
                    </button>


                    <button
                        className= "reset-btn"
                        onClick= {resetFilters}
                    >
                        Reset
                    </button>
                </div>


                {
                    showFilters &&
                    <div className= "advanced-filters">
                        
                        <select
                            name= "status"
                            value= {filters.status}
                            onChange= {handleFilter}
                        >

                            <option value= "">All Status</option>
                            <option value= "Pending">Pending</option>
                            <option value= "In Progress">In Progress</option>
                            <option value= "Completed">Completed</option>
                        </select>

                        <select
                            name= "priority"
                            value= {filters.priority}
                            onChange= {handleFilter}
                        >
                        
                            <option value= "">All Priority</option>
                            <option value= "Low">Low</option>
                            <option value= "Medium">Medium</option>
                            <option value= "High">High</option>
                        </select>

                        <select
                            name= "project_id"
                            value= {filters.project_id}
                            onChange= {handleFilter}
                        >
                            <option value= "">All Projects</option>

                            {
                                projects.map(project=> (
                                    <option 
                                        key= {project.id}
                                        value= {project.id}
                                    >
                                        {project.name}
                                    </option>
                                    )
                                )
                            }
                        </select>

                        <select
                            name= "assigned_to"
                            value= {filters.assigned_to}
                            onChange= {handleFilter}
                        >
                            <option value= "">All Users</option>

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
                }

                <div className= "table-container">

                    {
                        loading ? <h3>Loading tasks...</h3> :

                            <table>
                                <thead>
                                    <tr>
                                        <th>Task</th>
                                        <th>Project</th>
                                        <th>Assigned</th>
                                        <th>Priority</th>
                                        <th>Status</th>
                                        <th>Due Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                
                                <tbody>

                                    {
                                        tasks.length=== 0 ?
                                            <tr>
                                                <td colSpan= "7">No tasks found</td>
                                            </tr>
                                            :
                                            tasks.map(task=> (
                                            <tr key= {task.id}>
                                                <td>
                                                    <div className= "task-name">
                                                        <strong>{task.title}</strong>
                                                        <span>
                                                            {
                                                                task.description || "No description"
                                                            }
                                                        </span>
                                                    </div>
                                                </td>

                                                <td>
                                                    {
                                                        task.project_name || "N/A"
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        task.assigned_name || "Unassigned"
                                                    }
                                                </td>

                                                <td>
                                                    <span
                                                        className= { `priority ${priorityClass(
                                                                        task.priority)}`
                                                                    }
                                                    >
                                                        {task.priority}
                                                    </span>
                                                </td>

                                                <td>
                                                    <span
                                                        className=  {`status ${statusClass(task.status)}`}
                                                    >
                                                        {task.status}
                                                    </span>
                                                </td>

                                                <td>
                                                    {
                                                        task.due_date ?
                                                            new Date(task.due_date).toLocaleDateString()
                                                            :
                                                            "No date"
                                                    }
                                                </td>

                                                <td>
                                                    <div className="user-actions">

                                                        <Link
                                                            to= {`/admin/tasks/edit/${task.id}`}
                                                            className= "edit-btn"
                                                        >
                                                            Edit
                                                        </Link>

                                                        <button
                                                            className= "delete-btn"
                                                            onClick= {() => deleteTask(task.id)}
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
                    }
                </div>

                <div className= "pagination">
                    <button
                        disabled= {page=== 1}
                        onClick= {()=> setPage(page-1)}
                    >
                        Previous
                    </button>

                    <span>Page {page} / {totalPages}</span>

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

export default AdminTasks;