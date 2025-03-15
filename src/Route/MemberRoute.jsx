import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../Pages/MemberPages/Home";

import ResourceDisplay from "../Pages/MemberPages/ResourceDisplay";
import MemberRegister from "../Pages/MemberPages/MemberRegister";
import Membership from "../Pages/MemberPages/Membership";
import {
  MembershipContext,
  MembershipProvider,
} from "../Pages/MemberPages/Context/MembershipContext";
import ViewDetailResource from "../Pages/MemberPages/ViewDetailRequest";

import Payment from "../Pages/MemberPages/Payment";
import ResourceDetail from "../Pages/MemberPages/ResourceDetail";
import ReadResource from "../Pages/MemberPages/ReadResource";
import RequestResources from "../Pages/MemberPages/RequestResources";
import ViewDetailRequest from "../Pages/MemberPages/ViewDetailRequest";
import Profile from "../Pages/MemberPages/Profile";
import PermissionForRoute from "../Authentication/PermissionForRoute";
import Home1 from "../Pages/MemberPages/home1";

function MemberRoute() {
  return (
    <Routes>
      <Route
        element={
          <PermissionForRoute role={["manager", "librarian", "member"]} />
        }
      >
        <Route path="/Home" element={<Home />} />

        <Route path="/Home1" element={<Home1 />} />
        <Route path="/Resource" element={<ResourceDisplay />} />

        {/* Wrap only the necessary routes with MembershipProvider */}
        <Route
          path="/MemberRegister"
          element={
            <MembershipProvider>
              <MemberRegister />
            </MembershipProvider>
          }
        />
        <Route
          path="/Membership"
          element={
            <MembershipProvider>
              <Membership />
            </MembershipProvider>
          }
        />

        <Route
          path="/Payment"
          element={
            <MembershipProvider>
              <Payment />
            </MembershipProvider>
          }
        />

        <Route path="/resource/:id" element={<ResourceDetail />} />
        <Route path="/readResource" element={<ReadResource />} />
        <Route element={<PermissionForRoute role={["member"]} />}>
          <Route path="/ResourceRequest" element={<RequestResources />} />
        </Route>
        {/* This is for request resource route */}

        <Route path="/DetailRequest/:id" element={<ViewDetailRequest />} />

        {/* This is for profile route */}
        <Route path="/Profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default MemberRoute;
