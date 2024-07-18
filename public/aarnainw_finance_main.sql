-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 11, 2024 at 03:48 PM
-- Server version: 5.7.23-23
-- PHP Version: 8.1.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `aarnainw_finance_main`
--
CREATE DATABASE IF NOT EXISTS `aarnainw_finance_main` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE `aarnainw_finance_main`;

-- --------------------------------------------------------

--
-- Table structure for table `booked_clients`
--

DROP TABLE IF EXISTS `booked_clients`;
CREATE TABLE `booked_clients` (
  `User_id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `number` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `alternate_number1` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `alternate_number2` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `booking_details`
--

DROP TABLE IF EXISTS `booking_details`;
CREATE TABLE `booking_details` (
  `booking_id` int(11) NOT NULL,
  `client_id` int(11) DEFAULT NULL,
  `project_id` int(11) DEFAULT NULL,
  `wing` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `flat_no` int(100) DEFAULT NULL,
  `carpet_area` int(11) DEFAULT NULL,
  `closure_date` date DEFAULT NULL,
  `cashback_amount` int(100) DEFAULT NULL,
  `token_amount` int(11) DEFAULT NULL,
  `cashback_submit_date` date DEFAULT NULL,
  `closed_by` int(11) DEFAULT NULL,
  `csop` enum('retail','mandate') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'retail',
  `agreement_value` int(11) DEFAULT NULL,
  `os_status_id` int(11) DEFAULT NULL,
  `configuration_id` int(11) DEFAULT NULL,
  `sourced_by` int(11) DEFAULT NULL,
  `ladder_stage` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `base_brokerage` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `kicker_percent` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `kicker_value` int(255) NOT NULL,
  `ei_percent` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `ei_value` int(255) NOT NULL,
  `ladder_id` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `company`
--

DROP TABLE IF EXISTS `company`;
CREATE TABLE `company` (
  `company_id` int(11) NOT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `developer_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `company_estimation`
--

DROP TABLE IF EXISTS `company_estimation`;
CREATE TABLE `company_estimation` (
  `rowid` int(11) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `commited_days` int(11) DEFAULT NULL,
  `avg_receive_days` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `configuration`
--

DROP TABLE IF EXISTS `configuration`;
CREATE TABLE `configuration` (
  `configuration_id` int(6) NOT NULL,
  `configuration_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `developer`
--

DROP TABLE IF EXISTS `developer`;
CREATE TABLE `developer` (
  `developer_id` int(11) NOT NULL,
  `developer_name` varchar(255) DEFAULT NULL,
  `location_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `ei`
--

DROP TABLE IF EXISTS `ei`;
CREATE TABLE `ei` (
  `ei_id` int(11) NOT NULL,
  `ei_tenure_start_date` date DEFAULT NULL,
  `ei_tenure_end_date` date DEFAULT NULL,
  `ei_target_amount` int(100) DEFAULT NULL,
  `ei_target_unit` int(50) DEFAULT NULL,
  `ei_conditon` enum('AND','OR') NOT NULL,
  `ei_percent` varchar(255) NOT NULL,
  `ei_value` varchar(255) NOT NULL,
  `ei_unique_id` varchar(255) NOT NULL,
  `ei_extended_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `expense`
--

DROP TABLE IF EXISTS `expense`;
CREATE TABLE `expense` (
  `id` int(11) NOT NULL,
  `file_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `file_data` longblob NOT NULL,
  `file_type` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `submit_date` date DEFAULT NULL,
  `desc` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `category_id` int(6) DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  `branch_id` int(6) DEFAULT NULL,
  `sub_category_id` int(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `expense_category`
--

DROP TABLE IF EXISTS `expense_category`;
CREATE TABLE `expense_category` (
  `category_id` int(100) NOT NULL,
  `category_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `files`
--

DROP TABLE IF EXISTS `files`;
CREATE TABLE `files` (
  `id` int(11) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_data` longblob NOT NULL,
  `file_type` enum('fresh','extended') NOT NULL,
  `unique_id` varchar(100) NOT NULL,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int(12) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `followups`
--

DROP TABLE IF EXISTS `followups`;
CREATE TABLE `followups` (
  `followup_id` int(11) NOT NULL,
  `booking_id` int(11) DEFAULT NULL,
  `followup_date` date DEFAULT NULL,
  `followup_type` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `followup_for` int(255) NOT NULL,
  `followup_comment` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `invoice`
--

DROP TABLE IF EXISTS `invoice`;
CREATE TABLE `invoice` (
  `company_id` int(11) DEFAULT NULL,
  `invoice_number` int(11) NOT NULL,
  `submit_date` date DEFAULT NULL,
  `received_date` date DEFAULT NULL,
  `cancellation_date` date DEFAULT NULL,
  `cancel_reason` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `cancel_type` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `invoice_raise_date` date DEFAULT NULL,
  `invoice_value` int(255) NOT NULL,
  `expected_receive_date` date DEFAULT NULL,
  `invoice_receive_date` date DEFAULT NULL,
  `client_id` int(11) DEFAULT NULL,
  `post_raise_id` int(11) DEFAULT NULL,
  `raise_status_id` int(11) DEFAULT NULL,
  `updated_on` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int(11) NOT NULL,
  `invoice_type` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `invoice_post_raise_status`
--

DROP TABLE IF EXISTS `invoice_post_raise_status`;
CREATE TABLE `invoice_post_raise_status` (
  `status_id` int(11) NOT NULL,
  `status_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `invoice_raise_status`
--

DROP TABLE IF EXISTS `invoice_raise_status`;
CREATE TABLE `invoice_raise_status` (
  `raise_status_id` int(11) NOT NULL,
  `status_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `kicker`
--

DROP TABLE IF EXISTS `kicker`;
CREATE TABLE `kicker` (
  `kicker_row_id` int(11) NOT NULL,
  `kicker_start_date` date DEFAULT NULL,
  `kicker_end_date` date DEFAULT NULL,
  `Kicker_target_in_amount` int(55) DEFAULT NULL,
  `Kicker_target_in_unit` int(50) DEFAULT NULL,
  `kicker_condition` enum('AND','OR') NOT NULL,
  `kicker_in_percent` varchar(255) DEFAULT NULL,
  `kicker_in_value` varchar(255) NOT NULL,
  `kicker_extended` int(55) NOT NULL,
  `kicker_unique_id` varchar(255) NOT NULL,
  `kicker_extended_date` date DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `ladder`
--

DROP TABLE IF EXISTS `ladder`;
CREATE TABLE `ladder` (
  `ladder_row_id` int(11) NOT NULL,
  `ladder_stage` varchar(255) DEFAULT NULL,
  `ladder_stage_start` int(11) DEFAULT NULL,
  `ladder_stage_end` int(11) DEFAULT NULL,
  `stage_percent` decimal(10,2) DEFAULT NULL,
  `ladder_start_date` date DEFAULT NULL,
  `ladder_end_date` date DEFAULT NULL,
  `ladder_extended_date` date DEFAULT NULL,
  `ladder_id` varchar(255) DEFAULT NULL,
  `ladder_type` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `locality`
--

DROP TABLE IF EXISTS `locality`;
CREATE TABLE `locality` (
  `locality_id` int(255) NOT NULL,
  `locality_name` varchar(255) DEFAULT NULL,
  `location_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `location`
--

DROP TABLE IF EXISTS `location`;
CREATE TABLE `location` (
  `location_id` int(11) NOT NULL,
  `location_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `ob_status_records`
--

DROP TABLE IF EXISTS `ob_status_records`;
CREATE TABLE `ob_status_records` (
  `ob_record_id` int(11) NOT NULL,
  `booking_id` int(11) DEFAULT NULL,
  `status_id` int(11) DEFAULT NULL,
  `expected` date DEFAULT NULL,
  `completed` date DEFAULT NULL,
  `ba2_date` date DEFAULT NULL,
  `sdr_date` date DEFAULT NULL,
  `composite_date` date DEFAULT NULL,
  `ba_4` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ob_table`
--

DROP TABLE IF EXISTS `ob_table`;
CREATE TABLE `ob_table` (
  `OB_status` int(11) NOT NULL,
  `OB_status_name` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `order_value` int(11) DEFAULT NULL,
  `ob_show_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `project`
--

DROP TABLE IF EXISTS `project`;
CREATE TABLE `project` (
  `project_id` int(11) NOT NULL,
  `project_name` varchar(255) DEFAULT NULL,
  `company_id` int(11) DEFAULT NULL,
  `locality_id` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `project_ei`
--

DROP TABLE IF EXISTS `project_ei`;
CREATE TABLE `project_ei` (
  `relation_id` int(11) NOT NULL,
  `project_id` int(11) DEFAULT NULL,
  `ei_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `project_kicker`
--

DROP TABLE IF EXISTS `project_kicker`;
CREATE TABLE `project_kicker` (
  `relation_id` int(11) NOT NULL,
  `project_id` int(11) DEFAULT NULL,
  `kicker_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `project_ladder`
--

DROP TABLE IF EXISTS `project_ladder`;
CREATE TABLE `project_ladder` (
  `relation_id` int(11) NOT NULL,
  `project_id` int(11) DEFAULT NULL,
  `ladder_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `sales_emp`
--

DROP TABLE IF EXISTS `sales_emp`;
CREATE TABLE `sales_emp` (
  `sales_user_id` int(11) NOT NULL,
  `user_name` varchar(100) DEFAULT NULL,
  `manager_id` int(6) NOT NULL,
  `designation` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `sub_category_expense`
--

DROP TABLE IF EXISTS `sub_category_expense`;
CREATE TABLE `sub_category_expense` (
  `sub_id` int(100) NOT NULL,
  `sub_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `category_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `booked_clients`
--
ALTER TABLE `booked_clients`
  ADD PRIMARY KEY (`User_id`);

--
-- Indexes for table `booking_details`
--
ALTER TABLE `booking_details`
  ADD PRIMARY KEY (`booking_id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `closed_by` (`closed_by`),
  ADD KEY `os_status_id` (`os_status_id`),
  ADD KEY `client_id` (`client_id`),
  ADD KEY `fk_booking_details_configuration` (`configuration_id`),
  ADD KEY `fk_booking_details_sourcedby` (`sourced_by`);

--
-- Indexes for table `company`
--
ALTER TABLE `company`
  ADD PRIMARY KEY (`company_id`),
  ADD UNIQUE KEY `unique_company_name_constraint` (`company_name`),
  ADD KEY `developer_id` (`developer_id`);

--
-- Indexes for table `company_estimation`
--
ALTER TABLE `company_estimation`
  ADD PRIMARY KEY (`rowid`),
  ADD KEY `foreignkey_fk1` (`company_id`);

--
-- Indexes for table `configuration`
--
ALTER TABLE `configuration`
  ADD PRIMARY KEY (`configuration_id`);

--
-- Indexes for table `developer`
--
ALTER TABLE `developer`
  ADD PRIMARY KEY (`developer_id`),
  ADD UNIQUE KEY `unique_developer_name_constraint` (`developer_name`),
  ADD KEY `fk_developer_location` (`location_id`);

--
-- Indexes for table `ei`
--
ALTER TABLE `ei`
  ADD PRIMARY KEY (`ei_id`);

--
-- Indexes for table `expense`
--
ALTER TABLE `expense`
  ADD PRIMARY KEY (`id`),
  ADD KEY `branch_id` (`branch_id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `sub_category_id` (`sub_category_id`);

--
-- Indexes for table `expense_category`
--
ALTER TABLE `expense_category`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `files`
--
ALTER TABLE `files`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `followups`
--
ALTER TABLE `followups`
  ADD PRIMARY KEY (`followup_id`),
  ADD KEY `followups_ibfk_1` (`booking_id`);

--
-- Indexes for table `invoice`
--
ALTER TABLE `invoice`
  ADD PRIMARY KEY (`invoice_number`),
  ADD UNIQUE KEY `invoice_number` (`invoice_number`),
  ADD KEY `fk_post_raise_id` (`post_raise_id`),
  ADD KEY `fk_raise_status_id` (`raise_status_id`),
  ADD KEY `fk_client_id` (`client_id`),
  ADD KEY `fk_invoice_company` (`company_id`);

--
-- Indexes for table `invoice_post_raise_status`
--
ALTER TABLE `invoice_post_raise_status`
  ADD PRIMARY KEY (`status_id`);

--
-- Indexes for table `invoice_raise_status`
--
ALTER TABLE `invoice_raise_status`
  ADD PRIMARY KEY (`raise_status_id`);

--
-- Indexes for table `kicker`
--
ALTER TABLE `kicker`
  ADD PRIMARY KEY (`kicker_row_id`);

--
-- Indexes for table `ladder`
--
ALTER TABLE `ladder`
  ADD PRIMARY KEY (`ladder_row_id`);

--
-- Indexes for table `locality`
--
ALTER TABLE `locality`
  ADD PRIMARY KEY (`locality_id`),
  ADD UNIQUE KEY `unique_locality_name_constraint` (`locality_name`),
  ADD KEY `location_id` (`location_id`);

--
-- Indexes for table `location`
--
ALTER TABLE `location`
  ADD PRIMARY KEY (`location_id`),
  ADD UNIQUE KEY `unique_location_name_constraint` (`location_name`);

--
-- Indexes for table `ob_status_records`
--
ALTER TABLE `ob_status_records`
  ADD PRIMARY KEY (`ob_record_id`),
  ADD KEY `booking_id` (`booking_id`),
  ADD KEY `status_id` (`status_id`);

--
-- Indexes for table `ob_table`
--
ALTER TABLE `ob_table`
  ADD PRIMARY KEY (`OB_status`);

--
-- Indexes for table `project`
--
ALTER TABLE `project`
  ADD PRIMARY KEY (`project_id`),
  ADD UNIQUE KEY `unique_project_name_constraint` (`project_name`),
  ADD KEY `company_id` (`company_id`),
  ADD KEY `locality_id` (`locality_id`);

--
-- Indexes for table `project_ei`
--
ALTER TABLE `project_ei`
  ADD PRIMARY KEY (`relation_id`),
  ADD KEY `project_id` (`project_id`);

--
-- Indexes for table `project_kicker`
--
ALTER TABLE `project_kicker`
  ADD PRIMARY KEY (`relation_id`),
  ADD KEY `project_id` (`project_id`);

--
-- Indexes for table `project_ladder`
--
ALTER TABLE `project_ladder`
  ADD PRIMARY KEY (`relation_id`),
  ADD KEY `project_id` (`project_id`);

--
-- Indexes for table `sales_emp`
--
ALTER TABLE `sales_emp`
  ADD PRIMARY KEY (`sales_user_id`);

--
-- Indexes for table `sub_category_expense`
--
ALTER TABLE `sub_category_expense`
  ADD PRIMARY KEY (`sub_id`),
  ADD KEY `category_id` (`category_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `booked_clients`
--
ALTER TABLE `booked_clients`
  MODIFY `User_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `company_estimation`
--
ALTER TABLE `company_estimation`
  MODIFY `rowid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ei`
--
ALTER TABLE `ei`
  MODIFY `ei_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `expense`
--
ALTER TABLE `expense`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `expense_category`
--
ALTER TABLE `expense_category`
  MODIFY `category_id` int(100) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `files`
--
ALTER TABLE `files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `followups`
--
ALTER TABLE `followups`
  MODIFY `followup_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `invoice`
--
ALTER TABLE `invoice`
  MODIFY `invoice_number` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `invoice_post_raise_status`
--
ALTER TABLE `invoice_post_raise_status`
  MODIFY `status_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `invoice_raise_status`
--
ALTER TABLE `invoice_raise_status`
  MODIFY `raise_status_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kicker`
--
ALTER TABLE `kicker`
  MODIFY `kicker_row_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ladder`
--
ALTER TABLE `ladder`
  MODIFY `ladder_row_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `locality`
--
ALTER TABLE `locality`
  MODIFY `locality_id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ob_status_records`
--
ALTER TABLE `ob_status_records`
  MODIFY `ob_record_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `project_ei`
--
ALTER TABLE `project_ei`
  MODIFY `relation_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `project_kicker`
--
ALTER TABLE `project_kicker`
  MODIFY `relation_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `project_ladder`
--
ALTER TABLE `project_ladder`
  MODIFY `relation_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sub_category_expense`
--
ALTER TABLE `sub_category_expense`
  MODIFY `sub_id` int(100) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `booking_details`
--
ALTER TABLE `booking_details`
  ADD CONSTRAINT `booking_details_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`),
  ADD CONSTRAINT `booking_details_ibfk_3` FOREIGN KEY (`closed_by`) REFERENCES `sales_emp` (`sales_user_id`),
  ADD CONSTRAINT `booking_details_ibfk_4` FOREIGN KEY (`os_status_id`) REFERENCES `ob_status_records` (`ob_record_id`),
  ADD CONSTRAINT `booking_details_ibfk_5` FOREIGN KEY (`client_id`) REFERENCES `booked_clients` (`User_id`),
  ADD CONSTRAINT `fk_booking_details_configuration` FOREIGN KEY (`configuration_id`) REFERENCES `configuration` (`configuration_id`),
  ADD CONSTRAINT `fk_booking_details_sourcedby` FOREIGN KEY (`sourced_by`) REFERENCES `sales_emp` (`sales_user_id`),
  ADD CONSTRAINT `fk_closed_by_refrence` FOREIGN KEY (`closed_by`) REFERENCES `sales_emp` (`sales_user_id`);

--
-- Constraints for table `company`
--
ALTER TABLE `company`
  ADD CONSTRAINT `company_ibfk_1` FOREIGN KEY (`developer_id`) REFERENCES `developer` (`developer_id`);

--
-- Constraints for table `company_estimation`
--
ALTER TABLE `company_estimation`
  ADD CONSTRAINT `foreignkey_fk1` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`);

--
-- Constraints for table `developer`
--
ALTER TABLE `developer`
  ADD CONSTRAINT `fk_developer_location` FOREIGN KEY (`location_id`) REFERENCES `location` (`location_id`);

--
-- Constraints for table `expense`
--
ALTER TABLE `expense`
  ADD CONSTRAINT `expense_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `location` (`location_id`),
  ADD CONSTRAINT `expense_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `expense_category` (`category_id`),
  ADD CONSTRAINT `expense_ibfk_3` FOREIGN KEY (`sub_category_id`) REFERENCES `sub_category_expense` (`sub_id`);

--
-- Constraints for table `followups`
--
ALTER TABLE `followups`
  ADD CONSTRAINT `followups_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `booking_details` (`booking_id`);

--
-- Constraints for table `invoice`
--
ALTER TABLE `invoice`
  ADD CONSTRAINT `fk_client_id` FOREIGN KEY (`client_id`) REFERENCES `booked_clients` (`User_id`),
  ADD CONSTRAINT `fk_invoice_company` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`),
  ADD CONSTRAINT `fk_post_raise_id` FOREIGN KEY (`post_raise_id`) REFERENCES `invoice_post_raise_status` (`status_id`),
  ADD CONSTRAINT `fk_raise_status_id` FOREIGN KEY (`raise_status_id`) REFERENCES `invoice_raise_status` (`raise_status_id`);

--
-- Constraints for table `locality`
--
ALTER TABLE `locality`
  ADD CONSTRAINT `locality_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `location` (`location_id`);

--
-- Constraints for table `ob_status_records`
--
ALTER TABLE `ob_status_records`
  ADD CONSTRAINT `ob_status_records_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `booking_details` (`booking_id`),
  ADD CONSTRAINT `ob_status_records_ibfk_2` FOREIGN KEY (`status_id`) REFERENCES `ob_table` (`OB_status`);

--
-- Constraints for table `project`
--
ALTER TABLE `project`
  ADD CONSTRAINT `project_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`),
  ADD CONSTRAINT `project_ibfk_2` FOREIGN KEY (`locality_id`) REFERENCES `locality` (`locality_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `project_ei`
--
ALTER TABLE `project_ei`
  ADD CONSTRAINT `project_ei_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`);

--
-- Constraints for table `project_kicker`
--
ALTER TABLE `project_kicker`
  ADD CONSTRAINT `project_kicker_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`);

--
-- Constraints for table `project_ladder`
--
ALTER TABLE `project_ladder`
  ADD CONSTRAINT `project_ladder_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`);

--
-- Constraints for table `sub_category_expense`
--
ALTER TABLE `sub_category_expense`
  ADD CONSTRAINT `sub_category_expense_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `expense_category` (`category_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
