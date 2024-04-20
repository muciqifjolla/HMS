import React from 'react';

function Footer() {
  return (
    <footer className="bg-white border-gray-200 dark:bg-gray-900 rounded-lg shadow">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="http://localhost:5173/dashboard/home/" className="hover:underline">Hospital Management System</a>. All Rights Reserved.</span>
        <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
          <li>
            <a href="#" className="hover:underline me-4 md:me-6">Privacy Policy</a>
          </li>
          <li>
            <a href="#" className="hover:underline me-4 md:me-6">Licensing</a>
          </li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
