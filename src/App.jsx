import "./App.css";
import { AuthProvider } from "./Authentication/Auth";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import AdminMenu from "./Pages/AdminPanel/SideBarMenu";
import AdminRoute from "./Route/AdminRoute";
import MemberRoute from "./Route/MemberRoute";
// main.jsx or index.js
import "bootstrap/dist/css/bootstrap.min.css";
import CommunityMemberRoute from "./Route/CommunityMemberRoute";

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Admin" element={<AdminMenu />} />
            <Route path="/*" element={<AdminRoute />} />
            <Route path="/customer/*" element={<MemberRoute />} />
            <Route path="/community/*" element={<CommunityMemberRoute />} />
            {/* <Route path="/customer/home" element={<Home />} /> */}
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
