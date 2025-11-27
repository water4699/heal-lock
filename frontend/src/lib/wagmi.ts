import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { hardhat, sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'HealLock',
  projectId: 'ef3325a718834a2b1b4134d3f520933d',
  chains: [hardhat, sepolia],
  ssr: false,
});

