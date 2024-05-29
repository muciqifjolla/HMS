import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import ErrorModal from '../../../components/ErrorModal';
import Cookies from 'js-cookie';

const CreateReport = ({ onClose, onSaveSuccess }) => {
  const [formData, setFormData] = useState({
    patientName: '',
    age: '',
    patientGender: '',
    bloodType: '',
    diagnosis: '',
    doctorName: '',
    email: '',
    phone: '',
    condition: '',
    therapy: '',
    dateOfVisit: ''
  });
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const token = Cookies.get('token');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('http://localhost:9004/api/patient', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setPatients(response.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, [token]);

  const handlePatientSelect = async (event) => {
    const patientId = event.target.value;
    setSelectedPatient(patientId);

    if (patientId) {
      try {
        const response = await axios.get(`http://localhost:9004/api/visit/patient/${patientId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const visits = response.data;
        if (visits.length === 0) {
          setModalMessage('No visits found for this patient.');
          setShowModal(true);
          return;
        }

        const visit = visits[0];
        const patient = visit.Patient;
        const doctor = visit.Doctor.Staff;

        setFormData({
          personalNumber: patient.Personal_Number,
          patientName: `${patient.Patient_Fname} ${patient.Patient_Lname}`,
          age: calculateAge(patient.Birth_Date),
          patientGender: patient.Gender,
          bloodType: patient.Blood_type,
          diagnosis: visit.diagnosis,
          doctorName: `${doctor.Emp_Fname} ${doctor.Emp_Lname}`,
          email: patient.Email,
          phone: patient.Phone,
          condition: visit.condition,
          therapy: visit.therapy,
          dateOfVisit: visit.date_of_visit
        });
        setErrorMessage('');
      } catch (error) {
        console.error('Error fetching visit data:', error);
      }
    }
  };

  const handleChange = ({ target: { value, name } }) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const dob = new Date(birthDate);
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  const createAndDownloadPdf = async () => {
    if (!formData.personalNumber || !formData.patientName || !formData.age || !formData.patientGender || !formData.bloodType || !formData.diagnosis || !formData.doctorName || !formData.email || !formData.phone ) {
      setModalMessage('Please fill in all fields before creating PDF.');
      setShowModal(true);
      return;
    }

    try {
      const pdfResponse = await axios.post('http://localhost:9004/api/report/create-pdf', {
        ...formData,
      }, {
        responseType: 'blob',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const blob = new Blob([pdfResponse.data], { type: 'application/pdf' });
      saveAs(blob, `${formData.personalNumber}_Report.pdf`);
      setModalMessage('PDF created successfully.');
      setShowModal(true);
    } catch (error) {
      setModalMessage('Error creating PDF.');
      setShowModal(true);
      console.error('Error:', error);
    }
  };

  const sendEmailWithPdf = async () => {
    if (!formData.personalNumber || !formData.patientName || !formData.age || !formData.patientGender || !formData.bloodType  || !formData.diagnosis || !formData.doctorName || !formData.email || !formData.phone ) {
      setModalMessage('Please fill in all fields before sending email.');
      setShowModal(true);
      return;
    }

    try {
      await axios.post('http://localhost:9004/api/report/send-email', {
        email: formData.email,
        patientName: formData.patientName,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setModalMessage('Email sent successfully.');
      setShowModal(true);
    } catch (error) {
      setModalMessage('Error sending email.');
      setShowModal(true);
      console.error('Error:', error);
    }
  };

  const createPdfAndSaveToDb = async () => {
    if (!formData.personalNumber || !formData.patientName || !formData.age || !formData.patientGender || !formData.bloodType || !formData.diagnosis || !formData.doctorName || !formData.email || !formData.phone ) {
      setModalMessage('Please fill in all fields before saving report.');
      setShowModal(true);
      return;
    }
    try {
      const pdfResponse = await axios.post('http://localhost:9004/api/report/create-pdf', {
        ...formData,
      }, {
        responseType: 'blob',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const blob = new Blob([pdfResponse.data], { type: 'application/pdf' });
      const formDataWithPdf = new FormData();
      formDataWithPdf.append('personal_number', formData.personalNumber);
      formDataWithPdf.append('report', blob, `${formData.personalNumber}_Report.pdf`);
      for (const key in formData) {
        formDataWithPdf.append(key, formData[key]);
      }

      await axios.post('http://localhost:9004/api/report/save-report-to-db', formDataWithPdf, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      setModalMessage('PDF report saved to database successfully.');
      setShowModal(true);
      onSaveSuccess(); // Notify the parent component to refresh the reports
    } catch (error) {
      setModalMessage('Error creating PDF or saving report to database.');
      setShowModal(true);
      console.error('Error:', error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalMessage('');
  };

  return (
    <div className="report-container p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <div className="flex justify-start">
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 ml-2 rounded"
          onClick={onClose}
          style={{ marginBottom: '15px' }}
        >
          Cancel
        </button>
      </div>
      <div className="patient-selection mb-6">
        <label htmlFor="patientSelect" className="block font-semibold mb-2">Select Patient:</label>
        <select
          id="patientSelect"
          value={selectedPatient}
          onChange={handlePatientSelect}
          className="w-full p-2 border border-gray-300 rounded-lg"
        >
          <option value="">Select a patient</option>
          {patients.map((patient) => (
            <option key={patient.Patient_ID} value={patient.Patient_ID}>
              {patient.Patient_Fname} {patient.Patient_Lname}
            </option>
          ))}
        </select>
      </div>
      <div className="patient-info mb-6">
        <h2 className="text-xl font-bold mb-4">Patient Information</h2>
        <div className="mb-2">
          <label className="block font-semibold">Personal Number:</label>
          <span>{formData.personalNumber}</span>
        </div>
        <div className="mb-2">
          <label className="block font-semibold">Patient Name:</label>
          <span>{formData.patientName}</span>
        </div>
        <div className="mb-2">
          <label className="block font-semibold">Age:</label>
          <span>{formData.age}</span>
        </div>
        <div className="mb-2">
          <label className="block font-semibold">Gender:</label>
          <span>{formData.patientGender}</span>
        </div>
        <div className="mb-2">
          <label className="block font-semibold">Blood Type:</label>
          <span>{formData.bloodType}</span>
        </div>
        <div className="mb-2">
          <label className="block font-semibold">Email:</label>
          <span>{formData.email}</span>
        </div>
        <div className="mb-2">
          <label className="block font-semibold">Phone:</label>
          <span>{formData.phone}</span>
        </div>
        <div className="mb-2">
          <label className="block font-semibold">Condition:</label>
          <span>{formData.condition}</span>
        </div>
        <div className="mb-2">
          <label className="block font-semibold">Diagnosis:</label>
          <span>{formData.diagnosis}</span>
        </div>
        <div className="mb-2">
          <label className="block font-semibold">Therapy:</label>
          <span>{formData.therapy}</span>
        </div>
        <div className="mb-2">
          <label className="block font-semibold">Date of Visit:</label>
          <span>{formData.dateOfVisit}</span>
        </div>
      </div>
  
      <div className="flex justify-between">
        <button
          onClick={createPdfAndSaveToDb}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Save Report
        </button>
        <button
          onClick={createAndDownloadPdf}
          className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Download PDF
        </button>
        <button
          onClick={sendEmailWithPdf}
          className="p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
        >
          Send Email
        </button>
      </div>
      {showModal && (
        <ErrorModal message={modalMessage} onClose={closeModal} />
      )}
    </div>
  );
};

export default CreateReport;
