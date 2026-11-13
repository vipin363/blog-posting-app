
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { toast } from "react-toastify";


function Navbar() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <p>Loading...</p>;
  }

  const handleLogout = async () => {
  try {
    await signOut(auth);
    toast.success("Logged out successfully!");
  } catch (error) {
    toast.error(error.message);
  }
};

  return (
    <nav>
      <h2>My Blog</h2>

      {user ? (<>
        <p>Welcome, {user.email}</p>
        <button onClick={handleLogout}>Logout</button>
    </>
      ) : (
        <p>Please Login</p>
      )}
    </nav>
  );
}

export default Navbar;
