const bridgeInContract = [
  {
      constant: false,
      inputs: [
          { name: "from", type: "address" },
          { name: "dstChainId", type: "uint16" },
          { name: "to", type: "bytes" },
          { name: "amount", type: "uint256" },
          { name: "refundAddress", type: "address" },
          { name: "zroPaymentAddress", type: "address" },
          { name: "adapterParams", type: "bytes" },
      ],
      name: "sendFrom",
      outputs: [],
      payable: true,
      stateMutability: "payable",
      type: "function",
  },
];

export default bridgeInContract;
