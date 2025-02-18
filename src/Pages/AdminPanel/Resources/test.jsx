import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

// Set the workerSrc for pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfViewer = () => {
  const [pdfData, setPdfData] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageWidth, setPageWidth] = useState(null);
  const containerRef = useRef();

  useEffect(() => {
    // Fetch the PDF when the component mounts
    const fetchPdf = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/downloadFile", {
          responseType: "blob", // Ensure the response is a Blob
        });
        setPdfData(response.data);
      } catch (error) {
        console.error("Error fetching the PDF:", error);
      }
    };

    fetchPdf();
  }, []);

  useEffect(() => {
    // Set the page width based on the container's width
    if (containerRef.current) {
      setPageWidth(containerRef.current.clientWidth);
    }
  }, [containerRef.current]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const changePage = (offset) => {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  };

  const previousPage = () => {
    changePage(-1);
  };

  const nextPage = () => {
    changePage(1);
  };

  return (
    <div
      ref={containerRef}
      style={{
        height: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {pdfData ? (
        <>
          <div style={{ flex: 1, overflow: "auto", width: "100%" }}>
            <Document
              file={pdfData}
              onLoadSuccess={onDocumentLoadSuccess}
              loading="Loading PDF..."
            >
              <Page pageNumber={pageNumber} width={pageWidth} loading="" />
            </Document>
          </div>

          <div style={{ marginTop: "10px" }}>
            <p>
              Page {pageNumber} of {numPages}
            </p>
            <button
              type="button"
              disabled={pageNumber <= 1}
              onClick={previousPage}
            >
              Previous
            </button>
            <button
              type="button"
              disabled={pageNumber >= numPages}
              onClick={nextPage}
              style={{ marginLeft: "10px" }}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p>Loading PDF...</p>
      )}
    </div>
  );
};

export default PdfViewer;
