import { useConnectModal } from '@rainbow-me/rainbowkit'
import {
  CancelListingModal,
  CancelListingStep,
} from '@reservoir0x/reservoir-kit-ui'
import { FC, ReactElement, useContext, cloneElement } from 'react'
import { SWRResponse } from 'swr'
import { ToastContext } from '../../context/ToastContextProvider'
import { useMarketplaceChain } from 'hooks'
import { useSmashNft } from 'context/SmashNFTContext'

type Props = {
  listingId: string
  openState?: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  trigger: ReactElement<any>
  mutate?: SWRResponse['mutate']
}

const CancelListing: FC<Props> = ({
  listingId,
  openState,
  trigger,
  mutate,
}) => {
  const { addToast } = useContext(ToastContext)
  const { openConnectModal } = useConnectModal()
  const marketplaceChain = useMarketplaceChain()
  const { connectedWallet } = useSmashNft()

  // const { data: signer } = useWalletClient()

  if (!connectedWallet) {
    return cloneElement(trigger, {
      onClick: async () => {
        if (!connectedWallet) {
          openConnectModal?.()
        }
      },
    })
  }

  return (
    <CancelListingModal
      listingId={listingId}
      openState={openState}
      trigger={trigger}
      chainId={marketplaceChain.id}
      onCancelComplete={(data: any) => {
        addToast?.({
          title: 'User canceled listing',
          description: 'You have canceled the listing.',
        })
      }}
      onCancelError={(error: any, data: any) => {
        console.log('Listing Cancel Error', error, data)
        addToast?.({
          title: 'Could not cancel listing',
          description: 'The transaction was not completed.',
        })
      }}
      onClose={(data, currentStep) => {
        if (mutate && currentStep == CancelListingStep.Complete) mutate()
      }}
    />
  )
}

export default CancelListing
