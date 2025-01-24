import { createContext, useEffect, useMemo, useState, useContext } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  //------This get user data from local storage----//
  const userData = JSON.parse(localStorage.getItem("user"));
  const [user, setuser] = useState(userData || null);

  //------This get cookies data from local storage----//
  const cookiesData = JSON.parse(localStorage.getItem("cookies"));
  const [token, setToken] = useState(cookiesData || null);

  //------This insert the user data with use effect into local storeage---//
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }

    //This set the token into local storage

    if (token) {
      Cookies.set("token", token, { expires: 1 });
    }
  }, [user, token]);

  //----This is for login user----//
  const loginUser = (user, token) => {
    setuser(user);
    setToken(token);

    //---This set cookies for user---//
    Cookies.set("token", token, { expires: 1 });
  };

  ////----This for memorize user---///
  const memorizeduser = useMemo(() => ({ user, token }), [user, token]);

  //---This is for logout user----//
  const logoutUser = () => {
    setuser(null);
    setToken(null);
    Cookies.remove("token");
  };

  const authContextValue = useMemo(
    () => ({
      user,
      cookiesData,
      loginUser,
      logoutUser,
    }),
    [user, token]
  );

  return (
    <AuthContext.Provider value={{ loginUser, logoutUser, user, token }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  return useContext(AuthContext);
};
