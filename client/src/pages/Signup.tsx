import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, CheckCircle } from "lucide-react";
import axios from "axios";

interface FormError {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Signup() {

  const API_URL = import.meta.env.VITE_API_URL;


  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormError>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<
    "weak" | "medium" | "strong" | null
  >(null);

  // Check password strength
  const checkPasswordStrength = (password: string) => {
    if (!password) return null;
    if (password.length < 8) return "weak";
    if (
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)
    ) return "strong";
    return "medium";
  };

  const validateForm = (): boolean => {
    const newErrors: FormError = {};

    // Full Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

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

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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

    // Update password strength
    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }

    // Clear error when user starts typing
    if (errors[name as keyof FormError]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/users/register`, formData)
      if (response.status === 201) {
        navigate("/login");
      }
    } catch (error) {
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
                <span className="text-3xl">✨</span>
              </div>
              <h1 className="text-3xl font-bold text-white">Create Account</h1>
            </div>
          </div>

          {/* Form Section */}
          <div className="px-6 py-8 max-h-[85vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-800 mb-2"
                >
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 text-purple-400" size={20} />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition duration-300 focus:outline-none ${errors.name
                      ? "border-red-400 bg-red-50 focus:border-red-500"
                      : "border-gray-200 bg-gray-50 focus:border-purple-500 focus:bg-white"
                      }`}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1.5">{errors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-800 mb-2"
                >
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
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-800 mb-2"
                >
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

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition ${passwordStrength === "weak"
                            ? i === 1
                              ? "bg-red-400"
                              : "bg-gray-300"
                            : passwordStrength === "medium"
                              ? i <= 2
                                ? "bg-yellow-400"
                                : "bg-gray-300"
                              : "bg-green-400"
                            }`}
                        ></div>
                      ))}
                    </div>
                    <p
                      className={`text-xs font-medium ${passwordStrength === "weak"
                        ? "text-red-500"
                        : passwordStrength === "medium"
                          ? "text-yellow-500"
                          : "text-green-500"
                        }`}
                    >
                      Password strength:{" "}
                      {passwordStrength?.charAt(0).toUpperCase() +
                        passwordStrength?.slice(1)}
                    </p>
                  </div>
                )}

                {errors.password && (
                  <p className="text-red-500 text-sm mt-1.5">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-gray-800 mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 text-purple-400" size={20} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 transition duration-300 focus:outline-none ${errors.confirmPassword
                      ? "border-red-400 bg-red-50 focus:border-red-500"
                      : formData.confirmPassword &&
                        formData.password === formData.confirmPassword
                        ? "border-green-400 bg-green-50 focus:border-green-500"
                        : "border-gray-200 bg-gray-50 focus:border-purple-500 focus:bg-white"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-purple-500 transition"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {formData.confirmPassword &&
                  formData.password === formData.confirmPassword && (
                    <p className="text-green-600 text-sm mt-1.5 flex items-center gap-1">
                      <CheckCircle size={16} /> Passwords match
                    </p>
                  )}
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1.5">
                    {errors.confirmPassword}
                  </p>
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
                className="w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold rounded-xl transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-6"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                  </div>
                ) : (
                  "Sign Up"
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

              {/* Log In Link */}
              <p className="text-center text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-yellow-500 font-bold hover:text-yellow-600 transition duration-300"
                >
                  Log In
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
