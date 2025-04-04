import React, { useEffect, useState } from "react";
import { Spinner, Alert, Modal, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { fetchResource, search } from "../../api/resourceApi";

function ResourceDisplay() {
  // API Data state
  const [resources, setResources] = useState([]);
  const [genres, setGenres] = useState([]);
  const [resourceTypes, setResourceTypes] = useState([]);

  // Filter and sort states
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedResourceType, setSelectedResourceType] = useState("all");
  const [sortOption, setSortOption] = useState("newest");

  // Advanced search state
  const [advancedCriteria, setAdvancedCriteria] = useState({
    isbn: "",
    author: "",
    date: "",
  });
  const [showAdvancedModal, setShowAdvancedModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const baseUrl = import.meta.env.VITE_API_URL;

  // Fetch data from API on mount
  const fetchData = async () => {
    setLoading(true);
    try {
      // Expecting response: { resources: [...], genres: [...], resourceTypes: [...] }
      const result = await fetchResource();
      setResources(result.resources || []);
      setGenres(result.genres || []);
      setResourceTypes(result.resourceTypes || []);
      setError("");
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Reset all filters to default
  const resetFilters = () => {
    setSelectedGenre("all");
    setSelectedResourceType("all");
    setSortOption("newest");
    setAdvancedCriteria({ isbn: "", author: "", date: "" });
    setAppliedSearch("");
    setSearchQuery("");
  };

  // Filter resources based on basic filters and advanced criteria
  const filteredResources = resources.filter((resource) => {
    // Filter by genre if a genre is selected
    if (selectedGenre !== "all") {
      const genreIds = resource.genre.map((g) => g.id);
      if (!genreIds.includes(Number(selectedGenre))) return false;
    }
    // Filter by resource type if selected (using resource_type.id)
    if (selectedResourceType !== "all") {
      if (resource.resource_type.id !== Number(selectedResourceType))
        return false;
    }
    // Filter by search query (using applied search)
    if (
      appliedSearch.trim() !== "" &&
      !resource.name.toLowerCase().includes(appliedSearch.toLowerCase())
    ) {
      return false;
    }
    // Advanced: filter by ISBN if provided
    if (
      advancedCriteria.isbn.trim() !== "" &&
      !resource.ISBN.toLowerCase().includes(advancedCriteria.isbn.toLowerCase())
    ) {
      return false;
    }
    // Advanced: filter by author name if provided (resource.author assumed to be present)
    if (
      advancedCriteria.author.trim() !== "" &&
      (!resource.author ||
        !resource.author.name
          .toLowerCase()
          .includes(advancedCriteria.author.toLowerCase()))
    ) {
      return false;
    }
    // Advanced: filter by publish date if provided (exact match)
    if (
      advancedCriteria.date.trim() !== "" &&
      resource.publish_date !== advancedCriteria.date
    ) {
      return false;
    }
    return true;
  });

  // Sort resources
  const sortedResources = [...filteredResources].sort((a, b) => {
    if (sortOption === "newest") {
      return new Date(b.publish_date) - new Date(a.publish_date);
    }
    if (sortOption === "oldest") {
      return new Date(a.publish_date) - new Date(b.publish_date);
    }
    if (sortOption === "title") {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  // Handlers for advanced search modal
  const handleAdvancedSearchChange = (e) => {
    const { name, value } = e.target;
    setAdvancedCriteria((prev) => ({ ...prev, [name]: value }));
  };

  // Updated advanced search submit that clears input boxes.
  const handleAdvancedSearchSubmit = (e) => {
    e.preventDefault();
    // After applying the advanced criteria, clear the fields.
    setAdvancedCriteria({ isbn: "", author: "", date: "" });
    setShowAdvancedModal(false);
  };

  // Handler for basic search button click: apply search and clear the input.
  const handleBasicSearch = () => {
    setAppliedSearch(searchQuery);
    setSearchQuery(""); // Clear the search input field after clicking "search"
  };

  return (
    <>
      {/* Banner Section with Background Image */}
      <section
        style={{
          backgroundImage: 'url("/Customer/Resource.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          height: "300px",
          color: "white",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
          }}
        >
          <div className="container h-100 d-flex flex-column justify-content-center align-items-center">
            <h1 className="mb-2">Digital Library Resources</h1>
            <p className="mb-4">Explore our collection of digital materials</p>
            {/* Search bar and selection boxes in the banner */}
            <div className="w-100" style={{ maxWidth: "600px" }}>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={handleBasicSearch}
                >
                  <i className="bi bi-search"></i>
                </button>
              </div>
              <div className="row mb-2">
                <div className="col">
                  <select
                    className="form-select"
                    value={selectedResourceType}
                    onChange={(e) => setSelectedResourceType(e.target.value)}
                  >
                    <option value="all">All Resource Types</option>
                    {resourceTypes.map((rt) => (
                      <option key={rt.id} value={rt.id}>
                        {rt.TypeName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col">
                  <select
                    className="form-select"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="title">Title A-Z</option>
                  </select>
                </div>
              </div>
              {/* Link to open advanced search modal */}
              <div className="text-end mb-2">
                <Button
                  variant="link"
                  onClick={() => setShowAdvancedModal(true)}
                >
                  Advanced Search
                </Button>
              </div>
              {/* Show All Resources Button */}
              <div className="text-center">
                <Button variant="secondary" onClick={resetFilters}>
                  Show All Resources
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Search Modal */}
      <Modal
        show={showAdvancedModal}
        onHide={() => setShowAdvancedModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Advanced Search</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAdvancedSearchSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>ISBN</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter ISBN"
                name="isbn"
                value={advancedCriteria.isbn}
                onChange={handleAdvancedSearchChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Author Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter author name"
                name="author"
                value={advancedCriteria.author}
                onChange={handleAdvancedSearchChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Publish Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={advancedCriteria.date}
                onChange={handleAdvancedSearchChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Search
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Main Content */}
      <div className="container my-4">
        <div className="row">
          {/* Left Sidebar: Genre Filter */}
          <div className="col-md-3 mb-4">
            <h5>Genres</h5>
            <button
              className={`btn ${
                selectedGenre === "all" ? "btn-primary" : "btn-outline-primary"
              } mb-2 w-100`}
              onClick={() => setSelectedGenre("all")}
            >
              Show All
            </button>
            {genres.map((genre) => (
              <button
                key={genre.id}
                className={`btn ${
                  selectedGenre === String(genre.id)
                    ? "btn-primary"
                    : "btn-outline-primary"
                } mb-2 w-100`}
                onClick={() => setSelectedGenre(String(genre.id))}
              >
                {genre.name}
              </button>
            ))}
          </div>

          {/* Resources Display */}
          <div className="col-md-9">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : error ? (
              <Alert variant="danger">{error}</Alert>
            ) : sortedResources.length > 0 ? (
              <div className="row">
                {sortedResources.map((resource) => (
                  <div
                    key={resource.id}
                    className="col-sm-6 col-md-4 col-lg-3 mb-4"
                  >
                    <div className="card h-100">
                      <img
                        src={`${baseUrl}storage/${resource.cover_photo}`}
                        className="card-img-top"
                        alt={resource.name}
                        onError={(e) => {
                          e.target.src = "/placeholder-book.jpg";
                        }}
                      />
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title">{resource.name}</h5>
                        <p className="card-text">{resource.Description}</p>
                        <Link
                          to={`/library/resource/${resource.id}`}
                          className="btn btn-outline-primary mt-auto"
                        >
                          Details <i className="bi bi-arrow-right ms-2"></i>
                        </Link>
                      </div>
                      <div className="card-footer text-muted small">
                        {resource.resource_type &&
                          resource.resource_type.TypeName.toUpperCase()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center">
                <h4>No resources found</h4>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ResourceDisplay;
