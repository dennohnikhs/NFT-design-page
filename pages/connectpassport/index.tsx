// import React from 'react'
import { Head } from 'components/Head';
import Layout from 'components/Layout';
import { Footer } from 'components/home/Footer';
import { Box } from 'components/primitives';
import { useSmashNft } from 'context/SmashNFTContext';
import { useEffect } from 'react'

//NOT BEING USED 
const PassportLoginSuccess = () => {


  return (
    <Layout>
      <Head/>
      <Box style={{display:"flex",alignItems:'center',justifyContent:"center"}} >

      <div id="connectModalPassport"></div>
      </Box>
      <Footer />
      
    </Layout>
  )
}

export default PassportLoginSuccess