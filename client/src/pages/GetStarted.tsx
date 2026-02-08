import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function GetStarted() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-block mb-6">
            <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-4xl">💰</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Let's get started!
          </h1>
          <p className="text-purple-100 text-lg">
            Take control of your finances today
          </p>
        </div>

        {/* Illustration */}
        <div className="mb-12 flex justify-center">
          <div className="w-64 h-64 bg-white bg-opacity-10 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white border-opacity-20">
            <div className="text-center">
              <div className="text-6xl mb-4">👤</div>
              <p className="text-white text-sm">Ready to manage expenses</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => navigate("/signup")}
            className="w-full py-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-xl transition duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Sign Up
            <ArrowRight size={20} />
          </button>

          <div className="text-center">
            <p className="text-purple-100">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-yellow-400 font-bold hover:text-yellow-300 transition duration-300"
              >
                Log In
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-2 text-center">
          <p className="text-purple-200 text-sm">
            Secure • Fast • Easy to use
          </p>
        </div>
      </div>
    </div>
  );
}
