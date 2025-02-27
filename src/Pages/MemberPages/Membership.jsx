import React, { useEffect, useState, useContext } from "react";
import { getMembership } from "../../api/membershipApi";
import Menu from "../Layouts/Menu";
import { MembershipContext } from "./Context/MembershipContext";
import { useNavigate } from "react-router-dom";
import IsSystemUser from "../../CustomHook/IsSystemUser";

const Membership = () => {
  const { userData, membershipPlan, setMembershipPlan, setTotal } =
    useContext(MembershipContext);
  const [memberships, setMemberships] = useState([]); // Store membership plans
  const [selectPlan, setSelectPlan] = useState(null); // Track selected plan
  const navigate = useNavigate();
  const [isMember, setIsmember] = useState(false);

  // Effect for logging updated membershipPlan
  useEffect(() => {
    const { isMember } = IsSystemUser();

    setIsmember(isMember);
    // console.log("Updated membership plan:", membershipPlan);
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

      {/*--------This is to display membership plans---------*/}
      <div className="pricing8 py-2" style={{ marginTop: "12vh" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 text-center">
              <h3 className="mb-3">Pricing to make your Work Effective</h3>
              <h6 className="subtitle font-weight-normal">
                We offer 100% satisafaction and Money back Guarantee
              </h6>
            </div>

            {/* row */}
            <div className="row mt-4">
              {/* column */}

              {memberships.map((membership, index) => (
                <div
                  className="col-md-4 ml-auto pricing-box align-self-center"
                  key={index}
                >
                  <div className="card mb-4">
                    <div className="card-body p-4 text-center">
                      <h5 className="font-weight-normal">
                        {membership.PlanName}
                      </h5>
                      <sup>$</sup>
                      <span className="text-dark display-5">
                        {membership.Price}
                      </span>
                      <h6 className="font-weight-light font-14">
                        {membership.Duration}
                      </h6>
                      <p className="mt-4">{membership.Description}</p>
                    </div>
                    {/* Show "CHOOSE PLAN" button only if no plan is selected */}
                    {selectPlan == null && isMember == true && (
                      <button
                        className="btn btn-info-gradiant p-3 btn-block border-0 text-white"
                        onClick={() => {
                          setSelectPlan({
                            planName: membership.PlanName,
                            price: membership.Price,
                          });
                          console.log(membership.id); // Log membership id
                          setMembershipPlan({
                            id: membership.id,
                            duration: membership.Duration,
                          });
                          setTotal(membership.Price);
                        }}
                      >
                        CHOOSE PLAN
                      </button>
                    )}

                    {selectPlan == null && !isMember && (
                      <button
                        className="btn btn-info-gradiant p-3 btn-block border-0 text-white"
                        onClick={() => {
                          navigate("/Customer/MemberRegister");
                        }}
                      >
                        CHOOSE PLAN
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Show Subscription Summary & Cancel Button if a plan is selected */}
      {selectPlan !== null && (
        <div className="container d-flex justify-content-center mt-1">
          <div className="border rounded p-3 w-100">
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

            <div className="d-flex justify-content-center">
              {/* Cancel Button */}
              <button
                className="btn btn-danger w-75 mt-3"
                onClick={() => {
                  setSelectPlan(null);
                  setMembershipPlan(null);
                  setTotal(null);
                }} // Reset selection
              >
                Cancel Subscription
              </button>
            </div>
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
