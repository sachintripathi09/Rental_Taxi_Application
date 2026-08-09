import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Now we also retrieve the stored username along with the token and role
    const [user, setUser] = useState(
        localStorage.getItem('token') 
            ? { 
                username: localStorage.getItem('username'), 
                role: localStorage.getItem('role') 
              }
            : null
    );
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [role, setRole] = useState(localStorage.getItem('role'));

    const login = (newToken, username, userRole) => {
        // Save all three to local storage
        localStorage.setItem('token', newToken);
        localStorage.setItem('role', userRole);
        localStorage.setItem('username', username); // <--- ADDED THIS LINE
        
        // Update the state variables
        setToken(newToken);
        setRole(userRole);
        setUser({ username, role: userRole });
    };

    const logout = () => {
        // Clear everything
        localStorage.clear();
        setToken(null);
        setRole(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);