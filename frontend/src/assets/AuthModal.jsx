import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import Login from "./Login"; // Assuming you have a Login component
import Register from "./Register"; // Assuming you have a Register component

const AuthModal = ({ isOpen, onClose, initialMode = "login" }) => {
  // State to control which form is currently displayed (login or register)
  const [mode, setMode] = useState(initialMode);

  // useEffect hook to update the 'mode' state whenever the 'initialMode' prop changes.
  // This is crucial because the 'initialMode' prop might change while the modal is already open
  // (e.g., if a user clicks 'Sign Up' after having opened the modal for 'Sign In').
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]); // Dependency array: this effect runs only when 'initialMode' changes

  // If the modal is not open, don't render anything
  if (!isOpen) {
    return null;
  }

  // Handler to switch the modal content to the Login form
  const handleSwitchToLogin = () => setMode("login");

  // Handler to switch the modal content to the Register form
  const handleSwitchToRegister = () => setMode("register");

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        {/* Backdrop: This creates the dimmed background and closes the modal when clicked outside */}
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal Content Container */}
        <div className="relative w-full max-w-md bg-gray-900 border border-purple-500/20 rounded-xl shadow-lg p-6 sm:p-8">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-700 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Conditional rendering of Login or Register component based on 'mode' state */}
          {mode === "login" ? (
            <Login
              onSwitchToRegister={handleSwitchToRegister}
              onClose={onClose}
            />
          ) : (
            <Register onSwitchToLogin={handleSwitchToLogin} onClose={onClose} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;