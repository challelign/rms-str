-- phpMyAdmin SQL Dump
-- version 3.5.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: May 09, 2023 at 10:52 AM
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
-- Table structure for table `fcy_customer_transaction`
--

CREATE TABLE IF NOT EXISTS `fcy_customer_transaction` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `paying_branch_code` varchar(20) NOT NULL,
  `branch_name` varchar(50) NOT NULL,
  `fcy_customer_id` int(11) NOT NULL,
  `mon_transf_type` varchar(100) NOT NULL,
  `ref_num` varchar(100) NOT NULL,
  `paid_date` varchar(100) NOT NULL,
  `sender_name` varchar(100) NOT NULL,
  `sender_country` varchar(100) NOT NULL,
  `sender_city` varchar(100) NOT NULL,
  `fcy` varchar(100) NOT NULL,
  `amount_in_fcy` varchar(100) NOT NULL,
  `amount_in_etb` varchar(100) NOT NULL,
  `remark` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 AUTO_INCREMENT=12 ;

--
-- Dumping data for table `fcy_customer_transaction`
--

INSERT INTO `fcy_customer_transaction` (`id`, `user_id`, `paying_branch_code`, `branch_name`, `fcy_customer_id`, `mon_transf_type`, `ref_num`, `paid_date`, `sender_name`, `sender_country`, `sender_city`, `fcy`, `amount_in_fcy`, `amount_in_etb`, `remark`) VALUES
(1, 3109, '102', 'H/Office Information Technology Department', 0, 'swift', 'weew', 'weew', 'weeww', 'wew', 'we', 'swift', 'we', 'we', 'we'),
(2, 3109, '102', 'H/Office Information Technology Department', 0, 'swift', 'ss', 'ss', 'ss', 'ss', 'ss', 'hh', '122', '12', 'asa'),
(3, 3109, '102', 'H/Office Information Technology Department', 3, 'hh', 'asa', 'asas', 'asas', 'asdasd', 'asdasd', 'hh', '123', '12', 'vvv'),
(6, 640, '110', 'Haya hulet mazoria Branch', 14, '', '', '', '', '', '', '', '', '', '0912500576'),
(7, 3109, '102', 'H/Office Information Technology Department', 16, 'Express Money', '1212', '2021-11-03', 'seifedin', 'ET', 'AA', 'U.S. Dollar (USD)', '2121', '2121', 'no remark'),
(8, 105, '102', 'H/Office Information Technology Department', 20, 'Western Union,', '65465', '2022-01-10', 'ieor', 'eori', 'eori', 'European Euro (EUR)', '33', '33', 'iediwo'),
(9, 898, '259', 'Azezo Branch', 27, 'Western Union,', '5009370837', '2022-08-06', 'IAN ALISTER NIGEL NERO', 'BAHRAIN', 'BAHRAIN', 'U.S. Dollar (USD)', '977.79', '51054.03', '0960132132'),
(10, 898, '259', 'Azezo Branch', 27, 'Western Union,', '2484734759', '2022-08-08', 'PEDRO REYES', 'UNITED STATES', 'USA', 'U.S. Dollar (USD)', '400', '20,889.24', '0960132132'),
(11, 898, '259', 'Azezo Branch', 27, 'Western Union,', '5238532655', '2022-08-27', 'PEDRO REYES', 'UNITED STATES', 'USA', 'U.S. Dollar (USD)', '500', '26,208.55', '0960132132');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
