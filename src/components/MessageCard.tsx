'use client'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import dayjs from 'dayjs'
import { X } from "lucide-react"
import { Message } from "@/model/User"
import axios, { AxiosError } from "axios"
import toast from "react-hot-toast"
import { ApiResponse } from "@/types/ApiResponse"
import { useEffect } from "react"
import { Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react'
type MessageCardProps = {
  message:Message;
  onMessageDelete: (messageId: string) => void;
  isLoaded:boolean
}
const MessageCard = ({message,onMessageDelete,isLoaded}:MessageCardProps) => {
  // console.log('Message',message)
    const handleDeleteConfirm = async () => {
        try {
          const response = await axios.delete(`api/delete-message/${message._id}`)
          toast.success(response.data.message);
          const id:any = message._id;
          onMessageDelete(id);
        } catch (error) {
          const axiosErrors = error as AxiosError<ApiResponse>
        }
    }
    useEffect(()=>{
    },[handleDeleteConfirm])
  return (
    <div>
      <Card className="card-bordered">
      <CardHeader className="flex flex-col justify-between gap-3">
        <div className="flex flex-col gap-4 justify-between">
          <div className="flex justify-between">
            <Skeleton fadeDuration={1} isLoaded={!isLoaded}>
            <p>{
              message.user ? (<p className="">Message from, {message.user}</p>)
              :(<p className="font-[400]">Messag from anonymous user</p>)
            }</p>
            </Skeleton>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                  <Skeleton fadeDuration={1} isLoaded={!isLoaded}>
                    <Button className="py-4 h-4 px-2" variant='destructive'>
                      <X className="w-5 h-5" />
                    </Button>
                  </Skeleton>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this message.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteConfirm}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <Skeleton fadeDuration={1} isLoaded={!isLoaded}>
            <CardTitle>{message.content}</CardTitle>
          </Skeleton>
          
        </div>
        <Skeleton fadeDuration={1} isLoaded={!isLoaded}>
          <div className="text-sm">
            {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
          </div>
        </Skeleton>
      </CardHeader>
      </Card>
    </div>
  )
}

export default MessageCard
