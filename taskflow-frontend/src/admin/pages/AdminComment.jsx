import { useEffect, useState } from "react";
import api from "../../services/api";
import "../styles/adminComment.css";


function AdminComments() {

    const [comments,setComments] = useState([]);
    const [projects,setProjects] = useState([]);
    const [users,setUsers] = useState([]);
    const [tasks,setTasks] = useState([]);
    const [page,setPage] = useState(1);
    const [totalPages,setTotalPages] = useState(1);

    const [filters,setFilters] = useState({
        search:"",
        project_id:"",
        task_id:"",
        user_id:""
        }
    );

    const limit = 10;

    const fetchComments = async()=> {

        try
            {
                const response = await api.get(
                    "/comments/all",
                    {
                        params:{
                            page,
                            limit,
                            search:filters.search || undefined,
                            project_id:filters.project_id || undefined,
                            task_id:filters.task_id || undefined,
                            user_id:filters.user_id || undefined
                        }
                    }
                );

                setComments(response.data.comments);
                setTotalPages(response.data.total_pages);
            }

        catch(error) 
            {
                console.log(error);
            }
    };

    const fetchFilters = async()=> {
    
        try
            {
                const [
                    projectRes,
                    userRes,
                    taskRes
                ] = await Promise.all([
                    api.get("/projects/all"),
                    api.get("/admin/all"),
                    api.get("/tasks/tasks")
                    ]
                );

                setProjects(projectRes.data.projects || projectRes.data);
                setUsers(userRes.data.users || userRes.data);
                setTasks(taskRes.data.tasks || taskRes.data);
            }

        catch(error) 
            {
                console.log(error);
            }
    };

    useEffect(()=> {
        fetchFilters();
    },[]);

    useEffect(()=> {
        fetchComments();
    },[page,filters]);

    const handleFilter= (e)=> {
        setPage(1);
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
            }
        );
    };

    const resetFilters= ()=> {
        setFilters({
            search:"",
            project_id:"",
            task_id:"",
            user_id:""
            }
        );
        setPage(1);
    };

    const deleteComment= async(id)=> {
        const confirm = window.confirm("Delete this comment?");
        if(!confirm) return;
    
        try
            {
                await api.delete(`/comments/${id}`);
                fetchComments();
            }

        catch(error) 
            {
                console.log(error);
            }
    };


    return(

        <div className= "admin-comments">

            <h1>Comments Management</h1>

            <div className= "comment-filters">
        
                <input
                    name= "search"
                    placeholder= "Search comment..."
                    value= {filters.search}
                    onChange= {handleFilter}
                />

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
                    name= "task_id"
                    value= {filters.task_id}
                    onChange= {handleFilter}
                >
                    <option value= "">All Tasks</option>
                    {
                        tasks.map(task=> (
                            <option
                                key= {task.id}
                                value= {task.id}
                            >
                                {task.title}
                            </option>
                            )
                        )
                    }
                </select>

                <select
                    name= "user_id"
                    value= {filters.user_id}
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

                <button
                    onClick= {resetFilters}
                >
                    Reset
                </button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Comment</th>
                        <th>Task</th>
                        <th>Project</th>
                        <th>User</th>
                        <th>Date</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        comments.map(comment=> (
                            <tr key= {comment.id}>
                                <td>{comment.id}</td>
                                <td>{comment.content}</td>
                                <td>{comment.task_name}</td>
                                <td>{comment.project_name}</td>
                                <td>{comment.username}</td>
                                <td>{new Date(comment.created_at).toLocaleDateString()}</td>
                                <td>
                                    <button
                                        className= "delete-btn"
                                        onClick= {()=> deleteComment(comment.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                            )
                        )
                    }
                </tbody>
            </table>

            <div className= "pagination">
                <button
                    disabled= {page=== 1}
                    onClick= {()=> setPage(page-1)}
                >
                    Previous
                </button>

                <span>{page} / {totalPages}</span>

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


export default AdminComments;