import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import CreateInsurance from './CreateInsurance';
import { Button, TextField, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Cookies from 'js-cookie';
import { Add, Delete, Edit, Update } from '@mui/icons-material';
function Insurance({
    showCreateForm,
    setShowCreateForm,
    showUpdateForm,
    setShowUpdateForm,
    setSelectedInsuranceId,
}) {
    const [insurance, setInsurance] = useState([]);
    const [deleteInsuranceId, setDeleteInsuranceId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [patients, setPatients] = useState([]);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const token = Cookies.get('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const insuranceRes = await axios.get('http://localhost:9004/api/insurance', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const patientsRes = await axios.get('http://localhost:9004/api/patient', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const patientsData = patientsRes.data;

                const insuranceDataWithNames = insuranceRes.data.map(ins => {
                    const patient = patientsData.find(pat => pat.Patient_ID === ins.Patient_ID);
                    return {
                        ...ins,
                        Patient_Name: patient ? `${patient.Patient_Fname} ${patient.Patient_Lname}` : 'Unknown'
                    };
                });

                setInsurance(insuranceDataWithNames);
                setPatients(patientsData);
                setIsDataLoaded(true);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        fetchData();
    }, [token]);

    // const getPatientName = (patientId) => {
    //     console.log('Fetching name for patient ID:', patientId);
    //     const patient = patients.find(pat => pat.Patient_ID === patientId);
    //     console.log('Patient found:', patient);
    //     return patient ? `${patient.Patient_Fname} ${patient.Patient_Lname}` : 'Unknown';
    // };

    const handleUpdateButtonClick = (insuranceId) => {
        setSelectedInsuranceId(insuranceId);
        setShowUpdateForm(true);
        if (showCreateForm) {
            setShowCreateForm(false);
        }
    };

    const handleDelete = (id) => {
        setDeleteInsuranceId(id);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:9004/api/insurance/delete/${deleteInsuranceId}`);
            setInsurance(insurance.filter((data) => data.Policy_Number !== deleteInsuranceId));
        } catch (err) {
            console.error('Error deleting insurance:', err);
        }
        setDeleteInsuranceId(null);
    };

    const handleCreateFormToggle = () => {
        setShowCreateForm(!showCreateForm);
        setShowUpdateForm(false);
    };

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredInsurance = insurance.filter((ins) => {
        const patientName = ins.Patient_Name.toLowerCase();
        return patientName.startsWith(searchQuery.toLowerCase());
    });
    const columns = [
        { field: 'Policy_Number', headerName: 'Policy Number', width: 150 },
        { field: 'Patient_Name', headerName: 'Patient Name', width: 150 },
        { field: 'Ins_Code', headerName: 'Ins. Code', width: 150 },
        { field: 'End_Date', headerName: 'End Date', width: 150 },
        { field: 'Provider', headerName: 'Provider', width: 100 },
        { field: 'Plan', headerName: 'Plan', width: 100 },
        { field: 'Co_Pay', headerName: 'Co-Pay', width: 100 },
        { field: 'Coverage', headerName: 'Coverage', width: 100 },
        { field: 'Maternity', headerName: 'Maternity', width: 100 },
        { field: 'Dental', headerName: 'Dental', width: 100 },
        { field: 'Optical', headerName: 'Optical', width: 100 },
        {
            field: 'update',
            headerName: 'Update',
            width: 130,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleUpdateButtonClick(params.row.Policy_Number)}
                    startIcon={<Edit />}
                >
                    
                </Button>
            ),
        },
        {
            field: 'delete',
            headerName: 'Delete',
            width: 130,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(params.row.Policy_Number)}
                    startIcon={<Delete />}
                >
                   
                </Button>
            ),
        }
    ];

    return (
        <div className='container-fluid mt-4'>
            {deleteInsuranceId && (
                <Dialog
                    open={!!deleteInsuranceId}
                    onClose={() => setDeleteInsuranceId(null)}
                >
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this insurance record?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteInsuranceId(null)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleDeleteConfirm} color="secondary">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

            {!showCreateForm && (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreateFormToggle}
                    startIcon={<Add />}
                >
                </Button>
            )}

            {showCreateForm && <CreateInsurance onClose={() => setShowCreateForm(false)} />}
            
            <Box mt={4}>
                <TextField
                    label="Search by Patient Name"
                    variant="outlined"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    fullWidth
                />
            </Box>
            
            <Box mt={4} style={{ height: '100%' , width: '100%' }}>
                {isDataLoaded && (
                    <DataGrid
                        rows={filteredInsurance}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        getRowId={(row) => row.Policy_Number}
                        autoHeight
                        hideFooterSelectedRowCount
                    />
                )}
            </Box>
        </div>
    );
}

export default Insurance;
