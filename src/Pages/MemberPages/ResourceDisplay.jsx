import React, { useEffect, useState } from "react";
import Menu from "./Layouts/Menu";
import { fetchResource, search } from "../../api/resourceApi"; // Import search function
import { Link } from "react-router-dom"; // Import Link component

function ResourceDisplay() {
  const [resources, setResources] = useState([]); // Ensure it's always an array
  const [pageCount, setPageCount] = useState(0); // Total pages
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [searchQuery, setSearchQuery] = useState(""); // Store search input
  const [noResults, setNoResults] = useState(false); // Track no results
  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      try {
        let result;

        if (searchQuery.trim() === "") {
          // Fetch all resources when search input is empty
          result = await fetchResource(currentPage);
          setPageCount(result?.data?.last_page || 0);
        } else {
          // Fetch search results
          console.log(searchQuery);
          result = await search(searchQuery);
        }

        // Ensure resources is always an array
        const data = result?.data?.data || result?.data || [];
        setResources(data);
        setNoResults(data.length === 0);
      } catch (error) {
        console.error("Error fetching resources:", error);
        setResources([]); // Avoid undefined errors
        setNoResults(true);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, currentPage]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div>
      <Menu />

      <section id="hero" className="hero1 dark-background">
        <img
          src="../Customer/Resource.jpg"
          alt=""
          data-aos="fade-in"
          style={{ height: "80vh" }}
        />
        <div className="container d-flex flex-column align-items-center">
          <h2 data-aos="fade-up" data-aos-delay="100">
            Search Digital Resource
          </h2>

          <div
            className="container w-50 mx-auto mt-3"
            style={{ height: "15vh" }}
          >
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search Digital Resource..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container mt-5">
        <h2 className="text-center mb-5">All Digital Resources</h2>
        {noResults ? (
          <p className="text-center">Search data not found.</p>
        ) : (
          <div className="row" id="book-list">
            {resources.map((resource) => {
              const { id, name, cover_photo } = resource;
              return (
                <div className="col-md-3 mb-4" key={id}>
                  <div className="card h-100">
                    <img
                      src={baseUrl + "storage/" + cover_photo}
                      className="card-img-top"
                      alt={name}
                      style={{ height: "30vh", objectFit: "cover" }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{name}</h5>
                      <Link
                        to={`/Customer/resource/${resource.id}`}
                        className="btn btn-primary"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ResourceDisplay;
