import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { Button } from '../ui/button'
import NavItems from './NavItems'
import MobileNav from './MobileNav'

const Header = () => {
  return ( 
    <header className='w-full border-b'>
      <div className='wrapper flex items-center justify-between w-full bg-purple-400'>
        <Link href='/' className='w-36'>
          <Image 
            src='/assets/images/logo.svg' width={128} height={38} alt='kasumoto logo'
          />
        </Link>
        <SignedIn>
          <nav className='md:flex-between hidden w-full max-w-xs'>
            <NavItems />
          </nav>
        </SignedIn>
        <div className='flex w-32 justify-end gap-3'> 
          <SignedIn>
            <UserButton afterSignOutUrl='/' />
            <MobileNav />
          </SignedIn>
        </div>
          <SignedOut>
            <Button asChild className='rounded-small' size='lg'>
              <Link href='/sign-in'>Login</Link>
            </Button>
          </SignedOut> 
      </div>
    </header>
  )
}

export default Header