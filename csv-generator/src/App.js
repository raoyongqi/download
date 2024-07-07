import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [formData, setFormData] = useState([{ key: '', value: '' }]);
  const [csvData, setCsvData] = useState(null);

  const handleChange = (index, event) => {
    const values = [...formData];
    values[index][event.target.name] = event.target.value;
    setFormData(values);
  };

  const handleAddFields = () => {
    setFormData([...formData, { key: '', value: '' }]);
  };

  const handleRemoveFields = (index) => {
    const values = [...formData];
    values.splice(index, 1);
    setFormData(values);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/generate_csv/', formData, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'data.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("There was an error generating the CSV!", error);
    }
  };

  return (
    <div className="App">
      <h1>CSV Generator</h1>
      <form onSubmit={handleSubmit}>
        {formData.map((formField, index) => (
          <div key={index}>
            <input
              name="key"
              type="text"
              placeholder="Key"
              value={formField.key}
              onChange={(event) => handleChange(index, event)}
            />
            <input
              name="value"
              type="text"
              placeholder="Value"
              value={formField.value}
              onChange={(event) => handleChange(index, event)}
            />
            <button type="button" onClick={() => handleRemoveFields(index)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={handleAddFields}>Add Fields</button>
        <button type="submit">Generate CSV</button>
      </form>
    </div>
  );
}

export default App;
