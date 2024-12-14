// SPDX-License-Identifier: GNU AGPLv3
pragma solidity ^0.8.13;

contract XDP {
  struct Campaign {
    mapping(address => uint8) permissions; // 0: none, 1: member, 2: admin
    string name;
    uint256 balance;
    uint8 status; // 0: disabled, 1: active
  }

  address public owner;
  address public usdx;
  mapping(uint256 => Campaign) private campaigns;


  modifier onlyOwner(address _usdx) {
    require(msg.sender == owner, "only owner");
    usdx = _usdx;
    _;
  }

  modifier onlyAdmin(uint256 _campaignId) {
    require(campaigns[_campaignId].permissions[msg.sender] == 2, "only admin");
    _;
  }

  modifier onlyMember(uint256 _campaignId) {
    require(campaigns[_campaignId].permissions[msg.sender] >= 1, "only member");
    _;
  }

  constructor() {
    owner = msg.sender;
  }

  function createCampaign(uint256 _campaignId, string memory _name) public {
    campaigns[_campaignId].name = _name;
    campaigns[_campaignId].permissions[msg.sender] = 2;
    campaigns[_campaignId].status = 1;
  }

  function addMember(uint256 _campaignId, address _member) public onlyAdmin(_campaignId) {
    campaigns[_campaignId].permissions[_member] = 1;
  }

  function removeMember(uint256 _campaignId, address _member) public onlyAdmin(_campaignId) {
    campaigns[_campaignId].permissions[_member] = 0;
  }

  function addAdmin(uint256 _campaignId, address _admin) public onlyAdmin(_campaignId) {
    campaigns[_campaignId].permissions[_admin] = 2;
  }

  function disableCampaign(uint256 _campaignId) public onlyAdmin(_campaignId) {
    campaigns[_campaignId].status = 0;
  }

  function donate(uint256 _campaignId) public payable {
    campaigns[_campaignId].balance += msg.value;
  }

  function withdraw(uint256 _campaignId, uint256 _amount, address receiver) public onlyMember(_campaignId) {
    require(campaigns[_campaignId].balance >= _amount, "insufficient balance");
    require(campaigns[_campaignId].permissions[receiver] == 2, "receiver not an admin");
    campaigns[_campaignId].balance -= _amount;
    (bool success, ) = msg.sender.call{value: _amount}("");
    require(success, "transfer failed");
  }

  function withdraw(uint256 _campaignId, uint256 _amount) public onlyAdmin(_campaignId) {
    require(campaigns[_campaignId].balance >= _amount, "insufficient balance");
    campaigns[_campaignId].balance -= _amount;
    (bool success, ) = msg.sender.call{value: _amount}("");
    require(success, "transfer failed");
  }


}