
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
  addDoc,
  serverTimestamp
} from "firebase/firestore";

import { db } from "../firebase/firebaseConfig";

// Fetch logged-in user's blogs
export const getBlogs = async (userId) => {
  const blogsRef = collection(db, "blogs");

  const q = query(
    blogsRef,
    where("authorId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Add new blog
export const addBlog = async (blogData, userId) => {
  const blogsRef = collection(db, "blogs");

  // Check duplicate heading for the same user
  const q = query(
    blogsRef,
    where("authorId", "==", userId)
  );

  const snapshot = await getDocs(q);

  const isDuplicate = snapshot.docs.some((doc) => {
    return (
      doc.data().title.trim().toLowerCase() ===
      blogData.title.trim().toLowerCase()
    );
  });

  if (isDuplicate) {
    throw new Error("A blog with this heading already exists");
  }

  const docRef = await addDoc(blogsRef, {
    title: blogData.title.trim(),
    content: blogData.content.trim(),
    authorId: userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
};

