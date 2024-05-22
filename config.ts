const CONFIG = {
    polygon: {
      rpcUrl: 'https://polygon-rpc.com',
      oftContract: '0x9e20461bc2c4c980f62f1B279D71734207a6A356',
      chainId: 137,
      layerZeroChainId: 109,
      chainName: 'Polygon Mainnet',
      nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18,
      },
      blockExplorerUrls: ['https://polygonscan.com/'],
    },
    arbitrum: {
      rpcUrl: 'https://arb1.arbitrum.io/rpc',
      oftContract: '0x9e20461bc2c4c980f62f1B279D71734207a6A356',
      chainId: 42161,
      layerZeroChainId: 110,
      chainName: 'Arbitrum Mainnet',
      nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
      },
      blockExplorerUrls: ['https://arbiscan.io/'],
    },
  };
  
  export default CONFIG;