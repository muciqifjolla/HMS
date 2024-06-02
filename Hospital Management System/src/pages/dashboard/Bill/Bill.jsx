import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Button, TextField, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Cookies from 'js-cookie';
import { Add, Delete, Update } from '@mui/icons-material';
import CreateBill from './CreateBill';


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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const billRes = await axios.get('http://localhost:9004/api/bills', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const billsDataWithNames = billRes.data.map(res => {
                    const patient = res.Patient;                    
                    return {
                        ...res,
                        Patient_Name: patient ? `${patient.Patient_Fname} ${patient.Patient_Lname}` : 'Unknown'
                    };
                });

                setBills(billsDataWithNames);
                setIsDataLoaded(true);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [token]);

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
        { field: 'Bill_ID', headerName: 'ID', width: 100 },
        { field: 'Patient_Name', headerName: 'Patient Name', width: 200 },
        { field: 'Date_Issued', headerName: 'Date Issued', width: 200 },
        { field: 'Description', headerName: 'Description', width: 200 },
        { field: 'Amount', headerName: 'Amount', width: 200 },
        { field: 'Payment_Status', headerName: 'Payment Status', width: 200 },
        {
            field: 'update',
            headerName: 'Update',
            width: 150,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleUpdateButtonClick(params.row.Bill_ID)}
                    startIcon={<Update />}
                >
                    Update
                </Button>
            )
        },
        {
            field: 'delete',
            headerName: 'Delete',
            width: 150,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(params.row.Bill_ID)}
                    startIcon={<Delete />}
                >
                    Delete
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

            {!showCreateForm && (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreateFormToggle}
                    startIcon={<Add />}
                >
                    Create Bill
                </Button>
            )}

            {showCreateForm && <CreateBill onClose={() => setShowCreateForm(false)} />}
            
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
                        rows={filteredBills}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        getRowId={(row) => row.Bill_ID}
                        autoHeight
                        hideFooterSelectedRowCount
                    />
                )}
            </Box>
        </div>
    );
}

export default Bill;
