-- phpMyAdmin SQL Dump
-- version 3.5.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: May 09, 2023 at 10:57 AM
-- Server version: 5.7.26
-- PHP Version: 5.3.13

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `rmr`
--

-- --------------------------------------------------------

--
-- Table structure for table `potential_customers`
--

CREATE TABLE IF NOT EXISTS `str_list` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `branch_code` varchar(30) NOT NULL,
  `customer_name` varchar(100) NOT NULL,
  `branch` varchar(100) NOT NULL, 
  `transaction_id` varchar(500) DEFAULT NULL,
  `reason` varchar(500) CHARACTER SET utf8 DEFAULT NULL,
  `address` varchar(100) NOT NULL, 
  `account_number` varchar(100) NOT NULL, 
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 AUTO_INCREMENT=14132 ;

