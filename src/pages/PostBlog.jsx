import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import the styles for the editor
import { marked } from 'marked'; // Import the marked library

async function createBlogPost(title, content, categories, author, img) {

  const GITHUB_API = 'https://api.github.com';
  const REPO_OWNER = 'Huzaifa-code';
  const REPO_NAME = 'ArabicPathwayBlogs';
  const BRANCH = 'main';
  const TOKEN = import.meta.env.VITE_GITHUB_TOKEN; // Store the token securely

  if (!TOKEN) {
    alert('GitHub token is missing. Please check your environment variable.');
    return;
  }

  const dateStr = new Date().toISOString().split("T")[0]; // Format as YYYY-MM-DD
  const path = `_posts/${dateStr}-${title.replace(/\s+/g, '-')}.md`;
  
  
  const markdownContent = content;

  const data = {
    message: `Add new blog post: ${title}`,
    content: btoa(unescape(encodeURIComponent(markdownContent))), 
    // content: btoa(unescape((markdownContent))), // Base64 encoded content
    branch: BRANCH,
  };

  //? this is Working 
  try {
    const response = await fetch(
      `${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );
  
    if (!response.ok) {
      throw new Error('Failed to create blog post');
    }
  
    return response.json();
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }

  
}

export default function PostBlog() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categories, setCategories] = useState([]); // Changed to an array for multiple categories
  const [author, setAuthor] = useState('Huzaifa Qureshi'); // Default author
  const [img, setImg] = useState(''); // Image URL

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategories((prev) => 
      prev.includes(value) ? prev.filter((cat) => cat !== value) : [...prev, value]
    );
  };

  const handleSubmit = async () => {
    try {
      // Convert HTML content to markdown
      const markdownContent = generateMarkdownContent(title, categories, author, img, content);
      await createBlogPost(title, markdownContent, categories.join(', '), author, img); // Join categories for markdown
      alert('Blog post created successfully!');
    } catch (error) {
      alert('Failed to create blog post');
      console.error("Error Submitting blog : ", error);
    }
  };

  const generateMarkdownContent = (title, categories, author, img, content) => {
    return `---
  layout: post
  title: "${title}"
  date: "${new Date().toISOString()}"
  categories: [${categories.join(', ')}]
  author: ${author}
  img: ${img}
  description: ""
---
    
${marked(content)}  // Convert HTML to markdown
    `;
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Create Blog Post</h1>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Content:</h2>
        <ReactQuill 
          value={content}
          onChange={setContent}
          className="border border-gray-300 rounded"
          modules={{
            toolbar: [
              [{ 'header': [1, 2, false] }],
              ['bold', 'italic', 'underline'],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              ['image', 'code-block'],
              ['clean'] // remove formatting button
            ],
          }}
        />
      </div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Select Categories:</h2>
        <div className="flex flex-col space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              value="Basic_nahw"
              checked={categories.includes("Basic_nahw")}
              onChange={handleCategoryChange}
              className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2">Basic_nahw</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              value="Basic_sarf"
              checked={categories.includes("Basic_sarf")}
              onChange={handleCategoryChange}
              className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2">Basic_sarf</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              value="Sarf"
              checked={categories.includes("Sarf")}
              onChange={handleCategoryChange}
              className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2">Sarf</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              value="Quran"
              checked={categories.includes("Quran")}
              onChange={handleCategoryChange}
              className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2">Quran</span>
          </label>
          {/* Add more categories as needed */}
        </div>
      </div>
      <input
        type="text"
        placeholder="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />
      <input
        type="text"
        placeholder="Image URL"
        value={img}
        onChange={(e) => setImg(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-600 transition duration-200"
      >
        Publish Blog Post
      </button>
    </div>
  );
}

