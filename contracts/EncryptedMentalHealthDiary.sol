// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {FHE, euint32, externalEuint32, ebool} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title EncryptedMentalHealthDiary
/// @dev Secure mental health tracking with FHE encryption
contract EncryptedMentalHealthDiary is SepoliaConfig {
    // Structure to store daily encrypted mental health data
    struct DailyEntry {
        bytes32 mentalStateHandle;     // Encrypted input handle for mental state score (0-100)
        bytes32 stressHandle;          // Encrypted input handle for stress level (0-100)
        uint256 timestamp;             // Block timestamp for the entry
        bool exists;                   // Whether this entry exists
    }

    // Mapping from user address to date (day number) to daily entry
    mapping(address => mapping(uint256 => DailyEntry)) private _userEntries;
    
    // Mapping to track the last entry date for each user
    mapping(address => uint256) private _lastEntryDate;
    
    // Mapping to track total entries count per user
    mapping(address => uint256) private _entryCount;

    event EntryAdded(address indexed user, uint256 date, uint256 timestamp);
    event EntryDecrypted(address indexed user, uint256 date);

    /// @notice Add a daily mental health entry
    /// @param date The date identifier (day number since epoch or custom date)
    /// @param encryptedMentalStateHandle The encrypted input handle for mental state score (0-100)
    /// @param encryptedStressHandle The encrypted input handle for stress level (0-100)
    function addEntry(
        uint256 date,
        bytes32 encryptedMentalStateHandle,
        bytes32 encryptedStressHandle
    ) external {
        // Store the encrypted handles directly (like proof-quill-shine-main)
        _userEntries[msg.sender][date] = DailyEntry({
            mentalStateHandle: encryptedMentalStateHandle,
            stressHandle: encryptedStressHandle,
            timestamp: block.timestamp,
            exists: true
        });

        // Update tracking
        if (date > _lastEntryDate[msg.sender]) {
            _lastEntryDate[msg.sender] = date;
        }
        _entryCount[msg.sender]++;

        emit EntryAdded(msg.sender, date, block.timestamp);
    }

    /// @notice Get encrypted mental state handle for a specific date
    /// @param user The user address
    /// @param date The date identifier
    /// @return encryptedHandle The encrypted input handle for mental state score
    function getMentalStateHandle(address user, uint256 date)
        external
        view
        returns (bytes32 encryptedHandle)
    {
        require(_userEntries[user][date].exists, "Entry does not exist");
        return _userEntries[user][date].mentalStateHandle;
    }

    /// @notice Get encrypted stress handle for a specific date
    /// @param user The user address
    /// @param date The date identifier
    /// @return encryptedHandle The encrypted input handle for stress level
    function getStressHandle(address user, uint256 date)
        external
        view
        returns (bytes32 encryptedHandle)
    {
        require(_userEntries[user][date].exists, "Entry does not exist");
        return _userEntries[user][date].stressHandle;
    }

    /// @notice Get all encrypted handles for a specific date
    /// @param user The user address
    /// @param date The date identifier
    /// @return mentalStateHandle The encrypted input handle for mental state score
    /// @return stressHandle The encrypted input handle for stress level
    /// @return timestamp The block timestamp
    function getEntry(address user, uint256 date)
        external
        view
        returns (
            bytes32 mentalStateHandle,
            bytes32 stressHandle,
            uint256 timestamp
        )
    {
        require(_userEntries[user][date].exists, "Entry does not exist");
        DailyEntry memory entry = _userEntries[user][date];
        return (entry.mentalStateHandle, entry.stressHandle, entry.timestamp);
    }

    /// @notice Validate if a date range contains valid entries
    /// @param user The user address
    /// @param startDate The start date for validation
    /// @param endDate The end date for validation
    /// @return isValid True if the date range contains at least one valid entry
    function validateDateRange(address user, uint256 startDate, uint256 endDate)
        external
        view
        returns (bool isValid)
    {
        require(startDate <= endDate, "Invalid date range");
        for (uint256 date = startDate; date <= endDate; date++) {
            if (_userEntries[user][date].exists) {
                return true;
            }
        }
        return false;
    }

    /// @notice Get the last entry date for a user
    /// @param user The user address
    /// @return The last entry date
    function getLastEntryDate(address user) external view returns (uint256) {
        return _lastEntryDate[user];
    }

    /// @notice Get the total entry count for a user
    /// @param user The user address
    /// @return The total number of entries
    function getEntryCount(address user) external view returns (uint256) {
        return _entryCount[user];
    }

    /// @notice Check if an entry exists for a specific date
    /// @param user The user address
    /// @param date The date identifier
    /// @return Whether the entry exists
    function entryExists(address user, uint256 date) external view returns (bool) {
        return _userEntries[user][date].exists;
    }
}
