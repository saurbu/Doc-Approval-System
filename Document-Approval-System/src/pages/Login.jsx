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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault()

        setLoading(true)

        try {

            let url = "";
            let payload = {};
            if (role === "Admin") {

                url = "http://localhost:3000/api/admin/login"

                payload = {
                    email: formData.login,
                    password: formData.password
                };
            }
            else {

                url = "http://localhost:3000/api/admin/employee-login"

                const isEmail = formData.login.includes("@")

                payload = {
                    email: isEmail ? formData.login : "",
                    empId: isEmail ? "" : formData.login,
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
            console.log(err.response)

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

            </div>

        </div>
    );
};

export default Login;