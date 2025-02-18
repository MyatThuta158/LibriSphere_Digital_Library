import React, { useEffect, useState } from "react";
import { getAdmin, deleteAdmin as deleteAdminApi } from "../../../api/adminApi";
import Pagination from "../../Layouts/Pagination";
import DeleteConfirmBox from "../../Layouts/DeleteConfirmBox";

function ViewAdmins() {
  const [managers, setManagers] = useState([]); // Managers data
  const [librarians, setLibrarians] = useState([]); // Librarians data
  const [managerPageCount, setManagerPageCount] = useState(0); // Pagination for managers
  const [librarianPageCount, setLibrarianPageCount] = useState(0); // Pagination for librarians
  const [currentManagerPage, setCurrentManagerPage] = useState(1); // Current page for managers
  const [currentLibrarianPage, setCurrentLibrarianPage] = useState(1); // Current page for librarians
  const [adminid, setAdminid] = useState(0); // Admin ID for deletion
  const [flag, setFlag] = useState(false);

  // Fetch data for both managers and librarians
  useEffect(() => {
    const fetchData = async () => {
      try {
        const adminsData = await getAdmin(
          currentManagerPage,
          currentLibrarianPage
        );

        // Ensure you're accessing the `data` property inside `managers` and `librarians`
        setManagers(adminsData.data.managers?.data || []); // Safely access `data`
        setLibrarians(adminsData.data.librarians?.data || []); // Safely access `data`
        setManagerPageCount(adminsData.managers?.last_page || 0);
        setLibrarianPageCount(adminsData.librarians?.last_page || 0);
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, [currentManagerPage, currentLibrarianPage, flag]);

  const handleDeleteAdmin = async () => {
    const result = await deleteAdminApi(adminid);

    if (result.status === 200) {
      setAdminid(null);
      setFlag(true);
    }
    console.log(result.message);
  };

  const cancelAdmin = () => {
    setAdminid(null); // Reset admin ID on cancel
  };

  return (
    <div>
      <div className="container">
        {/* <h1 className="text-center">All Admins</h1> */}

        <div className="container-fluid">
          {/* Display managers */}
          <h3>Managers</h3>
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
              {managers.map((admin) => (
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

          <div className="container d-flex w-100 justify-content-center mt-3">
            <Pagination
              count={managerPageCount}
              currentPage={currentManagerPage}
              onPageChange={(page) => setCurrentManagerPage(page)}
            />
          </div>

          {/* Display librarians */}
          <h3>Librarians</h3>
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
              {librarians.map((admin) => (
                <tr key={admin.id}>
                  <td>{admin.id}</td>
                  <td>{admin.Name}</td>
                  <td>{admin.Email}</td>
                  <td
                    className={`badge ${
                      admin.Role === "librarian"
                        ? "text-bg-warning"
                        : "text-bg-primary"
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

          <div className="container d-flex w-100 justify-content-center mt-3">
            <Pagination
              count={librarianPageCount}
              currentPage={currentLibrarianPage}
              onPageChange={(page) => setCurrentLibrarianPage(page)}
            />
          </div>
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
