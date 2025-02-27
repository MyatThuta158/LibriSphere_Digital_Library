import React from "react";
import { Route, Routes } from "react-router-dom";
import PostsFeed from "../Pages/ForumPosts/PostsFeed";
import PostDetail from "../Pages/ForumPosts/PostDetail";

function CommunityMemberRoute() {
  return (
    <div>
      <Routes>
        <Route path="/posts" element=<PostsFeed /> />
        <Route path="/postdetail/:id" element={<PostDetail />} />
      </Routes>
    </div>
  );
}

export default CommunityMemberRoute;
