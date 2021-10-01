import React, {useState} from 'react'
import {supabase} from '../services/SupabaseClient'

function Auth() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');

    const handleLogin = async () => {
        try {
            setLoading(true);
            const {error} = await supabase.auth.signIn({email});

            if (error) throw error;

            alert('Check your email for the login');
        } catch (err: any) {
            alert(err.error_description || err.message);
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <section>
            <form onSubmit={e => e.preventDefault()}>
                <fieldset>
                    <label>E-mail</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
                </fieldset>
                <button type="submit" onClick={handleLogin} disabled={loading}>
                    Entrar na conta
                </button>
            </form>
        </section>
    )
}

export default Auth;