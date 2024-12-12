import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { db, auth } from "./Firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import Header from "./Header";
import Login from "./Login";
import Signup from "./Signup";
import RandomActivities from "./RandomActivities";
import FullActivityList from "./FullActivityList";
import ReflectionPage from "./ReflectionPage";
import ReflectionCollectionPage from "./ReflectionCollectionPage";
import "./App.css";
import "./LoginSignup.css";

function App() {
  const initialActivities = [
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
  ];

  const [activities, setActivities] = useState(initialActivities);
  const [randomActivities, setRandomActivities] = useState([]);
  const [currentActivity, setCurrentActivity] = useState(null);
  const [reflections, setReflections] = useState({});
  const [mood, setMood] = useState(5);
  const [reflection, setReflection] = useState("");
  const [reflectionTime, setReflectionTime] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [selectingActivity, setSelectingActivity] = useState(false);

  const navigate = useNavigate();

  // Fetch user data from Firebase on authentication state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true);
        setUserId(user.uid);

        const userDoc = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userDoc);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setActivities(userData.activities || initialActivities);
          setReflections(userData.reflections || {});
          setRandomActivities(getRandomActivities(userData.activities || initialActivities));
        } else {
          // Initialize new user data
          await setDoc(userDoc, {
            activities: initialActivities,
            reflections: {},
          });
          setActivities(initialActivities);
          setReflections({});
          setRandomActivities(getRandomActivities(initialActivities));
        }
      } else {
        setIsAuthenticated(false);
        setUserId(null);
        setActivities([]);
        setReflections({});
        setRandomActivities([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync activities and reflections to Firebase
  useEffect(() => {
    if (userId) {
      const userDoc = doc(db, "users", userId);
      updateDoc(userDoc, { activities, reflections }).catch((error) => {
        console.error("Error syncing to Firestore:", error);
      });
    }
  }, [activities, reflections, userId]);

  // Generate random activities
  function getRandomActivities(activitiesList) {
    const shuffled = [...activitiesList].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(3, activitiesList.length));
  }

  const addActivity = async () => {
    const newActivity = prompt("Enter a new activity:");
    if (newActivity && !activities.includes(newActivity)) {
      const updatedActivities = [...activities, newActivity];
      setActivities(updatedActivities);
    }
  };

  const deleteActivity = (activityToDelete) => {
    const updatedActivities = activities.filter((activity) => activity !== activityToDelete);
    setActivities(updatedActivities);
  };

  const submitReflection = async () => {
    if (!currentActivity || !reflection.trim()) {
      alert("Please fill in the reflection text before submitting.");
      return;
    }

    const newReflection = {
      mood,
      text: reflection || "No reflection provided.",
      time: reflectionTime || new Date().toISOString(),
    };

    try {
      const userDocRef = doc(db, "users", userId);
      const userSnapshot = await getDoc(userDocRef);

      if (!userSnapshot.exists()) {
        alert("User document does not exist.");
        return;
      }

      const userData = userSnapshot.data();
      const existingReflections = userData.reflections || {};

      const updatedReflections = {
        ...existingReflections,
        [currentActivity]: existingReflections[currentActivity]
          ? [...existingReflections[currentActivity], newReflection]
          : [newReflection],
      };

      await updateDoc(userDocRef, {
        reflections: updatedReflections,
      });

      setReflections(updatedReflections);
      setCurrentActivity(null);
      setMood(5);
      setReflection("");
      setReflectionTime("");
      navigate("/reflections");
    } catch (error) {
      console.error("Error adding reflection:", error);
      alert("Failed to log reflection. Please try again.");
    }
  };

  const deleteReflection = async (activity, index) => {
    const updatedReflections = { ...reflections };

    if (updatedReflections[activity]) {
      updatedReflections[activity].splice(index, 1);

      if (updatedReflections[activity].length === 0) {
        delete updatedReflections[activity];
      }

      setReflections(updatedReflections);

      if (userId) {
        const userDocRef = doc(db, "users", userId);
        try {
          await updateDoc(userDocRef, { reflections: updatedReflections });
        } catch (error) {
          console.error("Error deleting reflection:", error);
          alert("Failed to delete reflection. Please try again.");
        }
      }
    }
  };

  const editReflection = async (activity, index, updatedReflection) => {
    const updatedReflections = { ...reflections };
    if (updatedReflections[activity]) {
      updatedReflections[activity][index] = updatedReflection;

      setReflections(updatedReflections);

      if (userId) {
        const userDocRef = doc(db, "users", userId);
        try {
          await updateDoc(userDocRef, { reflections: updatedReflections });
        } catch (error) {
          console.error("Error updating reflection:", error);
          alert("Failed to update reflection. Please try again.");
        }
      }
    }
  };

  const handleAddReflection = () => {
    setSelectingActivity(true);
  };

  const handleSelectActivity = (activity) => {
    setCurrentActivity(activity);
    setSelectingActivity(false);
    navigate("/reflection");
  };

  const handleSignOut = () => {
    auth.signOut();
    setIsAuthenticated(false);
    setUserId(null);
    navigate("/login");
  };

  return (
    <div className="App">
      <Header />
      {isAuthenticated && (
        <button className="sign-out-button fixed-top-right" onClick={handleSignOut}>
          Sign Out
        </button>
      )}
      {selectingActivity && (
        <div className="activity-selection">
          <h3>Select an activity for your reflection:</h3>
          <ul>
            {activities.map((activity) => (
              <li key={activity} onClick={() => handleSelectActivity(activity)}>
                {activity}
              </li>
            ))}
          </ul>
        </div>
      )}
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/" /> : <Login onLogin={() => setIsAuthenticated(true)} />
          }
        />
        <Route
          path="/signup"
          element={<Signup onSignup={() => setIsAuthenticated(true)} />}
        />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <RandomActivities
                randomActivities={randomActivities}
                onSelectActivity={(activity) => {
                  setCurrentActivity(activity);
                  navigate("/reflection");
                }}
                onAddReflection={handleAddReflection}
                onViewFullList={() => navigate("/activities")}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/activities"
          element={
            isAuthenticated ? (
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
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/reflection"
          element={
            isAuthenticated ? (
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
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/reflections"
          element={
            isAuthenticated ? (
              <ReflectionCollectionPage
                reflections={reflections}
                onEdit={editReflection}
                onDelete={deleteReflection}
                onAddReflection={handleAddReflection}
                onBackToMain={() => navigate("/")}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;
