'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { messageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Textarea } from '@/components/ui/textarea';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {z} from 'zod'
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import data from '../../../../src/data'

const page = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const messagesPerPage = 3;
  const startIndex = currentPage * messagesPerPage;
  const endIndex = startIndex + messagesPerPage;
  const currentMessages = data.slice(startIndex, endIndex);
  const fetchSuggestMessage = ()=>{
    if (endIndex < data.length) {
      setCurrentPage(currentPage + 1);
    }else{
      setCurrentPage(0);
    }
  }
    const params = useParams();
    const username = params.username;
    console.log("username",username)
    const [isLoading, setIsLoading] = useState(false);
    const [sugegstLoading, setSugegstLoading] = useState(false);
    const form = useForm({
      resolver:zodResolver(messageSchema),
      defaultValues:{
        content:''
      }
    })
    const messageContent = form.watch('content');
    console.log('MesageContent',messageContent)
    const onSubmit = async (data:z.infer<typeof messageSchema>) =>{
      console.log("data",data)
      console.log("Username",username)
      try {
          setIsLoading(true)
          const response = await axios.post<ApiResponse>('/api/send-message',{
            username,
            content:data.content,
          })
          console.log('res',response)
          // if(response)
          toast.success(response.data.message)
        // }
      } catch (error) {
            const axiosErrors = error as AxiosError<ApiResponse>
            console.log("axiosErrros:-",axiosErrors);
            if (axiosErrors.response && axiosErrors.response.data && axiosErrors.response.data.message) {
              toast.error(axiosErrors.response.data.message);
            }else{
              toast.error("Internal server error")
            }
      }finally{
        setIsLoading(false);
      }
    }
    // const fetchSuggestMessage = async ()=>{
    //   try {
    //     setSugegstLoading(true);
    //     const res = await axios.get('/api/');
    //     const r = res.data.message;
    //     const f = r.split('||');
    //     setData(f);
    //     console.log('res:-',f)
    //   } catch (error) {
    //     console.log('error occured')
    //   }finally{
    //     setSugegstLoading(false)
    //   }
    // }
    const handleMessageClick = (message:string)=>{
      form.setValue('content',message)
    }
  return (
    
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading || !messageContent}>
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>

      <div className="space-y-4 my-8">
        <div className="space-y-2">
          <Button
            onClick={fetchSuggestMessage}
            className="my-4"
            disabled={sugegstLoading}
          >
            Suggest Messages
          </Button>
          <p>Click on any message below to select it.</p>
        </div>
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {
              currentMessages.map((message:any, index:any) => (
                <Button
                  key={index}
                  variant="outline"
                  className="mb-2 text-wrap h-fit"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </Button>
              ))
            }
          </CardContent>
        </Card>
      </div>
      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={'/sign-up'}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  )
}

export default page