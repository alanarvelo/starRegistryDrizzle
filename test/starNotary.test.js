const StarNotary = artifacts.require("StarNotary")

contract('StarNotary', accounts => {

  let instance;
  let user1;
  let user2;

  beforeEach(async () => {
    instance = await StarNotary.deployed();
    user1 = accounts[1];
    user2 = accounts[2];
  })

  it('can Create a Star', async() => {
    let starId = 1;
    await instance.createStar('Awesome Star!', starId, {from: accounts[0]})
    assert.equal(await instance.tokenIdToStarInfo.call(starId), 'Awesome Star!')
  });

  // The token name and token symbol are added properly.
  it('Token Name and Symbol are correctly set', async() => {
    assert.equal(await instance.name.call(), "Star Notary Token")
    assert.equal(await instance.symbol.call(), "SNT")
  });

  // Two users can exchange their stars, with mutual consent.
  it('user1 and user2 can exchange their stars', async() => {
    let starId1 = 11
    let starId2 = 22
    await instance.createStar('awesome star 1', starId1, {from: user1})
    await instance.createStar('awesome star 2', starId2, {from: user2})

    await instance.approve(user1, starId2, {from: user2})

    await instance.exchangeStars(starId1, user2, starId2, {from: user1});
    assert.equal(await instance.ownerOf.call(starId1), user2);
    assert.equal(await instance.ownerOf.call(starId2), user1);
  });

  // Stars Tokens can be transferred from one address to another.
  it('user1 can transfer tokens to another user', async() => {
    let starId = 2
    await instance.createStar('awesome star 6', starId, {from: user1})
    
    await instance.transferMyStar(user2, starId, {from: user1});
    assert.equal(await instance.ownerOf.call(starId), user2);
  })

  describe("Buy & Sale", () => {
    it('lets user1 put up their star for sale', async() => {
      let user1 = accounts[1]
      let starId = 3
      let starPrice = web3.utils.toWei(".01", "ether")
      await instance.createStar('awesome star', starId, {from: user1})
      await instance.putStarUpForSale(starId, starPrice, {from: user1})
      assert.equal(await instance.starsForSale.call(starId), starPrice)
    });

    it('user1 gets credit after the sale', async() => {
      let starId = 4
      let starPrice = web3.utils.toWei(".01", "ether")
      await instance.createStar('awesome star', starId, {from: user1})
      await instance.putStarUpForSale(starId, starPrice, {from: user1})

      await instance.buyStar(starId, {from: user2, value: starPrice})
      let user1Credit = await instance.sellersCredit.call(user1);
      assert.equal(user1Credit, starPrice)
    });

    it('user1 can withdrawal credit after the sale', async() => {
      let starId = 5
      let starPrice = web3.utils.toWei(".01", "ether")
      await instance.createStar('awesome star', starId, {from: user1})
      await instance.putStarUpForSale(starId, starPrice, {from: user1})
      let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user1)

      await instance.buyStar(starId, {from: user2, value: starPrice})
      await instance.withdrawCredit({from: user1});

      let balanceOfUser1AfterTransaction = await web3.eth.getBalance(user1)
      
      assert(balanceOfUser1BeforeTransaction < balanceOfUser1AfterTransaction);
    });

    it('lets user2 buy a star, if it is put up for sale', async() => {
      let starId = 6
      let starPrice = web3.utils.toWei(".01", "ether")

      await instance.createStar('awesome star', starId, {from: user1})
      await instance.putStarUpForSale(starId, starPrice, {from: user1})

      await instance.buyStar(starId, {from: user2, value: starPrice});

      assert.equal(await instance.ownerOf.call(starId), user2);
    });

    it('lets user2 buy a star and decreases its balance in ether', async() => {
      let starId = 7
      let starPrice = web3.utils.toWei(".01", "ether")
      await instance.createStar('awesome star', starId, {from: user1})
      await instance.putStarUpForSale(starId, starPrice, {from: user1})
      const balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2)

      await instance.buyStar(starId, {from: user2, value: starPrice})
      const balanceAfterUser2BuysStar = await web3.eth.getBalance(user2)

      assert(balanceOfUser2BeforeTransaction > balanceAfterUser2BuysStar)
    });
  })

});