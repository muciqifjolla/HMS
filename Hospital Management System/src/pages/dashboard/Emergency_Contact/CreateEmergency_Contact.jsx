import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../../../components/ErrorModal';
import Cookies from 'js-cookie'; // Import js-cookie
function CreateEmergencyContact({onClose}) {
  const [formData, setFormData] = useState({
    Contact_Name: '',
    Phone: '',
    Relation: '',
    Patient_ID: '',
  });
  const [emergency_contact, setEmergency_contact] = useState([]);
  const [patients, setPatients] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const token = Cookies.get('token'); 
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
}, []);

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
  useEffect(() => {
    // Fetch existing medicines when component mounts
    fetchEmergency_contact();
}, []);

const fetchEmergency_contact = async () => {
    try {
        const response = await axios.get('http://localhost:9004/api/emergency_contact',{
          headers: {
            'Authorization': `Bearer ${token}`
        }
        })
        setEmergency_contact(response.data);
    } catch (error) {
        console.error('Error fetching emergency_contact:', error);
    }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddEmergencyContact = async () => {
    try {
      const response = await axios.post('http://localhost:9004/api/emergency_contact/create', formData,{
        headers: {
          'Authorization': `Bearer ${token}`
      }
      })
      // console.log(response.data);
      navigate('/dashboard/emergency_contact');
      window.location.reload();
    } catch (error) {
      console.error('Error adding emergency contact:', error);
      showAlert('Error adding emergency contact. Please try again.');
    }
  };

  const handleValidation = async () => {
    const { Contact_Name, Phone, Relation, Patient_ID } = formData;
    const phoneRegex = /^(?:\+\d{1,3}\s?)?\d{3}(?:\d{6,7})$/;

    if (Contact_Name === '' || Phone === '' || Relation === '' || Patient_ID === '') {
      showAlert('All fields are required.');
      return;
    }
    if(Contact_Name.length < 2){
      showAlert('Contact Name can not be less than 2 characters long!');
      return;
    }
    if(Phone.length !== 9){
      showAlert('Phone can should be 9 characters long!');
      return;
    }
    if (!phoneRegex.test(Phone)) {
      showAlert('Please enter a valid phone number (e.g., 044111222).');
      return;
    }
    if (Patient_ID<1) {
      showAlert('Patient_ID should be at least 1');
      return;
  }

    const existingEmergency_contact = emergency_contact.find(emergency_contact => emergency_contact.Phone === Phone);
        if (existingEmergency_contact) {
            showAlert('Phone number Exists');
            return;
        }
        try {
          await axios.get(`http://localhost:9004/api/patient/check/${Patient_ID}`,{
            headers: {
              'Authorization': `Bearer ${token}`
          }
          });
          // Proceed with form submission after successful validation
          handleAddEmergencyContact()
      } catch (error) {
          console.error('Error checking patient ID:', error);
          showAlert('Patient ID does not exist');
      }

    ; // All validations passed
  };

  const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
        // Automatically hide the error modal after 3 seconds
  
    };

  return (
    <div className='fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50'>
    <div className='bg-white p-8 mx-auto rounded-lg w-96'>
        {showErrorModal && (
            <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />
        )}
        <h1 className='text-lg font-bold mb-4'>Add Emergency Contact</h1>
        {/* Patient ID */}
        <div className='mb-2'>
          <label htmlFor='Contact_Name'>Name:</label>
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
          <label htmlFor='Phone'>Phone:</label>
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
          <label htmlFor='Patient_ID'>Patient :</label>
          <select
            type='number'
            id='Patient_ID'
            name='Patient_ID'
            placeholder='Enter Patient ID'
            className='form-control'
            value={formData.Patient_ID}
            onChange={handleChange}
          >
            <option value=''>Select</option>
                        {patients.map(patient => (
                            <option key={patient.Patient_ID} value={patient.Patient_ID}>
                                {`${patient.Patient_Fname} ${patient.Patient_Lname}`}
                            </option>
                        ))}
          </select>
        </div>
        <div className='flex justify-end'>
            <button
                className='bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                onClick={handleValidation}
            >
                Submit
            </button>
            <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 ml-2 rounded"
                onClick={onClose} // Call the onClose function passed from props
            >
                Cancel
            </button>
        </div>
    </div>
</div>
  );
}

export default CreateEmergencyContact;
