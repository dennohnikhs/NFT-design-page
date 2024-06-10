import useWebSocket, { Options } from 'react-use-websocket'
import { NEXT_PUBLIC_RESERVOIR_WEBSOCKET_KEY } from 'smash.config'
import chains, { DefaultChain } from 'utils/chains'

const WEBSOCKET_API_KEY = NEXT_PUBLIC_RESERVOIR_WEBSOCKET_KEY

export default (chainId: number, options: Options = {}) => {
  const chain = chains.find((chain) => chain.id === chainId) || DefaultChain

  const websocket = useWebSocket(
    `${chain.wssUrl}?api_key=${WEBSOCKET_API_KEY}`,
    {
      share: true,
      ...options,
    },
    chain.wssUrl && WEBSOCKET_API_KEY ? true : false
  )

  return {
    ...websocket,
  }
}
