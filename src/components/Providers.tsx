"use client"
import React from 'react'
import {QueryClientProvider, QueryClient} from '@tanstack/react-query'


const queryClient = new QueryClient()

type Props = {
    children: React.ReactNode
}

const Providers = ({children}:Props) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

export default Providers
