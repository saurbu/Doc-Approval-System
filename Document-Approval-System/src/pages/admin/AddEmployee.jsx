import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserPlus, CheckCircle2, AlertCircle, Sparkles, Building2, Phone, Mail, User, ShieldCheck } from "lucide-react";

const AddEmployee = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [add, setAdd] = useState(false);
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

  const showToast = (type, message, details = "") => {
    setToast({ type, message, details });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAdd(true);
    setError("");

    if (formData.number.length < 10) {
      setError("Mobile number must be at least 10 digits.");
      showToast("error", "Invalid Mobile Number", "Mobile number must be at least 10 digits.");
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

      const createdEmpId = formData.empId;
      showToast("success", "Employee Added Successfully!", `Generated ID: ${createdEmpId} • Login credentials dispatched via email.`);
      
      setFormData({
          name: "",
          email: "",
          role: "",
          number: "",
          empId: "",
          department: "",
      });
      generateEmpId();
    } catch (err) {
      const errMsg = err.response?.data?.message || "Failed to create employee.";
      setError(errMsg);
      showToast("error", "Creation Failed", errMsg);
    } finally {
      setAdd(false);
    }
  }

  return (
    <div className="p-6 relative min-h-screen bg-slate-50">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-start gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-md transition-all duration-300 transform translate-y-0 animate-bounce-short ${
          toast.type === "success" 
            ? "bg-emerald-950/90 text-emerald-200 border-emerald-500/30" 
            : "bg-rose-950/90 text-rose-200 border-rose-500/30"
        }`}>
          {toast.type === "success" ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
          )}
          <div>
            <h4 className="font-semibold text-sm text-white">{toast.message}</h4>
            {toast.details && <p className="text-xs opacity-80 mt-0.5">{toast.details}</p>}
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Form Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-8 border border-slate-200/80 shadow-xl shadow-slate-200/50">
          <div className="flex items-center gap-3 pb-6 mb-6 border-b border-slate-100">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Add New Team Member</h1>
              <p className="text-sm text-slate-500">Create credentials and assign departmental roles</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    name="name"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm text-slate-800"
                    placeholder="Saurav Sharma"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    name="email"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm text-slate-800"
                    placeholder="official@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  System Role
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm text-slate-800 appearance-none"
                    required
                  >
                    <option value="" disabled>Select System Role</option>
                    <option value="Employee">Employee</option>
                    <option value="Manager">Manager</option>
                  </select>
                </div>
              </div>

              {/* Phone Number with Country Code */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Phone Number
                </label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-32 py-2.5 px-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="+880">🇧🇩 +880 (BD)</option>
                    <option value="+91">🇮🇳 +91 (IN)</option>
                    <option value="+1">🇺🇸 +1 (US)</option>
                    <option value="+44">🇬🇧 +44 (UK)</option>
                    <option value="+61">🇦🇺 +61 (AU)</option>
                    <option value="+49">🇩🇪 +49 (DE)</option>
                    <option value="+33">🇫🇷 +33 (FR)</option>
                    <option value="+81">🇯🇵 +81 (JP)</option>
                    <option value="+86">🇨🇳 +86 (CN)</option>
                    <option value="+971">🇦🇪 +971 (UAE)</option>
                    <option value="+966">🇸🇦 +966 (KSA)</option>
                    <option value="+65">🇸🇬 +65 (SG)</option>
                  </select>
                  <div className="relative flex-1">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      name="number"
                      placeholder="01700000000"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm text-slate-800"
                      value={formData.number}
                      onChange={handleChange}
                      maxLength={11}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Employee ID (Auto Generated) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  System Employee ID
                </label>
                <input
                  type="text"
                  name="empId"
                  value={formData.empId || "Auto-generating..."}
                  className="w-full px-4 py-2.5 bg-indigo-50/50 border border-indigo-100 rounded-xl font-mono font-bold text-indigo-600 cursor-not-allowed outline-none text-sm"
                  readOnly
                />
              </div>

              {/* Department */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Department
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm text-slate-800 appearance-none"
                    required
                  >
                    <option value="" disabled>Assign Department</option>
                    <option value="MERN">MERN Stack</option>
                    <option value="WEB">Web Development</option>
                    <option value="AI/ML">AI & Machine Learning</option>
                    <option value="HR">Human Resources (HR)</option>
                    <option value="FINANCE">Finance</option>
                    <option value="MARKETING">Marketing</option>
                    <option value="DESIGN">UI/UX Design</option>
                    <option value="OPERATIONS">Operations</option>
                  </select>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={add}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer text-sm"
              >
                {add ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Registering Account...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Add Employee to System</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Info Panel */}
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-8 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 opacity-10">
            <Sparkles className="w-64 h-64 text-white" />
          </div>

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-medium text-indigo-200 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Enterprise Onboarding System</span>
            </div>

            <h2 className="text-xl font-bold text-white mb-3">Seamless Employee Access Management</h2>
            <p className="text-xs text-indigo-200/80 leading-relaxed space-y-2">
              Adding a team member automatically generates system-backed access rights and triggers encrypted credential generation.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-white">Auto Role-Based Privileges</h4>
                  <p className="text-[11px] text-indigo-200/60 mt-0.5">Assigned roles grant scoped API authorizations dynamically.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                <Mail className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-white">Instant Welcome Email</h4>
                  <p className="text-[11px] text-indigo-200/60 mt-0.5">Encrypted temporary login link is dispatched automatically.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs text-indigo-300/60">
            <span>Doc Approval Admin Hub</span>
            <span className="font-mono">v2.4.0</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AddEmployee;