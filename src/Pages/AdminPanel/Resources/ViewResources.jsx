import React, { useEffect, useState } from "react";
import { fetchResource } from "../../../api/resourceApi";
import Pagination from "../../Layouts/Pagination";
import ResourceContainer from "../../Layouts/ResourceContainer";

function ViewResources() {
  const [resources, setResources] = useState([]); // Store resources
  const [pageCount, setPageCount] = useState(0); // Total pages
  const [currentPage, setCurrentPage] = useState(1); // Current page

  useEffect(() => {
    const getResource = async () => {
      try {
        const resource = await fetchResource(currentPage); // Fetch based on page
        setResources(resource.data.data); // Set resources
        setPageCount(resource.data.last_page); // Set total pages
      } catch (error) {
        console.error("Error fetching resources:", error);
      }
    };

    getResource();
  }, [currentPage]); // Fetch data whenever `currentPage` changes

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pageCount) {
      setCurrentPage(page); // Update current page
    }
  };

  // console.log(resources.code);
  //console.log(resources.id);

  return (
    <div className="container">
      <h1 className="text-center mb-5">All Digital Resources</h1>
      <div className="row col-md-12">
        {resources.map((resource) => {
          // console.log(resource.id);
          return (
            <ResourceContainer
              key={resource.id}
              id={resource.id}
              img={resource.cover_photo}
              name={resource.name}
            />
          );
        })}
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
