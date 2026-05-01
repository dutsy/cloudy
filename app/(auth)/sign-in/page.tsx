import EmailPasswordDemo from './EmailPasswordDemo';
import { createSupabaseServerClient } from '@/lib/supabase/server-client';
import GoogleLoginDemo from './googleLoginDemo';
import { Metadata } from 'next';
import { title } from 'process';

export const metadata:Metadata = {
    title: 'Sign In'
}


export default async function EmailPasswordPage() {
    
    const supabase = await createSupabaseServerClient();
    const {data: {user}, } = await supabase.auth.getUser();


      
    return (<div>
        <EmailPasswordDemo user={user} />
        

    </div>);;
}