// import { openai } from '@ai-sdk/openai';
// import { streamText } from 'ai';

// // Allow streaming responses up to 30 seconds
// export const maxDuration = 30;

// export async function POST(req: Request) {
//     try {
//         // const { messages } = await req.json();
//         const prompt = "tell jokes"
//         // "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";
//         const result = await streamText({
//             model: openai('gpt-3.5-turbo-instruct'),
//             prompt,
//         });
       
//         console.log("Result",result);
//         return result.toAIStreamResponse();
        
//     } catch (error:any) {
//         console.log("Error generating message:-",error)
//         return Response.json({
//             success:false,
//             message:"Error generating message",
//             error:error.message,
//         })
//     }
import OpenAi from 'openai'

const openai = new OpenAi({
    apiKey:process.env.OPENAI_API_KEY
})
export async function POST(request:Request){
    try {
        const completion = await openai.chat.completions.create({
            messages:[{role:'user', content:'Tell me jokes'}],
            model:'dall-e-3text-embedding-3-small'
        })
        return Response.json({
            success:true,
            message:completion
        })
    } catch (error:any) {
        console.log("Error generating message:-",error)
        return Response.json({
            success:false,
            message:"Error generating message",
            error:error.message,
        })
    }
}
