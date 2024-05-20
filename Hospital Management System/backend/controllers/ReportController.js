const fs = require('fs');
const path = require('path');
const pdf = require('pdf-creator-node');
const nodemailer = require('nodemailer');
const pdfTemplate = require('../documents');
require('dotenv').config();

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
            patientName, age, patientGender, bloodType,
            admissionDate, dischargeDate, diagnosis,
            doctorName, email, phone, medicines
        } = req.body;

        if (!Array.isArray(medicines)) {
            throw new Error('Medicines should be an array');
        }

        const htmlContent = pdfTemplate({
            patientName, age, patientGender, bloodType,
            admissionDate, dischargeDate, diagnosis,
            doctorName, email, phone, medicines
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

module.exports = {
    createPdf,
    sendEmailWithPdf,
    fetchPdf,
};
