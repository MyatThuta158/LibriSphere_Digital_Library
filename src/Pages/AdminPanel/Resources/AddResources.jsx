import React, { useEffect, useRef, useState } from "react";
import { getAuthors } from "../../../api/authorsApi";
import { getGenres } from "../../../api/genresAPI";
import { useForm } from "react-hook-form";
import { createResource } from "../../../api/resourceApi";

function AddResources() {
  const [author, setAuthor] = useState([]); //----This set the author value---//
  const [img, setImg] = useState(); //----This set the image value---//
  const fileInput = useRef(null); //----This is used to get the file input value---//
  const [searchAuthor, setSearchAuthor] = useState(""); //----This is used to search the author---//
  const [filterAuthor, setFilterAuthor] = useState([]); //----This is used to filter the author---//
  const [status, setStatus] = useState(false); //---This is the value for drop down status---//
  const [selectValue, setSelectValue] = useState({});
  const [flag, setFlag] = useState(false);
  const [authorname, setAuthorname] = useState("");

  ///-------This is for genre---//
  const [genre, setGenre] = useState([]); //---This is for genre value---//
  const [genreSelectvalue, setGenreSelectvalue] = useState([]); //-----This is for search value---//
  const [input, setInput] = useState(); //----This is for selected genre value---//
  const [genreFlag, setGenreflag] = useState(false); //----This is for flag value==//
  const [available, setAvailable] = useState(false);
  const [genreValue, setGenrevalue] = useState([]);

  //--------This is for form submit process----//
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    //----This is for author data fetch---//
    const authorData = async () => {
      const authorData = await getAuthors();
      const data = authorData.data;
      setAuthor(data);
    };

    //-----This is for genre data fetch----//
    const genreData = async () => {
      const genre = await getGenres();
      const data = genre.data;
      setGenre(data);
    };

    authorData();
    genreData();
    console.log(genre);
  }, []);

  //-------This is to search author---//
  useEffect(() => {
    const searchData = async () => {
      if (searchAuthor) {
        const filteredData = author.filter((data) =>
          data.name.toLowerCase().includes(searchAuthor.toLowerCase())
        );

        //console.log(filterAuthor);

        if (filteredData.length > 0) {
          setFilterAuthor(filteredData); //---This set filter data---//
          setStatus(true);
          setFlag(false);
        } else {
          setFlag(true);
        }
      } else {
        setFilterAuthor([]);
        setStatus(false); //---this set false to status for dropdown--//
        setFlag(false);
      }
    };

    searchData();
  }, [searchAuthor]);

  //-----This is for author select process---//
  const handleSelectAuthor = (author) => {
    console.log(author);
    setSelectValue(author);
    setAuthorname(author.name);
    console.log(selectValue);
    setStatus(false);
  };

  ////----------This is for handle selected genre----////
  const handleSelectGenre = (selectValue) => {
    setGenreSelectvalue((value) => {
      if (!value.includes(selectValue)) {
        setInput("");
        setGenreflag(false);
        return [...value, selectValue];
      }

      return value;
    });

    //console.log(genreSelectvalue);
  };

  //------This is for filter genre----//
  const filterGenre = (searchGenre) => {
    if (searchGenre) {
      try {
        const filteredData = genre.filter((data) =>
          data.name.toLowerCase().includes(searchGenre.toLowerCase())
        );

        if (filteredData.length > 0) {
          setGenrevalue(filteredData);
          //console.log(genreValue);
          setGenreflag(true);
          setAvailable(false);
        } else {
          setGenreflag(false);
          setGenrevalue([]);
          setAvailable(true);
          //console.log("no data found");
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

  ///--------This is for handling submit process---//
  const onSubmit = async (data) => {
    const formData = new FormData();

    //console.log(data.Photo);

    // Append simple form data fields
    formData.append("code", data.code);
    formData.append("name", data.name);
    formData.append("date", data.date);
    formData.append("Description", data.desc);

    // Append the author ID
    formData.append("author", selectValue.id);

    // Append selected genres
    //genreSelectvalue.forEach((genre) => formData.append("genres", genre.id));
    formData.append("genre", JSON.stringify(genreSelectvalue.map((g) => g.id)));

    // Append files
    formData.append("Photo", data.Photo[0]);
    formData.append("file", data.file[0]);

    // Log the formData content for debugging
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    console.log(formData);

    try {
      const result = await createResource(formData);

      if (result.status == 200) {
        console.log("Submitted successfully!");

        reset(); // Reset the form fields to initial state
        setAuthorname("");
        setGenreSelectvalue([]);
        setSelectValue({});
        setImg("");
      } else {
        console.log("cannot submitted");
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
              <div className="form-group col-md-6">
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

              <div className="form-group col-md-6">
                <label htmlFor="title">File</label>
                <input
                  type="file"
                  {...register("file", {
                    required: "Resource file is required!",
                  })}
                  className="form-control"
                  id="title"
                />
              </div>
            </div>

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
                    id="title"
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

                  {/* Cross icon */}
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

                {flag == true && filterAuthor.length <= 0 && (
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
                    id="title"
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
                      overflow: "hidden",
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

                {available == true && genreValue.length <= 0 && (
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
                    {genreSelectvalue.map((genre, index) => {
                      //console.log(genre);
                      return (
                        <div
                          key={index}
                          className="rounded px-2  m-1 text-white d-flex bg-primary border-0 h-25"
                        >
                          {genre.name}

                          <div
                            onClick={elimateGenre(genre)}
                            className="float-end"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-x-lg text-white float-end h-100 my-auto"
                              viewBox="0 0 16 16"
                              style={{ cursor: "pointer" }}
                            >
                              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                            </svg>
                          </div>
                        </div>
                      );
                    })}
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
                  id="title"
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
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
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
                <label htmlFor="title" className="d-block">
                  Description
                </label>
                <textarea
                  {...register("desc", {
                    required: "Description is required!",
                  })}
                  className="w-100"
                  style={{ height: "30vh" }}
                ></textarea>
              </div>
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
