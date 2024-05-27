import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import CreateReport from './CreateReport';
import { Button, TextField, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Cookies from 'js-cookie';
import { Add } from '@mui/icons-material';

function Report({ showCreateForm, setShowCreateForm }) {
  const [reports, setReports] = useState([]);
  const [deleteReportId, setDeleteReportId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredReports, setFilteredReports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);
  const token = Cookies.get('token');

  useEffect(() => {
    refreshReports();
  }, []);

  const refreshReports = async () => {
    try {
      const res = await axios.get('http://localhost:9004/api/report/fetch-reports', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
      const reportsWithUrls = res.data.map(report => {
        const uint8Array = new Uint8Array(report.report.data);
        const blob = new Blob([uint8Array], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        return { ...report, pdfUrl: url };
      });
      setReports(reportsWithUrls);
      setFilteredReports(reportsWithUrls);
    } catch (err) {
      console.error('Error fetching reports:', err);
    }
  };

  const handleDelete = async (id) => {
    setDeleteReportId(id);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:9004/api/report/delete/${deleteReportId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
      setReports(reports.filter(item => item.Report_ID !== deleteReportId));
      setFilteredReports(filteredReports.filter((item) => item.Report_ID !== deleteReportId));

      if (showCreateForm) {
        setShowCreateForm(false);
      }
    } catch (err) {
      console.log(err);
    }
    setDeleteReportId(null);
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleCreateFormToggle = () => {
    setShowCreateForm(!showCreateForm);
  };

  useEffect(() => {
    if (reports.length > 0) {
      const filtered = reports
        .filter((item) => {
          const personalNumberRegex = /^\d+$/;
          const personalNumberStr = String(item.personal_number);
          if (!personalNumberRegex.test(personalNumberStr)) {
            console.warn(`Invalid personal number: ${personalNumberStr}`);
            return false;
          }
          if (searchQuery === '') {
            return true;
          }
          return personalNumberStr.startsWith(searchQuery);
        })
        .sort((a, b) => b.Report_ID - a.Report_ID);
      setFilteredReports(filtered);
    }
  }, [searchQuery, reports]);

  const openPDF = (reportData) => {
    window.open(reportData.pdfUrl, '_blank');
  };

  const columns = [
    { field: 'Report_ID', headerName: 'ID', width: 100 },
    { field: 'personal_number', headerName: 'Personal Number', width: 300 },
    {
      field: 'report',
      headerName: 'Report',
      width: 300,
      renderCell: (params) => (
        <Button
          onClick={() => openPDF(params.row)}
          variant="contained"
          color="primary"
        >
          {`Report_${params.row.Report_ID}.pdf`}
        </Button>
      ),
    },
    {
      field: 'created_at',
      headerName: 'Time created',
      width: 300,
      // valueFormatter: (params) => formatDate(params.value),
    },
    {
      field: 'delete',
      headerName: 'Delete',
      width: 200,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleDelete(params.row.Report_ID)}
        >
          Delete
        </Button>
      ),
    },
  ];

  // function formatDate(dateString) {
  //   const options = { month: 'short', day: 'numeric', year: 'numeric' };
  //   const date = new Date(dateString);
  //   return date.toLocaleDateString('en-US', options);
  // }

  return (
    <div className='container-fluid mt-4'>
        {deleteReportId && (
                <Dialog
                    open={!!deleteReportId}
                    onClose={() => setDeleteReportId(null)}
                >
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this report?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteReportId(null)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleDeleteConfirm} color="secondary">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
        )}
      {showCreateForm ? null : (
        <Box mt={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateFormToggle}
            startIcon={<Add />}
          >
            Create Report
          </Button>
        </Box>
      )}
      {showCreateForm && (
        <CreateReport onClose={() => setShowCreateForm(false)} onSaveSuccess={refreshReports} />
      )}

      <Box mt={4}>
        <TextField
          label="Search by personal number"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchInputChange}
          fullWidth
        />
      </Box>

      <Box mt={4} style={{ height: '100%', width: '100%' }}>
        <DataGrid
          rows={filteredReports}
          columns={columns}
          pageSize={recordsPerPage}
          rowsPerPageOptions={[10]}
          getRowId={(row) => row.Report_ID}
        />
      </Box>
    </div>
  );
}

export default Report;
