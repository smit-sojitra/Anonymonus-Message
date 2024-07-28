const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function GET(request:Request) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

        const prompt = "This is the prompt please follow the instructions.Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.Make sure response should be unique each time"
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log(text);
        return Response.json({
            success:true,
            message:text,
        })
    } catch (error) {
        console.log('Error generating message',error)
        return Response.json({
            success:false,
            message:"Error",
            Error:error,
        })
    }
  // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
  
}
