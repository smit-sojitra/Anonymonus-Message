'use client'
import MessageCard from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from "@/components/ui/use-toast";
import { Message } from "@/model/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";


const page = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setisLoading] = useState(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState(false)
    // const {toast as t} = useToast();
    const handleDeletMessage = (messageId:string)=>{
        setMessages(messages.filter((message)=>message._id !== messageId))
    }
    const{data:session} = useSession();
    const form = useForm({
        resolver:zodResolver(acceptMessageSchema),
    })
    console.log('Dashboard session:-',session)
    // console.log('Form:',form)
    const {register,watch,setValue} = form;
    const acceptMessages = watch('acceptMessages');

    const fetchAcceptMessage = useCallback(async ()=>{
        setIsSwitchLoading(true);
        try {
            const response = await axios.get<ApiResponse>('/api/accept-messages')
            setValue('acceptMessages',response.data.isAcceptingMessages)
        } catch (error) {
            const axiosErrors = error as AxiosError<ApiResponse>
            console.log("axiosErrros:-",axiosErrors);
            if (axiosErrors.response && axiosErrors.response.data && axiosErrors.response.data.message) {
              toast.error(axiosErrors.response.data.message);
            }else{
              toast.error("Internal server erorr")
            }
          }finally{
            setIsSwitchLoading(false);
          }
    },[setValue])

    const fetchMessages = useCallback(async (refresh:boolean=false)=>{
        setisLoading(true);
        setIsSwitchLoading(false);
        try {
          console.log('dteched')
            const response = await axios.get('/api/get-messages');
            setMessages(response.data.messages || []);
            console.log('Refesh',refresh)
            if(refresh){
                toast.success("Showing refreshed messages")
            }
            if(response.status !== 203){
              toast.success(response.data.message);
            }
        } catch (error) {
            const axiosErrors = error as AxiosError<ApiResponse>
            console.log("axiosErrros:-",axiosErrors);
            if (axiosErrors.response && axiosErrors.response.data && axiosErrors.response.data.message) {
              toast.error(axiosErrors.response.data.message);
            }else{
              toast.error("Internal server erorr")
            }
          }finally{
            setisLoading(false)
            setIsSwitchLoading(false);
          }
    },[setMessages])
    useEffect(()=>{
        if(!session || !session.user) return;
        fetchAcceptMessage();
        fetchMessages();
    },[session, fetchAcceptMessage, fetchMessages]);

    const handleSwitchChange = async ()=>{
        try {
            const response = await axios.post<ApiResponse>('/api/accept-messages',{
                acceptMessages:!acceptMessages
            })
            setValue('acceptMessages',!acceptMessages)
            toast.success(response.data.message);
        } catch (error) {
            const axiosErrors = error as AxiosError<ApiResponse>
            console.log("axiosErrros:-",axiosErrors);
            if (axiosErrors.response && axiosErrors.response.data && axiosErrors.response.data.message) {
              toast.error(axiosErrors.response.data.message);
            }else{
              toast.error("Internal server erorr")
            }
          }
    }
    
    const {username} = session?.user ?? {username:''};
    const baseUrl = `${window.location.protocol}//${window.location.host}`
    const profileUrl = `${baseUrl}/u/${username}`
    const copyToClipboard = ()=>{
        navigator.clipboard.writeText(profileUrl)
        toast.success("Url copied to clipboard")
    }
    if(!session || !session.user){
        return <div>Please Login</div>
    }
  return (
    <div className="my-8 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full overflow-hidden max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id as string}
              message={message}
              onMessageDelete={handleDeletMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  )
}
export default page