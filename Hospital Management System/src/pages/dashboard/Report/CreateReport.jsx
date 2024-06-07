import React, { useState, useEffect, Suspense, lazy } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { Box, Button, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Cookies from 'js-cookie';

const ErrorModal = lazy(() => import('../../../components/ErrorModal'));

const CreateReport = ({ onClose, onSaveSuccess }) => {
  const [formData, setFormData] = useState({
    personalNumber: '',
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
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const token = Cookies.get('token');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('http://localhost:9004/api/patient', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setPatients(response.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, [token]);

  useEffect(() => {
    const fetchPatientVisits = async () => {
      if (!selectedPatient) {
        setFormData({
          personalNumber: '',
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
        return;
      }

      try {
        const response = await axios.get(`http://localhost:9004/api/visit/patient/${selectedPatient}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const visits = response.data;
        if (visits.length === 0) {
          setFormData({
            personalNumber: '',
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
      } catch (error) {
        console.error('Error fetching visit data:', error);
        setModalMessage('Error fetching visit data.');
        setShowModal(true);
      }
    };

    fetchPatientVisits();
  }, [selectedPatient, token]);

  const calculateAge = birthDate => {
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
    if (
      !formData.personalNumber ||
      !formData.patientName ||
      !formData.age ||
      !formData.patientGender ||
      !formData.bloodType ||
      !formData.diagnosis ||
      !formData.doctorName ||
      !formData.email ||
      !formData.phone
    ) {
      setModalMessage('Please fill in all fields before creating PDF.');
      setShowModal(true);
      return;
    }

    try {
      const pdfResponse = await axios.post(
        'http://localhost:9004/api/report/create-pdf',
        {
          ...formData
        },
        {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

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
    if (
      !formData.personalNumber ||
      !formData.patientName ||
      !formData.age ||
      !formData.patientGender ||
      !formData.bloodType ||
      !formData.diagnosis ||
      !formData.doctorName ||
      !formData.email ||
      !formData.phone
    ) {
      setModalMessage('Please fill in all fields before sending email.');
      setShowModal(true);
      return;
    }

    try {
      await axios.post(
        'http://localhost:9004/api/report/send-email',
        {
          email: formData.email,
          patientName: formData.patientName
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setModalMessage('Email sent successfully.');
      setShowModal(true);
    } catch (error) {
      setModalMessage('Error sending email.');
      setShowModal(true);
      console.error('Error:', error);
    }
  };

  const createPdfAndSaveToDb = async () => {
    if (
      !formData.personalNumber ||
      !formData.patientName ||
      !formData.age ||
      !formData.patientGender ||
      !formData.bloodType ||
      !formData.diagnosis ||
      !formData.doctorName ||
      !formData.email ||
      !formData.phone
    ) {
      setModalMessage('Please fill in all fields before saving report.');
      setShowModal(true);
      return;
    }
    try {
      const pdfResponse = await axios.post(
        'http://localhost:9004/api/report/create-pdf',
        {
          ...formData
        },
        {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

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
          Authorization: `Bearer ${token}`
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
    <Box className="report-container" p={6} maxWidth="md" mx="auto" bgcolor="white" borderRadius={2} boxShadow={2}>
      <Box display="flex" justifyContent="flex-start" mb={2}>
        <Button variant="contained" color="secondary" onClick={onClose}>
          Cancel
        </Button>
      </Box>
      <Box mb={4}>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Select Patient</InputLabel>
          <Select
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
            label="Select Patient"
          >
            <MenuItem value="">
              <em>Select a patient</em>
            </MenuItem>
            {patients.map((patient) => (
              <MenuItem key={patient.Patient_ID} value={patient.Patient_ID}>
                {patient.Patient_Fname} {patient.Patient_Lname}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          Patient Information
        </Typography>
        {Object.keys(formData).map((key) => (
          <Box mb={2} key={key}>
            <Typography variant="body1">
              <strong>{key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}:</strong> {formData[key]}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Button variant="contained" color="primary" onClick={createPdfAndSaveToDb}>
          Save Report
        </Button>
        <Button variant="contained" color="success" onClick={createAndDownloadPdf}>
          Download PDF
        </Button>
        <Button variant="contained" color="info" onClick={sendEmailWithPdf}>
          Send Email
        </Button>
      </Box>
      {showModal && (
        <Suspense fallback={<div>Loading...</div>}>
          <ErrorModal message={modalMessage} onClose={closeModal} />
        </Suspense>
      )}
    </Box>
  );
};

export default CreateReport;
