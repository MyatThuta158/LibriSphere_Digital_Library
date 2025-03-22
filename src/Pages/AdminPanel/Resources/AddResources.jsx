import React, { useEffect, useRef, useState } from "react";
import Resumable from "resumablejs";
import { getAuthors } from "../../../api/authorsApi";
import { getGenres } from "../../../api/genresAPI";
import { getType } from "../../../api/resourcetypeApi"; // Import your resource type API call
import { useForm } from "react-hook-form";
import { createResource } from "../../../api/resourceApi";

function AddResources() {
  const [author, setAuthor] = useState([]);
  const [img, setImg] = useState();
  const fileInput = useRef(null);
  const fileChunkRef = useRef(null);
  const [uploadedFilePath, setUploadedFilePath] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [chunkedFileName, setChunkedFileName] = useState("");

  // New state for resource types.
  const [resourceTypes, setResourceTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");

  // Other states for author search, genre selection, etc.
  const [searchAuthor, setSearchAuthor] = useState("");
  const [filterAuthor, setFilterAuthor] = useState([]);
  const [status, setStatus] = useState(false);
  const [selectValue, setSelectValue] = useState({});
  const [flag, setFlag] = useState(false);
  const [authorname, setAuthorname] = useState("");
  const [genre, setGenre] = useState([]);
  const [genreSelectvalue, setGenreSelectvalue] = useState([]);
  const [input, setInput] = useState("");
  const [genreFlag, setGenreflag] = useState(false);
  const [available, setAvailable] = useState(false);
  const [genreValue, setGenrevalue] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const token = localStorage.getItem("token");

  // Initialize Resumable for chunked file upload
  useEffect(() => {
    const r = new Resumable({
      target: "http://127.0.0.1:8000/upload-chunk",
      chunkSize: 1 * 1024 * 1024, // 1MB chunks
      simultaneousUploads: 3,
      query: { token },
      headers: { Authorization: `Bearer ${token}` },
      testChunks: false,
      throttleProgressCallbacks: 1,
    });

    fileChunkRef.current = r;
    const fileElem = document.getElementById("resumable-file-input");
    if (fileElem) {
      r.assignBrowse(fileElem);
    }
    r.on("fileAdded", (file) => {
      console.log("File added:", file);
      r.upload();
    });
    r.on("fileProgress", (file) => {
      setUploadProgress(Math.floor(file.progress() * 100));
    });
    r.on("fileSuccess", (file, message) => {
      try {
        const res = JSON.parse(message);
        setUploadedFilePath(res.filePath);
        console.log("Chunked upload complete. File path:", res.filePath);
      } catch (err) {
        console.error("Error parsing response:", err);
      }
    });
  }, [token]);

  // Fetch authors, genres, and resource types on mount
  useEffect(() => {
    const fetchAuthors = async () => {
      const authorData = await getAuthors();
      setAuthor(authorData.data);
    };

    const fetchGenres = async () => {
      const genreData = await getGenres();
      setGenre(genreData.data);
    };

    const fetchResourceTypes = async () => {
      const typeData = await getType();

      console.log(typeData);
      setResourceTypes(typeData.data);
    };

    fetchAuthors();
    fetchGenres();
    fetchResourceTypes();
  }, []);

  // Author search effect
  useEffect(() => {
    if (searchAuthor) {
      const filteredData = author.filter((data) =>
        data.name.toLowerCase().includes(searchAuthor.toLowerCase())
      );
      if (filteredData.length > 0) {
        setFilterAuthor(filteredData);
        setStatus(true);
        setFlag(false);
      } else {
        setFlag(true);
      }
    } else {
      setFilterAuthor([]);
      setStatus(false);
      setFlag(false);
    }
  }, [searchAuthor, author]);

  const handleSelectAuthor = (author) => {
    setSelectValue(author);
    setAuthorname(author.name);
    setStatus(false);
  };

  // Genre selection and filtering functions
  const handleSelectGenre = (selectValue) => {
    setGenreSelectvalue((value) => {
      if (!value.includes(selectValue)) {
        setInput("");
        setGenreflag(false);
        return [...value, selectValue];
      }
      return value;
    });
  };

  const filterGenre = (searchGenre) => {
    if (searchGenre) {
      try {
        const filteredData = genre.filter((data) =>
          data.name.toLowerCase().includes(searchGenre.toLowerCase())
        );
        if (filteredData.length > 0) {
          setGenrevalue(filteredData);
          setGenreflag(true);
          setAvailable(false);
        } else {
          setGenreflag(false);
          setGenrevalue([]);
          setAvailable(true);
        }
      } catch (e) {
        console.log(e);
        setGenreflag(false);
        setGenrevalue([]);
        setAvailable(false);
      }
    } else {
      setGenrevalue([]);
      setGenreflag(false);
      setAvailable(false);
    }
  };

  const elimateGenre = (genre) => () => {
    setGenreSelectvalue((value) => value.filter((g) => g !== genre));
  };

  // Handle form submission
  const onSubmit = async (data) => {
    if (!uploadedFilePath) {
      alert("Please wait until the file upload completes.");
      return;
    }
    const formData = new FormData();
    formData.append("code", data.code);
    formData.append("name", data.name);
    formData.append("date", data.date);
    formData.append("Description", data.desc);
    formData.append("author", selectValue.id);
    formData.append("genre", JSON.stringify(genreSelectvalue.map((g) => g.id)));
    formData.append("Photo", data.Photo[0]);
    formData.append("file", uploadedFilePath);
    formData.append("ISBN", data.ISBN ?? "");
    // Append the selected resource type
    formData.append("resourceType", selectedType);

    try {
      const result = await createResource(formData);
      console.log(result);
      if (result.status === 200) {
        console.log("Submitted successfully!");
        reset();
        setUploadProgress(0);
        setAuthorname("");
        setGenreSelectvalue([]);
        setSelectValue({});
        setImg("");
        setUploadedFilePath("");
        setSelectedType("");
      } else {
        console.log("Cannot submit");
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <div className="container-fluid">
        <h1 className="text-center">Add Resources</h1>
        <div className="row">
          <form className="col-md-12" onSubmit={handleSubmit(onSubmit)}>
            <div className="d-flex justify-content-center">
              <div className="form-group col-md-6">
                <label htmlFor="title">Code</label>
                <input
                  type="text"
                  {...register("code", { required: "Code is required" })}
                  className="form-control"
                  id="title"
                />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="title">Name</label>
                <input
                  type="text"
                  className="form-control"
                  {...register("name", { required: "Name is required" })}
                  id="title"
                />
              </div>
            </div>

            <div className="d-flex justify-content-center">
              <div className="form-group col-md-4">
                <label htmlFor="title">Publish Date</label>
                <input
                  type="date"
                  {...register("date", {
                    required: "Publish date is required",
                  })}
                  className="form-control"
                  id="title"
                />
              </div>
              {/* New Resource Type selection */}
              <div className="form-group col-md-4">
                <label htmlFor="resourceType">Resource Type</label>
                <select
                  id="resourceType"
                  className="form-control"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  required
                >
                  <option value="">Select Resource Type</option>
                  {resourceTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.TypeName}
                    </option>
                  ))}
                </select>
              </div>
              {/* Dedicated file input for chunked upload */}
              <div className="form-group col-md-4">
                <label htmlFor="resumable-file-input">
                  File (Chunked Upload)
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Select file..."
                    value={chunkedFileName}
                    readOnly
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() =>
                      document.getElementById("resumable-file-input").click()
                    }
                  >
                    Browse
                  </button>
                  <input
                    type="file"
                    id="resumable-file-input"
                    className="form-control"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.value;
                      if (file) setChunkedFileName(e.target.files[0].name);
                      console.log("file name", file);
                    }}
                  />
                </div>
                {uploadProgress > 0 && (
                  <div>Upload Progress: {uploadProgress}%</div>
                )}
              </div>
            </div>

            {/* The rest of your form (author, genre, cover photo, ISBN, description) */}
            <div className="d-flex justify-content-center">
              <div
                className="form-group col-md-6"
                style={{ position: "relative" }}
              >
                <label htmlFor="title">Author</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    className="form-control"
                    {...register("author", {
                      required: "Author name is required!",
                    })}
                    value={authorname}
                    onChange={(e) => {
                      setSearchAuthor(e.target.value);
                      setSelectValue(e.target.value);
                      setAuthorname(e.target.value);
                    }}
                  />
                  {selectValue && (
                    <span
                      style={{
                        position: "absolute",
                        top: "50%",
                        right: "10px",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        fontSize: "16px",
                      }}
                      onClick={() => {
                        setSearchAuthor("");
                        setSelectValue({});
                        setAuthorname("");
                        setFlag(false);
                      }}
                    >
                      &#x2715;
                    </span>
                  )}
                </div>
                {status && filterAuthor.length > 0 && (
                  <ul
                    className="dropdown-menu show"
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: "0",
                      width: "100%",
                      zIndex: 1000,
                    }}
                  >
                    {filterAuthor.map((author, index) => (
                      <li
                        key={index}
                        className="dropdown-item"
                        onClick={() => handleSelectAuthor(author)}
                        style={{ cursor: "pointer" }}
                      >
                        {author.name}
                      </li>
                    ))}
                  </ul>
                )}
                {flag && filterAuthor.length <= 0 && (
                  <ul
                    className="dropdown-menu show"
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: "0",
                      width: "100%",
                      zIndex: 1000,
                    }}
                  >
                    <li className="dropdown-item" style={{ cursor: "pointer" }}>
                      No author available
                    </li>
                  </ul>
                )}
              </div>

              <div
                className="form-group col-md-6"
                style={{ position: "relative" }}
              >
                <label htmlFor="title">Genre</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    className="form-control"
                    value={input}
                    onChange={(e) => {
                      filterGenre(e.target.value);
                      setInput(e.target.value);
                    }}
                  />
                </div>
                {genreFlag && genreValue.length > 0 && (
                  <ul
                    className="dropdown-menu show"
                    style={{
                      position: "absolute",
                      top: "70%",
                      left: "0",
                      width: "100%",
                      height: "130%",
                      overflowY: "auto",
                      zIndex: 1000,
                    }}
                  >
                    {genreValue.map((genre, index) => (
                      <li
                        key={index}
                        className="dropdown-item"
                        onClick={() => handleSelectGenre(genre)}
                        style={{ cursor: "pointer" }}
                      >
                        {genre.name}
                        <button
                          className="px-4 text-white rounded bg-primary border-0 float-end"
                          onClick={() => handleSelectGenre(genre)}
                        >
                          Add
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {available && genreValue.length <= 0 && (
                  <ul
                    className="dropdown-menu show"
                    style={{
                      position: "absolute",
                      top: "70%",
                      left: "0",
                      width: "100%",
                      zIndex: 1000,
                    }}
                  >
                    <li className="dropdown-item" style={{ cursor: "pointer" }}>
                      No genre available
                    </li>
                  </ul>
                )}
                {genreSelectvalue.length > 0 && (
                  <div className="d-flex" style={{ height: "100%" }}>
                    {genreSelectvalue.map((genre, index) => (
                      <div
                        key={index}
                        className="rounded px-2 m-1 text-white d-flex bg-primary border-0"
                      >
                        {genre.name}
                        <div
                          onClick={elimateGenre(genre)}
                          style={{ cursor: "pointer" }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-x-lg text-white"
                            viewBox="0 0 16 16"
                          >
                            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146-5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="d-flex justify-content-center">
              <div className="form-group col-md-6">
                <label htmlFor="title">Cover Photo</label>
                <input
                  type="file"
                  className="form-control"
                  ref={fileInput}
                  {...register("Photo", {
                    required: "Cover photo is required",
                  })}
                  onChange={(e) => {
                    setImg(URL.createObjectURL(e.target.files[0]));
                  }}
                />
                {img && (
                  <>
                    <span
                      className="d-block text-right col-md-3"
                      onClick={() => {
                        setImg(null);
                        fileInput.current.value = null;
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        className="bi bi-x text-danger"
                        viewBox="0 0 16 16"
                      >
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646-2.647a.5.5 0 0 1-.708-.708L7.293 8z" />
                      </svg>
                    </span>
                    <img
                      src={img}
                      style={{ height: "25vh" }}
                      className="w-25 mt-2 img-fluid"
                    />
                  </>
                )}
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="isbn">ISBN</label>
                <input
                  type="text"
                  {...register("ISBN")}
                  className="form-control"
                  id="isbn"
                />
              </div>
            </div>

            <div className="form-group col-md-12">
              <label className="d-block" htmlFor="desc">
                Description
              </label>
              <textarea
                {...register("desc", { required: "Description is required!" })}
                className="w-100"
                style={{ height: "30vh" }}
                id="desc"
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddResources;
