const { MultiCall } = require("@indexed-finance/multicall");
const { abi } = require("./AggregatorV3Interface.json");
const ETHUSDpriceFeedAddress = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419";
const ethers = require("ethers");
require("dotenv").config();

const NUM_ROUNDS = process.env.NUM_ROUNDS || 10;

async function main() {
  let provider = new ethers.providers.JsonRpcProvider(
    process.env.INFURA_ETHEREUM_HTTPS
  );
  const multi = new MultiCall(provider);
  const inputs = [];
  const priceFeed = new ethers.Contract(ETHUSDpriceFeedAddress, abi, provider);
  latestRound = (await priceFeed.latestRoundData())[0];
  for (
    let round = latestRound.sub(NUM_ROUNDS);
    round.lt(latestRound);
    round = round.add(1)
  ) {
    inputs.push({
      target: ETHUSDpriceFeedAddress,
      function: "getRoundData",
      args: [round.toString()],
    });
  }
  const before = Date.now();
  const roundData = await multi.multiCall(abi, inputs);
  const after = Date.now();
  console.log(
    `Multicall of ${NUM_ROUNDS} calls to chainlink ETHUSD price feed took ${
      after - before
    }s`
  );
  return roundData;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
