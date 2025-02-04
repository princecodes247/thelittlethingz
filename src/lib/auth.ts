import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { client } from "@/db";
 
export const auth = betterAuth({
    database: mongodbAdapter(client.db()),
    emailAndPassword: {  
        enabled: true
    },
    accountLinking: {
        enabled: true,
        trustedProviders: ["google", "github"]
    }
    // socialProviders: { 
    //    github: { 
    //     clientId: process.env.GITHUB_CLIENT_ID, 
    //     clientSecret: process.env.GITHUB_CLIENT_SECRET, 
    //    } 
    // },
});