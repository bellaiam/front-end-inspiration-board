import { useState } from 'react';
import Proptypes from 'prop-types';
import React from 'react';


const INITIAL_FORM_DATA = {
    id:0,
    title: "",
    owner:""
}

const NewBoardForm = ({ addBoard }) => {
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const [showForm, setShowForm] = useState(true);
    
    const updatePreview = (evt) => {
        const newFormData = {
        ...formData,
        [evt.target.name]: evt.target.value
        };
    
        setFormData(newFormData);
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("we're in handleSubmit");
        addBoard(formData);

        setFormData(INITIAL_FORM_DATA);
    }
    
    const toggleForm = () => {
        setShowForm((prevState) => !prevState);
    };
    
    return ( 
        <section className="board-form">
            {showForm ? <div id="form_section">
                <form onSubmit={handleSubmit}>
                    <div>
                    <label>Title</label>
                    </div>
                        <input type="text"
                            className={formData.title ? "valid-form-input":"invalid-form-input"}
                            id="title" 
                            name="title" 
                            value={formData.title}
                            onChange={updatePreview}
                        />
                    <div>
                    <label>Owner's Name</label>
                    </div>
                        <input type="text" 
                            className={formData.owner ? "valid-form-input":"invalid-form-input"}
                            id="owner" 
                            name="owner" 
                            value={formData.owner}
                            onChange={updatePreview}
                        />
                    <p>Preview:</p>
                    <div id="preview">{formData.title} - {formData.owner}</div>
                    <input className="submit-button" type="submit" value="Submit" onClick={handleSubmit}/>
                </form>
            </div>  : <div></div>}
        <div>
            <button className="new-board-form__toggle-btn" onClick={toggleForm}>
                {showForm ? "Hide New Board Form" : "Show New Board Form"}
            </button>
            </div>
        </section>
        
    );
};
NewBoardForm.protoTypes= {
    addBoard: Proptypes.func.isRequired
}
export default NewBoardForm
