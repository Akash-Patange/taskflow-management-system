import "../styles/userTable.css";


function UserTable({users}){

    return (

        <table className= "user-table">

            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>

            <tbody>
                {
                    users.map((user)=> (
                        <tr key= {user.id}>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                {
                                    user.is_active ? "Active" : "Inactive"
                                }
                            </td>
                            <td>
                                <button>Edit</button>
                                <button>Delete</button>
                            </td>
                        </tr>
                        )
                    )
                }
            </tbody>
        </table>
    );
}


export default UserTable;