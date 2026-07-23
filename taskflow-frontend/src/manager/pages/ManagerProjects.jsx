import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import "../styles/managerProjects.css";

function ManagerProjects() {
    const [projects, setProjects] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchProjects();
    }, [page, search, status]);

    const fetchProjects = async () => {

        try 
            {
                const response = await axios.get(
                    "http://127.0.0.1:8000/projects/manager-projects",
                    {
                        params: {
                            page,
                            limit: 8,
                            search,
                            status
                        },
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setProjects(response.data.projects);
                setTotalPages(response.data.total_pages);
            } 

        catch (error) 
            {
                console.log(error);
            }
    };


    const deleteProject = async (id) => {
    
        if (!window.confirm("Delete this project?")) return;

        try 
            {
                await axios.delete(
                    `http://127.0.0.1:8000/projects/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                fetchProjects();
            } 
        catch (error) 
            {
                console.log(error);
            }
    };



    return (
        <div className= "page-container">
            <div className= "page-header">

                <h1>My Projects</h1>
                <Link
                    to= "/manager/projects/create"
                    className= "create-btn"
                >
                    + Create Project
                </Link>
            </div>

            <div className= "filter-bar">

                <input
                    type= "text"
                    placeholder= "Search project..."
                    value= {search}
                    onChange= {(e) => {
                        setPage(1);
                        setSearch(e.target.value);
                    }}
                />
                <select
                    value= {status}
                    onChange= {(e) => {
                        setPage(1);
                        setStatus(e.target.value);
                    }}
                >
                    <option value= "">All Status</option>
                    <option value= "Planning">Planning</option>
                    <option value= "Active">Active</option>
                    <option value= "Completed">Completed</option>
                    <option value= "On Hold">On Hold</option>
                </select>
            </div>

            <div className= "project-grid">

                {
                    projects.length === 0 ? (
                        <h3>No Projects Found</h3>
                    ) : (
                        projects.map((project) => (

                            <div
                                className= "project-card"
                                key= {project.id}
                            >
                                <h2>{project.name}</h2>
                                <p>{project.description}</p>
                                <span className= {`status ${project.status.toLowerCase().replace(" ", "-")}`}>
                                    {project.status}
                                </span>

                                <div className= "project-info">
                                    
                                    <p><strong>Start:</strong> {" "} {project.start_date || "-"}</p>
                                    <p><strong>End:</strong> {" "} {project.end_date || "-"}</p>
                                </div>

                                <div className= "card-buttons">

                                    <Link
                                        to= {`/manager/projects/${project.id}`}
                                        className= "view-btn"
                                    >
                                        View
                                    </Link>

                                    <Link
                                        to= {`/manager/projects/edit/${project.id}`}
                                        className= "edit-btn"
                                    >
                                        Edit
                                    </Link>

                                    <button
                                        className= "delete-btn"
                                        onClick= {() => deleteProject(project.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                            )
                        )
                    )
                }
            </div>

            <div className= "pagination">

                <button
                    disabled= {page === 1}
                    onClick= {() => setPage(page - 1)}
                >
                    Previous
                </button>

                <span>Page {page} of {totalPages}</span>

                <button
                    disabled= {page === totalPages}
                    onClick= {() => setPage(page + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default ManagerProjects;