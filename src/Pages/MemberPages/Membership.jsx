import React, { useEffect, useState, useContext } from "react";
import { getMembership } from "../../api/membershipApi";
import Menu from "./Layouts/Menu";
import { MembershipContext } from "./Context/MembershipContext";
import { useNavigate } from "react-router-dom";

const Membership = () => {
  const { userData, membershipPlan, setMembershipPlan, setTotal } =
    useContext(MembershipContext);
  const [memberships, setMemberships] = useState([]); // Store membership plans
  const [selectPlan, setSelectPlan] = useState(null); // Track selected plan
  const navigate = useNavigate();
  console.log(userData);

  // Effect for logging updated membershipPlan
  useEffect(() => {
    console.log("Updated membership plan:", membershipPlan);
  }, [membershipPlan]);

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const data = await getMembership(); // Fetch membership data
        setMemberships(Array.isArray(data?.data) ? data.data : []);
      } catch (error) {
        console.error("Error fetching memberships:", error);
        setMemberships([]); // Fallback to an empty array on error
      }
    };

    fetchMemberships();
  }, []);

  return (
    <div>
      <Menu />
      <div
        className="border p-5 w-75 mx-auto rounded-3"
        style={{ marginTop: "7%" }}
      >
        <div className="row w-100 justify-content-center">
          <h1 className="text-center">Membership Plans</h1>

          {memberships.map((membership, index) => (
            <div className="col-md-3 border m-3" key={index}>
              <div className="pricing-card text-center p-4">
                <h4 className="fw-bold">{membership.PlanName}</h4>
                <p className="text-muted">{membership.Duration}</p>
                <h3 className="fw-bold">${membership.Price}</h3>
                <ul className="list-unstyled">
                  <li>✔ {membership.Description}</li>
                </ul>

                {/* Show "Subscribe" button only if no plan is selected */}
                {selectPlan == null && (
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setSelectPlan({
                        planName: membership.PlanName,
                        price: membership.Price,
                      });
                      console.log(membership.id); // Log membership id
                      setMembershipPlan({
                        id: membership.id,
                        duration: membership.Duration,
                      }); // Update membership plan
                      setTotal(membership.Price);
                    }}
                  >
                    Subscribe
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Show Subscription Summary & Cancel Button if a plan is selected */}
      {selectPlan !== null && (
        <div className="container d-flex justify-content-center mt-5">
          <div className="border rounded p-3 w-50">
            <div className="d-flex justify-content-between">
              <p className="mb-1">{selectPlan.planName}</p>
              <p className="mb-1">${selectPlan.price}</p>
            </div>
            <hr />
            <div className="d-flex justify-content-between">
              <p className="fw-bold mb-0">Today's total</p>
              <p className="fw-bold mb-0 text-primary">${selectPlan.price}</p>
            </div>

            {/* Go to Payment Link */}

            {/* Cancel Button */}
            <button
              className="btn btn-danger w-100 mt-3"
              onClick={() => {
                setSelectPlan(null);
                setMembershipPlan(null);
                setTotal(null);
              }} // Reset selection
            >
              Cancel Subscription
            </button>
            <div
              className="d-flex justify-content-center mt-3"
              onClick={() => {
                navigate("/Customer/Payment");
              }}
            >
              <a href="#" className="btn btn-link p-0">
                Go to Payment &rarr;
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Membership;
