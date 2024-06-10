import { Box, Button, Flex, FormatCryptoCurrency, MarkdownLink, Text } from 'components/primitives';
import Img from 'components/primitives/Img';
import { ChainContext } from 'context/ChainContextProvider';
import useTopSellingCollections from 'hooks/useTopSellingCollections';
import Link from 'next/link'
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react'
import ReactMarkdown from 'react-markdown';
import { styled } from 'stitches.config';
import optimizeImage from 'utils/optimizeImage';

const StyledImage = styled('img', {})


export interface CollectionItem {
    id: number;
    routePrefix: string;
    name: string;
    description: string;
    bannerImage: string;
    topCollectionImage: string;
    floorAsk: {
        price: {
            amount: {
                native: number;
            };
            currency: {
                contract: string;
            };
        };
    };
    count: number;
    recentSales: Array<{
        token: {
            id: number;
            image: string;
        };
        price: {
            amount: {
                decimal: number;
            };
            currency: {
                contract: string;
            };
        };
    }>;
    banner: any,
    image: any
}

interface CollectionCardProps {
    topCollection: CollectionItem
}

export default function ColectionCard({ topCollection }: CollectionCardProps) {
    const { chain } = useContext(ChainContext)
    const [theme, setTheme] = useState<string | null>(null)
    const router = useRouter()
    const { data: topSellingCollectionsData } = useTopSellingCollections(
        {
            period: '24h',
            includeRecentSales: true,
            limit: 9,
            fillType: 'sale',
        },
        {
            revalidateOnMount: true,
            refreshInterval: 300000,
        },
        chain?.id
    )
    const topCollectionBannerImage =
        topCollection?.banner ||
        topCollection?.image ||
        topCollection?.recentSales?.[0]?.token?.image

    const topCollectionImage =
        topCollection?.image ||
        topCollection?.banner ||
        topCollection?.recentSales?.[0]?.token?.image

    console.log('topCollection Image', topCollectionImage)

    return <Link href={`/${chain.routePrefix}/collection/${topCollection?.id}`}>
        <Flex>
            <Flex
                css={{
                    '&:hover button': {
                        background: theme == 'light' ? '$primary11' : '$gray2',
                    },
                    minHeight: 540,
                    flex: 1,
                    overflow: 'hidden',
                    position: 'relative',
                    gap: '$5',
                    p: '$4',
                    display: 'none',
                    '@md': {
                        p: '$5',
                        gap: '$4',
                        flexDirection: 'column',
                        display: 'flex',
                    },
                    '@lg': {
                        flexDirection: 'row',
                        p: '$5',
                        gap: '$5',
                        mt: '$4',
                    },
                    '@xl': {
                        p: '$6',
                        gap: '$6',
                    },

                    mb: '$6',
                    maxWidth: 1820,
                    mx: 'auto',
                    borderRadius: 16,
                    backgroundSize: 'cover',
                    border: `1px solid $gray5`,
                    backgroundImage:
                        theme === 'light'
                            ? `url(${optimizeImage(topCollectionBannerImage, 1820)})`
                            : '$gray3',
                    backgroundColor: '$gray5',
                }}
            >
                <Box
                    css={{
                        position: 'absolute',
                        top: 0,
                        display: theme === 'light' ? 'block' : 'none',
                        zIndex: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backdropFilter: 'blur(20px)',
                        background: 'rgba(255, 255, 255, 0.9)',
                    }}
                />

                {topSellingCollectionsData && (
                    <>
                        <Box
                            css={{
                                flex: 2,
                                position: 'relative',
                                zIndex: 5,
                                '@xl': {
                                    flex: 3,
                                },
                            }}
                        >
                            <StyledImage
                                src={optimizeImage(
                                    topCollectionBannerImage,
                                    1820
                                )}
                                css={{
                                    width: '100%',
                                    borderRadius: 8,
                                    height: 320,
                                    '@lg': {
                                        height: 540,
                                    },
                                    objectFit: 'cover',
                                }}
                            />
                            <Box
                                css={{
                                    position: 'absolute',
                                    left: '$4',
                                    '@lg': {
                                        top: '$4',
                                    },
                                    bottom: '$4',
                                }}
                            >
                                <Img
                                    alt="collection image"
                                    width={100}
                                    height={100}
                                    style={{
                                        display: 'block',
                                        borderRadius: 8,
                                        border: '2px solid rgba(255,255,255,0.6)',
                                    }}
                                    src={optimizeImage(topCollectionImage, 200) as string}
                                />
                            </Box>
                        </Box>
                        <Box css={{ flex: 2, zIndex: 4 }}>
                            <Flex direction="column" css={{ height: '100%' }}>
                                <Box css={{ flex: 1 }}>
                                    <Text style="h3" css={{ mt: '$3', mb: '$2' }} as="h3">
                                        {topCollection?.name}
                                    </Text>

                                    <Box
                                        css={{
                                            maxWidth: 720,
                                            lineHeight: 1.5,
                                            fontSize: 16,
                                            fontWeight: 400,
                                            display: '-webkit-box',
                                            color: '$gray12',
                                            fontFamily: '$body',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}
                                    >
                                        <ReactMarkdown
                                            children={topCollection?.description || ''}
                                            components={{
                                                a: MarkdownLink,
                                                p: Text as any,
                                            }}
                                        />
                                    </Box>

                                    <Flex css={{ mt: '$4' }}>
                                        <Box css={{ mr: '$5' }}>
                                            <Text style="subtitle2" color="subtle">
                                                FLOOR
                                            </Text>
                                            <Box css={{ mt: 2 }}>
                                                <FormatCryptoCurrency
                                                    amount={
                                                        topCollection?.floorAsk?.price?.amount
                                                            ?.native ?? 0
                                                    }
                                                    textStyle={'h4'}
                                                    logoHeight={20}
                                                    address={
                                                        topCollection?.floorAsk?.price?.currency
                                                            ?.contract
                                                    }
                                                />
                                            </Box>
                                        </Box>

                                        <Box css={{ mr: '$4' }}>
                                            <Text style="subtitle2" color="subtle">
                                                24H SALES
                                            </Text>
                                            <Text style="h4" as="h4" css={{ mt: 2 }}>
                                                {topCollection?.count?.toLocaleString()}
                                            </Text>
                                        </Box>
                                    </Flex>
                                    <Box
                                        css={{
                                            display: 'none',
                                            '@lg': {
                                                display: 'block',
                                            },
                                        }}
                                    >
                                        <Text
                                            style="subtitle2"
                                            color="subtle"
                                            as="p"
                                            css={{ mt: '$4' }}
                                        >
                                            RECENT SALES
                                        </Text>
                                        <Flex
                                            css={{
                                                mt: '$2',
                                                gap: '$3',
                                            }}
                                        >
                                            {topCollection?.recentSales
                                                ?.slice(0, 4)
                                                ?.map((sale: any, i) => (
                                                    <Box
                                                        css={{
                                                            aspectRatio: '1/1',
                                                            maxWidth: 120,
                                                        }}
                                                        key={sale.token.id + sale.contract + i}
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            e.preventDefault()
                                                            router.push(
                                                                `/${chain.routePrefix}/asset/${topCollection?.primaryContract}:${sale.token.id}`
                                                            )
                                                        }}
                                                    >
                                                        <img
                                                            style={{ borderRadius: 4 }}
                                                            src={optimizeImage(
                                                                sale?.token?.image ||
                                                                topCollectionImage,
                                                                250
                                                            )}
                                                        />
                                                        <Box css={{ mt: '$1' }}>
                                                            <FormatCryptoCurrency
                                                                amount={sale.price.amount.decimal ?? 0}
                                                                textStyle={'h6'}
                                                                logoHeight={16}
                                                                address={sale.price.currency?.contract}
                                                            />
                                                        </Box>
                                                    </Box>
                                                ))}
                                            <Box css={{ flex: 1 }} />
                                            <Box css={{ flex: 1 }} />
                                        </Flex>
                                    </Box>
                                </Box>
                                <Flex css={{ gap: '$4', mt: '$5' }}>
                                    {theme == 'light' ? (
                                        <Button as="button" color="primary" size="large">
                                            Explore Collection
                                        </Button>
                                    ) : (
                                        <Button as="button" color="gray4" size="large">
                                            Explore Collection
                                        </Button>
                                    )}
                                </Flex>
                            </Flex>
                        </Box>
                    </>
                )}
            </Flex>
        </Flex>
    </Link>
}