import { useState } from "react";
import PropTypes from "prop-types";
import React from "react";

const INITIAL_FORM_DATA = {
  title: "",
  owner: "",
};

const NewBoardForm = ({ addBoard }) => {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [showForm, setShowForm] = useState(true);
  const [error, setError] = useState("");

  const updatePreview = (evt) => {
    setFormData({
      ...formData,
      [evt.target.name]: evt.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    // Validate before sending
    if (!formData.title || !formData.owner) {
      setError("Both Title and Owner are required.");
      return;
    }

    // Send POST request to Flask backend
    fetch("http://127.0.0.1:5000/boards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to create board");
        }
        return res.json();
      })
      .then((data) => {
        addBoard(data.board); // Update parent state with new board
        setFormData(INITIAL_FORM_DATA); // reset form
      })
      .catch((err) => {
        console.error(err);
        setError("Error submitting board. Check console for details.");
      });
  };

  const toggleForm = () => {
    setShowForm((prev) => !prev);
  };

  return (
    <section className="board-form">
      {showForm && (
        <div id="form_section">
          <form onSubmit={handleSubmit}>
            <div>
              <label>Title</label>
              <input
                type="text"
                className={formData.title ? "valid-form-input" : "invalid-form-input"}
                id="title"
                name="title"
                value={formData.title}
                onChange={updatePreview}
              />
            </div>
            <div>
              <label>Owner's Name</label>
              <input
                type="text"
                className={formData.owner ? "valid-form-input" : "invalid-form-input"}
                id="owner"
                name="owner"
                value={formData.owner}
                onChange={updatePreview}
              />
            </div>
            <p>Preview:</p>
            <div id="preview">
              {formData.title} - {formData.owner}
            </div>
            {error && <p className="error">{error}</p>}
            <input className="submit-button" type="submit" value="Submit" />
          </form>
        </div>
      )}
      <div>
        <button className="new-board-form__toggle-btn" onClick={toggleForm}>
          {showForm ? "Hide New Board Form" : "Show New Board Form"}
        </button>
      </div>
    </section>
  );
};

NewBoardForm.propTypes = {
  addBoard: PropTypes.func.isRequired,
};

export default NewBoardForm;