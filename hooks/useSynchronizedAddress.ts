import { useEffect, useState } from 'react';
import { useAccount as useWagmiAccount, useConnect, useDisconnect, useWalletClient, useNetwork, useSwitchNetwork } from 'wagmi';
import useMarketplaceChain from './useMarketplaceChain';
import { useActiveWallet, useSetActiveWallet, useActiveAccount as useThirdwebAddress  } from 'thirdweb/react';
import { thirdwebClient } from 'config/thirdwebConfig';
import { createWalletAdapter } from 'thirdweb/wallets';
import { viemAdapter } from 'thirdweb/adapters/viem';
import { defineChain } from 'thirdweb';

const useSynchronizedAddress = (): string | null => {
  const thirdwebAddress = useThirdwebAddress();
  const thirdwebActiveWallet = useActiveWallet();
  const isInAppWallet:boolean = thirdwebActiveWallet? thirdwebActiveWallet.id === "inApp" : false;

  const { address: wagmiAddress, isConnected } = useWagmiAccount();

  const marketplaceChain = useMarketplaceChain()
  const { connect, connectors } = useConnect();
  const {disconnect:disconnectWagmi} = useDisconnect()
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    // console.log("thirdwebAddress",{thirdwebAddress});
    if (!isConnected  && thirdwebAddress) {

      const injectedConnector = connectors.find(connector => connector.id === 'injected');
      // const walletConnectConnector = connectors.find(connector => connector.id === 'walletConnect');
      if (injectedConnector && !isInAppWallet) {

        connect({
            chainId:marketplaceChain?.id,
            connector:injectedConnector
        });
      }
      if (isInAppWallet) {
        console.error("INAPP Wallet Connected");
        //WAGMI + IN APP WALLET Connection Code Here


      }
    }

    //if thirdweb disconnects
    if (!thirdwebAddress ) {
      disconnectWagmi()
    }
    setAddress(thirdwebAddress? thirdwebAddress.address : null );
  }, [thirdwebAddress, isConnected, connect, connectors,isInAppWallet]);


  //chain change
  useEffect(() => {
    if (isConnected && thirdwebAddress && !isInAppWallet ) {
      const injectedConnector = connectors.find(connector => connector.id === 'injected');
      if (injectedConnector) {
        connect({
            chainId:marketplaceChain?.id,
            connector:injectedConnector
        });
      }
    }

    setAddress(thirdwebAddress? thirdwebAddress.address : null );
  }, [thirdwebAddress, isConnected,marketplaceChain]);


  // Assumes you've wrapped your application in a `<ThirdwebProvider>`
const { data: walletClient } = useWalletClient(); // from wagmi
const { disconnectAsync } = useDisconnect(); // from wagmi
const { switchNetworkAsync } = useSwitchNetwork(); // from wagmi
const setActiveWallet = useSetActiveWallet(); // from thirdweb/react
useEffect(() => {
  const setActive = async () => {
    if (walletClient) {
      // adapt the walletClient to a thirdweb account
      const adaptedAccount = viemAdapter.walletClient.fromViem({
        walletClient: walletClient as any, // accounts for wagmi/viem version mismatches
      });
      // create the thirdweb wallet with the adapted account
      const thirdwebWallet = createWalletAdapter({
        client:thirdwebClient,
        adaptedAccount,
        chain: defineChain(await walletClient.getChainId()),
        onDisconnect: async () => {
          await disconnectAsync();
        },
        switchChain: async (chain) => {
          await switchNetworkAsync?.(chain.id as number);
        },
      });
      setActiveWallet(thirdwebWallet);
    }
  };
  setActive();
}, [walletClient]);


  return address;
};

export default useSynchronizedAddress;
