import React, { useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import './Report.css';
import ErrorModal from '../../../components/ErrorModal';

const Report = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    age: '',
    patientGender: '',
    bloodType: '',
    admissionDate: '',
    dischargeDate: '',
    diagnosis: '',
    doctorName: '',
    email: '',
    phone: '',
    medicines: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const personalNumberRegex = /^\d{10}$/;

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

  const fetchPatientInfo = async (personalNumber) => {
    if (!personalNumber.match(personalNumberRegex)) {
      setModalMessage('Please enter a valid personal number.');
      setShowModal(true);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:9004/api/patient/personalNumber/${personalNumber}`);
      if (response.status === 404) {
        setModalMessage('Patient not found.');
        setShowModal(true);
        return;
      }

      const { Patient_Fname, Patient_Lname, Birth_Date, Blood_type, Email, Gender, Admission_Date, Discharge_Date, Phone, Condition, Doctor_Name } = response.data;

      const age = calculateAge(Birth_Date);

      setFormData({
        patientName: `${Patient_Fname} ${Patient_Lname}`,
        age,
        patientGender: Gender,
        bloodType: Blood_type,
        admissionDate: Admission_Date,
        dischargeDate: Discharge_Date,
        diagnosis: Condition,
        doctorName: Doctor_Name,
        email: Email,
        phone: Phone,
        medicines: '',
      });
      setErrorMessage('');
    } catch (error) {
      setModalMessage('An error occurred while fetching patient information.');
      setShowModal(true);
      console.error('Error fetching patient info:', error);
    }
  };
const createAndDownloadPdf = async () => {
  // Validate form fields
  if (!formData.patientName || !formData.age || !formData.patientGender || !formData.bloodType || !formData.admissionDate || !formData.dischargeDate || !formData.diagnosis || !formData.doctorName || !formData.email || !formData.phone || !formData.medicines) {
    setModalMessage('Please fill in all fields before creating PDF.');
    setShowModal(true);
    return;
  }

  try {
    const medicinesArray = formData.medicines.split(',').map(medicine => medicine.trim());

    const pdfResponse = await axios.post('http://localhost:9004/api/create-pdf', {
      ...formData,
      medicines: medicinesArray
    }, {
      responseType: 'blob' // Ensure the response is handled as a Blob
    });

    const blob = new Blob([pdfResponse.data], { type: 'application/pdf' });
    saveAs(blob, 'patient_report.pdf');
    setModalMessage('PDF created successfully.');
    setShowModal(true);
  } catch (error) {
    setModalMessage('Error creating PDF.');
    setShowModal(true);
    console.error('Error:', error);
  }
};

const sendEmailWithPdf = async () => {
  // Validate form fields
  if (!formData.patientName || !formData.age || !formData.patientGender || !formData.bloodType || !formData.admissionDate || !formData.dischargeDate || !formData.diagnosis || !formData.doctorName || !formData.email || !formData.phone || !formData.medicines) {
    setModalMessage('Please fill in all fields before sending email.');
    setShowModal(true);
    return;
  }

  try {
    const emailResponse = await axios.post('http://localhost:9004/api/send-email', {
      email: formData.email,
      pdfPath: 'result.pdf' // Assuming this is the path where the PDF is saved
    });

    setModalMessage('Email sent successfully.');
    setShowModal(true);
    console.log('Email sent:', emailResponse.data);
  } catch (error) {
    setModalMessage('Error sending email.');
    setShowModal(true);
    console.error('Error:', error);
  }
};


  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalMessage('');
  };

  return (
    <div className="report-container">
      <div className="search-section">
        <input
          type="text"
          placeholder="Search by personal number..."
          value={searchQuery}
          onChange={handleSearchInputChange}
          className="search-input"
        />
        <button onClick={() => fetchPatientInfo(searchQuery)}>Search</button>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>
      <div className="patient-info">
        <h2>Patient Information</h2>
        <div>
          <label>Patient Name:</label>
          <span>{formData.patientName}</span>
        </div>
        <div>
          <label>Age:</label>
          <span>{formData.age}</span>
        </div>
        <div>
          <label>Gender:</label>
          <span>{formData.patientGender}</span>
        </div>
        <div>
          <label>Blood Type:</label>
          <span>{formData.bloodType}</span>
        </div>
        <div>
          <label>Admission Date:</label>
          <span>{formData.admissionDate}</span>
        </div>
        <div>
          <label>Discharge Date:</label>
          <span>{formData.dischargeDate}</span>
        </div>
        <div>
          <label>Email:</label>
          <span>{formData.email}</span>
        </div>
        <div>
          <label>Phone:</label>
          <span>{formData.phone}</span>
        </div>
      </div>
      <div className="other-info">
        <h2>Other Information</h2>
        <input type="text" placeholder="Diagnosis" name="diagnosis" onChange={handleChange} />
        <input type="text" placeholder="Medicines (comma-separated)" name="medicines" onChange={handleChange} />
        <input type="text" placeholder="Doctor Name" name="doctorName" onChange={handleChange} />
      </div>
      <button onClick={createAndDownloadPdf}>Download PDF</button>
      <button onClick={sendEmailWithPdf}>Send Email</button>
      {showModal && <ErrorModal message={modalMessage} onClose={closeModal} />}
    </div>
  );
};

export default Report;
