-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 13, 2020 at 11:31 PM
-- Server version: 10.4.15-MariaDB-log
-- PHP Version: 7.4.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cs340_coppintr`
--

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
CREATE TABLE `clients` (
  `clientID` int(11) NOT NULL AUTO_INCREMENT,
  `fname` varchar(255) NOT NULL,
  `lname` varchar(255) NOT NULL,
  PRIMARY KEY (`clientID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `clients`
--

INSERT INTO `clients` (`fname`, `lname`) VALUES
('John', 'Smith'),
('Terry', 'Cruise'),
('Jerry', 'Heinsburger'),
('Joey', 'Sanchez'),
('Akane', 'Tsunemori');

-- --------------------------------------------------------

--
-- Table structure for table `healthIssues`
--

DROP TABLE IF EXISTS `healthIssues`;
CREATE TABLE `healthIssues` (
  `healthIssueID` int(11) NOT NULL AUTO_INCREMENT,
  `healthIssue` varchar(255) NOT NULL,
  `species` varchar(255) NOT NULL,
  `recPercentCanned` decimal(3,2) NOT NULL,
  `recPercentDry` decimal(3,2) NOT NULL,
  PRIMARY KEY (`healthIssueID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `healthIssues`
--

INSERT INTO `healthIssues` (`healthIssue`, `species`, `recPercentCanned`, `recPercentDry`) VALUES
('Hairballs', 'Cat', '0.80', '0.20'),
('Overweight', 'Dog', '0.20', '0.80'),
('Underweight', 'Dog', '0.50', '0.50');


-- --------------------------------------------------------

--
-- Table structure for table `pets`
--

DROP TABLE IF EXISTS `pets`;
CREATE TABLE `pets` (
  `petID` int(11) NOT NULL AUTO_INCREMENT,
  `petName` varchar(255) NOT NULL,
  `species` varchar(255) NOT NULL,
  `weight` decimal(5,2) DEFAULT NULL,
  `caloricGoal` int(4) DEFAULT NULL,
  `healthIssue` varchar(255) NOT NULL,
  `percentCanned` decimal(3,2) DEFAULT NULL,
  `percentDry` decimal(3,2) DEFAULT NULL,
  PRIMARY KEY (`petID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `pets`
--

INSERT INTO `pets` (`petName`, `species`, `weight`, `caloricGoal`, `healthIssue`, `percentCanned`, `percentDry`) VALUES
('Sir.George', 'Dog', '30.10', 364, 'Overweight', '0.20', '0.80'),
('Momo', 'Dog', '15.00', 520, 'Underweight', '0.50', '0.50'),
('Lucy', 'Cat', '5.00', 243, 'Underweight', '0.70', '0.30'),
('Killer', 'Cat', '14.55', 378, 'Hairballs', '0.80', '0.20');


-- --------------------------------------------------------

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `productID` int(11) NOT NULL AUTO_INCREMENT,
  `healthIssue` varchar(255) NOT NULL,
  `brandName` varchar(255) NOT NULL,
  `forSpecies` varchar(255) NOT NULL,
  `foodName` varchar(255) NOT NULL,
  `foodType` varchar(255) NOT NULL,
  `unit` varchar(255) NOT NULL,
  `calPerUnit` decimal(4,2) NOT NULL,
  PRIMARY KEY (`productID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`healthIssue`, `brandName`, `forSpecies`, `foodName`, `foodType`, `unit`, `calPerUnit`) VALUES
('Hairballs', 'Hill\'s feline', 'Cat', 'Hairball Relief Feline Chow', 'canned', 'can', '70.10'),
('Overweight', 'Royal Canin canine', 'Dog', 'Low Cal Canine Chow', 'dry', 'cup', '30.75'),
('Underweight', 'Royal Canin feline', 'Cat', 'Low Cal Feline Food', 'dry', 'cup', '40.00');


-- --------------------------------------------------------

--
-- Table structure for table `clientPet`
--

DROP TABLE IF EXISTS `clientPet`;
CREATE TABLE `clientPet` (
  `clientID` int(11) DEFAULT NULL,
  `petID` int(11) DEFAULT NULL,
  PRIMARY KEY (`clientID`,`petID`),
  FOREIGN KEY (`clientID`) REFERENCES `clients` (`clientID`) ON DELETE CASCADE,
  FOREIGN KEY (`petID`) REFERENCES `pets` (`petID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `clientPet`
--

INSERT INTO `clientPet` (`clientID`, `petID`) VALUES
(1, 1),
(1, 3),
(2, 2),
(5, 4);


-- --------------------------------------------------------

--
-- Table structure for table `petProduct`
--

DROP TABLE IF EXISTS `petProduct`;
CREATE TABLE `petProduct` (
  `petID` int(11) DEFAULT NULL,
  `productID` int(11) DEFAULT NULL,
  PRIMARY KEY (`petID`, `productID`),
  FOREIGN KEY (`petID`) REFERENCES `pets` (`petID`) ON DELETE CASCADE,
  FOREIGN KEY (`productID`) REFERENCES `products` (`productID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `petProduct`
--

INSERT INTO `petProduct` (`petID`, `productID`) VALUES
(3, 3),
(4, 1);


--
-- -- Indexes for dumped tables
-- --

-- --
-- -- Indexes for table `clientPet`
-- --
-- ALTER TABLE `clientPet`
--   ADD KEY `clientPetFK1` (`clientID`),
--   ADD KEY `clientPetFK2` (`petID`);

-- --
-- -- Indexes for table `clients`
-- --
-- ALTER TABLE `clients`
--   ADD PRIMARY KEY (`clientID`),
--   ADD UNIQUE KEY `clientID` (`clientID`);

-- --
-- -- Indexes for table `healthIssues`
-- --
-- ALTER TABLE `healthIssues`
--   ADD PRIMARY KEY (`healthIssue`),
--   ADD UNIQUE KEY `healthIssue` (`healthIssue`);

-- --
-- -- Indexes for table `petProduct`
-- --
-- ALTER TABLE `petProduct`
--   ADD KEY `petProductFK1` (`petID`),
--   ADD KEY `petProductFK2` (`productID`);

-- --
-- -- Indexes for table `pets`
-- --
-- ALTER TABLE `pets`
--   ADD PRIMARY KEY (`petID`),
--   ADD UNIQUE KEY `petID` (`petID`);

-- --
-- -- Indexes for table `products`
-- --
-- ALTER TABLE `products`
--   ADD PRIMARY KEY (`productID`),
--   ADD UNIQUE KEY `productID` (`productID`);

-- --
-- -- AUTO_INCREMENT for dumped tables
-- --

-- --
-- -- AUTO_INCREMENT for table `clients`
-- --
-- ALTER TABLE `clients`
--   MODIFY `clientID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

-- --
-- -- AUTO_INCREMENT for table `pets`
-- --
-- ALTER TABLE `pets`
--   MODIFY `petID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

-- --
-- -- AUTO_INCREMENT for table `products`
-- --
-- ALTER TABLE `products`
--   MODIFY `productID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `clientPet`
-- --
-- ALTER TABLE `clientPet`
--   ADD CONSTRAINT `clientPetFK1` FOREIGN KEY (`clientID`) REFERENCES `clients` (`clientID`) ON DELETE CASCADE ON UPDATE CASCADE,
--   ADD CONSTRAINT `clientPetFK2` FOREIGN KEY (`petID`) REFERENCES `pets` (`petID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- --
-- -- Constraints for table `petProduct`
-- --
-- ALTER TABLE `petProduct`
--   ADD CONSTRAINT `petProductFK1` FOREIGN KEY (`petID`) REFERENCES `pets` (`petID`) ON DELETE CASCADE ON UPDATE CASCADE,
--   ADD CONSTRAINT `petProductFK2` FOREIGN KEY (`productID`) REFERENCES `products` (`productID`) ON DELETE CASCADE ON UPDATE CASCADE;
-- COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
