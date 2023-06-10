import { useContext } from "react"
import React from 'react'
import { AuthContext } from '../context/AuthContext';
import { HomeScreen } from "./HomeScreen";
import { LogInScreen } from "./Authentication/LoginScreen";
import { Text} from "@nextui-org/react";

export const AuthScreen = () => {

  const { status, userId } = useContext(AuthContext)

  if (status === 'checking') return (
    <div style={{ margin: "auto" }}>
      <Text css={{ textGradient: "to right, #429EBD 0%, #8EAF20 60% ", fontSize: 20 }} weight="bold">
       Comprobando credenciales, espere un momento...
      </Text>
    </div>
  );
  return (
    <main  >

      {
        (status === 'authenticated' && userId)
          ? <HomeScreen />
          : <LogInScreen />
      }
    </main>
  )
}
