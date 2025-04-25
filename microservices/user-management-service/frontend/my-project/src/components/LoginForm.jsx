import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; // Importing eye icons

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false); // To toggle visibility of password
  const [emailError, setEmailError] = useState(""); // Email error state
  const [passwordError, setPasswordError] = useState(""); // Password error state

  // Regular expression for email validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate email format and password strength
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    }

    // Clear error messages if validation passes
    setEmailError("");
    setPasswordError("");

    // Pass data to parent component
    onLogin(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-offWhite p-6 rounded-2xl shadow-md w-full max-w-md border-4 border-oliveGreen">
      <h2 className="text-5xl font-bold bg-gradient-to-r from-emerald-700 via-lime-500 to-green-800 bg-clip-text text-transparent font-kalnia text-center mb-4">BiteCloud</h2>

      <div className="mb-4">
        <label className="block text-lg mb-3 text-oliveGreen font-bold">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => !emailRegex.test(email) && setEmailError("Please enter a valid email address")}
          onFocus={() => setEmailError("")}
          className="w-full p-2 border border-softBeige rounded-lg focus:outline-none focus:ring-2 focus:ring-oliveGreen transition"
          placeholder="Enter your email"
          required
        />
        {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
      </div>

      <div className="mb-6 relative">
        <label className="block text-lg mb-3 text-oliveGreen font-bold">Password</label>
        <input
          type={passwordVisible ? "text" : "password"} // Toggle between text and password
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => password.length < 6 && setPasswordError("Password must be at least 6 characters long")}
          onFocus={() => setPasswordError("")}
          className="w-full p-2 pr-10 border border-softBeige rounded-lg focus:outline-none focus:ring-2 focus:ring-oliveGreen transition"
          placeholder="Enter your password"
          required
        />
        <span
          onClick={() => setPasswordVisible(!passwordVisible)} // Toggle password visibility
          className="absolute top-2/3 right-3 transform -translate-y-1/4 cursor-pointer text-oliveGreen"
        >
          {passwordVisible ? <AiOutlineEye size={24} /> : <AiOutlineEyeInvisible size={24} />}
        </span>
        {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
      </div>

      <button
         type="submit"
         className="w-full bg-darkGreen text-white py-4 rounded-xl hover:bg-oliveGreen transition text-2xl font-kalnia">
        Login
      </button>

      <p className="mt-4 text-center">
        Don't have an account?{" "}
        <a href="/register" className="text-oliveGreen font-bold hover:underline">
          Sign up!
        </a>
      </p>
    </form>
  );
}
