import { createContext, useEffect, useMemo, useState, useContext } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Safely get user data from local storage
  const storedUser = localStorage.getItem("user");
  const userData =
    storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;
  const [user, setUser] = useState(userData);

  // Safely get token data from local storage
  const storedToken = localStorage.getItem("token");
  const tokenData =
    storedToken && storedToken !== "undefined" ? JSON.parse(storedToken) : null;
  const [token, setToken] = useState(tokenData);

  useEffect(() => {
    // Update local storage for user
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }

    // Update token in cookies and local storage
    if (token) {
      Cookies.set("token", token, { expires: 1 });
      localStorage.setItem("token", JSON.stringify(token));
    } else {
      Cookies.remove("token");
      localStorage.removeItem("token");
    }
  }, [user, token]);

  // Function to log in a user
  const loginUser = (user, token) => {
    setUser(user);
    setToken(token);
    Cookies.set("token", token, { expires: 1 });
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", JSON.stringify(token));
  };

  // Function to log out a user
  const logoutUser = () => {
    setUser(null);
    setToken(null);
    Cookies.remove("token");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // Memoize the context value to optimize performance
  const authContextValue = useMemo(
    () => ({
      user,
      token,
      loginUser,
      logoutUser,
    }),
    [user, token]
  );

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
