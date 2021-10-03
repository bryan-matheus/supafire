import { useState, useEffect } from 'react'
import { supabase } from '../services/SupabaseClient'
import Login from '../components/auth/Login'
import Account from '../components/me/Account'
import { Session } from '@supabase/supabase-js'

export default function Home() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    setSession(supabase.auth.session())

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <div className={"w-screen h-screen flex justify-center align-center bg-gray-900"}>
      {!session ? <Login /> : <Account key={session?.user?.id} session={session} />}
    </div>
  )
}