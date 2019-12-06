pragma solidity >=0.4.21 <0.6.0;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

contract StarNotary is ERC721 {

    struct Star {
        string name;
    }

    string public constant name = "Star Notary Token";
    string public constant symbol = "SNT";

    mapping(uint256 => Star) public tokenIdToStarInfo;
    mapping(uint256 => uint256) public starsForSale;
    mapping(address => uint256) public sellersCredit;

    function createStar(string memory _name, uint256 _tokenId) public {
        Star memory newStar = Star(_name);

        tokenIdToStarInfo[_tokenId] = newStar;

        _mint(msg.sender, _tokenId);
        emit Transfer(address(0), msg.sender, _tokenId);
    }

    function lookUpStarInfo(uint256 _tokenId) public view returns (string memory _starName) {
        _starName = tokenIdToStarInfo[_tokenId].name;
    }

    function transferMyStar(address to, uint256 _tokenId) public {
        transferFrom(msg.sender, to, _tokenId);
    }

    // Two users can exchance stars, regardless of price.
    // TO-DO: Add confirmation requirement from owner2.
    function exchangeStars(uint256 _tokenId1, address _owner2, uint256 _tokenId2) public {
        require(ownerOf(_tokenId1) == msg.sender, "Sender must be owner of the first star inputted.");
        require(ownerOf(_tokenId2) == _owner2, "Owner 2, second fn argument, must be owner of star 2, third fn argument");

        transferFrom(msg.sender, _owner2, _tokenId1);
        transferFrom(_owner2, msg.sender, _tokenId2);
    }

    function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
        require(ownerOf(_tokenId) == msg.sender, "Sender does not own this star.");
        require(_price > 0, "Sale price must be greater than 0");

        starsForSale[_tokenId] = _price;
    }

    function buyStar(uint256 _tokenId) public payable {
        uint256 starPrice = starsForSale[_tokenId];
        address starOwner = ownerOf(_tokenId);
        require(msg.value >= starPrice, "Star's price was not met by the value sent in the transaction.");

        _transferFrom(starOwner, msg.sender, _tokenId);

        sellersCredit[starOwner] = starPrice;

        if(msg.value > starPrice) {
            msg.sender.transfer(msg.value - starPrice);
        }
        starsForSale[_tokenId] = 0;
    }

    function withdrawCredit() public {
      require(sellersCredit[msg.sender] > 0, "You have no credit from star sales");
      msg.sender.transfer(sellersCredit[msg.sender]);
    }

}
