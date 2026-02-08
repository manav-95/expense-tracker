import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import axios from "axios";

import { useAuth } from '../hooks/useAuthHook'

interface FormError {
  email?: string;
  password?: string;
  general?: string;
}

export default function Login() {

  const { setLoggedIn, setUser } = useAuth()

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormError>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormError = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormError]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/users/login`, formData)
      if (response.status === 200) {
        setLoggedIn(true);
        setUser(response?.data?.user || null)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        navigate("/dashboard");
      }
    } catch (error) {
      setLoggedIn(false);
      setUser(null)
      setErrors({
        general:
          error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header Section with Purple Background */}
          <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 px-6 py-8 relative">
            <div className="absolute top-4 right-4 w-16 h-16 bg-yellow-400 rounded-full opacity-20"></div>
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg mb-4">
                <span className="text-3xl">👤</span>
              </div>
              <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
            </div>
          </div>

          {/* Form Section */}
          <div className="px-6 py-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 text-purple-400" size={20} />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition duration-300 focus:outline-none ${errors.email
                      ? "border-red-400 bg-red-50 focus:border-red-500"
                      : "border-gray-200 bg-gray-50 focus:border-purple-500 focus:bg-white"
                      }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1.5">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 text-purple-400" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 transition duration-300 focus:outline-none ${errors.password
                      ? "border-red-400 bg-red-50 focus:border-red-500"
                      : "border-gray-200 bg-gray-50 focus:border-purple-500 focus:bg-white"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-purple-500 transition"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1.5">{errors.password}</p>
                )}
              </div>

              {/* General Error */}
              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{errors.general}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold rounded-xl transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                  </div>
                ) : (
                  "Log In"
                )}
              </button>

              {/* Divider */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>

              {/* Sign Up Link */}
              <p className="text-center text-gray-600">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="text-yellow-500 font-bold hover:text-yellow-600 transition duration-300"
                >
                  Sign Up
                </button>
              </p>
            </form>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-6">
          <p className="text-purple-100 text-sm">
            🔒 Your data is encrypted and secure
          </p>
        </div>
      </div>
    </div>
  );
}
