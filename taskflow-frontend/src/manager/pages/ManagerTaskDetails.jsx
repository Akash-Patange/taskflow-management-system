import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

import "../styles/managerTaskDetails.css";

function ManagerTaskDetails(){

    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const token = localStorage.getItem("token");
    const [task,setTask] = useState(null);
    const [comments,setComments] = useState([]);
    const [comment,setComment] = useState("");
    const [loading,setLoading] = useState(true);

    const config = {
        headers:{
            Authorization:`Bearer ${token}`
        }
    };


    useEffect(()=>{
        fetchTaskDetails();
    },[]);


    const fetchTaskDetails = async()=>{

        try
            {
                const response = await axios.get(
                    `http://127.0.0.1:8000/tasks/tasks/${id}`,
                    config
                );

                setTask(response.data);
                fetchComments();
            }

        catch(error)
            {
                console.log(error);
                alert(error.response?.data?.detail || "Unable to load task");
            }

        finally
            {
                setLoading(false);
            }
    };

    const fetchComments = async()=>{

        try
            {
                const response = await axios.get(
                    `http://127.0.0.1:8000/comments/task/${id}`,
                    config
                );

                setComments(response.data);
            }

        catch(error)
            {
                console.log(error);
            }
    };

    const addComment = async(e)=>{

        e.preventDefault();
        if(!comment.trim()){
            return;
        }

        try
            {
                await axios.post(
                    `http://127.0.0.1:8000/comments/${id}/comment`,
                    {
                        content: comment
                    },
                    config
                );

            
                setComment("");
                fetchComments();
            }

        catch(error)
            {
                console.log(error);
                alert(error.response?.data?.detail ||   "Unable to add comment");
            }
    };

    const deleteComment = async(commentId)=> {
        
        const confirmDelete = window.confirm("Delete this comment?");

        if(!confirmDelete){
            return;
        }

        try
            {
                await axios.delete(
                    `http://127.0.0.1:8000/comments/${commentId}`,
                    config
                );

                fetchComments();
            }

        catch(error)
            {
                console.log(error);
                alert(  error.response?.data?.detail ||    "Unable to delete comment");
            }
    };

    const canDeleteComment = ()=> {
        return (    user?.role === "Admin" ||    user?.role === "Manager");
    };


    if(loading){
        return (
            <div className= "manager-page">

                <h2>Loading...</h2>
            </div>
        );
    }


    if(!task){
        return (
            <div className= "manager-page">

                <h2>Task not found</h2>
            </div>
        );
    }



    return(

        <div className= "manager-page">

            <h1>Task Details</h1>

            <div className= "details-card">

                <h2>{task.title}</h2>
                <p> <b>Description:</b>  {" "} {task.description || "No description"}  </p>
                <p> <b>Project:</b>  {" "} {task.project_name || "-"}  </p>
                <p> <b>Status:</b>  {" "} {task.status}   </p>
                <p> <b>Priority:</b>  {" "} {task.priority}   </p>
                <p> <b>Due Date:</b>  {" "} {task.due_date || "No date"}    </p>
                <p> <b>Assigned Member:</b>  {" "} {task.assigned_name || "Not Assigned"}   </p>
            </div>

            <div className= "details-card">
                <div className= "comment-header">

                    <h2>Comments</h2>

                    <button
                        className= "view-btn"
                        onClick= {fetchComments}
                    >
                        Refresh
                    </button>
                </div>

                {
                    comments.length === 0 ?
                    (
                        <p>No comments available</p>
                    )
                    :
                    comments.map(item=>(

                        <div
                            className= "list-item"
                            key= {item.id}
                        >

                            <p>{item.content}</p>
                            <small>By {item.username}</small>

                            <br/>

                            {
                                canDeleteComment() &&
                                (
                                    <button
                                        className= "delete-btn"
                                        onClick= {()=> deleteComment(item.id)}
                                    >
                                        Delete
                                    </button>
                                )
                            }
                        </div>
                        )
                    )
                }
            </div>

            <div className= "details-card">

                <h2>Add Comment</h2>

                <form onSubmit= {addComment}>
                    
                    <textarea
                        value= {comment}
                        onChange= {(e)=> setComment(e.target.value)}
                        placeholder= "Write task update, issue, or completion note..."
                        rows= "5"
                    />

                    <button
                        type= "submit"
                        className= "create-btn"
                    >
                        Add Comment
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ManagerTaskDetails;