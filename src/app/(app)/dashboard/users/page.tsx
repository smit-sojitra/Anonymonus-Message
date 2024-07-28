'use client'

import axios, { AxiosError } from "axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { User } from 'next-auth';
import { useSession } from "next-auth/react";
import { Button } from '@/components/ui/button';
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
const page = () => {
    const {data:sesison} = useSession();
    const [loading,setLoading] = useState(false);
    const user = sesison?.user;
    // const name= user?.username
    console.log('user',user);
    const [users, setUsers] = useState<User[]>([])
    const fetchUsers = async ()=>{
      setLoading(true);
      try { 
        const response = await axios.get('/api/users')
        setUsers(response.data.message);
        // toast.success("data fetched")
        console.log('response:-',response)
        console.log('total user:-',response)

        } catch (error) {
        const axiosErrors = error as AxiosError
        console.log('axiosErors',axiosErrors)
        }finally{
          setTimeout(()=>{
            setLoading(false);
          },500)
        }
    }
    useEffect(()=>{
        fetchUsers();
    }, []);
  return (
    <div className="min-h-screen flex j justify-center">
      {
        loading?(<div className="flex h-screen w-screen justify-center items-center space-y-3">
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>)
        :(
          <div className="w-11/12 max-w-[1260px] flex p-10 flex-col">
            <h1 className="text-4xl font-bold mb-6">Hello,{user?.username} </h1>
            <p className="text-lg mb-8">Here are the users that you can message:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {users.map((user) => (
                <div key={user._id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                  <p className="text-lg">{user.userName}</p>
                  <Link href={`/dashboard/users/${user.userName}/message`}>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Message</button>                
                  </Link>
                </div>
              ))}
        </div>
          </div>
        )
      }
    </div>
  )
}

export default page