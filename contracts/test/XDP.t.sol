// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test} from "forge-std/Test.sol";
import {DeployAll, DeployParams, DeployInstance} from "script/dependency/DeployAll.sol";
import {IXDP} from "src/interfaces/IXDP.sol";
import {IERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SigUtils} from "./utils/SigUtils.sol";

interface IERC20WithPermit is IERC20, IERC20Permit {}

contract XDPTest is Test {
    IXDP xdp;
    IERC20WithPermit usdx;

    address public campaignOwner = address(0x1);
    address public campaignMember = address(0x2);
    address public donator;
    uint256 public donatorPK;
    function setUp() public {
        // Set up contracts
        DeployInstance memory instance = DeployAll.deploy(DeployParams({
            usdxInitialSupply: 100
        }));
        xdp = IXDP(instance.xdp);
        usdx = IERC20WithPermit(instance.usdx);

        // Set up donator
        donatorPK = uint256(keccak256(abi.encodePacked("user")));
        donator = vm.addr(donatorPK);
    }

    function testCreateCampaign() public {
        vm.startPrank(campaignOwner);

        bytes32 campaignUid = xdp.createCampaign("test");
        assertEq(xdp.getStatus(campaignUid), 1, "Campaign1 should be active");

        bytes32 campaignUid2 = xdp.createCampaign("test");
        assertEq(xdp.getStatus(campaignUid2), 1, "Campaign2 should be active");

        assertNotEq(campaignUid, campaignUid2, "Campaign Uid should be unique");

        // Add member
        xdp.addMember(campaignUid, campaignMember);
        assertEq(xdp.getPermissions(campaignUid, campaignMember), 1, "Campaign1 member should be 1");

        // Remove member
        xdp.removeMember(campaignUid, campaignMember);
        assertEq(xdp.getPermissions(campaignUid, campaignMember), 0, "Campaign1 member should be 0");

        vm.stopPrank(); 

        vm.expectRevert();
        xdp.addMember(campaignUid, campaignMember);

        assertEq(xdp.getPermissions(campaignUid, campaignOwner), 2, "Campaign1 balance should be 0");
    }

    function testDisableCampaign() public {
        vm.startPrank(campaignOwner);
        bytes32 campaignUid = xdp.createCampaign("test");

        // External user can't disable campaign
        vm.startPrank(donator);
        vm.expectRevert("XDP: Only admin");
        xdp.disableCampaign(campaignUid);
        vm.stopPrank();

        // Normal member can't disable campaign
        vm.startPrank(campaignOwner);
        xdp.addMember(campaignUid, campaignMember);

        vm.startPrank(campaignMember);
        vm.expectRevert("XDP: Only admin");
        xdp.disableCampaign(campaignUid);
        vm.stopPrank();

        vm.prank(campaignOwner);
        xdp.disableCampaign(campaignUid);
        assertEq(xdp.getStatus(campaignUid), 0, "Campaign1 should be disabled");
        vm.stopPrank();
    }


    function testDonation() public {
        usdx.transfer(donator, 10);
        assertEq(usdx.balanceOf(address(xdp)), 0, "XDP balance should be 0");
        assertEq(usdx.balanceOf(address(donator)), 10, "donator balance should be 10");

        vm.prank(campaignOwner);
        bytes32 campaignUid = xdp.createCampaign("test");
        
        assertEq(usdx.nonces(donator), 0);

        vm.startPrank(donator);
                
        SigUtils sigUtils = new SigUtils(usdx.DOMAIN_SEPARATOR());
        SigUtils.Permit memory permit = SigUtils.Permit({
            owner: donator,
            spender: address(xdp),
            value: 1, // ether is just unit
            nonce: usdx.nonces(campaignOwner),
            deadline: block.timestamp + 1 hours
        });
        bytes32 digest = sigUtils.getTypedDataHash(permit);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(donatorPK, digest);
        
        xdp.donateWithPermit(campaignUid, permit.value, permit.deadline, v, r, s);

        assertEq(usdx.nonces(donator), 1);
        assertEq(usdx.balanceOf(address(xdp)), 1, "XDP balance should be 1");
        assertEq(xdp.getBalance(campaignUid), 1, "Campaign1 balance should be 1e6");

        vm.stopPrank();
    }
}
