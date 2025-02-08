// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CulturaMini {
    // Events
    event MemeRegistered(
        address indexed user,
        string ipfsCID,
        uint256 timestamp
    );

    // Structs
    struct Meme {
        string ipfsCID;
        uint256 timestamp;
        bool exists;
    }

    // Mappings
    mapping(address => Meme[]) public userMemes;

    // Functions
    function registerMeme(string memory ipfsCID) public {
        Meme memory newMeme = Meme({
            ipfsCID: ipfsCID,
            timestamp: block.timestamp,
            exists: true
        });

        userMemes[msg.sender].push(newMeme);

        emit MemeRegistered(msg.sender, ipfsCID, block.timestamp);
    }

    function getUserMemes(address user) public view returns (Meme[] memory) {
        return userMemes[user];
    }
}
