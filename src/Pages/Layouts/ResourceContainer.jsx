import React from "react";
import { useNavigate } from "react-router-dom";

function ResourceContainer(props) {
  const nagivate = useNavigate(); //-----This is for navigation-----//
  const src = props.img; //----This is for image value---//
  const baseUrl = import.meta.env.VITE_API_URL;

  const viewDetail = (id) => {
    nagivate(`/Admin/DetailResource/${id}`);
  };

  return (
    <div className="container col-md-3 h-100">
      <div
        className="container"
        style={{ height: "20vh", width: "20vw", objectFit: "cover" }}
        onClick={() => viewDetail(props.id)}
      >
        <img
          src={baseUrl + "storage/" + src}
          className="img-fluid h-100"
          style={{ objectFit: "cover", height: "100%", width: "100%" }}
        />
      </div>

      <h4
        className="text-center"
        style={{ cursor: "pointer" }}
        onClick={() => viewDetail(props.id)}
      >
        {props.name}
      </h4>
    </div>
  );
}

export default ResourceContainer;
