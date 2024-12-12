import React from "react";

function FullActivityList({ activities, onAddActivity, onDeleteActivity, onSelectActivity, onBack }) {
  return (
    <>
      <div className="full-list">
        {activities.map((activity, index) => (
          <div
            className="activity-square"
            key={index}
            onClick={() => onSelectActivity(activity)}
          >
            <p>{activity}</p>
            <button
              className="delete-button"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteActivity(activity);
              }}
            >
              Delete
            </button>
          </div>
        ))}
        <button className="add-button" onClick={onAddActivity}>
          Add Activity
        </button>
      </div>
      <button className="bottom-left-button" onClick={onBack}>
        Back to Random Suggestions
      </button>
    </>
  );
}

export default FullActivityList;
