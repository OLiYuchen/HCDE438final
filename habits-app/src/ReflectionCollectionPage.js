import React from "react";

function ReflectionCollectionPage({
  reflections,
  onEdit,
  onDelete,
  onAddReflection,
  onBackToMain,
}) {
  return (
    <div className="reflection-collection">
      <button className="add-reflection-button" onClick={() => onAddReflection(null)}>
        Add Reflection
      </button>
      {Object.entries(reflections).map(([activity, activityReflections], activityIndex) => (
        <div key={activityIndex} className="activity-reflection">
          <h3>{activity}</h3>
          <div className="reflection-list">
            {activityReflections.map((reflection, reflectionIndex) => (
              <div key={reflectionIndex} className="reflection-square">
                <p><strong>Mood:</strong> {reflection.mood}</p>
                <p className="reflection-time">{reflection.time}</p>
                <p className="reflection-preview">
                  <strong>Preview:</strong> {reflection.text.slice(0, 30)}...
                </p>
                <div className="reflection-actions">
                  <button
                    className="edit-button"
                    onClick={() => {
                      const newReflection = {
                        ...reflection,
                        text:
                          prompt("Edit reflection:", reflection.text) ||
                          reflection.text,
                      };
                      onEdit(activity, reflectionIndex, newReflection);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-button-reflection"
                    onClick={() => onDelete(activity, reflectionIndex)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <button className="bottom-left-button" onClick={onBackToMain}>
        Back to Main Page
      </button>
    </div>
  );
}

export default ReflectionCollectionPage;
