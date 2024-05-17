-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 17, 2024 at 08:51 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hms`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointment`
--

CREATE TABLE `appointment` (
  `Appoint_ID` int(11) NOT NULL,
  `Scheduled_On` date NOT NULL,
  `Date` date NOT NULL,
  `Time` time NOT NULL,
  `Doctor_ID` int(11) NOT NULL,
  `Patient_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bill`
--

CREATE TABLE `bill` (
  `Payment_ID` int(11) NOT NULL,
  `DATE` date NOT NULL,
  `Room_cost` decimal(10,2) DEFAULT NULL,
  `Other_charges` decimal(10,2) DEFAULT NULL,
  `M_Cost` decimal(10,2) DEFAULT NULL,
  `Total` decimal(10,2) NOT NULL,
  `Patient_ID` int(11) NOT NULL,
  `Room_ID` int(11) NOT NULL,
  `Medicine_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `department`
--

CREATE TABLE `department` (
  `Dept_ID` int(11) NOT NULL,
  `Dept_head` varchar(100) DEFAULT NULL,
  `Dept_name` varchar(100) NOT NULL,
  `Emp_Count` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `department`
--

INSERT INTO `department` (`Dept_ID`, `Dept_head`, `Dept_name`, `Emp_Count`) VALUES
(2, 'ff1', '1', 1),
(3, '2', '2', 2);

-- --------------------------------------------------------

--
-- Table structure for table `doctor`
--

CREATE TABLE `doctor` (
  `Doctor_ID` int(11) NOT NULL,
  `Qualifications` varchar(255) NOT NULL,
  `Emp_ID` int(11) NOT NULL,
  `Specialization` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `emergency_contact`
--

CREATE TABLE `emergency_contact` (
  `Contact_ID` int(11) NOT NULL,
  `Contact_Name` varchar(100) NOT NULL,
  `Phone` varchar(20) NOT NULL,
  `Relation` varchar(50) NOT NULL,
  `Patient_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `emergency_contact`
--

INSERT INTO `emergency_contact` (`Contact_ID`, `Contact_Name`, `Phone`, `Relation`, `Patient_ID`) VALUES
(10, 'UBT', '049123456', 'Close family Member', 6),
(13, 'Lind', '323232311', 'Close family Member', 6),
(15, 'ggg', '323232311', 'Father', 6),
(16, 'lind', '323232355', 'Sister', 7),
(17, 'Lind', '2121212122', 'Father', 7),
(18, 'Lind', '121212121', 'Father', 7),
(19, 'tt', '2121212122', 'Sister', 6),
(20, 'Lind', '2121212122', 'Sister', 6),
(21, 'Lind', '2121212122', 'Father', 6),
(22, '666', '2121212122', 'Sister', 6),
(23, 'lind', '2121212122', 'Father', 6),
(24, 'Lind', '212121211', 'Mother', 7);

-- --------------------------------------------------------

--
-- Table structure for table `insurance`
--

CREATE TABLE `insurance` (
  `Policy_Number` int(20) NOT NULL,
  `Patient_ID` int(11) NOT NULL,
  `Ins_Code` varchar(10) NOT NULL,
  `End_Date` date NOT NULL,
  `Provider` varchar(100) NOT NULL,
  `Plan` varchar(100) NOT NULL,
  `Co_Pay` varchar(100) NOT NULL,
  `Coverage` varchar(100) NOT NULL,
  `Maternity` varchar(100) NOT NULL,
  `Dental` varchar(100) NOT NULL,
  `Optical` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `insurance`
--

INSERT INTO `insurance` (`Policy_Number`, `Patient_ID`, `Ins_Code`, `End_Date`, `Provider`, `Plan`, `Co_Pay`, `Coverage`, `Maternity`, `Dental`, `Optical`) VALUES
(58, 6, '7', '2024-05-12', 'Yes', 'No', 'Yes', '25%', 'Yes', 'No', 'Yes'),
(61, 7, '7', '2024-05-12', 'Yes', 'Yes', 'Yes', '50%', 'Yes', 'No', 'Yes'),
(62, 7, '7', '2024-05-20', 'No', 'Yes', 'No', '50%', 'No', 'No', 'No'),
(63, 7, '7', '2024-05-11', 'Yes', 'No', 'Yes', '25%', 'Yes', 'No', 'Yes'),
(64, 7, '7', '2024-06-07', 'Yes', 'No', 'No', '25%', 'No', 'No', 'No'),
(65, 7, '7777', '2024-05-05', 'Yes', 'No', 'No', '25%', 'Yes', 'No', 'No'),
(66, 7, '7', '2024-05-11', 'Yes', 'No', 'No', '50%', 'No', 'No', 'Yes'),
(68, 7, '1212', '2024-05-11', 'Yes', 'No', 'No', '25%', 'Yes', 'No', 'No'),
(69, 7, '8', '2024-05-11', 'Yes', 'No', 'Yes', '50%', 'Yes', 'No', 'No'),
(70, 7, '7', '2024-05-04', 'No', 'No', 'No', '50%', 'No', 'No', 'No'),
(71, 7, '1172711835', '2024-05-04', 'No', 'Yes', 'Yes', '50%', 'Yes', 'No', 'No'),
(72, 6, '111111', '2024-05-04', 'Yes', 'No', 'Yes', '25%', 'No', 'No', 'Yes'),
(73, 7, '121212', '2024-05-12', 'Yes', 'Yes', 'Yes', '25%', 'No', 'No', 'No');

-- --------------------------------------------------------

--
-- Table structure for table `lab_screening`
--

CREATE TABLE `lab_screening` (
  `Lab_ID` int(11) NOT NULL,
  `Patient_ID` int(11) NOT NULL,
  `Technician_ID` int(11) DEFAULT NULL,
  `Doctor_ID` int(11) DEFAULT NULL,
  `Test_Cost` decimal(10,2) DEFAULT NULL,
  `Date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `medical_history`
--

CREATE TABLE `medical_history` (
  `Record_ID` int(11) NOT NULL,
  `Patient_ID` int(11) NOT NULL,
  `Allergies` varchar(255) DEFAULT NULL,
  `Pre_Conditions` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `medicine`
--

CREATE TABLE `medicine` (
  `Medicine_ID` int(11) NOT NULL,
  `M_name` varchar(100) NOT NULL,
  `M_Quantity` int(11) NOT NULL,
  `M_Cost` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `medicine`
--

INSERT INTO `medicine` (`Medicine_ID`, `M_name`, `M_Quantity`, `M_Cost`) VALUES
(37, 'Lind', 2, 2.00),
(38, 'Lind', 2, 2.00),
(40, '1', 1, 1.00),
(41, '21212', 1, 121.00),
(59, 'Lindj', 3, 2.00),
(60, 'pllastika', 1, 1.00),
(68, 'UBt', 1010, 21212.00),
(69, '1', 1, 1.00),
(70, '1', 1, 1.00),
(71, '1', 1, 1.00),
(72, '2', 2, 2.00),
(73, '2', 2, 2.00),
(74, '212', 1212, 121.00),
(75, '121', 2121, 1212.00),
(76, '121', 2, 1212.00),
(77, '1', 1, 1.00),
(78, '1', 1, 1.00),
(79, '1', 212, 121.00),
(80, '1 test', 1, 1.00),
(81, 'Amoxicilin test', 2, 120.00),
(83, 'Lind', 1, 2.00);

-- --------------------------------------------------------

--
-- Table structure for table `nurse`
--

CREATE TABLE `nurse` (
  `Nurse_ID` int(11) NOT NULL,
  `Patient_ID` int(11) NOT NULL,
  `Emp_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `patient`
--

CREATE TABLE `patient` (
  `Patient_ID` int(11) NOT NULL,
  `Patient_Fname` varchar(50) NOT NULL,
  `Patient_Lname` varchar(50) NOT NULL,
  `Blood_type` varchar(10) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `Gender` varchar(10) DEFAULT NULL,
  `Conditionn` varchar(255) DEFAULT NULL,
  `Admission_Date` date NOT NULL,
  `Discharge_Date` date DEFAULT NULL,
  `Phone` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `patient`
--

INSERT INTO `patient` (`Patient_ID`, `Patient_Fname`, `Patient_Lname`, `Blood_type`, `Email`, `Gender`, `Conditionn`, `Admission_Date`, `Discharge_Date`, `Phone`) VALUES
(6, 'Filan', 'Fisteku', 'B+', 'filan@gmail.com', 'Other', '1', '2024-05-02', '2024-05-01', '121212122'),
(7, 'Filane', 'Fisteku', 'A-', 'filane@gmail.com', 'Female', '11111', '2024-05-08', '2024-05-01', '111111111');

-- --------------------------------------------------------

--
-- Table structure for table `payroll`
--

CREATE TABLE `payroll` (
  `Account_no` int(11) NOT NULL,
  `Salary` decimal(10,2) NOT NULL,
  `Bonus` decimal(10,2) DEFAULT NULL,
  `Emp_ID` int(11) NOT NULL,
  `IBAN` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `prescription`
--

CREATE TABLE `prescription` (
  `Prescription_ID` int(11) NOT NULL,
  `Patient_ID` int(11) NOT NULL,
  `Date` date NOT NULL,
  `Dosage` varchar(100) NOT NULL,
  `Doctor_ID` int(11) NOT NULL,
  `Medicine_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rating`
--

CREATE TABLE `rating` (
  `Rating_ID` int(11) NOT NULL,
  `Emp_ID` int(11) NOT NULL,
  `Rating` tinyint(4) NOT NULL,
  `Comments` text DEFAULT NULL,
  `Date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rating`
--

INSERT INTO `rating` (`Rating_ID`, `Emp_ID`, `Rating`, `Comments`, `Date`) VALUES
(10, 2, 5, 'Mire', '2024-05-15'),
(11, 3, 3, 'Mire', '2024-05-15'),
(12, 3, 2, '11', '2024-05-15'),
(13, 2, 2, '2', '2024-05-15'),
(14, 2, 1, '2', '2024-05-15'),
(15, 2, 2, '2', '2024-05-15'),
(16, 2, 1, '2', '2024-05-15'),
(17, 2, 2, '2', '2024-05-15'),
(18, 2, 2, '2', '2024-05-15'),
(19, 2, 1, 'Test', '2024-05-15'),
(21, 3, 4, 'Shume mire', '2024-05-15'),
(22, 2, 4, 'Super mire', '2024-05-15'),
(26, 2, 2, 'Bossi i trent je krejt', '2024-05-15');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `role_id` int(11) NOT NULL,
  `role_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `room`
--

CREATE TABLE `room` (
  `Room_ID` int(11) NOT NULL,
  `Room_type` varchar(20) NOT NULL,
  `Patient_ID` int(11) DEFAULT NULL,
  `Room_cost` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
  `Emp_ID` int(11) NOT NULL,
  `Emp_Fname` varchar(50) NOT NULL,
  `Emp_Lname` varchar(50) NOT NULL,
  `Joining_Date` date NOT NULL,
  `Emp_type` varchar(50) NOT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `Dept_ID` int(11) DEFAULT NULL,
  `SSN` varchar(20) DEFAULT NULL,
  `DOB` date DEFAULT NULL,
  `Date_Separation` date DEFAULT NULL,
  `role_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`Emp_ID`, `Emp_Fname`, `Emp_Lname`, `Joining_Date`, `Emp_type`, `Email`, `Address`, `Dept_ID`, `SSN`, `DOB`, `Date_Separation`, `role_id`) VALUES
(2, 'Lind', 'Geci', '2024-05-03', 'Doctor', 'lindgeci@gmail.com', '1', 2, '2222', '2024-05-03', '2024-05-03', NULL),
(3, 'Blerim', 'Zylfiu', '2024-05-01', 'Doctor', 'lindgeci@gmail.com', '12121', 3, '3232323', '2024-05-04', '2024-05-07', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `userrole`
--

CREATE TABLE `userrole` (
  `user_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  `fullName` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `email`, `username`, `password`, `fullName`, `phone`) VALUES
(7, 'Lind@gmail.com', 'Lind', '$2b$10$ali2V2LF2.BjxJpYGWxQ8uojlq9x66ofpmEBzYDj3sHRhsn7cx9oe', 'Lind', '11111111111111111'),
(8, 'Fjolla@gmail.com', 'Fjolla', '$2b$10$Nxr2Vga9dqsaPXoE.iYweepT4YuOgEOkdNwfGj2Hm0bUwPuhCSOmC', 'Fjolla', '2024'),
(9, 'Bledar@gmail.com', 'Bledar', '$2b$10$5x1rLjjNpPA2J8VXx8XBS.LAlkZx899IHH9ebib4Bm1U3Kx/7dGH.', 'Bledar', '2024'),
(10, 'Alton@gmail.com', 'Alton', '$2b$10$bxBbWQEmz7DA6hy2ULNW5Oz6GnbRfzg42yjkMlgDiXBu2MYBeMpte', 'Alton', '2024'),
(11, 'Egzona@gmail.com', 'Egzona', '$2b$10$8oXIWpvwcqXjt6wLO0jNMe/syZKzrY1vzYFiZupjDCT0OJ0CkRk.G', 'Egzona', '2024');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointment`
--
ALTER TABLE `appointment`
  ADD PRIMARY KEY (`Appoint_ID`),
  ADD KEY `Doctor_ID` (`Doctor_ID`),
  ADD KEY `Patient_ID` (`Patient_ID`);

--
-- Indexes for table `bill`
--
ALTER TABLE `bill`
  ADD PRIMARY KEY (`Payment_ID`),
  ADD KEY `Patient_ID` (`Patient_ID`),
  ADD KEY `Room_ID` (`Room_ID`),
  ADD KEY `Medicine_ID` (`Medicine_ID`);

--
-- Indexes for table `department`
--
ALTER TABLE `department`
  ADD PRIMARY KEY (`Dept_ID`);

--
-- Indexes for table `doctor`
--
ALTER TABLE `doctor`
  ADD PRIMARY KEY (`Doctor_ID`),
  ADD KEY `Emp_ID` (`Emp_ID`);

--
-- Indexes for table `emergency_contact`
--
ALTER TABLE `emergency_contact`
  ADD PRIMARY KEY (`Contact_ID`),
  ADD KEY `Patient_ID` (`Patient_ID`);

--
-- Indexes for table `insurance`
--
ALTER TABLE `insurance`
  ADD PRIMARY KEY (`Policy_Number`),
  ADD KEY `Patient_ID` (`Patient_ID`);

--
-- Indexes for table `lab_screening`
--
ALTER TABLE `lab_screening`
  ADD PRIMARY KEY (`Lab_ID`),
  ADD KEY `Patient_ID` (`Patient_ID`),
  ADD KEY `Doctor_ID` (`Doctor_ID`);

--
-- Indexes for table `medical_history`
--
ALTER TABLE `medical_history`
  ADD PRIMARY KEY (`Record_ID`),
  ADD KEY `Patient_ID` (`Patient_ID`);

--
-- Indexes for table `medicine`
--
ALTER TABLE `medicine`
  ADD PRIMARY KEY (`Medicine_ID`);

--
-- Indexes for table `nurse`
--
ALTER TABLE `nurse`
  ADD PRIMARY KEY (`Nurse_ID`),
  ADD KEY `Patient_ID` (`Patient_ID`),
  ADD KEY `Emp_ID` (`Emp_ID`);

--
-- Indexes for table `patient`
--
ALTER TABLE `patient`
  ADD PRIMARY KEY (`Patient_ID`);

--
-- Indexes for table `payroll`
--
ALTER TABLE `payroll`
  ADD PRIMARY KEY (`Account_no`),
  ADD KEY `Emp_ID` (`Emp_ID`);

--
-- Indexes for table `prescription`
--
ALTER TABLE `prescription`
  ADD PRIMARY KEY (`Prescription_ID`),
  ADD KEY `Patient_ID` (`Patient_ID`),
  ADD KEY `Doctor_ID` (`Doctor_ID`),
  ADD KEY `Medicine_ID` (`Medicine_ID`);

--
-- Indexes for table `rating`
--
ALTER TABLE `rating`
  ADD PRIMARY KEY (`Rating_ID`),
  ADD KEY `Emp_ID` (`Emp_ID`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`),
  ADD UNIQUE KEY `role_name` (`role_name`);

--
-- Indexes for table `room`
--
ALTER TABLE `room`
  ADD PRIMARY KEY (`Room_ID`),
  ADD KEY `Patient_ID` (`Patient_ID`);

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`Emp_ID`),
  ADD KEY `Dept_ID` (`Dept_ID`),
  ADD KEY `role_id` (`role_id`);

--
-- Indexes for table `userrole`
--
ALTER TABLE `userrole`
  ADD PRIMARY KEY (`user_id`,`role_id`),
  ADD KEY `role_id` (`role_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appointment`
--
ALTER TABLE `appointment`
  MODIFY `Appoint_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bill`
--
ALTER TABLE `bill`
  MODIFY `Payment_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `department`
--
ALTER TABLE `department`
  MODIFY `Dept_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `doctor`
--
ALTER TABLE `doctor`
  MODIFY `Doctor_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `emergency_contact`
--
ALTER TABLE `emergency_contact`
  MODIFY `Contact_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `insurance`
--
ALTER TABLE `insurance`
  MODIFY `Policy_Number` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;

--
-- AUTO_INCREMENT for table `lab_screening`
--
ALTER TABLE `lab_screening`
  MODIFY `Lab_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `medical_history`
--
ALTER TABLE `medical_history`
  MODIFY `Record_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `medicine`
--
ALTER TABLE `medicine`
  MODIFY `Medicine_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=84;

--
-- AUTO_INCREMENT for table `nurse`
--
ALTER TABLE `nurse`
  MODIFY `Nurse_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `patient`
--
ALTER TABLE `patient`
  MODIFY `Patient_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `payroll`
--
ALTER TABLE `payroll`
  MODIFY `Account_no` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `prescription`
--
ALTER TABLE `prescription`
  MODIFY `Prescription_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rating`
--
ALTER TABLE `rating`
  MODIFY `Rating_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `room`
--
ALTER TABLE `room`
  MODIFY `Room_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `staff`
--
ALTER TABLE `staff`
  MODIFY `Emp_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `appointment`
--
ALTER TABLE `appointment`
  ADD CONSTRAINT `appointment_ibfk_1` FOREIGN KEY (`Doctor_ID`) REFERENCES `doctor` (`Doctor_ID`),
  ADD CONSTRAINT `appointment_ibfk_2` FOREIGN KEY (`Patient_ID`) REFERENCES `patient` (`Patient_ID`);

--
-- Constraints for table `bill`
--
ALTER TABLE `bill`
  ADD CONSTRAINT `bill_ibfk_1` FOREIGN KEY (`Patient_ID`) REFERENCES `patient` (`Patient_ID`),
  ADD CONSTRAINT `bill_ibfk_2` FOREIGN KEY (`Room_ID`) REFERENCES `room` (`Room_ID`),
  ADD CONSTRAINT `bill_ibfk_3` FOREIGN KEY (`Medicine_ID`) REFERENCES `medicine` (`Medicine_ID`);

--
-- Constraints for table `doctor`
--
ALTER TABLE `doctor`
  ADD CONSTRAINT `doctor_ibfk_1` FOREIGN KEY (`Emp_ID`) REFERENCES `staff` (`Emp_ID`);

--
-- Constraints for table `emergency_contact`
--
ALTER TABLE `emergency_contact`
  ADD CONSTRAINT `emergency_contact_ibfk_1` FOREIGN KEY (`Patient_ID`) REFERENCES `patient` (`Patient_ID`);

--
-- Constraints for table `insurance`
--
ALTER TABLE `insurance`
  ADD CONSTRAINT `insurance_ibfk_1` FOREIGN KEY (`Patient_ID`) REFERENCES `patient` (`Patient_ID`);

--
-- Constraints for table `lab_screening`
--
ALTER TABLE `lab_screening`
  ADD CONSTRAINT `lab_screening_ibfk_1` FOREIGN KEY (`Patient_ID`) REFERENCES `patient` (`Patient_ID`),
  ADD CONSTRAINT `lab_screening_ibfk_2` FOREIGN KEY (`Doctor_ID`) REFERENCES `doctor` (`Doctor_ID`);

--
-- Constraints for table `medical_history`
--
ALTER TABLE `medical_history`
  ADD CONSTRAINT `medical_history_ibfk_1` FOREIGN KEY (`Patient_ID`) REFERENCES `patient` (`Patient_ID`);

--
-- Constraints for table `nurse`
--
ALTER TABLE `nurse`
  ADD CONSTRAINT `nurse_ibfk_1` FOREIGN KEY (`Patient_ID`) REFERENCES `patient` (`Patient_ID`),
  ADD CONSTRAINT `nurse_ibfk_2` FOREIGN KEY (`Emp_ID`) REFERENCES `staff` (`Emp_ID`);

--
-- Constraints for table `payroll`
--
ALTER TABLE `payroll`
  ADD CONSTRAINT `payroll_ibfk_1` FOREIGN KEY (`Emp_ID`) REFERENCES `staff` (`Emp_ID`);

--
-- Constraints for table `prescription`
--
ALTER TABLE `prescription`
  ADD CONSTRAINT `prescription_ibfk_1` FOREIGN KEY (`Patient_ID`) REFERENCES `patient` (`Patient_ID`),
  ADD CONSTRAINT `prescription_ibfk_2` FOREIGN KEY (`Doctor_ID`) REFERENCES `doctor` (`Doctor_ID`),
  ADD CONSTRAINT `prescription_ibfk_3` FOREIGN KEY (`Medicine_ID`) REFERENCES `medicine` (`Medicine_ID`);

--
-- Constraints for table `rating`
--
ALTER TABLE `rating`
  ADD CONSTRAINT `fk_rating_staff` FOREIGN KEY (`Emp_ID`) REFERENCES `staff` (`Emp_ID`),
  ADD CONSTRAINT `rating_ibfk_2` FOREIGN KEY (`Emp_ID`) REFERENCES `staff` (`Emp_ID`);

--
-- Constraints for table `room`
--
ALTER TABLE `room`
  ADD CONSTRAINT `room_ibfk_1` FOREIGN KEY (`Patient_ID`) REFERENCES `patient` (`Patient_ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
