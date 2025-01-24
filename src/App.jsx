import "./App.css";
import { AuthProvider } from "./Authentication/Auth";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import AdminMenu from "./Pages/AdminPanel/SideBarMenu";
import AdminRoute from "./Route/AdminRoute";


function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Admin" element={<AdminMenu />} />
            <Route path="/*" element={<AdminRoute />} />
            
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
