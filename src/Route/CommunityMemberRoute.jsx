import React from "react";
import { Route, Routes } from "react-router-dom";
import PostsFeed from "../Pages/ForumPosts/PostsFeed";
import PostDetail from "../Pages/ForumPosts/PostDetail";
import UserPostsDisplay from "../Pages/ForumPosts/UserPostsDisplay";

function CommunityMemberRoute() {
  return (
    <div>
      <Routes>
        <Route path="/posts" element=<PostsFeed /> />
        <Route path="/postdetail/:id" element={<PostDetail />} />
        <Route path="/useruploadedpost" element={<UserPostsDisplay />} />
      </Routes>
    </div>
  );
}

export default CommunityMemberRoute;
