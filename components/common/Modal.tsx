import React, {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  ReactNode,
} from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose, faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { Anchor, Button, Flex, Text, Box } from '../primitives'
import { styled } from '../../stitches.config'
import { Dialog } from '../primitives/Dialog'
import LoadingSpinner from './LoadingSpinner'
import ReservoirLogoWhiteText from 'public/ReservoirLogoWhiteText'

const Title = styled(DialogPrimitive.Title, {
  margin: 0,
})

type Props = {
  title?: string
  children: ReactNode
  onBack?: (() => void) | null
  loading?: boolean
  showBranding?: boolean
} & Pick<
  ComponentPropsWithoutRef<typeof Dialog>,
  | 'onPointerDownOutside'
  | 'onOpenChange'
  | 'open'
  | 'trigger'
  | 'onFocusCapture'
>

const Logo = styled(ReservoirLogoWhiteText, {
  '& .letter': {
    fill: '$gray12',
  },
})

export const Modal = forwardRef<ElementRef<typeof Dialog>, Props>(
  (
    {
      title,
      children,
      trigger,
      onBack,
      open,
      onOpenChange,
      loading,
      onPointerDownOutside,
      onFocusCapture,
      showBranding = true,
    },
    forwardedRef
  ) => {
    return (
      <Dialog
        ref={forwardedRef}
        trigger={trigger}
        open={open}
        onOpenChange={onOpenChange}
        onPointerDownOutside={onPointerDownOutside}
        onFocusCapture={onFocusCapture}
        overlayProps={{ style: { opacity: 0.6 } }}
        className="hide-scrollbar"
      >
        <Flex
          css={{
            p: 16,
            backgroundColor: '$gray3',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTopRightRadius: '$borderRadius',
            borderTopLeftRadius: '$borderRadius',
          }}
          className="hide-scrollbar"
        >
          <Title css={{ alignItems: 'center', display: 'flex' }}>
            {onBack && (
              <Button
                color="ghost"
                size="none"
                css={{ mr: '$2', color: '$neutralText' }}
                onClick={onBack}
              >
                <FontAwesomeIcon icon={faChevronLeft} width={16} height={16} />
              </Button>
            )}
            {title && <Text style="h6">{title}</Text>}
          </Title>
          <DialogPrimitive.Close asChild>
            <Button color="ghost" size="none" css={{ color: '$neutralText' }}>
              <FontAwesomeIcon icon={faClose} width={16} height={16} />
            </Button>
          </DialogPrimitive.Close>
        </Flex>
        <Box
          css={{
            display: 'flex',
            justifyContent: 'center', // Horizontally center (if needed)
            maxHeight: '85vh',
            overflowY: 'auto',
            backgroundColor: '$neutralBg',
            paddingBottom:"10px"
          }}
          className="hide-scrollbar"
          >
          {loading && <LoadingSpinner css={{margin:"10px 0"}} />}
          {children}
        </Box>
        {showBranding && (
          <Flex
            css={{
              mx: 'auto',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '$gray3',
              py: 10.5,
              borderBottomRightRadius: '$borderRadius',
              borderBottomLeftRadius: '$borderRadius',
            }}
          >
            <Anchor href="https://reservoir.tools/" target="_blank">
              <Text
                style="body3"
                css={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
              >
                Powered by <Logo />
              </Text>
            </Anchor>
          </Flex>
        )}
      </Dialog>
    )
  }
)
