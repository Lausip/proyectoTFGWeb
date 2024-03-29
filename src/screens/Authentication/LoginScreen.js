


import React, { useState, useContext } from 'react';
import Grid from '@mui/material/Grid';

import { AuthContext } from '../../context/AuthContext';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import Box from '@mui/material/Box';
import { handleRolAdmin } from '../../firebase/Auth/Auth'
import { Text, Button, Input } from "@nextui-org/react";

import logo from "../../note.webp"
import homeImage from "../../homeImage.webp"
export const LogInScreen = () => {
  const { handleLoginWithCredentials } = useContext(AuthContext)

  const [email, setEmail] = useState("");
  const [pass, setPassword] = useState("");

  const [esAdmin, setAdmin] = useState("");


  const helper = React.useMemo(() => {
    let text = "";
    let color = ""
    if (esAdmin === "nousuario") {
      text = "No existe ese usuario";
      color = "error";
    }
    if (esAdmin === "noadmin") {
      text = "No eres Admin";
      color = "error";
    }

    return {
      text: text,
      color: color,
    }

  }, [esAdmin]);

  const handleIncioSesion = async () => {

    let admin = await handleRolAdmin(email);

    setAdmin(admin);
    if (admin === "admin") {

      await handleLoginWithCredentials(email, pass)
    }
  }

  return (
    <Grid container style={{ margin: "auto", marginTop: 20 }}>
      <Grid item xs={12} md={5}>
        <img width="100%" height="100%" src={homeImage} alt="home" style={{ objectFit: 'cover', boxSizing: "border-box", borderRadius: 30, padding: "30px 50px 60px 50px" }} />
      </Grid>

      <Grid container item xs={12} sm={6} alignItems="center" style={{ justifyContent: "center" }}>
        <div>

          <Text css={{ marginLeft: 20, textGradient: "to right, #429EBD 0%, #8EAF20 60% ", fontSize: 30 }} weight="bold">
            Bienvenido de nuevo!!

          </Text>

          <Grid container style={{
            justifyContent: "center",
            alignItems: "center",
            borderWidth: "2px",
            borderRadius: 30,
            borderStyle: "solid",
            borderColor: "#8EAF20",
            paddingLeft: 60,
            paddingRight: 60,
            paddingTop: 40,
            paddingBottom: 30,
            flexDirection: "column",

          }}>
             <Grid container style={{ justifyContent: "center" }}>
   
              <img width="100" height="100" style={{  border: 20, }} alt="icono" src={logo} />
            </Grid>
            <Text css={{ textGradient: "to right, #429EBD 0%, #8EAF20 60% ", fontSize: 20 }} weight="bold">
              Inicia Sesión
            </Text>
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 5.5, }}>

              <Input status={helper.color}
                color={helper.color}
                helperColor={helper.color}
                helperText={helper.text} shadow={false} clearable size="md" data-testid="buttonsetEmail" labelPlaceholder="Email" style={{ width: 200, }} label="Email" onChange={(event) => setEmail(event.target.value)}
                contentLeft={<PersonIcon sx={{ fontSize: 25, color: "#429EBD", marginRight: 5 }} />}
              />

            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>

              <Input.Password data-testid="buttonsetPassword" shadow={false} size="md" labelPlaceholder="Contraseña" status="default" style={{ width: 160 }} label="Contraseña" type="password"
                contentLeft={<LockIcon sx={{ fontSize: 25, color: "#429EBD", marginRight: 5 }} />}
                onChange={(event) => setPassword(event.target.value)} />

            </Box>

            <Button css={{

              background: '$white',
              fontWeight: '$semibold',
              boxShadow: '$md',
              position: 'relative',
              overflow: 'visible',
              backgroundColor: '#8EAF20',
              px: '$18',
              '&:after': {
                content: '""',
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundColor: '#E39801',

                opacity: 1,
                borderRadius: '$pill',
                transition: 'all 0.4s ease'
              },
              '&:hover': {
                transform: 'translateY(-5px)',
                '&:after': {
                  transform: 'scaleX(1.5) scaleY(1.6)',
                  opacity: 0
                }
              },
              '&:active': {
                transform: 'translateY(-2px)'
              }
            }} rounded data-testid="buttonhandleIncioSesion" onPress={() => handleIncioSesion()}>
              Iniciar de Sesión
            </Button>

          </Grid>
        </div>

      </Grid>
      <Grid item sx={{ marginLeft: "auto", marginRight: "auto", marginTop: 10 }}>
        <div variant="body2" color="secondary">
          Copyright &copy; 2023 Readly by Laura Vigil Laruelo.
        </div>
      </Grid>
    </Grid >
  );


}


