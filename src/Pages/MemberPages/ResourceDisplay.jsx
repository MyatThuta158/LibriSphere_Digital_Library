import React, { useEffect, useState } from "react";
import Menu from "../Layouts/Menu";
import { fetchResource, search } from "../../api/resourceApi";
import { Link } from "react-router-dom";
import { Spinner, Alert } from "react-bootstrap";

function ResourceDisplay() {
  const [resources, setResources] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    type: "all",
    sort: "newest",
  });
  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const params = {
          page: currentPage,
          type: filters.type,
          sort: filters.sort,
        };

        const result = searchQuery.trim()
          ? await search(searchQuery, params)
          : await fetchResource(params);

        setPageCount(result?.data?.last_page || 0);
        const data = result?.data?.data || [];
        setResources(data);
        setNoResults(data.length === 0);
      } catch (err) {
        setError("Failed to load resources. Please try again later.");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(fetchData, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery, currentPage, filters]);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="resource-browser">
      {/* <Menu /> */}

      <section
        className="text-light"
        style={{
          background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/Customer/Resource.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="container py-5">
          <div className="text-center mb-4">
            <h1 className="display-5 text-white fw-bold">
              Digital Library Resources
            </h1>
            <p className="lead">Explore our collection of digital materials</p>
          </div>

          {/* Keep the rest of your existing search/filter markup */}
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="input-group input-group-lg">
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search resources by title, author, or keyword..."
                  aria-label="Search resources"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                <button className="btn btn-primary">
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </div>
          </div>

          <div className="row mt-4 g-3 justify-content-center">
            <div className="col-auto">
              <select
                className="form-select"
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
              >
                <option value="all">All Types</option>
                <option value="ebook">eBooks</option>
                <option value="audio">Audiobooks</option>
                <option value="journal">Journals</option>
              </select>
            </div>
            <div className="col-auto">
              <select
                className="form-select"
                name="sort"
                value={filters.sort}
                onChange={handleFilterChange}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title A-Z</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <main className="resource-container py-5">
        <div className="container">
          {loading && (
            <div className="text-center py-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          )}

          {error && (
            <Alert variant="danger" className="text-center">
              {error}
            </Alert>
          )}

          {!loading && !error && (
            <>
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
                {resources.map((resource) => (
                  <div className="col" key={resource.id}>
                    <div className="card h-100 shadow-sm">
                      <div className="ratio ratio-16x9">
                        <img
                          src={`${baseUrl}storage/${resource.cover_photo}`}
                          className="card-img-top object-fit-cover"
                          alt={resource.name}
                          onError={(e) => {
                            e.target.src = "/placeholder-book.jpg";
                          }}
                        />
                      </div>
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title clamp-2-lines">
                          {resource.name}
                        </h5>
                        <div className="mt-auto">
                          <Link
                            to={`/Customer/resource/${resource.id}`}
                            className="btn btn-outline-primary w-100"
                          >
                            Details <i className="bi bi-arrow-right ms-2"></i>
                          </Link>
                        </div>
                      </div>
                      {resource.type && (
                        <div className="card-footer text-muted small">
                          {resource.type.toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {!searchQuery && pageCount > 1 && (
                <nav className="mt-5">
                  <ul className="pagination justify-content-center">
                    <li
                      className={`page-item ${currentPage === 1 && "disabled"}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage((p) => p - 1)}
                      >
                        Previous
                      </button>
                    </li>
                    {[...Array(pageCount)].map((_, i) => (
                      <li
                        key={i}
                        className={`page-item ${
                          currentPage === i + 1 && "active"
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </button>
                      </li>
                    ))}
                    <li
                      className={`page-item ${
                        currentPage === pageCount && "disabled"
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage((p) => p + 1)}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          )}

          {!loading && !error && resources.length === 0 && (
            <div className="text-center py-5">
              <h4>No resources found</h4>
              <p>Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default ResourceDisplay;
