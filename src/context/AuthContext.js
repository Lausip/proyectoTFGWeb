import { createContext, useEffect, useState } from 'react'
import { loginWithCredentials, logoutFirebase, onAuthStateHasChanged } from '../firebase/Auth/Auth'


const initialState= {
    userId: null,
    status: 'checking'
}

export const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {

    const [session, setSession] = useState(initialState)

    useEffect(() => {
        onAuthStateHasChanged(setSession)
    }, [])

    const handleLogOut = async () => {
        logoutFirebase()
        setSession({ userId: null, status: 'no-authenticated' })
    }

    const validateAuth = (userId) => {
        if (userId) return setSession({ userId, status: 'authenticated' })
        handleLogOut()

    }

    const checking = () => setSession(prev => ({ ...prev, status: 'checking' }))


    const handleLoginWithCredentials = async (email,password ) => {
        checking()
        const userId = await loginWithCredentials({ email, password })
        validateAuth(userId)
    }

/*     const handleRegisterWithCredentials = async (password, email) => {
        checking()
        const userId = await signInWithCredentials({ email, password })
        validateAuth(userId)
    }
 */
    return (
        <AuthContext.Provider
            value={{
                ...session,
                handleLoginWithCredentials,
                handleLogOut
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
