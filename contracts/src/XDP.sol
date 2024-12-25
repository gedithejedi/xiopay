// SPDX-License-Identifier: GNU AGPLv3
pragma solidity ^0.8.0;

import {IERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract XDP {
    bytes32 constant EMPTY_UID = 0;

    struct Campaign {
        bytes32 uid;
        string name;
        uint256 balance;
        uint8 status; // 0: disabled, 1: active
    }

    mapping(bytes32 => mapping(address => uint8)) private permissions;

    address public owner;
    address public usdx;
    mapping(bytes32 => Campaign) private campaigns;

    modifier onlyAdmin(bytes32 _campaignUid) {
        require(permissions[_campaignUid][msg.sender] == 2, "XDP: Only admin");
        _;
    }

    modifier onlyMember(bytes32 _campaignUid) {
        require(permissions[_campaignUid][msg.sender] >= 1, "XDP: Only member");
        _;
    }

    event CampaignCreated(bytes32 indexed campaignId, address indexed creator, string name);
    event Donate(bytes32 indexed campaignId, address indexed donor, uint256 indexed amount);
    event Withdraw(bytes32 indexed campaignId, address indexed receiver, uint256 indexed amount, address caller);
    event MemberAdded(bytes32 indexed campaignId, address indexed member, address caller);
    event MemberRemoved(bytes32 indexed campaignId, address indexed member);
    event AdminAdded(bytes32 indexed campaignId, address indexed admin, address caller);
    event CampaignDisabled(bytes32 indexed campaignId, address caller);

    constructor(address _usdx) {
        owner = msg.sender;
        usdx = _usdx;
    }

    function createCampaign(string memory _name) public returns (bytes32) {
        bytes32 uid;
        uint32 bump = 0;

        while (true) {
            uid = _getUID(_name, msg.sender, bump);
            if (campaigns[uid].uid == EMPTY_UID) {
                break;
            }

            unchecked {
                ++bump;
            }
        }

        campaigns[uid] = Campaign({
            uid: uid,
            name: _name,
            status: 1, // Activate campaign
            balance: 0
        });

        _updateMemberPermission(uid, msg.sender, 2);
        emit CampaignCreated(uid, msg.sender, _name);

        return uid;
    }

    function addMember(bytes32 _campaignUid, address _member) public onlyAdmin(_campaignUid) {
        _updateMemberPermission(_campaignUid, _member, 1);
    }

    function removeMember(bytes32 _campaignUid, address _member) public onlyAdmin(_campaignUid) {
        _updateMemberPermission(_campaignUid, _member, 0);
    }

    function addAdmin(bytes32 _campaignUid, address _admin) public onlyAdmin(_campaignUid) {
        _updateMemberPermission(_campaignUid, _admin, 2);
    }

    function disableCampaign(bytes32 _campaignUid) public onlyAdmin(_campaignUid) {
        campaigns[_campaignUid].status = 0;
        emit CampaignDisabled(_campaignUid, msg.sender);
    }

    function donate(bytes32 _campaignUid) public payable {
        campaigns[_campaignUid].balance += msg.value;
        emit Donate(_campaignUid, msg.sender, msg.value);
    }

    function donateWithPermit(bytes32 _campaignUid, uint256 amount, uint256 deadline, uint8 v, bytes32 r, bytes32 s)
        external
    {
        require(amount > 0, "XDP: Amount must be greater than zero");

        // Call permit to allow this contract to spend user's tokens
        IERC20Permit(usdx).permit(msg.sender, address(this), amount, deadline, v, r, s);

        // Transfer tokens to contract
        bool success = IERC20(usdx).transferFrom(msg.sender, address(this), amount);
        require(success, "XDP: Token transfer failed");

        campaigns[_campaignUid].balance += amount;
        emit Donate(_campaignUid, msg.sender, amount);
    }

    function withdraw(bytes32 _campaignUid, uint256 _amount, address receiver) public onlyMember(_campaignUid) {
        _withdraw(_campaignUid, _amount, receiver);
    }

    function withdraw(bytes32 _campaignUid, uint256 _amount) public onlyAdmin(_campaignUid) {
        _withdraw(_campaignUid, _amount, msg.sender);
    }

    function getBalance(bytes32 _campaignUid) public view returns (uint256) {
        return campaigns[_campaignUid].balance;
    }

    function getStatus(bytes32 _campaignUid) public view returns (uint8) {
        return campaigns[_campaignUid].status;
    }

    function getPermissions(bytes32 _campaignUid, address _member) public view returns (uint8) {
        return permissions[_campaignUid][_member];
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    function getToken() public view returns (address) {
        return usdx;
    }

    function _withdraw(bytes32 _campaignUid, uint256 _amount, address receiver) private {
        require(campaigns[_campaignUid].balance >= _amount, "XDP: Insufficient balance");
        require(permissions[_campaignUid][receiver] == 2, "XDP: Receiver not an admin");

        // Decrease balance and transfer funds to receiver
        campaigns[_campaignUid].balance -= _amount;
        bool success = IERC20(usdx).transfer(receiver, _amount);
        require(success, "XDP: Transfer failed");

        emit Withdraw(_campaignUid, receiver, _amount, msg.sender);
    }

    function _updateMemberPermission(bytes32 _campaignUid, address _member, uint8 permissionLevel) private {
        require(_member != address(0), "XDP: Invalid member address");
        permissions[_campaignUid][_member] = permissionLevel;
        emit MemberAdded(_campaignUid, _member, msg.sender);
    }

    function _getUID(string memory name, address creator, uint32 bump) private view returns (bytes32) {
        return keccak256(abi.encodePacked(name, creator, block.timestamp, bump));
    }
}
