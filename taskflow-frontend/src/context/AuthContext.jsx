import { createContext, useEffect, useState } from "react";
import { loginUser, logoutUser, getCurrentUser } from "../services/authService";

export const AuthContext= createContext();


export function AuthProvider({children}) {
    const [token, setToken]= useState(localStorage.getItem("token"));
    const [user, setUser]= useState(null);
    const [loading, setLoading]= useState(true);


    const login= async(Credentials)=> {
        const response= await loginUser(Credentials);
        localStorage.setItem("token", response.access_token);
        setToken(response.access_token);
        
        const currentUser= await getCurrentUser();
        setUser(currentUser);
        return response;
    };



    const logout= ()=> {
        logoutUser();
        setToken(null);
        setUser(null);
    };


    useEffect(()=> {
        const loadUser= async()=> {
            
            if (token)
                {
                    try
                        {
                            const currentUser= await getCurrentUser();
                            setUser(currentUser);
                        } 
                    catch (error) 
                        {
                            logout();
                        }
                }
                
                setLoading(false);
        };
        
        loadUser();
        }, [token]
    );
    
    
    return(
        
        <AuthContext.Provider value= {
            {
                token,
                user,
                loading,
                login,
                logout,
                isAuthenticated: !!token
            }
        }
        >
            {children}
        </AuthContext.Provider>
    );
}