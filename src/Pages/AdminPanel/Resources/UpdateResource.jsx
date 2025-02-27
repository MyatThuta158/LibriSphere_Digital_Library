import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { detail, resourceUpdate } from "../../../api/resourceApi";
import { getAuthors } from "../../../api/authorsApi";
import { getGenres } from "../../../api/genresAPI";

function UpdateResources() {
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState({});
  const [searchAuthor, setSearchAuthor] = useState("");
  const [filterAuthors, setFilterAuthors] = useState([]);
  const [authorDropdown, setAuthorDropdown] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [genreInput, setGenreInput] = useState("");
  const [genreOptions, setGenreOptions] = useState([]);
  const [genreDropdown, setGenreDropdown] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState(null);

  const photoInputRef = useRef(null);
  const resourceFileRef = useRef(null);

  // Load resource details & pre-populate form
  useEffect(() => {
    async function fetchResource() {
      try {
        const res = await detail(id);
        console.log(res.message);
        // Prepopulate basic fields
        reset({
          code: res.message.code,
          name: res.message.name,
          date: res.message.publish_date, // Adjust field name if needed
          ISBN: res.message.ISBN,
          desc: res.message.Description,
        });
        // Set existing cover photo (adjust URL as necessary)
        if (res.message.cover_photo) {
          setPreviewPhoto(
            `http://127.0.0.1:8000/storage/${res.message.cover_photo}`
          );
        }
        // Set selected author if available
        if (res.message.author) {
          console.log(res.message.author);
          setSelectedAuthor(res.message.author);
          setSearchAuthor(res.message.author.name);
        }
        // Assume res.genre is an array of genre objects
        if (res.message.genre) {
          setSelectedGenres(res.message.genre);
        }
      } catch (error) {
        console.error("Error fetching resource details", error);
      }
    }
    fetchResource();
  }, [id, reset]);

  // Load authors and genres for selection dropdowns
  useEffect(() => {
    async function fetchData() {
      try {
        const authorRes = await getAuthors();
        setAuthors(authorRes.data);
        const genreRes = await getGenres();
        setGenres(genreRes.data);
      } catch (error) {
        console.error("Error fetching authors or genres", error);
      }
    }
    fetchData();
  }, []);

  // Filter authors as user types
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

  // Filter genres based on genreInput
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

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("code", data.code);
    formData.append("name", data.name);
    formData.append("date", data.date);
    formData.append("desc", data.desc);
    formData.append("ISBN", data.ISBN || "");
    // Append selected author id
    if (selectedAuthor.id) {
      formData.append("author", selectedAuthor.id);
    }
    // Append selected genres as a JSON-encoded array of ids
    formData.append("genre", JSON.stringify(selectedGenres.map((g) => g.id)));
    // Append new cover photo if provided
    if (data.Photo && data.Photo.length > 0) {
      formData.append("Photo", data.Photo[0]);
    }
    // Append new resource file if provided
    if (data.file && data.file.length > 0) {
      formData.append("file", data.file[0]);
    }

    try {
      const result = await resourceUpdate(id, formData);
      if (result.status === 200) {
        console.log("Resource updated successfully");
        // You can add redirection or success notification here
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

          <div className="d-flex justify-content-center">
            <div className="form-group col-md-6">
              <label htmlFor="date">Publish Date</label>
              <input
                type="date"
                {...register("date", { required: "Publish date is required" })}
                className="form-control"
                id="date"
              />
              {errors.date && <span>{errors.date.message}</span>}
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="file">Resource File</label>
              <input
                type="file"
                {...register("file")}
                className="form-control"
                id="file"
                ref={resourceFileRef}
              />
            </div>
          </div>

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

          <div className="d-flex justify-content-center">
            {/* Cover Photo */}
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
