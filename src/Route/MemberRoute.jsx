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

import Payment from "../Pages/MemberPages/Payment";
import ResourceDetail from "../Pages/MemberPages/ResourceDetail";
import ReadResource from "../Pages/MemberPages/ReadResource";

function MemberRoute() {
  return (
    <Routes>
      <Route path="/Home" element={<Home />} />
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
    </Routes>
  );
}

export default MemberRoute;
