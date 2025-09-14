import Header from '@/components/layout/Header'
import MobileNav from '@/components/layout/MobileNav'
import Sidebar from '@/components/layout/Sidebar'
import { getCurrentUser } from '@/lib/actions/user.actions'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'

const Layout = async({ children }: { children: ReactNode }) => {
  const currentUser = await getCurrentUser()
  if(!currentUser) return redirect('/sign-in')
  return (
    <div className="flex h-screen">
      <Sidebar {...currentUser} />
      <section className="flex h-full flex-1 flex-col">
        <MobileNav
          {...currentUser}
        />
        <Header ownerId={currentUser.$id} accountId={currentUser.accountId}/>
        <div className="main-content">{children}</div>
      </section>
    </div>
  )
}

export default Layout
