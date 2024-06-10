import { faGasPump } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useBids, useListings, useTokens } from '@reservoir0x/reservoir-kit-ui'
import { Transak, TransakConfig } from '@transak/transak-sdk'
import { AcceptBid, Bid, BuyNow, List, BuyWithCard } from 'components/buttons'
import AddToCart from 'components/buttons/AddToCart'
import CancelBid from 'components/buttons/CancelBid'
import CancelListing from 'components/buttons/CancelListing'
import { Button, Flex, Grid, Tooltip, Text } from 'components/primitives'
import { TRANSAK_STAGGING_API_KEY } from 'config/appConfig'
import { useSmashNft } from 'context/SmashNFTContext'
import { useRouter } from 'next/router'
import { ComponentPropsWithoutRef, FC, useEffect, useState } from 'react'
import { MutatorCallback } from 'swr'
import Pusher from "pusher-js";
import { THIRDWEB_SECRET_KEY } from 'config/thirdwebConfig'


type Props = {
  token: ReturnType<typeof useTokens>['data'][0]
  offer?: ReturnType<typeof useBids>['data'][0]
  listing?: ReturnType<typeof useListings>['data'][0]
  isOwner: boolean
  mutate?: MutatorCallback
}

export const TokenActions: FC<Props> = ({
  token,
  offer,
  listing,
  isOwner,
  mutate,
}) => {
  // console.log(token);
  const router = useRouter()
  const { isConnected, connectedWallet } = useSmashNft()
  const bidOpenState = useState(true)
  const [isBuyWithCardOpen,setIsBuyWithCardOpen] = useState(false)
  const buyOpenState = useState(true)
  const [path, _] = router.asPath.split('?')
  const routerPath = path.split('/')
  const isBuyRoute = routerPath[routerPath.length - 1] === 'buy'
  const queryBidId = router.query.bidId as string
  const deeplinkToAcceptBid = router.query.acceptBid === 'true'
  const is1155 = token?.token?.kind === 'erc1155'

  const showAcceptOffer =
    !is1155 &&
    token?.market?.topBid?.id !== null &&
    token?.market?.topBid?.id !== undefined &&
    isOwner &&
    token?.token?.owner
      ? true
      : false

  const isTopBidder =
    isConnected &&
    token?.market?.topBid?.maker?.toLowerCase() ===
      connectedWallet?.toLowerCase()
  const isListed = token ? token?.market?.floorAsk?.id !== null : false

  const offerIsOracleOrder = offer?.isNativeOffChainCancellable

  const listingIsOracleOrder = listing?.isNativeOffChainCancellable

  const buttonCss: ComponentPropsWithoutRef<typeof Button>['css'] = {
    width: '100%',
    height: 52,
    justifyContent: 'center',
    minWidth: 'max-content',
    '@sm': {
      maxWidth: 250,
    },
  }

  //!===============================

  let pusher = new Pusher("1d9ffac87de599c61283", { cluster: "ap2" });



  
  const subscribeToWebsockets = (orderId: string) => {
    let channel = pusher.subscribe(orderId);

    //receive updates of all the events
    pusher.bind_global((eventId: any, orderData: any) => {
      console.log(`websocket Event: ${eventId} with order data:`, orderData);
    });

    //receive updates of a specific event
    channel.bind("ORDER_COMPLETED", (orderData: any) => {
      console.log("ORDER COMPLETED websocket event", orderData);
    });

    channel.bind("ORDER_FAILED", async (orderData: any) => {
      console.log("ORDER FAILED websocket event", orderData);
    });
  };

  
  Transak.on(Transak.EVENTS.TRANSAK_ORDER_CREATED, (orderData: any) => {
    console.log("callback transak order created", orderData);
    const eventData = orderData;

    const orderId = eventData.status?.id;

    if (!orderId) {
      return;
    }

    subscribeToWebsockets(orderId);
  });
  const nftCheckoutWithCard = async () =>{
//!====================== THIRDWEB
// const body = {
//   // contractId: "REGISTERED_CONTRACT_ID", // this contract should be registered with Reservoir as the contract type
//   title: "My Checkout",
//   contractArgs: {
// 	  // TIP! You can add more than 1 token to the nfts array and we'll accept all of those listings!
//     nfts: [
//       { token: `${token?.token?.contract}:${token?.token?.tokenId}` },
//       // { token: `COLLECTION_CONTRACT_ADDRESS_2:TOKEN_ID_2` }
//     ]
//   },
// };
// try {
//   console.log(body);
//   const resp = await fetch("https://payments.thirdweb.com/api/2022-08-12/checkout-link-intent", {
//     method: "POST",
//     headers: {
//       "Authorization": `Bearer ${THIRDWEB_SECRET_KEY}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(body)
//   });
  
//   const data = await resp.json();
//   console.log("nftCheckoutWithCard",data);
//   const checkoutLinkIntentUrl = data.checkoutLinkIntentUrl;

// } catch (error) {
//   console.log(error);
// }

// Navigate users to this URL to purchase your NFT.


    //!================================ TRANSAK

  // const settings: TransakConfig = {
  //   apiKey: TRANSAK_STAGGING_API_KEY,
  //   environment: Transak.ENVIRONMENTS.STAGING,
  //   themeColor: "000000",
  //   defaultPaymentMethod: "credit_debit_card",
  //   /**
  //    * The wallet address of the user
  //    * The NFT will be delivered to this address
  //    */
  //   walletAddress: connectedWallet?.toLowerCase(),
  //   exchangeScreenTitle: "Deposit Funds",
  //   disableWalletAddressForm: true,
  //   estimatedGasLimit: 70_000,
  //   tokenData: [
  //     {
  //       /**
  //        * This is a collection address from opensea testnet
  //        * https://testnets.opensea.io/assets/mumbai/0xc491a4a3601e9923366823523efe29415f6430c3/0
  //        */
  //       collectionAddress: token?.token?.contract??"",
  //       /**
  //        * TokenIds a user wants to buy
  //        */
  //       tokenID: [token?.token?.tokenId??""],
  //       /**
  //        * The marketplace from which the user wants to buy
  //        */
  //       marketplace: "opensea",
  //       normalizeRoyalties: true,
  //       /**
  //        * The name of the NFT
  //        * This will be shown in the transak widget to the user
  //        */
  //       nftName: token?.token?.name??"",
  //       /**
  //        * The image of the NFT
  //        * This will be shown in the transak widget to the user
  //        */
  //       imageURL:token?.token?.imageSmall || token?.token?.image ||
  //         "https://assets.transak.com/images/general/transak-test-nft.png",
  //     },
  //   ],
  //   isNFT: true,
  //   /**
  //    * The contract id for a partner api key
  //    * You will get this contract id from transak
  //    */
  //   // contractId: "63306038308c667bb8755b77",
  // };

  //   const transakBuyWithCard = new Transak(settings);
  //   transakBuyWithCard.init();
  }

  return (
    <Grid
      align="center"
      css={{
        gap: '$4',
        gridTemplateColumns: 'repeat(1,minmax(0,1fr))',
        width: '100%',
        '@sm': {
          gridTemplateColumns: 'repeat(2,minmax(0,1fr))',
          maxWidth: 500,
        },
      }}
    >
      {isOwner && !is1155 && (
        <List
          token={token}
          mutate={mutate}
          buttonCss={buttonCss}
          buttonChildren={
            token?.market?.floorAsk?.price?.amount?.decimal
              ? 'Create New Listing'
              : 'List for Sale'
          }
        />
      )}
      {(!isOwner || is1155) &&
        isListed &&
        token?.market?.floorAsk?.price?.amount && (
          <Flex
            css={{ ...buttonCss, borderRadius: 8, overflow: 'hidden', gap: 1 }}
          >
            <BuyNow
              tokenId={token.token?.tokenId}
              collectionId={token.token?.collection?.id}
              buttonCss={{ flex: 1, justifyContent: 'center' }}
              buttonProps={{ corners: 'square' }}
              buttonChildren="Buy Now 5"
              mutate={mutate}
              openState={!isOwner && isBuyRoute ? buyOpenState : undefined}
            />
            <AddToCart
              token={token}
              buttonCss={{
                width: 52,
                p: 0,
                justifyContent: 'center',
              }}
              buttonProps={{ corners: 'square' }}
            />
          </Flex>
        )}

      {(!isOwner || is1155) &&
        isListed &&
        token?.market?.floorAsk?.price?.amount && (
          <Flex
            css={{ ...buttonCss, borderRadius: 8, overflow: 'hidden', gap: 1 }}
          >
            <BuyWithCard
              tokenId={token.token?.tokenId}
              collectionId={token.token?.collection?.id}
              buttonCss={{ flex: 1, justifyContent: 'center' }}
              buttonProps={{ corners: 'square' }}
              buttonChildren="Buy With Card"
              mutate={mutate}
              openState={!isOwner && isBuyRoute ? buyOpenState : undefined}
              isBuyWithCardOpen={isBuyWithCardOpen}
              setIsBuyWithCardOpen={setIsBuyWithCardOpen}
            />
            {/* <Button css={{ flex: 1, justifyContent: 'center' }} color="primary" onClick={nftCheckoutWithCard}>Buy With Card</Button> */}
          </Flex>
        )}
      {showAcceptOffer && (
        <AcceptBid
          tokenId={token.token?.tokenId}
          bidId={queryBidId}
          collectionId={token?.token?.contract}
          openState={
            isOwner && (queryBidId || deeplinkToAcceptBid)
              ? bidOpenState
              : undefined
          }
          mutate={mutate}
          buttonCss={buttonCss}
          buttonChildren="Accept Offer"
        />
      )}

      {(!isOwner || is1155) && (
        <Bid
          tokenId={token?.token?.tokenId}
          collectionId={token?.token?.collection?.id}
          mutate={mutate}
          buttonCss={buttonCss}
        />
      )}

      {isTopBidder && !is1155 && (
        <CancelBid
          bidId={token?.market?.topBid?.id as string}
          mutate={mutate}
          trigger={
            <Flex>
              {!offerIsOracleOrder ? (
                <Tooltip
                  content={
                    <Text style="body3" as="p">
                      Cancelling this order requires gas.
                    </Text>
                  }
                >
                  <Button
                    css={{
                      color: '$red11',
                      width: '100%',
                      height: 52,
                      justifyContent: 'center',
                      minWidth: 'max-content',
                      '@sm': {
                        maxWidth: 250,
                      },
                    }}
                    color="gray3"
                  >
                    <FontAwesomeIcon
                      color="#697177"
                      icon={faGasPump}
                      width="16"
                      height="16"
                    />
                    Cancel Offer
                  </Button>
                </Tooltip>
              ) : (
                <Button
                  css={{
                    color: '$red11',
                    width: '100%',
                    height: 52,
                    justifyContent: 'center',
                    minWidth: 'max-content',
                    '@sm': {
                      maxWidth: 250,
                    },
                  }}
                  color="gray3"
                >
                  Cancel Offer
                </Button>
              )}
            </Flex>
          }
        />
      )}

      {isOwner && isListed && !is1155 && (
        <CancelListing
          listingId={token?.market?.floorAsk?.id as string}
          mutate={mutate}
          trigger={
            <Flex>
              {!listingIsOracleOrder ? (
                <Tooltip
                  content={
                    <Text style="body3" as="p">
                      Cancelling this order requires gas.
                    </Text>
                  }
                >
                  <Button
                    css={{
                      color: '$red11',
                      minWidth: '150px',
                    }}
                    color="gray3"
                  >
                    <FontAwesomeIcon
                      color="#697177"
                      icon={faGasPump}
                      width="16"
                      height="16"
                    />
                    Cancel Listing
                  </Button>
                </Tooltip>
              ) : (
                <Button
                  css={{
                    color: '$red11',
                    minWidth: '150px',
                    justifyContent: 'center',
                  }}
                  color="gray3"
                >
                  Cancel Listing
                </Button>
              )}
            </Flex>
          }
        />
      )}
    </Grid>
  )
}
