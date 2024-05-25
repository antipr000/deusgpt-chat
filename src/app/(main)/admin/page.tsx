"use client";

import React, { useEffect, useState } from 'react'

import LLM from "@/app/(main)/settings/llm";

const Admin = () => {
  const [isClient, setIsClient] = useState(false)
 
  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    isClient && <LLM />
  )
}

export default Admin
