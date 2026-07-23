import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminRoute from "./routes/AdminRoute";
import AdminLayout from "./admin/layouts/AdminLayout";

import ManagerRoutes from "./routes/ManagerRoute";
import ManagerLayout from "./manager/layouts/ManagerLayout";

import MemberRoutes from "./routes/MemberRoute";
import MemberLayout from "./member/layouts/MemberLayouts";

function App(){

    return (
        <Routes>
            {/* PUBLIC ROUTES */}
 
            <Route
                path= "/login"
                element= {<Login/>}
            />

            <Route
                path= "/register"
                element= {<Register/>}
            />




            {/* ADMIN ROUTES */}

            <Route
                path= "/admin/*"
                element= {
                    <AdminRoute>
                        <AdminLayout/>
                    </AdminRoute>
                }
            />
                    




            {/* Manager Routes */}

            <Route
                path= "/manager/*"
                element= {
                    <ManagerRoutes>
                        <ManagerLayout />
                    </ManagerRoutes>
                }
            />




            {/* Member Routes  */}

            <Route
                path= "/member/*"
                element= {
                    <MemberRoutes>
                        <MemberLayout />
                    </MemberRoutes>
                }
            />
        </Routes>
    );
}

export default App;
