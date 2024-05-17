import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography } from '@material-tailwind/react';

export function Home() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [department, setDepartment] = useState([]);
  const [staff, setStaff] = useState([]);
  const [room, setRoom] = useState([]);
  const [medicine, setMedicine] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch appointments
        const appointmentResponse = await axios.get('http://localhost:9004/api/appointment');
        const fetchedAppointments = appointmentResponse.data;
        setAppointments(fetchedAppointments);

        // Fetch patients
        const patientResponse = await axios.get('http://localhost:9004/api/patient');
        const fetchedPatients = patientResponse.data;
        setPatients(fetchedPatients);

        // Fetch departments
        const departmentResponse = await axios.get('http://localhost:9004/api/department');
        const fetchedDepartments = departmentResponse.data;
        setDepartment(fetchedDepartments);

        // Fetch staff
        const staffResponse = await axios.get('http://localhost:9004/api/staff');
        const fetchedStaff = staffResponse.data;
        setStaff(fetchedStaff);

        const roomResponse = await axios.get('http://localhost:9004/api/room');
        const fetchedRooms = roomResponse.data;
        setRoom(fetchedRooms);


        const nurseMedicine = await axios.get('http://localhost:9004/api/medicine');
        const fetchedMedicine = nurseMedicine.data;
        setMedicine(fetchedMedicine);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="mt-12">
     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg shadow-md bg-white p-6 flex flex-col items-center justify-center space-y-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12 text-blue-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
        <div className="text-center">
          <p className="text-gray-500">Appointments</p>
          <h2 className="text-5xl font-bold">{appointments.length}</h2>
          <p className="text-sm text-gray-600">Total appointments scheduled</p>
        </div>
      </div>

      {/* Patients */}
      <div className="rounded-lg shadow-md bg-white p-6 flex flex-col items-center justify-center space-y-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12 text-blue-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
        <div className="text-center">
          <p className="text-gray-500">Patients</p>
          <h2 className="text-5xl font-bold">{patients.length}</h2>
          <p className="text-sm text-gray-600">Total patients registered</p>
        </div>
      </div>

      {/* Departments */}
      <div className="rounded-lg shadow-md bg-white p-6 flex flex-col items-center justify-center space-y-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12 text-blue-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="m7.875 14.25 1.214 1.942a2.25 2.25 0 0 0 1.908 1.058h2.006c.776 0 1.497-.4 1.908-1.058l1.214-1.942M2.41 9h4.636a2.25 2.25 0 0 1 1.872 1.002l.164.246a2.25 2.25 0 0 0 1.872 1.002h2.092a2.25 2.25 0 0 0 1.872-1.002l.164-.246A2.25 2.25 0 0 1 16.954 9h4.636M2.41 9a2.25 2.25 0 0 0-.16.832V12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 12V9.832c0-.287-.055-.57-.16-.832M2.41 9a2.25 2.25 0 0 1 .382-.632l3.285-3.832a2.25 2.25 0 0 1 1.708-.786h8.43c.657 0 1.281.287 1.709.786l3.284 3.832c.163.19.291.404.382.632M4.5 20.25h15A2.25 2.25 0 0 0 21.75 18v-2.625c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125V18a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
        <div className="text-center">
          <p className="text-gray-500">Departments</p>
          <h2 className="text-5xl font-bold">{department.length}</h2>
          <p className="text-sm text-gray-600">Total departments available</p>
        </div>
      </div>

      <div className="rounded-lg shadow-md bg-white p-6 flex flex-col items-center justify-center space-y-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12 text-blue-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
        </svg>
        <div className="text-center">
          <p className="text-gray-500">Staffs</p>
          <h2 className="text-5xl font-bold">{staff.length}</h2>
          <p className="text-sm text-gray-600">Total staff members</p>
        </div>
      </div>

      {/* Room */}
      <div className="rounded-lg shadow-md bg-white p-6 flex flex-col items-center justify-center space-y-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12 text-blue-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
        </svg>
        <div className="text-center">
          <p className="text-gray-500">Rooms</p>
          <h2 className="text-5xl font-bold">{room.length}</h2>
          <p className="text-sm text-gray-600">Total rooms available</p>
        </div>
      </div>

      <div className="rounded-lg shadow-md bg-white p-6 flex flex-col items-center justify-center space-y-4">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12 text-blue-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
          </svg>
        <div className="text-center">
          <p className="text-gray-500">Medicines</p>
          <h2 className="text-5xl font-bold">{medicine.length}</h2>
          <p className="text-sm text-gray-600">Total medicine available</p>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Home;
