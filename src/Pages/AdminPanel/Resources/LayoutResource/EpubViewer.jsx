// EpubViewer.jsx
import React, { useState, useEffect, useRef } from "react";
import { ReactReader } from "react-reader";
import { detail, fetchFile } from "../../../../api/resourceApi";

const EpubViewer = ({ fileId }) => {
  const [epubData, setEpubData] = useState(null);
  const [location, setLocation] = useState(null);
  const [zoom, setZoom] = useState(1);
  const viewerRef = useRef(null);

  useEffect(() => {
    const fetchEpub = async () => {
      try {
        // const fileDetail = await detail(fileId);

        // console.log(fileDetail);
        const data = await fetchFile(fileId);
        // const blob = new Blob([data], { type: "application/epub+zip" });
        // const url = URL.createObjectURL(blob);
        setEpubData(data);
      } catch (error) {
        console.error("Error fetching the EPUB:", error);
      }
    };

    fetchEpub();

    return () => {
      if (epubData) URL.revokeObjectURL(epubData);
    };
  }, [fileId]);

  const handleLocationChange = (loc) => {
    setLocation(loc);
  };

  const zoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 2));
  const zoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.5));

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        background: "#f5f5f5",
        padding: "10px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "800px",
          height: "100%",
          background: "#fff",
          boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Toolbar */}
        <div
          style={{
            padding: "10px 15px",
            borderBottom: "1px solid #ddd",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#fafafa",
          }}
        >
          <div>
            <button
              onClick={() => viewerRef.current?.prevPage()}
              style={{ marginRight: "10px" }}
            >
              Previous
            </button>
            <button onClick={() => viewerRef.current?.nextPage()}>Next</button>
          </div>
          <div>
            <button onClick={zoomOut} style={{ marginRight: "10px" }}>
              -
            </button>
            <span>{Math.round(zoom * 100)}%</span>
            <button onClick={zoomIn} style={{ marginLeft: "10px" }}>
              +
            </button>
          </div>
        </div>

        {/* EPUB Container */}
        <div
          style={{
            flex: 1,
            overflow: "hidden",
            position: "relative",
            transform: `scale(${zoom})`,
            transformOrigin: "0 0",
            width: `${100 / zoom}%`,
            height: `${100 / zoom}%`,
          }}
        >
          {epubData ? (
            <ReactReader
              ref={viewerRef}
              url={epubData}
              location={location}
              locationChanged={handleLocationChange}
              showToc={false}
              styles={{
                container: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                },
              }}
            />
          ) : (
            <div
              style={{
                padding: "20px",
                textAlign: "center",
                position: "absolute",
                width: "100%",
                height: "100%",
              }}
            >
              Loading EPUB...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EpubViewer;
