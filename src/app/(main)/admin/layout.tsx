import React, { ReactNode } from 'react'
import { Flexbox } from 'react-layout-kit'
import AdminSidebar from '@/components/AdminSidebar'

const AdminLayout = ({ children } : { children: ReactNode }) => {
  return (
    <Flexbox  gap={20} horizontal style={{ height: '100%', width: '100%' }}>
        <AdminSidebar />
        {children}
    </Flexbox>
  )
}

export default AdminLayout