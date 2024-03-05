import { Chain } from "@wagmi/core";

export const appName = 'REJUVENATE_AI';
export const communityAddr = '0x3a65168B746766066288B83417329a7F901b5569';


export const shido = {
    id: 9007,
    name: "Shido Testnet",
    network: "Shido",
    nativeCurrency: {
      decimals: 18,
      name: "SHIDO",
      symbol: "SHIDO",
    },
    rpcUrls: {
      public: { http: ["https://rpc-testnet-nodes.shidoscan.com"] },
      default: { http: ["https://rpc-testnet-nodes.shidoscan.com"] },
    },
    blockExplorers: {
      etherscan: { name: "expolorer", url: "https://shidoscan.com" },
      default: { name: "expolorer", url: "https://shidoscan.com" },
    },

  } as const satisfies Chain;