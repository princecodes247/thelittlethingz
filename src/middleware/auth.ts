/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"
import { auth } from "@/lib/auth";
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

let globalSession: any = null;
export async function isAuth(args?: {invert?:boolean}) {
    const session = globalSession ?? await auth.api.getSession({ headers: await headers() });

    if(args?.invert && session) return redirect("/user")

    if (!session) {
        // NextResponse.redirect(new URL('http://localhost:3000/login'));

        return redirect("/login")
    }

    globalSession = session
    return session;
}