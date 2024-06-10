import {
  getThirdwebAppTheme,
  thirdwebAppMetadata,
  thirdwebClient,
  thirdwebModal,
  thirdwebWalletsConnectButton,
} from 'config/thirdwebConfig'
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  FC,
  useEffect,
} from 'react'
import { defineChain } from 'thirdweb'
import {
  useActiveAccount,
  useActiveWallet,
  useSetActiveWallet,
} from 'thirdweb/react'
import { useDisconnect, useWalletClient } from 'wagmi'
import { viemAdapter } from 'thirdweb/adapters/viem'
import { createWalletAdapter } from 'thirdweb/dist/types/adapters/wallet-adapter'
import useSynchronizedAddress from 'hooks/useSynchronizedAddress'
import { useSigner } from '@thirdweb-dev/react'
import { useTheme } from 'next-themes'
import { useMediaQuery } from 'react-responsive'
interface SmashNft {
  id: string
  name: string
  email: string
}

interface SmashNftContextType {
  signerTest: any
  connectedWallet: string | null
  user: SmashNft | null
  openWalletModal: boolean
  handleOpenWalletModal: (open: boolean) => void
  setSmashNft: (user: SmashNft | null) => void
  isConnected: boolean
  isDisconnected: boolean
  isInAppWallet: boolean
  thirdwebConnectModalConfig:any
}

const SmashNftContext = createContext<SmashNftContextType | undefined>(
  undefined
)

export const SmashNftContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { theme } = useTheme()
  const isSmallDevice = useMediaQuery({ maxWidth: 905 })
  const thirdwebTheme = getThirdwebAppTheme(theme)

  const thirdwebConnectModalConfig = {
    theme: thirdwebTheme,
    client: thirdwebClient,
    appMetadata: thirdwebAppMetadata,
    connectModal: isSmallDevice
      ? { ...thirdwebModal, size: 'compact' }
      : thirdwebModal,
    wallets: thirdwebWalletsConnectButton,
  }

  //!=============== STATES =============================
  const [isInAppWallet, setIsInAppWallet] = useState(false)
  const signerTest = useSigner()
  const syncedAddress = useSynchronizedAddress()
  const activeAccount = useActiveAccount()
  const wallet = useActiveWallet()
  useEffect(() => {
    console.log('ACCOUNTS', { activeAccount, wallet, syncedAddress })
    if (wallet && wallet.id === 'inApp') {
      setIsInAppWallet(true)
    } else setIsInAppWallet(false)
  }, [activeAccount, wallet, syncedAddress])

  const [connectedWallet, setConnectedWallet] = useState<string | null>(null)
  const [user, setSmashNft] = useState<SmashNft | null>(null)
  const [openWalletModal, setOpenWalletModal] = useState(false)

  const handleOpenWalletModal = (open: boolean) => {
    setOpenWalletModal(open)
  }

  //!=============== EFFECTS =============================

  useEffect(() => {
    if (syncedAddress) {
      setConnectedWallet(syncedAddress)
    } else {
      setConnectedWallet(null)
    }
  }, [syncedAddress])

  const VALUE = {
    signerTest,
    connectedWallet,
    user,
    setSmashNft,
    openWalletModal,
    handleOpenWalletModal,
    isConnected: connectedWallet ? true : false,
    isDisconnected: !connectedWallet ? true : false,
    isInAppWallet,
    thirdwebConnectModalConfig
  }

  return (
    <SmashNftContext.Provider value={VALUE}>
      {children}
    </SmashNftContext.Provider>
  )
}

export const useSmashNft = (): SmashNftContextType => {
  const context = useContext(SmashNftContext)
  if (context === undefined) {
    throw new Error('useSmashNft must be used within a SmashNftProvider')
  }
  return context
}
