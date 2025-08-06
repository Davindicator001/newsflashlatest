import Header from '../components/header';
import Footer from '../components/footer';
import React, { useEffect, useState } from "react";
import { FiThumbsUp, FiMessageSquare, FiShare2, FiBookmark } from 'react-icons/fi';
import axios from 'axios';
const API_BASE_URL = "https://newsflashlatest.onrender.com";

function Home() {
  const [blogData, setBlogData] = useState([]);
  const [activeTab, setActiveTab] = useState('latest');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchBlogData = async () => {
      const response = await axios.get(`${API_BASE_URL}/posts`);
      setBlogData(response.data);
    };
    fetchBlogData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Blog Posts</h1>

        {/* Tabs */}
        <section className="flex mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('latest')}
            className={`px-4 py-2 font-medium text-sm rounded-t-lg transition duration-300 ${activeTab === 'latest' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Latest
          </button>
          <button
            onClick={() => setActiveTab('popular')}
            className={`px-4 py-2 font-medium text-sm rounded-t-lg transition duration-300 ${activeTab === 'popular' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Popular
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-2 font-medium text-sm rounded-t-lg transition duration-300 ${activeTab === 'saved' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Saved
          </button>
        </section>

        {/* Blog Posts */}
        <section className="space-y-6">
          {blogData.length > 0 ? blogData.map((blog) => (
            <article
              key={blog.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
              itemScope
              itemType="https://schema.org/BlogPosting"
            >
              <meta itemProp="url" content={`https://newsflashlatest.onrender.com/blog?blog-id=${blog.id}`} />
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img
                    src={blog.post_thumbnail}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 md:w-2/3">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{blog.title}</h2>
                  <p className="text-gray-600 mb-4">{blog.excerpt}</p>

                  <div className="flex items-center justify-between">
                    <a
                      href={`/blog?blog-id=${blog.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      Read more
                    </a>

                    <div className="flex space-x-4 text-gray-500">
                      <div className="flex items-center space-x-1">
                        <FiThumbsUp className="text-blue-500" />
                        <span>{blog.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FiMessageSquare className="text-blue-500" />
                        <span>{blog.comments}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FiShare2 className="text-blue-500" />
                        <span>{blog.shares}</span>
                      </div>
                      <div
                        onClick={() => setIsSaved(!isSaved)}
                        className="flex items-center space-x-1"
                      >
                        <FiBookmark className={`hover:text-blue-600 ${isSaved ? 'fill-current text-blue-600': 'text-gray-200'} `} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          )): <p>Fetching Posts...</p>}
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Home;