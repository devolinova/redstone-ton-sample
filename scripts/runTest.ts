import { TonPricesContractConnector, BlueprintTonNetwork, config } from "@redstone-finance/ton-connector";
import { requestDataPackages, ContractParamsProvider, getDataServiceIdForSigner, getOracleRegistryState, getSignersForDataServiceId } from "@redstone-finance/sdk";
import { recoverSignerAddress, SignedDataPackage } from "@redstone-finance/protocol";
import { NetworkProvider } from "@ton/blueprint";

export async function run(provider: NetworkProvider) {
  const contract = await new TonPricesContractConnector(
    new BlueprintTonNetwork(provider, config),
    "EQBP4yZgqut-1JsfRB8PNZqFnr5VzvWXBqX2BppTnS6IAHkk"
  ).getAdapter();

  const paramsProvider = new ContractParamsProvider({
    dataServiceId: "redstone-avalanche-prod",
    uniqueSignersCount: 1,
    dataPackagesIds: ["ETH", "BTC", "USDT"],
  });

  const dataPackages = await requestDataPackages(paramsProvider.requestParams);

  const oracleRegistry = await getOracleRegistryState();
  const redstonePrimaryNodesAddresses = getSignersForDataServiceId(oracleRegistry, "redstone-avalanche-prod");
  
  console.log(redstonePrimaryNodesAddresses)

  console.log(getDataServiceIdForSigner(oracleRegistry, '0xdEB22f54738d54976C4c0fe5ce6d408E40d88499'))

  console.log(dataPackages);
  const dataPackage = dataPackages["ETH"];
  console.log(dataPackage);
  
  if (dataPackage && dataPackage.length > 0) {
    const signerAddress = dataPackage[0].recoverSignerAddress();
    console.log(signerAddress);
  } else {
    console.error('dataPackage is undefined or empty');
  }











  console.log(paramsProvider.getPayloadData())
  console.log(paramsProvider.requestParams)
  console.log(paramsProvider.getDataFeedIds())


  console.log(await contract.getPricesFromPayload(paramsProvider));
 
  // const timestamp: number = await contract.readTimestampFromContract();

  // // Create a Date object from the timestamp
  // const date = new Date(timestamp);

  // // Convert to local time string
  // const localTimeString = date.toLocaleString();

  // console.log(localTimeString);


  // console.log(await contract.readPricesFromContract(paramsProvider));

  // console.log(await contract.writePricesFromPayloadToContract(paramsProvider))

}
