import { useState, useEffect, useRef } from "react";
import {
  FiHome, FiArrowDown, FiArrowUp, FiUser, FiSettings, FiLogOut,
  FiX, FiMail, FiLock, FiUser as FiUsername, FiImage
} from 'react-icons/fi';
import axios from 'axios';

const api_base_url = 'https://newsflashlatest.onrender.com';
let currentUser = false;

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [userModal, setUserModal] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({
    email: '',
    username: '',
    password: '',
    profilePic: null,
    agreeToPolicy: false
  });
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const modalRef = useRef(null);
  const initialFocusSet = useRef(false);
  const isLoginModal = showLogin;
  const isSignupModal = showSignup;

  const mockLogin = async (credentials) => {
    try {
      if (credentials.email && credentials.password) {
        const response = await axios.post(`${api_base_url}/api/login`, credentials);
        const data = response.data;
        currentUser = true;
        return data;
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const mockSignup = async (data) => {
    try {
      if (data.email && data.username && data.password) {
        const response = await axios.post(`${api_base_url}/api/register`, data);
        const details = response.data;
        currentUser = true;
        return details;
      } else {
        throw new Error('Missing required fields');
      }
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    setAuthSuccess('');

    try {
      const response = await mockLogin(loginForm);
      if(!response) throw "Invalid Credentials";
      localStorage.setItem('newsflashuser', response.token);
      setUser(response.user);
      currentUser = true;
      setIsLoggedIn(true);
      setShowLogin(false);
      setAuthSuccess("User Successfully Logged In");
    } catch (error) {
      setAuthError(error);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    setAuthSuccess('');

    try {
      const response = await mockSignup(signupForm);
      if(!response) throw "User Already Registered Log In";
      localStorage.setItem('newsflashuser', response.token);
      currentUser = true;
      setUser(response.user);
      setIsLoggedIn(true);
      setShowSignup(false);
      setAuthSuccess("User Successfully Registered");
    } catch (error) {
      setAuthError(error || 'Signup failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('newsflashuser');
    currentUser = false;
    setUser({});
    setIsLoggedIn(false);
    setUserModal(false);
  };

  // Close modals when clicking outside (custom handler)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!modalRef.current) return;

      const overlay = modalRef.current.parentElement;
      const isOutsideModal = !modalRef.current.contains(e.target) && e.target === overlay;

      // Only close if clicking on the overlay background
      if (isOutsideModal) {
        setShowLogin(false);
        setShowSignup(false);
      }

      // Don't focus if clicking on inputs or buttons
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') {
        return;
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Tab key navigation within modal
  useEffect(() => {
    const handleTabKey = (e) => {
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, input, [tabindex]:not([tabindex="-1"])'
        );

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (!focusableElements.length) return;

        if (e.shiftKey) {
          if (e.target === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (e.target === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, []);

  // Clear error message and set initial focus when modal opens
  useEffect(() => {
    if ((showLogin || showSignup) && !initialFocusSet.current) {
      setAuthError('');
      initialFocusSet.current = true;

      setTimeout(() => {
        const firstInput = document.querySelector('.modal-content input');
        if (firstInput) {
          firstInput.focus();
          firstInput.select();
        }
      }, 100);
    }

    return () => {
      initialFocusSet.current = false;
    };
  }, [showLogin, showSignup]);

  // Existing user check
  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem('newsflashuser');
      if (!token) return;

      try {
        const response = await axios.get(`${api_base_url}/user`, {
          headers: {
            "Authorization" : `Bearer ${token}`
          }
        });
        if(!response.data) throw "No user found";
        let User = await response.data;
        currentUser = true;
        setUser(User);
        setIsLoggedIn(true);
      } catch (error) {
        localStorage.removeItem('newsflashuser');
        console.log(error)
      }
    };
    getUser();
  }, []);

  return (
    <header className="bg-teal-600 shadow-md">
      <div className="flex justify-between p-4 mx-auto">
        <h1 className="text-md md:text-xl text-white font-bold">NewsFlashLatest</h1>
        <nav className="flex flex-row transition space-x-4">
          {isLoggedIn ? (
            <div className='flex items-center'>
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt={user.userName}
                  className="w-8 h-8 rounded-full outline outline-yellow-800 object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-teal-400 flex items-center justify-center text-white font-bold">
                  {user.username?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
              {userModal ? (
                <>
                  <FiArrowUp
                    onClick={() => setUserModal(false)}
                    className="ml-2 text-white cursor-pointer"
                  />
                  <div className="fixed bg-white top-16 right-4 shadow-md shadow-black/10 flex flex-col mx-auto my-6 rounded-md min-w-40 items-start z-40">
                    <div className="flex flex-start item-start w-full text-sm rounded-t-md text-black hover:bg-gray-100 transition duration-300 py-2 px-6">
                      <FiUser className="mr-2" /> Profile
                    </div>
                    <div className="flex flex-start item-start w-full text-sm text-black hover:bg-gray-100 transition duration-300 py-2 px-6">
                      <FiSettings className="mr-2" /> Settings
                    </div>
                    <div
                      onClick={handleLogout}
                      className="flex flex-start item-start w-full text-sm rounded-b-md text-black hover:bg-gray-100 transition duration-300 py-2 px-6 cursor-pointer"
                    >
                      <FiLogOut className="mr-2" /> Logout
                    </div>
                  </div>
                </>
              ) : (
                <FiArrowDown
                  onClick={() => setUserModal(true)}
                  className="ml-2 text-white cursor-pointer"
                />
              )}
            </div>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={() => setShowLogin(true)}
                className="px-3 py-1 sm:px-1 rounded-md bg-white hover:underline font-bold font-mono text-sm shadow hover:bg-gray-100 transition duration-300 text-teal-600"
              >
                Login
              </button>
              <button
                onClick={() => setShowSignup(true)}
                className="px-3 py-1 rounded-md bg-white hover:underline font-bold font-mono text-sm shadow hover:bg-gray-100 transition duration-300 text-teal-600"
              >
                Sign Up
              </button>
            </div>
          )}
          <a className="flex text-white text-sm items-center md:text-md hover:text-gray-600 hover:underline transition" href="/">
            <FiHome className="m-[3px]" /> home
          </a>
        </nav>
      </div>

      {/* Login Modal */}
      {isLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 animate-fadeIn">
          <div
            ref={modalRef}
            className="modal-content bg-white rounded-lg shadow-xl w-full max-w-md p-6 transform transition-all duration-300 scale-95 focus:outline-none"
            tabIndex="-1"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-teal-700">Login</h2>
              <button
                onClick={() => { setShowLogin(false); setAuthError(''); }}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <FiX size={24} />
              </button>
            </div>

            {authError && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded">
                <p>{authError}</p>
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    required
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    required
                    minLength={6}
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className={`w-full py-2 px-4 rounded-lg text-white font-medium transition-all ${authLoading
                    ? 'bg-teal-400 cursor-not-allowed'
                    : 'bg-teal-600 hover:bg-teal-700'
                    } flex items-center justify-center`}
                >
                  {authLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Logging in...
                    </>
                  ) : (
                    'Login'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setShowLogin(false);
                  setShowSignup(true);
                  setAuthError('');
                }}
                className="text-teal-600 hover:text-teal-800 text-sm font-medium transition"
              >
                Need an account? Sign up
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sign Up Modal */}
      {isSignupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 animate-fadeIn">
          <div
            ref={modalRef}
            className="modal-content bg-white rounded-lg shadow-xl w-full max-w-md p-6 transform transition-all duration-300 scale-95 focus:outline-none"
            tabIndex="-1"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-teal-700">Sign Up</h2>
              <button
                onClick={() => { setShowSignup(false); setAuthError(''); }}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <FiX size={24} />
              </button>
            </div>

            {authError && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded">
                <p>{authError}</p>
              </div>
            )}
            {authSuccess && (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 mb-4 rounded">
                <p>{authSuccess}</p>
              </div>
            )}

            <form onSubmit={handleSignup}>
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                    required
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUsername className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Username"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={signupForm.username}
                    onChange={(e) => setSignupForm({ ...signupForm, username: e.target.value })}
                    required
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                    required
                    minLength={6}
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={signupForm.agreeToPolicy}
                      onChange={(e) => setSignupForm({ ...signupForm, agreeToPolicy: e.target.checked })}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                      required
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      I agree to the Terms and Privacy Policy
                    </span>
                  </label>
                </div>

                <div className="pt-2">
                  <label className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition">
                    <FiImage className="mr-2" />
                    <span>Upload Profile Picture</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => setSignupForm({ ...signupForm, profilePic: e.target.files[0] })}
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={authLoading || !signupForm.agreeToPolicy}
                  className={`w-full py-2 px-4 rounded-lg text-white font-medium transition-all ${authLoading
                    ? 'bg-teal-400 cursor-not-allowed'
                    : 'bg-teal-600 hover:bg-teal-700'
                    } flex items-center justify-center`}
                >
                  {authLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing up...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setShowSignup(false);
                  setShowLogin(true);
                  setAuthError('');
                }}
                className="text-teal-600 hover:text-teal-800 text-sm font-medium transition"
              >
                Already have an account? Login
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
export const getUserStatus = async () => {
  return await currentUser;
};