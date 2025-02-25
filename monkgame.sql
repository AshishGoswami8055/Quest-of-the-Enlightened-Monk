-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 01, 2024 at 11:21 AM
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
-- Database: `monkgame`
--

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `character` varchar(255) NOT NULL,
  `level1Energies` int(255) NOT NULL,
  `level1Health` int(255) NOT NULL,
  `level1Min` int(255) NOT NULL,
  `level1Sec` int(255) NOT NULL,
  `level1Score` int(255) NOT NULL,
  `level2Energies` int(255) NOT NULL,
  `level2Health` int(255) NOT NULL,
  `level2Min` int(255) NOT NULL,
  `level2Sec` int(255) NOT NULL,
  `level2Score` int(255) NOT NULL,
  `level3Energies` int(255) NOT NULL,
  `level3Health` int(255) NOT NULL,
  `level3Min` int(255) NOT NULL,
  `level3Sec` int(255) NOT NULL,
  `level3Score` int(255) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`, `character`, `level1Energies`, `level1Health`, `level1Min`, `level1Sec`, `level1Score`, `level2Energies`, `level2Health`, `level2Min`, `level2Sec`, `level2Score`, `level3Energies`, `level3Health`, `level3Min`, `level3Sec`, `level3Score`, `date`) VALUES
(1, 'ABC', 'Zen Monk', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '2024-09-01 09:20:22');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
