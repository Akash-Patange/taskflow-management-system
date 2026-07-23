import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/adminSettings.css";


function AdminSettings(){

    const token = localStorage.getItem("token");

    const [settings,setSettings] = useState({
        app_name:"",
        default_priority:"",
        default_status:"",
        email_notification:false,
        task_notification:false,
        comment_notification:false
    });

    const [loading,setLoading] = useState(true);

    const config = {
        headers:{
            Authorization:`Bearer ${token}`
        }
    };

    useEffect(()=> {
        fetchSettings();
    },[]);

    const fetchSettings = async()=> {
        try{
            const response = await axios.get(
                "http://127.0.0.1:8000/settings",
                config
            );

            setSettings(response.data);
        }

        catch(error) {
            console.log(error);
            alert(error.response?.data?.detail || "Unable to load settings");
        }

        finally {
            setLoading(false);
        }
    };

    const handleChange= (e)=> {
        const {name,value,type,checked}= e.target;

        setSettings({
            ...settings,
            [name]: type==="checkbox" ? checked : value
        });
    };

    const updateSettings= async(e)=> {

        e.preventDefault();

        try {
            await axios.put(
                "http://127.0.0.1:8000/settings",
                {
                    app_name: settings.app_name,
                    default_priority: settings.default_priority,
                    default_status: settings.default_status,
                    email_notification: settings.email_notification,
                    task_notification: settings.task_notification,
                    comment_notification: settings.comment_notification
                },
                config
            );

            alert("Settings updated successfully");
            fetchSettings();
        }

        catch(error) {

            console.log(error);
            alert(error.response?.data?.detail || "Update failed");
        }
    };

    if(loading) {
        return <h2>Loading Settings...</h2>;
    }

    return(
        <div className= "admin-settings-page">

            <h1>Admin Settings</h1>

            <form
                className= "settings-container"
                onSubmit= {updateSettings}
            >

                <div className= "settings-card">

                    <h2>Application Settings</h2>

                    <label>Application Name</label>
                    <input
                        type= "text"
                        name= "app_name"
                        placeholder= "App Name"
                        value= {settings.app_name || ""}
                        onChange= {handleChange}
                    />

                    <label>Default Priority</label>
                    <select
                        name= "default_priority"
                        placeholder= "Priority"
                        value= {settings.default_priority || ""}
                        onChange= {handleChange}
                    >
                        <option value= "Low">Low</option>
                        <option value= "Medium">Medium</option>
                        <option value= "High">High</option>
                        <option value= "Critical">Critical</option>
                    </select>

                    <label>Default Status</label>
                    <select
                        name= "default_status"
                        placeholder= "status"
                        value= {settings.default_status || ""}
                        onChange= {handleChange}
                    >
                        <option value= "Pending">Pending</option>
                        <option value= "In Progress">In Progress</option>
                        <option value= "Completed">Completed</option>
                    </select>
                </div>

                <div className= "settings-card">

                    <h2>Notification Settings</h2>

                    <div className= "toggle-row">

                        <label>Email Notifications</label>
                        <input
                            type= "checkbox"
                            name= "email_notification"
                            checked= {settings.email_notification}
                            onChange= {handleChange}
                        />
                    </div>

                    <div className= "toggle-row">

                        <label>Task Assignment Notification</label>
                        <input
                            type= "checkbox"
                            name= "task_notification"
                            checked= {settings.task_notification}
                            onChange= {handleChange}
                        />
                    </div>

                    <div className= "toggle-row">

                        <label>Comment Notification</label>
                        <input
                            type= "checkbox"
                            name= "comment_notification"
                            checked= {settings.comment_notification}
                            onChange= {handleChange}
                        />
                    </div>
                </div>

                <button
                    className= "save-settings-btn"
                    type= "submit"
                >
                    Save Settings
                </button>
            </form>
        </div>
    );
}


export default AdminSettings;