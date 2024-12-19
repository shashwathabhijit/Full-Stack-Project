import  { useState } from "react";
import axios from "axios";
import './App.css';


const App = () => {
  const [formData, setFormData] = useState({
    name: "",
    employeeId: "",
    email: "",
    phone: "",
    department: "HR",
    dateOfJoining: "",
    role: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!/^[a-zA-Z0-9]{1,10}$/.test(formData.employeeId)) newErrors.employeeId = "Invalid Employee ID";
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Phone number must be 10 digits";
    if (!formData.dateOfJoining || new Date(formData.dateOfJoining) > new Date()) newErrors.dateOfJoining = "Invalid date of joining";
    if (!formData.role) newErrors.role = "Role is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post("http://localhost:5000/api/employees", formData);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Submission failed");
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      employeeId: "",
      email: "",
      phone: "",
      department: "HR",
      dateOfJoining: "",
      role: "",
    });
    setErrors({});
    setMessage("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div>
      <h1>Add Employee</h1>
      <form onSubmit={handleSubmit}>
        {["name", "employeeId", "email", "phone", "role"].map((field) => (
          <div key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input name={field} value={formData[field]} onChange={handleChange} />
            {errors[field] && <p style={{ color: "red" }}>{errors[field]}</p>}
          </div>
        ))}
        <div>
          <label>Department</label>
          <select name="department" value={formData.department} onChange={handleChange}>
            {["HR", "Engineering", "Marketing"].map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Date of Joining</label>
          <input type="date" name="dateOfJoining" value={formData.dateOfJoining} onChange={handleChange} />
          {errors.dateOfJoining && <p style={{ color: "red" }}>{errors.dateOfJoining}</p>}
        </div>
        <button type="submit">Submit</button>
        <button type="button" onClick={handleReset}>Reset</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default App;
