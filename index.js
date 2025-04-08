import { GoogleGenAI } from "@google/genai";
import colors from 'colors';
import readlineSync from 'readline-sync';
import fs from 'fs';
import { configDotenv } from "dotenv";

configDotenv();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const logFile = 'chatlog.txt';

function logToFile(role, message) {
  const logEntry = `[${new Date().toLocaleString()}] ${role}: ${message}\n`;
  fs.appendFileSync(logFile, logEntry);
}
async function main() {
    //Starter 
    console.log(colors.bold.green('Welcome to the Chatbot!'))
    console.log(colors.bold.blue('Start Chatting with the app...'))
    console.log(colors.bold.red('Type exit to stop the chat.'))
    
    //Array to store chat history 
    const chatHistory = [];
    
    //Continuous user chatting unit exit
    while(true){
        const userinput = readlineSync.question(colors.yellow('You: '));
        try {
            //Send stored messages to the model
            const messages = chatHistory.map(([role, content]) => ({
                role,
                parts: [{ text: content }],
            }));
            messages.push({
                role: "user",
                parts: [{ text: userinput }],
            });
            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents : messages,
            });
            console.log(colors.green('Bot: ')+ response.text);

            //type exit to kill the program
            if(userinput.toLowerCase().includes('exit')){
                console.log(colors.bold.blue('Feel free to ask me any questions!'))
                break;
            }
            //update the chat history
            chatHistory.push(['user', userinput]);
            chatHistory.push(['model', response.text]);

            //Adding the chat history to the log file
            logToFile('User', userinput);
            logToFile('Model',  response.text);

        } catch (error) {
           console.error(colors.red(error)) 
        }
    }

}
main()
