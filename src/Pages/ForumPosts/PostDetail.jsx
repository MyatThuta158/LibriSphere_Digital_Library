import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getSinglePosts } from "../../api/forumpostApi";
import SideBar from "./Layout/SideBar";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Slider from "react-slick"; // slider library

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await getSinglePosts(id);
        setPost(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return <div>Loading post...</div>;
  }

  if (error) {
    return <div>Error loading post: {error.message}</div>;
  }

  // Create an array of photos if they exist in the API response
  const photos = [];
  if (post.Photo1) photos.push(post.Photo1);
  if (post.Photo2) photos.push(post.Photo2);
  if (post.Photo3) photos.push(post.Photo3);

  // Format the creation date for display
  const formattedDate = new Date(post.created_at).toLocaleDateString();

  // Slider settings for react-slick
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <HelmetProvider>
      <Helmet>
        <link rel="stylesheet" type="text/css" href="/style/style111.css" />
        {/* Include react-slick styles */}
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
        />
      </Helmet>
      <div>
        <section
          className="d-flex"
          style={{ position: "relative", bottom: "10%" }}
        >
          <SideBar />
          <div className="main-content">
            <div className="container">
              {/* Render the slider only if there are photos */}
              {photos.length > 0 && (
                <Slider {...sliderSettings}>
                  {photos.map((photo, index) => (
                    <div key={index} className="w-50 img-fluid">
                      <img
                        className="img-fluid"
                        src={`http://127.0.0.1:8000/storage/${photo}`}
                        alt={`${post.Title} - Slide ${index + 1}`}
                      />
                    </div>
                  ))}
                </Slider>
              )}
              <h1 className="text-black add-letter-space mt-4">{post.Title}</h1>
              <ul className="post-meta mt-3 mb-4">
                <li className="d-inline-block mr-3">
                  <span className="fas fa-clock text-primary"></span>
                  <a className="ml-1" href="#">
                    {formattedDate}
                  </a>
                </li>
              </ul>
              <p>{post.Description}</p>
            </div>
          </div>
        </section>
      </div>
    </HelmetProvider>
  );
}

export default PostDetail;
