


import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import Box from '@mui/material/Box';
import { handleRolAdmin } from '../../firebase/Auth/Auth'
import { Text, Button, Input } from "@nextui-org/react";


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
    <Grid container style={{ margin: "auto" }}>
      <Grid item xs={12} md={5}>
        <img src="https://firebasestorage.googleapis.com/v0/b/tfgbook-f69af.appspot.com/o/homeImage.png?alt=media&token=c815f4a6-47f5-4fa6-a6ba-e7cff6992578" alt="home" style={{ width: '100%', minHeight: '110%', objectFit: 'cover', boxSizing: "border-box", borderRadius: 30, padding: "30px 50px 60px 50px" }} />
      </Grid>

      <Grid container item xs={12} sm={6} alignItems="center" style={{ justifyContent: "center" }}>
        <div>

          <Text css={{ textGradient: "to right, #429EBD 0%, #8EAF20 60% ", fontSize: 30 }} weight="bold">
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
              <img style={{ width: 100, border: 20, }} alt="icono" src="https://firebasestorage.googleapis.com/v0/b/tfgbook-f69af.appspot.com/o/note.png?alt=media&token=27c45720-e755-426d-ac8a-1a8aab74c7b5" />
            </Grid>
            <Text css={{ textGradient: "to right, #429EBD 0%, #8EAF20 60% ", fontSize: 20 }} weight="bold">
              Inicia Sesión
            </Text>
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 5.5, }}>

              <Input status={helper.color}
                color={helper.color}
                helperColor={helper.color}
                helperText={helper.text} shadow={false} clearable size="md" data-testid= "buttonsetEmail" labelPlaceholder="Email" style={{ width: 200, }} label="Email" onChange={(event) => setEmail(event.target.value)}
                contentLeft={<PersonIcon sx={{ fontSize: 25, color: "#429EBD", marginRight: 5 }} />}
              />

            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>

              <Input.Password data-testid= "buttonsetPassword" shadow={false} size="md" labelPlaceholder="Contraseña" status="default" style={{ width: 160 }} label="Contraseña" type="password"
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
            }} rounded  data-testid= "buttonhandleIncioSesion"  onPress={() => handleIncioSesion()}>
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


