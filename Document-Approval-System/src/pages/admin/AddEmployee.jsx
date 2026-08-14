import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddEmployee = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [add, setAdd] = useState(false)
  const [countryCode, setCountryCode] = useState("+880");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    number: "",
    empId: "",
    department: "",
  });

  const generateEmpId = async()=>{
  try{
    const res = await axios.get(
      "http://localhost:3000/api/admin/generate-empid",
      {
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    )

    setFormData(prev=>({
      ...prev,
      empId: res.data.empId
    }))
  }catch(err){
    console.log("EMP ID ERROR:", err.response?.data || err.message)
  }
}

  useEffect(() => {
    generateEmpId();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError("");
    setSuccess("");
    
    let newValue = value;

    if (name === "number") {
      newValue = value.replace(/\D/g, "").slice(0, 11);
    }

    const updatedData = {
      ...formData,
      [name]: newValue,
    };

    setFormData(updatedData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAdd(true)
    if (formData.number.length < 10) {
      setError("Mobile number must be at least 10 digits.");
      setAdd(false);
      return;
    }

    const fullPayload = {
      ...formData,
      number: `${countryCode} ${formData.number}`
    };

    try {
      const res = await axios.post(
        "http://localhost:3000/api/admin/create-employee",
        fullPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess(res.data.message)
      setError("")
      setFormData({
          name: "",
          email: "",
          role: "",
          number: "",
          empId: "",
          department: "",
      });
      generateEmpId();
      setTimeout(() => {
        setSuccess("")
      }, 2000);
    } catch (err) {
      console.log(err);
      setSuccess("");

      setError(
        err.response?.data?.message || "Failed to create employee."
      );
    } finally {
      setAdd(false)
    }
  }

  return (
    <div className="grid grid-cols-3">
      
      <div className="ml-3 shadow-[0_0_20px_rgba(0,0,0,0.35)] h-[94vh] rounded-xl col-span-2">
        <h1 className="flex justify-center p-4 text-4xl font-semibold text-violet-500 underline">Add New Employee </h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col p-3 space-y-2 px-8"
          >
          <label htmlFor="" className="font-bold text-xl">Name:</label>
          <input
            type="text"
            name="name"
            className="h-10 border-1 border-gray-200 p-3 outline-none"
            placeholder="Saurav Sharma"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <label htmlFor="" className="font-bold text-xl">Email:</label>
          <input
            type="email"
            name="email"
            className="h-10 border-1 border-gray-200 p-3 outline-none"
            placeholder="abc123@gmail.com"
            value={formData.email}
            onChange={handleChange}
            required
            />
          <label htmlFor="" className="font-bold text-xl">Role:</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="h-10 border-1 border-gray-200 px-3 outline-none"
            required
          >
            <option value="" disabled>choose role</option>
            <option value="Employee">Employee</option>
            <option value="Manager">Manager</option>
          </select>
          <label htmlFor="" className="font-bold text-xl">Number</label>
          <div className="flex gap-2">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="h-10 border-1 border-gray-200 px-2 outline-none bg-gray-50 font-medium text-gray-700"
            >
              <option value="+880">🇧🇩 +880 (BD)</option>
              <option value="+91">🇮🇳 +91 (IN)</option>
              <option value="+1">🇺🇸 +1 (US)</option>
              <option value="+44">🇬🇧 +44 (UK)</option>
              <option value="+971">🇦🇪 +971 (UAE)</option>
              <option value="+966">🇸🇦 +966 (KSA)</option>
            </select>
            <input
              type="tel"
              name="number"
              placeholder="01700000000"
              className="h-10 border-1 border-gray-200 p-3 outline-none flex-1"
              value={formData.number}
              onChange={handleChange}
              maxLength={11}
              required
            />
          </div>
          <label htmlFor="" className="font-bold text-xl">Employee Id:</label>
          
          <input
            type="text"
            name="empId"
            value={formData.empId}
            className="h-10 border-1 border-gray-200 p-3 outline-none bg-gray-100 font-semibold text-blue-600 cursor-not-allowed"
            readOnly
            />
          <label htmlFor="" className="font-bold text-xl">Department:</label>
          
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="h-10 border-1 border-gray-200 px-3 outline-none"
            required
          >
            <option value="" disabled>Select Department</option>
            <option value="MERN">MERN Stack</option>
            <option value="WEB">Web Development</option>
            <option value="AI/ML">AI & Machine Learning</option>
            <option value="HR">Human Resources (HR)</option>
            <option value="FINANCE">Finance</option>
            <option value="MARKETING">Marketing</option>
            <option value="DESIGN">UI/UX Design</option>
            <option value="OPERATIONS">Operations</option>
          </select>
          <div>

            {error && (
              <p className="bg-red-100 text-red-700 border border-red-300 px-3 py-2 rounded">
                {error}
              </p>
            )}

            {success && (
              <p className="bg-green-100 text-green-700 border border-green-300 px-3 py-2 rounded">
                {success}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={add}
            className="bg-green-600 text-white py-2  rounded cursor-pointer font-bold hover:bg-green-700 transition"
            >
            {add? "Adding..." : "Add Employee"}
          </button>
        </form>
      </div>
      <div className="ml-3 shadow-[0_0_20px_rgba(0,0,0,0.35)] h-[94vh] rounded-xl "></div>
    </div>
  );
};

export default AddEmployee;