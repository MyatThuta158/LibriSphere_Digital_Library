import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getSubscriberPredict } from "../../../api/predictionApi";
import { adminMembership } from "../../../api/membershipApi"; // Adjust the import path if needed

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Helper function to format ISO date string to "YYYY-MM-DD"
const formatDate = (dateString) => {
  if (!dateString) return "";
  return dateString.includes("T") ? dateString.split("T")[0] : dateString;
};

function SubscriberRevenuePrediction() {
  const [currentData, setCurrentData] = useState({}); // Object mapping plan names to computed prediction records
  const [availablePlans, setAvailablePlans] = useState([]); // List of unique plan names
  const [selectedPlan, setSelectedPlan] = useState("");
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Build chart data for the selected plan.
  const buildChartData = (planRecord) => {
    if (!planRecord) return;
    const next7 = planRecord.predictions.next_7_days;
    const next14 = planRecord.predictions.next_14_days;
    const next28 = planRecord.predictions.next_28_days;
    const chart = {
      labels: ["Next 7 days", "Next 14 days", "Next 28 days"],
      datasets: [
        {
          label: `${selectedPlan} Predicted Revenue`,
          data: [next7, next14, next28],
          backgroundColor: [
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
            "rgba(255, 159, 64, 0.6)",
          ],
        },
      ],
    };
    setChartData(chart);
  };

  // When the selected plan changes, update the chart.
  React.useEffect(() => {
    if (currentData && selectedPlan && currentData[selectedPlan]) {
      buildChartData(currentData[selectedPlan]);
    }
  }, [selectedPlan, currentData]);

  // Handle the prediction: call both APIs, multiply predictions by membership price, then update state.
  const handlePredict = async () => {
    setIsLoading(true);
    try {
      // Get predictions from the ML API.
      const predictionRes = await getSubscriberPredict();
      // Get membership plans.
      const membershipRes = await adminMembership();

      // console.log(membershipRes);
      // Assuming membershipRes is in the form: { data: [ { PlanName, Price, ... }, ... ] }
      const membershipPlans = membershipRes;
      // Build a lookup map for membership plans using PlanName as the key.
      const membershipMap = {};
      membershipPlans.forEach((plan) => {
        membershipMap[plan.PlanName] = plan;
      });

      // Process predictions: Multiply each predicted subscription count by the membership plan price.
      const newData = {};
      Object.keys(predictionRes).forEach((planName) => {
        const prediction = predictionRes[planName];
        // Use a default price of 1 if the membership plan is not found.
        const price = membershipMap[planName]
          ? parseFloat(membershipMap[planName].Price)
          : 1;
        newData[planName] = {
          predictions: {
            next_7_days: prediction.predictions.next_7_days * price,
            next_14_days: prediction.predictions.next_14_days * price,
            next_28_days: prediction.predictions.next_28_days * price,
          },
          Accuracy:
            prediction.metrics && prediction.metrics.accuracy
              ? (prediction.metrics.accuracy * 100).toFixed(0) + "%"
              : "0%",
          // Use the current date as the predicted date.
          PredictedDate: new Date().toISOString().split("T")[0],
        };
      });

      // Update state.
      setCurrentData(newData);
      const plans = Object.keys(newData);
      setAvailablePlans(plans);
      if (plans.length > 0) {
        setSelectedPlan(plans[0]);
        buildChartData(newData[plans[0]]);
      }
    } catch (error) {
      console.error("Error during prediction:", error);
      alert("An error occurred during prediction.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Subscriber Revenue Prediction Report</h2>

      {/* Dynamic dropdown based on unique SubscriptionPlanName */}
      {availablePlans.length > 0 && (
        <div>
          <label htmlFor="plan-select">Select Membership Type: </label>
          <select
            id="plan-select"
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
          >
            {availablePlans.map((plan) => (
              <option key={plan} value={plan}>
                {plan}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Display last predicted date and accuracy for the selected plan */}
      {currentData && selectedPlan && currentData[selectedPlan] && (
        <div>
          <p>
            Last Predicted Date:{" "}
            <strong>
              {formatDate(currentData[selectedPlan].PredictedDate)}
            </strong>
          </p>
          <p>
            Accuracy: <strong>{currentData[selectedPlan].Accuracy}</strong>
          </p>
        </div>
      )}

      <button onClick={handlePredict} disabled={isLoading}>
        {isLoading ? "Predicting..." : "Make Predict"}
      </button>

      {/* Render the bar chart if chart data is available */}
      {chartData ? (
        <div style={{ width: "70%", height: "60vh", margin: "0 auto" }}>
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      let label = context.dataset.label || "";
                      if (label) {
                        label += ": ";
                      }
                      if (context.parsed.y !== null) {
                        label += "$" + context.parsed.y;
                      }
                      return label;
                    },
                  },
                },
              },
            }}
          />
        </div>
      ) : (
        <p>No prediction data available.</p>
      )}
    </div>
  );
}

export default SubscriberRevenuePrediction;
