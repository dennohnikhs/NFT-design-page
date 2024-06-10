import { ListModal, ListStep, useTokens } from '@reservoir0x/reservoir-kit-ui'
import { Button } from 'components/primitives'
import {
  cloneElement,
  ComponentProps,
  ComponentPropsWithoutRef,
  FC,
  ReactNode,
  useContext,
} from 'react'
import { CSS } from '@stitches/react'
import { SWRResponse } from 'swr'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { ToastContext } from 'context/ToastContextProvider'
import { useMarketplaceChain } from 'hooks'
import { NEXT_PUBLIC_MARKETPLACE_FEE } from 'smash.config'
import {  useSmashNft } from 'context/SmashNFTContext'

const orderFee = NEXT_PUBLIC_MARKETPLACE_FEE

type ListingCurrencies = ComponentPropsWithoutRef<
  typeof ListModal
>['currencies']

type Props = {
  token?: ReturnType<typeof useTokens>['data'][0]
  buttonCss?: CSS
  buttonChildren?: ReactNode
  buttonProps?: ComponentProps<typeof Button>
  mutate?: SWRResponse['mutate']
}

const List: FC<Props> = ({
  token,
  buttonCss,
  buttonChildren,
  buttonProps,
  mutate,
}) => {
  const { isDisconnected ,connectedWallet,isInAppWallet} = useSmashNft()
  const { openConnectModal } = useConnectModal()
  const { addToast } = useContext(ToastContext)

  const marketplaceChain = useMarketplaceChain()

  // const { data: signer } = useWalletClient()

  const listingCurrencies: ListingCurrencies =
    marketplaceChain.listingCurrencies
  const tokenId = token?.token?.tokenId
  const contract = token?.token?.contract

  const trigger = (
    <Button css={buttonCss} color="primary" {...buttonProps}>
      {buttonChildren}
    </Button>
  )

  const orderFees = orderFee ? [orderFee] : []

  if (isDisconnected) {
    return cloneElement(trigger, {
      onClick: async () => {
        if (!connectedWallet) {
          openConnectModal?.()
        }
      },
    })
  } else
    return (

      <>
       {
        ! isInAppWallet &&
        
        <ListModal
        trigger={trigger}
        nativeOnly={true}
        collectionId={contract}
        tokenId={tokenId}
        feesBps={orderFees}
        enableOnChainRoyalties={true}
        currencies={listingCurrencies}
        chainId={marketplaceChain.id}
        onClose={(data, stepData, currentStep) => {
          if (mutate && currentStep == ListStep.Complete) mutate()
        }}
        onListingError={(err: any) => {
          if (err?.code === 4001) {
            addToast?.({
              title: 'User canceled transaction',
              description: 'You have canceled the transaction.',
            })
            return
          }
          addToast?.({
            title: 'Could not list token',
            description: 'The transaction was not completed.',
          })
        }}
      />
        }
      </>
      
    )
}

export default List
