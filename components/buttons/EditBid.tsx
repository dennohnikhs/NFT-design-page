import { useConnectModal } from '@rainbow-me/rainbowkit'
import { Button } from 'components/primitives'
import { ToastContext } from 'context/ToastContextProvider'
import { useMarketplaceChain } from 'hooks'
import { cloneElement, ComponentProps, FC, ReactNode, useContext } from 'react'
import { CSS } from '@stitches/react'
import { SWRResponse } from 'swr'
import { EditBidModal, EditBidStep } from '@reservoir0x/reservoir-kit-ui'
import {  useSmashNft } from 'context/SmashNFTContext'

type Props = {
  bidId?: string
  tokenId?: string
  collectionId?: string
  disabled?: boolean
  openState?: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  buttonCss?: CSS
  buttonProps?: ComponentProps<typeof Button>
  buttonChildren?: ReactNode
  mutate?: SWRResponse['mutate']
}

const EditBid: FC<Props> = ({
  bidId,
  tokenId,
  collectionId,
  disabled,
  openState,
  buttonCss,
  buttonProps,
  buttonChildren,
  mutate,
}) => {
  const { isDisconnected,connectedWallet } = useSmashNft()
  const { openConnectModal } = useConnectModal()
  const { addToast } = useContext(ToastContext)
  const marketplaceChain = useMarketplaceChain()

  // const { data: signer } = useWalletClient()

  const trigger = (
    <Button css={buttonCss} disabled={disabled} {...buttonProps} color="gray3">
      {buttonChildren}
    </Button>
  )

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
      <EditBidModal
        trigger={trigger}
        openState={openState}
        bidId={bidId}
        tokenId={tokenId}
        collectionId={collectionId}
        chainId={marketplaceChain.id}
        onClose={(data, currentStep) => {
          if (mutate && currentStep == EditBidStep.Complete) mutate()
        }}
        onEditBidError={(error: any) => {
          if (error?.code === 4001) {
            addToast?.({
              title: 'User canceled transaction',
              description: 'You have canceled the transaction.',
            })
            return
          }
          addToast?.({
            title: 'Could not edit offer',
            description: 'The transaction was not completed.',
          })
        }}
      />
    )
}

export default EditBid
