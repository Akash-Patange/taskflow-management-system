import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

import "../styles/managerProjectDetails.css";

function ManagerProjectDetails(){

    const { id } = useParams();
    const navigate = useNavigate();
    const [project,setProject] = useState(null);
    const [tasks,setTasks] = useState([]);
    const [comments,setComments] = useState([]);
    const [loading,setLoading] = useState(true);

    useEffect(()=> {
        fetchDetails();
    },[]);

    const fetchDetails = async()=> {

        try
            {
                const token = localStorage.getItem("token");
                const config = {
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                };

                const [
                    projectRes,
                    tasksRes,
                    commentsRes
                ] = await Promise.all([

                    axios.get(
                        `http://127.0.0.1:8000/projects/${id}`,
                        config
                    ),

                    axios.get(
                        `http://127.0.0.1:8000/tasks/project-by/${id}/tasks`,
                        config
                    ),

                    axios.get(
                        `http://127.0.0.1:8000/comments/project/${id}`,
                        config
                    )
                    ]
                );

                setProject(projectRes.data);
                setTasks(tasksRes.data.tasks ||  tasksRes.data);
                setComments(commentsRes.data.comments || commentsRes.data);
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

    if(loading) 
        {
            return <h2>Loading...</h2>;
        }

    if(!project) 
        {
            return <h2>Project not found</h2>;
        }

    const completedTasks = tasks.filter(task => task.status === "Completed").length;
    const progress = tasks.length === 0 ? 0 : Math.round((completedTasks / tasks.length) * 100);


    return(

        <div className= "manager-page">

            <h1>{project.name}</h1>

            <div className= "details-card">

                <h2>Project Information</h2>

                <p><b>Description:</b> {" "} {project.description}</p>
                <p><b>Status:</b> {" "} {project.status}</p>
                <p><b>Start Date:</b> {" "} {project.start_date}</p>
                <p><b>End Date:</b> {" "} {project.end_date}</p>
            </div>

            <div className= "details-card">

                <h2>Progress</h2>

                <div className= "progress-bar">
                    <div
                        className= "progress"
                        style= {{width:`${progress}%`}}
                    >
                    </div>
                </div>

                <p>{progress}% Completed</p>
            </div>

            <div className= "action-buttons">

                <button
                    onClick= {()=> navigate(`/manager/projects/${id}/members`)}
                >
                    Assign Members
                </button>

                <button
                    onClick= {()=> navigate(`/manager/projects/${id}/tasks/create`)}
                >
                    Create Task
                </button>
            </div>

            <div className= "details-card">

                <h2>Tasks</h2>
                
                {
                    tasks.length === 0 ? <p> No tasks available </p> :
                            tasks.map(task=> (
                
                                <div
                                    className= "list-item"
                                    key= {task.id}
                                >

                                    <h3>{task.title}</h3>
                                    <p>Status: {task.status}</p>
                                </div>
                                )           
                            )
                }
            </div>

            <div className= "details-card">

                <h2>Comments</h2>

                {
                    comments.length === 0 ? <p>No comments</p> :
                            comments.map(comment=> (
                
                                <div
                                    className= "list-item"
                                    key= {comment.id}
                                >
                            
                                    <p>{comment.content}</p>
                                    <small>By {comment.username}</small>
                                </div>
                                )
                            )
                }
            </div>
        </div>
    );
}

export default ManagerProjectDetails;