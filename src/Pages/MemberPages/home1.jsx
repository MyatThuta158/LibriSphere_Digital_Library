import React, { useEffect, useState } from "react";
import Menu from "../Layouts/Menu";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { getResources } from "../../api/resourceApi";
import { Card, Row, Col } from "react-bootstrap";

function Home1() {
  const [resource, setResource] = useState([]);
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    const fetchResource = async () => {
      const resResource = await getResources();

      setResource(resResource.data);
    };

    fetchResource();
  });

  //console.log(resource);
  return (
    <HelmetProvider>
      <Helmet>
        <link rel="stylesheet" href="/style/main.css" />
      </Helmet>
      <div style={{ overflow: "hidden" }}>
        <Menu />

        <section id="hero" className="hero section dark-background">
          <img src="../Customer/homeBg1.jpg" alt="" data-aos="fade-in" />

          <div className="container d-flex flex-column align-items-center">
            <h2 data-aos="fade-up" data-aos-delay="100">
              READ. LEARN. ACCESS.
            </h2>
            <p data-aos="fade-up" data-aos-delay="200">
              LibriSphere gives you access to Audiobooks, eBooks, Music, Movies
              and Comics.
            </p>
            <div
              className="d-flex mt-4"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <a href="#about" className="btn-get-started">
                Start Membership
              </a>
              <a
                href="https://www.youtube.com/watch?v=Y7f98aduVJ8"
                className="glightbox btn-watch-video d-flex align-items-center"
              >
                <i className="bi bi-play-circle"></i>
                <span>Watch Video</span>
              </a>
            </div>
          </div>
        </section>

        <section id="stats" className="stats section light-background">
          <div className="container" data-aos="fade-up" data-aos-delay="100">
            <div className="row gy-4">
              <div className="col-lg-3  col-md-6">
                <div className="stats-item d-flex bg-warning text-white justify-content-center  align-items-center w-100 h-100">
                  <div className="">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="46"
                      height="46"
                      fill="currentColor"
                      className="bi text-center mx-auto w-100 bi-book-half"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8.5 2.687c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783" />
                    </svg>
                    <div>
                      <span
                        data-purecounter-start="0"
                        data-purecounter-end="232"
                        data-purecounter-duration="1"
                        className="purecounter text-center text-white"
                      >
                        2554
                      </span>
                      <p className="text-center">EBooks</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="stats-item d-flex bg-primary text-white justify-content-center  align-items-center w-100 h-100">
                  <div className="">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="46"
                      height="46"
                      fill="currentColor"
                      className="bi text-center mx-auto w-100 bi-book-half"
                      viewBox="0 0 16 16"
                    >
                      <path d="M0 1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm4 0v6h8V1zm8 8H4v6h8zM1 1v2h2V1zm2 3H1v2h2zM1 7v2h2V7zm2 3H1v2h2zm-2 3v2h2v-2zM15 1h-2v2h2zm-2 3v2h2V4zm2 3h-2v2h2zm-2 3v2h2v-2zm2 3h-2v2h2z" />
                    </svg>
                    <div>
                      <span
                        data-purecounter-start="0"
                        data-purecounter-end="232"
                        data-purecounter-duration="1"
                        className="purecounter text-center text-white"
                      >
                        1000+
                      </span>
                      <p className="text-center">Videos</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="stats-item d-flex bg-danger text-white justify-content-center  align-items-center w-100 h-100">
                  <div className="">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="46"
                      height="46"
                      fill="currentColor"
                      className="bi text-center mx-auto w-100 bi-book-half"
                      viewBox="0 0 16 16"
                    >
                      <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M11 6.64v1.75l-2 .5v3.61c0 .495-.301.883-.662 1.123C7.974 13.866 7.499 14 7 14s-.974-.134-1.338-.377C5.302 13.383 5 12.995 5 12.5s.301-.883.662-1.123C6.026 11.134 6.501 11 7 11c.356 0 .7.068 1 .196V6.89a1 1 0 0 1 .757-.97l1-.25A1 1 0 0 1 11 6.64" />
                    </svg>
                    <div>
                      <span
                        data-purecounter-start="0"
                        data-purecounter-end="232"
                        data-purecounter-duration="1"
                        className="purecounter text-center text-white"
                      >
                        1000+
                      </span>
                      <p className="text-center">Videos</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="stats-item d-flex bg-info text-white justify-content-center  align-items-center w-100 h-100">
                  <div className="">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="46"
                      height="46"
                      fill="currentColor"
                      className="bi text-center mx-auto w-100 bi-book-half"
                      viewBox="0 0 16 16"
                    >
                      <path d="M0 2.5A1.5 1.5 0 0 1 1.5 1h11A1.5 1.5 0 0 1 14 2.5v10.528c0 .3-.05.654-.238.972h.738a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 1 1 0v9a1.5 1.5 0 0 1-1.5 1.5H1.497A1.497 1.497 0 0 1 0 13.5zM12 14c.37 0 .654-.211.853-.441.092-.106.147-.279.147-.531V2.5a.5.5 0 0 0-.5-.5h-11a.5.5 0 0 0-.5.5v11c0 .278.223.5.497.5z" />
                      <path d="M2 3h10v2H2zm0 3h4v3H2zm0 4h4v1H2zm0 2h4v1H2zm5-6h2v1H7zm3 0h2v1h-2zM7 8h2v1H7zm3 0h2v1h-2zm-3 2h2v1H7zm3 0h2v1h-2zm-3 2h2v1H7zm3 0h2v1h-2z" />
                    </svg>
                    <div>
                      <span
                        data-purecounter-start="0"
                        data-purecounter-end="232"
                        data-purecounter-duration="1"
                        className="purecounter text-center text-white"
                      >
                        4000+
                      </span>
                      <p className="text-center">Newspaper</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="tab-pane mt-5 " id="features-tab-3">
          <div className="row">
            <div className="col-lg-6 order-2 order-lg-1 mt-3 mt-lg-0">
              <h3 className="text-danger text-uppercase text-center text-bolder">
                Welcome to the LibriSphere
              </h3>
              <div
                className=" bg-info text-info mx-auto"
                style={{ width: "20vw", height: "1px" }}
              >
                -
              </div>
              <p className="mt-4 text-justify w-75 mx-auto">
                Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis
                aute irure dolor in reprehenderit in voluptate velit esse cillum
                dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident, sunt in culpa qui officia deserunt
                mollit anim id est laborumLorem ipsum dolor sit amet,
                consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua. Ullamco laboris nisi ut aliquip
                ex ea commodo consequat. Duis aute irure dolor in reprehenderit
                in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                Excepteur sint occaecat cupidatat non proident, sunt in culpa
                qui officia deserunt mollit anim id est laborumLorem ipsum dolor
                sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
            <div
              className="col-lg-6 order-1 order-lg-2 text-center"
              style={{ width: "45vw", height: "60%" }}
            >
              <img
                src="../Customer/about1.jpg"
                alt=""
                className="img-fluid"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
        </div>

        <section id="services" className="services section">
          <div className="container section-title" data-aos="fade-up">
            <h2>Services</h2>
            <span>
              Here is our current services and we offer four main services to
              readers and members all over the world.
            </span>
          </div>

          <div className="container">
            <div className="row gy-4">
              <div
                className="col-lg-6 "
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <div className="service-item d-flex">
                  <div className="icon flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="56"
                      height="56"
                      fill="currentColor"
                      className="bi bi-book"
                      viewBox="0 0 16 16"
                    >
                      <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="title">
                      <a
                        href="services-details.html"
                        className="stretched-link"
                      >
                        Digital Library
                      </a>
                    </h4>
                    <p className="description">
                      we provide digital access for every reader from different
                      countries all over the world.
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="col-lg-6 "
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <div className="service-item d-flex">
                  <div className="icon flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="56"
                      height="56"
                      fill="currentColor"
                      className="bi bi-journal"
                      viewBox="0 0 16 16"
                    >
                      <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2" />
                      <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="title">
                      <a
                        href="services-details.html"
                        className="stretched-link"
                      >
                        Latest Ebooks
                      </a>
                    </h4>
                    <p className="description">
                      We also offer latest ebooks to all of library member.
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="col-lg-6 "
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <div className="service-item d-flex">
                  <div className="icon flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="56"
                      height="56"
                      fill="currentColor"
                      className="bi bi-clock-history"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022zm2.004.45a7 7 0 0 0-.985-.299l.219-.976q.576.129 1.126.342zm1.37.71a7 7 0 0 0-.439-.27l.493-.87a8 8 0 0 1 .979.654l-.615.789a7 7 0 0 0-.418-.302zm1.834 1.79a7 7 0 0 0-.653-.796l.724-.69q.406.429.747.91zm.744 1.352a7 7 0 0 0-.214-.468l.893-.45a8 8 0 0 1 .45 1.088l-.95.313a7 7 0 0 0-.179-.483m.53 2.507a7 7 0 0 0-.1-1.025l.985-.17q.1.58.116 1.17zm-.131 1.538q.05-.254.081-.51l.993.123a8 8 0 0 1-.23 1.155l-.964-.267q.069-.247.12-.501m-.952 2.379q.276-.436.486-.908l.914.405q-.24.54-.555 1.038zm-.964 1.205q.183-.183.35-.378l.758.653a8 8 0 0 1-.401.432z" />
                      <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0z" />
                      <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="title">
                      <a
                        href="services-details.html"
                        className="stretched-link"
                      >
                        Historical digital resource
                      </a>
                    </h4>
                    <p className="description">
                      We store and provide the historical books, videos and
                      audio to all the members.
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="col-lg-6 "
                data-aos="fade-up"
                data-aos-delay="400"
              >
                <div className="service-item d-flex">
                  <div className="icon flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="56"
                      height="56"
                      fill="currentColor"
                      className="bi bi-globe"
                      viewBox="0 0 16 16"
                    >
                      <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855A8 8 0 0 0 5.145 4H7.5zM4.09 4a9.3 9.3 0 0 1 .64-1.539 7 7 0 0 1 .597-.933A7.03 7.03 0 0 0 2.255 4zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a7 7 0 0 0-.656 2.5zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5zM8.5 5v2.5h2.99a12.5 12.5 0 0 0-.337-2.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5zM5.145 12q.208.58.468 1.068c.552 1.035 1.218 1.65 1.887 1.855V12zm.182 2.472a7 7 0 0 1-.597-.933A9.3 9.3 0 0 1 4.09 12H2.255a7 7 0 0 0 3.072 2.472M3.82 11a13.7 13.7 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5zm6.853 3.472A7 7 0 0 0 13.745 12H11.91a9.3 9.3 0 0 1-.64 1.539 7 7 0 0 1-.597.933M8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855q.26-.487.468-1.068zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.7 13.7 0 0 1-.312 2.5m2.802-3.5a7 7 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7 7 0 0 0-3.072-2.472c.218.284.418.598.597.933M10.855 4a8 8 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="title">
                      <a
                        href="services-details.html"
                        className="stretched-link"
                      >
                        Community
                      </a>
                    </h4>
                    <p className="description">
                      We also have the community and all people can join to
                      discuss about knowledge.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="features section">
          <div className="container section-title" data-aos="fade-up">
            <h2>Our Library Features</h2>
            <span>
              We have special features that other libraries don't have.
            </span>
          </div>

          <div className="container">
            <div className="row gy-4 align-items-stretch justify-content-between features-item ">
              <div
                className="col-lg-6 d-flex align-items-center features-img-bg"
                data-aos="zoom-out"
              >
                <img src="/Customer/homeBg.jpg" className="img-fluid" alt="" />
              </div>
              <div
                className="col-lg-5 d-flex justify-content-center flex-column"
                data-aos="fade-up"
              >
                <p>
                  Cupiditate placeat cupiditate placeat est ipsam culpa.
                  Delectus quia minima quod. Sunt saepe odit aut quia voluptatem
                  hic voluptas dolor doloremque. Cupiditate placeat cupiditate
                  placeat est ipsam culpa. Delectus quia minima quod. Sunt saepe
                  odit aut quia voluptatem hic voluptas dolor
                  doloremque.Cupiditate placeat cupiditate placeat est ipsam
                  culpa. Delectus quia minima quod. Sunt saepe odit aut quia
                  voluptatem hic voluptas dolor doloremque.Cupiditate placeat
                  cupiditate placeat est ipsam culpa. Delectus quia minima quod.
                  Sunt saepe odit aut quia voluptatem hic voluptas dolor
                  doloremque.
                </p>
                <ul>
                  <li>
                    <i className="bi bi-check"></i>{" "}
                    <span>
                      Ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </span>
                  </li>
                  <li>
                    <i className="bi bi-check"></i>
                    <span>
                      {" "}
                      Duis aute irure dolor in reprehenderit in voluptate velit.
                    </span>
                  </li>
                  <li>
                    <i className="bi bi-check"></i>{" "}
                    <span>
                      Facilis ut et voluptatem aperiam. Autem soluta ad fugiat
                    </span>
                    .
                  </li>
                </ul>
                <a href="#" className="btn btn-get-started align-self-start">
                  Get Started
                </a>
              </div>
            </div>
          </div>
        </section>

        <div className="container section-title" data-aos="fade-up">
          <h2>Our Resources</h2>
          <span>
            Explore our collection of digital resources and publications
          </span>
        </div>
        <section
          id=""
          className=" "
          style={{
            background:
              "linear-gradient(rgba(255,255,255,0.6), rgba(255,255,255,0.6)), url('/Customer/memberRegister.jpg')",
            backgroundAttachment: "fixed",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="container ">
            <h2
              className="text-left font-bolder text-uppercase"
              style={{ fontWeight: "bolder" }}
            >
              Latest Digital Resources
            </h2>
            <Row className="g-1">
              {resource.map((resource) => (
                <Col key={resource.id} xs={12} sm={6} md={3} lg={3}>
                  {" "}
                  {/* Changed to 3 columns for 4 items per row */}
                  <div
                    className="position-relative"
                    onMouseEnter={() => setHoveredItem(resource.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <Card className="h-100 shadow-lg border-0 overflow-hidden">
                      <div className="card-image-container">
                        <Card.Img
                          variant="top"
                          src={`http://127.0.0.1:8000/storage/${resource.cover_photo}`}
                          className="card-image"
                        />
                      </div>

                      <Card.Body className="position-relative bg-dark text-light p-4">
                        <Card.Title className="mb-3">
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted text-white">
                              {resource.publish_date}
                            </small>
                          </div>
                          <h2 className="mt-2 text-uppercase text-white fs-5">
                            {resource.name}
                          </h2>
                        </Card.Title>

                        {hoveredItem === resource.id && (
                          <div className="hover-overlay p-3">
                            <div className="hover-content">
                              <p className="text-muted mb-2">
                                ISBN: {resource.ISBN}
                              </p>
                              <p className="small">{resource.Description}</p>
                            </div>
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        <style>{`
          .card-image-container {
            height: 300px;
            overflow: hidden;
            position: relative;
          }
          
          .card-image {
            height: 100%;
            width: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
          }
          
          .hover-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            opacity: 0;
            animation: fadeIn 0.3s forwards;
          }
          
          .hover-content {
            position: relative;
            z-index: 2;
            height: 100%;
            overflow-y: auto;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          .card:hover .card-image {
            transform: scale(1.05);
          }
        `}</style>

        <section id="pricing" className="pricing section">
          <div className="container section-title" data-aos="fade-up">
            <h2>Subscription Plans</h2>
            <span>
              Necessitatibus eius consequatur ex aliquid fuga eum quidem sint
              consectetur velit
            </span>
          </div>

          <div className="container" data-aos="zoom-in" data-aos-delay="100">
            <div className="row g-4">
              <div className="col-lg-4">
                <div className="pricing-item">
                  <h3>Free Plan</h3>
                  <div className="icon">
                    <i className="bi bi-box"></i>
                  </div>
                  <h4>
                    <sup>$</sup>0<span> / month</span>
                  </h4>
                  <ul>
                    <li>
                      <i className="bi bi-check"></i>{" "}
                      <span className="text-center">
                        Lorem ipsum is a nonsensical Latin text used to fill
                        empty spaces in graphic design, publishing, and web
                        development. It is derived from a 1st-century BC text by
                        Cicero, and has been popularized by Letraset, PageMaker,
                        and other software.
                      </span>
                    </li>
                  </ul>
                  <div className="text-center">
                    <a href="#" className="buy-btn">
                      Buy Now
                    </a>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="pricing-item featured">
                  <h3>Business Plan</h3>
                  <div className="icon">
                    <i className="bi bi-rocket"></i>
                  </div>

                  <h4>
                    <sup>$</sup>29<span> / month</span>
                  </h4>
                  <ul>
                    <li>
                      <i className="bi bi-check"></i>{" "}
                      <span className="text-center">
                        Lorem ipsum is a nonsensical Latin text used to fill
                        empty spaces in graphic design, publishing, and web
                        development. It is derived from a 1st-century BC text by
                        Cicero, and has been popularized by Letraset, PageMaker,
                        and other software.
                      </span>
                    </li>
                  </ul>
                  <div className="text-center">
                    <a href="#" className="buy-btn">
                      Buy Now
                    </a>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="pricing-item">
                  <h3>Developer Plan</h3>
                  <div className="icon">
                    <i className="bi bi-send"></i>
                  </div>
                  <h4>
                    <sup>$</sup>49<span> / month</span>
                  </h4>
                  <ul>
                    <li>
                      <i className="bi bi-check"></i>{" "}
                      <span className="text-center">
                        Lorem ipsum is a nonsensical Latin text used to fill
                        empty spaces in graphic design, publishing, and web
                        development. It is derived from a 1st-century BC text by
                        Cicero, and has been popularized by Letraset, PageMaker,
                        and other software.
                      </span>
                    </li>
                  </ul>
                  <div className="text-center">
                    <a href="#" className="buy-btn">
                      Buy Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Title */}

        {/* End Section Title */}

        <section id="team" className="team section light-background">
          <div className="container section-title" data-aos="fade-up">
            <h2>Member Reviews</h2>
            <span>Here is our user reviews</span>
          </div>

          <div className="container">
            <div className="row gy-5">
              <div
                className="col-lg-4 col-md-6 member"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <div className="member-img">
                  <img src="/Customer/pic.jpg" className="img-fluid" alt="" />
                  <div className="social">
                    <a href="#">
                      <i className="bi bi-twitter-x"></i>
                    </a>
                    <a href="#">
                      <i className="bi bi-facebook"></i>
                    </a>
                    <a href="#">
                      <i className="bi bi-instagram"></i>
                    </a>
                    <a href="#">
                      <i className="bi bi-linkedin"></i>
                    </a>
                  </div>
                </div>
                <div className=" text-center">
                  <h4>Walter White</h4>
                  <span>1 year member</span>
                  <p>
                    The library is amazing and the digital resources are too
                    much that I cannot read.
                  </p>
                </div>
              </div>

              <div
                className="col-lg-4 col-md-6 member"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <div className="member-img">
                  <img src="/Customer/pic.jpg" className="img-fluid" alt="" />
                  <div className="social">
                    <a href="#">
                      <i className="bi bi-twitter-x"></i>
                    </a>
                    <a href="#">
                      <i className="bi bi-facebook"></i>
                    </a>
                    <a href="#">
                      <i className="bi bi-instagram"></i>
                    </a>
                    <a href="#">
                      <i className="bi bi-linkedin"></i>
                    </a>
                  </div>
                </div>
                <div className=" text-center">
                  <h4>Sarah Jhonson</h4>
                  <span>3 year member</span>
                  <p>
                    Labore ipsam sit consequatur exercitationem rerum laboriosam
                    laudantium aut quod dolores exercitationem ut
                  </p>
                </div>
              </div>

              <div
                className="col-lg-4 col-md-6 member"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <div className="member-img">
                  <img src="/Customer/pic.jpg" className="img-fluid" alt="" />
                  <div className="social">
                    <a href="#">
                      <i className="bi bi-twitter-x"></i>
                    </a>
                    <a href="#">
                      <i className="bi bi-facebook"></i>
                    </a>
                    <a href="#">
                      <i className="bi bi-instagram"></i>
                    </a>
                    <a href="#">
                      <i className="bi bi-linkedin"></i>
                    </a>
                  </div>
                </div>
                <div className="text-center">
                  <h4>William Anderson</h4>
                  <span>5 year member</span>
                  <p>
                    Illum minima ea autem doloremque ipsum quidem quas
                    aspernatur modi ut praesentium vel tque sed facilis at qui
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="faq section">
          <div className="container">
            <div className="row gy-4">
              <div className="col-lg-4" data-aos="fade-up" data-aos-delay="100">
                <div className="content px-xl-5">
                  <h3>
                    <span>Frequently Asked </span>
                    <strong>Questions</strong>
                  </h3>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Duis aute irure dolor in reprehenderit
                  </p>
                </div>
              </div>
              <div className="col-lg-8" data-aos="fade-up" data-aos-delay="200">
                <div className="faq-container">
                  <div className="faq-item faq-active">
                    <h3>
                      <span className="num">1.</span>
                      <span>
                        Non consectetur a erat nam at lectus urna duis?
                      </span>
                    </h3>
                    <div className="faq-content">
                      <p>
                        Feugiat pretium nibh ipsum consequat. Tempus iaculis
                        urna id volutpat lacus laoreet non curabitur gravida.
                        Venenatis lectus magna fringilla urna porttitor rhoncus
                        dolor purus non.
                      </p>
                    </div>
                    <i className="faq-toggle bi bi-chevron-right"></i>
                  </div>
                  {/* End Faq item */}
                  <div className="faq-item">
                    <h3>
                      <span className="num">2.</span>
                      <span>
                        Feugiat scelerisque varius morbi enim nunc faucibus a
                        pellentesque?
                      </span>
                    </h3>
                    <div className="faq-content">
                      <p>
                        Dolor sit amet consectetur adipiscing elit pellentesque
                        habitant morbi. Id interdum velit laoreet id donec
                        ultrices. Fringilla phasellus faucibus scelerisque
                        eleifend donec pretium. Est pellentesque elit
                        ullamcorper dignissim. Mauris ultrices eros in cursus
                        turpis massa tincidunt dui.
                      </p>
                    </div>
                    <i className="faq-toggle bi bi-chevron-right"></i>
                  </div>
                  {/* End Faq item */}
                  <div className="faq-item">
                    <h3>
                      <span className="num">3.</span>
                      <span>
                        Dolor sit amet consectetur adipiscing elit pellentesque?
                      </span>
                    </h3>
                    <div className="faq-content">
                      <p>
                        Eleifend mi in nulla posuere sollicitudin aliquam
                        ultrices sagittis orci. Faucibus pulvinar elementum
                        integer enim. Sem nulla pharetra diam sit amet nisl
                        suscipit. Rutrum tellus pellentesque eu tincidunt.
                        Lectus urna duis convallis convallis tellus. Urna
                        molestie at elementum eu facilisis sed odio morbi quis
                      </p>
                    </div>
                    <i className="faq-toggle bi bi-chevron-right"></i>
                  </div>
                  {/* End Faq item */}
                  <div className="faq-item">
                    <h3>
                      <span className="num">4.</span>
                      <span>
                        Ac odio tempor orci dapibus. Aliquam eleifend mi in
                        nulla?
                      </span>
                    </h3>
                    <div className="faq-content">
                      <p>
                        Dolor sit amet consectetur adipiscing elit pellentesque
                        habitant morbi. Id interdum velit laoreet id donec
                        ultrices. Fringilla phasellus faucibus scelerisque
                        eleifend donec pretium. Est pellentesque elit
                        ullamcorper dignissim. Mauris ultrices eros in cursus
                        turpis massa tincidunt dui.
                      </p>
                    </div>
                    <i className="faq-toggle bi bi-chevron-right"></i>
                  </div>
                  {/* End Faq item */}
                  <div className="faq-item">
                    <h3>
                      <span className="num">5.</span>
                      <span>
                        Tempus quam pellentesque nec nam aliquam sem et tortor
                        consequat?
                      </span>
                    </h3>
                    <div className="faq-content">
                      <p>
                        Molestie a iaculis at erat pellentesque adipiscing
                        commodo. Dignissim suspendisse in est ante in. Nunc vel
                        risus commodo viverra maecenas accumsan. Sit amet nisl
                        suscipit adipiscing bibendum est. Purus gravida quis
                        blandit turpis cursus in
                      </p>
                    </div>
                    <i className="faq-toggle bi bi-chevron-right"></i>
                  </div>
                  {/* End Faq item */}
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer id="footer" className="footer bg-primary text-white">
          <div className="container footer-top">
            <div className="row gy-4">
              <div className="col-lg-4 col-md-6 footer-about">
                <a href="index.html" className="logo d-flex align-items-center">
                  <span className="sitename text-white">LibriSphere</span>
                </a>
                <div className="footer-contact pt-3">
                  <p>A108 Adam Street</p>
                  <p>New York, NY 535022</p>
                  <p className="mt-3">
                    <strong>Phone:</strong> <span>+1 5589 55488 55</span>
                  </p>
                  <p>
                    <strong>Email:</strong> <span>info@example.com</span>
                  </p>
                </div>
                <div className="social-links text-white d-flex mt-4">
                  <a href="">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-facebook"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951" />
                    </svg>
                  </a>
                  <a href="">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-twitter-x"
                      viewBox="0 0 16 16"
                    >
                      <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
                    </svg>
                  </a>
                  <a href="">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-youtube"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.01 2.01 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31 31 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A100 100 0 0 1 7.858 2zM6.4 5.209v4.818l4.157-2.408z" />
                    </svg>
                  </a>
                  <a href="">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-instagram"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
                    </svg>
                  </a>
                </div>
              </div>

              <div className="col-lg-2 col-md-3 footer-links text-white">
                <h4 className="text-white">Useful Links</h4>
                <ul>
                  <li>
                    <i className="bi bi-chevron-right"></i>{" "}
                    <a href="#" className="text-white">
                      Home
                    </a>
                  </li>
                  <li>
                    <i className="bi bi-chevron-right"></i>{" "}
                    <a href="#" className="text-white">
                      About us
                    </a>
                  </li>
                  <li>
                    <i className="bi bi-chevron-right"></i>{" "}
                    <a href="#" className="text-white">
                      Services
                    </a>
                  </li>
                  <li>
                    <i className="bi bi-chevron-right"></i>{" "}
                    <a href="#" className="text-white">
                      Terms of service
                    </a>
                  </li>
                  <li>
                    <i className="bi bi-chevron-right"></i>{" "}
                    <a href="#" className="text-white">
                      Privacy policy
                    </a>
                  </li>
                </ul>
              </div>

              <div className="col-lg-2 col-md-3 footer-links">
                <h4 className="text-white">Our Services</h4>
                <ul>
                  <li>
                    <i className="bi bi-chevron-right"></i>{" "}
                    <a href="#" className="text-white">
                      Web Design
                    </a>
                  </li>
                  <li>
                    <i className="bi bi-chevron-right"></i>{" "}
                    <a href="#" className="text-white">
                      Web Development
                    </a>
                  </li>
                  <li>
                    <i className="bi bi-chevron-right"></i>{" "}
                    <a href="#" className="text-white">
                      Product Management
                    </a>
                  </li>
                  <li>
                    <i className="bi bi-chevron-right"></i>{" "}
                    <a href="#" className="text-white">
                      Marketing
                    </a>
                  </li>
                  <li>
                    <i className="bi bi-chevron-right"></i>{" "}
                    <a href="#" className="text-white">
                      Graphic Design
                    </a>
                  </li>
                </ul>
              </div>

              <div className="col-lg-4 col-md-12 footer-newsletter">
                <h4 className="text-white text-uppercase">LibriSphere</h4>
                <p className="text-white">
                  Subscribe to our newsletter and receive the latest news about
                  our products and services!Subscribe to our newsletter and
                  receive the latest news about our products and
                  services!Subscribe to our newsletter and receive the latest
                  news about our products and services!Subscribe to our
                  newsletter and receive the latest news about our products and
                  services!
                </p>
              </div>
            </div>
          </div>

          <div className="container copyright text-center mt-4">
            <p>
              © <span>Copyright</span>{" "}
              <strong className="px-1 sitename">LibriSphere</strong>{" "}
              <span>All Rights Reserved</span>
            </p>
          </div>
        </footer>
      </div>
    </HelmetProvider>
  );
}

export default Home1;
