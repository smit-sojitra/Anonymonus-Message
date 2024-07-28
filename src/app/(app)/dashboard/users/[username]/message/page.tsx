'use client'
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Loader2, RefreshCcw } from 'lucide-react';
import { useParams } from 'next/navigation'
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { messageSchema } from '@/schemas/messageSchema';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import data from "@/data"
import axios from 'axios';
import {z} from "zod"
import toast from 'react-hot-toast';
const page = () => {
  const {data:session} = useSession();
  const user = session?.user
  const [currentPage, setCurrentPage] = useState(0);
  const messagesPerPage = 3;
  const startIndex = currentPage * messagesPerPage;
  const endIndex = startIndex + messagesPerPage;
  const currentMessages = data.slice(startIndex, endIndex);
  const [isLoading, setIsLoading] = useState(false);
  const {username} = useParams();
  const form = useForm({
    resolver:zodResolver(messageSchema),
    defaultValues:{
      content:''
    }
  })
  const messageContent = form.watch('content');
  const fetchSuggestMessage = ()=>{
    if (endIndex < data.length) {
      setCurrentPage(currentPage + 1);
    }else{
      setCurrentPage(0);
    }
  }
  const handleMessageClick = (message:any) =>{
    form.setValue('content',message)
  }
  const onSubmit = async (data:z.infer<typeof messageSchema>)=>{
    setIsLoading(true);
    try {
      console.log('data',data)
      const response = await axios.post('/api/messageToUser',{
        sender:user?.username,
        username:username,
        content:data.content,
      })
      console.log('es',response)
      toast.success("Message send successfully");
    } catch (error) {
      
    }finally{
      setIsLoading(false)
    }
      
  }
  return (
    <div className='min-h-screen flex-col flex  items-center '>
      <Navbar/>
        <div className='w-11/12 max-w-4xl'>
        <h1 className="text-4xl font-bold mb-6 text-center">
        Message Link
       </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send  Message from {user?.username} to @{username}</FormLabel>
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
            // disabled={sugegstLoading}
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
    </div>
  )
}

export default page