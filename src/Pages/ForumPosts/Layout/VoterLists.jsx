import React, { useEffect, useState } from "react";
import { getVoters } from "../../../api/voteApi"; // Adjust the path as needed

function VoterLists({ id, onClose, show }) {
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVoters = async () => {
      try {
        const response = await getVoters(id);
        setVoters(response.voters || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load voters.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVoters();
    }
  }, [id]);

  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="modal-backdrop fade show"></div>
      {/* Modal */}
      <div
        className="modal fade show"
        style={{ display: "block" }}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="voterListModalLabel"
        aria-modal="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="voterListModalLabel">
                Voter List
              </h5>
              <button
                type="button"
                className="close"
                onClick={onClose}
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {loading && <p>Loading...</p>}
              {error && <p className="text-danger">{error}</p>}
              {!loading && !error && (
                <ul className="list-group">
                  {voters.map((vote, index) => (
                    <li
                      key={index}
                      className="list-group-item d-flex align-items-center"
                    >
                      <img
                        src={
                          vote.user.ProfilePic
                            ? `http://127.0.0.1:8000/storage/${vote.user.ProfilePic}`
                            : "/Customer/pic.jpg"
                        }
                        alt={vote.user.name}
                        className="rounded-circle mr-3"
                        style={{ width: "40px", height: "40px" }}
                      />
                      <span>{vote.user.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default VoterLists;
