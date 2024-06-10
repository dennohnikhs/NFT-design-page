import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faExchangeAlt, faArrowsAltV, faPlus } from '@fortawesome/free-solid-svg-icons';
import { styled } from '@stitches/react';
import { Flex } from 'components/primitives';
import {  useSmashNft } from 'context/SmashNFTContext';
import { useTheme } from 'next-themes';
import { transakClient } from 'config/appConfig';

const IconMenu = () => {
  const { theme } = useTheme();

  const MenuContainer = styled(Flex, {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '10px',
    borderRadius: '10px',
    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
  });

  const MenuItem = styled(Flex, {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: theme === 'dark' ? 'white' : 'black',
    margin: '0 10px',
  });

  const IconWrapper = styled('div', {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '50px',
    height: '50px',
    backgroundColor: theme === 'dark' ? '#333' : '#e0e0e0',
    borderRadius: '50%',
    marginBottom: '5px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme === 'dark' ? '#222' : '#c0c0c0',
    },
  });

  const Label = styled('span', {
    marginTop: '5px',
    fontSize: '14px',
  });

  const { handleOpenWalletModal  } = useSmashNft();

  const thirdwebWalletHandle = async () => {
    // handleOpenWalletModal(true);
    // await IMX_CHECKOUT_HANDLE('wallet');
  };

  const thirdwebSwapHandle = async () => {
    // handleOpenWalletModal(true);
    // await IMX_CHECKOUT_HANDLE('swap');
  };

  const thirdwebBridgeHandle = async () => {
    // handleOpenWalletModal(true);
    // await IMX_CHECKOUT_HANDLE('bridge');
  };

  const openOnRampTransak = async () => {
    transakClient.init();
    // handleOpenWalletModal(true);
    // await IMX_CHECKOUT_HANDLE('bridge');
  };

  return (
    <MenuContainer>
      <MenuItem>
        <IconWrapper onClick={thirdwebWalletHandle}>
          <FontAwesomeIcon icon={faWallet} size="lg" />
        </IconWrapper>
        <Label>Wallet</Label>
      </MenuItem>
      <MenuItem>
        <IconWrapper onClick={thirdwebSwapHandle}>
          <FontAwesomeIcon icon={faExchangeAlt} size="lg" />
        </IconWrapper>
        <Label>Swap</Label>
      </MenuItem>
      <MenuItem>
        <IconWrapper onClick={thirdwebBridgeHandle}>
          <FontAwesomeIcon icon={faArrowsAltV} size="lg" />
        </IconWrapper>
        <Label>Bridge</Label>
      </MenuItem>
      <MenuItem onClick={openOnRampTransak}>
        <IconWrapper>
          <FontAwesomeIcon icon={faPlus} size="lg" />
        </IconWrapper>
        <Label>Buy</Label>
      </MenuItem>
    </MenuContainer>
  );
};

export default IconMenu;
