//////////////////////////////////////////////////////////////////////////
//
// WARNING!!
// ALWAYS USE DYNAMIC IMPORT FOR THIS FILE TO AVOID INCLUDING THE ENTIRE
// FHEVM MOCK LIB IN THE FINAL PRODUCTION BUNDLE!!
//
//////////////////////////////////////////////////////////////////////////

import { MockFhevmInstance } from "@fhevm/mock-utils";
import type { FhevmInstance } from "@zama-fhe/relayer-sdk/bundle";

export const fhevmMockCreateInstance = async (parameters: {
  rpcUrl: string;
  chainId: number;
  metadata: {
    ACLAddress: `0x${string}`;
    InputVerifierAddress: `0x${string}`;
    KMSVerifierAddress: `0x${string}`;
  };
}): Promise<FhevmInstance> => {
  const { JsonRpcProvider } = await import("ethers");
  const provider = new JsonRpcProvider(parameters.rpcUrl);
  const instance = await MockFhevmInstance.create(provider, provider, {
    aclContractAddress: parameters.metadata.ACLAddress,
    chainId: parameters.chainId,
    gatewayChainId: 55815,
    inputVerifierContractAddress: parameters.metadata.InputVerifierAddress,
    kmsContractAddress: parameters.metadata.KMSVerifierAddress,
    verifyingContractAddressDecryption:
      "0x5ffdaAB0373E62E2ea2944776209aEf29E631A64",
    verifyingContractAddressInputVerification:
      "0x812b06e1CDCE800494b79fFE4f925A504a9A9810",
  });

  // Override the createEIP712 method to fix ethers v6 compatibility
  instance.createEIP712 = (
    publicKey: Uint8Array | string,
    contractAddresses: `0x${string}`[],
    startTimestamp: string,
    durationDays: string
  ) => {
    // Convert publicKey to proper hex format
    let publicKeyHex: string;
    if (publicKey instanceof Uint8Array) {
      // Validate and limit publicKey length to prevent issues
      const maxLength = 128; // Reasonable max length for public key
      const keyArray = publicKey.length > maxLength 
        ? publicKey.slice(0, maxLength) 
        : publicKey;
      
      if (publicKey.length > maxLength) {
        console.warn(`[FHEVM Mock] publicKey length ${publicKey.length} exceeds max ${maxLength}, truncating`);
      }
      
      publicKeyHex = "0x" + Array.from(keyArray)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    } else if (typeof publicKey === 'string') {
      // If already a string, ensure it has 0x prefix
      publicKeyHex = publicKey.startsWith('0x') ? publicKey : `0x${publicKey}`;
    } else {
      throw new Error(`Invalid publicKey type: ${typeof publicKey}`);
    }

    return {
      domain: {
        name: "FHEVM",
        version: "1",
        chainId: parameters.chainId,
        verifyingContract: contractAddresses[0],
      },
      types: {
        UserDecryptRequestVerification: [
          { name: "publicKey", type: "bytes" },
          { name: "contractAddresses", type: "address[]" },
          { name: "contractsChainId", type: "uint256" },
          { name: "startTimestamp", type: "uint256" },
          { name: "durationDays", type: "uint256" },
          { name: "extraData", type: "bytes" },
        ],
      },
      primaryType: "UserDecryptRequestVerification",
      message: {
        publicKey: publicKeyHex,
        contractAddresses,
        contractsChainId: parameters.chainId,
        startTimestamp: parseInt(startTimestamp),
        durationDays: parseInt(durationDays),
        extraData: "0x",
      },
    };
  };

  return instance;
};