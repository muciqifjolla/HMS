const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { createPdf, 
    sendEmailWithPdf, 
    fetchPdf, 
    saveReportToDB, 
    fetchReportsFromDB,
    deleteReport
    } = require('../controllers/ReportController');

router.post('/report/create-pdf', authenticateToken(['admin', 'doctor', 'patient']), createPdf);
router.post('/report/send-email', authenticateToken(['admin', 'doctor', 'patient']), sendEmailWithPdf);
router.get('/report/fetch-pdf', authenticateToken(['admin', 'doctor', 'patient']), fetchPdf);
router.post('/report/save-report-to-db', authenticateToken(['admin', 'doctor', 'patient']), saveReportToDB);
router.get('/report/fetch-reports', authenticateToken(['admin', 'doctor', 'patient']), fetchReportsFromDB);
router.delete("/report/delete/:id", deleteReport);

module.exports = router;
