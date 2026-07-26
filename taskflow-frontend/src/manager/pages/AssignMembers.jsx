import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


import "../styles/assignMembers.css";
import api from "../../services/api";

function AssignMembers() {

    const { id } = useParams();
    const [employees, setEmployees] = useState([]);
    const [assignedMembers, setAssignedMembers] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {

        try 
            {
                const usersResponse = await api.get(
                    "/admin/all",
                    {
                        headers:{
                            Authorization:`Bearer ${token}`
                        }
                    }
                );

                const membersOnly = usersResponse.data.filter(user => user.role === "Member");

                const assignedResponse = await api.get(
                    `/projects/${id}/members`,
                    {
                        headers:{
                            Authorization:`Bearer ${token}`
                        }
                    }
                );

                setEmployees(membersOnly);
                setAssignedMembers(assignedResponse.data);
            }

        catch(error) 
            {
                console.log(error);
            }
    };

    const assignMember = async(userId)=> {
    
        try
            {
                await api.post(
                    `/projects/${id}/members`,
                    {
                        user_id:userId
                    },
                    {
                        headers:{
                            Authorization:`Bearer ${token}`
                        }
                    }
                );
            
                fetchMembers();
            }

        catch(error) 
            {
                console.log(error);
                alert( error.response?.data?.detail || "Unable to assign member");
            }
    };

    const removeMember = async(userId)=> {
    
        try
            {
                await api.delete(
                    `/projects/${id}/members`,
                    {
                        params:{
                            user_id:userId
                        },
                        headers:{
                            Authorization:`Bearer ${token}`
                        }
                    }
                );
            
                fetchMembers();
            }

        catch(error) 
            {
                console.log(error);
            }
    };

    const isAssigned = (userId)=> {
        return assignedMembers.some(member => Number(member.user_id) === Number(userId));
    };

    
    return (

        <div className= "assign-page">

            <h1>Assign Members</h1>

            <div className= "members-container">
                <div className= "available-section">

                    <h2>Available Employees</h2>
                    {
                        employees.length === 0 ? (<p>No employees found</p>) : employees.map(employee=> (

                                <div 
                                    className= "member-card"
                                    key= {employee.id}
                                >
                                    <div>
                                        <h3>{employee.username}</h3>
                                        <p>{employee.email}</p>
                                    </div>

                                    {
                                        isAssigned(employee.id) ? <button disabled>Assigned</button> :
                                                    <button
                                                        onClick= {()=> assignMember(employee.id)}
                                                    >
                                                        Assign
                                                    </button>
                                    }
                                </div>
                            )
                        )
                    }
                </div>

                <div className= "assigned-section">

                    <h2>Assigned Members</h2>

                    {
                        assignedMembers.length === 0 ? ( <p> No members assigned </p>) :
                                    assignedMembers.map(member=> (
                                        <div
                                            className= "member-card"
                                            key= {member.id}
                                        >
                                            <div>
                                                <h3>{member.username}</h3>
                                                <p>{member.email}</p>
                                            </div>

                                            <button
                                                onClick= {()=> removeMember(member.user_id)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    )
                                )
                    }
                </div>
            </div>
        </div>
    );
}


export default AssignMembers;