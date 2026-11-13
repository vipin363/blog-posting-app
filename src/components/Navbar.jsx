import { AuthContext } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { toast } from "react-toastify";
import { useContext, useState, useEffect } from "react";

function Navbar() {
  const { user, loading } = useContext(AuthContext);

  
  const handleLogout = () => {
  toast.info(
    <div>
      <p>Are you sure you want to logout?</p>

      <button
        className="toast-confirm-btn"
        onClick={confirmLogout}
      >
        Yes, Logout
      </button>

      <button
        className="toast-cancel-btn"
        onClick={() => toast.dismiss()}
      >
        Cancel
      </button>
    </div>,
    {
      autoClose: false,
      closeOnClick: false,
      draggable: false
    }
  );
};

const confirmLogout = async () => {
  toast.dismiss();

  try {
    await signOut(auth);
    toast.success("Logged out successfully!");
  } catch (error) {
    toast.error(error.message);
  }
};

const [darkMode, setDarkMode] = useState(() => {
  return localStorage.getItem("theme") === "dark";
});

useEffect(() => {
  document.body.classList.toggle("dark-mode", darkMode);

  localStorage.setItem(
    "theme",
    darkMode ? "dark" : "light"
  );
}, [darkMode]);

if (loading) {
  return <p>Loading...</p>;
}
  return (
    <nav className="navbar">
      <h2 className="navbar-logo">Blog</h2>

      {user ? (<>
        <p>Welcome, {user.displayName || "User"}</p>
        <button
  className="theme-toggle-btn"
  onClick={() => setDarkMode((prev) => !prev)}
>
  {darkMode ? "Light" : "Dark"}
</button>
        <button className="logout-btn"  onClick={handleLogout}>Logout</button>
    </>
      ) : (
  <p>
    {window.location.pathname === "/register"
      ? "Please Register"
      : "Please Login"}
  </p>
)}
    </nav>
  );
}

export default Navbar;
