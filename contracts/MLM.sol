// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MLM {
    // Mapping to track active accounts
    mapping(address => bool) public activeAccounts;
    
    // Mapping to track referrals (referrer => referrals)
    mapping(address => address[]) private referrals;
    
    // Mapping to track earnings
    mapping(address => uint256) public earnings;
    
    // Activation fee
    uint256 public activationFee = 0.1 ether;
    
    // Events
    event AccountActivated(address account, uint256 fee);
    event ReferralAdded(address referrer, address referral);
    
    // Activate account without referrer
    function activateAccount() external payable {
        require(msg.value >= activationFee, "Insufficient fee");
        require(!activeAccounts[msg.sender], "Account already active");
        
        activeAccounts[msg.sender] = true;
        emit AccountActivated(msg.sender, msg.value);
    }
    
    // Activate account with referrer
    function activateAccountWithReferrer(address referrer) external payable {
        require(msg.value >= activationFee, "Insufficient fee");
        require(!activeAccounts[msg.sender], "Account already active");
        require(activeAccounts[referrer], "Referrer is not active");
        require(referrer != msg.sender, "Cannot refer yourself");
        
        activeAccounts[msg.sender] = true;
        
        // Add to referrer's list
        referrals[referrer].push(msg.sender);
        
        // Pay referrer commission (50% of fee)
        uint256 commission = msg.value / 2;
        earnings[referrer] += commission;
        
        emit AccountActivated(msg.sender, msg.value);
        emit ReferralAdded(referrer, msg.sender);
    }
    
    // Check if account is active
    function isAccountActive(address account) external view returns (bool) {
        return activeAccounts[account];
    }
    
    // Get referrals for an account
    function getReferrals(address account) external view returns (address[] memory) {
        return referrals[account];
    }
    
    // Get earnings for an account
    function getEarnings(address account) external view returns (uint256) {
        return earnings[account];
    }
    
    // Withdraw earnings
    function withdrawEarnings() external {
        uint256 amount = earnings[msg.sender];
        require(amount > 0, "No earnings to withdraw");
        
        earnings[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }
}