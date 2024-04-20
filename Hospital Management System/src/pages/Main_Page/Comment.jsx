import React from 'react';

function Comment() {
  return (
    <form className="w-full max-w-md mx-auto">
      <div className="flex flex-col mb-4">
        <label htmlFor="comment" className="sr-only">Your comment</label>
        <textarea id="comment" rows="4" className="w-full px-3 py-2 text-sm text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:placeholder-gray-400" placeholder="Write a comment..." required ></textarea>
      </div>
      <div className="flex items-center justify-between mb-4">
        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:outline-none focus:bg-blue-800">Post comment</button>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">Remember, contributions to this topic should follow our <a href="#" className="text-blue-600 hover:underline">Community Guidelines</a>.</p>
    </form>
  );
}

export default Comment;
