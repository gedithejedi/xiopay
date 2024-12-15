// SPDX-License-Identifier: GNU AGPLv3
pragma solidity ^0.8.0;

bytes32 constant EMPTY_UID = 0;

interface IXDP {
    // Events
    event CampaignCreated(bytes32 indexed campaignId, address indexed creator, string name);
    event Donate(bytes32 indexed campaignId, address indexed donor, uint256 indexed amount);
    event Withdraw(bytes32 indexed campaignId, address indexed receiver, uint256 indexed amount, address caller);
    event MemberAdded(bytes32 indexed campaignId, address indexed member, address caller);
    event MemberRemoved(bytes32 indexed campaignId, address indexed member);
    event AdminAdded(bytes32 indexed campaignId, address indexed admin, address caller);
    event CampaignDisabled(bytes32 indexed campaignId, address caller);

    // Functions
    function createCampaign(string memory _name) external returns (bytes32);

    function addMember(bytes32 _campaignId, address _member) external;

    function removeMember(bytes32 _campaignId, address _member) external;

    function addAdmin(bytes32 _campaignId, address _admin) external;

    function disableCampaign(bytes32 _campaignId) external;

    function donate(bytes32 _campaignId) external payable;

    function donateWithPermit(bytes32 _campaignId, uint256 amount, uint256 deadline, uint8 v, bytes32 r, bytes32 s)
        external;

    function withdraw(bytes32 _campaignId, uint256 _amount, address receiver) external;

    function withdraw(bytes32 _campaignId, uint256 _amount) external;

    // View Functions
    function getBalance(bytes32 _campaignId) external view returns (uint256);

    function getStatus(bytes32 _campaignId) external view returns (uint8);

    function getPermissions(bytes32 _campaignId, address _member) external view returns (uint8);

    function getOwner() external view returns (address);

    function getToken() external view returns (address);
}
