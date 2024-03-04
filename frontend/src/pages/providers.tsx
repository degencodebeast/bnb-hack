/* eslint-disable react/jsx-no-comment-textnodes */
'use client';

import React from 'react';
// import { ChakraProvider } from '@chakra-ui/react';
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { AppWrapper } from '../context/state';
import ChakraProviders from '@/providers/chakra-provider';
import { PushProtocolProvider } from '@/context/pushContext';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/state/store';
function Providers({ children }: { children: React.ReactNode }) {
 
  return (
    
    <AppWrapper>
      <ReduxProvider store={store}>
        <PushProtocolProvider>
          <ThirdwebProvider
        clientId="7d6dd3b28e4d16bb007c78b1f6c90b04" 
        activeChain="goerli"
        >
          <ChakraProviders>
            {children}
          </ChakraProviders>
          </ThirdwebProvider>
        </PushProtocolProvider>
      </ReduxProvider>
    </AppWrapper>
  );
}

export default Providers;
