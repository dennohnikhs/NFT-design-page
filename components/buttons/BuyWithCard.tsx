import React, {
  ComponentProps,
  ComponentPropsWithoutRef,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useContext,
} from 'react'
import { SWRResponse } from 'swr'
import { BuyModal, BuyStep } from '@reservoir0x/reservoir-kit-ui'
import { Button } from 'components/primitives'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { CSS } from '@stitches/react'
import { useMarketplaceChain } from 'hooks'
import { ReferralContext } from '../../context/ReferralContextProvider'
import { Modal } from 'components/common/Modal'
import { CheckoutWithCard } from '@thirdweb-dev/react'
import { thirdwebClientId } from 'config/thirdwebConfig'
import { useSmashNft } from 'context/SmashNFTContext'
import { ConnectWalletButton } from 'components/ConnectWalletButton'

type Props = {
  tokenId?: string
  collectionId?: string
  orderId?: string
  buttonCss?: CSS
  buttonProps?: ComponentProps<typeof Button>
  buttonChildren?: ReactNode
  mutate?: SWRResponse['mutate']
  openState?: ComponentPropsWithoutRef<typeof BuyModal>['openState']
  isBuyWithCardOpen: boolean
  setIsBuyWithCardOpen: Dispatch<SetStateAction<boolean>>
}

const BuyWithCard: FC<Props> = ({
  tokenId,
  collectionId,
  orderId = undefined,
  mutate,
  buttonCss,
  buttonProps = {},
  buttonChildren,
  openState,
  isBuyWithCardOpen,
  setIsBuyWithCardOpen,
}) => {
  const { connectedWallet } = useSmashNft()
  const { openConnectModal } = useConnectModal()
  const marketplaceChain = useMarketplaceChain()
  const { feesOnTop } = useContext(ReferralContext)

  return (
    <Modal
      trigger={
        <Button css={buttonCss} color="primary" {...buttonProps}>
          {buttonChildren}
        </Button>
      }
      title="Buy With Card"
      open={isBuyWithCardOpen}
      onOpenChange={(isOpen: boolean) => setIsBuyWithCardOpen(isOpen)}
    >
      <>
        {!connectedWallet ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '50vh',
            }}
          >
            <ConnectWalletButton />
          </div>
        ) : (
          <CheckoutWithCard
            clientId={thirdwebClientId}
            configs={{
              // email:"uf80902@gmail.com",
              // Registered contract ID
              contractId: '3d11139f-0dca-4ef4-a2cf-d6536f60564b', //reservoir contract ID
              // Buyer wallet address
              // walletAddress:  '0xf3545A1eaD63eD1A6d8b6E63d68D937cdBf1aeE4',
              walletAddress: connectedWallet
                ? connectedWallet.toLowerCase()
                : '',
              contractArgs: {
                // TIP! You can add more than 1 token to the nfts array and we'll accept all of those listings!
                nfts: [
                  { token: `${collectionId}:${tokenId}` },
                  // { token: `COLLECTION_CONTRACT_ADDRESS_2:TOKEN_ID_2` }
                ],
              },
              // Mint method (for custom contracts only)
              // mintMethod: {
              //   name: "claimTo",
              //   args: {
              //     _to: "$WALLET",
              //     _quantity: "$QUANTITY",
              //     _tokenId: 0,
              //   },
              //   payment: {
              //     value: "0.1 * $QUANTITY",
              //     currency: "ETH",
              //   },
              // },
            }}
            onPaymentSuccess={(result) => {
              console.log('Payment successful:', result)

              alert('Payment successful soon will be sent to your account')
              setIsBuyWithCardOpen(false)
            }}
          />
        )}
      </>
    </Modal>
  )
}

export default BuyWithCard
