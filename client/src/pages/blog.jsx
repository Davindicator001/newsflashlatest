
import { useState, useEffect } from "react";
import Header from "../components/header";
import DOMPurify from 'dompurify';
import { FiHeart, FiArrowLeft, FiThumbsUp, FiX } from 'react-icons/fi';
import axios from 'axios';
import { getUserStatus } from "../components/header";

const API_BASE_URL = 'http://localhost:5000';

function Blog() {
  const [user, setUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [blogData, setBlogData] = useState({
    title: 'N/A',
    content: '<p>Unavailable</p>',
    isLiked: false,
    likes: 0,
    comments: [
      {
        id: 0,
        text: "N/A",
        author: "N/A",
        likes: 0,
        replies: [
          { id: 0, author: "N/A", text: "N/A", created_at: "N/A" }
        ],
        created_at: "N/A"
      }
    ]
  });
  const [newComment, setNewComment] = useState('');
  const [replyInput, setReplyInput] = useState({});
  const [expandedReplies, setExpandedReplies] = useState({});
  const [showError, setShowError] = useState(false);

  const getBlogId = () => {
    const search = new URLSearchParams(window.location.search);
    return search.get('blog-id');
  };

  // Modularized: fetch user info and set state
  const fetchUser = async () => {
    const token = localStorage.getItem('newsflashuser');
    if (!token) return null;
    try {
      const response = await axios.get(`${API_BASE_URL}/user`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.data) throw new Error("No user found");
      setUser(response.data);
      setIsLoggedIn(true);
      return response.data;
    } catch (error) {
      setIsLoggedIn(false);
      setUser({});
      return null;
    }
  };

  // Modularized: fetch blog data, needs user and isLoggedIn
  const fetchBlogData = async (userObj, loggedIn) => {
    const blogId = getBlogId();
    if (!blogId) {
      setError('No blog ID found in URL');
      setIsLoading(false);
      return;
    }
    try {
      let post_details = (await axios.get(`${API_BASE_URL}/posts/${blogId}`)).data;
      let post_comments = (await axios.get(`${API_BASE_URL}/posts/${blogId}/comments`)).data;
      let comment_replies = (await axios.get(`${API_BASE_URL}/posts/${blogId}/replies`)).data;

      let isLiked = false;
      //post_comments = post_comments.map(comment => comment.isLiked = false);
      if (loggedIn && userObj && userObj.id) {
        if (Array.isArray(post_details.user_liked) && post_details.user_liked.includes(userObj.id)) {
          isLiked = true;
        }
        post_comments = post_comments.map(comment => {
          const isLiked = Array.isArray(comment.user_liked) && comment.user_liked.includes(userObj.id);
          return {
            ...comment,
            isLiked
          };
        });
      }
      post_details = { ...post_details, isLiked };

      // Attach replies to comments
      const commentsWithReplies = post_comments.map(comment => {
        const repliesForComment = comment_replies.filter(
          reply => reply.comment_id === comment.id
        );
        return {
          ...comment,
          replies: repliesForComment || []
        };
      });

      setBlogData({
        ...post_details,
        comments: commentsWithReplies
      });
    } catch (err) {
      setError("Failed to load blog data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const loadAll = async () => {
      setIsLoading(true);
      const userObj = await fetchUser();
      if (isMounted) {
        await fetchBlogData(userObj, !!userObj);
      }
    };
    loadAll();
    return () => { isMounted = false; };
  }, []);

  // Add new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    const blogId = getBlogId();
    const newCommentData = {
      blog_post_id: blogId,
      text: newComment,
      author: user.username || "Anonymous",
      likes: 0,
      user_liked: [],
    };
    try{
      const success = await axios.post(`${API_BASE_URL}/posts/${blogId}/comment`, newCommentData);
      if(success.status == 200){
        setBlogData(prev => ({
          ...prev,
        comments: [{...newCommentData,replies:[]}, ...(prev.comments || [])]
        }));
        setNewComment('');
      }else throw "Unable to add comment";
    }catch(error){
      console.log(error);
      setShowError(true);
    }
  };

  // Add reply to comment
  const handleAddReply = async (commentId) => {
    const blog_id = getBlogId();
    const text = replyInput[commentId];
    if (!text?.trim()) return;
    const newReply = {
      blog_post_id: blog_id,
      comment_id: commentId,
      text,
      author: user.username || "Anonymous",
    };
    try{
      const success = await axios.post(`${API_BASE_URL}/posts/${commentId}/reply`, newReply);
      if(success.status == 200){
        setBlogData(prev => ({
          ...prev,
          comments: prev.comments.map(comment =>
            comment.id === commentId
              ? { ...comment, replies: [...(comment.replies || []), newReply] }
              : comment
          )
        }));
        setReplyInput(prev => ({ ...prev, [commentId]: '' }));
      }else throw "Unable to add reply";
    }catch(error){
      console.log(error);
    }
  };

  // Like/unlike blog post
  const handleLikeBlog = async () => {
    await fetchUser();
    if(getUserStatus()){
      setIsLoggedIn(true);
    }
    if (!isLoggedIn) {
      setShowError(true);
      return;
    }
    const blogId = getBlogId();
    try {
      const success = await axios.put(`${API_BASE_URL}/posts/${blogId}/${user.id}/like`);
      if (success) {
        setBlogData(prev => ({
          ...prev,
          isLiked: !prev.isLiked,
          likes: !prev.isLiked ? prev.likes + 1 : prev.likes - 1
        }));
      }
    } catch (err) {
      setShowError(true);
    }
  };

  // Toggle like for comment (local only)
  const toggleLike = async (commentId) => {
    await fetchUser();
    if(!isLoggedIn){
      setShowError(true);
      return;
    }
    try{
      const success = await axios.put(`${API_BASE_URL}/comments/${commentId}/${user.id}/like`);
      if(success.status == 200){
        setBlogData(prev => ({
          ...prev,
          comments: prev.comments.map(comment =>
            comment.id === commentId
            ? {
              ...comment,
              isLiked: !comment.isLiked,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
            }
            : comment
          )
        }));
      }else throw "Unable to like comment"
    }catch(error){
      console.log(error);
    }
    };
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header/>
      {showError && (
        <div className="flex justify-center left-[50%] top-[10px] translate-x-[-50%] fixed mt-6 z-100 w-auto bg-white shadow rounded hover:shadow-md">
          <FiX 
          className="flex text-md p-2"
          size={40}
          onClick = {()=> setShowError(false)} /><br></br>
          <p className="font-bold text-md p-2">You must be logged in to use this feature</p>
        </div>
      )}
      <section className="z-0 max-w-4xl mx-auto mt-6 p-4 bg-white rounded-lg shadow-md">
        {/* Featured Image its unique so i guess its not gonna match the post */}
        <div className="relative h-48 z-1 bg-slate-200 rounded-lg overflow-hidden mb-6">
          <img 
            src={`https://picsum.photos/seed/${getBlogId()}/1200/400`} 
            alt="Blog feature" 
            className="w-full h-full object-cover mix-blend-multiply"
          />
        </div>
        <div className="flex justify-between">
        <a
          href="/"
          className="flex-start text-blue-600 hover:text-blue-800 underline mb-4 inline-flex items-center"
          >
          <FiArrowLeft size={25}/>
          Back to news
        </a>
        <button className="flex"
        onClick={async ()=>{await handleLikeBlog()}}>
          <FiThumbsUp size={25} className={`w-5 h-5 mr-1 ${blogData.isLiked ? 'text-blue-500 fill-current' : ''}`}/>
          {blogData.likes}
        </button>
        </div>
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>{error}</p>
          </div>
        )}
        
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 leading-tight">
          {isLoading ? 'Loading...' : blogData.title || 'Untitled Article'}
        </h2>
        
        <div className="text-sm text-gray-500 mb-6">
          {isLoading ? 'Published • Author' : 'Published April 5, 2025 • DavinDicator'}
        </div>
        
        <div className="prose prose-blue max-w-none prose-img:rounded-lg prose-strong:text-indigo-600">
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[200px] py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div 
            dangerouslySetInnerHTML={{ __html:blogData.content }} 
            className="blog-content prose-img:rounded-lg first-letter:text-7xl first-letter:float-left first-letter:mr-3 first-letter:text-blue-600 first-letter:font-bold"
            />
          )}
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-800">
              {blogData.comments ? blogData.comments.length : 0} Comment{blogData.comments && blogData.comments.length !== 1 ? 's' : ''}
            </h3>
            <span className="text-sm text-gray-500">Sorted by newest</span>
          </div>
          
          {/* New comment input */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Add your comment</label>
            <div className="flex gap-3">
              <input 
                type="text" 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="What are your thoughts?" 
                className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              <button 
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  newComment.trim()
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                >
                Post
              </button>
            </div>
          </div>
          
          {/* Comments list */}
          {blogData.comments.length > 0 ? (
            <div className="space-y-4">
              {blogData.comments.map((comment) => (
                <div key={comment.id} className="p-4 border border-gray-200 rounded-lg bg-gradient-to-br from-white to-blue-50">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-gray-800">{comment.author}</span>
                    <span className="text-sm text-gray-500">
                    {comment.created_at && comment.created_at !== "N/A" ? new Date(comment.created_at).toLocaleDateString() : new Date().toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className="mb-4 text-gray-700">{comment.text}</p>
                  
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => toggleLike(comment.id)}
                      className="flex items-center text-sm text-gray-500 hover:text-blue-500 transition-colors"
                    >
                      <FiHeart className={`w-5 h-5 mr-1 ${comment.isLiked ? 'text-blue-500 fill-current' : ''}`}/>
                      {comment.likes}
                    </button>
                    
                    <button 
                      onClick={() => setExpandedReplies({
                        ...expandedReplies, 
                        [comment.id]: !expandedReplies[comment.id]
                      })}
                      className="text-sm text-gray-500 hover:text-blue-500 transition-colors"
                      >
                      {comment.replies.length > 0 
                        ? `${comment.replies.length} Reply${comment.replies.length > 1 ? 's' : ''}` 
                        : 'Reply'}
                    </button>
                  </div>
                  
                  {/* Replies section */}
                  {expandedReplies[comment.id] && (
                    <div className="mt-4 ml-6 border-l-2 border-gray-200 pl-4">
                      {comment.replies.map(reply => (
                        <div key={reply.id} className="mb-3">
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-800">{reply.author}</span>
                          </div>
                          <p className="text-gray-700">{reply.text}</p>
                        </div>
                      ))}
                      
                      {/* Reply input */}
                      <div className="mt-3">
                        <input
                          type="text"
                          value={replyInput[comment.id] || ''}
                          onChange={(e) => setReplyInput({
                            ...replyInput,
                            [comment.id]: e.target.value
                          })}
                          placeholder="Write a reply..."
                          className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                        />
                        <button
                          onClick={() => handleAddReply(comment.id)}
                          className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Post Reply
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default Blog;