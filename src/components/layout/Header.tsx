
import Image from 'next/image'

import { signOutUser } from '@/lib/actions/user.actions'
import FileUploader from '../FileUploader'
import Search from '../Search'
import { Button } from '../ui/button'

const Header = ({ ownerId, accountId }:{
  ownerId: string
  accountId: string
}) => {
  return (
    <header className="header">
      <Search />
      <div className="header-wrapper flex items-center space-x-2">
        <FileUploader ownerId={ownerId} accountId={accountId}/>
        <form
        action={async () => {
          "use server";

          await signOutUser();
        }}
        >
          <Button type="submit" className="sign-out-button" >
            <Image
              src={'assets/icons/logout.svg'}
              alt="sign out"
              width={24}
              height={24}
              className="w-6"
            />
          </Button>
        </form>
      </div>
    </header>
  )
}

export default Header
