import React from "react";
import { Route, Routes } from "react-router-dom";
import PostsFeed from "../Pages/ForumPosts/PostsFeed";
import PostDetail from "../Pages/ForumPosts/PostDetail";
import UserPostsDisplay from "../Pages/ForumPosts/UserPostsDisplay";
import PostEngagement from "../Pages/ForumPosts/PostEngagement";
import SideBar from "../Pages/ForumPosts/Layout/SideBar";

function CommunityMemberRoute() {
  return (
    <div>
      <Routes>
        <Route path="/posts" element=<PostsFeed /> />
        <Route path="/postdetail/:id" element={<PostDetail />} />
        <Route path="/useruploadedpost" element={<UserPostsDisplay />} />

        <Route path="/posts" element={<SideBar />}>
          <Route path="/posts/postengagement" element={<PostEngagement />} />
        </Route>
      </Routes>
    </div>
  );
}

export default CommunityMemberRoute;
