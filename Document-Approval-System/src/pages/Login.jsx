import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();

    const [role, setRole] = useState("Admin")

    const [formData, setFormData] = useState({
        login: "",
        password: ""
    });

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault()

        setLoading(true)
        setError("")

        try {

            let url = "";
            let payload = {};
            if (role === "Admin") {

                url = "http://localhost:3000/api/admin/login"

                payload = {
                    email: formData.login.trim(),
                    password: formData.password
                };
            }
            else {

                url = "http://localhost:3000/api/admin/employee-login"

                const isEmail = formData.login.includes("@")

                payload = {
                    email: isEmail ? formData.login.trim() : "",
                    empId: isEmail ? "" : formData.login.trim(),
                    password: formData.password
                };
            }

            const response = await axios.post(url, payload)

            if (response.data.success) {

                localStorage.setItem("token", response.data.token)

                const userRole =
                    role === "Admin"
                        ? "Admin"
                        : response.data.role;

                localStorage.setItem("role", userRole)

                if (userRole === "Admin") {
                    navigate("/admin/dashboard");
                }
                else if (userRole === "Manager") {
                    navigate("/manager/dashboard")
                }
                else {
                    navigate("/employee/dashboard")
                }
            }

        } catch (err) {
            console.log(err);
            setError(err.response?.data?.message || "Login failed. Please check your credentials.");
        } finally {

            setLoading(false)

        }

    };

    return (
        <div className="min-h-screen bg-slate-100 flex px-30 items-center">
            <div className="w-[50%] flex justify-center">
              logo
              <img src="" alt="logo" />
            </div>
            <div className="bg-sky-100/10 backdrop-blur-2xl w-full absolute right-30 max-w-md rounded-xl shadow-xl p-8 border-2 border-sky-200/30">

                <h1 className="text-2xl font-bold text-center text-blue-600">
                    Document Approval System
                </h1>

                {error && (
                    <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 text-sm font-semibold rounded-lg text-center">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 mt-8"
                >

                    <div>

                        <div className="grid grid-cols-2 gap-2 mt-2">

                            <button
                                type="button"
                                onClick={() => setRole("Admin")}
                                className={`py-2 rounded-lg transition cursor-pointer ${
                                    role === "Admin"
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-200"
                                }`}
                            >
                                Admin
                            </button>

                            <button
                                type="button"
                                onClick={() => setRole("Employee")}
                                className={`py-2 rounded-lg transition cursor-pointer ${
                                    role === "Employee"
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-200"
                                }`}
                            >
                                Employee
                            </button>

                        </div>

                    </div>


                    <div>

                        <label className="font-semibold">

                            {role === "Admin"
                                ? "Email"
                                : "Email / Employee ID"}

                        </label>

                        <input
                            type="text"
                            name="login"
                            value={formData.login}
                            onChange={handleChange}
                            placeholder={
                                role === "Admin"
                                    ? "Enter Email"
                                    : "Enter Email or Employee ID"
                            }
                            className="w-full bg-gray-300 rounded-lg shadow-xl px-4 py-3 mt-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />

                    </div>

                    <div>

                        <label className="font-semibold">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter Password"
                            className="w-full bg-gray-300 shadow-xl rounded-lg px-4 py-3 mt-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-500 hover:bg-green-700 cursor-pointer text-white py-3 rounded-lg font-semibold transition"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

                {/* Quick Demo Credentials */}
                <div className="mt-6 pt-5 border-t border-slate-200">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-center mb-3">
                        ⚡ One-Click Demo Credentials
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                setRole("Admin");
                                setFormData({ login: "admin@company.com", password: "Admin@123" });
                                if (error) setError("");
                            }}
                            className="p-2.5 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 rounded-lg text-left transition cursor-pointer group"
                        >
                            <div className="text-xs font-bold text-indigo-700 group-hover:text-indigo-900">
                                👑 Demo Admin
                            </div>
                            <div className="text-[11px] text-indigo-600 truncate mt-0.5">
                                admin@company.com
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setRole("Employee");
                                setFormData({ login: "sondipkumar@gmail.com", password: "Hablu@1son" });
                                if (error) setError("");
                            }}
                            className="p-2.5 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-lg text-left transition cursor-pointer group"
                        >
                            <div className="text-xs font-bold text-emerald-700 group-hover:text-emerald-900">
                                👤 Demo Employee
                            </div>
                            <div className="text-[11px] text-emerald-600 truncate mt-0.5">
                                sondipkumar@gmail.com
                            </div>
                        </button>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default Login;