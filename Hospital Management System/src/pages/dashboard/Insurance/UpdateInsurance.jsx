import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../../../components/ErrorModal'; // Assuming this component exists for handling error messages

function UpdateInsurance({ id }) {
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
    const navigate = useNavigate();

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
                setAlertMessage('Error fetching insurance details.');
                setShowErrorModal(true);
            }
        };

        fetchData();
    }, [id]);

    const handleUpdateInsurance = async () => {
        const numberRegex = /^\d+$/;

        if (!patientID || patientID < 1) {
            setAlertMessage("Patient ID must be a positive number.");
            setShowErrorModal(true);
            return;
        }

        if (!insCode || insCode < 1) {
            setAlertMessage("Insurance Code must be a positive number.");
            setShowErrorModal(true);
            return;
        }

        if (!endDate) {
            setAlertMessage("End Date is required.");
            setShowErrorModal(true);
            return;
        }

        if (!provider.trim()) {
            setAlertMessage("Provider cannot be empty.");
            setShowErrorModal(true);
            return;
        }

        if (!plan.trim()) {
            setAlertMessage("Plan cannot be empty.");
            setShowErrorModal(true);
            return;
        }

        if (!coPay.trim()) {
            setAlertMessage("Co-Pay cannot be empty.");
            setShowErrorModal(true);
            return;
        }

        if (!coverage.trim()) {
            setAlertMessage("Coverage cannot be empty.");
            setShowErrorModal(true);
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
            setAlertMessage("Data must be changed before updating.");
            setShowErrorModal(true);
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

            navigate('/dashboard/insurance');
            window.location.reload();
        } catch (error) {
            console.error('Error updating insurance:', error);
            setAlertMessage('Error updating insurance.');
            setShowErrorModal(true);
        }
    };

    const closeErrorModal = () => {
        setShowErrorModal(false);
    };

    return (
        <div className='container mt-4'>
            {showErrorModal && (
                <ErrorModal message={alertMessage} onClose={closeErrorModal} />
            )}
            <div className='bg-white rounded p-3'>
                <div className="mb-2">
                    <label htmlFor="patientID">Patient ID:</label>
                    <input
                        type="number"
                        id="patientID"
                        placeholder="Enter Patient ID"
                        className="form-control"
                        value={patientID}
                        onChange={(e) => setPatientID(e.target.value)}
                    />
                </div>
                <div className="mb-2">
                    <label htmlFor="insCode">Insurance Code:</label>
                    <input
                        type="number"
                        id="insCode"
                        placeholder="Enter Insurance Code"
                        className="form-control"
                        value={insCode}
                        onChange={(e) => setInsCode(e.target.value)}
                    />
                </div>
                <div className="mb-2">
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
                <div className="mb-2">
                    <label htmlFor="provider">Provider:</label>
                    <input
                        type="text"
                        id="provider"
                        placeholder="Enter Provider"
                        className="form-control"
                        value={provider}
                        onChange={(e) => setProvider(e.target.value)}
                    />
                </div>
                <div className="mb-2">
                    <label htmlFor="plan">Plan:</label>
                    <input
                        type="text"
                        id="plan"
                        placeholder="Enter Plan"
                        className="form-control"
                        value={plan}
                        onChange={(e) => setPlan(e.target.value)}
                    />
                </div>
                <div className="mb-2">
                    <label htmlFor="coPay">Co-Pay:</label>
                    <input
                        type="text"
                        id="coPay"
                        placeholder="Enter Co-Pay"
                        className="form-control"
                        value={coPay}
                        onChange={(e) => setCoPay(e.target.value)}
                    />
                </div>
                <div className="mb-2">
                    <label htmlFor="coverage">Coverage:</label>
                    <input
                        type="text"
                        id="coverage"
                        placeholder="Enter Coverage"
                        className="form-control"
                        value={coverage}
                        onChange={(e) => setCoverage(e.target.value)}
                    />
                </div>
                <div className="mb-2">
                    <label htmlFor="maternity">Maternity:</label>
                    <input
                        type="text"
                        id="maternity"
                        placeholder="Enter Maternity"
                        className="form-control"
                        value={maternity}
                        onChange={(e) => setMaternity(e.target.value)}
                    />
                </div>
                <div className="mb-2">
                    <label htmlFor="dental">Dental:</label>
                    <input
                        type="text"
                        id="dental"
                        placeholder="Enter Dental"
                        className="form-control"
                        value={dental}
                        onChange={(e) => setDental(e.target.value)}
                    />
                </div>
                <div className="mb-2">
                    <label htmlFor="optical">Optical:</label>
                    <input
                        type="text"
                        id="optical"
                        placeholder="Enter Optical"
                        className="form-control"
                        value={optical}
                        onChange={(e) => setOptical(e.target.value)}
                    />
                </div>
                <button type="button" className="btn btn-success" onClick={handleUpdateInsurance}>
                    Submit
                </button>
            </div>
        </div>
    );
}

export default UpdateInsurance;
