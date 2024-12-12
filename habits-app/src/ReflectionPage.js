import React, { useState } from "react";

function ReflectionPage({
  currentActivity,
  mood,
  setMood,
  reflection,
  setReflection,
  reflectionTime,
  setReflectionTime,
  onSubmit,
  onCancel,
  onBackToMain,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editableActivity, setEditableActivity] = useState(currentActivity);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleActivityChange = (e) => {
    setEditableActivity(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  return (
    <div className="reflection-container">
      <div className="reflection-box">
        <h2>
          Log Reflection for{" "}
          {isEditing ? (
            <input
              type="text"
              value={editableActivity}
              onChange={handleActivityChange}
              onBlur={handleBlur}
              autoFocus
            />
          ) : (
            <span onDoubleClick={handleDoubleClick} style={{ cursor: "pointer" }}>
              "{editableActivity}"
            </span>
          )}
        </h2>
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
          placeholder="Write your thoughts here..."
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          maxLength={200}
        />
        <input
          type="datetime-local"
          value={reflectionTime}
          onChange={(e) => setReflectionTime(e.target.value)}
        />
        <div className="reflection-actions">
          <button onClick={onSubmit}>Log Reflection</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
      <button className="bottom-left-button" onClick={onBackToMain}>
        Back to Main Page
      </button>
    </div>
  );
}

export default ReflectionPage;
