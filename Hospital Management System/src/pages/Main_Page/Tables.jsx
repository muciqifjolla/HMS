import React from 'react';

function Tables() {
  return (
    <div className="overflow-x-auto mt-8">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border-collapse">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">Medical Procedure</th>
            <th scope="col" className="px-6 py-3">Date</th>
            <th scope="col" className="px-6 py-3">Doctor</th>
            <th scope="col" className="px-6 py-3">Cost</th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">Procedure 1</td>
            <td className="px-6 py-4">2023-01-01</td>
            <td className="px-6 py-4">Dr. A</td>
            <td className="px-6 py-4">$1000</td>
          </tr>
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">Procedure 2</td>
            <td className="px-6 py-4">2023-02-02</td>
            <td className="px-6 py-4">Dr. B</td>
            <td className="px-6 py-4">$2000</td>
          </tr>
          <tr className="bg-white dark:bg-gray-800">
            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">Procedure 3</td>
            <td className="px-6 py-4">2023-03-03</td>
            <td className="px-6 py-4">Dr. C</td>
            <td className="px-6 py-4">$3000</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Tables;
