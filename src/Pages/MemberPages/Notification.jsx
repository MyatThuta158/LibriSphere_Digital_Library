import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Spinner,
  Alert,
  Button,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getNoti } from "../../api/notificationApi"; // Adjust the import path as needed
import Menu from "../Layouts/Menu";

function Notification() {
  const [notifications, setNotifications] = useState({
    subscription_notifications: [],
    discussion_notifications: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNoti();
        console.log(data);
        setNotifications(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const handleDiscussionClick = (forumPostId) => {
    // Navigate to the related forum post page
    navigate(`/forum/${forumPostId}`);
  };

  const handleRetryPayment = (subscriptionId) => {
    // Handle payment retry action here.
    console.log("Retry payment for subscription:", subscriptionId);
    navigate(`/Community/PaymentResubmit/${subscriptionId}`);
  };

  if (loading) {
    return (
      <Container className="my-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-4">
        <Alert variant="danger">
          Failed to load notifications: {error.message}
        </Alert>
      </Container>
    );
  }

  return (
    <div>
      <Container className="my-4">
        {/* Subscription Notifications Section */}
        {notifications.subscription_notifications &&
          notifications.subscription_notifications.length > 0 && (
            <Row className="mb-4">
              <Col>
                <h2>Subscription Notifications</h2>
                <Card>
                  <ListGroup variant="flush">
                    {notifications.subscription_notifications.map(
                      (notification) => (
                        <ListGroup.Item
                          key={notification.id}
                          className="text-white"
                          style={{ background: "#4e73df" }}
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h5 className="text-white">
                                {notification.Description}
                              </h5>
                              <small className="text-white">
                                Created at:{" "}
                                {new Date(
                                  notification.created_at
                                ).toLocaleString()}
                              </small>
                              {/* Conditionally render the badge based on PaymentStatus */}
                              {notification.subscription &&
                              notification.subscription.PaymentStatus ===
                                "Rejected" ? (
                                <div
                                  className="badge d-block mt-2 bg-danger text-white"
                                  style={{ width: "10vw" }}
                                >
                                  Payment Rejected
                                </div>
                              ) : notification.subscription &&
                                notification.subscription.PaymentStatus ===
                                  "Resubmit" ? (
                                <div className="badge d-block mt-2 w-50 bg-warning text-white">
                                  Payment Resubmitted
                                </div>
                              ) : notification.subscription &&
                                notification.subscription.PaymentStatus ===
                                  "pending" ? (
                                <div className="badge d-block mt-2 w-50 bg-secondary text-white">
                                  Payment Pending
                                </div>
                              ) : null}
                            </div>
                            <span className="badge">
                              {notification.subscription &&
                                notification.subscription.PaymentStatus ===
                                  "Rejected" && (
                                  <div className="mt-2">
                                    <Button
                                      variant="danger"
                                      size="sm"
                                      className="ms-2"
                                      onClick={() =>
                                        handleRetryPayment(
                                          notification.subscription.id
                                        )
                                      }
                                    >
                                      Retry Payment
                                    </Button>
                                  </div>
                                )}
                            </span>
                          </div>
                        </ListGroup.Item>
                      )
                    )}
                  </ListGroup>
                </Card>
              </Col>
            </Row>
          )}

        {/* Discussion Notifications Section */}
        {notifications.discussion_notifications &&
          notifications.discussion_notifications.length > 0 && (
            <Row>
              <Col>
                <h2>Discussion Notifications</h2>
                <Card>
                  <ListGroup variant="flush">
                    {notifications.discussion_notifications.map(
                      (notification) => (
                        <ListGroup.Item
                          key={notification.id}
                          style={{ background: "#4e73df" }}
                          action
                          onClick={() =>
                            handleDiscussionClick(notification.ForumPostId)
                          }
                          className="cursor-pointer text-white"
                        >
                          <p className="mb-1">{notification.Content}</p>
                          <small className="text-white fw-bold">
                            From: {notification.user.name} | Created at:{" "}
                            {new Date(notification.created_at).toLocaleString()}
                          </small>
                        </ListGroup.Item>
                      )
                    )}
                  </ListGroup>
                </Card>
              </Col>
            </Row>
          )}
      </Container>
    </div>
  );
}

export default Notification;
