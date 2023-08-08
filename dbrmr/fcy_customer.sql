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
-- Table structure for table `fcy_customer`
--

CREATE TABLE IF NOT EXISTS `fcy_customer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `branch_code` varchar(50) NOT NULL,
  `branch` varchar(100) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `account_number` varchar(100) NOT NULL,
  `credit_amount` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 AUTO_INCREMENT=34 ;

--
-- Dumping data for table `fcy_customer`
--

INSERT INTO `fcy_customer` (`id`, `user_id`, `branch_code`, `branch`, `phone`, `full_name`, `account_number`, `credit_amount`, `created_at`) VALUES
(7, 757, '180', 'Tulu Dimtu Branch', '0968832836', 'ASEL TAYE HAILE', '1479116821730018', '', '2021-11-12 09:25:37'),
(8, 2046, '147', '', '0913130112', 'ENGIDA TADESSE', '1471016856955017', '', '2021-11-12 09:26:39'),
(9, 3272, '357', 'Legetafo Branch', '0945115268', 'KONI SEID', '5477417252400015', '', '2021-11-12 09:27:37'),
(10, 757, '180', 'Tulu Dimtu Branch', '0911481913', 'MESERET ADELA MELESE', '1471014610179011', '', '2021-11-12 09:31:52'),
(12, 420, '255', '', '+251910872951', 'Samuel Beide Melaku', '2051011066021012', '53.65 USD', '2021-11-19 05:40:17'),
(13, 420, '255', 'Addiskedam Branch', '0933551534', 'YALEMZERF AWOKE TIRUNEH', '2551011791377012', '560.00 USD', '2021-11-20 05:13:36'),
(15, 1029, '205', 'Debre markos Branch', '0932862463', 'siraj yasin', '2841013461723029', '1549 us $ ', '2021-11-24 12:52:59'),
(17, 1960, '192', 'Ayat Adebabay Branch', '0911111111', 'seife', '1261161616188998', '', '2021-12-01 07:55:28'),
(18, 426, '149', 'Lebu medanialem Branch', '0932083509', 'Workie Mohamed', '1439117239721016', '300 dollars per month', '2021-12-30 07:30:59'),
(19, 309, '232', 'Lakomez Branch', '0905969696', 'Zeleke Belay Engida', '2321017398319028', '343', '2021-12-30 07:53:37'),
(20, 1324, '111', 'Lebu Branch', '0912313029', 'GENEMO GUYE', '3161017365304015', '0', '2022-01-08 12:24:07'),
(21, 4151, '906', 'Wogeri Branch', '0932083509', 'WORKIE MOHAMED', '', '', '2022-01-17 11:58:19'),
(22, 1751, '139', 'Bole millennium Branch', '0911602513', 'MARTA KUMSSA', '', '220 USD', '2022-01-20 06:01:24'),
(23, 426, '149', 'Lebu medanialem Branch', '+251900566626', 'KEMAL-DINE IBRAHIM', '1491017363710016', 'USD 108', '2022-02-25 05:23:15'),
(24, 1486, '173', 'Figa Branch', '+251928405223', 'Kibret Girma Gulilat', '1731017295184014', '>300/month', '2022-04-27 13:52:17'),
(25, 1009, '448', 'Gina Ager Branch', '0911176875', 'GEBA GENERAL BUSINESS PLC', '1622117315730014', '34410', '2022-05-23 09:09:44'),
(26, 3030, '222', 'Estie Branch', '0911355099', 'GESESE ABEBE WOLDEMARYAM', '4569417595477015', '0.00', '2022-06-16 08:22:01'),
(27, 1779, '289', 'Ebinat Branch', '0960132132', 'SELAM GEBRESILASSIE GEBREMEDIHEN', '2599112663441018', '>500 USD/MONTH', '2022-09-07 11:43:25'),
(28, 2154, '353', 'Woliso Branch', '0983887168', 'ASELEFU TADESSE MEKONEN', '3539117891143018', '492USD', '2022-10-01 10:46:33'),
(29, 4023, '184', 'Arat Killo Branch', '0926792900', 'YIMEGNUSHAL GIZAW ANDARGIE', '1849217727635013', '195.99 USD', '2022-11-02 14:07:11'),
(30, 116, '261', 'Shimbt Branch', '0911758181', 'GEREMEW ABEBE SEYOUM', '', '193 USD', '2022-11-03 15:38:30'),
(31, 2946, '007', 'Merhaba Branch', '0914', 'fikre deresse hassen', '2031011040985013', '385.58', '2023-02-03 12:29:33'),
(32, 2946, '007', 'Merhaba Branch', '0914', 'fikre deresse hassen', '2031011040985013', '385.58', '2023-02-03 12:29:36'),
(33, 3133, '451', 'Wagshum Branch', '0902009448', ' NETSANET KELETAW TAFERE ', '4029117009393019', '200 USD', '2023-03-14 09:27:58');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
