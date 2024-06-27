'use client'
import {useEffect, useState } from "react"
import axios,{AxiosError} from 'axios'
import Link from "next/link"
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { z } from "zod"
import { useForm } from 'react-hook-form';
import { signInSchema } from "@/schemas/signInSchema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { ApiResponse } from "@/types/ApiResponse";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";


const Page = () => {
    const [submitting,setSubmitting] = useState(false);
    const router = useRouter()
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver:zodResolver(signInSchema),
        defaultValues:{
            identifier:'',
            password:'',
        }
    })
    const onSubmit = async (data:z.infer<typeof signInSchema>)=>{
        try {
          setSubmitting(true);
            // const response = await axios.post('/api/sign-in',data)
            // console.log("Response:-",response);
            const response = await signIn('credentials',{
              redirect:false,
              identifier:data.identifier,
              password:data.password
            })

            // if(response?.ok){
            //   console.log('Dashboard')
            //   router.replace('/dashboard');
            //   toast.success("User signin successfully");
            // }else{
            //   if(response?.error)
            //   toast.error(response?.error)           
            // }
            if (response?.error) {
              if (response.error === 'CredentialsSignin') {
                toast.error(response?.error)
              } else {
                toast.error(response?.error)
              }
            }
            if (response?.url) {
              toast.success("User signin successfully")
              router.replace('/dashboard');
            }          
        } catch (error) {
            const axiosErrors = error as AxiosError<ApiResponse>
            if (axiosErrors.response && axiosErrors.response.data && axiosErrors.response.data.message) {
              toast.error(axiosErrors.response.data.message);
            }else{
              toast.error("Internal server error")
            }
          }finally{
            setSubmitting(false);
          }
    }
    
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
        Welcome Back to Anonymous message
        </h1>
        <p className="mb-4">Sign in to continue your secret conversations</p>
      </div>
     <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}  className="space-y-6">
        <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username/Email</FormLabel>
              <FormControl>
                <Input placeholder="" {...field}/>
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type='password' placeholder="" {...field} >
                </Input>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
          <Button className="w-full"  type="submit" disabled={submitting}>
            { submitting ? (<><Loader2 className="mr-2 animate-spin"/> please Wait...</>) : ('Signin')}
          </Button>
          </form>
       </Form>
       <div className="text-center mt-4">
          <p>
            Not a member yet?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page
