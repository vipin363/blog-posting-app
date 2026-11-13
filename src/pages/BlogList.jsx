import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getBlogs, deleteBlog } from "../services/blogService";
import { toast } from "react-toastify";

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

  const handleDelete = (blogId) => {
  toast.info(
    <div>
      <p>Are you sure you want to delete this blog?</p>

      <button
        onClick={() => confirmDelete(blogId)}
      >
        Confirm Delete
      </button>

      <button onClick={() => toast.dismiss()}>
        Cancel
      </button>
    </div>,
    {
      autoClose: false,
      closeOnClick: false,
      draggable: false,
    }
  );
};

const confirmDelete = async (blogId) => {
  toast.dismiss();

  try {
    await deleteBlog(blogId, user.uid);

    setBlogs((prevBlogs) =>
      prevBlogs.filter((blog) => blog.id !== blogId)
    );

    toast.success("Blog deleted successfully!");
  } catch (error) {
    console.error("Delete error:", error);
    toast.error(error.message || "Failed to delete blog");
  }
};

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
            <button onClick={() => handleDelete(blog.id)}>
  Delete
</button>
          </div>
        ))
      )}
    </div>
  );
}

export default BlogList;
