import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ErrorModal from '../../../components/ErrorModal'; // Assuming this component exists for handling error messages

function UpdateInsurance({ id, onClose }) {
    const [patientID, setPatientID] = useState('');
    const [insCode, setInsCode] = useState('');
    const [endDate, setEndDate] = useState('');
    const [provider, setProvider] = useState('');
    const [plan, setPlan] = useState('');
    const [coPay, setCoPay] = useState('');
    const [coverage, setCoverage] = useState('');
    const [maternity, setMaternity] = useState('');
    const [dental, setDental] = useState('');
    const [optical, setOptical] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [originalData, setOriginalData] = useState({});
    const [insurance, setInsurance] = useState([]);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:9004/api/insurance/${id}`);
                const data = response.data;
                setOriginalData(data);
                setPatientID(data.Patient_ID);
                setInsCode(data.Ins_Code);
                setEndDate(data.End_Date);
                setProvider(data.Provider);
                setPlan(data.Plan);
                setCoPay(data.Co_Pay);
                setCoverage(data.Coverage);
                setMaternity(data.Maternity);
                setDental(data.Dental);
                setOptical(data.Optical);
            } catch (error) {
                console.error('Error fetching insurance:', error);
                showAlert('Error fetching insurance details.');
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        const fetchAllInsurances = async () => {
            try {
                const response = await axios.get('http://localhost:9004/api/insurance');
                setInsurance(response.data);
            } catch (error) {
                console.error('Error fetching insurance:', error);
            }
        };

        fetchAllInsurances();
    }, []);

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
    };

    const handleUpdateInsurance = async () => {
        const numberRegex = /^\d+$/;

        if (!patientID || patientID < 1) {
            showAlert("Patient ID must be a positive number.");
            return;
        }

        if (!insCode) {
            showAlert("Insurance Code must be a positive number.");
            return;
        }

        if (insCode.length < 6) {
            showAlert("Insurance Code must be at least 6 characters.");
            return;
        }
        if (!endDate) {
            showAlert("End Date is required.");
            return;
        }

        if (!provider.trim()) {
            showAlert("Provider cannot be empty.");
            return;
        }

        if (!plan.trim()) {
            showAlert("Plan cannot be empty.");
            return;
        }

        if (!coPay.trim()) {
            showAlert("Co-Pay cannot be empty.");
            return;
        }

        if (!coverage.trim()) {
            showAlert("Coverage cannot be empty.");
            return;
        }

        if (
            patientID === originalData.Patient_ID &&
            insCode === originalData.Ins_Code &&
            endDate === originalData.End_Date &&
            provider === originalData.Provider &&
            plan === originalData.Plan &&
            coPay === originalData.Co_Pay &&
            coverage === originalData.Coverage &&
            maternity === originalData.Maternity &&
            dental === originalData.Dental &&
            optical === originalData.Optical
        ) {
            showAlert("Data must be changed before updating.");
            return;
        }

        const existingInsurance = insurance.find(insurance => insurance.Ins_Code === insCode && insurance.Policy_Number!==id);
        if (existingInsurance) {
            showAlert('Insurance with the same code already exists');
            return;
        }
        try {
            await axios.put(`http://localhost:9004/api/insurance/update/${id}`, {
                Patient_ID: patientID,
                Ins_Code: insCode,
                End_Date: endDate,
                Provider: provider,
                Plan: plan,
                Co_Pay: coPay,
                Coverage: coverage,
                Maternity: maternity,
                Dental: dental,
                Optical: optical,
            });

            // Close the modal after updating
            onClose();
            window.location.reload();
        } catch (error) {
            console.error('Error updating insurance:', error);
            showAlert('Error updating insurance.');
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
        <div className="bg-white p-8 mx-auto rounded-lg w-96">
        {showErrorModal && (
            <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />
        )}
        <h1 className="text-lg font-bold mb-4">Update Insurance</h1>
            <div className="mb-4">
                <label htmlFor="patientID">Patient ID:</label>
                <input
                    type="number"
                    id="patientID"
                    placeholder="Enter Patient ID"
                    className="form-control"
                    value={patientID}
                    onChange={(e) => setPatientID(e.target.value)}
                    disabled
                />
            </div>
            <div className="mb-4">
                <label htmlFor="insCode">Insurance Code:</label>
                <input
                    type="number"
                    id="insCode"
                    placeholder="Enter Insurance Code"
                    className="form-control"
                    value={insCode}
                    onChange={(e) => setInsCode(e.target.value)}
                    disabled
                />
            </div>
            <div className="mb-4">
                <label htmlFor="endDate">End Date:</label>
                <input
                    type="date"
                    id="endDate"
                    placeholder="Enter End Date"
                    className="form-control"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </div>
            <div className="mb-4">
                <label htmlFor="provider">Provider:</label>
                <select
                    type="text"
                    id="provider"
                    placeholder="Enter Provider"
                    className="form-control"
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                >
                    <option value=''>Select Yes/NO</option>
                    <option value='No'>No</option>
                    <option value='Yes'>Yes</option>
                </select>
            </div>
            <div className="mb-4">
                <label htmlFor="plan">Plan:</label>
                <select
                    type="text"
                    id="plan"
                    placeholder="Enter Plan"
                    className="form-control"
                    value={plan}
                    onChange={(e) => setPlan(e.target.value)}
                >
                    <option value=''>Select Yes/NO</option>
                    <option value='No'>No</option>
                    <option value='Yes'>Yes</option>
                </select>
            </div>
            <div className='mb-4'>
                <label htmlFor='Co_Pay'>Co-Pay:</label>
                <select
                    id='Co_Pay'
                    name='Co_Pay'
                    className='form-control'
                    value={coPay}
                    onChange={(e) => setCoPay(e.target.value)}
                >
                    <option value=''>Select Yes/NO</option>
                    <option value='No'>No</option>
                    <option value='Yes'>Yes</option>
                </select>
            </div>
            <div className="mb-4">
                <label htmlFor="coverage">Coverage:</label>
                <select
                    type="text"
                    id="coverage"
                    placeholder="Enter Coverage"
                    className="form-control"
                    value={coverage}
                    onChange={(e) => setCoverage(e.target.value)}
                >
                    <option value=''>Select Coverage</option>
                    <option value='25%'>25%</option>
                    <option value='50%'>50%</option>
                    <option value='75%'>75%</option>
                    <option value='100%'>100%</option>
                </select>
            </div>
            <div className="mb-4">
                <label htmlFor="maternity">Maternity:</label>
                <select
                    type="text"
                    id="maternity"
                    placeholder="Enter Maternity"
                    className="form-control"
                    value={maternity}
                    onChange={(e) => setMaternity(e.target.value)}
                >
                    <option value=''>Select Yes/NO</option>
                    <option value='No'>No</option>
                    <option value='Yes'>Yes</option>
                </select>
            </div>
            <div className="mb-4">
                <label htmlFor="dental">Dental:</label>
                <select
                    type="text"
                    id="dental"
                    placeholder="Enter Dental"
                    className="form-control"
                    value={dental}
                    onChange={(e) => setDental(e.target.value)}
                >
                    <option value=''>Select Yes/NO</option>
                    <option value='No'>No</option>
                    <option value='Yes'>Yes</option>
                </select>
            </div>
            <div className="mb-4">
                <label htmlFor="optical">Optical:</label>
                <select
                    type="text"
                    id="optical"
                    placeholder="Enter Optical"
                    className="form-control"
                    value={optical}
                    onChange={(e) => setOptical(e.target.value)}
                >
                    <option value=''>Select Yes/NO</option>
                    <option value='No'>No</option>
                    <option value='Yes'>Yes</option>
                </select>
            </div>
            <div className="flex justify-end">
                <button type="button" className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleUpdateInsurance}>
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

export default UpdateInsurance;
