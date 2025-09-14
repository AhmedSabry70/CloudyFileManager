import Image from 'next/image'
import React, { ComponentProps } from 'react'

type LogoProps = {
  className?: string
  brand?: boolean
}

const Logo = ({ className, brand }: LogoProps) => {
  return (
    <Image
      src={brand ? '/assets/icons/logo-full-brand.svg' : '/assets/icons/logo-full.svg'}
      alt="logo"
      width={224}
      height={82}
      className={`h-auto ${className}`}
    />
  )
}

export default Logo
