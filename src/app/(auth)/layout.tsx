import React, { ReactNode } from 'react'

import Image from 'next/image'
import Logo from '@/components/Logo'

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <aside className="bg-brand hidden w-1/2 items-center justify-center p-10 lg:flex xl:w-2/5">
        <div className="flex max-h-[800px]  flex-col justify-center space-y-12">
          <div className="max-w-[430px] flex-col justify-center space-y-12">
            <Logo />
            <div className="space-y-5 text-white">
              <h1 className="h1">Manage your files the best way</h1>
              <p className="body-1">This is a place where you can store all your documents</p>
            </div>

            <div className="relative flex h-full items-center justify-center overflow-hidden p-8">
              <div className="flex flex-shrink-0 flex-row items-center justify-center gap-2">
                <Image
                  src={'/assets/images/files.png'}
                  alt="file"
                  width={342}
                  height={342}
                  className="transition-all hover:scale-105 hover:rotate-2"
                />
              </div>
            </div>
          </div>
        </div>
      </aside>
      <main className="animate-fade-n-scale flex flex-1 flex-col items-center bg-white p-4 py-10 lg:justify-center lg:p-10 lg:py-0">
        <div className="mb-16 lg:hidden ">
          <Logo brand className="w-[200] lg:w-[250px]" />
        </div>

        {children}
      </main>
    </div>
  )
}

export default Layout
