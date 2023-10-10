import React, { useEffect, useState } from "react";
import { ButtonGroup, Button } from "react-bootstrap";
import dashboardImage from "../../Images/blur.png";
import profilePicture from "../../Images/pfp.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import RadarChart from "./DataVisual";
import axios from "axios";
import "./Dashboard.css";

function TherapistDashboard() {
  const [selectedNavItem, setSelectedNavItem] = useState("");
  const [userList, setUserList] = useState([]);
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );
  const [selectedUser, setSelectedUser] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [userJournals, setUserJournals] = useState([]);
  const [expandedJournalIndex, setExpandedJournalIndex] = useState(-1);
  const [userSummary, setUserSummary] = useState();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const emotionData = [
    { category: "Anxious", value: 0.0 },
    { category: "Depressed", value: 1.05 },
    { category: "Horrible", value: 1.05 },
    { category: "Nervous", value: 0.0 },
    { category: "Angry", value: 0.0 },
    { category: "Shit", value: 0.0 },
    { category: "Sad", value: 1.05 },
    { category: "Loved", value: 0.0 },
  ];

  const handleGenerateSummary = async () => {
    setIsSummaryLoading(true);
    await fetchUserSummary(selectedUser);
    setIsSummaryLoading(false);
  };

  const fetchTherapistUserList = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACK_END_URL}/api/users/therapistUserList`,
        { withCredentials: true }
      );

      console.log("userList", response.data);
      setUserList(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const fetchUserSummary = async (user) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACK_END_URL}/api/users/fetchUserSummary`,
        {
          userId: user.id,
        },
        { withCredentials: true }
      );

      // handle the response, e.g., setState...
      console.log("fetchUserSummary", response.data);
      setUserSummary(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUserJournals = async (user) => {
    const today = new Date();
    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() - 7);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACK_END_URL}/api/users/fetchUserJournals`,
        {
          userId: user.id,
          startDate: pastDate,
          endDate: today,
        },
        { withCredentials: true }
      );

      console.log("fetchUserJournals", response.data);
      setUserJournals(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log("fetch user list");
    fetchTherapistUserList();
  }, []);

  useEffect(() => {
    console.log("fetch summary and journals for selectedUser:", selectedUser);

    setUserSummary(null);

    if (selectedUser) {
      fetchUserJournals(selectedUser);
    }
  }, [selectedUser]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

  return (
    <div className="dashboardContainer">
      <div className="userList">
        <div className="userListLogo">Empath</div>
        <input
          type="text"
          placeholder="Search users..."
          className="searchBar"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {isLoading ? (
          <>
            <div className="loadingContainer">
              <div className="spinner-grow text-light" role="status"></div>
              <div
                className="spinner-grow text-light me-2 ms-2"
                role="status"
              ></div>
              <div className="spinner-grow text-light" role="status"></div>
            </div>
          </>
        ) : (
          userList
            .filter((user) =>
              user.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((user) => (
              <div
                key={user.id}
                className={`user ${
                  selectedUser && selectedUser.id === user.id
                    ? "selectedUser"
                    : ""
                }`}
                onClick={() => setSelectedUser(user)}
              >
                {user.name}
              </div>
            ))
        )}
      </div>
      <div className="dashboardContent">
        <div className="navBar">
          <ButtonGroup
            className="buttonGroupDashboardContent"
            aria-label="Basic example"
          >
            <Button
              variant={selectedNavItem === "Home" ? "primary" : "secondary"}
              onClick={() => setSelectedNavItem("Home")}
            >
              Home
            </Button>
            <Button
              variant={selectedNavItem === "Profile" ? "primary" : "secondary"}
              onClick={() => setSelectedNavItem("Profile")}
            >
              Profile
            </Button>
            <Button
              variant={selectedNavItem === "Settings" ? "primary" : "secondary"}
              onClick={() => setSelectedNavItem("Settings")}
            >
              Settings
            </Button>
          </ButtonGroup>
        </div>
        <div className="topBar">
          <img
            src={dashboardImage}
            alt="Dashboard"
            className="dashboardImage"
          />
          <div className="timeDisplay">{currentTime}</div>
        </div>
        <div className="dashContainer">
          {selectedUser == "" ? (
            <>
              <div className="selectUserText">
                <p className="dashboardSubtitle">
                  Select a user to view their summary
                </p>
              </div>
            </>
          ) : (
            <div className="dashboardUserSummary">
              <div className="profileWrapper">
                <div className="profileSection">
                  <div className="profileLeft">
                    <img
                      src={profilePicture}
                      alt="User's Profile"
                      className="profileImage"
                    />
                  </div>
                  <div className="profileRight">
                    <h2 className="profileTitle">{selectedUser.name}</h2>
                    <p className="userNotes">
                      This guy is actaully insane, make sure to never invite him
                      back...
                    </p>
                  </div>
                </div>
                <div className="radarChart">
                  <RadarChart data={emotionData} />
                </div>
              </div>

              <div className="summarySection">
                <div className="row d-flex">
                  <div className="col-sm-6 pe-2">
                    <div className="dateContainer">
                      <label className="dateText">Start Date:</label>
                      <input
                        type="date"
                        className="dateInput"
                        value={startDate.toISOString().split("T")[0]}
                        onChange={(e) => setStartDate(new Date(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="col-sm-6 col-sm-6 ps-2">
                    <div className="dateContainer">
                      <label className="dateText">End Date:</label>
                      <input
                        type="date"
                        className="dateInput"
                        value={endDate.toISOString().split("T")[0]}
                        onChange={(e) => setEndDate(new Date(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="col-sm-12 col-sm-6 mb-3">
                    <button
                      onClick={handleGenerateSummary}
                      className="handleGenerateSummaryButton"
                    >
                      {isSummaryLoading ? (
                        <div className="loadingContainer">
                          <div
                            className="spinner-grow text-light"
                            role="status"
                          ></div>
                          <div
                            className="spinner-grow text-light me-2 ms-2"
                            role="status"
                          ></div>
                          <div
                            className="spinner-grow text-light"
                            role="status"
                          ></div>
                        </div>
                      ) : (
                        "Generate Summary"
                      )}
                    </button>
                  </div>
                </div>

                <div className="summaryContainer">
                  
                  <div className="summaryText">
                    {userSummary ? (
                      <div className="journalEntry">
                        <div className="summaryTitle">Summary</div>
                        <p className="summaryText">{userSummary.summary}</p>
                        </div>
                    ) : (
                      null
                    )}
                  </div>
                </div>

                <div className="userJournals">
                  {userJournals.map((journal, index) => (
                    <div
                      key={index}
                      className="journalEntry"
                      onClick={() =>
                        setExpandedJournalIndex(
                          index === expandedJournalIndex ? -1 : index
                        )
                      }
                    >
                      <h3 className="journalTitle">{journal.title}</h3>
                      <small className="journalDate">
                        {new Date(journal.entry_date).toDateString()}
                      </small>
                      {expandedJournalIndex === index && (
                        <p className="journalText">{journal.text}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TherapistDashboard;
