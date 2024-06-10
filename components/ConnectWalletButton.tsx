import Box from 'components/primitives/Box'
import Button from 'components/primitives/Button'
import {
  getThirdwebAppTheme,
  thirdwebAppMetadata,
  thirdwebClient,
  thirdwebModal,
  thirdwebWalletsConnectButton,
} from 'config/thirdwebConfig'
import { FC } from 'react'
import { ConnectButton } from 'thirdweb/react'
import { useTheme } from 'next-themes'
import { lightTheme, darkTheme } from 'thirdweb/react'
import { useMediaQuery } from 'react-responsive'
type Props = {}

export const ConnectWalletButton: FC<Props> = () => {
  const { theme } = useTheme()
  const isSmallDevice = useMediaQuery({ maxWidth: 905 })
  const thirdwebTheme = getThirdwebAppTheme(theme)

  return (
    <Box
      style={{
        flex: '1',
        display: 'flex',
        justifyContent: 'flex',
      }}
    >
      <ConnectButton
        theme={thirdwebTheme}
        client={thirdwebClient}
        appMetadata={thirdwebAppMetadata}
        connectModal={isSmallDevice?{...thirdwebModal,size: "compact"}:thirdwebModal}
        wallets={thirdwebWalletsConnectButton}
      />
    </Box>
  )
}
