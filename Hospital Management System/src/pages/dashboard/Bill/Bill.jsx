import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import Cookies from 'js-cookie';
import { Add, Delete, Edit } from '@mui/icons-material';
import CreateBill from './CreateBill';
import {jwtDecode} from 'jwt-decode';

function Bill({
    showCreateForm,
    setShowCreateForm,
    showUpdateForm,
    setShowUpdateForm,
    setSelectedBillId,
}) {
    const [bills, setBills] = useState([]);
    const [deleteBillId, setDeleteBillId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const token = Cookies.get('token');
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId; // Adjust based on how the ID is stored in the token
    const userRole = decodedToken.role; // Assuming the role is stored as 'role' in the token

    useEffect(() => {
        const fetchData = async () => {
            try {
                const billRes = await axios.get('http://localhost:9004/api/bills', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                let billsDataWithNames = billRes.data.map(res => {
                    const patient = res.Patient;
                    return {
                        ...res,
                        Patient_Name: patient ? `${patient.Patient_Fname} ${patient.Patient_Lname}` : 'Unknown'
                    };
                });

                if (userRole === 'patient') {
                    billsDataWithNames = billsDataWithNames.filter(res => res.aPtient_ID === userId);
                } 
                // else if (userRole === 'doctor') {
                //     // Assuming each bill has a Doctor_ID that matches the logged-in doctor's ID
                //     billsDataWithNames = billsDataWithNames.filter(res => res.Doctor_ID === userId);
                // }

                setBills(billsDataWithNames);
                setIsDataLoaded(true);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [token, userId, userRole]);

    const handleUpdateButtonClick = (billId) => {
        setSelectedBillId(billId);
        setShowUpdateForm(true);
        if (showCreateForm) {
            setShowCreateForm(false);
        }
    };

    const handleDelete = (id) => {
        setDeleteBillId(id);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:9004/api/bills/delete/${deleteBillId}`);
            setBills(bills.filter((data) => data.Bill_ID !== deleteBillId));
        } catch (err) {
            console.error('Error deleting bill:', err);
        }
        setDeleteBillId(null);
    };

    const handleCreateFormToggle = () => {
        setShowCreateForm(!showCreateForm);
        setShowUpdateForm(false);
    };

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredBills = bills.filter((res) => {
        const patientName = res.Patient_Name.toLowerCase();
        return patientName.startsWith(searchQuery.toLowerCase());
    });

    const columns = [
        { field: 'Bill_ID', headerName: 'ID', flex: 1 },
        { field: 'Patient_Name', headerName: 'Patient Name', flex: 2 },
        { field: 'Date_Issued', headerName: 'Date Issued', flex: 2 },
        { field: 'Description', headerName: 'Description', flex: 2 },
        { field: 'Amount', headerName: 'Amount', flex: 2 },
        { field: 'Payment_Status', headerName: 'Payment Status', flex: 2 },
        {
            field: 'update',
            headerName: 'Update',
            flex: 1,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleUpdateButtonClick(params.row.Bill_ID)}
                    startIcon={<Edit />}
                >
                </Button>
            )
        },
        {
            field: 'delete',
            headerName: 'Delete',
            flex: 1,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(params.row.Bill_ID)}
                    startIcon={<Delete />}
                >
                </Button>
            )
        }
    ];

    return (
        <div className='container-fluid mt-4'>
            {deleteBillId && (
                <Dialog
                    open={!!deleteBillId}
                    onClose={() => setDeleteBillId(null)}
                >
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this bill?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteBillId(null)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleDeleteConfirm} color="secondary">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

            <Box mt={4} display="flex" alignItems="center">
                <Typography variant="h6" style={{ marginRight: 'auto' }}>
                    Bills
                </Typography>
                {showCreateForm ? null : (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCreateFormToggle}
                        startIcon={<Add />}
                    >
                        Add Bill
                    </Button>
                )}
            </Box>

            {showCreateForm && <CreateBill onClose={() => setShowCreateForm(false)} />}

            <Box mt={4} style={{ height: '100%', width: '100%' }}>
                <DataGrid
                    rows={filteredBills}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    getRowId={(row) => row.Bill_ID}
                    autoHeight
                />
            </Box>
        </div>
    );
}

export default Bill;
