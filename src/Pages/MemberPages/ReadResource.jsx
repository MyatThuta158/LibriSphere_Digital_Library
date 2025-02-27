import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import Menu from "../Layouts/Menu";

// Configure worker source for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

function ReadResource() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const [fileUrl, setFileUrl] = useState(null);

  useEffect(() => {
    // PDF file in the "public" folder
    setFileUrl(`/1.pdf`);
  }, []);

  return (
    <div>
      <Menu />
      <div className=" w-50 mx-auto" style={{ marginTop: "10%" }}>
        <h5>Preview PDF</h5>
        <div
          className="border p-2"
          style={{ maxWidth: "600px", height: "500px", overflow: "auto" }}
        >
          <Document
            file={fileUrl}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          >
            <Page pageNumber={pageNumber} width={500} />
          </Document>
        </div>
        <div className="mt-2">
          <button
            className="btn btn-secondary me-2"
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber(pageNumber - 1)}
          >
            Previous Page
          </button>
          <button
            className="btn btn-secondary"
            disabled={pageNumber >= numPages}
            onClick={() => setPageNumber(pageNumber + 1)}
          >
            Next Page
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReadResource;
