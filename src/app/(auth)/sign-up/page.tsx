'use client'

import {useEffect, useState } from "react"
import axios,{AxiosError} from 'axios'
import Link from "next/link"
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { z } from "zod"
import { useForm } from 'react-hook-form';
import { useDebounceCallback } from 'usehooks-ts'
import { useRouter } from "next/navigation";
import { signUpschema } from "@/schemas/signUpSchema";
import { ApiResponse } from "@/types/ApiResponse";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input"
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IoIosEyeOff } from "react-icons/io";
import { IoIosEye } from "react-icons/io";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash  } from "react-icons/fa";
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";



const page = () => {
    const [userName, setuserName] = useState('')
    const [userMessage, setUserMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [pass,setPass] = useState(false);
    // console.log('userName',userName)
    const debounced = useDebounceCallback(setuserName, 300);
    
    const router = useRouter();
    // zod implimentation
    console.log('username',userName)
    const form = useForm<z.infer<typeof signUpschema>>({
      resolver:zodResolver(signUpschema),
      defaultValues:{
        userName:'',
        email:'',
        password:'',
      }
    })
    const checkUniqueUsername = async ()=>{
      if(userName){
        setIsCheckingUsername(true);
        setUserMessage('');
        try {
          const response = await axios.get(`/api/check-user-unique?userName=${encodeURIComponent(userName)}`)
          setUserMessage(response.data.message);
        } catch (error) {
          const axiosErrors = error as AxiosError<ApiResponse>
          setUserMessage(axiosErrors.response?.data.message ?? "Error while ckecking username")
        }finally{
          setIsCheckingUsername(false);
        }
      }
      }
    useEffect(()=>{
      checkUniqueUsername();
      if (userName.trim() === '') {
        setUserMessage('');
      }
    },[userName])
    const onSubmit = async (data:z.infer<typeof signUpschema>)=>{
      setSubmitting(true);
      try {
        const response = await axios.post('/api/sign-up', data)
        toast.success('Sign Up Successfully');
        router.replace(`/verify/${userName}`)
        setSubmitting(false);
      } catch (error) {
        const axiosErrors = error as AxiosError<ApiResponse>
        if (axiosErrors.response && axiosErrors.response.data && axiosErrors.response.data.message) {
          toast.error(axiosErrors.response.data.message);
        }
        setSubmitting(false);   
      }
    }
  return (
    <div className="flex overflow-hidden justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-3 md:mb-6">
            Join Anonymous message
          </h1>
          <p className="md:mb-4">Sign up to start your anonymous adventure</p>
        </div>
       <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}  className="space-y-6">
          <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} 
                onChange={(e)=>{
                  field.onChange(e)
                  debounced(e.target.value);
                }}/>
              </FormControl>
              <p>
                {
                 isCheckingUsername &&<Loader2 className="h-4 w-4 animate-spin"/>
                }
              </p>
                <p className={`text-sm ${userMessage === "UserName is unique" ?"text-green-500":"text-red-500"}`}>
                  {
                    !userMessage?<FormMessage/>:userMessage
                  }
                </p>
                
            </FormItem>
          )}
          />
          <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
          <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex  gap-3">
              <FormLabel>Password </FormLabel>
              <p>
              {
                pass?(<IoEye onClick={()=>{setPass(!pass)}} className="cursor-pointer"/>):(<IoMdEyeOff  onClick={()=>{setPass(!pass)}} className="cursor-pointer"/>)
              }
              </p> 

              </div>
              <FormControl>
                <Input type={`${pass?'text':'password'}`} className="relative" placeholder="" {...field} >
                </Input>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
         
          <Button className="w-full" type="submit" disabled={submitting}>
            { submitting ? (<><Loader2 className="mr-2 animate-spin"/> please Wait...</>) : ('Signup')}
          </Button>
          </form>
       </Form>
       <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>

  )
}
export default page

