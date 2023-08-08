 

CREATE TABLE IF NOT EXISTS `prominent_customer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `branch_code` varchar(50) NOT NULL,
  `branch` varchar(100) NOT NULL,
  `company_name` varchar(50) NOT NULL, 
  `account_number` varchar(100) NOT NULL, 
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ;
 
