import { useState } from 'react';
import { PenLine, User, Image, Tags, Send } from 'lucide-react'
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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Create Blog Post</h1>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <div className="relative">
                <PenLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  id="title"
                  placeholder="Enter post title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className='h-[400px]'>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <ReactQuill 
                value={content}
                onChange={setContent}
                className="bg-white rounded-md border border-gray-300 h-[80%]"
                modules={{
                  toolbar: [
                    [{ 'header': [1, 2, false] }],
                    ['bold', 'italic', 'underline'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    ['image', 'code-block'],
                    ['clean']
                  ],
                }}
              />
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                <Tags className="mr-2 text-gray-600 w-5 h-5" />
                Select Categories
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {['Basic_nahw', 'Basic_sarf', 'Sarf', 'Quran'].map((category) => (
                  <label key={category} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={categories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">Author</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  id="author"
                  placeholder="Enter author name"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <div className="relative">
                <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  id="image"
                  placeholder="Enter Thumbnail Image URL"
                  value={img}
                  onChange={(e) => setImg(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-black text-white font-semibold py-2 px-4 rounded-md hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 flex items-center justify-center"
            >
              <Send className="mr-2 w-5 h-5" />
              Publish Blog Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

