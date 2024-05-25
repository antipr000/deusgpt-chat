"use client";

import React, { useEffect, useState } from 'react'
import { Flexbox } from 'react-layout-kit';

import LLM from '@/app/(main)/settings/llm';

const ModelsPage = () => {
  const [isClient, setIsClient] = useState(false)
 
  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient && (
    <Flexbox gap={20} horizontal style={{ width: 'calc(100% - 220px)'}}>
        <LLM />
    </Flexbox>
  )
}

export default ModelsPage
