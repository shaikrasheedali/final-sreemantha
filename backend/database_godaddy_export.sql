-- ========================================================
-- Sreemantha Hospital Platform - Production MySQL Database Export
-- Clean Database with Local Codebase Assets Only (Zero External URLs)
-- Ready for GoDaddy Hosted MySQL Database Integration
-- Generated at: 2026-10-15T09:38:20.007Z
-- ========================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';

-- --------------------------------------------------------
-- Table structure for table `appointments`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `appointments`;
CREATE TABLE `appointments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `patient_name` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `department` varchar(100) NOT NULL,
  `doctor_name` varchar(255) DEFAULT NULL,
  `preferred_date` date DEFAULT NULL,
  `preferred_time` varchar(50) NOT NULL,
  `reason` text,
  `status` varchar(50) NOT NULL DEFAULT 'waiting',
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

-- Dumping data for table `appointments` (63 rows)

INSERT INTO `appointments` (`id`, `patient_name`, `phone`, `email`, `department`, `doctor_name`, `preferred_date`, `preferred_time`, `reason`, `status`, `notes`, `created_at`) VALUES
  (1, 'Suresh Reddy', '+919876543210', 'suresh@example.com', 'Fertility and Reproductive Medicine', 'Dr. S. Sreemantha Rao', '2026-10-14T18:30:00.000Z', 'Morning (10 AM - 1 PM)', 'First time consultation for IVF evaluation', 'New', NULL, '2026-09-28T15:34:47.000Z'),
  (2, 'Suresh Reddy', '+919876543210', 'suresh@example.com', 'Fertility and Reproductive Medicine', 'Dr. S. Sreemantha Rao', '2026-10-14T18:30:00.000Z', 'Morning (10 AM - 1 PM)', 'First time consultation for IVF evaluation', 'New', NULL, '2026-09-28T15:35:29.000Z'),
  (3, 'Suresh Reddy', '+919876543210', 'suresh@example.com', 'Fertility and Reproductive Medicine', 'Dr. S. Sreemantha Rao', '2026-10-14T18:30:00.000Z', 'Morning (10 AM - 1 PM)', 'First time consultation for IVF evaluation', 'New', NULL, '2026-09-28T15:35:43.000Z'),
  (4, 'Suresh Reddy', '+919876543210', 'suresh@example.com', 'Fertility and Reproductive Medicine', 'Dr. S. Sreemantha Rao', '2026-10-14T18:30:00.000Z', 'Morning (10 AM - 1 PM)', 'First time consultation for IVF evaluation', 'New', NULL, '2026-09-28T15:48:20.000Z'),
  (5, 'Playwright Test Patient', '+91 98765 43210', NULL, 'Fertility and Reproductive Medicine', 'Any Available Specialist', '2026-09-28T18:30:00.000Z', 'Morning (10 AM - 1 PM)', NULL, 'New', NULL, '2026-09-28T15:49:48.000Z'),
  (6, 'Modal Patient Test', '+91 99887 76655', NULL, 'Fertility and Reproductive Medicine', 'Any Available Specialist', '2026-09-28T18:30:00.000Z', 'Morning (10 AM - 1 PM)', NULL, 'New', NULL, '2026-09-28T15:49:50.000Z'),
  (7, 'Playwright Test Patient', '+91 98765 43210', NULL, 'Fertility and Reproductive Medicine', 'Any Available Specialist', '2026-09-28T18:30:00.000Z', 'Morning (10 AM - 1 PM)', NULL, 'New', NULL, '2026-09-28T15:50:55.000Z'),
  (8, 'Modal Patient Test', '+91 99887 76655', NULL, 'Fertility and Reproductive Medicine', 'Any Available Specialist', '2026-09-28T18:30:00.000Z', 'Morning (10 AM - 1 PM)', NULL, 'New', NULL, '2026-09-28T15:50:57.000Z'),
  (9, 'Suresh Reddy', '+919876543210', 'suresh@example.com', 'Fertility and Reproductive Medicine', 'Dr. S. Sreemantha Rao', '2026-10-14T18:30:00.000Z', 'Morning (10 AM - 1 PM)', 'First time consultation for IVF evaluation', 'New', NULL, '2026-09-28T16:28:37.000Z'),
  (10, 'Playwright Test Patient', '+91 98765 43210', NULL, 'Fertility & Reproductive Medicine (IVF/IUI)', 'Any Available Specialist', '2026-09-28T18:30:00.000Z', 'Morning (10 AM - 1 PM)', NULL, 'New', NULL, '2026-09-28T16:28:59.000Z'),
  (11, 'Modal Patient Test', '+91 99887 76655', NULL, 'Fertility and Reproductive Medicine', 'Any Available Specialist', '2026-09-28T18:30:00.000Z', 'Morning (10 AM - 1 PM)', NULL, 'New', NULL, '2026-09-28T16:29:34.000Z'),
  (12, 'Playwright Test Patient', '+91 98765 43210', NULL, 'Fertility & Reproductive Medicine (IVF/IUI)', 'Any Available Specialist', '2026-09-28T18:30:00.000Z', 'Morning (10 AM - 1 PM)', NULL, 'New', NULL, '2026-09-28T16:40:56.000Z'),
  (13, 'Modal Patient Test', '+91 99887 76655', NULL, 'Fertility and Reproductive Medicine', 'Any Available Specialist', '2026-09-28T18:30:00.000Z', 'Morning (10 AM - 1 PM)', NULL, 'New', NULL, '2026-09-28T16:41:17.000Z'),
  (14, 'Priya Sharma', '+91 98765 43210', 'priya.sharma@example.com', 'Fertility & IVF', 'Available Specialist', '2026-10-14T18:30:00.000Z', 'Morning (10:00 AM - 01:00 PM)', 'Fertility consultation and IVF guidance', 'New', '', '2026-09-28T18:00:38.000Z'),
  (15, 'Priya Sharma', '+91 98765 43210', 'priya.sharma@example.com', 'Fertility & IVF', 'Available Specialist', '2026-10-14T18:30:00.000Z', 'Morning (10:00 AM - 01:00 PM)', 'Fertility consultation and IVF guidance', 'New', '', '2026-09-28T18:03:48.000Z'),
  (16, 'Priya Sharma', '+91 98765 43210', 'priya.sharma@example.com', 'Fertility & IVF', 'Available Specialist', '2026-10-14T18:30:00.000Z', 'Morning (10:00 AM - 01:00 PM)', 'Fertility consultation and IVF guidance', 'New', '', '2026-09-28T18:04:23.000Z'),
  (17, 'Priya Sharma', '+91 98765 43210', 'priya.sharma@example.com', 'Fertility & IVF', 'Available Specialist', '2026-10-14T18:30:00.000Z', 'Morning (10:00 AM - 01:00 PM)', 'Fertility consultation and IVF guidance', 'New', '', '2026-09-28T18:24:47.000Z'),
  (18, 'Priya Sharma', '+91 98765 43210', 'priya.sharma@example.com', 'Fertility & IVF', 'Available Specialist', '2026-10-14T18:30:00.000Z', 'Morning (10:00 AM - 01:00 PM)', 'Fertility consultation and IVF guidance', 'New', '', '2026-09-28T18:26:36.000Z'),
  (19, 'Priya Sharma', '+91 98765 43210', 'priya.sharma@example.com', 'Fertility & IVF', 'Available Specialist', '2026-10-14T18:30:00.000Z', 'Morning (10:00 AM - 01:00 PM)', 'Fertility consultation and IVF guidance', 'New', NULL, '2026-09-28T18:49:37.000Z'),
  (20, 'Playwright Test Patient', '9876543210', NULL, 'Fertility & Reproductive Medicine', 'Available Specialist', NULL, 'Morning', 'Automated E2E booking test inquiry.', 'New', NULL, '2026-09-28T18:49:56.000Z'),
  (21, 'Playwright Test Patient', '9876543210', 'patient@example.com', 'Fertility & Reproductive Medicine', 'Available Specialist', '2026-09-29T18:30:00.000Z', 'Morning (10:00 AM - 01:00 PM)', 'Automated E2E booking test inquiry.', 'New', NULL, '2026-09-28T18:53:39.000Z'),
  (22, 'Priya Sharma', '+91 98765 43210', 'priya.sharma@example.com', 'Fertility & IVF', 'Available Specialist', '2026-10-14T18:30:00.000Z', 'Morning (10:00 AM - 01:00 PM)', 'Fertility consultation and IVF guidance', 'New', NULL, '2026-09-28T18:57:57.000Z'),
  (23, 'Playwright Test Patient', '9876543210', 'patient@example.com', 'Fertility & Reproductive Medicine', 'Available Specialist', '2026-09-29T18:30:00.000Z', 'Morning (10:00 AM - 01:00 PM)', 'Automated E2E booking test inquiry.', 'New', NULL, '2026-09-28T18:58:45.000Z'),
  (24, 'Priya Sharma', '+91 98765 43210', 'priya.sharma@example.com', 'Fertility & IVF', 'Available Specialist', '2026-10-14T18:30:00.000Z', 'Morning (10:00 AM - 01:00 PM)', 'Fertility consultation and IVF guidance', 'New', NULL, '2026-09-29T11:50:55.000Z'),
  (25, 'Priya Sharma', '+91 98765 43210', 'priya.sharma@example.com', 'Fertility & IVF', 'Available Specialist', '2026-10-14T18:30:00.000Z', 'Morning (10:00 AM - 01:00 PM)', 'Fertility consultation and IVF guidance', 'New', NULL, '2026-10-01T12:14:40.000Z'),
  (26, 'Priya Sharma', '+91 98765 43210', 'priya.sharma@example.com', 'Fertility & IVF', 'Available Specialist', '2026-10-14T18:30:00.000Z', 'Morning (10:00 AM - 01:00 PM)', 'Fertility consultation and IVF guidance', 'New', NULL, '2026-10-01T12:17:30.000Z'),
  (27, 'Priya Sharma', '+91 98765 43210', 'priya.sharma@example.com', 'Fertility & IVF', 'Available Specialist', '2026-10-14T18:30:00.000Z', 'Morning (10:00 AM - 01:00 PM)', 'Fertility consultation and IVF guidance', 'New', NULL, '2026-10-01T12:29:06.000Z'),
  (28, 'Priya Sharma', '+91 98765 43210', 'priya.sharma@example.com', 'Fertility & IVF', 'Available Specialist', '2026-10-14T18:30:00.000Z', 'Morning (10:00 AM - 01:00 PM)', 'Fertility consultation and IVF guidance', 'New', NULL, '2026-10-01T12:35:27.000Z'),
  (29, 'Playwright Test Patient', '9876543210', 'patient@example.com', 'Fertility & Reproductive Medicine', 'Available Specialist', '2026-10-01T18:30:00.000Z', 'Morning (09:30 AM – 01:00 PM)', 'Automated E2E booking test inquiry.', 'New', NULL, '2026-10-01T12:36:00.000Z'),
  (30, 'Playwright Test Patient', '9876543210', 'patient@example.com', 'Fertility & Reproductive Medicine', 'Available Specialist', '2026-10-01T18:30:00.000Z', 'Morning (09:30 AM – 01:00 PM)', 'Automated E2E booking test inquiry.', 'New', NULL, '2026-10-01T12:45:49.000Z'),
  (31, 'Priya Sharma', '+91 98765 43210', 'priya.sharma@example.com', 'Fertility & IVF', 'Available Specialist', '2026-10-14T18:30:00.000Z', 'Morning (10:00 AM - 01:00 PM)', 'Fertility consultation and IVF guidance', 'New', NULL, '2026-10-01T12:48:15.000Z'),
  (32, 'Priya Sharma', '+91 98765 43210', 'priya.sharma@example.com', 'Fertility & IVF', 'Available Specialist', '2026-10-14T18:30:00.000Z', 'Morning (10:00 AM - 01:00 PM)', 'Fertility consultation and IVF guidance', 'New', NULL, '2026-10-01T12:49:50.000Z'),
  (33, 'Playwright Test Patient', '9876543210', 'patient@example.com', 'Fertility & Reproductive Medicine', 'Available Specialist', '2026-10-01T18:30:00.000Z', 'Morning (09:30 AM – 01:00 PM)', 'Automated E2E booking test inquiry.', 'New', NULL, '2026-10-01T12:50:02.000Z'),
  (34, 'Priya Sharma', '+91 98765 43210', 'priya.sharma@example.com', 'Fertility & IVF', 'Available Specialist', '2026-10-14T18:30:00.000Z', 'Morning (10:00 AM - 01:00 PM)', 'Fertility consultation and IVF guidance', 'New', NULL, '2026-10-01T13:07:09.000Z'),
  (35, 'Playwright Test Patient', '9876543210', 'patient@example.com', 'Fertility & Reproductive Medicine', 'Available Specialist', '2026-10-01T18:30:00.000Z', 'Morning (09:30 AM – 01:00 PM)', 'Automated E2E booking test inquiry.', 'New', NULL, '2026-10-01T13:07:26.000Z'),
  (36, 'Priya Sharma', '+91 98765 43210', 'priya.sharma@example.com', 'Fertility & IVF', 'Available Specialist', '2026-10-14T18:30:00.000Z', 'Morning (10:00 AM - 01:00 PM)', 'Fertility consultation and IVF guidance', 'New', NULL, '2026-10-01T13:22:20.000Z'),
  (37, 'Priya Sharma', '+91 98765 43210', 'priya.sharma@example.com', 'Fertility & IVF', 'Available Specialist', '2026-10-14T18:30:00.000Z', 'Morning (10:00 AM - 01:00 PM)', 'Fertility consultation and IVF guidance', 'New', NULL, '2026-10-01T13:25:55.000Z'),
  (38, 'Playwright Test Patient', '9876543210', 'patient@example.com', 'Fertility & Reproductive Medicine', 'Available Specialist', '2026-10-01T18:30:00.000Z', 'Morning (09:30 AM – 01:00 PM)', 'Automated E2E booking test inquiry.', 'New', NULL, '2026-10-01T13:26:10.000Z'),
  (39, 'Priya Sharma', '+91 98765 43210', 'priya.sharma@example.com', 'Fertility & IVF', 'Available Specialist', '2026-10-14T18:30:00.000Z', 'Morning (10:00 AM - 01:00 PM)', 'Fertility consultation and IVF guidance', 'New', NULL, '2026-10-01T13:29:43.000Z'),
  (40, 'Playwright Test Patient', '9876543210', 'patient@example.com', 'Fertility & Reproductive Medicine', 'Available Specialist', '2026-10-01T18:30:00.000Z', 'Morning (09:30 AM – 01:00 PM)', 'Automated E2E booking test inquiry.', 'New', NULL, '2026-10-01T13:29:54.000Z'),
  (41, 'Priya Sharma', '+91 98765 43210', 'priya.sharma@example.com', 'Fertility & IVF', 'Available Specialist', '2026-10-14T18:30:00.000Z', 'Morning (10:00 AM - 01:00 PM)', 'Fertility consultation and IVF guidance', 'New', NULL, '2026-10-01T14:16:52.000Z'),
  (42, 'Playwright Test Patient', '9876543210', 'patient@example.com', 'Fertility & Reproductive Medicine', 'Available Specialist', '2026-10-01T18:30:00.000Z', 'Morning (09:30 AM – 01:00 PM)', 'Automated E2E booking test inquiry.', 'New', NULL, '2026-10-01T14:17:33.000Z'),
  (43, 'Priya Sharma', '+91 98765 43210', 'priya.sharma@example.com', 'Fertility & IVF', 'Available Specialist', '2026-10-14T18:30:00.000Z', 'Morning (10:00 AM - 01:00 PM)', 'Fertility consultation and IVF guidance', 'New', NULL, '2026-10-01T14:48:16.000Z'),
  (44, 'Playwright Test Patient', '9876543210', 'patient@example.com', 'Fertility & Reproductive Medicine', 'Available Specialist', '2026-10-01T18:30:00.000Z', 'Morning (09:30 AM – 01:00 PM)', 'Automated E2E booking test inquiry.', 'New', NULL, '2026-10-01T14:48:51.000Z'),
  (45, 'Priya Sharma', '+91 98765 43210', 'priya.sharma@example.com', 'Fertility & IVF', 'Available Specialist', '2026-10-14T18:30:00.000Z', 'Morning (10:00 AM - 01:00 PM)', 'Fertility consultation and IVF guidance', 'New', NULL, '2026-10-01T15:39:24.000Z'),
  (46, 'Playwright Test Patient', '9876543210', 'patient@example.com', 'Fertility & Reproductive Medicine', 'Available Specialist', '2026-10-01T18:30:00.000Z', 'Morning (09:30 AM – 01:00 PM)', 'Automated E2E booking test inquiry.', 'Cancelled', '', '2026-10-01T15:39:44.000Z'),
  (47, 'Priya Sharma', '+91 98765 43210', 'priya.sharma@example.com', 'Fertility & IVF', 'Available Specialist', '2026-10-14T18:30:00.000Z', 'Morning (10:00 AM - 01:00 PM)', 'Fertility consultation and IVF guidance', 'New', NULL, '2026-10-01T17:34:29.000Z'),
  (48, 'Priya Sharma', '+91 98765 43210', 'priya.sharma@example.com', 'Fertility & IVF', 'Available Specialist', '2026-10-14T18:30:00.000Z', 'Morning (10:00 AM - 01:00 PM)', 'Fertility consultation and IVF guidance', 'New', NULL, '2026-10-01T17:35:08.000Z'),
  (49, 'Priya Sharma', '+91 98765 43210', 'priya.sharma@example.com', 'Fertility & IVF', 'Available Specialist', '2026-10-14T18:30:00.000Z', 'Morning (10:00 AM - 01:00 PM)', 'Fertility consultation and IVF guidance', 'Confirmed', 'fbdfhdfbdf', '2026-10-01T17:37:54.000Z'),
  (50, 'Priya Sharma', '+91 98765 43210', 'priya.sharma@example.com', 'Fertility & IVF', 'Available Specialist', '2026-10-14T18:30:00.000Z', 'Morning (10:00 AM - 01:00 PM)', 'Fertility consultation and IVF guidance', 'New', NULL, '2026-10-03T11:47:09.000Z');

INSERT INTO `appointments` (`id`, `patient_name`, `phone`, `email`, `department`, `doctor_name`, `preferred_date`, `preferred_time`, `reason`, `status`, `notes`, `created_at`) VALUES
  (51, 'Priya Sharma', '+91 98765 43210', 'priya.sharma@example.com', 'Fertility & IVF', 'Available Specialist', '2026-10-14T18:30:00.000Z', 'Morning (10:00 AM - 01:00 PM)', 'Fertility consultation and IVF guidance', 'New', NULL, '2026-10-03T12:05:41.000Z'),
  (52, 'Priya Sharma', '+91 98765 43210', 'priya.sharma@example.com', 'Fertility & IVF', 'Available Specialist', '2026-10-14T18:30:00.000Z', 'Morning (10:00 AM - 01:00 PM)', 'Fertility consultation and IVF guidance', 'New', NULL, '2026-10-04T07:57:57.000Z'),
  (53, 'Sita Devi', '9876543210', 'sita@example.com', 'General Consultation', 'Available Specialist', '2026-10-04T18:30:00.000Z', 'Morning (09:00 AM - 01:00 PM)', 'IVF Consultation Enquiry: Looking for initial fertility assessment and consultation.', 'waiting', 'Converted from web enquiry', '2026-10-04T08:00:31.000Z'),
  (54, 'Sita Devi', '9876543210', 'sita@example.com', 'General Consultation', 'Available Specialist', '2026-10-04T18:30:00.000Z', 'Morning (09:00 AM - 01:00 PM)', 'IVF Consultation Enquiry: Looking for initial fertility assessment and consultation.', 'waiting', 'Converted from web enquiry', '2026-10-04T08:03:17.000Z'),
  (55, 'Sita Devi', '9876543210', 'sita@example.com', 'General Consultation', 'Available Specialist', '2026-10-04T18:30:00.000Z', 'Morning (09:00 AM - 01:00 PM)', 'IVF Consultation Enquiry: Looking for initial fertility assessment and consultation.', 'waiting', 'Converted from web enquiry', '2026-10-04T08:03:28.000Z'),
  (56, 'Priya Sharma', '+91 98765 43210', 'priya.sharma@example.com', 'Fertility & IVF', 'Available Specialist', '2026-10-14T18:30:00.000Z', 'Morning (10:00 AM - 01:00 PM)', 'Fertility consultation and IVF guidance', 'New', NULL, '2026-10-04T08:03:30.000Z'),
  (57, 'Sita Devi', '9876543210', 'sita@example.com', 'General Consultation', 'Available Specialist', '2026-10-04T18:30:00.000Z', 'Morning (09:00 AM - 01:00 PM)', 'IVF Consultation Enquiry: Looking for initial fertility assessment and consultation.', 'consulted', 'Converted from web enquiry', '2026-10-04T08:05:21.000Z'),
  (58, 'Priya Sharma', '+91 98765 43210', 'priya.sharma@example.com', 'Fertility & IVF', 'Available Specialist', '2026-10-14T18:30:00.000Z', 'Morning (10:00 AM - 01:00 PM)', 'Fertility consultation and IVF guidance', 'New', NULL, '2026-10-04T08:06:42.000Z'),
  (59, 'Sita Devi', '9876543210', 'sita@example.com', 'General Consultation', 'Available Specialist', '2026-10-05T18:30:00.000Z', 'Morning (09:00 AM - 01:00 PM)', 'IVF Consultation Enquiry: Looking for initial fertility assessment and consultation.', 'waiting', 'Converted from web enquiry', '2026-10-05T01:32:44.000Z'),
  (60, 'Priya Sharma', '+91 98765 43210', 'priya.sharma@example.com', 'Fertility & IVF', 'Available Specialist', '2026-10-14T18:30:00.000Z', 'Morning (10:00 AM - 01:00 PM)', 'Fertility consultation and IVF guidance', 'consulted', NULL, '2026-10-05T01:32:45.000Z'),
  (61, 'Sita Devi', '9876543210', 'sita@example.com', 'General Consultation', 'Available Specialist', '2026-10-05T18:30:00.000Z', 'Morning (09:00 AM - 01:00 PM)', 'IVF Consultation Enquiry: Looking for initial fertility assessment and consultation.', 'waiting', 'Converted from web enquiry', '2026-10-05T01:54:50.000Z'),
  (62, 'Priya Sharma', '+91 98765 43210', 'priya.sharma@example.com', 'Fertility & IVF', 'Available Specialist', '2026-10-14T18:30:00.000Z', 'Morning (10:00 AM - 01:00 PM)', 'Fertility consultation and IVF guidance', 'waiting', NULL, '2026-10-05T01:54:54.000Z'),
  (63, 'Sita Devi', '9876543210', 'sita@example.com', 'Fertility & Reproductive Medicine', 'Dr. S. Sreemantha Rao', '2026-10-05T18:30:00.000Z', 'Morning (09:00 AM - 01:00 PM)', 'IVF Consultation Enquiry: Looking for initial fertility assessment and consultation.', 'waiting', 'Forwarded from Enquiry #37', '2026-10-05T02:01:04.000Z');

-- --------------------------------------------------------
-- Table structure for table `audit_logs`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `audit_logs`;
CREATE TABLE `audit_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(100) NOT NULL,
  `action` varchar(255) NOT NULL,
  `entity_type` varchar(100) NOT NULL,
  `entity_id` varchar(100) DEFAULT NULL,
  `details` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

-- Dumping data for table `audit_logs` (355 rows)

INSERT INTO `audit_logs` (`id`, `user_name`, `action`, `entity_type`, `entity_id`, `details`, `created_at`) VALUES
  (1, 'admin', 'Staff Login', 'Auth', '1', '{"ip":"::1","time":"2026-09-28T21:04:49.097Z"}', '2026-09-28T15:34:48.000Z'),
  (2, 'admin', 'Staff Login', 'Auth', '1', '{"ip":"::1","time":"2026-09-28T21:05:30.750Z"}', '2026-09-28T15:35:29.000Z'),
  (3, 'admin', 'Staff Login', 'Auth', '1', '{"ip":"::1","time":"2026-09-28T21:05:44.618Z"}', '2026-09-28T15:35:43.000Z'),
  (4, 'admin', 'Staff Login', 'Auth', '1', '{"ip":"::1","time":"2026-09-28T21:18:21.672Z"}', '2026-09-28T15:48:20.000Z'),
  (5, 'admin', 'Staff Login', 'Auth', '1', '{"ip":"::1","time":"2026-09-28T21:19:52.519Z"}', '2026-09-28T15:49:51.000Z'),
  (6, 'admin', 'Staff Login', 'Auth', '1', '{"ip":"::1","time":"2026-09-28T21:20:59.821Z"}', '2026-09-28T15:50:58.000Z'),
  (7, 'admin', 'Staff Login', 'Auth', '1', '{"ip":"::1","time":"2026-09-28T21:26:37.766Z"}', '2026-09-28T15:56:36.000Z'),
  (8, 'admin', 'Staff Login', 'Auth', '1', '{"ip":"::1","time":"2026-09-28T21:28:20.023Z"}', '2026-09-28T15:58:18.000Z'),
  (9, 'admin', 'Staff Login', 'Auth', '1', '{"ip":"::1","time":"2026-09-28T21:58:38.834Z"}', '2026-09-28T16:28:37.000Z'),
  (10, 'admin', 'Staff Login', 'Auth', '1', '{"ip":"::1","time":"2026-09-28T22:11:21.239Z"}', '2026-09-28T16:41:20.000Z'),
  (11, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"::ffff:127.0.0.1"}', '2026-09-28T18:00:36.000Z'),
  (12, 'admin', 'LOGIN', 'users', '1', '{"ip":"::ffff:127.0.0.1"}', '2026-09-28T18:00:37.000Z'),
  (13, 'staff', 'LOGIN', 'users', '3', '{"ip":"::ffff:127.0.0.1"}', '2026-09-28T18:00:37.000Z'),
  (14, 'staff', 'CREATE', 'gallery', '9', '{"title":"Modern IVF Laboratory Tour","media_type":"youtube"}', '2026-09-28T18:00:38.000Z'),
  (15, 'admin', 'UPDATE', 'gallery', '9', '{"title":"Advanced IVF Laboratory Tour (Updated)","media_type":"youtube"}', '2026-09-28T18:00:38.000Z'),
  (16, 'admin', 'DELETE', 'gallery', '9', '{"title":"Advanced IVF Laboratory Tour (Updated)"}', '2026-09-28T18:00:38.000Z'),
  (17, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"::ffff:127.0.0.1"}', '2026-09-28T18:03:46.000Z'),
  (18, 'admin', 'LOGIN', 'users', '1', '{"ip":"::ffff:127.0.0.1"}', '2026-09-28T18:03:47.000Z'),
  (19, 'staff', 'LOGIN', 'users', '3', '{"ip":"::ffff:127.0.0.1"}', '2026-09-28T18:03:47.000Z'),
  (20, 'staff', 'CREATE', 'gallery', '10', '{"title":"Modern IVF Laboratory Tour","media_type":"youtube"}', '2026-09-28T18:03:49.000Z'),
  (21, 'admin', 'UPDATE', 'gallery', '10', '{"title":"Advanced IVF Laboratory Tour (Updated)","media_type":"youtube"}', '2026-09-28T18:03:49.000Z'),
  (22, 'admin', 'DELETE', 'gallery', '10', '{"title":"Advanced IVF Laboratory Tour (Updated)"}', '2026-09-28T18:03:49.000Z'),
  (23, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"::ffff:127.0.0.1"}', '2026-09-28T18:04:20.000Z'),
  (24, 'admin', 'LOGIN', 'users', '1', '{"ip":"::ffff:127.0.0.1"}', '2026-09-28T18:04:22.000Z'),
  (25, 'staff', 'LOGIN', 'users', '3', '{"ip":"::ffff:127.0.0.1"}', '2026-09-28T18:04:22.000Z'),
  (26, 'staff', 'CREATE', 'gallery', '11', '{"title":"Modern IVF Laboratory Tour","media_type":"youtube"}', '2026-09-28T18:04:24.000Z'),
  (27, 'admin', 'UPDATE', 'gallery', '11', '{"title":"Advanced IVF Laboratory Tour (Updated)","media_type":"youtube"}', '2026-09-28T18:04:25.000Z'),
  (28, 'admin', 'DELETE', 'gallery', '11', '{"title":"Advanced IVF Laboratory Tour (Updated)"}', '2026-09-28T18:04:27.000Z'),
  (29, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"::ffff:127.0.0.1"}', '2026-09-28T18:24:45.000Z'),
  (30, 'admin', 'LOGIN', 'users', '1', '{"ip":"::ffff:127.0.0.1"}', '2026-09-28T18:24:45.000Z'),
  (31, 'staff', 'LOGIN', 'users', '3', '{"ip":"::ffff:127.0.0.1"}', '2026-09-28T18:24:46.000Z'),
  (32, 'staff', 'CREATE', 'gallery', '12', '{"title":"Modern IVF Laboratory Tour","media_type":"youtube"}', '2026-09-28T18:24:47.000Z'),
  (33, 'admin', 'UPDATE', 'gallery', '12', '{"title":"Advanced IVF Laboratory Tour (Updated)","media_type":"youtube"}', '2026-09-28T18:24:48.000Z'),
  (34, 'admin', 'DELETE', 'gallery', '12', '{"title":"Advanced IVF Laboratory Tour (Updated)"}', '2026-09-28T18:24:48.000Z'),
  (35, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"::ffff:127.0.0.1"}', '2026-09-28T18:26:35.000Z'),
  (36, 'admin', 'LOGIN', 'users', '1', '{"ip":"::ffff:127.0.0.1"}', '2026-09-28T18:26:35.000Z'),
  (37, 'staff', 'LOGIN', 'users', '3', '{"ip":"::ffff:127.0.0.1"}', '2026-09-28T18:26:35.000Z'),
  (38, 'staff', 'CREATE', 'gallery', '13', '{"title":"Modern IVF Laboratory Tour","media_type":"youtube"}', '2026-09-28T18:26:37.000Z'),
  (39, 'admin', 'UPDATE', 'gallery', '13', '{"title":"Advanced IVF Laboratory Tour (Updated)","media_type":"youtube"}', '2026-09-28T18:26:37.000Z'),
  (40, 'admin', 'DELETE', 'gallery', '13', '{"title":"Advanced IVF Laboratory Tour (Updated)"}', '2026-09-28T18:26:37.000Z'),
  (41, 'admin', 'LOGIN', 'users', '1', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.8010.12 Safari/537.36"}', '2026-09-28T18:46:18.000Z'),
  (42, 'admin', 'LOGIN', 'users', '1', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.8010.12 Safari/537.36"}', '2026-09-28T18:46:20.000Z'),
  (43, 'admin', 'LOGIN', 'users', '1', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.8010.12 Safari/537.36"}', '2026-09-28T18:46:27.000Z'),
  (44, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"::ffff:127.0.0.1"}', '2026-09-28T18:49:36.000Z'),
  (45, 'admin', 'LOGIN', 'users', '1', '{"ip":"::ffff:127.0.0.1"}', '2026-09-28T18:49:36.000Z'),
  (46, 'staff', 'LOGIN', 'users', '3', '{"ip":"::ffff:127.0.0.1"}', '2026-09-28T18:49:36.000Z'),
  (47, 'staff', 'CREATE', 'gallery', '14', '{"title":"Modern IVF Laboratory Tour","media_type":"youtube"}', '2026-09-28T18:49:38.000Z'),
  (48, 'admin', 'UPDATE', 'gallery', '14', '{"title":"Advanced IVF Laboratory Tour (Updated)","media_type":"youtube"}', '2026-09-28T18:49:38.000Z'),
  (49, 'admin', 'DELETE', 'gallery', '14', '{"title":"Advanced IVF Laboratory Tour (Updated)"}', '2026-09-28T18:49:38.000Z'),
  (50, 'admin', 'LOGIN', 'users', '1', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.8010.12 Safari/537.36"}', '2026-09-28T18:52:57.000Z');

INSERT INTO `audit_logs` (`id`, `user_name`, `action`, `entity_type`, `entity_id`, `details`, `created_at`) VALUES
  (51, 'admin', 'LOGIN', 'users', '1', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.8010.12 Safari/537.36"}', '2026-09-28T18:52:58.000Z'),
  (52, 'admin', 'LOGIN', 'users', '1', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.8010.12 Safari/537.36"}', '2026-09-28T18:53:10.000Z'),
  (53, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"::ffff:127.0.0.1"}', '2026-09-28T18:57:56.000Z'),
  (54, 'admin', 'LOGIN', 'users', '1', '{"ip":"::ffff:127.0.0.1"}', '2026-09-28T18:57:56.000Z'),
  (55, 'staff', 'LOGIN', 'users', '3', '{"ip":"::ffff:127.0.0.1"}', '2026-09-28T18:57:56.000Z'),
  (56, 'staff', 'CREATE', 'gallery', '15', '{"title":"Modern IVF Laboratory Tour","media_type":"youtube"}', '2026-09-28T18:57:58.000Z'),
  (57, 'admin', 'UPDATE', 'gallery', '15', '{"title":"Advanced IVF Laboratory Tour (Updated)","media_type":"youtube"}', '2026-09-28T18:57:58.000Z'),
  (58, 'admin', 'DELETE', 'gallery', '15', '{"title":"Advanced IVF Laboratory Tour (Updated)"}', '2026-09-28T18:57:58.000Z'),
  (59, 'admin', 'LOGIN', 'users', '1', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.8010.12 Safari/537.36"}', '2026-09-28T18:58:36.000Z'),
  (60, 'admin', 'LOGIN', 'users', '1', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.8010.12 Safari/537.36"}', '2026-09-28T18:58:37.000Z'),
  (61, 'admin', 'LOGIN', 'users', '1', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.8010.12 Safari/537.36"}', '2026-09-28T18:58:40.000Z'),
  (62, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"::ffff:127.0.0.1"}', '2026-09-29T11:50:46.000Z'),
  (63, 'admin', 'LOGIN', 'users', '1', '{"ip":"::ffff:127.0.0.1"}', '2026-09-29T11:50:48.000Z'),
  (64, 'staff', 'LOGIN', 'users', '3', '{"ip":"::ffff:127.0.0.1"}', '2026-09-29T11:50:50.000Z'),
  (65, 'staff', 'CREATE', 'gallery', '16', '{"title":"Modern IVF Laboratory Tour","media_type":"youtube"}', '2026-09-29T11:50:56.000Z'),
  (66, 'admin', 'UPDATE', 'gallery', '16', '{"title":"Advanced IVF Laboratory Tour (Updated)","media_type":"youtube"}', '2026-09-29T11:50:56.000Z'),
  (67, 'admin', 'DELETE', 'gallery', '16', '{"title":"Advanced IVF Laboratory Tour (Updated)"}', '2026-09-29T11:50:56.000Z'),
  (68, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36"}', '2026-09-29T12:04:40.000Z'),
  (69, 'admin', 'LOGIN', 'users', '1', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36"}', '2026-09-29T12:06:21.000Z'),
  (70, 'admin', 'UPDATE', 'gallery', '1', '{"title":"Advanced IVF Embryology Cleanroom Lab","media_type":"image"}', '2026-09-29T12:09:25.000Z'),
  (71, 'admin', 'LOGIN', 'users', '1', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Mobile Safari/537.36"}', '2026-09-29T13:13:27.000Z'),
  (72, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"::ffff:127.0.0.1"}', '2026-10-01T12:14:38.000Z'),
  (73, 'admin', 'LOGIN', 'users', '1', '{"ip":"::ffff:127.0.0.1"}', '2026-10-01T12:14:39.000Z'),
  (74, 'staff', 'LOGIN', 'users', '3', '{"ip":"::ffff:127.0.0.1"}', '2026-10-01T12:14:39.000Z'),
  (75, 'staff', 'CREATE', 'gallery', '17', '{"title":"Modern IVF Laboratory Tour","media_type":"youtube"}', '2026-10-01T12:14:41.000Z'),
  (76, 'admin', 'UPDATE', 'gallery', '17', '{"title":"Advanced IVF Laboratory Tour (Updated)","media_type":"youtube"}', '2026-10-01T12:14:41.000Z'),
  (77, 'admin', 'DELETE', 'gallery', '17', '{"title":"Advanced IVF Laboratory Tour (Updated)"}', '2026-10-01T12:14:41.000Z'),
  (78, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"::ffff:127.0.0.1"}', '2026-10-01T12:17:29.000Z'),
  (79, 'admin', 'LOGIN', 'users', '1', '{"ip":"::ffff:127.0.0.1"}', '2026-10-01T12:17:29.000Z'),
  (80, 'staff', 'LOGIN', 'users', '3', '{"ip":"::ffff:127.0.0.1"}', '2026-10-01T12:17:29.000Z'),
  (81, 'staff', 'CREATE', 'gallery', '18', '{"title":"Modern IVF Laboratory Tour","media_type":"youtube"}', '2026-10-01T12:17:31.000Z'),
  (82, 'admin', 'UPDATE', 'gallery', '18', '{"title":"Advanced IVF Laboratory Tour (Updated)","media_type":"youtube"}', '2026-10-01T12:17:31.000Z'),
  (83, 'admin', 'DELETE', 'gallery', '18', '{"title":"Advanced IVF Laboratory Tour (Updated)"}', '2026-10-01T12:17:31.000Z'),
  (84, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"::ffff:127.0.0.1"}', '2026-10-01T12:29:05.000Z'),
  (85, 'admin', 'LOGIN', 'users', '1', '{"ip":"::ffff:127.0.0.1"}', '2026-10-01T12:29:05.000Z'),
  (86, 'staff', 'LOGIN', 'users', '3', '{"ip":"::ffff:127.0.0.1"}', '2026-10-01T12:29:05.000Z'),
  (87, 'staff', 'CREATE', 'gallery', '19', '{"title":"Modern IVF Laboratory Tour","media_type":"youtube"}', '2026-10-01T12:29:07.000Z'),
  (88, 'admin', 'UPDATE', 'gallery', '19', '{"title":"Advanced IVF Laboratory Tour (Updated)","media_type":"youtube"}', '2026-10-01T12:29:07.000Z'),
  (89, 'admin', 'DELETE', 'gallery', '19', '{"title":"Advanced IVF Laboratory Tour (Updated)"}', '2026-10-01T12:29:07.000Z'),
  (90, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"::ffff:127.0.0.1"}', '2026-10-01T12:35:26.000Z'),
  (91, 'admin', 'LOGIN', 'users', '1', '{"ip":"::ffff:127.0.0.1"}', '2026-10-01T12:35:26.000Z'),
  (92, 'staff', 'LOGIN', 'users', '3', '{"ip":"::ffff:127.0.0.1"}', '2026-10-01T12:35:27.000Z'),
  (93, 'staff', 'CREATE', 'gallery', '20', '{"title":"Modern IVF Laboratory Tour","media_type":"youtube"}', '2026-10-01T12:35:28.000Z'),
  (94, 'admin', 'UPDATE', 'gallery', '20', '{"title":"Advanced IVF Laboratory Tour (Updated)","media_type":"youtube"}', '2026-10-01T12:35:28.000Z'),
  (95, 'admin', 'DELETE', 'gallery', '20', '{"title":"Advanced IVF Laboratory Tour (Updated)"}', '2026-10-01T12:35:28.000Z'),
  (96, 'admin', 'LOGIN', 'users', '1', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.8010.12 Safari/537.36"}', '2026-10-01T12:35:56.000Z'),
  (97, 'admin', 'LOGIN', 'users', '1', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.8010.12 Safari/537.36"}', '2026-10-01T12:35:57.000Z'),
  (98, 'admin', 'LOGIN', 'users', '1', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.8010.12 Safari/537.36"}', '2026-10-01T12:35:58.000Z'),
  (99, 'admin', 'LOGIN', 'users', '1', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.8010.12 Safari/537.36"}', '2026-10-01T12:45:44.000Z'),
  (100, 'admin', 'LOGIN', 'users', '1', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.8010.12 Safari/537.36"}', '2026-10-01T12:45:45.000Z');

INSERT INTO `audit_logs` (`id`, `user_name`, `action`, `entity_type`, `entity_id`, `details`, `created_at`) VALUES
  (101, 'admin', 'LOGIN', 'users', '1', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.8010.12 Safari/537.36"}', '2026-10-01T12:45:47.000Z'),
  (102, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"::ffff:127.0.0.1"}', '2026-10-01T12:48:14.000Z'),
  (103, 'admin', 'LOGIN', 'users', '1', '{"ip":"::ffff:127.0.0.1"}', '2026-10-01T12:48:14.000Z'),
  (104, 'staff', 'LOGIN', 'users', '3', '{"ip":"::ffff:127.0.0.1"}', '2026-10-01T12:48:15.000Z'),
  (105, 'staff', 'CREATE', 'gallery', '21', '{"title":"Modern IVF Laboratory Tour","media_type":"youtube"}', '2026-10-01T12:48:16.000Z'),
  (106, 'admin', 'UPDATE', 'gallery', '21', '{"title":"Advanced IVF Laboratory Tour (Updated)","media_type":"youtube"}', '2026-10-01T12:48:16.000Z'),
  (107, 'admin', 'DELETE', 'gallery', '21', '{"title":"Advanced IVF Laboratory Tour (Updated)"}', '2026-10-01T12:48:16.000Z'),
  (108, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"::ffff:127.0.0.1"}', '2026-10-01T12:49:49.000Z'),
  (109, 'admin', 'LOGIN', 'users', '1', '{"ip":"::ffff:127.0.0.1"}', '2026-10-01T12:49:49.000Z'),
  (110, 'staff', 'LOGIN', 'users', '3', '{"ip":"::ffff:127.0.0.1"}', '2026-10-01T12:49:49.000Z'),
  (111, 'staff', 'CREATE', 'gallery', '22', '{"title":"Modern IVF Laboratory Tour","media_type":"youtube"}', '2026-10-01T12:49:51.000Z'),
  (112, 'admin', 'UPDATE', 'gallery', '22', '{"title":"Advanced IVF Laboratory Tour (Updated)","media_type":"youtube"}', '2026-10-01T12:49:51.000Z'),
  (113, 'admin', 'DELETE', 'gallery', '22', '{"title":"Advanced IVF Laboratory Tour (Updated)"}', '2026-10-01T12:49:51.000Z'),
  (114, 'admin', 'LOGIN', 'users', '1', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.8010.12 Safari/537.36"}', '2026-10-01T12:49:58.000Z'),
  (115, 'admin', 'LOGIN', 'users', '1', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.8010.12 Safari/537.36"}', '2026-10-01T12:49:59.000Z'),
  (116, 'admin', 'LOGIN', 'users', '1', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.8010.12 Safari/537.36"}', '2026-10-01T12:50:00.000Z'),
  (117, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36"}', '2026-10-01T12:54:11.000Z'),
  (118, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"::ffff:127.0.0.1"}', '2026-10-01T13:07:07.000Z'),
  (119, 'admin', 'LOGIN', 'users', '1', '{"ip":"::ffff:127.0.0.1"}', '2026-10-01T13:07:08.000Z'),
  (120, 'staff', 'LOGIN', 'users', '3', '{"ip":"::ffff:127.0.0.1"}', '2026-10-01T13:07:08.000Z'),
  (121, 'staff', 'CREATE', 'gallery', '23', '{"title":"Modern IVF Laboratory Tour","media_type":"youtube"}', '2026-10-01T13:07:09.000Z'),
  (122, 'admin', 'UPDATE', 'gallery', '23', '{"title":"Advanced IVF Laboratory Tour (Updated)","media_type":"youtube"}', '2026-10-01T13:07:09.000Z'),
  (123, 'admin', 'DELETE', 'gallery', '23', '{"title":"Advanced IVF Laboratory Tour (Updated)"}', '2026-10-01T13:07:09.000Z'),
  (124, 'admin', 'LOGIN', 'users', '1', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.8010.12 Safari/537.36"}', '2026-10-01T13:07:22.000Z'),
  (125, 'admin', 'LOGIN', 'users', '1', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.8010.12 Safari/537.36"}', '2026-10-01T13:07:23.000Z'),
  (126, 'admin', 'LOGIN', 'users', '1', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.8010.12 Safari/537.36"}', '2026-10-01T13:07:24.000Z'),
  (127, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"::ffff:127.0.0.1"}', '2026-10-01T13:22:18.000Z'),
  (128, 'admin', 'LOGIN', 'users', '1', '{"ip":"::ffff:127.0.0.1"}', '2026-10-01T13:22:18.000Z'),
  (129, 'staff', 'LOGIN', 'users', '3', '{"ip":"::ffff:127.0.0.1"}', '2026-10-01T13:22:19.000Z'),
  (130, 'staff', 'CREATE', 'gallery', '24', '{"title":"Modern IVF Laboratory Tour","media_type":"youtube"}', '2026-10-01T13:22:20.000Z'),
  (131, 'admin', 'UPDATE', 'gallery', '24', '{"title":"Advanced IVF Laboratory Tour (Updated)","media_type":"youtube"}', '2026-10-01T13:22:20.000Z'),
  (132, 'admin', 'DELETE', 'gallery', '24', '{"title":"Advanced IVF Laboratory Tour (Updated)"}', '2026-10-01T13:22:20.000Z'),
  (133, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"::ffff:127.0.0.1"}', '2026-10-01T13:25:53.000Z'),
  (134, 'admin', 'LOGIN', 'users', '1', '{"ip":"::ffff:127.0.0.1"}', '2026-10-01T13:25:53.000Z'),
  (135, 'staff', 'LOGIN', 'users', '3', '{"ip":"::ffff:127.0.0.1"}', '2026-10-01T13:25:53.000Z'),
  (136, 'staff', 'CREATE', 'gallery', '25', '{"title":"Modern IVF Laboratory Tour","media_type":"youtube"}', '2026-10-01T13:25:55.000Z'),
  (137, 'admin', 'UPDATE', 'gallery', '25', '{"title":"Advanced IVF Laboratory Tour (Updated)","media_type":"youtube"}', '2026-10-01T13:25:56.000Z'),
  (138, 'admin', 'DELETE', 'gallery', '25', '{"title":"Advanced IVF Laboratory Tour (Updated)"}', '2026-10-01T13:25:56.000Z'),
  (139, 'admin', 'LOGIN', 'users', '1', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.8010.12 Safari/537.36"}', '2026-10-01T13:26:02.000Z'),
  (140, 'admin', 'LOGIN', 'users', '1', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.8010.12 Safari/537.36"}', '2026-10-01T13:26:03.000Z'),
  (141, 'admin', 'LOGIN', 'users', '1', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.8010.12 Safari/537.36"}', '2026-10-01T13:26:06.000Z'),
  (142, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"::ffff:127.0.0.1"}', '2026-10-01T13:29:42.000Z'),
  (143, 'admin', 'LOGIN', 'users', '1', '{"ip":"::ffff:127.0.0.1"}', '2026-10-01T13:29:42.000Z'),
  (144, 'staff', 'LOGIN', 'users', '3', '{"ip":"::ffff:127.0.0.1"}', '2026-10-01T13:29:42.000Z'),
  (145, 'staff', 'CREATE', 'gallery', '26', '{"title":"Modern IVF Laboratory Tour","media_type":"youtube"}', '2026-10-01T13:29:44.000Z'),
  (146, 'admin', 'UPDATE', 'gallery', '26', '{"title":"Advanced IVF Laboratory Tour (Updated)","media_type":"youtube"}', '2026-10-01T13:29:44.000Z'),
  (147, 'admin', 'DELETE', 'gallery', '26', '{"title":"Advanced IVF Laboratory Tour (Updated)"}', '2026-10-01T13:29:44.000Z'),
  (148, 'admin', 'LOGIN', 'users', '1', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.8010.12 Safari/537.36"}', '2026-10-01T13:29:50.000Z'),
  (149, 'admin', 'LOGIN', 'users', '1', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.8010.12 Safari/537.36"}', '2026-10-01T13:29:51.000Z'),
  (150, 'admin', 'LOGIN', 'users', '1', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.8010.12 Safari/537.36"}', '2026-10-01T13:29:52.000Z');

INSERT INTO `audit_logs` (`id`, `user_name`, `action`, `entity_type`, `entity_id`, `details`, `created_at`) VALUES
  (151, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"::ffff:127.0.0.1"}', '2026-10-01T14:16:50.000Z'),
  (152, 'admin', 'LOGIN', 'users', '1', '{"ip":"::ffff:127.0.0.1"}', '2026-10-01T14:16:51.000Z'),
  (153, 'staff', 'LOGIN', 'users', '3', '{"ip":"::ffff:127.0.0.1"}', '2026-10-01T14:16:51.000Z'),
  (154, 'staff', 'CREATE', 'gallery', '27', '{"title":"Modern IVF Laboratory Tour","media_type":"youtube"}', '2026-10-01T14:16:53.000Z'),
  (155, 'admin', 'UPDATE', 'gallery', '27', '{"title":"Advanced IVF Laboratory Tour (Updated)","media_type":"youtube"}', '2026-10-01T14:16:53.000Z'),
  (156, 'admin', 'DELETE', 'gallery', '27', '{"title":"Advanced IVF Laboratory Tour (Updated)"}', '2026-10-01T14:16:53.000Z'),
  (157, 'admin', 'LOGIN', 'users', '1', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.8010.12 Safari/537.36"}', '2026-10-01T14:17:30.000Z'),
  (158, 'admin', 'LOGIN', 'users', '1', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.8010.12 Safari/537.36"}', '2026-10-01T14:17:31.000Z'),
  (159, 'admin', 'LOGIN', 'users', '1', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.8010.12 Safari/537.36"}', '2026-10-01T14:17:32.000Z'),
  (160, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36"}', '2026-10-01T14:22:56.000Z'),
  (161, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"::ffff:127.0.0.1"}', '2026-10-01T14:48:15.000Z'),
  (162, 'admin', 'LOGIN', 'users', '1', '{"ip":"::ffff:127.0.0.1"}', '2026-10-01T14:48:15.000Z'),
  (163, 'staff', 'LOGIN', 'users', '3', '{"ip":"::ffff:127.0.0.1"}', '2026-10-01T14:48:16.000Z'),
  (164, 'staff', 'CREATE', 'gallery', '28', '{"title":"Modern IVF Laboratory Tour","media_type":"youtube"}', '2026-10-01T14:48:17.000Z'),
  (165, 'admin', 'UPDATE', 'gallery', '28', '{"title":"Advanced IVF Laboratory Tour (Updated)","media_type":"youtube"}', '2026-10-01T14:48:17.000Z'),
  (166, 'admin', 'DELETE', 'gallery', '28', '{"title":"Advanced IVF Laboratory Tour (Updated)"}', '2026-10-01T14:48:17.000Z'),
  (167, 'admin', 'LOGIN', 'users', '1', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.8010.12 Safari/537.36"}', '2026-10-01T14:48:47.000Z'),
  (168, 'admin', 'LOGIN', 'users', '1', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.8010.12 Safari/537.36"}', '2026-10-01T14:48:48.000Z'),
  (169, 'admin', 'LOGIN', 'users', '1', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.8010.12 Safari/537.36"}', '2026-10-01T14:48:50.000Z'),
  (170, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36"}', '2026-10-01T15:04:12.000Z'),
  (171, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"::ffff:127.0.0.1"}', '2026-10-01T15:39:23.000Z'),
  (172, 'admin', 'LOGIN', 'users', '1', '{"ip":"::ffff:127.0.0.1"}', '2026-10-01T15:39:23.000Z'),
  (173, 'staff', 'LOGIN', 'users', '3', '{"ip":"::ffff:127.0.0.1"}', '2026-10-01T15:39:23.000Z'),
  (174, 'staff', 'CREATE', 'gallery', '29', '{"title":"Modern IVF Laboratory Tour","media_type":"youtube"}', '2026-10-01T15:39:24.000Z'),
  (175, 'admin', 'UPDATE', 'gallery', '29', '{"title":"Advanced IVF Laboratory Tour (Updated)","media_type":"youtube"}', '2026-10-01T15:39:24.000Z'),
  (176, 'admin', 'DELETE', 'gallery', '29', '{"title":"Advanced IVF Laboratory Tour (Updated)"}', '2026-10-01T15:39:25.000Z'),
  (177, 'admin', 'LOGIN', 'users', '1', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.8010.12 Safari/537.36"}', '2026-10-01T15:39:41.000Z'),
  (178, 'admin', 'LOGIN', 'users', '1', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.8010.12 Safari/537.36"}', '2026-10-01T15:39:42.000Z'),
  (179, 'admin', 'LOGIN', 'users', '1', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.8010.12 Safari/537.36"}', '2026-10-01T15:39:43.000Z'),
  (180, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36"}', '2026-10-01T16:02:31.000Z'),
  (181, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36"}', '2026-10-01T16:32:29.000Z'),
  (182, 'superadmin', 'UPDATE', 'appointments', '46', '{"status":"New"}', '2026-10-01T16:32:54.000Z'),
  (183, 'superadmin', 'UPDATE', 'appointments', '46', '{"status":"cancelled"}', '2026-10-01T16:33:03.000Z'),
  (184, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"::ffff:127.0.0.1"}', '2026-10-01T17:34:27.000Z'),
  (185, 'admin', 'LOGIN', 'users', '1', '{"ip":"::ffff:127.0.0.1"}', '2026-10-01T17:34:27.000Z'),
  (186, 'staff', 'LOGIN', 'users', '3', '{"ip":"::ffff:127.0.0.1"}', '2026-10-01T17:34:28.000Z'),
  (187, 'staff', 'CREATE', 'gallery', '30', '{"title":"Modern IVF Laboratory Tour","media_type":"youtube"}', '2026-10-01T17:34:30.000Z'),
  (188, 'admin', 'UPDATE', 'gallery', '30', '{"title":"Advanced IVF Laboratory Tour (Updated)","media_type":"youtube"}', '2026-10-01T17:34:30.000Z'),
  (189, 'admin', 'DELETE', 'gallery', '30', '{"title":"Advanced IVF Laboratory Tour (Updated)"}', '2026-10-01T17:34:31.000Z'),
  (190, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"::ffff:127.0.0.1"}', '2026-10-01T17:35:05.000Z'),
  (191, 'admin', 'LOGIN', 'users', '1', '{"ip":"::ffff:127.0.0.1"}', '2026-10-01T17:35:06.000Z'),
  (192, 'staff', 'LOGIN', 'users', '3', '{"ip":"::ffff:127.0.0.1"}', '2026-10-01T17:35:06.000Z'),
  (193, 'staff', 'CREATE', 'gallery', '31', '{"title":"Modern IVF Laboratory Tour","media_type":"youtube"}', '2026-10-01T17:35:14.000Z'),
  (194, 'admin', 'UPDATE', 'gallery', '31', '{"title":"Advanced IVF Laboratory Tour (Updated)","media_type":"youtube"}', '2026-10-01T17:35:14.000Z'),
  (195, 'admin', 'DELETE', 'gallery', '31', '{"title":"Advanced IVF Laboratory Tour (Updated)"}', '2026-10-01T17:35:14.000Z'),
  (196, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"::ffff:127.0.0.1"}', '2026-10-01T17:37:52.000Z'),
  (197, 'admin', 'LOGIN', 'users', '1', '{"ip":"::ffff:127.0.0.1"}', '2026-10-01T17:37:53.000Z'),
  (198, 'staff', 'LOGIN', 'users', '3', '{"ip":"::ffff:127.0.0.1"}', '2026-10-01T17:37:53.000Z'),
  (199, 'staff', 'CREATE', 'gallery', '32', '{"title":"Modern IVF Laboratory Tour","media_type":"youtube"}', '2026-10-01T17:37:55.000Z'),
  (200, 'admin', 'UPDATE', 'gallery', '32', '{"title":"Advanced IVF Laboratory Tour (Updated)","media_type":"youtube"}', '2026-10-01T17:37:55.000Z');

INSERT INTO `audit_logs` (`id`, `user_name`, `action`, `entity_type`, `entity_id`, `details`, `created_at`) VALUES
  (201, 'admin', 'DELETE', 'gallery', '32', '{"title":"Advanced IVF Laboratory Tour (Updated)"}', '2026-10-01T17:37:56.000Z'),
  (202, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36"}', '2026-10-01T17:41:43.000Z'),
  (203, 'superadmin', 'UPDATE', 'gallery', '1', '{"title":"Advanced IVF Embryology Cleanroom Lab","media_type":"image"}', '2026-10-01T17:42:17.000Z'),
  (204, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36"}', '2026-10-02T03:59:30.000Z'),
  (205, 'superadmin', 'UPDATE', 'gallery', '1', '{"title":"Advanced IVF Embryology Cleanroom Lab","media_type":"image"}', '2026-10-02T04:00:30.000Z'),
  (206, 'superadmin', 'UPDATE', 'gallery', '1', '{"title":"Advanced IVF Embryology Cleanroom Lab","media_type":"image"}', '2026-10-02T04:01:10.000Z'),
  (207, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36"}', '2026-10-02T09:02:10.000Z'),
  (208, 'superadmin', 'UPDATE', 'specialties', '1', '{"slug":"fertility-reproductive-medicine","title":"Fertility and Reproductive Medicine"}', '2026-10-02T09:02:28.000Z'),
  (209, 'superadmin', 'UPDATE', 'specialties', '1', '{"slug":"fertility-reproductive-medicine","title":"Fertility and Reproductive Medicine"}', '2026-10-02T09:02:54.000Z'),
  (210, 'superadmin', 'DELETE', 'doctors', '2', '{"name":"Dr. K. Radhika Devi"}', '2026-10-02T10:47:41.000Z'),
  (211, 'superadmin', 'UPDATE', 'gallery', '1', '{"title":"Advanced IVF Embryology Cleanroom Lab","media_type":"image"}', '2026-10-02T10:47:56.000Z'),
  (212, 'admin', 'LOGIN', 'users', '1', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36"}', '2026-10-02T12:31:02.000Z'),
  (213, 'admin', 'UPDATE', 'facilities', '1', '{"name":"Class 1000 Modular IVF Embryology Lab","slug":"cleanroom-embryology-lab"}', '2026-10-03T00:41:06.000Z'),
  (214, 'superadmin', 'UPDATE', 'appointments', '49', '{"status":"New"}', '2026-10-03T05:10:19.000Z'),
  (215, 'superadmin', 'UPDATE', 'appointments', '49', '{"status":"confirmed"}', '2026-10-03T05:10:26.000Z'),
  (216, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36"}', '2026-10-03T11:14:30.000Z'),
  (217, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36"}', '2026-10-03T11:30:47.000Z'),
  (218, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"::ffff:127.0.0.1"}', '2026-10-03T11:47:07.000Z'),
  (219, 'admin', 'LOGIN', 'users', '1', '{"ip":"::ffff:127.0.0.1"}', '2026-10-03T11:47:07.000Z'),
  (220, 'staff', 'LOGIN', 'users', '3', '{"ip":"::ffff:127.0.0.1"}', '2026-10-03T11:47:07.000Z'),
  (221, 'staff', 'CREATE', 'gallery', '33', '{"title":"Modern IVF Laboratory Tour","media_type":"youtube"}', '2026-10-03T11:47:10.000Z'),
  (222, 'admin', 'UPDATE', 'gallery', '33', '{"title":"Advanced IVF Laboratory Tour (Updated)","media_type":"youtube"}', '2026-10-03T11:47:10.000Z'),
  (223, 'admin', 'DELETE', 'gallery', '33', '{"title":"Advanced IVF Laboratory Tour (Updated)"}', '2026-10-03T11:47:10.000Z'),
  (224, 'superadmin', 'DELETE', 'enquiries', '25', '{"id":"25"}', '2026-10-03T11:55:05.000Z'),
  (225, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"127.0.0.1","userAgent":"node"}', '2026-10-03T12:05:07.000Z'),
  (226, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"::ffff:127.0.0.1"}', '2026-10-03T12:05:39.000Z'),
  (227, 'admin', 'LOGIN', 'users', '1', '{"ip":"::ffff:127.0.0.1"}', '2026-10-03T12:05:40.000Z'),
  (228, 'staff', 'LOGIN', 'users', '3', '{"ip":"::ffff:127.0.0.1"}', '2026-10-03T12:05:40.000Z'),
  (229, 'staff', 'CREATE', 'gallery', '34', '{"title":"Modern IVF Laboratory Tour","media_type":"youtube"}', '2026-10-03T12:05:42.000Z'),
  (230, 'admin', 'UPDATE', 'gallery', '34', '{"title":"Advanced IVF Laboratory Tour (Updated)","media_type":"youtube"}', '2026-10-03T12:05:42.000Z'),
  (231, 'admin', 'DELETE', 'gallery', '34', '{"title":"Advanced IVF Laboratory Tour (Updated)"}', '2026-10-03T12:05:42.000Z'),
  (232, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36"}', '2026-10-03T12:08:45.000Z'),
  (233, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36"}', '2026-10-03T12:10:39.000Z'),
  (234, 'superadmin', 'UPDATE', 'facilities', '1', '{"name":"Class 1000 Modular IVF Embryology Lab","slug":"cleanroom-embryology-lab"}', '2026-10-03T12:11:06.000Z'),
  (235, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36"}', '2026-10-04T01:37:09.000Z'),
  (236, 'superadmin', 'UPDATE', 'treatments', '1', '{"slug":"ivf-in-vitro-fertilization","title":"IVF (In Vitro Fertilization)"}', '2026-10-04T01:38:15.000Z'),
  (237, 'superadmin', 'UPDATE', 'treatments', '1', '{"slug":"ivf-in-vitro-fertilization","title":"IVF (In Vitro Fertilization)"}', '2026-10-04T01:39:02.000Z'),
  (238, 'superadmin', 'UPDATE', 'facilities', '1', '{"name":"Class 1000 Modular IVF Embryology Lab","slug":"cleanroom-embryology-lab"}', '2026-10-04T05:34:50.000Z'),
  (239, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"::ffff:127.0.0.1"}', '2026-10-04T07:57:56.000Z'),
  (240, 'admin', 'LOGIN', 'users', '1', '{"ip":"::ffff:127.0.0.1"}', '2026-10-04T07:57:56.000Z'),
  (241, 'staff', 'LOGIN', 'users', '3', '{"ip":"::ffff:127.0.0.1"}', '2026-10-04T07:57:56.000Z'),
  (242, 'staff', 'CREATE', 'gallery', '35', '{"title":"Modern IVF Laboratory Tour","media_type":"youtube"}', '2026-10-04T07:57:58.000Z'),
  (243, 'admin', 'UPDATE', 'gallery', '35', '{"title":"Advanced IVF Laboratory Tour (Updated)","media_type":"youtube"}', '2026-10-04T07:57:58.000Z'),
  (244, 'admin', 'DELETE', 'gallery', '35', '{"title":"Advanced IVF Laboratory Tour (Updated)"}', '2026-10-04T07:57:58.000Z'),
  (245, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"::ffff:127.0.0.1"}', '2026-10-04T08:00:30.000Z'),
  (246, 'admin', 'LOGIN', 'users', '1', '{"ip":"::ffff:127.0.0.1"}', '2026-10-04T08:00:30.000Z'),
  (247, 'admin', 'CREATE', 'users', '4', '{"role":"staff","username":"teststaff_1791120630430"}', '2026-10-04T08:00:30.000Z'),
  (248, 'admin', 'UPDATE', 'users', '4', '{"role":"staff","username":"teststaff_1791120630430","passwordChanged":true}', '2026-10-04T08:00:30.000Z'),
  (249, 'admin', 'UPDATE', 'appointments', '53', '{"status":"consulted"}', '2026-10-04T08:00:31.000Z'),
  (250, 'admin', 'UPDATE', 'appointments', '53', '{"status":"waiting"}', '2026-10-04T08:00:31.000Z');

INSERT INTO `audit_logs` (`id`, `user_name`, `action`, `entity_type`, `entity_id`, `details`, `created_at`) VALUES
  (251, 'admin', 'UPDATE', 'treatments', '1', '{"slug":"ivf-in-vitro-fertilization"}', '2026-10-04T08:00:31.000Z'),
  (252, 'superadmin', 'DELETE', 'users', '4', '{"targetId":"4","username":"teststaff_1791120630430"}', '2026-10-04T08:00:31.000Z'),
  (253, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"::ffff:127.0.0.1"}', '2026-10-04T08:03:16.000Z'),
  (254, 'admin', 'LOGIN', 'users', '1', '{"ip":"::ffff:127.0.0.1"}', '2026-10-04T08:03:16.000Z'),
  (255, 'admin', 'CREATE', 'users', '5', '{"role":"staff","username":"teststaff_1791120796558"}', '2026-10-04T08:03:16.000Z'),
  (256, 'admin', 'UPDATE', 'users', '5', '{"role":"staff","username":"teststaff_1791120796558","passwordChanged":true}', '2026-10-04T08:03:17.000Z'),
  (257, 'admin', 'CONVERT_ENQUIRY', 'appointments', '54', '{"enquiryId":"30","patientName":"Sita Devi"}', '2026-10-04T08:03:17.000Z'),
  (258, 'admin', 'UPDATE', 'appointments', '54', '{"status":"consulted"}', '2026-10-04T08:03:17.000Z'),
  (259, 'admin', 'UPDATE', 'appointments', '54', '{"status":"waiting"}', '2026-10-04T08:03:17.000Z'),
  (260, 'admin', 'UPDATE', 'treatments', '2', '{"slug":"icsi-intracytoplasmic-sperm-injection"}', '2026-10-04T08:03:17.000Z'),
  (261, 'superadmin', 'DELETE', 'users', '5', '{"targetId":"5","username":"teststaff_1791120796558"}', '2026-10-04T08:03:17.000Z'),
  (262, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"::ffff:127.0.0.1"}', '2026-10-04T08:03:27.000Z'),
  (263, 'admin', 'LOGIN', 'users', '1', '{"ip":"::ffff:127.0.0.1"}', '2026-10-04T08:03:28.000Z'),
  (264, 'admin', 'CREATE', 'users', '6', '{"role":"staff","username":"teststaff_1791120808087"}', '2026-10-04T08:03:28.000Z'),
  (265, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"::ffff:127.0.0.1"}', '2026-10-04T08:03:28.000Z'),
  (266, 'admin', 'UPDATE', 'users', '6', '{"role":"staff","username":"teststaff_1791120808087","passwordChanged":true}', '2026-10-04T08:03:28.000Z'),
  (267, 'admin', 'LOGIN', 'users', '1', '{"ip":"::ffff:127.0.0.1"}', '2026-10-04T08:03:28.000Z'),
  (268, 'admin', 'CONVERT_ENQUIRY', 'appointments', '55', '{"enquiryId":"31","patientName":"Sita Devi"}', '2026-10-04T08:03:28.000Z'),
  (269, 'staff', 'LOGIN', 'users', '3', '{"ip":"::ffff:127.0.0.1"}', '2026-10-04T08:03:28.000Z'),
  (270, 'admin', 'UPDATE', 'appointments', '55', '{"status":"consulted"}', '2026-10-04T08:03:28.000Z'),
  (271, 'admin', 'UPDATE', 'appointments', '55', '{"status":"waiting"}', '2026-10-04T08:03:29.000Z'),
  (272, 'admin', 'UPDATE', 'treatments', '4', '{"slug":"level-iii-nicu-critical-care"}', '2026-10-04T08:03:29.000Z'),
  (273, 'superadmin', 'DELETE', 'users', '6', '{"targetId":"6","username":"teststaff_1791120808087"}', '2026-10-04T08:03:29.000Z'),
  (274, 'staff', 'CREATE', 'gallery', '36', '{"title":"Modern IVF Laboratory Tour","media_type":"youtube"}', '2026-10-04T08:03:30.000Z'),
  (275, 'admin', 'UPDATE', 'gallery', '36', '{"title":"Advanced IVF Laboratory Tour (Updated)","media_type":"youtube"}', '2026-10-04T08:03:30.000Z'),
  (276, 'admin', 'DELETE', 'gallery', '36', '{"title":"Advanced IVF Laboratory Tour (Updated)"}', '2026-10-04T08:03:31.000Z'),
  (277, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"::ffff:127.0.0.1"}', '2026-10-04T08:05:20.000Z'),
  (278, 'admin', 'LOGIN', 'users', '1', '{"ip":"::ffff:127.0.0.1"}', '2026-10-04T08:05:20.000Z'),
  (279, 'admin', 'CREATE', 'users', '7', '{"role":"staff","username":"teststaff_1791120920437"}', '2026-10-04T08:05:20.000Z'),
  (280, 'admin', 'UPDATE', 'users', '7', '{"role":"staff","username":"teststaff_1791120920437","passwordChanged":true}', '2026-10-04T08:05:20.000Z'),
  (281, 'admin', 'CONVERT_ENQUIRY', 'appointments', '57', '{"enquiryId":"33","patientName":"Sita Devi"}', '2026-10-04T08:05:21.000Z'),
  (282, 'admin', 'UPDATE', 'appointments', '57', '{"status":"consulted"}', '2026-10-04T08:05:21.000Z'),
  (283, 'admin', 'UPDATE', 'appointments', '57', '{"status":"waiting"}', '2026-10-04T08:05:21.000Z'),
  (284, 'admin', 'UPDATE', 'treatments', '5', '{"slug":"painless-delivery-maternity-care","title":"Painless Delivery & Comprehensive Maternity"}', '2026-10-04T08:05:21.000Z'),
  (285, 'superadmin', 'DELETE', 'users', '7', '{"targetId":"7","username":"teststaff_1791120920437"}', '2026-10-04T08:05:21.000Z'),
  (286, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"::ffff:127.0.0.1"}', '2026-10-04T08:06:41.000Z'),
  (287, 'admin', 'LOGIN', 'users', '1', '{"ip":"::ffff:127.0.0.1"}', '2026-10-04T08:06:41.000Z'),
  (288, 'staff', 'LOGIN', 'users', '3', '{"ip":"::ffff:127.0.0.1"}', '2026-10-04T08:06:41.000Z'),
  (289, 'staff', 'CREATE', 'gallery', '37', '{"title":"Modern IVF Laboratory Tour","media_type":"youtube"}', '2026-10-04T08:06:43.000Z'),
  (290, 'admin', 'UPDATE', 'gallery', '37', '{"title":"Advanced IVF Laboratory Tour (Updated)","media_type":"youtube"}', '2026-10-04T08:06:43.000Z'),
  (291, 'admin', 'DELETE', 'gallery', '37', '{"title":"Advanced IVF Laboratory Tour (Updated)"}', '2026-10-04T08:06:43.000Z'),
  (292, 'superadmin', 'UPDATE', 'facilities', '1', '{"name":"Class 1000 Modular IVF Embryology Lab","slug":"cleanroom-embryology-lab"}', '2026-10-04T08:18:02.000Z'),
  (293, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36"}', '2026-10-04T09:02:13.000Z'),
  (294, 'superadmin', 'UPDATE', 'appointments', '57', '{"status":"waiting"}', '2026-10-04T11:18:15.000Z'),
  (295, 'superadmin', 'UPDATE', 'appointments', '57', '{"status":"consulted"}', '2026-10-04T11:18:15.000Z'),
  (296, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36"}', '2026-10-05T00:08:04.000Z'),
  (297, 'superadmin', 'UPDATE', 'treatments', '1', '{"slug":"ivf-in-vitro-fertilization","title":"IVF (In Vitro Fertilization)"}', '2026-10-05T00:08:43.000Z'),
  (298, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36"}', '2026-10-05T00:11:20.000Z'),
  (299, 'admin', 'LOGIN', 'users', '1', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36"}', '2026-10-05T00:11:47.000Z'),
  (300, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"::ffff:127.0.0.1"}', '2026-10-05T01:32:40.000Z');

INSERT INTO `audit_logs` (`id`, `user_name`, `action`, `entity_type`, `entity_id`, `details`, `created_at`) VALUES
  (301, 'admin', 'LOGIN', 'users', '1', '{"ip":"::ffff:127.0.0.1"}', '2026-10-05T01:32:43.000Z'),
  (302, 'admin', 'CREATE', 'users', '8', '{"role":"staff","username":"teststaff_1791183763801"}', '2026-10-05T01:32:43.000Z'),
  (303, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"::ffff:127.0.0.1"}', '2026-10-05T01:32:43.000Z'),
  (304, 'admin', 'LOGIN', 'users', '1', '{"ip":"::ffff:127.0.0.1"}', '2026-10-05T01:32:43.000Z'),
  (305, 'admin', 'UPDATE', 'users', '8', '{"role":"staff","username":"teststaff_1791183763801","passwordChanged":true}', '2026-10-05T01:32:43.000Z'),
  (306, 'staff', 'LOGIN', 'users', '3', '{"ip":"::ffff:127.0.0.1"}', '2026-10-05T01:32:44.000Z'),
  (307, 'admin', 'CONVERT_ENQUIRY', 'appointments', '59', '{"enquiryId":"35","patientName":"Sita Devi"}', '2026-10-05T01:32:44.000Z'),
  (308, 'admin', 'UPDATE', 'appointments', '59', '{"status":"consulted"}', '2026-10-05T01:32:44.000Z'),
  (309, 'admin', 'UPDATE', 'appointments', '59', '{"status":"waiting"}', '2026-10-05T01:32:44.000Z'),
  (310, 'admin', 'UPDATE', 'treatments', '5', '{"slug":"painless-delivery-maternity-care","title":"Painless Delivery & Comprehensive Maternity"}', '2026-10-05T01:32:45.000Z'),
  (311, 'superadmin', 'DELETE', 'users', '8', '{"targetId":"8","username":"teststaff_1791183763801"}', '2026-10-05T01:32:45.000Z'),
  (312, 'staff', 'CREATE', 'gallery', '38', '{"title":"Modern IVF Laboratory Tour","media_type":"youtube"}', '2026-10-05T01:32:46.000Z'),
  (313, 'admin', 'UPDATE', 'gallery', '38', '{"title":"Advanced IVF Laboratory Tour (Updated)","media_type":"youtube"}', '2026-10-05T01:32:46.000Z'),
  (314, 'admin', 'DELETE', 'gallery', '38', '{"title":"Advanced IVF Laboratory Tour (Updated)"}', '2026-10-05T01:32:46.000Z'),
  (315, 'admin', 'LOGIN', 'users', '1', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.8010.12 Safari/537.36"}', '2026-10-05T01:48:51.000Z'),
  (316, 'admin', 'LOGIN', 'users', '1', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.8010.12 Safari/537.36"}', '2026-10-05T01:52:19.000Z'),
  (317, 'admin', 'LOGIN', 'users', '1', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.8010.12 Safari/537.36"}', '2026-10-05T01:53:56.000Z'),
  (318, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"::ffff:127.0.0.1"}', '2026-10-05T01:54:48.000Z'),
  (319, 'admin', 'LOGIN', 'users', '1', '{"ip":"::ffff:127.0.0.1"}', '2026-10-05T01:54:49.000Z'),
  (320, 'admin', 'CREATE', 'users', '9', '{"role":"staff","username":"teststaff_1791185089882"}', '2026-10-05T01:54:49.000Z'),
  (321, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"::ffff:127.0.0.1"}', '2026-10-05T01:54:50.000Z'),
  (322, 'admin', 'UPDATE', 'users', '9', '{"role":"staff","username":"teststaff_1791185089882","passwordChanged":true}', '2026-10-05T01:54:50.000Z'),
  (323, 'admin', 'CONVERT_ENQUIRY', 'appointments', '61', '{"enquiryId":"37","patientName":"Sita Devi"}', '2026-10-05T01:54:51.000Z'),
  (324, 'admin', 'LOGIN', 'users', '1', '{"ip":"::ffff:127.0.0.1"}', '2026-10-05T01:54:51.000Z'),
  (325, 'admin', 'UPDATE', 'appointments', '61', '{"status":"consulted"}', '2026-10-05T01:54:51.000Z'),
  (326, 'admin', 'UPDATE', 'appointments', '61', '{"status":"waiting"}', '2026-10-05T01:54:51.000Z'),
  (327, 'staff', 'LOGIN', 'users', '3', '{"ip":"::ffff:127.0.0.1"}', '2026-10-05T01:54:52.000Z'),
  (328, 'admin', 'UPDATE', 'treatments', '19', '{"slug":"ivf-in-vitro-fertilization-blastocyst","title":"IVF (In Vitro Fertilization) & Blastocyst Culture"}', '2026-10-05T01:54:52.000Z'),
  (329, 'superadmin', 'DELETE', 'users', '9', '{"targetId":"9","username":"teststaff_1791185089882"}', '2026-10-05T01:54:52.000Z'),
  (330, 'staff', 'CREATE', 'gallery', '39', '{"title":"Modern IVF Laboratory Tour","media_type":"youtube"}', '2026-10-05T01:54:55.000Z'),
  (331, 'admin', 'UPDATE', 'gallery', '39', '{"title":"Advanced IVF Laboratory Tour (Updated)","media_type":"youtube"}', '2026-10-05T01:54:55.000Z'),
  (332, 'admin', 'DELETE', 'gallery', '39', '{"title":"Advanced IVF Laboratory Tour (Updated)"}', '2026-10-05T01:54:56.000Z'),
  (333, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36"}', '2026-10-05T02:00:26.000Z'),
  (334, 'superadmin', 'UPDATE', 'appointments', '62', '{"status":"waiting"}', '2026-10-05T02:00:39.000Z'),
  (335, 'superadmin', 'UPDATE', 'appointments', '60', '{"status":"consulted"}', '2026-10-05T02:00:43.000Z'),
  (336, 'superadmin', 'CONVERT_ENQUIRY', 'appointments', '63', '{"enquiryId":"37","patientName":"Sita Devi"}', '2026-10-05T02:01:04.000Z'),
  (337, 'superadmin', 'DELETE', 'enquiries', '37', '{"id":"37"}', '2026-10-05T02:01:23.000Z'),
  (338, 'superadmin', 'DELETE', 'enquiries', '35', '{"id":"35"}', '2026-10-05T02:01:27.000Z'),
  (339, 'superadmin', 'DELETE', 'enquiries', '36', '{"id":"36"}', '2026-10-05T02:01:33.000Z'),
  (340, 'superadmin', 'DELETE', 'enquiries', '38', '{"id":"38"}', '2026-10-05T02:01:36.000Z'),
  (341, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36"}', '2026-10-06T07:29:03.000Z'),
  (342, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36"}', '2026-10-06T08:17:29.000Z'),
  (343, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36"}', '2026-10-06T08:40:53.000Z'),
  (344, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36"}', '2026-10-07T08:58:25.000Z'),
  (345, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36"}', '2026-10-07T09:00:10.000Z'),
  (346, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36"}', '2026-10-07T09:29:39.000Z'),
  (347, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36"}', '2026-10-08T08:09:46.000Z'),
  (348, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36"}', '2026-10-08T08:19:10.000Z'),
  (349, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36"}', '2026-10-08T08:23:26.000Z'),
  (350, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36"}', '2026-10-08T09:09:05.000Z');

INSERT INTO `audit_logs` (`id`, `user_name`, `action`, `entity_type`, `entity_id`, `details`, `created_at`) VALUES
  (351, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36"}', '2026-10-13T02:32:21.000Z'),
  (352, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36"}', '2026-10-13T03:08:37.000Z'),
  (353, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36"}', '2026-10-13T05:50:43.000Z'),
  (354, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36"}', '2026-10-13T05:50:44.000Z'),
  (355, 'superadmin', 'LOGIN', 'users', '2', '{"ip":"127.0.0.1","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36"}', '2026-10-13T05:50:52.000Z');

-- --------------------------------------------------------
-- Table structure for table `blog_posts`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `blog_posts`;
CREATE TABLE `blog_posts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `slug` varchar(150) NOT NULL,
  `title` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `author` varchar(255) NOT NULL,
  `read_time` varchar(50) DEFAULT '5 min read',
  `summary` text NOT NULL,
  `content` longtext NOT NULL,
  `image_url` text,
  `published_at` date NOT NULL,
  `featured` tinyint(1) DEFAULT '0',
  `status` enum('published','draft') DEFAULT 'published',
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
);

-- Dumping data for table `blog_posts` (8 rows)

INSERT INTO `blog_posts` (`id`, `slug`, `title`, `category`, `author`, `read_time`, `summary`, `content`, `image_url`, `published_at`, `featured`, `status`) VALUES
  (22, 'you-trust-we-care-fertility-maternity', 'You Trust, We Care: Compassionate Fertility & Motherhood Excellence', 'Hospital Care & Philosophy', 'Dr. G. Sindhu (MS OBGYN)', '5 min read', 'At Sreemantha Hospital, every patient\'s trust is honored with dedicated medical excellence, empathetic clinical guidance, and personalized fertility and maternity care in Khammam.', '<p>Trust is the cornerstone of every healing relationship. When couples embark on their journey towards parenthood, the emotional and physical aspects require profound understanding and clinical expertise. At Sreemantha Hospital, our guiding principle is simple yet resolute: <strong>"You Trust, We Care"</strong>.</p><h3>Why Compassionate Care Matters</h3><p>From initial fertility consultations to advanced IVF and delivery, our multidisciplinary team of obstetricians, embryologists, and neonatologists walk alongside every family. We provide transparent counseling, personalized treatment protocols, and world-class cleanroom lab standards to ensure the highest success rates with maximum comfort.</p>', '/images/blogs/blog-you-trust-we-care.webp', '2026-09-19T18:30:00.000Z', 1, 'published'),
  (23, 'let-wonderful-things-happen-fertility-journey', 'Let Wonderful Things Happen: Transforming Dreams of Parenthood into Reality', 'Fertility & IVF', 'Clinical Embryology Team', '6 min read', 'Overcoming fertility challenges with modern reproductive medicine, advanced blastocyst culture, and compassionate clinical expertise.', '<p>Every hopeful parent\'s dream is precious. At Sreemantha Hospital, our advanced fertility unit is engineered to make wonderful things happen for couples navigating infertility.</p><h3>Advanced Reproductive Technologies Available</h3><ul><li><strong>Class 10,000 Modular IVF Embryology Lab</strong> with HEPA and VOC filtration</li><li><strong>Intracytoplasmic Sperm Injection (ICSI)</strong> for severe male factor cases</li><li><strong>Blastocyst Culture (Day 5)</strong> for superior embryo viability and implantation</li><li><strong>Laser Assisted Hatching & Cryopreservation</strong></li></ul><p>Our dedicated fertility specialists tailor each protocol to match individual ovarian reserve, hormonal profiles, and genetic parameters.</p>', '/images/blogs/blog-let-wonderful-things-happen.webp', '2026-09-23T18:30:00.000Z', 1, 'published'),
  (24, 'happiness-is-hearing-babys-first-cry', 'Happiness is Hearing Your Baby’s First Cry: What to Expect During Safe Delivery', 'Obstetrics & Maternity', 'Dr. G. Sindhu (MS OBGYN)', '5 min read', 'The miraculous moment of childbirth: how Sreemantha Hospital ensures painless delivery, maternal safety, and immediate neonatal bonding.', '<p>There is no sound more joyful and reassuring in the world than a newborn baby\'s first vigorous cry. It signifies the commencement of new life and the triumphant culmination of months of maternal care.</p><h3>Ensuring a Safe, Memorable Childbirth</h3><p>At Sreemantha Hospital, our labor and delivery suites are integrated directly with modular operating rooms and our Level-III NICU. We provide:</p><ul><li><strong>24/7 Painless Normal Delivery (Epidural Analgesia)</strong> administered by expert anesthesiologists</li><li><strong>Continuous Electronic Fetal Heart Rate Monitoring (CTG)</strong></li><li><strong>Immediate Skin-to-Skin Kangaroo Mother Care</strong> and lactation support</li><li><strong>Emergency C-Section Readiness within 15 minutes</strong> for high-risk obstetric cases</li></ul>', '/images/blogs/blog-baby-first-cry.webp', '2026-09-27T18:30:00.000Z', 1, 'published'),
  (25, 'every-child-birth-is-special-and-memorable', 'For Us Every Child Birth is Special and Memorable: Personalized Maternity Suites', 'Maternity & Labor Care', 'Obstetric Nursing Team', '4 min read', 'Celebrating every birth with dignity, warmth, and clinical precision in our modern maternity suites in Khammam.', '<p>Childbirth is a milestone that stays in a mother\'s heart for lifetime. Recognizing this, Sreemantha Hospital transforms the clinical hospital experience into an empowering, celebratory journey.</p><p>Our private maternity suites are thoughtfully designed to balance clinical safety with domestic warmth. With 24/7 obstetric monitoring, dedicated nursing staff, and round-the-clock neonatologist availability, mothers and families experience absolute peace of mind.</p>', '/images/blogs/blog-childbirth-special-memorable.webp', '2026-09-30T18:30:00.000Z', 0, 'published'),
  (26, 'follow-your-babys-cues-neonatal-signs', 'Follow Your Baby’s Cues: Essential Signs Every New Parent Should Recognize', 'Pediatrics & Newborn Care', 'Dr. B. V. N. Krishna (MD Pediatrics, Neonatologist)', '6 min read', 'Dr. B. V. N. Krishna explains the vital non-verbal cues newborns use to communicate hunger, sleepiness, colic discomfort, and clinical warning signs.', '<p>Newborn babies communicate continuously through subtle behavioral and physical cues. Learning to read these cues helps parents respond promptly and prevents parental anxiety.</p><h3>Common Baby Cues Decoded</h3><ul><li><strong>Early Hunger Cues:</strong> Lip smacking, head turning (rooting reflex), hands brought to mouth. Crying is a late hunger cue!</li><li><strong>Sleepiness Cues:</strong> Yawning, looking away, rubbing eyes, stiffening limbs.</li><li><strong>Colic / Gas Cues:</strong> Clenched fists, pulling legs towards the tummy, arching back during or after feeding.</li></ul><h3>When to Seek Immediate Medical Evaluation</h3><p>Contact our pediatric emergency department immediately if you notice lethargy, poor sucking, breathing difficulties (chest indrawing), persistent vomiting, or body temperature above 100.4°F.</p>', '/images/blogs/blog-follow-baby-cues.webp', '2026-10-01T18:30:00.000Z', 1, 'published'),
  (27, 'fertility-impacts-men-and-women-all-ages', 'Fertility Impacts Men & Women of All Ages: Breaking Infertility Myths with Science', 'Reproductive Medicine', 'Fertility & Andrology Specialists', '7 min read', 'Infertility affects both partners equally. Discover how timely diagnostic evaluations and lifestyle modifications improve conception chances.', '<p>A prevalent misconception in society is that infertility is predominantly a female concern. Medical science unequivocally shows that approximately 40% of infertility factors are male-related, 40% female-related, and 20% combined or unexplained.</p><h3>Key Factors Affecting Fertility</h3><ul><li><strong>Age & Ovarian Reserve:</strong> Anti-Müllerian Hormone (AMH) and Antral Follicle Count (AFC) assessments.</li><li><strong>Sperm Quality Parameters:</strong> Semen analysis testing count, motility, and normal morphology.</li><li><strong>Lifestyle Factors:</strong> Smoking, alcohol, endocrine disruptors, obesity, and chronic stress.</li></ul><p>Early evaluation enables targeted, less invasive treatments like ovulation tracking and IUI before progressing to IVF if required.</p>', '/images/blogs/blog-fertility-all-ages.webp', '2026-10-02T18:30:00.000Z', 0, 'published'),
  (28, 'embrace-good-health-happiness-for-child', 'Embrace Good Health & Happiness for Your Child: Complete Pediatric Wellness Guide', 'Pediatrics & Child Health', 'Dr. G. Latha (MD Paediatrics)', '5 min read', 'Essential guidelines for child immunization schedules, balanced nutritional milestones, and cognitive growth from infancy to school age.', '<p>A healthy child is a happy child. Pediatric wellness extends beyond treating illness to proactive preventive healthcare, timely vaccinations, and balanced emotional growth.</p><h3>Key Pillars of Pediatric Wellness</h3><ul><li><strong>Immunization Adherence:</strong> Strict compliance with the Indian Academy of Pediatrics (IAP) vaccination schedule protecting against polio, measles, rotavirus, pneumococcus, and MMR.</li><li><strong>Milestone Tracking:</strong> Regular developmental assessments measuring motor skills, language acquisition, and social interaction.</li><li><strong>Nutrition & Hydration:</strong> Exclusive breastfeeding for the first 6 months, followed by wholesome age-appropriate complementary foods.</li></ul>', '/images/blogs/blog-embrace-health-happiness.webp', '2026-10-03T18:30:00.000Z', 0, 'published'),
  (29, 'beat-male-infertility-become-a-father', 'Beat Male Infertility: Modern Medical Solutions to Becoming a Father', 'Andrology & Men\'s Health', 'Andrology Department', '6 min read', 'Exploring clinical breakthroughs in treating male infertility including lifestyle reversal, medical therapies, TESA, and ICSI.', '<p>Male factor infertility is increasingly prevalent due to sedentary lifestyles, environmental pollutants, and metabolic imbalances. Fortunately, modern reproductive medicine offers powerful clinical pathways for men to achieve biological fatherhood.</p><h3>Modern Treatment Options</h3><ul><li><strong>Medical Therapy:</strong> Antioxidant regimens and hormonal balance correction for oligospermia.</li><li><strong>Intracytoplasmic Sperm Injection (ICSI):</strong> Selecting a single healthy sperm for direct egg fertilization.</li><li><strong>Testicular Sperm Aspiration (TESA / PESA):</strong> Surgical sperm retrieval for obstructive azoospermia.</li></ul>', '/images/blogs/blog-beat-male-infertility.webp', '2026-10-04T18:30:00.000Z', 1, 'published');

-- --------------------------------------------------------
-- Table structure for table `departments`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `departments`;
CREATE TABLE `departments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `slug` varchar(120) NOT NULL,
  `name` varchar(255) NOT NULL,
  `tagline` varchar(255) DEFAULT NULL,
  `description` longtext,
  `head_doctor_name` varchar(255) DEFAULT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `status` enum('draft','published') DEFAULT 'published',
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
);

-- Dumping data for table `departments` (4 rows)

INSERT INTO `departments` (`id`, `slug`, `name`, `tagline`, `description`, `head_doctor_name`, `icon`, `image_url`, `status`) VALUES
  (1, 'fertility-reproductive-medicine', 'Fertility and Reproductive Medicine', 'World-Class IVF & Embryology in Khammam', 'Complete assisted reproduction suite with cleanroom IVF lab, ICSI workstations, and blastocyst vitrification.', 'Dr. S. Sreemantha Rao', 'Sparkles', '/images/departments/fertility-reproductive-medicine.webp', 'published'),
  (2, 'obstetrics-gynecology', 'Obstetrics and Gynecology', 'Holistic Maternal & Women Healthcare', 'Painless delivery suites, advanced high-risk obstetric monitoring, and 4K minimally invasive laparoscopy.', 'Dr. P. Shravani', 'HeartHandshake', '/images/departments/obstetrics-gynecology.webp', 'published'),
  (3, 'pediatrics-neonatology', 'Pediatrics and Neonatal Intensive Care (NICU)', 'Level III 24/7 Newborn & Pediatric Care', 'Advanced intensive care for premature and sick newborns with Giraffe incubators and dedicated transport ambulance.', 'Dr. M. Vamsi Krishna', 'Baby', '/images/departments/pediatrics-neonatology.webp', 'published'),
  (4, 'fetal-medicine-diagnostics', 'Fetal Medicine and Advanced Ultrasound', 'Precision 4D Prenatal Imaging', 'GE Voluson E10 4D ultrasound, NT anomaly screening, fetal Doppler, and non-invasive prenatal testing (NIPT).', 'Dr. P. Shravani', 'Activity', '/images/departments/fetal-medicine-diagnostics.webp', 'published');

-- --------------------------------------------------------
-- Table structure for table `doctors`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `doctors`;
CREATE TABLE `doctors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `slug` varchar(120) NOT NULL,
  `name` varchar(255) NOT NULL,
  `designation` varchar(255) NOT NULL,
  `department` varchar(100) NOT NULL,
  `qualifications` text NOT NULL,
  `experience_years` int NOT NULL,
  `languages` json DEFAULT NULL,
  `short_bio` text NOT NULL,
  `full_bio` longtext,
  `education` json DEFAULT NULL,
  `certifications` json DEFAULT NULL,
  `opd_timings` varchar(255) DEFAULT NULL,
  `photo_url` text,
  `featured` tinyint(1) DEFAULT '0',
  `display_order` int DEFAULT '0',
  `status` enum('draft','published') DEFAULT 'published',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
);

-- Dumping data for table `doctors` (3 rows)

INSERT INTO `doctors` (`id`, `slug`, `name`, `designation`, `department`, `qualifications`, `experience_years`, `languages`, `short_bio`, `full_bio`, `education`, `certifications`, `opd_timings`, `photo_url`, `featured`, `display_order`, `status`, `created_at`) VALUES
  (11, 'dr-g-sindhu', 'Dr. G. Sindhu (Dr. Sindhu Gundamalla)', 'Obstetrics, Gynecology & Infertility Specialist', 'Obstetrics, Gynecology & Infertility', 'M.B.B.S., M.S. (OBGYN) - Osmania Medical College', 12, '["Telugu","English","Hindi"]', 'Specialist in high-risk pregnancies, laparoscopic gynecological surgeries, and personalized fertility therapies.', 'Dr. G. Sindhu (డా॥ సింధు గుండమళ్ళ) is a distinguished Consultant Obstetrician, Gynecologist, and Infertility Specialist holding M.B.B.S. and M.S. (OBGYN) from the premier Osmania Medical College. With Regd. No. TSMC/FMR/03919, she is renowned across Khammam for empowering women\'s health and enriching motherhood with evidence-based fertility solutions, painless delivery expertise, and advanced minimally invasive laparoscopy.', '["M.B.B.S. - Osmania Medical College, Hyderabad","M.S. (Obstetrics & Gynecology) - Osmania Medical College","Fellowship in Reproductive Medicine & Infertility","Advanced Training in 3D/4K Minimal Access Gynecological Laparoscopy"]', '["TSMC Reg. No: TSMC/FMR/03919","Life Member - Federation of Obstetric and Gynaecological Societies of India (FOGSI)","Member - Indian Society for Assisted Reproduction (ISAR)"]', '10:00 AM - 02:00 PM & 05:00 PM - 08:00 PM', '/images/reception-newborn-card.webp', 1, 1, 'published', '2026-10-05T01:38:52.000Z'),
  (12, 'dr-b-v-n-krishna', 'Dr. B. V. N. Krishna', 'Consultant Pediatrician & Neonatologist', 'Pediatrics & Level-III Neonatology', 'M.B.B.S., M.D. (Pediatrics) - VMMC & SJH, Delhi', 11, '["Telugu","English","Hindi"]', 'Specialist in Level-III neonatal intensive care, extremely preterm baby resuscitation, and comprehensive child development.', 'Dr. B. V. N. Krishna (డా॥ బి.వి.ఎన్. కృష్ణ) is an acclaimed Pediatrician & Neonatologist with M.B.B.S. and M.D. (Pediatrics) from the prestigious Vardhman Mahavir Medical College & Safdarjung Hospital (VMMC & SJH), New Delhi, complemented by an advanced Fellowship in Neonatology. With Regd. No. TSMC/FMR/07376, Dr. Krishna leads Sreemantha Hospital\'s state-of-the-art 24/7 Level-III NICU, safeguarding critically ill and preterm newborns with compassionate clinical precision.', '["M.B.B.S. - VMMC & Safdarjung Hospital, New Delhi","M.D. (Pediatrics) - VMMC & Safdarjung Hospital, New Delhi","Fellowship in Advanced Neonatology (Level-III NICU)"]', '["TSMC Reg. No: TSMC/FMR/07376","Member - National Neonatology Forum (NNF) India","Member - Indian Academy of Pediatrics (IAP)"]', '09:00 AM - 01:00 PM & 04:00 PM - 08:00 PM (Emergency 24/7)', '/images/incubator-nicu-card.webp', 1, 2, 'published', '2026-10-05T01:38:52.000Z'),
  (13, 'dr-g-latha', 'Dr. G. Latha', 'Consultant Pediatrician & Neonatologist', 'Pediatrics & Neonatal Care', 'M.B.B.S., M.D. Paed. (KMC)', 14, '["Telugu","English"]', 'Expert pediatrician dedicated to newborn care, immunizations, childhood growth, and adolescent wellness.', 'Dr. G. Latha is a respected Pediatrician and Neonatologist holding M.B.B.S. and M.D. in Pediatrics from Kakatiya Medical College (KMC), registered under TSMC/FMR/05781. She brings extensive experience in pediatric clinical management, preventive child healthcare, and neonatal monitoring to Sreemantha Hospital.', '["M.B.B.S. - Kakatiya Medical College","M.D. (Pediatrics) - Kakatiya Medical College (KMC)"]', '["TSMC Reg. No: TSMC/FMR/05781","Member - Indian Academy of Pediatrics (IAP)"]', '10:30 AM - 01:30 PM & 05:30 PM - 07:30 PM', '/images/operation-theatre-card.webp', 1, 3, 'published', '2026-10-05T01:38:52.000Z');

-- --------------------------------------------------------
-- Table structure for table `enquiries`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `enquiries`;
CREATE TABLE `enquiries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'unread',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

-- Dumping data for table `enquiries` (33 rows)

INSERT INTO `enquiries` (`id`, `name`, `phone`, `email`, `subject`, `message`, `status`, `created_at`) VALUES
  (1, 'Ramesh Reddy', '+91 91234 56789', 'ramesh.reddy@example.com', 'Inquiry regarding Cashless Insurance', 'Do you accept Star Health Insurance for maternity packages?', 'New', '2026-09-28T18:00:38.000Z'),
  (2, 'Ramesh Reddy', '+91 91234 56789', 'ramesh.reddy@example.com', 'Inquiry regarding Cashless Insurance', 'Do you accept Star Health Insurance for maternity packages?', 'New', '2026-09-28T18:03:48.000Z'),
  (3, 'Ramesh Reddy', '+91 91234 56789', 'ramesh.reddy@example.com', 'Inquiry regarding Cashless Insurance', 'Do you accept Star Health Insurance for maternity packages?', 'New', '2026-09-28T18:04:23.000Z'),
  (4, 'Ramesh Reddy', '+91 91234 56789', 'ramesh.reddy@example.com', 'Inquiry regarding Cashless Insurance', 'Do you accept Star Health Insurance for maternity packages?', 'New', '2026-09-28T18:24:47.000Z'),
  (5, 'Ramesh Reddy', '+91 91234 56789', 'ramesh.reddy@example.com', 'Inquiry regarding Cashless Insurance', 'Do you accept Star Health Insurance for maternity packages?', 'New', '2026-09-28T18:26:36.000Z'),
  (6, 'Ramesh Reddy', '+91 91234 56789', 'ramesh.reddy@example.com', 'Inquiry regarding Cashless Insurance', 'Do you accept Star Health Insurance for maternity packages?', 'New', '2026-09-28T18:49:37.000Z'),
  (7, 'Ramesh Reddy', '+91 91234 56789', 'ramesh.reddy@example.com', 'Inquiry regarding Cashless Insurance', 'Do you accept Star Health Insurance for maternity packages?', 'New', '2026-09-28T18:57:57.000Z'),
  (8, 'Ramesh Reddy', '+91 91234 56789', 'ramesh.reddy@example.com', 'Inquiry regarding Cashless Insurance', 'Do you accept Star Health Insurance for maternity packages?', 'New', '2026-09-29T11:50:55.000Z'),
  (9, 'Ramesh Reddy', '+91 91234 56789', 'ramesh.reddy@example.com', 'Inquiry regarding Cashless Insurance', 'Do you accept Star Health Insurance for maternity packages?', 'New', '2026-10-01T12:14:40.000Z'),
  (10, 'Ramesh Reddy', '+91 91234 56789', 'ramesh.reddy@example.com', 'Inquiry regarding Cashless Insurance', 'Do you accept Star Health Insurance for maternity packages?', 'New', '2026-10-01T12:17:30.000Z'),
  (11, 'Ramesh Reddy', '+91 91234 56789', 'ramesh.reddy@example.com', 'Inquiry regarding Cashless Insurance', 'Do you accept Star Health Insurance for maternity packages?', 'New', '2026-10-01T12:29:06.000Z'),
  (12, 'Ramesh Reddy', '+91 91234 56789', 'ramesh.reddy@example.com', 'Inquiry regarding Cashless Insurance', 'Do you accept Star Health Insurance for maternity packages?', 'New', '2026-10-01T12:35:28.000Z'),
  (13, 'Ramesh Reddy', '+91 91234 56789', 'ramesh.reddy@example.com', 'Inquiry regarding Cashless Insurance', 'Do you accept Star Health Insurance for maternity packages?', 'New', '2026-10-01T12:48:16.000Z'),
  (14, 'Ramesh Reddy', '+91 91234 56789', 'ramesh.reddy@example.com', 'Inquiry regarding Cashless Insurance', 'Do you accept Star Health Insurance for maternity packages?', 'New', '2026-10-01T12:49:50.000Z'),
  (15, 'Ramesh Reddy', '+91 91234 56789', 'ramesh.reddy@example.com', 'Inquiry regarding Cashless Insurance', 'Do you accept Star Health Insurance for maternity packages?', 'New', '2026-10-01T13:07:09.000Z'),
  (16, 'Ramesh Reddy', '+91 91234 56789', 'ramesh.reddy@example.com', 'Inquiry regarding Cashless Insurance', 'Do you accept Star Health Insurance for maternity packages?', 'New', '2026-10-01T13:22:20.000Z'),
  (17, 'Ramesh Reddy', '+91 91234 56789', 'ramesh.reddy@example.com', 'Inquiry regarding Cashless Insurance', 'Do you accept Star Health Insurance for maternity packages?', 'New', '2026-10-01T13:25:55.000Z'),
  (18, 'Ramesh Reddy', '+91 91234 56789', 'ramesh.reddy@example.com', 'Inquiry regarding Cashless Insurance', 'Do you accept Star Health Insurance for maternity packages?', 'New', '2026-10-01T13:29:43.000Z'),
  (19, 'Ramesh Reddy', '+91 91234 56789', 'ramesh.reddy@example.com', 'Inquiry regarding Cashless Insurance', 'Do you accept Star Health Insurance for maternity packages?', 'New', '2026-10-01T14:16:52.000Z'),
  (20, 'Ramesh Reddy', '+91 91234 56789', 'ramesh.reddy@example.com', 'Inquiry regarding Cashless Insurance', 'Do you accept Star Health Insurance for maternity packages?', 'New', '2026-10-01T14:48:17.000Z'),
  (21, 'Ramesh Reddy', '+91 91234 56789', 'ramesh.reddy@example.com', 'Inquiry regarding Cashless Insurance', 'Do you accept Star Health Insurance for maternity packages?', 'New', '2026-10-01T15:39:24.000Z'),
  (22, 'Ramesh Reddy', '+91 91234 56789', 'ramesh.reddy@example.com', 'Inquiry regarding Cashless Insurance', 'Do you accept Star Health Insurance for maternity packages?', 'New', '2026-10-01T17:34:30.000Z'),
  (23, 'Ramesh Reddy', '+91 91234 56789', 'ramesh.reddy@example.com', 'Inquiry regarding Cashless Insurance', 'Do you accept Star Health Insurance for maternity packages?', 'New', '2026-10-01T17:35:09.000Z'),
  (24, 'Ramesh Reddy', '+91 91234 56789', 'ramesh.reddy@example.com', 'Inquiry regarding Cashless Insurance', 'Do you accept Star Health Insurance for maternity packages?', 'New', '2026-10-01T17:37:55.000Z'),
  (26, 'Ramesh Reddy', '+91 91234 56789', 'ramesh.reddy@example.com', 'Inquiry regarding Cashless Insurance', 'Do you accept Star Health Insurance for maternity packages?', 'New', '2026-10-03T12:05:41.000Z'),
  (27, 'Nandini Nadukula', '+919493819872', 'sk.rasheedali@gmail.com', 'General Consultation Inquiry', 'I want care', 'New', '2026-10-04T01:37:00.000Z'),
  (28, 'Ramesh Reddy', '+91 91234 56789', 'ramesh.reddy@example.com', 'Inquiry regarding Cashless Insurance', 'Do you accept Star Health Insurance for maternity packages?', 'New', '2026-10-04T07:57:57.000Z'),
  (29, 'Sita Devi', '9876543210', 'sita@example.com', 'IVF Consultation Enquiry', 'Looking for initial fertility assessment and consultation.', 'New', '2026-10-04T08:00:30.000Z'),
  (30, 'Sita Devi', '9876543210', 'sita@example.com', 'IVF Consultation Enquiry', 'Looking for initial fertility assessment and consultation.', 'contacted', '2026-10-04T08:03:17.000Z'),
  (31, 'Sita Devi', '9876543210', 'sita@example.com', 'IVF Consultation Enquiry', 'Looking for initial fertility assessment and consultation.', 'contacted', '2026-10-04T08:03:28.000Z'),
  (32, 'Ramesh Reddy', '+91 91234 56789', 'ramesh.reddy@example.com', 'Inquiry regarding Cashless Insurance', 'Do you accept Star Health Insurance for maternity packages?', 'New', '2026-10-04T08:03:30.000Z'),
  (33, 'Sita Devi', '9876543210', 'sita@example.com', 'IVF Consultation Enquiry', 'Looking for initial fertility assessment and consultation.', 'contacted', '2026-10-04T08:05:20.000Z'),
  (34, 'Ramesh Reddy', '+91 91234 56789', 'ramesh.reddy@example.com', 'Inquiry regarding Cashless Insurance', 'Do you accept Star Health Insurance for maternity packages?', 'New', '2026-10-04T08:06:42.000Z');

-- --------------------------------------------------------
-- Table structure for table `facilities`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `facilities`;
CREATE TABLE `facilities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `slug` varchar(120) NOT NULL,
  `name` varchar(255) NOT NULL,
  `short_description` text NOT NULL,
  `description` longtext,
  `equipment` json DEFAULT NULL,
  `image_url` text,
  `status` enum('draft','published') DEFAULT 'published',
  `display_order` int DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
);

-- Dumping data for table `facilities` (4 rows)

INSERT INTO `facilities` (`id`, `slug`, `name`, `short_description`, `description`, `equipment`, `image_url`, `status`, `display_order`) VALUES
  (5, 'hospital-building-infrastructure', 'Multi-Specialty Hospital Infrastructure & Reception', 'Modern 5-floor clinical campus in Khammam with spacious waiting lobbies, 24/7 pharmacy, and emergency desks.', 'Sreemantha Hospital\'s campus is purpose-built to provide a welcoming, serene, and clinically sterile environment for women, mothers, and children. Features centralized air-handling units, dedicated triage, and seamless digital registration desks.', '["High-Speed Patient Elevators","24/7 Digital Registration Desks","Centralized Medical Gas Pipeline","Dedicated Patient Pharmacy","Comfortable Executive Waiting Lounges"]', '/images/hospital-exterior.webp', 'published', 1),
  (6, 'level-3-neonatal-intensive-care-unit', '24/7 Level-III Neonatal Intensive Care Unit (NICU)', 'Khammam\'s premier tertiary neonatal center equipped with multi-zone incubators and round-the-clock neonatologists.', 'Our Level-III NICU is engineered to provide life-saving care to extremely premature neonates and critically ill newborns. Equipped with advanced GE Giraffe and Dräger incubators, LED phototherapy, and high-frequency ventilators.', '["Advanced Servo-Controlled Incubators","Dräger Multi-Mode Neonatal Ventilators","Double Surface LED Phototherapy Units","Continuous Multi-Para Vital Monitors","Laminar Flow TPN Preparation Station"]', '/images/incubator-nicu.webp', 'published', 2),
  (7, 'modular-operation-theatre-laparoscopy', 'Ultra-Clean Modular Operation Theatres', 'Class 10,000 laminar airflow surgical suites equipped with 4K Karl Storz laparoscopy towers for maternity and gynecology.', 'Designed to international surgical standards with seamless anti-bacterial surfaces, laminar airflow, and HEPA air filtration. Capable of handling complex emergency C-sections within 15 minutes, radical pelvic surgeries, and microscopic fertility operations.', '["Karl Storz 4K Ultra-HD Laparoscopy Tower","Laminar Airflow Positive Pressure System","Advanced Mindray Anesthesia Workstations","ValleyLab Ultrasonic Energy Dissection Devices","Emergency Crash Cart & Defibrillator"]', '/images/operation-theatre.webp', 'published', 3),
  (8, 'reception-maternity-experience-center', 'Maternity Patient Experience & Postnatal Suites', 'Dedicated maternity floor, luxury postnatal recovery suites, and compassionate patient care counselors.', 'At Sreemantha Hospital, welcoming a new baby is celebrated with dignity and happiness. Our maternity suites provide quiet, supportive recovery environments for new mothers and their newborn babies with immediate bedside assistance.', '["Private Air-Conditioned Postnatal Rooms","Dedicated Lactation Counseling Suite","Bedside Electronic Nurse Call System","Kangaroo Mother Care Recliners","24/7 Pediatric Ward Coverage"]', '/images/reception-newborn.webp', 'published', 4);

-- --------------------------------------------------------
-- Table structure for table `faqs`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `faqs`;
CREATE TABLE `faqs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category` varchar(100) NOT NULL,
  `question` varchar(500) NOT NULL,
  `answer` longtext NOT NULL,
  `display_order` int DEFAULT '0',
  `status` enum('published','draft') DEFAULT 'published',
  PRIMARY KEY (`id`)
);

-- Dumping data for table `faqs` (6 rows)

INSERT INTO `faqs` (`id`, `category`, `question`, `answer`, `display_order`, `status`) VALUES
  (1, 'Fertility', 'What is the IVF success rate at Sreemantha Hospital Khammam?', 'Our cumulative IVF pregnancy success rate stands at 78% for women under 35, achieved through our advanced modular embryology laboratory, routine day-5 blastocyst culture, and individualized stimulation regimens supervised by senior specialists.', 1, 'published'),
  (2, 'Fertility', 'How do I know if I need IUI or IVF?', 'During your initial consultation, we conduct an ultrasound follicular scan, tubal patency evaluation, and semen analysis. Couples with open tubes and mild male factor challenges often begin with gentle IUI, whereas severe sperm issues, blocked tubes, or repeated IUI failures benefit from IVF or ICSI.', 2, 'published'),
  (3, 'Maternity', 'What is painless delivery, and is it safe for my baby?', 'Painless delivery utilizes labor epidural analgesia administered by experienced consultant anesthetists. It relieves the severe contractions pain while allowing you to remain fully conscious and physically active to push. Clinical studies confirm it is safe for both mother and infant.', 3, 'published'),
  (4, 'Pediatrics', 'When is a newborn admitted to the Level III NICU?', 'Babies born prematurely (before 36 weeks), with birth weights under 2.0 kg, respiratory distress, severe jaundice, infection, or difficult deliveries requiring observation receive immediate round-the-clock intensive care in our Level III NICU.', 4, 'published'),
  (5, 'Insurance', 'Which health insurance policies and TPAs offer cashless treatment here?', 'We offer cashless hospitalization with Star Health, HDFC ERGO, ICICI Lombard, Medi Assist, Vidal Health, Care Health, Niva Bupa, and Bajaj Allianz. We also assist with Telangana State Government EHS and Aarogyasri protocols. Our insurance desk manages documentation directly.', 5, 'published'),
  (6, 'General', 'What are the consultation timings and how do I book an appointment?', 'OPD operates Monday through Saturday from 9:00 AM to 8:00 PM, and Sunday from 9:00 AM to 1:00 PM. Emergency services, maternity casualty, and Level III NICU operate 24 hours every day. You can book online through this website or call +91 96667 81779.', 6, 'published');

-- --------------------------------------------------------
-- Table structure for table `gallery_items`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `gallery_items`;
CREATE TABLE `gallery_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `media_type` varchar(50) DEFAULT 'image',
  `media_url` text,
  `embed_code` text,
  `thumbnail_url` varchar(500) DEFAULT NULL,
  `caption` text,
  `display_order` int DEFAULT '0',
  PRIMARY KEY (`id`)
);

-- Dumping data for table `gallery_items` (8 rows)

INSERT INTO `gallery_items` (`id`, `title`, `category`, `media_type`, `media_url`, `embed_code`, `thumbnail_url`, `caption`, `display_order`) VALUES
  (1, 'Advanced IVF Embryology Cleanroom Lab', 'Facilities & Labs', 'image', '/images/gallery/gallery-embryology-lab.webp', '', '/images/gallery/gallery-embryology-lab.webp', 'HEPA-filtered Class 10,000 cleanroom equipped with high-resolution micromanipulators for ICSI and embryo vitrification.', 0),
  (2, 'Level III Neonatal Intensive Care Unit (NICU)', 'NICU & Pediatrics', 'image', '/images/gallery/gallery-level-3-nicu.webp', NULL, '/images/gallery/gallery-level-3-nicu.webp', 'Continuous multipara monitoring, advanced servo incubators, and dedicated neonatal resuscitation team on 24/7 duty.', 2),
  (3, 'Modular Laminar Airflow Operation Theatre', 'Operation Theatres', 'image', '/images/gallery/gallery-operation-theatre.webp', NULL, '/images/gallery/gallery-operation-theatre.webp', 'State-of-the-art sterile surgical theater dedicated to laparoscopic gynecology, hysteroscopy, and caesarean deliveries.', 3),
  (4, '4D Fetal Medicine & Ultrasound Diagnostics', 'Facilities & Labs', 'image', '/images/gallery/gallery-fetal-medicine.webp', NULL, '/images/gallery/gallery-fetal-medicine.webp', 'High-definition Voluson ultrasound technology for accurate fetal anomaly scans, nuchal translucency, and doppler studies.', 4),
  (5, 'Deluxe Patient Post-Operative & Recovery Suite', 'Hospital Infrastructure', 'image', '/images/gallery/gallery-recovery-suite.webp', NULL, '/images/gallery/gallery-recovery-suite.webp', 'Comfortable, private recovery rooms with attached patient amenities and dedicated nursing call systems.', 5),
  (6, 'Pediatric Care & Child Wellness Consultation Suites', 'NICU & Pediatrics', 'image', '/images/gallery/gallery-pediatric-consultation.webp', NULL, '/images/gallery/gallery-pediatric-consultation.webp', 'Child-friendly examination rooms designed to keep infants and children comfortable during routine vaccinations and wellness checks.', 6),
  (7, 'Sreemantha Hospital Welcoming Reception & Patient Lounge', 'Hospital Infrastructure', 'image', '/images/gallery/gallery-reception-lounge.webp', NULL, '/images/gallery/gallery-reception-lounge.webp', 'Warm, compassionate patient reception on Priyadarshini Degree College Road, Nehru Nagar, Khammam.', 7),
  (8, 'Celebrating Parenthood: Healthy Newborn Deliveries', 'Happy Families', 'image', '/images/gallery/gallery-healthy-newborns.webp', NULL, '/images/gallery/gallery-healthy-newborns.webp', 'Over 15,000 families blessed with healthy babies through dedicated reproductive care and high-risk obstetric support.', 8);

-- --------------------------------------------------------
-- Table structure for table `insurance_providers`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `insurance_providers`;
CREATE TABLE `insurance_providers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `type` varchar(100) NOT NULL,
  `cashless_available` tinyint(1) DEFAULT '1',
  `claim_assistance_info` text,
  `logo_url` varchar(500) DEFAULT NULL,
  `display_order` int DEFAULT '0',
  `status` enum('active','inactive') DEFAULT 'active',
  PRIMARY KEY (`id`)
);

-- Dumping data for table `insurance_providers` (24 rows)

INSERT INTO `insurance_providers` (`id`, `name`, `type`, `cashless_available`, `claim_assistance_info`, `logo_url`, `display_order`, `status`) VALUES
  (11, 'Aditya Birla Health Insurance', 'Health & General Insurer', 1, 'Cashless Pre-Auth & Direct TPA Desk Available', '/images/insurance/aditya-birla-health.webp', 1, 'active'),
  (12, 'SBI General Insurance', 'Health & General Insurer', 1, 'Suraksha Aur Bharosa Dono', '/images/insurance/sbi-general-insurance.webp', 2, 'active'),
  (13, 'ICICI Lombard', 'Health & General Insurer', 1, 'Nibhaye Vaade', '/images/insurance/icici-lombard.webp', 3, 'active'),
  (14, 'Acko General Insurance', 'Health & General Insurer', 1, 'Cashless Pre-Auth & Direct TPA Desk Available', '/images/insurance/acko-general-insurance.webp', 4, 'active'),
  (15, 'Bajaj Allianz', 'Health & General Insurer', 1, 'General Insurance', '/images/insurance/bajaj-allianz.webp', 5, 'active'),
  (16, 'Star Health and Allied Insurance', 'Health & General Insurer', 1, 'The Health Insurance Specialist', '/images/insurance/star-health.webp', 6, 'active'),
  (17, 'Reliance General Insurance', 'Health & General Insurer', 1, 'Anil Dhirubhai Ambani Group', '/images/insurance/reliance-general-insurance.webp', 7, 'active'),
  (18, 'Max Bupa Health Insurance', 'Health & General Insurer', 1, 'Niva Bupa Health Insurance', '/images/insurance/max-bupa-niva.webp', 8, 'active'),
  (19, 'IFFCO-TOKIO General Insurance', 'Health & General Insurer', 1, 'Muskurate Raho', '/images/insurance/iffco-tokio.webp', 9, 'active'),
  (20, 'Safeway Insurance TPA Pvt. Ltd.', 'Third Party Administrator (TPA)', 1, 'TPA Support', '/images/insurance/safeway-tpa.webp', 10, 'active'),
  (21, 'Care Health Insurance', 'Health & General Insurer', 1, 'Health Hamesha', '/images/insurance/care-health.webp', 11, 'active'),
  (22, 'Tata AIG General Insurance', 'Health & General Insurer', 1, 'With You Always', '/images/insurance/tata-aig.webp', 12, 'active'),
  (23, 'Ericson Insurance TPA Pvt. Ltd.', 'Third Party Administrator (TPA)', 1, 'Third Party Administrator', '/images/insurance/ericson-tpa.webp', 13, 'active'),
  (24, 'Liberty General Insurance', 'Health & General Insurer', 1, 'Liberty Mutual Insurance', '/images/insurance/liberty-general.webp', 14, 'active'),
  (25, 'Religare Health Insurance', 'Health & General Insurer', 1, 'Care Health Insurance / Adv Health Hamesha', '/images/insurance/religare-health.webp', 15, 'active'),
  (26, 'Future Generali Total Insurance', 'Health & General Insurer', 1, 'Total Insurance Solutions', '/images/insurance/future-generali.webp', 16, 'active'),
  (27, 'Genins India Insurance TPA LTD', 'Third Party Administrator (TPA)', 1, 'National TPA Network', '/images/insurance/genins-tpa.webp', 17, 'active'),
  (28, 'Navi Insurance', 'Health & General Insurer', 1, 'Digital Health Cover', '/images/insurance/navi-insurance.webp', 18, 'active'),
  (29, 'Paramount Health Care', 'Health & General Insurer', 1, 'Paramount TPA Services', '/images/insurance/paramount-tpa.webp', 19, 'active'),
  (30, 'MD India Health Insurance TPA', 'Third Party Administrator (TPA)', 1, 'Healthcare TPA Pioneer', '/images/insurance/md-india-tpa.webp', 20, 'active'),
  (31, 'Vidal Health', 'Health & General Insurer', 1, 'Third Party Administrator', '/images/insurance/vidal-health-tpa.webp', 21, 'active'),
  (32, 'Heritage Health (KH)', 'Health & General Insurer', 1, 'Heritage Health TPA', '/images/insurance/heritage-health-tpa.webp', 22, 'active'),
  (33, 'ManipalCigna Health Insurance', 'Health & General Insurer', 1, 'Health Ka Saath', '/images/insurance/manipal-cigna.webp', 23, 'active'),
  (34, 'Apollo Munich Health Insurance', 'Health & General Insurer', 1, 'Let\'s Uncomplicate', '/images/insurance/apollo-munich.webp', 24, 'active');

-- --------------------------------------------------------
-- Table structure for table `media_assets`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `media_assets`;
CREATE TABLE `media_assets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `filename` varchar(255) NOT NULL,
  `original_name` varchar(255) NOT NULL,
  `url` varchar(500) NOT NULL,
  `file_size` int NOT NULL DEFAULT '0',
  `mime_type` varchar(100) NOT NULL DEFAULT 'image/webp',
  `media_type` enum('image','video') NOT NULL DEFAULT 'image',
  `width` int DEFAULT NULL,
  `height` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

-- Dumping data for table `media_assets` (44 rows)

INSERT INTO `media_assets` (`id`, `filename`, `original_name`, `url`, `file_size`, `mime_type`, `media_type`, `width`, `height`, `created_at`) VALUES
  (1, 'fertility-reproductive-medicine.webp', 'Embryology Lab Cleanroom', '/images/departments/fertility-reproductive-medicine.webp', 135752, 'image/webp', 'image', 1200, 800, '2026-10-01T17:09:12.000Z'),
  (2, 'obstetrics-gynecology.webp', 'Maternal Obstetric Care', '/images/departments/obstetrics-gynecology.webp', 78988, 'image/webp', 'image', 1200, 800, '2026-10-01T17:09:12.000Z'),
  (3, 'pediatrics-neonatology.webp', 'Pediatric Neonatal Ward', '/images/departments/pediatrics-neonatology.webp', 66342, 'image/webp', 'image', 1200, 800, '2026-10-01T17:09:12.000Z'),
  (4, 'fetal-medicine-diagnostics.webp', 'Fetal Ultrasound Diagnostics', '/images/departments/fetal-medicine-diagnostics.webp', 125920, 'image/webp', 'image', 1200, 800, '2026-10-01T17:09:12.000Z'),
  (5, 'fertility-reproductive-medicine.webp', 'Embryology Lab Cleanroom', '/images/departments/fertility-reproductive-medicine.webp', 135752, 'image/webp', 'image', 1200, 800, '2026-10-01T17:09:12.000Z'),
  (6, 'laboratory-research.webp', 'Diagnostic Research Lab', '/images/laboratory-research.webp', 109830, 'image/webp', 'image', 1200, 800, '2026-10-01T17:09:12.000Z'),
  (7, 'obstetrics-gynecology.webp', 'Maternal Obstetric Care', '/images/departments/obstetrics-gynecology.webp', 78988, 'image/webp', 'image', 1200, 800, '2026-10-01T17:09:12.000Z'),
  (8, 'pediatrics-neonatology.webp', 'Pediatric Neonatal Ward', '/images/departments/pediatrics-neonatology.webp', 66342, 'image/webp', 'image', 1200, 800, '2026-10-01T17:09:12.000Z'),
  (9, 'obstetrics-gynecology.webp', 'Maternal Obstetric Care', '/images/departments/obstetrics-gynecology.webp', 78988, 'image/webp', 'image', 1200, 800, '2026-10-01T17:09:12.000Z'),
  (10, 'fetal-medicine-diagnostics.webp', 'Fetal Ultrasound Diagnostics', '/images/departments/fetal-medicine-diagnostics.webp', 125920, 'image/webp', 'image', 1200, 800, '2026-10-01T17:09:12.000Z'),
  (11, 'doctor-consultation-male.webp', 'Consultant Doctor Profile Male', '/images/doctor-consultation-male.webp', 54556, 'image/webp', 'image', 800, 800, '2026-10-01T17:09:12.000Z'),
  (13, 'doctor-consultation-female.webp', 'Consultant Doctor Profile Female', '/images/doctor-consultation-female.webp', 44936, 'image/webp', 'image', 800, 800, '2026-10-01T17:09:12.000Z'),
  (14, 'doctor-pediatrician.webp', 'Senior Pediatrician', '/images/doctor-pediatrician.webp', 77054, 'image/webp', 'image', 800, 800, '2026-10-01T17:09:12.000Z'),
  (15, 'fertility-reproductive-medicine.webp', 'Embryology Lab Cleanroom', '/images/departments/fertility-reproductive-medicine.webp', 135752, 'image/webp', 'image', 1200, 800, '2026-10-01T17:09:13.000Z'),
  (16, 'pediatrics-neonatology.webp', 'Pediatric Neonatal Ward', '/images/departments/pediatrics-neonatology.webp', 66342, 'image/webp', 'image', 1200, 800, '2026-10-01T17:09:13.000Z'),
  (17, 'fetal-medicine-diagnostics.webp', 'Fetal Ultrasound Diagnostics', '/images/departments/fetal-medicine-diagnostics.webp', 125920, 'image/webp', 'image', 1200, 800, '2026-10-01T17:09:13.000Z'),
  (18, 'obstetrics-gynecology.webp', 'Maternal Obstetric Care', '/images/departments/obstetrics-gynecology.webp', 78988, 'image/webp', 'image', 1200, 800, '2026-10-01T17:09:13.000Z'),
  (19, 'fertility-reproductive-medicine.webp', 'Embryology Lab Cleanroom', '/images/departments/fertility-reproductive-medicine.webp', 135752, 'image/webp', 'image', 1200, 800, '2026-10-01T17:09:13.000Z'),
  (20, 'pediatrics-neonatology.webp', 'Pediatric Neonatal Ward', '/images/departments/pediatrics-neonatology.webp', 66342, 'image/webp', 'image', 1200, 800, '2026-10-01T17:09:13.000Z'),
  (21, 'diagnostic-microscope.webp', 'High Precision Microscope', '/images/diagnostic-microscope.webp', 134116, 'image/webp', 'image', 1200, 800, '2026-10-01T17:09:13.000Z'),
  (22, 'gallery-fetal-medicine.webp', '4D Prenatal Imaging Room', '/images/gallery/gallery-fetal-medicine.webp', 78988, 'image/webp', 'image', 1200, 800, '2026-10-01T17:09:13.000Z'),
  (23, 'gallery-level-3-nicu.webp', 'Level III NICU Giraffe Incubator', '/images/gallery/gallery-level-3-nicu.webp', 82822, 'image/webp', 'image', 1200, 800, '2026-10-01T17:09:13.000Z'),
  (25, 'gallery-level-3-nicu.webp', 'Level III NICU Giraffe Incubator', '/images/gallery/gallery-level-3-nicu.webp', 82822, 'image/webp', 'image', 1200, 800, '2026-10-01T17:09:13.000Z'),
  (26, 'gallery-operation-theatre.webp', 'Modular OT Laminar Flow Suite', '/images/gallery/gallery-operation-theatre.webp', 41748, 'image/webp', 'image', 1200, 800, '2026-10-01T17:09:13.000Z'),
  (27, 'gallery-fetal-medicine.webp', '4D Prenatal Imaging Room', '/images/gallery/gallery-fetal-medicine.webp', 78988, 'image/webp', 'image', 1200, 800, '2026-10-01T17:09:13.000Z'),
  (28, 'gallery-recovery-suite.webp', 'Deluxe Patient Recovery Room', '/images/gallery/gallery-recovery-suite.webp', 75314, 'image/webp', 'image', 1200, 800, '2026-10-01T17:09:13.000Z'),
  (29, 'gallery-pediatric-consultation.webp', 'Pediatric Examination Lounge', '/images/gallery/gallery-pediatric-consultation.webp', 81130, 'image/webp', 'image', 1200, 800, '2026-10-01T17:09:14.000Z'),
  (30, 'gallery-reception-lounge.webp', 'Hospital Main Entrance Reception', '/images/gallery/gallery-reception-lounge.webp', 91468, 'image/webp', 'image', 1200, 800, '2026-10-01T17:09:14.000Z'),
  (31, 'gallery-embryology-lab.webp', 'ICSI Embryology Cleanroom', '/images/gallery/gallery-embryology-lab.webp', 35570, 'image/webp', 'image', 1200, 800, '2026-10-01T17:09:14.000Z'),
  (39, 'asset-1791049250066-295820097.webp', 'Untitled image (2).jpeg', '/uploads/asset-1791049250066-295820097.webp', 64736, 'image/webp', 'image', 2400, 1340, '2026-10-03T12:10:51.000Z'),
  (45, 'hospital-exterior.webp', 'Adobe Express - file.png', '/images/hospital-exterior.webp', 93686, 'image/webp', 'image', 1672, 941, '2026-10-05T00:08:38.000Z'),
  (47, 'hospital-exterior.webp', 'Hospital Exterior Front Building', '/images/hospital-exterior.webp', 150000, 'image/webp', 'image', 2000, 1500, '2026-10-05T01:38:54.000Z'),
  (48, 'hospital-exterior-banner.webp', 'Hospital Exterior Banner 16:9', '/images/hospital-exterior-banner.webp', 150000, 'image/webp', 'image', 1920, 1080, '2026-10-05T01:38:55.000Z'),
  (49, 'incubator-nicu.webp', 'NICU Incubator Room with Nurses & Preterms', '/images/incubator-nicu.webp', 150000, 'image/webp', 'image', 1599, 1200, '2026-10-05T01:38:55.000Z'),
  (50, 'reception-newborn.webp', 'Newborn Mom & Staff at Reception', '/images/reception-newborn.webp', 150000, 'image/webp', 'image', 2000, 900, '2026-10-05T01:38:55.000Z'),
  (51, 'operation-theatre.webp', 'Modular Operation Theatre with Surgical Equipments', '/images/operation-theatre.webp', 150000, 'image/webp', 'image', 1152, 648, '2026-10-05T01:38:55.000Z'),
  (52, 'blog-you-trust-we-care.webp', 'Blog: You Trust We Care Poster', '/images/blogs/blog-you-trust-we-care.webp', 150000, 'image/webp', 'image', 705, 853, '2026-10-05T01:38:55.000Z'),
  (53, 'blog-let-wonderful-things-happen.webp', 'Blog: Let Wonderful Things Happen Poster', '/images/blogs/blog-let-wonderful-things-happen.webp', 150000, 'image/webp', 'image', 705, 853, '2026-10-05T01:38:56.000Z'),
  (54, 'blog-baby-first-cry.webp', 'Blog: Babys First Cry Poster', '/images/blogs/blog-baby-first-cry.webp', 150000, 'image/webp', 'image', 705, 853, '2026-10-05T01:38:56.000Z'),
  (55, 'blog-childbirth-special-memorable.webp', 'Blog: Childbirth Special & Memorable Poster', '/images/blogs/blog-childbirth-special-memorable.webp', 150000, 'image/webp', 'image', 705, 845, '2026-10-05T01:38:56.000Z'),
  (56, 'blog-follow-baby-cues.webp', 'Blog: Follow Your Babys Cues Poster', '/images/blogs/blog-follow-baby-cues.webp', 150000, 'image/webp', 'image', 705, 864, '2026-10-05T01:38:57.000Z'),
  (57, 'blog-fertility-all-ages.webp', 'Blog: Fertility All Ages Poster', '/images/blogs/blog-fertility-all-ages.webp', 150000, 'image/webp', 'image', 705, 864, '2026-10-05T01:38:57.000Z'),
  (58, 'blog-embrace-health-happiness.webp', 'Blog: Embrace Good Health & Happiness Poster', '/images/blogs/blog-embrace-health-happiness.webp', 150000, 'image/webp', 'image', 1079, 1186, '2026-10-05T01:38:58.000Z'),
  (59, 'blog-beat-male-infertility.webp', 'Blog: Beat Male Infertility Poster', '/images/blogs/blog-beat-male-infertility.webp', 150000, 'image/webp', 'image', 705, 869, '2026-10-05T01:38:58.000Z');

-- --------------------------------------------------------
-- Table structure for table `settings`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `settings`;
CREATE TABLE `settings` (
  `setting_key` varchar(100) NOT NULL,
  `setting_value` json NOT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`setting_key`)
);

-- Dumping data for table `settings` (2 rows)

INSERT INTO `settings` (`setting_key`, `setting_value`, `updated_at`) VALUES
  ('contact_buttons', '{"phone_button":{"label":"Call Hospital","order":1,"number":"+919666781779","enabled":true,"position":"bottom-left","tel_link":"tel:+919666781779"},"whatsapp_button":{"label":"WhatsApp Us","order":2,"number":"+919666781779","enabled":true,"position":"bottom-left","wa_target":"https://wa.me/919666781779","default_message":"Hello Sreemantha Hospital, I would like to inquire about consultation."}}', '2026-09-28T15:33:32.000Z'),
  ('hospital_info', '{"email":"care@sreemanthahospital.com","phone":"+91 96667 81779","stats":[{"label":"Happy Families","value":"15,000+"},{"label":"IVF Success Rate","value":"78%"},{"label":"Level III NICU","value":"24/7"},{"label":"Expert Specialists","value":"25+"}],"address":"Priyadarshini Degree/College Road, Nehru Nagar, Khammam, Telangana 507001","tagline":"Bringing the Joy of Parenthood to Your Life","location":"Khammam, Telangana","subtitle":"World-class IVF technology, compassionate maternity care, and expert pediatric services in Khammam.","whatsapp":"+91 96667 81779","hospital_name":"Sreemantha IVF and Child Care Hospital","working_hours":{"opd":"Monday - Saturday: 9:00 AM to 8:00 PM | Sunday: 9:00 AM to 1:00 PM","emergency":"24/7 Casualty, NICU and Maternity Support"},"display_hotline":"+91-8800-SREEMANTHA","emergency_hotline":"+91 88007 73362"}', '2026-09-28T15:33:32.000Z');

-- --------------------------------------------------------
-- Table structure for table `specialties`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `specialties`;
CREATE TABLE `specialties` (
  `id` int NOT NULL AUTO_INCREMENT,
  `slug` varchar(120) NOT NULL,
  `title` varchar(255) NOT NULL,
  `category` varchar(100) DEFAULT 'Fertility & Reproductive',
  `short_description` text NOT NULL,
  `overview` longtext,
  `icon` varchar(100) DEFAULT NULL,
  `image_url` text,
  `conditions` json DEFAULT NULL,
  `display_order` int DEFAULT '0',
  `status` enum('draft','published') DEFAULT 'published',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
);

-- Dumping data for table `specialties` (4 rows)

INSERT INTO `specialties` (`id`, `slug`, `title`, `category`, `short_description`, `overview`, `icon`, `image_url`, `conditions`, `display_order`, `status`, `created_at`) VALUES
  (13, 'obstetrics-high-risk-pregnancy', 'Obstetrics & High-Risk Pregnancy Care', 'Maternity & Fetal Care', 'Comprehensive prenatal care, painless labor management, and 24/7 tertiary maternal-fetal critical care in Khammam.', 'Sreemantha Hospital\'s Obstetrics department is led by Dr. G. Sindhu (MS OBGYN, Osmania Medical College). Our dedicated labor suites and modular operating theatres are equipped for complex maternal emergencies, twins/multiple gestations, gestational diabetes, pre-eclampsia, and prior cesarean deliveries.', 'HeartPulse', '/images/reception-newborn.webp', '["High-Risk Pregnancy","Gestational Diabetes (GDM)","Pre-eclampsia & Hypertension","Multiple Pregnancies (Twins/Triplets)","Recurrent Pregnancy Loss","Placenta Previa & Accreta"]', 1, 'published', '2026-10-05T01:38:52.000Z'),
  (14, 'gynecology-laparoscopic-surgery', 'Gynecology & Advanced 3D/4K Laparoscopic Surgery', 'Women\'s Health', 'Minimally invasive keyhole surgeries, fibroid removals, endometriosis excision, and complete female wellness.', 'Advanced gynecological surgical care featuring ultra-high-definition 4K laparoscopy and hysteroscopy. Patient benefits include minimal incision scars, negligible blood loss, rapid post-op recovery, and same-day or next-day discharge.', 'Activity', '/images/operation-theatre.webp', '["Uterine Fibroids (Myomectomy)","Ovarian Cysts & Dermoids","Endometriosis & Adenomyosis","Uterine Polyps & Abnormal Bleeding","Pelvic Organ Prolapse","PCOS & Hormonal Imbalances"]', 2, 'published', '2026-10-05T01:38:52.000Z'),
  (15, 'fertility-reproductive-medicine-ivf', 'Fertility & Reproductive Medicine (IVF / ICSI)', 'Fertility & Andrology', 'Class 10,000 modular embryology cleanroom, Day-5 blastocyst culture, ICSI, and individualized fertility protocols.', 'Comprehensive fertility solutions helping couples fulfill their parenthood dreams. We combine rigorous genetic assessment, optimized ovulation stimulation, advanced sperm preparation, and meticulous embryo culture.', 'Sparkles', '/images/blogs/blog-let-wonderful-things-happen.webp', '["Unexplained Infertility","Low Ovarian Reserve (Low AMH)","Blocked Fallopian Tubes","Severe Male Infertility (Azoospermia/Oligospermia)","Polycystic Ovary Syndrome (PCOS)","Recurrent IVF Implantation Failure"]', 3, 'published', '2026-10-05T01:38:52.000Z'),
  (16, 'pediatrics-level-3-nicu', 'Pediatrics & Level-III Neonatal Intensive Care (NICU)', 'Neonatal & Child Health', '24/7 Level-III NICU with multi-zone incubators, servo-controlled warmers, high-frequency ventilators, and expert neonatologists.', 'Led by Dr. B. V. N. Krishna (MD Pediatrics, VMMC & Safdarjung Hospital Delhi, Fellow in Neonatology), our Level-III NICU provides life-saving tertiary care for preterm infants born as early as 26 weeks, low birth weight babies, and critical neonates.', 'Baby', '/images/incubator-nicu.webp', '["Extreme Preterm Birth (under 28-32 weeks)","Extremely Low Birth Weight (<1000g)","Respiratory Distress Syndrome (RDS)","Neonatal Jaundice & Phototherapy","Neonatal Sepsis & Critical Care","Pediatric Growth & Developmental Delays"]', 4, 'published', '2026-10-05T01:38:52.000Z');

-- --------------------------------------------------------
-- Table structure for table `testimonials`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `testimonials`;
CREATE TABLE `testimonials` (
  `id` int NOT NULL AUTO_INCREMENT,
  `patient_name` varchar(255) NOT NULL,
  `location` varchar(100) NOT NULL,
  `treatment_category` varchar(100) NOT NULL,
  `rating` int DEFAULT '5',
  `story` longtext NOT NULL,
  `consent_verified` tinyint(1) DEFAULT '1',
  `status` enum('published','draft') DEFAULT 'published',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

-- Dumping data for table `testimonials` (3 rows)

INSERT INTO `testimonials` (`id`, `patient_name`, `location`, `treatment_category`, `rating`, `story`, `consent_verified`, `status`, `created_at`) VALUES
  (1, 'Anusha & Venkat Rao', 'Khammam Town', 'IVF Treatment', 5, 'After 7 years of heartbreaking negative tests across Hyderabad hospitals, we met Dr. Sreemantha Rao. His calm reassurance and the advanced lab in Khammam blessed us with twin baby boys on our very first IVF cycle.', 1, 'published', '2026-09-28T15:33:34.000Z'),
  (2, 'Pooja & Rajesh Kumar', 'Kothagudem', 'Level III NICU Care', 5, 'Our daughter was born at just 29 weeks weighing 1.1 kilograms. Dr. Vamsi Krishna and the NICU nursing staff cared for her like their own child for 42 days. Today she is a healthy, cheerful 1-year-old baby girl.', 1, 'published', '2026-09-28T15:33:34.000Z'),
  (3, 'Sravanthi & Mohan', 'Suryapet', 'Painless Delivery', 5, 'Dr. Shravani made my entire maternity journey wonderful. The epidural painless delivery was completely peaceful, and the postnatal nursing team supported us with breastfeeding from the very first hour.', 1, 'published', '2026-09-28T15:33:34.000Z');

-- --------------------------------------------------------
-- Table structure for table `treatments`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `treatments`;
CREATE TABLE `treatments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `slug` varchar(120) NOT NULL,
  `title` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `specialty_slug` varchar(120) DEFAULT NULL,
  `short_description` text NOT NULL,
  `overview` longtext,
  `how_it_works` json DEFAULT NULL,
  `who_requires` json DEFAULT NULL,
  `preparation` text,
  `aftercare` text,
  `typical_duration` varchar(255) DEFAULT NULL,
  `success_rate` varchar(255) DEFAULT NULL,
  `image_url` text,
  `featured` tinyint(1) DEFAULT '0',
  `status` enum('draft','published') DEFAULT 'published',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
);

-- Dumping data for table `treatments` (6 rows)

INSERT INTO `treatments` (`id`, `slug`, `title`, `category`, `specialty_slug`, `short_description`, `overview`, `how_it_works`, `who_requires`, `preparation`, `aftercare`, `typical_duration`, `success_rate`, `image_url`, `featured`, `status`, `created_at`) VALUES
  (19, 'ivf-in-vitro-fertilization-blastocyst', 'IVF (In Vitro Fertilization) & Blastocyst Culture', 'Fertility Care', 'fertility-reproductive-medicine-ivf', 'State-of-the-art fertilization in our Class 10,000 embryology cleanroom with Day-5 blastocyst transfer.', 'In Vitro Fertilization (IVF) is the gold-standard assisted reproductive technology where eggs and sperm are fertilized in our advanced embryology lab. Embryos are cultured until the blastocyst stage (Day 5) to maximize implantation success.', '<ol><li><strong>Initial Clinical Assessment:</strong> Comprehensive hormonal & ultrasound evaluation</li><li><strong>Ovarian Stimulation:</strong> Monitored protocol tailored to ovarian reserve</li><li><strong>Egg Retrieval:</strong> Ultrasound-guided painless procedure</li><li><strong>Embryo Transfer:</strong> Single blastocyst ultrasound guided transfer</li></ol>', '["Couples with bilateral blocked or damaged fallopian tubes","Women with diminished ovarian reserve or advanced maternal age","Couples who have experienced failed IUI cycles","Severe endometriosis affecting egg quality or tubal motility"]', 'Comprehensive hormonal testing (AMH, FSH, LH), baseline pelvic ultrasound, and partner semen analysis.', 'Progesterone luteal support, avoidance of strenuous lifting for 48 hours, and pregnancy blood test after 14 days.', '2 to 3 weeks per cycle', 'High cumulative pregnancy rate', '/images/blogs/blog-let-wonderful-things-happen.webp', 1, 'published', '2026-10-05T01:38:53.000Z'),
  (20, 'painless-normal-delivery-maternity', 'Painless Normal Delivery (Labor Epidural Analgesia)', 'Maternity Care', 'obstetrics-high-risk-pregnancy', '24/7 labor epidural analgesia enabling smooth, comfortable normal vaginal delivery with continuous fetal monitoring.', 'Painless delivery utilizes continuous labor epidural analgesia administered by experienced consultant anesthesiologists. It significantly reduces labor pain while allowing the mother to remain alert and fully in control during pushing.', '["1. Active Labor Assessment: Epidural is administered once labor is well established at 3-4 cm dilation.","2. Fine Epidural Catheter Placement: Micro-dosed local anesthetic is delivered into the epidural space.","3. Pain Relief within 10-15 Minutes: Contractions continue normally without agonizing labor pain.","4. Monitored Normal Birth: Continuous CTG fetal heartbeat tracking ensures optimal baby oxygenation."]', '["Expectant mothers desiring a comfortable normal vaginal delivery","Mothers with low pain tolerance seeking to avoid elective surgical cesareans","Patients with mild pregnancy-induced hypertension where stress reduction is beneficial"]', 'Pre-anesthesia checkup during the third trimester, normal coagulation profile, and informed consent.', 'Immediate postpartum skin-to-skin bonding, initial breastfeeding within 30 minutes, and rapid mobilization within 4 hours.', '6 to 12 hours labor duration', '95%+ pain alleviation', '/images/reception-newborn-card.webp', 1, 'published', '2026-10-05T01:38:53.000Z'),
  (21, 'level-3-nicu-preterm-care', 'Level-III Neonatal Intensive Care (NICU)', 'Neonatal Critical Care', 'pediatrics-level-3-nicu', 'Tertiary care for preterm infants, respiratory distress, low birth weight, and surgical neonates led by Dr. B. V. N. Krishna.', 'Our Level-III NICU is the most advanced neonatal critical care facility in Khammam. Equipped with servo-controlled multi-zone incubators, LED phototherapy, continuous invasive and non-invasive cardiopulmonary monitoring, and neonatal resuscitation units.', '["1. Rapid Resuscitation & Golden Hour Care: Immediate specialized stabilization at delivery.","2. Advanced Respiratory Support: Gentle CPAP, High-Frequency Ventilation, and Surfactant therapy.","3. Total Parenteral Nutrition (TPN): Precise intravenous nutrition for premature gastrointestinal systems.","4. Developmental Supportive Care: Noise/light control and Kangaroo Mother Care (KMC)."]', '["Premature infants born before 37 weeks (down to 26 weeks)","Low birth weight babies weighing under 1500g or 1000g","Newborns with respiratory distress, meconium aspiration, or neonatal jaundice","Infants needing urgent neonatal medical stabilization"]', 'Antenatal maternal corticosteroid administration when preterm delivery is anticipated.', 'Lactation counseling for expressed breast milk, transition to Kangaroo Mother Care, and follow-up developmental pediatric clinic.', 'Personalized neonatal stay', '98%+ tertiary survival rate', '/images/incubator-nicu.webp', 1, 'published', '2026-10-05T01:38:53.000Z'),
  (22, 'icsi-intracytoplasmic-sperm-injection', 'ICSI (Intracytoplasmic Sperm Injection) & Male Fertility', 'Fertility Care', 'fertility-reproductive-medicine-ivf', 'Micro-surgical injection of a single selected sperm directly into an egg for severe male factor infertility.', 'Intracytoplasmic Sperm Injection (ICSI) revolutionizes male infertility treatment. Using Narishige high-magnification micromanipulators, our embryologist selects the single most morphologically sound sperm and injects it directly into the egg cytoplasm.', '["1. Advanced Semen Processing: Isolating progressive, healthy sperm.","2. Oocyte Denudation: Preparing mature eggs for micro-injection.","3. Micro-Injection: Precision insertion under 400x magnification inverted microscope.","4. Blastocyst Incubation: Culturing fertilized zygotes under strict environmental controls."]', '["Men with very low sperm count (severe oligospermia)","Men with poor sperm motility (asthenospermia) or abnormal shape (teratospermia)","Surgical sperm retrieval cases (TESA / PESA for azoospermia)","Previous poor or failed fertilization with conventional IVF"]', 'Detailed semen analysis, DNA fragmentation index, and partner ovum pick-up coordination.', 'Embryo freezing or blastocyst transfer protocol as recommended by the clinical team.', 'Same day laboratory procedure', '80%+ fertilization rate', '/images/blogs/blog-beat-male-infertility.webp', 0, 'published', '2026-10-05T01:38:53.000Z'),
  (23, 'iui-intrauterine-insemination', 'IUI (Intrauterine Insemination)', 'Fertility Care', 'fertility-reproductive-medicine-ivf', 'Minimally invasive first-line fertility treatment placing concentrated, highly motile sperm directly into the uterus.', 'Intrauterine Insemination (IUI) is a gentle, first-line fertility procedure where processed, active sperm is placed directly inside the uterine cavity near the time of ovulation.', '["1. Ovulation Induction & Follicular Tracking: Mild stimulation and transvaginal ultrasound scans.","2. Trigger Injection: HCG/GnRH trigger administered when follicle reaches optimal 18-20mm maturity.","3. Sperm Wash & Capacitation: Processing the sample to concentrate the fastest moving sperm.","4. Gentle Insemination: Painless 5-minute procedure placing sperm into the uterus with a soft catheter."]', '["Couples with unexplained infertility of 1-3 years duration","Mild male factor motility issues","Cervical mucus hostility or hostility factors","Ovulatory dysfunction treated with mild stimulation"]', 'Confirmed tubal patency via HSG / laparoscopy and healthy semen parameters.', 'Rest for 15-20 minutes following the procedure; normal daily activities resumed immediately.', '5-10 minutes OPD procedure', '15% - 20% per cycle', '/images/blogs/blog-fertility-all-ages.webp', 0, 'published', '2026-10-05T01:38:53.000Z'),
  (24, 'laparoscopic-gynecological-surgery', 'Advanced 3D/4K Gynecological Laparoscopy', 'Women\'s Health', 'gynecology-laparoscopic-surgery', 'Minimally invasive keyhole surgery for fibroids, ovarian cysts, and endometriosis with rapid recovery.', 'Our surgical suite features ultra-modern Karl Storz 4K laparoscopic imaging. Surgeries are performed through tiny 5mm-10mm keyhole incisions, eliminating large abdominal scars and dramatically reducing recovery time.', '["1. High-Definition Visualization: 4K optical magnification identifies minute pathology.","2. Precision Tissue Dissection: Ultrasonic and bipolar energy instruments minimize bleeding.","3. Pathology Excision: Fibroids (myomectomy), ovarian cysts, or endometriosis cleared cleanly.","4. Aesthetic Closure: Dissolvable sub-cuticular sutures leave almost unnoticeable marks."]', '["Women with symptomatic uterine fibroids causing heavy bleeding or pain","Patients with large ovarian cysts or dermoid cysts","Severe endometriosis causing pelvic pain or infertility","Ectopic pregnancy or fertility enhancing tubal evaluation"]', 'Routine pre-operative blood profile, fasting for 6 hours prior to surgery.', 'Ambulation on the same evening, oral fluids within 6 hours, discharge within 24 to 48 hours.', '45 to 90 minutes operative time', '99%+ complication-free', '/images/operation-theatre.webp', 1, 'published', '2026-10-05T01:38:53.000Z');

-- --------------------------------------------------------
-- Table structure for table `users`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `stored_password` varchar(255) DEFAULT NULL,
  `role` varchar(50) DEFAULT 'Administrator',
  `full_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
);

-- Dumping data for table `users` (3 rows)

INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `stored_password`, `role`, `full_name`, `created_at`) VALUES
  (1, 'admin', 'admin@sreemantha.hospital', '$argon2id$v=19$m=65536,p=1,t=3$nHevHErxpIPq1L5e56DvHQ$UX9ILhgwZj6KfUj7nPmQetO9efmZemkik0ftfA44wG0', 'Admin@2026', 'admin', 'Hospital Administrator', '2026-09-28T15:33:32.000Z'),
  (2, 'superadmin', 'superadmin@sreemantha.hospital', '$argon2id$v=19$m=65536,p=1,t=3$/LlnHefmt6d+KoefbqKZUw$fBfBKAsMNBT/fqtZgkVSknIITlsFBw15ETufRn82jJA', 'SuperAdmin@2026', 'superadmin', 'Chief Medical Director (Super Admin)', '2026-09-28T17:54:00.000Z'),
  (3, 'staff', 'staff@sreemantha.hospital', '$argon2id$v=19$m=65536,p=1,t=3$i0l/GAI9Gmn42Ge/w1UM+Q$jeBHPslnOMAEWDZOMlqipjYMbYJHUh5oDVb5wO5f9qc', 'Staff@2026', 'staff', 'Clinical Operations Staff', '2026-09-28T17:54:00.000Z');

SET FOREIGN_KEY_CHECKS = 1;
-- ========================================================
-- End of Database Export
-- ========================================================
