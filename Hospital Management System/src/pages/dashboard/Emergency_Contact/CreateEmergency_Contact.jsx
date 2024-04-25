import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../../../components/ErrorModal';

function CreateEmergencyContact() {
  const [formData, setFormData] = useState({
    Contact_Name: '',
    Phone: '',
    Relation: '',
    Patient_ID: '',
  });

  const [alertMessage, setAlertMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddEmergencyContact = async () => {
    try {
      const response = await axios.post('http://localhost:9004/api/emergency_contact/create', formData);
      console.log(response.data);
      navigate('/dashboard/emergency_contact');
      window.location.reload();
    } catch (error) {
      console.error('Error adding emergency contact:', error);
      showAlert('Error adding emergency contact. Please try again.');
    }
  };

  const handleValidation = () => {
    const { Contact_Name, Phone, Relation, Patient_ID } = formData;
    const phoneRegex = /^(?:\+\d{1,3}\s?)?\d{3}(?:\d{6,7})$/;

    if (Contact_Name === '' || Phone === '' || Relation === '' || Patient_ID === '') {
      showAlert('All fields are required.');
      return;
    }

    if (!phoneRegex.test(Phone)) {
      showAlert('Please enter a valid phone number (e.g., 044111222).');
      return;
    }

    handleAddEmergencyContact(); // All validations passed
  };

  const showAlert = (message) => {
    setAlertMessage(message);
    setShowErrorModal(true);
  };

  return (
    <div className='container mt-4'>
      {showErrorModal && (
        <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />
      )}
      <div className='bg-white rounded p-3'>
        <div className='mb-2'>
          <label htmlFor='Contact_Name'>Emergency Contact Name:</label>
          <input
            type='text'
            id='Contact_Name'
            name='Contact_Name'
            placeholder='Enter Name'
            className='form-control'
            value={formData.Contact_Name}
            onChange={handleChange}
          />
        </div>

        <div className='mb-2'>
          <label htmlFor='Phone'>Emergency Contact Phone:</label>
          <input
            type='text'
            id='Phone'
            name='Phone'
            placeholder='Enter Phone'
            className='form-control'
            value={formData.Phone}
            onChange={handleChange}
          />
        </div>

        <div className='mb-2'>
          <label htmlFor='Relation'>Relation:</label>
          <select
            id='Relation'
            name='Relation'
            className='form-control'
            value={formData.Relation}
            onChange={handleChange}
          >
            <option value=''>Select Relation</option>
            <option value='Mother'>Mother</option>
            <option value='Father'>Father</option>
            <option value='Sister'>Sister</option>
            <option value='Brother'>Brother</option>
            <option value='Close family Member'>Close Family Member</option>
            <option value='Friend'>Friend</option>
          </select>
        </div>

        <div className='mb-2'>
          <label htmlFor='Patient_ID'>Patient ID:</label>
          <input
            type='number'
            id='Patient_ID'
            name='Patient_ID'
            placeholder='Enter Patient ID'
            className='form-control'
            value={formData.Patient_ID}
            onChange={handleChange}
          />
        </div>

        <button
          type='button'
          className='btn btn-success'
          onClick={handleValidation}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default CreateEmergencyContact;
