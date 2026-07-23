import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import axios from "axios";

import "../styles/MemberTaskDetails.css";



function MemberTaskDetails() {

    const { id } = useParams();

    const [task,setTask] = useState(null);
    const [comments,setComments] = useState([]);
    const [comment,setComment] = useState("");
    const [status,setStatus] = useState("");
    const [loading,setLoading] = useState(true);
    
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const config = {
        headers:{
            Authorization:`Bearer ${token}`
        }
    };

    useEffect(()=> {
        fetchTask();
        fetchComments();
    }, []);

    const fetchTask = async()=> {

        try
            {
                const res = await axios.get(`http://127.0.0.1:8000/tasks/tasks/${id}`,config);

                setTask(res.data);
                setStatus(res.data.status);
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

    const fetchComments = async()=> {

        try
            {
                const res = await axios.get(`http://127.0.0.1:8000/comments/task/${id}`, config);
        
                setComments(res.data);
            }

        catch(error) 
            {
                console.log(error);
            }
    };

    const addComment = async(e)=> {

        e.preventDefault();

        if(!comment.trim())
            return;

        try
            {
                await axios.post(
                    `http://127.0.0.1:8000/comments/${id}/comment`,
                    {
                        content:comment
                    },
                    config
                );
            
                setComment("");
                fetchComments();
            }

        catch(error) 
            {
                console.log(error);
                alert(  error.response?.data?.detail || "Unable to add comment");
            }
    };

    const deleteComment = async(commentId)=> {

        if(!window.confirm("Delete this comment?"))
            return;

        try
            {
                await axios.delete(`http://127.0.0.1:8000/comments/${commentId}`,   config);
        
                fetchComments();
            }

        catch(error) 
            {
                console.log(error);
                alert(error.response?.data?.detail || "Delete failed");
            }
    };

    const updateStatus = async()=> {

        if(status === task.status)
            return;

        try
            {
                await axios.put(
                    `http://127.0.0.1:8000/tasks/${id}/status`,
                    {
                        status:status
                    },
                    config
                );
            
                alert("Status updated");
                fetchTask();
            }

        catch(error) 
            {
                console.log(error);
                alert(error.response?.data?.detail || "Status update failed");
            }
    };

    if(loading) {
        return <h2>Loading...</h2>;
    }

    if(!task) {
        return <h2>Task not found</h2>;
    }

    return (

        <div className= "member-task-details">

            <button
                onClick= {()=> navigate(-1)}
            >
                ← Back
            </button>

            <h1>{task.title}</h1>

            <div className= "details-card">

                <h2>Task Details</h2>
                <p> <b>Description:</b> {" "}   {task.description || "No description"}  </p>
                <p> <b>Project:</b> {" "}   {task.project_name}   </p>
                <p> <b>Priority:</b> {" "}   {task.priority}   </p>
                <p> <b>Assigned By:</b> {" "}    {task.assigned_name}   </p>
                <p> <b>Due Date:</b> {" "}   {task.due_date}    </p>
            </div>

            <div className= "details-card">

                <h2>Update Status</h2>

                <select
                    value= {status}
                    onChange= {(e) => setStatus(e.target.value)}
                >
                    {
                        task.status === "Pending" && (
                            <>
                                <option value= "Pending">Pending</option>
                                <option value= "In Progress">In Progress</option>
                            </>
                        )
                    }

                    {
                        task.status === "In Progress" && (
                            <>
                                <option value= "In Progress">In Progress</option>
                                <option value= "Completed">Completed</option>
                                <option value= "On Hold">On Hold</option>
                            </>
                        )
                    }

                    {
                        task.status === "On Hold" && (
                            <>
                                <option value= "On Hold">On Hold</option>
                                <option value= "In Progress">In Progress</option>
                            </>
                        )
                    }

                    {
                        task.status === "Completed" && (
                            <option value= "Completed">Completed</option>
                        )
                    }
                </select>

                <button
                    onClick= {updateStatus}
                >
                    Update Status
                </button>
            </div>

            <div className= "details-card">

                <h2>Comments</h2>
                {
                    comments.length === 0 ?
                    <p>No comments yet</p>
                    :
                    comments.map(item=> (

                        <div
                            key= {item.id}
                            className= "comment-card"
                        >

                            <p>{item.content}</p>

                            <small>By {item.username}</small>

                            <button
                                onClick= {()=> deleteComment(item.id)}
                            >
                                Delete
                            </button>
                        </div>
                        )
                    )
                }

                <form
                    onSubmit= {addComment}
                >

                    <textarea
                        placeholder= "Write comment..."
                        value= {comment}
                        onChange= {(e)=>setComment(e.target.value)}
                    />

                    <button>Add Comment</button>
                </form>
            </div>
        </div>
    );
}


export default MemberTaskDetails;