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
type MessageCardProps = {
  message:Message;
  onMessageDelete: (messageId: string) => void;
}
const MessageCard = ({message,onMessageDelete}:MessageCardProps) => {
  // console.log('Message',message)
    const handleDeleteConfirm = async () => {
        try {
          const response = await axios.delete(`api/delete-message/${message._id}`)
          console.log("Response:",response);
          toast.success(response.data.message);
          const id:any = message._id;
          onMessageDelete(id);
        } catch (error) {
          const axiosErrors = error as AxiosError<ApiResponse>
          console.log("MessageCard AxiosErrors:-",axiosErrors);
        }
    }
    useEffect(()=>{

    },[handleDeleteConfirm])
  return (
    <Card className="card-bordered">
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle>{message.content}</CardTitle>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant='destructive'>
              <X className="w-5 h-5" />
            </Button>
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
      <div className="text-sm">
        {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
      </div>
    </CardHeader>
    <CardContent></CardContent>
  </Card>
  )
}

export default MessageCard
// 'use client'

// import React, { useState } from 'react';
// import axios, { AxiosError } from 'axios';
// // import dayjs from 'dayjs';

// import { X } from 'lucide-react';
// import { Message } from '@/model/User';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from '@/components/ui/alert-dialog';
// import { Button } from './ui/button';
// import { useToast } from '@/components/ui/use-toast';
// import { ApiResponse } from '@/types/ApiResponse';

// type MessageCardProps = {
//   message: Message;
//   onMessageDelete: (messageId: string) => void;
// };

// export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
//   const { toast } = useToast();
//   console.log("Message",onMessageDelete);
//   const handleDeleteConfirm = async () => {
//     try {
//       const response = await axios.delete<ApiResponse>(
//         `api/delete-message/${message._id}`
//       );
//       console.log('Response',response)
//       toast({
//         title: response.data.message,
//       });
//       const id:any = message._id;
//       onMessageDelete(id);
//     } catch (error) {
//       const axiosError = error as AxiosError<ApiResponse>;
//       toast({
//         title: 'Error',
//         description:
//           axiosError.response?.data.message ?? 'Failed to delete message',
//         variant: 'destructive',
//       });
//     } 
//   };
//   return (
//     <Card className="card-bordered">
//       <CardHeader>
//         <div className="flex justify-between items-center">
//           <CardTitle>{message.content}</CardTitle>
//           <AlertDialog>
//             <AlertDialogTrigger asChild>
//               <Button variant='destructive'>
//                 <X className="w-5 h-5" />
//               </Button>
//             </AlertDialogTrigger>
//             <AlertDialogContent>
//               <AlertDialogHeader>
//                 <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//                 <AlertDialogDescription>
//                   This action cannot be undone. This will permanently delete
//                   this message.
//                 </AlertDialogDescription>
//               </AlertDialogHeader>
//               <AlertDialogFooter>
//                 <AlertDialogCancel>
//                   Cancel
//                 </AlertDialogCancel>
//                 <AlertDialogAction onClick={handleDeleteConfirm}>
//                   Continue
//                 </AlertDialogAction>
//               </AlertDialogFooter>
//             </AlertDialogContent>
//           </AlertDialog>
//         </div>
//         <div className="text-sm">
//           {/* {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')} */}
//         </div>
//       </CardHeader>
//       <CardContent></CardContent>
//     </Card>
//   );
// }
// export default MessageCard;