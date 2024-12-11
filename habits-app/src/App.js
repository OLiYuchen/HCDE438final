import React, { useState } from "react";
import "./App.css";

function App() {
  // State to store the list of activities
  const [activities, setActivities] = useState([
    "Reading a book",
    "Yoga",
    "Meditation",
    "Cooking",
    "Painting",
    "Gardening",
    "Writing",
    "Cycling",
    "Playing music",
    "Walking in the park",
  ]);

  // State to store random activities for the main screen
  const [randomActivities, setRandomActivities] = useState(getRandomActivities());

  // State to toggle full activity list view
  const [showFullList, setShowFullList] = useState(false);

  // State to track the activity currently being logged
  const [currentActivity, setCurrentActivity] = useState(null);

  // State for mood slider and reflection text
  const [mood, setMood] = useState(5);
  const [reflection, setReflection] = useState("");

  // Function to generate three random activities
  function getRandomActivities() {
    const shuffled = [...activities].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }

  // Function to add a new activity
  const addActivity = () => {
    const newActivity = prompt("Enter a new activity:");
    if (newActivity && !activities.includes(newActivity)) {
      setActivities([...activities, newActivity]);
    }
  };

  // Function to delete an activity
  const deleteActivity = (activityToDelete) => {
    setActivities(activities.filter((activity) => activity !== activityToDelete));
  };

  // Function to handle reflection submission
  const submitReflection = () => {
    alert(`Reflection for "${currentActivity}" logged:\nMood: ${mood}\nReflection: ${reflection}`);
    setCurrentActivity(null); // Close the reflection page
    setMood(5); // Reset mood slider
    setReflection(""); // Reset reflection text
  };

  return (
    <div className="App">
      {/* Title Bar */}
      <header className="title-bar">
        <h1 className="title">Solo Activity Inspiration</h1>
        <p className="subtitle">
          Discover fun, personalized activities to make your alone time more fulfilling!
        </p>
      </header>

      {currentActivity ? (
        // Reflection Page
        <div className="reflection-container">
          <h2>Log Reflection for "{currentActivity}"</h2>
          <div className="mood-slider">
            <span role="img" aria-label="sad">
              😢
            </span>
            <input
              type="range"
              min="1"
              max="10"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
            />
            <span role="img" aria-label="happy">
              😊
            </span>
          </div>
          <textarea
            className="reflection-box"
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Write your thoughts here..."
            maxLength={200} // Limit reflection length to 200 characters
          />
          <div className="reflection-actions">
            <button onClick={submitReflection}>Log Reflection</button>
            <button onClick={() => setCurrentActivity(null)}>Cancel</button>
          </div>
        </div>
      ) : !showFullList ? (
        <>
          {/* Main Content with Random Activities */}
          <div className="container">
            <div
              className="square left-square"
              onClick={() => setCurrentActivity(randomActivities[0])}
            >
              <p>{randomActivities[0]}</p>
            </div>
            <div
              className="square center-square"
              onClick={() => setCurrentActivity(randomActivities[1])}
            >
              <p>{randomActivities[1]}</p>
            </div>
            <div
              className="square right-square"
              onClick={() => setCurrentActivity(randomActivities[2])}
            >
              <p>{randomActivities[2]}</p>
            </div>
          </div>

          {/* Bottom Left Button */}
          <button
            className="bottom-left-button"
            onClick={() => setShowFullList(true)}
          >
            View Full Activity List
          </button>
        </>
      ) : (
        <>
          {/* Full Activity List */}
          <div className="full-list">
            {activities.map((activity, index) => (
              <div
                className="activity-square"
                key={index}
                onClick={() => setCurrentActivity(activity)}
              >
                <p>{activity}</p>
                <button
                  className="delete-button"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the click event for the activity square
                    deleteActivity(activity);
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
            <button className="add-button" onClick={addActivity}>
              Add Activity
            </button>
          </div>
          <button
            className="bottom-left-button"
            onClick={() => {
              setRandomActivities(getRandomActivities());
              setShowFullList(false);
            }}
          >
            Back to Random Suggestions
          </button>
        </>
      )}
    </div>
  );
}

export default App;
