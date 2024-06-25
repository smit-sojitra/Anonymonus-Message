
import { Skeleton } from "@/components/ui/skeleton"

const Loading = () => {
  return (
    <di className="bg-blue-950 h-screen w-screen flex justify-center items-center">
        <Skeleton className="w-[100px] h-[20px] rounded-full" />
    </di>
  )
}

export default Loading