import { mainnet } from 'wagmi/chains'
import useSWR from 'swr'

import { truncateAddress, truncateEns } from 'utils/truncate'
import {  useSmashNft } from 'context/SmashNFTContext'

export default (address?: string, chainId: number = 1) => {
  const {connectedWallet} = useSmashNft()
  const addressLowercase = address?.toLowerCase()
  const isENSAvailable = chainId === mainnet.id
  const isAccountAddress =
    connectedWallet && address?.toLowerCase() === connectedWallet?.toLowerCase()

  const response = useSWR(
    `https://api.ensideas.com/ens/resolve/${addressLowercase}`,
    (url: string) => {
      if (!isENSAvailable || !address) {
        return null
      }
      return fetch(url).then((response) => response.json())
    },
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
    }
  )

  const shortAddress = address ? truncateAddress(address) : ''
  const shortName = response.data?.name ? truncateEns(response.data.name) : null
  let displayName = ''

  if (isAccountAddress) {
    displayName = 'You'
  } else if (response.data?.name) {
    displayName = shortName || ''
  } else if (address) {
    displayName = shortAddress
  }

  return {
    ...response,
    address,
    name: response.data?.name,
    shortName,
    displayName,
    shortAddress,
    avatar: response.data?.avatar,
  }
}
