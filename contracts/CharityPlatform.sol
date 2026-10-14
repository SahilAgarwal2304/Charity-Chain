// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CharityPlatform (CharityChain)
 * @dev Decentralized, Transparent Charity Platform on Ethereum Blockchain.
 * Developed for Final Year Computer Engineering Project (SPPU).
 */
contract CharityPlatform {
    // --- Data Structures ---
    struct Donation {
        uint256 campaignId;
        address donor;
        uint256 amount;
        uint256 timestamp;
        string message;
    }

    struct Campaign {
        uint256 id;
        address payable creator;
        address payable beneficiary;
        string title;
        string description;
        string category;
        uint256 targetAmount; // in wei
        uint256 deadline;     // unix timestamp
        uint256 amountRaised; // in wei
        bool fundsWithdrawn;
        bool active;
    }

    // --- State Variables ---
    uint256 public campaignCount = 0;
    uint256 public totalDonationsCount = 0;
    uint256 public totalDonatedAmount = 0;

    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => Donation[]) public campaignDonations;
    Donation[] public allDonations; // Public transparency ledger

    // --- Events (for frontend and off-chain indexing) ---
    event CampaignCreated(
        uint256 indexed campaignId,
        address indexed creator,
        address indexed beneficiary,
        string title,
        string category,
        uint256 targetAmount,
        uint256 deadline
    );

    event DonationReceived(
        uint256 indexed campaignId,
        address indexed donor,
        uint256 amount,
        uint256 timestamp,
        string message
    );

    event FundsWithdrawn(
        uint256 indexed campaignId,
        address indexed beneficiary,
        uint256 amount,
        uint256 timestamp
    );

    // --- Modifiers ---
    modifier campaignExists(uint256 _campaignId) {
        require(_campaignId > 0 && _campaignId <= campaignCount, "Campaign does not exist");
        require(campaigns[_campaignId].active, "Campaign is not active");
        _;
    }

    // --- Core Functions ---

    /**
     * @notice Create a new fundraising campaign
     * @param _title Title of the campaign
     * @param _description Detailed explanation
     * @param _category E.g., Healthcare, Education, Disaster Relief
     * @param _targetAmount Funding target in Wei
     * @param _durationInDays Number of days the campaign will run
     * @param _beneficiary Address that will receive the funds upon withdrawal
     */
    function createCampaign(
        string memory _title,
        string memory _description,
        string memory _category,
        uint256 _targetAmount,
        uint256 _durationInDays,
        address payable _beneficiary
    ) external returns (uint256) {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(_targetAmount > 0, "Target must be greater than zero");
        require(_durationInDays > 0, "Duration must be at least 1 day");
        require(_beneficiary != address(0), "Invalid beneficiary address");

        campaignCount++;
        uint256 deadline = block.timestamp + (_durationInDays * 1 days);

        campaigns[campaignCount] = Campaign({
            id: campaignCount,
            creator: payable(msg.sender),
            beneficiary: _beneficiary,
            title: _title,
            description: _description,
            category: _category,
            targetAmount: _targetAmount,
            deadline: deadline,
            amountRaised: 0,
            fundsWithdrawn: false,
            active: true
        });

        emit CampaignCreated(
            campaignCount,
            msg.sender,
            _beneficiary,
            _title,
            _category,
            _targetAmount,
            deadline
        );

        return campaignCount;
    }

    /**
     * @notice Donate Ether to a specific campaign
     * @param _campaignId ID of the campaign to donate to
     * @param _message Encouragement/transparency note from donor
     */
    function donate(uint256 _campaignId, string memory _message)
        external
        payable
        campaignExists(_campaignId)
    {
        require(msg.value > 0, "Donation amount must be greater than 0");
        Campaign storage campaign = campaigns[_campaignId];
        require(block.timestamp <= campaign.deadline, "Campaign deadline has passed");

        campaign.amountRaised += msg.value;
        totalDonationsCount++;
        totalDonatedAmount += msg.value;

        Donation memory newDonation = Donation({
            campaignId: _campaignId,
            donor: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp,
            message: _message
        });

        campaignDonations[_campaignId].push(newDonation);
        allDonations.push(newDonation);

        emit DonationReceived(_campaignId, msg.sender, msg.value, block.timestamp, _message);
    }

    /**
     * @notice Withdraw funds from the campaign to the verified beneficiary
     * @dev Only the campaign creator or designated beneficiary can trigger this withdrawal
     * @param _campaignId ID of the campaign
     */
    function withdrawFunds(uint256 _campaignId)
        external
        campaignExists(_campaignId)
    {
        Campaign storage campaign = campaigns[_campaignId];
        require(
            msg.sender == campaign.creator || msg.sender == campaign.beneficiary,
            "Only creator or beneficiary can withdraw funds"
        );
        require(!campaign.fundsWithdrawn, "Funds have already been withdrawn");
        require(campaign.amountRaised > 0, "No funds available to withdraw");
        
        // Allowed if target reached OR deadline passed
        require(
            campaign.amountRaised >= campaign.targetAmount || block.timestamp > campaign.deadline,
            "Target not reached yet and deadline is still active"
        );

        uint256 amountToTransfer = campaign.amountRaised;
        campaign.fundsWithdrawn = true;
        campaign.active = false; // Mark completed

        (bool sent, ) = campaign.beneficiary.call{value: amountToTransfer}("");
        require(sent, "Ether transfer to beneficiary failed");

        emit FundsWithdrawn(_campaignId, campaign.beneficiary, amountToTransfer, block.timestamp);
    }

    // --- View Functions for Frontend / Queries ---

    /**
     * @notice Fetch all campaigns
     */
    function getCampaigns() external view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](campaignCount);
        for (uint256 i = 1; i <= campaignCount; i++) {
            allCampaigns[i - 1] = campaigns[i];
        }
        return allCampaigns;
    }

    /**
     * @notice Fetch single campaign details
     */
    function getCampaign(uint256 _campaignId) external view returns (Campaign memory) {
        require(_campaignId > 0 && _campaignId <= campaignCount, "Invalid campaign ID");
        return campaigns[_campaignId];
    }

    /**
     * @notice Fetch donations for a specific campaign
     */
    function getDonations(uint256 _campaignId) external view returns (Donation[] memory) {
        return campaignDonations[_campaignId];
    }

    /**
     * @notice Fetch all global donations for public transparency ledger
     */
    function getAllDonations() external view returns (Donation[] memory) {
        return allDonations;
    }

    /**
     * @notice Fetch global platform statistics
     */
    function getPlatformStats()
        external
        view
        returns (
            uint256 totalCampaigns,
            uint256 totalDonatedWei,
            uint256 totalDonationsCount_
        )
    {
        return (campaignCount, totalDonatedAmount, totalDonationsCount);
    }
}
