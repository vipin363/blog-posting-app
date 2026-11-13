import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


function Login() {
   const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      formData.email.trim(),
      formData.password
    );

    console.log("Logged in user:", userCredential.user);

    toast.success("Login successful!");

    setFormData({
      email: "",
      password: ""
    });

navigate('/')

  } catch (error) {
    console.error(error);

    if (
      error.code === "auth/invalid-credential" ||
      error.code === "auth/user-not-found" ||
      error.code === "auth/wrong-password"
    ) {
      toast.error("Invalid email or password!");
    } else {
      toast.error(error.message);
    }
  }
};

 
return (
  <div className="auth-container">
    <div className="auth-card">
      <h1 className="auth-title">Welcome Back</h1>
      <p className="auth-subtitle">Login to your account</p>

      <form onSubmit={handleSubmit}>

        <label>Email Address</label>
        <input
          className="auth-input"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Password</label>
        <input
          className="auth-input"
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button className="auth-btn" type="submit">
          Login
        </button>

        <p className="auth-link">
  Don't have an account? <Link to="/register">Sign up</Link>
</p>

      </form>
    </div>
  </div>
);

}

export default Login;
