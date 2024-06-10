import * as Sentry from '@sentry/nextjs'
import {  useSmashNft } from 'context/SmashNFTContext'

import { FC, ReactElement, useEffect } from 'react'
import { NEXT_PUBLIC_SENTRY_DSN } from 'smash.config'


const SENTRY_DSN = NEXT_PUBLIC_SENTRY_DSN

type Props = {
  children: ReactElement
}

const ErrorTrackingProvider: FC<Props> = ({ children }) => {
  
  const { connectedWallet } = useSmashNft()

  useEffect(() => {
    if (!SENTRY_DSN) {
      return
    }

    if (connectedWallet) {
      Sentry.setUser({ id: connectedWallet })
    } else {
      Sentry.setUser(null)
    }
  }, [connectedWallet])

  return children
}

export default ErrorTrackingProvider
