import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form';
import { supabase } from '../../services/SupabaseClient';

type Inputs = {
  email: string;
}

function Login() {
  const {
    register, 
    handleSubmit,
    formState: {errors}
  } = useForm<Inputs>();
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const onSubmit = useCallback(async ({email}) => {
    try {
      setLoading(true)
      const {  error } = await supabase.auth.signIn({ email })

      if (error) throw error

      setSuccess(true)
    } catch (error: any) {
      alert(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }, []);

  return (
    <main className={"flex justify-center align-center w-screen h-screen bg-gray-900 text-white"}>
        <form onSubmit={handleSubmit(onSubmit)}
              className={"flex justify-center align-center flex-col w-3/12"}>
            {success ? (
              <p className={"text-xl text-purple-600 font-semibold mb-8"}>Check your email for the login link!</p>
              ) : <>
              <h1 className={"text-3xl font-semibold mb-8 capitalize"}>Sign In</h1>
              <section className={"flex justify-center align-center flex-col"}>
                  <label className={"text-gray-400"}>Your email</label>
                  <input type={"email"}
                        placeholder={"jhon@doe.com"}
                        {...register('email', {required: true})} 
                        className={"w-full p-4 mt-2 bg-gray-100 rounded text-black focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"} />
                  {errors.email && <span>{errors.email.message}</span>}
              </section>
              <button type={"submit"}
                      disabled={loading}
                      className={"bg-purple-600 rounded-lg mt-4 p-4 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"}>
                  Send me the magic link
              </button>
            </>}
        </form>
    </main>
  );
}

export default Login;