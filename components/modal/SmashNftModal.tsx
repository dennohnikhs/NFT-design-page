import { useEffect, useState } from 'react';
import { Modal } from 'components/common/Modal';
import { Button } from 'components/primitives';
import { useSmashNft } from 'context/SmashNFTContext';
import { PayEmbed } from 'thirdweb/react';
import { getThirdwebAppTheme, thirdwebClient } from 'config/thirdwebConfig';
import { useTheme } from 'next-themes';

// create Checkout SDK
export function SmashNftModal() {
  // const { theme } = useTheme()
  // const thirdwebTheme = getThirdwebAppTheme(theme)
  const { openWalletModal,handleOpenWalletModal } = useSmashNft()




  // Simplified home page code!
  return (
    <Modal
    // title="Connect With Passport"
    open={openWalletModal}
    onOpenChange={handleOpenWalletModal}
    showBranding={false}
    loading={false}
  >
    <></>
    {/* =========THIRDWEB ONRAMP=========== */}
   {/* <PayEmbed client={thirdwebClient} theme={thirdwebTheme} /> */}

    

  </Modal>
);
}