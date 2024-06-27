'use client'
import Link from "next/link"
import { useSession,signOut } from "next-auth/react"
import { User } from "next-auth"
import { Button } from "./ui/button"
import { useEffect, useState } from "react"
const Navbar = () => {
    const {data:session} = useSession();
    const user = session?.user
    // console.log("Navsession:-",session);
    const [first, setfirst] = useState('');
    let path = '';
    if(typeof window !== 'undefined'){
      path = window.location.pathname
    }
    useEffect(()=>{
      setfirst(path);
    },[first])
    
  return (
    <nav className="p-4 md:p-6 w-full shadow-md bg-gray-900 text-white">
      <div className="container mx-auto gap-2 md:gap-0 flex flex-col md:flex-row justify-between items-center">
        <a href="/" className="text-xl font-bold md:mb-0">
        Anonymous Message
        </a>
        {session ? (
          <>
            <span className="mr-4">
              Welcome, {user.username || user.email}
            </span>
            <div className="space-x-5">
            {
              first === '/dashboard' ? (<Link href={'/'}>
                <Button className="w-fit md:w-auto bg-slate-100 text-black" variant='outline'>
                  Home
                </Button>
                </Link>):(<Link href={'/dashboard'}>
                <Button className="w-fit md:w-auto bg-slate-100 text-black" variant='outline'>
                  Dashboard
                </Button>
                </Link>)
            }
            <Button onClick={() => signOut()} className="w-fit md:w-auto bg-slate-100 text-black" variant='outline'>
              Logout
            </Button>
            </div>
          </>
        ) : (
          <Link href="/sign-up">
            <Button className="w-fit md:w-auto bg-slate-100 text-black" variant={'outline'}>Login</Button>
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar