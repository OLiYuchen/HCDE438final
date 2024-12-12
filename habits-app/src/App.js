import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Header from "./Header";
import RandomActivities from "./RandomActivities";
import FullActivityList from "./FullActivityList";
import ReflectionPage from "./ReflectionPage";
import ReflectionCollectionPage from "./ReflectionCollectionPage";
import "./App.css";

function App() {
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

  const [randomActivities, setRandomActivities] = useState(() =>
    getRandomActivities()
  );
  const [currentActivity, setCurrentActivity] = useState(null);
  const [reflections, setReflections] = useState({});
  const [mood, setMood] = useState(5);
  const [reflection, setReflection] = useState("");
  const [reflectionTime, setReflectionTime] = useState("");

  const navigate = useNavigate();

  function getRandomActivities() {
    const shuffled = [...activities].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(3, activities.length));
  }

  const addActivity = () => {
    const newActivity = prompt("Enter a new activity:");
    if (newActivity && !activities.includes(newActivity)) {
      setActivities([...activities, newActivity]);
    }
  };

  const deleteActivity = (activityToDelete) => {
    setActivities(activities.filter((activity) => activity !== activityToDelete));
  };

  const submitReflection = () => {
    const newReflection = {
      mood,
      text: reflection,
      time: reflectionTime || new Date().toLocaleString(),
    };

    setReflections((prev) => ({
      ...prev,
      [currentActivity]: prev[currentActivity]
        ? [...prev[currentActivity], newReflection]
        : [newReflection],
    }));

    setCurrentActivity(null);
    setMood(5);
    setReflection("");
    setReflectionTime("");
    navigate("/reflections");
  };

  const deleteReflection = (activity, index) => {
    setReflections((prev) => ({
      ...prev,
      [activity]: prev[activity].filter((_, i) => i !== index),
    }));
  };

  const editReflection = (activity, index, newReflection) => {
    setReflections((prev) => ({
      ...prev,
      [activity]: prev[activity].map((r, i) =>
        i === index ? newReflection : r
      ),
    }));
  };

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <RandomActivities
              randomActivities={randomActivities}
              onSelectActivity={(activity) => {
                setCurrentActivity(activity);
                navigate("/reflection");
              }}
              onViewFullList={() => navigate("/activities")}
            />
          }
        />
        <Route
          path="/activities"
          element={
            <FullActivityList
              activities={activities}
              onAddActivity={addActivity}
              onDeleteActivity={deleteActivity}
              onSelectActivity={(activity) => {
                setCurrentActivity(activity);
                navigate("/reflection");
              }}
              onBack={() => navigate("/")}
            />
          }
        />
        <Route
          path="/reflection"
          element={
            <ReflectionPage
              currentActivity={currentActivity}
              mood={mood}
              setMood={setMood}
              reflection={reflection}
              setReflection={setReflection}
              reflectionTime={reflectionTime}
              setReflectionTime={setReflectionTime}
              onSubmit={submitReflection}
              onCancel={() => navigate("/reflections")}
              onBackToMain={() => navigate("/")}
            />
          }
        />
        <Route
          path="/reflections"
          element={
            <ReflectionCollectionPage
              reflections={reflections}
              onEdit={editReflection}
              onDelete={deleteReflection}
              onAddReflection={(activity) => {
                setCurrentActivity(activity || "New Reflection");
                navigate("/reflection");
              }}
              onBackToMain={() => navigate("/")}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
