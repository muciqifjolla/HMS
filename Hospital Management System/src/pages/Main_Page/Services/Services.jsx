import React from 'react';
import Header from '../Header';
import { Link, useNavigate } from 'react-router-dom';

function Services() {
  const navigate = useNavigate();

  const handleSelection = (event) => {
    const selectedOption = event.target.value;
    if (selectedOption === 'appointment') {
      navigate('/homepage/services/appointment');
    }
  };

  const handleButtonClick = () => {
    navigate('/homepage');
  };

  return (
    <div>
      <Header />
      <div className="container mx-auto mt-8">
        <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Choose Services</h2>
            <div className="relative">
              <select
                id="services"
                name="services"
                onChange={handleSelection}
                className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">Select an option</option>
                <option value="appointment">Appointment</option>
                <option value="others">Others</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.293 14.293a1 1 0 0 1-1.414-1.414l4-4a1 1 0 0 1 1.414 1.414l-4 4z"
                  />
                </svg>
              </div>
            </div>
            <button
              onClick={handleButtonClick}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;
