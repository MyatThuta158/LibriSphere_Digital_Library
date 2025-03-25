import React, { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { detail, fetchPdfFile } from "../../../api/resourceApi";
import "react-pdf/dist/esm/Page/TextLayer.css";
import EpubViewer from "./LayoutResource/EpubViewer"; // Adjust the path as necessary
import PdfViewer from "./LayoutResource/PdfViewer";

// Set the workerSrc for pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ReadResource = () => {
  const containerRef = useRef();
  const [fileType, setFiletype] = useState("");
  const [resourceId, setResourceid] = useState();

  const getFileType = (filePath) => {
    // Ensure filePath is defined and a string
    if (filePath && typeof filePath === "string") {
      // Split the filePath on periods and get the last segment
      return filePath.split(".").pop().toLowerCase();
    }
    return "";
  };

  useEffect(() => {
    // Fetch the PDF when the component mounts using the api function
    const fetchPdf = async () => {
      try {
        const file = await detail(4);

        const type = getFileType(file.data.file);

        setFiletype(type);
        setResourceid(file.data.id);

        //   const data = await fetchPdfFile(4);
      } catch (error) {
        console.error("Error fetching the PDF:", error);
      }
    };

    fetchPdf();
  }, []);

  //console.log(fileType);

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
      {(() => {
        //console.log(fileType);
        switch (fileType) {
          case "pdf":
            // Pass a unique identifier or fileId so that PdfViewer can fetch the correct file.
            return <PdfViewer fileId={resourceId} />;
          // Uncomment and implement this case if needed in the future
          // case "epub":
          //   return <EpubViewer file={resource.file} />;
          // Uncomment and implement these cases if needed in the future
          // case "mp3":
          // case "wav":
          //   return <AudioPlayer file={resource.file} />;
          // case "mp4":
          // case "webm":
          //   return <VideoPlayer file={resource.file} />;
          default:
            return <p>Unsupported file type: {fileType}</p>;
        }
      })()}
    </div>
  );
};

export default ReadResource;
