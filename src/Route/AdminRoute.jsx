import React from "react";
import { Routes, Route } from "react-router-dom";
import SideBarMenu from "../Pages/AdminPanel/SideBarMenu";
import AddAuthors from "../Pages/AdminPanel/Authors/AddAuthors";
import ViewAuthors from "../Pages/AdminPanel/Authors/ViewAuthors";
import UpdateAuthors from "../Pages/AdminPanel/Authors/UpdateAuthors";
import AddGenre from "../Pages/AdminPanel/Genres/AddGenre";
import AddResources from "../Pages/AdminPanel/Resources/AddResources";
import ViewGenres from "../Pages/AdminPanel/Genres/ViewGenres";
import UpdateGenre from "../Pages/AdminPanel/Genres/UpdateGenre";
import ViewResources from "../Pages/AdminPanel/Resources/ViewResources";
import RegisterAdmin from "../Pages/AdminPanel/Admins/RegisterAdmin";
import ViewAdmins from "../Pages/AdminPanel/Admins/ViewAdmins";
import ResourceDetail from "../Pages/AdminPanel/Resources/ResourceDetail";

function AdminRoute() {
  return (
    <Routes>
      <Route path="/Admin" element={<SideBarMenu />}>
        {/* This is for Authors Route */}
        <Route path="/Admin/AddAuthors" element={<AddAuthors />} />
        <Route path="/Admin/ViewAuthors" element={<ViewAuthors />} />
        <Route path="/Admin/UpdateAuthors/:id" element={<UpdateAuthors />} />

        {/* This is for Genre Route */}
        <Route path="/Admin/AddGenre" element={<AddGenre />} />
        <Route path="/Admin/ViewGenre" element={<ViewGenres />} />
        <Route path="/Admin/UpdateGenres/:id" element={<UpdateGenre />} />

        {/* This is for resources routes */}
        <Route path="/Admin/AddResource" element={<AddResources />} />
        <Route path="/Admin/ViewResource" element={<ViewResources />} />
        <Route path="/Admin/DetailResource/:id" element={<ResourceDetail />} />

        {/* This is for admins routes */}
        <Route path="/Admin/RegisterAdmin" element={<RegisterAdmin />} />
        <Route path="/Admin/ViewAdmins" element={<ViewAdmins />} />
      </Route>
    </Routes>
  );
}

export default AdminRoute;
