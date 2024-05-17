import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Transition } from '@headlessui/react';

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white border-b border-gray-200 dark:bg-gray-900 rounded-lg shadow p-4">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        <span className="text-2xl font-semibold text-gray-800 dark:text-white">HMS</span>

        <div className="flex space-x-6"> 
          <Link
            to="/homepage"
            className="text-gray-700 hover:text-blue-700 dark:text-white dark:hover:text-blue-500 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/homepage/services"
            className="text-gray-700 hover:text-blue-700 dark:text-white dark:hover:text-blue-500 transition-colors"
          >
            Services
          </Link>
          <Link
            to="/about"
            className="text-gray-700 hover:text-blue-700 dark:text-white dark:hover:text-blue-500 transition-colors"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-gray-700 hover:text-blue-700 dark:text-white dark:hover:text-blue-500 transition-colors"
          >
            Contact
          </Link>
    
        </div>

        <div className="relative"> 
          <button
            className="text-gray-700 dark:text-white focus:outline-none"
            onClick={toggleDropdown}
          >
            <span className="flex items-center">
              Username
              <svg
                className={`w-4 h-4 ml-2 transform ${
                  isOpen ? 'rotate-180' : 'rotate-0'
                } transition-transform`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </span>
          </button>

          <Transition
            show={isOpen}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <ul
              className="absolute right-0 w-40 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
            >
              
              
              <li>
                <Link
                  to=""
                  className="block py-2 px-4 text-gray-700 hover:bg-gray-100"
                >
                  Sign out
                </Link>
              </li>
            </ul>
          </Transition>
        </div>
      </div>
    </nav>
  );
}

export default Header;
