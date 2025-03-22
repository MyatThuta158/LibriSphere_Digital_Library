import React, { useEffect, useRef, useState } from "react";
import Resumable from "resumablejs";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { detail, resourceUpdate } from "../../../api/resourceApi";
import { getAuthors } from "../../../api/authorsApi";
import { getGenres } from "../../../api/genresAPI";
import { getType } from "../../../api/resourcetypeApi";

function UpdateResources() {
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // States for form fields
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [resourceTypes, setResourceTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState({});
  const [searchAuthor, setSearchAuthor] = useState("");
  const [filterAuthors, setFilterAuthors] = useState([]);
  const [authorDropdown, setAuthorDropdown] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [genreInput, setGenreInput] = useState("");
  const [genreOptions, setGenreOptions] = useState([]);
  const [genreDropdown, setGenreDropdown] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState(null);

  // States for resumable file upload
  const [uploadedFilePath, setUploadedFilePath] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileChunkRef = useRef(null);

  // Refs for file inputs
  const photoInputRef = useRef(null);
  const resourceFileRef = useRef(null);

  // Fetch resource details and pre-populate form fields
  useEffect(() => {
    async function fetchResource() {
      try {
        const res = await detail(id);
        console.log("Resource detail:", res.data);
        reset({
          code: res.data.code,
          name: res.data.name,
          date: res.data.publish_date,
          ISBN: res.data.ISBN,
          desc: res.data.Description,
        });
        if (res.data.cover_photo) {
          setPreviewPhoto(
            `http://127.0.0.1:8000/storage/${res.data.cover_photo}`
          );
        }
        if (res.data.author) {
          setSelectedAuthor(res.data.author);
          setSearchAuthor(res.data.author.name);
        }
        if (res.data.genre) {
          setSelectedGenres(res.data.genre);
        }
        if (res.data.resource_typeId) {
          setSelectedType(res.data.resource_typeId);
        }
      } catch (error) {
        console.error("Error fetching resource details", error);
      }
    }
    fetchResource();
  }, [id, reset]);

  // Fetch authors, genres, and resource types
  useEffect(() => {
    async function fetchData() {
      try {
        const authorRes = await getAuthors();
        setAuthors(authorRes.data);
        const genreRes = await getGenres();
        setGenres(genreRes.data);
        const typeRes = await getType();
        setResourceTypes(typeRes.data);
      } catch (error) {
        console.error(
          "Error fetching authors, genres or resource types",
          error
        );
      }
    }
    fetchData();
  }, []);

  // Filter authors based on search input
  useEffect(() => {
    if (searchAuthor) {
      const filtered = authors.filter((a) =>
        a.name.toLowerCase().includes(searchAuthor.toLowerCase())
      );
      setFilterAuthors(filtered);
      setAuthorDropdown(true);
    } else {
      setFilterAuthors([]);
      setAuthorDropdown(false);
    }
  }, [searchAuthor, authors]);

  const handleSelectAuthor = (author) => {
    setSelectedAuthor(author);
    setSearchAuthor(author.name);
    setAuthorDropdown(false);
  };

  // Filter genres based on genre input
  useEffect(() => {
    if (genreInput) {
      const filtered = genres.filter((g) =>
        g.name.toLowerCase().includes(genreInput.toLowerCase())
      );
      setGenreOptions(filtered);
      setGenreDropdown(true);
    } else {
      setGenreOptions([]);
      setGenreDropdown(false);
    }
  }, [genreInput, genres]);

  const handleSelectGenre = (genre) => {
    if (!selectedGenres.some((g) => g.id === genre.id)) {
      setSelectedGenres((prev) => [...prev, genre]);
    }
    setGenreInput("");
    setGenreDropdown(false);
  };

  const removeGenre = (genreId) => {
    setSelectedGenres((prev) => prev.filter((g) => g.id !== genreId));
  };

  // Initialize Resumable for chunked file upload of resource file
  useEffect(() => {
    const token = localStorage.getItem("token");
    const r = new Resumable({
      target: "http://127.0.0.1:8000/upload-chunk",
      chunkSize: 1 * 1024 * 1024, // 1MB chunks
      simultaneousUploads: 3,
      query: { token, id }, // Include the resource id here
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
  }, []);

  // Handle form submission
  const onSubmit = async (data) => {
    // Note: If a new resource file is being uploaded, uploadedFilePath should be set via Resumable.
    const formData = new FormData();
    formData.append("code", data.code);
    formData.append("name", data.name);
    formData.append("date", data.date);
    formData.append("desc", data.desc);
    formData.append("ISBN", data.ISBN || "");
    if (selectedAuthor.id) {
      formData.append("author", selectedAuthor.id);
    }
    formData.append("genre", JSON.stringify(selectedGenres.map((g) => g.id)));
    formData.append("resourceType", selectedType);
    // Append cover photo if provided
    if (data.Photo && data.Photo.length > 0) {
      formData.append("Photo", data.Photo[0]);
    }
    // Append resource file if a new file was uploaded via Resumable
    if (uploadedFilePath) {
      formData.append("file", uploadedFilePath);
    }

    try {
      const result = await resourceUpdate(id, formData);
      if (result.status === 200) {
        console.log("Resource updated successfully");
        // Optionally, add redirection or a success notification here.
      } else {
        console.error("Update failed", result);
      }
    } catch (error) {
      console.error("Error updating resource", error);
    }
  };

  return (
    <div className="container-fluid">
      <h1 className="text-center">Update Resource</h1>
      <div className="row">
        <form className="col-md-12" onSubmit={handleSubmit(onSubmit)}>
          {/* Row for code and name */}
          <div className="d-flex justify-content-center">
            <div className="form-group col-md-6">
              <label htmlFor="code">Code</label>
              <input
                type="text"
                {...register("code", { required: "Code is required" })}
                className="form-control"
                id="code"
              />
              {errors.code && <span>{errors.code.message}</span>}
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                {...register("name", { required: "Name is required" })}
                className="form-control"
                id="name"
              />
              {errors.name && <span>{errors.name.message}</span>}
            </div>
          </div>

          {/* Row for publish date, resource type, and file upload */}
          <div className="d-flex justify-content-center">
            <div className="form-group col-md-4">
              <label htmlFor="date">Publish Date</label>
              <input
                type="date"
                {...register("date", { required: "Publish date is required" })}
                className="form-control"
                id="date"
              />
              {errors.date && <span>{errors.date.message}</span>}
            </div>
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
            <div className="form-group col-md-4">
              <label htmlFor="resumable-file-input">Resource File</label>
              <input
                type="file"
                className="form-control"
                id="resumable-file-input"
                ref={resourceFileRef}
              />
              {uploadProgress > 0 && (
                <div>Upload Progress: {uploadProgress}%</div>
              )}
            </div>
          </div>

          {/* Row for author and genre selection */}
          <div className="d-flex justify-content-center">
            {/* Author selection */}
            <div
              className="form-group col-md-6"
              style={{ position: "relative" }}
            >
              <label htmlFor="author">Author</label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  className="form-control"
                  id="author"
                  value={searchAuthor}
                  onChange={(e) => {
                    setSearchAuthor(e.target.value);
                    setSelectedAuthor({});
                  }}
                  placeholder="Search author"
                />
                {selectedAuthor && selectedAuthor.id && (
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
                      setSelectedAuthor({});
                    }}
                  >
                    &#x2715;
                  </span>
                )}
              </div>
              {authorDropdown && filterAuthors.length > 0 && (
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
                  {filterAuthors.map((author, index) => (
                    <li
                      key={index}
                      className="dropdown-item"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleSelectAuthor(author)}
                    >
                      {author.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Genre selection */}
            <div
              className="form-group col-md-6"
              style={{ position: "relative" }}
            >
              <label htmlFor="genre">Genre</label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  className="form-control"
                  id="genre"
                  value={genreInput}
                  onChange={(e) => setGenreInput(e.target.value)}
                  placeholder="Search genre"
                />
              </div>
              {genreDropdown && genreOptions.length > 0 && (
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
                  {genreOptions.map((genre, index) => (
                    <li
                      key={index}
                      className="dropdown-item"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleSelectGenre(genre)}
                    >
                      {genre.name}
                    </li>
                  ))}
                </ul>
              )}
              {selectedGenres.length > 0 && (
                <div className="d-flex flex-wrap mt-2">
                  {selectedGenres.map((genre, index) => (
                    <div
                      key={index}
                      className="badge bg-primary text-white me-1 mb-1"
                      style={{ cursor: "pointer" }}
                      onClick={() => removeGenre(genre.id)}
                    >
                      {genre.name} &times;
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Row for cover photo and ISBN */}
          <div className="d-flex justify-content-center">
            <div className="form-group col-md-6">
              <label htmlFor="Photo">Cover Photo</label>
              <input
                type="file"
                {...register("Photo")}
                className="form-control"
                id="Photo"
                ref={photoInputRef}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setPreviewPhoto(URL.createObjectURL(e.target.files[0]));
                  }
                }}
              />
              {previewPhoto && (
                <div className="mt-2">
                  <img
                    src={previewPhoto}
                    alt="Cover Preview"
                    className="img-fluid"
                    style={{ maxHeight: "25vh" }}
                  />
                  <span
                    className="text-danger"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setPreviewPhoto(null);
                      if (photoInputRef.current) {
                        photoInputRef.current.value = null;
                      }
                    }}
                  >
                    Remove
                  </span>
                </div>
              )}
            </div>

            <div className="form-group col-md-6">
              <label htmlFor="ISBN">ISBN</label>
              <input
                type="text"
                {...register("ISBN")}
                className="form-control"
                id="ISBN"
              />
            </div>
          </div>

          {/* Description */}
          <div className="form-group col-md-12">
            <label htmlFor="desc" className="d-block">
              Description
            </label>
            <textarea
              {...register("desc", { required: "Description is required" })}
              className="w-100"
              style={{ height: "30vh" }}
              id="desc"
            ></textarea>
            {errors.desc && <span>{errors.desc.message}</span>}
          </div>

          <button type="submit" className="btn btn-primary mt-3">
            Update Resource
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateResources;
