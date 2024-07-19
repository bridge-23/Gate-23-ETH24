// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract Bridge23Nft is ERC1155, Ownable {
    using EnumerableSet for EnumerableSet.UintSet;

    mapping(uint256 => string) private tokenUris;
    mapping(address => EnumerableSet.UintSet) private holdTokenIds;
    uint256 public tokenId;

    constructor() ERC1155("") {
        tokenId = 1;
    }

    function uri(
        uint256 _tokenId
    ) public view virtual override returns (string memory) {
        return tokenUris[_tokenId];
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId,
        uint256 _amount
    ) external {
        _safeTransferFrom(_from, _to, _tokenId, _amount, "");
    }

    function transferBatchFrom(
        address _from,
        address _to,
        uint256[] memory _tokenIds,
        uint256[] memory _amounts
    ) external {
        require(_tokenIds.length == _amounts.length, "INVALID_LENGTH_PARAM");
        _safeBatchTransferFrom(_from, _to, _tokenIds, _amounts, "");
    }

    function mint(
        address _to,
        uint256 _amount,
        string memory _metaUri
    ) external onlyOwner {
        _mint(_to, tokenId, _amount, "");
        tokenUris[tokenId++] = _metaUri;
    }

    function mintBatch(
        address _to,
        uint256[] memory _amounts,
        string[] memory _metaUris
    ) external onlyOwner {
        uint256 length = _amounts.length;
        require(length == _metaUris.length, "MISMATCHED_ARRAY_LENGTH");
        uint256[] memory ids = new uint256[](length);
        for (uint256 i = 0; i < length; i++) {
            tokenUris[tokenId] = _metaUris[i];
            ids[i] = tokenId++;
        }

        _mintBatch(_to, ids, _amounts, "");
    }

    function getHoldTokenIds(
        address _user
    ) external view returns (uint256[] memory) {
        return holdTokenIds[_user].values();
    }

    function _afterTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal virtual override {
        uint256 length = ids.length;
        for (uint256 i = 0; i < length; i++) {
            uint256 id = ids[i];
            _updateHolderIds(from, id);
            _updateHolderIds(to, id);
        }
    }

    function _updateHolderIds(address _user, uint256 _id) internal {
        if (_user == address(0)) {
            return;
        }

        if (balanceOf(_user, _id) > 0) {
            if (holdTokenIds[_user].contains(_id) == false) {
                holdTokenIds[_user].add(_id);
            }
        } else {
            if (holdTokenIds[_user].contains(_id) == true) {
                holdTokenIds[_user].remove(_id);
            }
        }
    }
}
