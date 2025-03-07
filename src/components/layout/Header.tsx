import React from 'react'

import Image from 'next/image'

import FileUploader from '../FileUploader'
import Search from '../Search'
import { Button } from '../ui/button'



const Header = () => {
  
  return (
    <header className="header">
      <Search />
      <div className="header-wrapper flex items-center space-x-2">
        <FileUploader  />
        <form>
          <Button type="submit" className="sign-out-button ">
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
