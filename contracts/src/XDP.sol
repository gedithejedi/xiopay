// SPDX-License-Identifier: GNU AGPLv3
pragma solidity ^0.8.13;

import {IERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract XDP {
    bytes32 constant EMPTY_UID = 0;

    struct Campaign {
        bytes32 uid;
        string name;
        uint256 balance;
        mapping(address => uint8) permissions; // 0: none, 1: member, 2: admin
        uint8 status; // 0: disabled, 1: active
    }

    address public owner;
    address public usdx;
    mapping(bytes32 => Campaign) private campaigns;

    modifier onlyAdmin(bytes32 _campaignId) {
        require(campaigns[_campaignId].permissions[msg.sender] == 2, "XDP: Only admin");
        _;
    }

    modifier onlyMember(bytes32 _campaignId) {
        require(campaigns[_campaignId].permissions[msg.sender] >= 1, "XDP: Only member");
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
        uint32 bump = 0;
        bytes32 uid;

        while (true) {
            uid = _getUID(_name, msg.sender, bump);
            if (campaigns[uid].uid == EMPTY_UID) {
                break;
            }

            unchecked {
                ++bump;
            }
        }

        campaigns[uid].uid = uid;
        campaigns[uid].name = _name;
        campaigns[uid].status = 1;
        campaigns[uid].permissions[msg.sender] = 2;

        emit AdminAdded(uid, msg.sender, msg.sender);
        emit CampaignCreated(uid, msg.sender, _name);
        return uid;
    }

    function addMember(bytes32 _campaignId, address _member) public onlyAdmin(_campaignId) {
        campaigns[_campaignId].permissions[_member] = 1;
        emit MemberAdded(_campaignId, _member, msg.sender);
    }

    function removeMember(bytes32 _campaignId, address _member) public onlyAdmin(_campaignId) {
        campaigns[_campaignId].permissions[_member] = 0;
        emit MemberRemoved(_campaignId, _member);
    }

    function addAdmin(bytes32 _campaignId, address _admin) public onlyAdmin(_campaignId) {
        campaigns[_campaignId].permissions[_admin] = 2;
        emit AdminAdded(_campaignId, _admin, msg.sender);
    }

    function disableCampaign(bytes32 _campaignId) public onlyAdmin(_campaignId) {
        campaigns[_campaignId].status = 0;
        emit CampaignDisabled(_campaignId, msg.sender);
    }

    function donate(bytes32 _campaignId) public payable {
        campaigns[_campaignId].balance += msg.value;
        emit Donate(_campaignId, msg.sender, msg.value);
    }

    function donateWithPermit(bytes32 _campaignId, uint256 amount, uint256 deadline, uint8 v, bytes32 r, bytes32 s)
        external
    {
        require(amount > 0, "XDP: Amount must be greater than zero");

        // Call permit to allow this contract to spend user's tokens
        IERC20Permit(usdx).permit(msg.sender, address(this), amount, deadline, v, r, s);
        // Transfer tokens from donor to the contract
        bool success = IERC20(usdx).transferFrom(msg.sender, address(this), amount);
        require(success, "XDP: Token transfer failed");

        campaigns[_campaignId].balance += amount;

        emit Donate(_campaignId, msg.sender, amount);
    }

    function withdraw(bytes32 _campaignId, uint256 _amount, address receiver) public onlyMember(_campaignId) {
        _withdraw(_campaignId, _amount, receiver);
    }

    function withdraw(bytes32 _campaignId, uint256 _amount) public onlyAdmin(_campaignId) {
        _withdraw(_campaignId, _amount, msg.sender);
    }

    function getBalance(bytes32 _campaignId) public view returns (uint256) {
        return campaigns[_campaignId].balance;
    }

    function getStatus(bytes32 _campaignId) public view returns (uint8) {
        return campaigns[_campaignId].status;
    }

    function getPermissions(bytes32 _campaignId, address _member) public view returns (uint8) {
        return campaigns[_campaignId].permissions[_member];
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    function getToken() public view returns (address) {
        return address(usdx);
    }

    function _getUID(string memory name, address creator, uint32 bump) private view returns (bytes32) {
        return keccak256(abi.encodePacked(name, creator, block.timestamp, bump));
    }

    function _withdraw(bytes32 _campaignId, uint256 _amount, address receiver) private {
        require(campaigns[_campaignId].balance >= _amount, "XDP: Insufficient balance");
        require(campaigns[_campaignId].permissions[receiver] == 2, "XDP: Receiver not an admin");
        campaigns[_campaignId].balance -= _amount;
        bool success = IERC20(usdx).transfer(receiver, _amount);
        require(success, "XDP: Transfer failed");
        emit Withdraw(_campaignId, receiver, _amount, msg.sender);
    }
}
