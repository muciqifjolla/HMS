const fs = require('fs');
const path = require('path');
const pdf = require('pdf-creator-node');
const nodemailer = require('nodemailer');
const pdfTemplate = require('../documents');
const PdfReport = require('../models/PdfReport');
require('dotenv').config();
const Report = require('../models/PdfReport');

const outputFilePath = path.join(__dirname, '../result.pdf');

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

const createPdf = async (req, res) => {
    try {
        const {
            personalNumber, patientName, age, patientGender, bloodType, diagnosis,
            doctorName, email, phone, condition, therapy, dateOfVisit
        } = req.body;

        const htmlContent = pdfTemplate({
            personalNumber, patientName, age, patientGender, bloodType, diagnosis,
            doctorName, email, phone, condition, therapy, dateOfVisit
        });

        const document = {
            html: htmlContent,
            data: {},
            path: outputFilePath,
        };

        const options = {
            format: 'A4',
            orientation: 'portrait',
            border: '10mm',
        };

        await pdf.create(document, options);

        if (!fs.existsSync(outputFilePath)) {
            throw new Error('PDF file was not created');
        }

        res.status(200).sendFile(outputFilePath);
    } catch (error) {
        console.error('Error creating PDF:', error);
        res.status(500).send(`Error creating PDF: ${error.message}`);
    }
};

const sendEmailWithPdf = async (req, res) => {
    try {
        const { email, patientName } = req.body;

        if (!fs.existsSync(outputFilePath)) {
            throw new Error('PDF file not found');
        }

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: 'Patient Report',
            text: `Dear ${patientName},

            Please find the attached patient report for your recent hospital visit.

            If you have any questions or need further assistance, please do not hesitate to contact us.

            Best regards,
            LIFELINE Hospital

            Contact Information:
            - Phone: +38349111222
            - Email: ${process.env.GMAIL_USER}`,
            attachments: [
                {
                    filename: 'patient_report.pdf',
                    path: outputFilePath,
                },
            ],
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                res.status(500).send('Error sending email');
            } else {
                console.log('Email sent:', info.response);
                res.status(200).send('Email sent');
            }
        });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send(`Error sending email: ${error.message}`);
    }
};

const fetchPdf = (req, res) => {
    if (fs.existsSync(outputFilePath)) {
        res.setHeader('Content-Type', 'application/pdf');
        res.sendFile(outputFilePath);
    } else {
        res.status(404).send('PDF not found');
    }
};

const saveReportToDB = async (req, res) => {
    try {
        console.log('Request files:', req.files);
        console.log('Request body:', req.body);

        let personalNumber = req.body.personalNumber;

        console.log('Received personalNumber:', personalNumber);

        if (typeof personalNumber === 'number') {
            personalNumber = personalNumber.toString();
        }

        if (typeof personalNumber !== 'string') {
            throw new Error('personalNumber must be a string');
        }

        if (!req.files || !req.files.report) {
            throw new Error('PDF report file is missing');
        }

        const pdfReportData = req.files.report.data;

        const pdfReport = await PdfReport.create({
            personal_number: personalNumber,
            report: pdfReportData,
        });

        res.status(200).json({ message: 'Report saved to database successfully', pdfReport });
    } catch (error) {
        console.error('Error saving report to database:', error);
        res.status(500).json({ error: 'Error saving report to database', message: error.message });
    }
};

const fetchReportsFromDB = async (req, res) => {
    try {
        const reports = await PdfReport.findAll();
        res.json(reports);
    } catch (error) {
        console.error('Error fetching reports from database:', error);
        res.status(500).json({ error: 'Error fetching reports from database' });
    }
};

const deleteReport = async (req, res) => {
    try {
        const deleted = await Report.destroy({
            where: { Report_ID: req.params.id },
        });
        if (deleted === 0) {
            return res.status(404).json({ error: 'Report not found' });
        }
        res.json({ success: true, message: 'Report deleted successfully' });
    } catch (error) {
        console.error('Error deleting report:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    createPdf,
    sendEmailWithPdf,
    fetchPdf,
    saveReportToDB,
    fetchReportsFromDB,
    deleteReport
};
