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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { ApiResponse } from "@/types/ApiResponse";
import { verifySchema } from "@/schemas/verifyschema";
import { useParams, useRouter } from "next/navigation";


const page = () => {
    const [submitting,setSubmitting] = useState(false);
    const params = useParams<{userName:string}>()
    const name = params.userName;
    const router = useRouter();
    // console.log("Params",params)
    const form = useForm({
        resolver:zodResolver(verifySchema),
        defaultValues:{
            code:'',
        }
    })
    const onSubmit = async (data:z.infer<typeof verifySchema>)=>{
        try {
            setSubmitting(true);
            const response = await axios.post('/api/verify-code',{
              code:data.code,
              username:name,
            });
            console.log('Response',response);
            toast.success("Account verified successfully");
            router.replace('/');
        } catch (error) {
            const axiosErrors = error as AxiosError<ApiResponse>
        if (axiosErrors.response && axiosErrors.response.data && axiosErrors.response.data.message) {
          toast.error(axiosErrors.response.data.message);
        }
            console.log("axiosErrors:",axiosErrors);
        }finally{
            setSubmitting(false);
        }
    }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
        Verify Your Accountk
        </h1>
        <p className="mb-4">Enter the verification code sent to your email</p>
      </div>
     <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}  className="space-y-6">
          <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <Input type='text' placeholder="enter your code" {...field} >
                </Input>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
           <Button type="submit" >
            { submitting ? (<><Loader2 className="mr-2 animate-spin"/> please Wait...</>) : ('Signin')}
          </Button>
          </form>
       </Form>
      </div>
    </div>
  )
}

export default page