import React from "react";

function RandomActivities({ randomActivities, onSelectActivity, onViewFullList }) {
  return (
    <>
      <div className="container">
        <div
          className="square left-square"
          onClick={() => onSelectActivity(randomActivities[0])}
        >
          <p>{randomActivities[0]}</p>
        </div>
        <div
          className="square center-square"
          onClick={() => onSelectActivity(randomActivities[1])}
        >
          <p>{randomActivities[1]}</p>
        </div>
        <div
          className="square right-square"
          onClick={() => onSelectActivity(randomActivities[2])}
        >
          <p>{randomActivities[2]}</p>
        </div>
      </div>
      <button className="bottom-left-button" onClick={onViewFullList}>
        View Full Activity List
      </button>
    </>
  );
}

export default RandomActivities;
