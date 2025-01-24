// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
// import "@cyntler/react-doc-viewer/dist/index.css";

// import { detailResource, getFile } from "../../../api/resourceApi";

// function ResourceDetail() {
//   const { id } = useParams(); // Get the resource ID from the URL
//   const [docs, setDocs] = useState([]);
//   const [resource, setResource] = useState({}); ///-----This is to store resource---//

//   useEffect(() => {
//     const fetchResource = async () => {
//       const dataFetch = await detailResource(id);

//       setResource(dataFetch.message);
//     };

//     fetchResource();
//   }, [id]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch the filename or file path based on the ID
//         const fileName = resource.file; // Replace with logic to dynamically fetch the filename based on ID

//         // Fetch the file blob from the backend
//         const file = await getFile(fileName);

//         // Create a URL for the file blob
//         const fileUrl = URL.createObjectURL(new Blob([file]));

//         // Update the documents array with the file URL
//         setDocs([
//           {
//             uri: fileUrl, // Add the file URL here
//             fileType: "pdf", // Specify the file type if known
//           },
//         ]);
//       } catch (error) {
//         console.error("Error fetching the file:", error);
//       }
//     };

//     fetchData();
//   }, [resource]);
//   console.log(resource.file);
//   return (
//     <div>
//       {docs.length > 0 ? (
//         <DocViewer
//           documents={docs}
//           initialActiveDocument={docs[0]}
//           pluginRenderers={DocViewerRenderers}
//         />
//       ) : (
//         <p>Loading document...</p>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css"; // Import annotation styles
import { getFile } from "../../../api/resourceApi";

// Set up the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

function ResourceDetail() {
  const { id } = useParams();
  const [fileUrl, setFileUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Current page state

  // Fetch the PDF file
  useEffect(() => {
    const fetchFile = async () => {
      // const fileURL = `http://127.0.0.1:8000/file/8P5CDPHqCBzpkFc0M3G2nBs9zOlkVDF3nPGEuX4W.pdf`;
      // setFileUrl(fileURL);

      const fileURL = await getFile("file/different_mode_of_interaction.mp4");
      setFileUrl(fileURL);
    };

    fetchFile();
  }, [id]);

  // Callback when the document loads successfully
  const onLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setCurrentPage(1); // Reset to page 1 when a new document is loaded
  };

  // Handlers for navigating pages
  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, numPages));
  };

  return (
    <div>
      {fileUrl ? (
        <div>
          {/* PDF Document */}
          <Document file={fileUrl} onLoadSuccess={onLoadSuccess}>
            <Page pageNumber={currentPage} />
          </Document>

          {/* Pagination Controls */}
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <button onClick={goToPreviousPage} disabled={currentPage === 1}>
              Previous
            </button>
            <span style={{ margin: "0 10px" }}>
              Page {currentPage} of {numPages}
            </span>
            <button onClick={goToNextPage} disabled={currentPage === numPages}>
              Next
            </button>
          </div>
          {/* <video
          src="http://127.0.0.1:8000/file/different_mode_of_interaction.mp4"
          controls
          style={{
            width: "100%",
            maxWidth: "800px",
            margin: "0 auto",
            display: "block",
          }}
        >
          Your browser does not support the video tag.
        </video> */}
        </div>
      ) : (
        <p>Loading document...</p>
      )}
    </div>
  );
}

export default ResourceDetail;

///////////////////////////

// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import ePub from "epubjs"; // Import the epub.js library

// function ResourceDetail() {
//   const { id } = useParams(); // Get the resource ID from the URL
//   const [book, setBook] = useState(null); // State to hold the book object

//   useEffect(() => {
//     const fetchFile = async () => {
//       try {
//         // Assuming you're fetching the EPUB file URL based on the resource ID
//         const response = await fetch(
//           `http://127.0.0.1:8000/file/zPYCKdNwUjwWhRxlVLeCcIMUEdWDl0i1MZA5x8V0.epub`
//         );
//         const blob = await response.blob();
//         const url = URL.createObjectURL(blob); // Create a URL for the blob

//         // Load the EPUB file using epub.js
//         const epubBook = ePub(url);

//         // Set the book in the state
//         setBook(epubBook);
//       } catch (error) {
//         console.error("Error fetching the EPUB file:", error);
//       }
//     };

//     fetchFile();
//   }, [id]);

//   useEffect(() => {
//     if (book) {
//       // Render the EPUB file when the book is loaded
//       const rendition = book.renderTo("viewer", {
//         width: "100%",
//         height: "600px", // Set the height as per your requirement
//       });

//       book.ready.then(() => {
//         rendition.display(); // Display the first chapter
//       });
//     }
//   }, [book]);

//   return (
//     <div>
//       <div id="viewer" style={{ width: "100%", height: "600px" }}></div>
//       {!book && <p>Loading EPUB file...</p>}
//     </div>
//   );
// }

// export default ResourceDetail;
