import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";

import "../styles/adminProjectDetails.css";

function AdminProjectDetails(){

    const { id } = useParams();
    const [project,setProject] = useState(null);
    const [progress,setProgress] = useState(null);
    const [members,setMembers] = useState([]);
    const [tasks,setTasks] = useState([]);
    const [comments,setComments] = useState([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState("");

    const fetchDetails = async()=> {

        try
            {
                setLoading(true);
                const [
                    projectRes,
                    progressRes,
                    membersRes,
                    tasksRes,
                    commentsRes
                ] = await Promise.all(
                    [
                        api.get(`/projects/${id}`),
                        api.get(`/dashboard/projects/${id}/progress`),
                        api.get(`/projects/${id}/members`),
                        api.get(`/tasks/project-by/${id}/tasks`),
                        api.get(`/comments/project/${id}`)
                    ]
                );

                setProject(projectRes.data);
                setProgress(progressRes.data);
                setMembers(membersRes.data);
                setTasks(tasksRes.data);
                setComments(commentsRes.data);
        }

        catch(err)
            {
                console.log(err);
                setError("Failed to load project details");
            }

        finally
            {
                setLoading(false);
            }
    };


    useEffect(()=> {
        fetchDetails();
    }, [id]);
    
    if(loading)
        {
            return (
                <h2>Loading project details...</h2>
            );
        }

    if(error)
        {
            return (
                <h2>{error}</h2>
            );
        }


    return(

        <div className= "project-details-page">
            <div className= "details-header">
                <div>

                    <h1>{project.name}</h1>
                    <span className= "status">{project.status}</span>
                </div>

                <Link to= {`/admin/projects/edit/${project.id}`} className="edit-btn">
                    Edit Project
                </Link>
            </div>

            <div className= "details-card">
                
                <h2>Project Information</h2>
                <p>{project.description}</p>

                <div className= "dates">
                    <div>

                        <strong>Start Date</strong>
                        <p>{project.start_date}</p>
                    </div>

                    <div>

                        <strong>End Date</strong>
                        <p>{project.end_date}</p>
                    </div>
                </div>
            </div>



            <div className= "details-card">

                <h2>Progress</h2>

                <div className= "progress-bar">
                    <div
                        className= "progress-fill"
                        style= {
                            {
                                width:`${progress.progress}%`
                            }
                        }
                    >
                    </div>
                </div>

                <h3>{progress.progress}%</h3>
            </div>


            <div className= "stats-grid">
                <div className= "stat-card">

                    <h3>Total Tasks</h3>
                    <p>{progress.total_tasks}</p>
                </div>

                <div className= "stat-card">
                    
                    <h3>Completed</h3>
                    <p>{progress.completed_tasks}</p>
                </div>

                <div className= "stat-card">

                    <h3>Pending</h3>
                    <p>{progress.pending_tasks}</p>
                </div>

                <div className= "stat-card">

                    <h3>In Progress</h3>
                    <p>{progress.in_progress_tasks}</p>
                </div>
            </div>


            <div className= "details-card">

                <h2>Team Members</h2>

                <div className= "member-list">
                    {
                        members.map(
                            member=>(
                                <div
                                    className= "member"
                                    key= {member.id}
                                >

                                    <h3>{member.username}</h3>
                                    <p>{member.role}</p>
                                </div>
                            )
                        )
                    }
                </div>
            </div>


            <div className= "details-card">

                <h2>Recent Tasks</h2>
                {
                    tasks.slice(0,5).map(
                        task=> (
                            <div
                                className= "task-row"
                                key= {task.id}
                            >
                                <strong>{task.title}</strong>
                                <span>{task.status}</span>
                            </div>
                        )
                    )
                }
            </div>


            <div className= "details-card">

                <h2>Recent Comments</h2>
                {
                    comments.map(
                        comment=> (
                            <div
                                className= "comment"
                                key= {comment.id}
                            >
                                <p>{comment.content}</p>
                            </div>
                        )
                    )
                }
            </div>
        </div>
    );
}


export default AdminProjectDetails;