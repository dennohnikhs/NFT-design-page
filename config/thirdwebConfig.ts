import { createThirdwebClient } from 'thirdweb'
import { darkTheme, lightTheme } from 'thirdweb/react'
import { createWallet } from 'thirdweb/wallets'
import { inAppWallet } from 'thirdweb/wallets'
//provided
// export const SMASH_NFT_CLIENT_ID = 'b7ba8345d4d0559a861e36989b3ccf17'//unauthorized dmain 3000
export const SMASH_NFT_CLIENT_ID = '626f12f9b811cacda3e4f395dc3a9a9a'
export const THIRDWEB_SECRET_KEY =
  'x1WV3SLYt5b3UnMZqyARZYyJm7Sm70-zFIwqAytGDcSR-DyxW90kO-eoXU6sZPq3iVcboUy_g-Yocx2cV_oXsg'

// Replace this with your client ID string
// refer to https://portal.thirdweb.com/typescript/v5/client on how to get a client ID
export const thirdwebClientId =
  process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID || SMASH_NFT_CLIENT_ID

if (!thirdwebClientId) {
  throw new Error('No client ID provided')
}

export const thirdwebClient = createThirdwebClient({
  clientId: thirdwebClientId,
})

export const thirdwebAppMetadata = {
  name: 'Smash NFT Marketplace',
  url: '/SmashNFT-logo/20.png',
}

export const getThirdwebAppTheme = (theme: string | undefined) => {
  return theme === 'dark'
    ? darkTheme({
        colors: {
          //   modalBg: "yellow",
        },
      })
    : lightTheme({
        colors: {
          // accentText: "#8E5CFF",
          // accentButtonBg: "#8E5CFF",
          // borderColor: "#8E5CFF",
          // separatorLine: "#8E5CFF",
          // primaryText: "#8E5CFF",
          // secondaryText: "#78727e",
          // primaryButtonBg: "#8E5CFF",
          // selectedTextBg: "#8E5CFF",
          // skeletonBg: "#8E5CFF",
          // secondaryIconHoverColor: "#1a1523",
        },
      })
}

export const thirdwebModal = {
  titleIcon:
    'https://smash-nft-marketplace.vercel.app/SmashNFT-logo/Smashicon.png',
  welcomeScreen: {
    img: {
      src: 'https://smash-nft-marketplace.vercel.app/SmashNFT-logo/Smashicon.png',
      width: 150,
      height: 150,
    },
  },
  showThirdwebBranding: false,
  
}

export const thirdwebWalletsConnectButton = [
  inAppWallet({
    auth: { options: ['facebook', 'apple', 'google',"email", "phone"] },
  }),
  createWallet('io.metamask'),
  createWallet('com.coinbase.wallet'),
  createWallet('me.rainbow'),
]
