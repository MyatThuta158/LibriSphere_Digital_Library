import React, { useEffect, useState } from "react";
import { fetchResource } from "../../../api/resourceApi";
import Pagination from "../../Layouts/Pagination";
import ResourceContainer from "../../Layouts/ResourceContainer";

function ViewResources() {
  const [resources, setResources] = useState([]); // All fetched resources
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const itemsPerPage = 8; // Number of resources per page

  useEffect(() => {
    const getResource = async () => {
      try {
        // Fetch full list of resources from the backend
        const response = await fetchResource();
        // Assume response.data has the structure: { resources: [...], genres: [...], resourceTypes: [...] }
        setResources(response.resources);
      } catch (error) {
        console.error("Error fetching resources:", error);
      }
    };

    getResource();
  }, []);

  // Calculate the total number of pages based on the number of resources
  const pageCount = Math.ceil(resources.length / itemsPerPage);

  // Determine the subset of resources to display on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentResources = resources.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change event
  const handlePageChange = (page) => {
    if (page >= 1 && page <= pageCount) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="container">
      <h1 className="text-center mb-5">All Digital Resources</h1>
      <div className="row col-md-12">
        {currentResources.map((resource) => (
          <ResourceContainer
            key={resource.id}
            id={resource.id}
            img={resource.cover_photo}
            name={resource.name}
          />
        ))}
      </div>
      <div className="container d-flex w-100 justify-content-center mx-auto">
        <Pagination
          count={pageCount}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default ViewResources;
