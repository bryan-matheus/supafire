import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form';

type Inputs = {
  email: string;
}

function Login() {
  const {
    register, 
    handleSubmit,
    watch, formState: {errors}
  } = useForm<Inputs>();
  const [loading, setLoading] = useState(false)
  
  const onSubmit = useCallback(() => {
  }, []);

  console.debug(watch('email'))

  return (
    <main className={"flex justify-center align-center w-screen h-screen bg-gray-900 text-white"}>
        <form onSubmit={handleSubmit(onSubmit)}
              className={"flex justify-center align-center flex-col w-3/12"}>
            <section className={"flex justify-center align-center flex-col"}>
                <label>Your best email</label>
                <input type={"email"}
                       placeholder={"jhon@doe.com"}
                       {...register('email', {required: true})} 
                       className={"w-full p-4 mt-2 bg-gray-100 rounded text-black"} />
                {errors.email && <span>{errors.email.message}</span>}
            </section>
            <button type={"submit"}
                    disabled={loading}
                    className={"w-full p-2 bg-green-500 rounded mt-4 text-white text-lg font-medium hover:bg-green-600"}>
                Send me the magic link!
            </button>
        </form>
    </main>
  );
}

export default Login;