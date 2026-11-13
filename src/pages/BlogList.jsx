import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getBlogs } from "../services/blogService";
import { useNavigate } from "react-router-dom";

function BlogList() {
  const { user } = useContext(AuthContext);

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const data = await getBlogs(user.uid);
        setBlogs(data);
      } catch (error) {
        console.error("Firestore Error Code:", error.code);
        console.error("Firestore Error Message:", error.message);

        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBlogs();
    }
  }, [user]);

  if (loading) return <p>Loading blogs...</p>;

  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>My Blogs</h1>
      <button onClick={() => navigate("/add-blog")}>+ Add New Blog</button>
      {blogs.length === 0 ? (
        <p>You haven't added any blogs yet.</p>
      ) : (
        blogs.map((blog) => (
          <div key={blog.id}>
            <h2>{blog.title}</h2>
            <p>{blog.content}</p>
            <button onClick={() => navigate(`/edit-blog/${blog.id}`)}>
              Edit
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default BlogList;
