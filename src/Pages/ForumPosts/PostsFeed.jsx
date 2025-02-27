import React, { useEffect, useState } from "react";
import SideBar from "./Layout/SideBar";
import { Helmet, HelmetProvider } from "react-helmet-async";
import InfiniteScroll from "react-infinite-scroll-component";
import { getPosts } from "../../api/forumpostApi"; // Use your provided function
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";

function PostsFeed() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10; // posts per page
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await getPosts({ page, limit });
      if (response.success) {
        const paginatedData = response.data;
        const newPosts = paginatedData.data;

        // Simply append new posts without filtering duplicates
        setPosts((prevPosts) => [...prevPosts, ...newPosts]);

        if (paginatedData.current_page < paginatedData.last_page) {
          setPage(paginatedData.current_page + 1);
        } else {
          // Reset page to 1 to loop back
          setPage(1);
        }
      } else {
        console.error("API error:", response.error);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  // Base URL for your storage images. Adjust if necessary.
  const baseStorageUrl = "http://127.0.0.1:8000/storage";

  return (
    <HelmetProvider>
      <Helmet>
        <link rel="stylesheet" type="text/css" href="/style/style111.css" />
      </Helmet>
      <section
        className="d-flex"
        style={{ position: "relative", bottom: "10%" }}
      >
        <SideBar />
        <div className="main-content">
          <div className="container pt-1 mt-1">
            <InfiniteScroll
              dataLength={posts.length}
              next={fetchPosts}
              hasMore={hasMore}
              loader={<h4>Loading...</h4>}
              endMessage={
                <p style={{ textAlign: "center" }}>
                  <b>No more posts</b>
                </p>
              }
            >
              {posts.map((post, index) => {
                // Create an array of available images (non-null values)
                const images = [post.Photo1, post.Photo2, post.Photo3].filter(
                  Boolean
                );
                return (
                  <div
                    key={`${post.ForumPostId}-${index}`}
                    className="card post-item bg-transparent border-0 mb-2"
                  >
                    <a href={`post-details/${post.ForumPostId}`}>
                      {images.length === 1 && (
                        <img
                          className="card-img-top rounded-0"
                          src={`${baseStorageUrl}/${images[0]}`}
                          alt={post.Title}
                        />
                      )}
                      {images.length > 1 && (
                        <Slider {...sliderSettings}>
                          {images.map((img, idx) => (
                            <div key={idx}>
                              <img
                                className="card-img-top rounded-0"
                                src={`${baseStorageUrl}/${img}`}
                                alt={`${post.Title} ${idx + 1}`}
                              />
                            </div>
                          ))}
                        </Slider>
                      )}
                      {/* If no images, nothing is rendered */}
                    </a>
                    <div className="card-body px-0">
                      <h2 className="card-title">
                        <a
                          className="text-black opacity-75-onHover"
                          href={`post-details/${post.ForumPostId}`}
                        >
                          {post.Title}
                        </a>
                      </h2>
                      <ul className="post-meta mt-3">
                        <li className="d-inline-block mr-3">
                          <span className="fas fa-clock text-primary"></span>
                          <a className="ml-1" href="#">
                            {new Date(post.created_at).toLocaleDateString()}
                          </a>
                        </li>
                        <li className="d-inline-block">
                          <span className="fas fa-list-alt text-primary"></span>
                          <a className="ml-1" href="#">
                            Photography
                          </a>
                        </li>
                      </ul>
                      <p className="card-text my-4">
                        {post.Description.substring(0, 150)}...
                      </p>
                      <a
                        className="btn btn-primary"
                        onClick={() => {
                          navigate(`/community/postdetail/${post.ForumPostId}`);
                        }}
                      >
                        Read More{" "}
                      </a>
                    </div>
                  </div>
                );
              })}
            </InfiniteScroll>
          </div>
        </div>
      </section>
    </HelmetProvider>
  );
}

export default PostsFeed;
