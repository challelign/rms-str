CREATE TABLE IF NOT EXISTS `logged_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `name` varchar(80) NOT NULL,
  `position` varchar(80) NOT NULL,
  `branch_code` int(11) NOT NULL,
  `branch_name` varchar(80) NOT NULL,
  `big_withdrowal_count` int(11) DEFAULT '0',
  `shareholder_count` int(11) DEFAULT '0',
  `top_depositors_count` int(11) DEFAULT '0',
  `dormant_account_count` int(11) DEFAULT '0',
  `potential_customer_count` int(11) DEFAULT '0',
  `below_500_count` int(11) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `big_withdrawal` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `customer_branch` varchar(20) DEFAULT NULL,
  `status_response` tinyint(4) DEFAULT '0',
  `response_time` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `action` int(11) DEFAULT NULL,
  `customer_reason` int(11) DEFAULT NULL,
  `destination_bank` int(11) DEFAULT NULL,
  `destination_branch` varchar(20) NOT NULL,
  `remark` text NOT NULL,
  `account_holder` int(11) DEFAULT '0',
  `beneficiary_name` varchar(100) NOT NULL,
  `transaction_id` varchar(100) NOT NULL,
  `amount` double NOT NULL,
  `customer_name` varchar(50) NOT NULL,
  `customer_address` varchar(100) NOT NULL,
  `customer_phone` varchar(30) NOT NULL,
  `account_number` varchar(50) NOT NULL,
  `transaction_date` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `transaction_id` (`transaction_id`)
);

CREATE TABLE IF NOT EXISTS `dormant_accounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_ID` varchar(15) CHARACTER SET utf8 NOT NULL,
  `customer_branch` varchar(30) CHARACTER SET utf8 NOT NULL,
  `customer_name` varchar(500) CHARACTER SET utf8 NOT NULL,
  `account_number` varchar(50) NOT NULL,
  `customer_contact` varchar(50) NOT NULL,
  `action` int(11) DEFAULT '0',
  `reason` varchar(500) CHARACTER SET utf8 DEFAULT NULL,
  `remark` text CHARACTER SET utf8,
  `other_reason` text CHARACTER SET utf8 NOT NULL,
  `responded` tinyint(4) NOT NULL DEFAULT '0',
  `current_status` varchar(50) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `account_number` (`account_number`)
);

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
) ;

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
);

CREATE TABLE IF NOT EXISTS `shareholders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `sh_name` varchar(50) NOT NULL,
  `sh_account_no` varchar(50) NOT NULL,
  `sh_address` varchar(50) NOT NULL,
  `sh_branch` varchar(50) NOT NULL,
  `no_of_shares` varchar(50) NOT NULL,
  `sh_deposit` varchar(50) NOT NULL,
  `action` varchar(50) NOT NULL,
  `reason` varchar(50) NOT NULL,
  `efforts` text NOT NULL,
  `remark` text NOT NULL,
  `responded` tinyint(4) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
)  ;

CREATE TABLE IF NOT EXISTS `top_depositors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `customer_branch` varchar(50) NOT NULL,
  `customer_name` varchar(50) NOT NULL,
  `account_number` varchar(50) NOT NULL,
  `balance` varchar(50) NOT NULL,
  `customer_contact` varchar(50) NOT NULL,
  `supplier` text NOT NULL,
  `customers` text NOT NULL,
  `customers_full_potential_attended` int(11) DEFAULT '0',
  `action` varchar(50) NOT NULL,
  `comment` text NOT NULL,
  `responded` tinyint(4) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `account_number` (`account_number`)
)  ;

CREATE TABLE IF NOT EXISTS `potential_customers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `branch_code` varchar(30) NOT NULL,
  `branch` varchar(100) NOT NULL,
  `company_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `organization_type` varchar(100) NOT NULL,
  `contact_person` varchar(100) NOT NULL,
  `phone` varchar(100) NOT NULL,
  `address` varchar(100) NOT NULL,
  `action` int(11) DEFAULT '0',
  `account_number` varchar(100) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `topdepositor500` (
  `id` int(100) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `result` double NOT NULL,
  `max_balance` double DEFAULT NULL,
  `account` varchar(100) NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `customer_branch` varchar(255) NOT NULL,
  `customer_address` varchar(255) NOT NULL,
  `current_balance` varchar(255) NOT NULL,
  `account_created` varchar(255) NOT NULL,
  `last_active_month` varchar(255) NOT NULL,
  `had500_on_year` varchar(30) NOT NULL DEFAULT '2021',
  `had500_on_month` varchar(100) NOT NULL,
  `response` int(11) DEFAULT '0',
  `reason` varchar(50) DEFAULT NULL,
  `remark` text,
  `other_reason` text,
  `responded` tinyint(4) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);
