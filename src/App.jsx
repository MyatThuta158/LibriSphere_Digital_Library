import "./App.css";
import { AuthProvider, useAuth } from "./Authentication/Auth";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import AdminMenu from "./Pages/AdminPanel/SideBarMenu";
import AdminRoute from "./Route/AdminRoute";
import MemberRoute from "./Route/MemberRoute";
// main.jsx or index.js
import "bootstrap/dist/css/bootstrap.min.css";
import CommunityMemberRoute from "./Route/CommunityMemberRoute";
import Unauthorized from "./Pages/Layouts/Unauthorized";
import NotFound from "./Pages/Layouts/NotFound";
import PermissionForUser, {
  AbilityContext,
} from "./Authentication/PermissionForUser";

function AppWithRolePermission() {
  const { user } = useAuth();
  const ability = PermissionForUser(user);

  return (
    <AbilityContext.Provider value={ability}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/Admin" element={<AdminMenu />} />
          <Route path="/*" element={<AdminRoute />} />
          <Route path="/customer/*" element={<MemberRoute />} />
          <Route path="/community/*" element={<CommunityMemberRoute />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AbilityContext.Provider>
  );
}

function App() {
  return (
    <>
      <AuthProvider>
        <AppWithRolePermission />
      </AuthProvider>
    </>
  );
}

export default App;
