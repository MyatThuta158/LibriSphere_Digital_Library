import React, { useEffect, useState } from "react";
import { getAdmin, deleteAdmin as deleteAdminApi } from "../../../api/adminApi";
import Pagination from "../../Layouts/Pagination";
import DeleteConfirmBox from "../../Layouts/DeleteConfirmBox";

function ViewAdmins() {
  const [admins, setAdmins] = useState([]); //----This set admins values---//
  const [pagecount, setPagecount] = useState(0); //----This is for page count for pagination---//
  const [currentpage, setCurrentpage] = useState(0); //----This is for current page---//
  const [adminid, setAdminid] = useState(0); //---This set for admin id for deletion process---//
  const [flag, setFlag] = useState(false);
  //------This get all admins----///
  useEffect(() => {
    const fetchData = async () => {
      try {
        const adminsData = await getAdmin(currentpage);
        setAdmins(adminsData);
        setPagecount(adminsData.data.last_page);
        setCurrentpage(adminsData.data.current_page);
        setAdmins(adminsData.data.data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, [currentpage, flag]);

  const currentPageset = (page) => {
    setCurrentpage(page);
  };

  const handleDeleteAdmin = async () => {
    // Add logic to delete admin by id

    const result = await deleteAdminApi(adminid);

    if (result.status == 200) {
      setAdminid(null);
      setFlag(true);
    }
    console.log(result.message);
  };

  ///-----This is for cancel process---//
  const cancelAdmin = () => {
    setAdminid(null); //-----This set the admin id to null
  };
  return (
    <div>
      <div className="container">
        <h1 className="text-center">All Admins</h1>

        <div className="container-fluid">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id}>
                  <td>{admin.id}</td>
                  <td>{admin.Name}</td>
                  <td>{admin.Email}</td>
                  <td
                    className={`badge ${
                      admin.Role === "manager"
                        ? "text-bg-primary"
                        : "text-bg-warning"
                    }`}
                  >
                    {admin.Role}
                  </td>
                  <td>
                    <button
                      className="btn btn-danger text-white"
                      type="button"
                      onClick={() => {
                        setAdminid(admin.id);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* count, currentPage, onPageChange */}
        <div className="container d-flex w-100 justify-content-center mt-3">
          <Pagination
            count={pagecount}
            currentPage={currentpage}
            onPageChange={currentPageset}
          />
        </div>
      </div>

      {adminid && (
        <DeleteConfirmBox
          id={adminid}
          handleDelete={handleDeleteAdmin}
          setNull={cancelAdmin}
          message={"Are you sure you want to delete admin?"}
        />
      )}
    </div>
  );
}

export default ViewAdmins;
