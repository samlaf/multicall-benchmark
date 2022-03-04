const { abi } = require("./AggregatorV3Interface.json");
const ETHUSDpriceFeedAddress = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419";
const ethers = require("ethers");
require("dotenv").config();

const NUM_ROUNDS = process.env.NUM_ROUNDS || 10;

async function main() {
  let provider = new ethers.providers.JsonRpcBatchProvider(
    process.env.INFURA_ETHEREUM_HTTPS
  );
  const priceFeed = new ethers.Contract(ETHUSDpriceFeedAddress, abi, provider);
  const [latestRound] = await priceFeed.latestRoundData();
  const promises = [];
  const before = Date.now();
  for (
    let round = latestRound.sub(NUM_ROUNDS);
    round.lt(latestRound);
    round = round.add(1)
  ) {
    promises.push(priceFeed.getRoundData(round));
  }
  await Promise.all(promises);
  const after = Date.now();
  console.log(
    `Executing a batch request of ${NUM_ROUNDS} requests to chainlink ETHUSD price feed took ${
      after - before
    }s`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
