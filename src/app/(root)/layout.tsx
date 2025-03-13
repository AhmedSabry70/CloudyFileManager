import Header from '@/components/layout/Header'
import MobileNav from '@/components/layout/MobileNav'
import Sidebar from '@/components/layout/Sidebar'
import React, { ReactNode } from 'react'

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <section className="flex h-full flex-1 flex-col">
        <MobileNav
          fullName="Ahmed Sabry"
          email="mrsabry134@gmail.com"
          ownerId="2342332"
          accountId="234234"
          avatar="/assets/images/avatar.png"
        />
        <Header />
        <div className="main-content">{children}</div>
      </section>
    </div>
  )
}

export default Layout
