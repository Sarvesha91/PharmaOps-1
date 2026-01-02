// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract PharmaProvenance {
    event DocumentAnchored(bytes32 indexed documentHash, string versionId, uint256 timestamp);
    event ShipmentEvent(bytes32 indexed shipmentId, string eventType, uint256 timestamp);

    mapping(bytes32 => uint256) public documentLedger;

    function anchorDocument(bytes32 documentHash, string calldata versionId) external {
        documentLedger[documentHash] = block.timestamp;
        emit DocumentAnchored(documentHash, versionId, block.timestamp);
    }

    function recordShipment(bytes32 shipmentId, string calldata eventType) external {
        emit ShipmentEvent(shipmentId, eventType, block.timestamp);
    }
}

