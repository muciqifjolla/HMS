import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../../../components/ErrorModal';

function CreateInsurance() {
  const [formData, setFormData] = useState({
    Patient_ID: '',
    Ins_Code: '',
    End_Date: '',
    Provider: '',
    Plan: '',
    Co_Pay: '',
    Coverage: '',
    Maternity: '',
    Dental: '',
    Optical: '',
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
  const handleAddInsurance = async () => {
    try {
      await axios.post("http://localhost:9004/api/insurance/create", formData);
      navigate('/dashboard/insurance');
      window.location.reload(); // Refresh after successful addition
    } catch (error) {
      console.error('Error adding insurance:', error);
      showAlert('Error adding insurance. Please try again.');
    }
  };

  const showAlert = (message) => {
    setAlertMessage(message);
    setShowErrorModal(true);
  };
  const handleValidation = () => {
    const {
      Patient_ID,
      Ins_Code,
      End_Date,
      Provider,
      Plan,
      Co_Pay,
      Coverage,
      Maternity,
      Dental,
      Optical,
    } = formData;

    if(Patient_ID ==='' || Ins_Code ==='' || End_Date ==='' || Provider ==='' || Plan==='' ||Co_Pay==='' ||  Coverage==='' || Maternity==='' || Dental===''||Optical===''){
        showAlert('All fields are required!');
      return;
    }
    if (Patient_ID<1) {
      showAlert('Patient ID can not be less than 1');
      return;
    }

    

    handleAddInsurance(); // All validations passed
  };

  

  return (
    <div className='container mt-4'>
      {showErrorModal && (
        <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />
      )}
      <div className='bg-white rounded p-3'>
        {/* Patient ID */}
        <div className='mb-2'>
          <label htmlFor='Patient_ID'>Patient ID:</label>
          <input
            type='number'
            name='Patient_ID'
            placeholder='Enter Patient ID'
            className='form-control'
            value={formData.Patient_ID}
            onChange={handleChange}
          />
        </div>

        {/* Insurance Code */}
        <div className='mb-2'>
          <label htmlFor='Ins_Code'>Insurance Code:</label>
          <input
            type='number'
            name='Ins_Code'
            placeholder='Enter Insurance Code'
            className='form-control'
            value={formData.Ins_Code}
            onChange={handleChange}
          />
        </div>

        {/* End Date */}
        <div className='mb-2'>
          <label htmlFor='End_Date'>End Date:</label>
          <input
            type='date'
            name='End_Date'
            placeholder='Enter End Date'
            className='form-control'
            value={formData.End_Date}
            onChange={handleChange}
          />
        </div>

        {/* Provider */}
        <div className='mb-2'>
          <label htmlFor='Provider'>Provider:</label>
          <select
            type='text'
            name='Provider'
            placeholder='Enter Provider'
            className='form-control'
            value={formData.Provider}
            onChange={handleChange}
          >
          <option value=''>Select Yes/NO</option>
          <option value='No'>No</option>
          <option value='Yes'>Yes</option>
          </select>
        </div>

        {/* Plan */}
        <div className='mb-2'>
          <label htmlFor='Plan'>Plan:</label>
          <select
            id='Plan'
            name='Plan'
            className='form-control'
            value={formData.Plan}
            onChange={handleChange}
          >
          <option value=''>Select Yes/NO</option>
          <option value='No'>No</option>
          <option value='Yes'>Yes</option>
          </select>
        </div>

        {/* Co-Pay */}
        <div className='mb-2'>
          <label htmlFor='Co_Pay'>Co-Pay:</label>
          <select
            type='text'
            name='Co_Pay'
            placeholder='Enter Co-Pay'
            className='form-control'
            value={formData.Co_Pay}
            onChange={handleChange}
          >
          <option value=''>Select Yes/NO</option>
          <option value='No'>No</option>
          <option value='Yes'>Yes</option>
          </select>
        </div>

        {/* Coverage */}
        <div className='mb-2'>
          <label htmlFor='Coverage'>Coverage:</label>
          <select
            id='Coverage'
            name='Coverage'
            className='form-control'
            value={formData.Coverage}
            onChange={handleChange}
          >
             <option value=''>Select Coverage</option>
            <option value='25%'>25%</option>
          <option value='50%'>50%</option>
          <option value='75%'>75%</option>
          <option value='100%'>100%</option>

          </select>
        </div>

        <div className='mb-2'>
  <label htmlFor='Maternity'>Maternity:</label>
  <select
    id='Maternity'
    name='Maternity'
    className='form-control'
    value={formData.Maternity}
    onChange={handleChange}
  >
     <option value=''>Select Yes/NO</option>
   <option value='No'>No</option>
          <option value='Yes'>Yes</option>
  </select>
</div>

<div className='mb-2'>
  <label htmlFor='Dental'>Dental:</label>
  <select
    id='Dental'
    name='Dental'
    className='form-control'
    value={formData.Dental}
    onChange={handleChange}
  >
     <option value=''>Select Yes/NO</option>
    <option value='No'>No</option>
          <option value='Yes'>Yes</option>
  </select>
</div>

<div className='mb-2'>
  <label htmlFor='Optical'>Optical:</label>
  <select
    id='Optical'
    name='Optical'
    className='form-control'
    value={formData.Optical}
    onChange={handleChange}
  >
     <option value=''>Select Yes/NO</option>
   <option value='No'>No</option>
          <option value='Yes'>Yes</option>
  </select>
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

export default CreateInsurance;
