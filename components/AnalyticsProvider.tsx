import { FC, ReactElement, useEffect } from 'react'

import { datadogRum } from '@datadog/browser-rum'
import posthog from 'posthog-js'
import {
  NEXT_PUBLIC_DATADOG_APPLICATION_ID,
  NEXT_PUBLIC_DATADOG_CLIENT_TOKEN,
  NODE_ENV,
  NEXT_PUBLIC_POSTHOG_CLIENT_TOKEN,
} from 'smash.config'
import {  useSmashNft } from 'context/SmashNFTContext'

type Props = {
  children: ReactElement
}

export const initializeAnalytics = () => {
  if (typeof window !== 'undefined' && !datadogRum.getInitConfiguration()) {
    if (
      NEXT_PUBLIC_DATADOG_APPLICATION_ID &&
      NEXT_PUBLIC_DATADOG_CLIENT_TOKEN
    ) {
      datadogRum.init({
        applicationId: NEXT_PUBLIC_DATADOG_APPLICATION_ID,
        clientToken: NEXT_PUBLIC_DATADOG_CLIENT_TOKEN,
        site: 'datadoghq.com',
        //CONFIGURABLE: Change the service name to customize how it appears in your DD dashboard
        service: 'reservoir-marketplace',
        env: NODE_ENV,
        sampleRate: 100,
        replaySampleRate: 100,
        trackInteractions: true,
        trackFrustrations: true,
        trackResources: true,
        defaultPrivacyLevel: 'mask-user-input',
      })

      datadogRum.startSessionReplayRecording()
    }
  }

  if (typeof window !== 'undefined' && NEXT_PUBLIC_POSTHOG_CLIENT_TOKEN) {
    posthog.init(NEXT_PUBLIC_POSTHOG_CLIENT_TOKEN, {
      api_host: 'https://app.posthog.com',
      disable_session_recording: true,
      mask_all_text: false,
      mask_all_element_attributes: false,
    })

    const randomNumber = Math.random()
    const samplingRate = 0.3
    if (randomNumber <= samplingRate) {
      posthog.startSessionRecording()
    }
  }
}

const AnalyticsProvider: FC<Props> = ({ children }) => {
  const { connectedWallet } = useSmashNft()

  useEffect(() => {
    if (connectedWallet) {
      const address = connectedWallet.toLowerCase()
      datadogRum.setUser({
        id: address,
      })
      if (NEXT_PUBLIC_POSTHOG_CLIENT_TOKEN) {
        posthog.identify(address)
      }
    }
  }, [connectedWallet])

  return children
}

export default AnalyticsProvider
