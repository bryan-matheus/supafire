import React, { useCallback, useState } from 'react'

function Login() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  
  const handleLogin = useCallback(() => {
  }, []);

  return (
    <main className={"flex justify-center align-center w-screen h-screen"}>
        <form onSubmit={e => e.preventDefault()}>
            <section>
                <label>E-mail</label>
                <input type={"email"} value={email} onChange={e => setEmail(e.target.value)} />
            </section>
            <button type={"submit"} onClick={handleLogin} disabled={loading}>
                Entrar na conta
            </button>
        </form>
    </main>
  );
}

export default Login;