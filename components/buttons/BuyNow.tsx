import React, {
  ComponentProps,
  ComponentPropsWithoutRef,
  FC,
  ReactNode,
  useContext,
} from 'react'
import { SWRResponse } from 'swr'
import { BuyModal, BuyStep } from '@reservoir0x/reservoir-kit-ui'
import { Button } from 'components/primitives'
// import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useConnectModal } from "thirdweb/react";
import { CSS } from '@stitches/react'
import { useMarketplaceChain } from 'hooks'
import { ReferralContext } from '../../context/ReferralContextProvider'
import { useSmashNft } from 'context/SmashNFTContext'
// import {  ConnectButton,openConnectModal } from "thirdweb/react";
// import { thirdwebClient } from 'config/thirdwebConfig'
import { getClient, Execute } from '@reservoir0x/reservoir-sdk'
import { createWalletClient, custom, http } from 'viem'
import { getUserEmail } from 'thirdweb/wallets/in-app'
import { thirdwebClient, thirdwebClientId } from 'config/thirdwebConfig'
import { TransactionButton } from 'thirdweb/react'
import { inAppWallet, useSigner } from '@thirdweb-dev/react'
import { EmbeddedWallet } from '@thirdweb-dev/wallets'
import { Ethereum } from '@thirdweb-dev/chains'
import { useWalletClient } from 'wagmi'
import useSynchronizedAddress from 'hooks/useSynchronizedAddress'
import { ethers } from 'ethers'

type Props = {
  tokenId?: string
  collectionId?: string
  orderId?: string
  buttonCss?: CSS
  buttonProps?: ComponentProps<typeof Button>
  buttonChildren?: ReactNode
  mutate?: SWRResponse['mutate']
  openState?: ComponentPropsWithoutRef<typeof BuyModal>['openState']
}

const BuyNow: FC<Props> = ({
  tokenId,
  collectionId,
  orderId = undefined,
  mutate,
  buttonCss,
  buttonProps = {},
  buttonChildren,
  openState,
}) => {
  // const { openConnectModal } = useConnectModal()
  const { connect, isConnecting } = useConnectModal();
  const { connectedWallet,isInAppWallet, signerTest,thirdwebConnectModalConfig } = useSmashNft()
  const marketplaceChain = useMarketplaceChain()


  const { feesOnTop } = useContext(ReferralContext)

  const { data: signer } = useWalletClient({
    chainId: marketplaceChain?.id,
  })

  // console.log({ signer, connectedWallet })

  const openThirdwebConnectModal = async () => {
    try {
      
      const wallet = await connect(thirdwebConnectModalConfig); // opens the connect modal
      console.log("connected to", wallet);
    } catch (error) {
      console.log("error connecting to wallet");
      
    }
  }



  const testHandle = async () => {
    // const wallet = new EmbeddedWallet({
    //   chain: Ethereum, //  chain to connect to
    //   clientId: thirdwebClientId, // client ID
    // });

    // const authResult = await wallet.authenticate({
    //   strategy: "google",
    // });
const provider = new ethers.providers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/GtV6Mq5x8UTi3UvxtL6VPfBAhJYPfuf8')
    // const walletAddress = await wallet.connect({ authResult });
    // console.log("Connected as", walletAddress);
    const signer = createWalletClient({
      chain: marketplaceChain,
      account: connectedWallet as `0x${string}`,
      // transport: custom(provider as any),
      transport: http(provider as any),

    })

    const email = await getUserEmail({ client: thirdwebClient })
    console.log({ email })
    const reservoirClient = getClient()
    reservoirClient?.actions.buyToken({
      items: [{ token: `${collectionId}:${tokenId}` }],
      wallet: signerTest as any,
      onProgress: (steps: any) => {
        console.log(steps)
      },
      options:{
        taker:connectedWallet as `0x${string}`
      }
    })
  }

  return (
    <>
    {
      isInAppWallet &&
      <Button onClick={testHandle}>{buttonChildren} </Button>

    }
      {/* <TransactionButton
        transaction={() => {
          if (!connectedWallet) {
            return alert("Please connect your wallet");
          }
          return claimTo({
            contract,
            to: connectedWallet,
            quantity: 1,
          });
        }}
      >
        Claim NFT
      </TransactionButton> */}
      {
        !isInAppWallet &&
      <BuyModal
        trigger={
          <Button css={buttonCss} color="primary" {...buttonProps}>
            {buttonChildren}
          </Button>
        }
        tokenId={tokenId}
        collectionId={collectionId}
        orderId={orderId}
        openState={openState}
        onConnectWallet={() => {
          openThirdwebConnectModal()
        }}
        //CONFIGURABLE: set any fees on top of orders, note that these will only
        // apply to native orders (using the reservoir order book) and not to external orders (opensea, blur etc)
        // Refer to our docs for more info: https://docs.reservoir.tools/reference/sweepmodal-1
        // feesOnTopBps={["0xabc:50"]}
        feesOnTopUsd={feesOnTop}
        chainId={marketplaceChain.id}
        onClose={(data, stepData, currentStep) => {
          if (mutate && currentStep == BuyStep.Complete) mutate()
        }}
        onPurchaseError={(error, data) => {
          console.log('Purchase Error', { error, data })
        }}
      />
      }
    </>
  )
}

export default BuyNow
