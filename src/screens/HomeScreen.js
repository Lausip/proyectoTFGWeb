import React, { useState, useEffect ,useContext} from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import InboxIcon from '@mui/icons-material/Inbox';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import PersonIcon from '@mui/icons-material/Person';
import { AuthContext } from '../context/AuthContext';
import StarBorder from '@mui/icons-material/StarBorder';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import Collapse from '@mui/material/Collapse';
import TextsmsIcon from '@mui/icons-material/Textsms';
import EmailIcon from '@mui/icons-material/Email';
import { Box, Divider, List, ListItem, ListItemText, Typography, Button, Modal } from "@mui/material";
import { Text,Avatar } from "@nextui-org/react";
import { getUserAuth } from '../firebase/Auth/Auth'
import { getFotoPerfil, getTodosReportes, eliminarReporte, eliminarLibro,bloquearPersona, eliminarComentario, enviarAvisoLibro, getFavReportes, addFavReporte, removeFavReporte, getFavReportesEmail, getEmailComentarioTexto } from '../firebase/Auth/Firestore'
import Grid from '@mui/material/Grid';

import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import BookIcon from '@mui/icons-material/Book';

import GradeIcon from '@mui/icons-material/Grade';

export const HomeScreen = () => {
  const [open, setOpen] = React.useState(true);
  const [emailSeleccionado, setEmailSeleccionado] = useState("");
  const [emails, setEmails] = useState([]);


  const [fotoPerfil, setFotoPerfil] = useState("");
  const [fotoPerfilEmail, setFotoPerfilEmail] = useState("");
  const [email, setEmail] = useState("");

  const [emailComentarioTexto, setEmailComentarioTexto] = useState("");
  const [favReportes, setFavReportes] = useState([]);
  const [modalEliminarLibro, setModalEliminarLibro] = useState(false);
  const [modalEliminarComentario, setModalEliminarComentario] = useState(false);
  const [modalEliminarPersona, setModalEliminarPersona] = useState(false);
  const [estaEnMegusta, setEstaEnMegusta] = useState(true);
  const [filtro, setFiltro] = useState("");
  /* istanbul ignore next */
  const handleClick = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const cogerCosas = async () => {
      let e = await getUserAuth();
      setEmail(e);
      setFotoPerfil(await getFotoPerfil(e));
      cogerTodosLosEmail();
      setFavReportes(await getFavReportes(e))
    };
    cogerCosas();
  }, []);

 
/* istanbul ignore next */
  const handleEmailClick = async (emailS) => {
    setModalEliminarLibro(false)
    setEmailSeleccionado(emailS);
    setFotoPerfilEmail(await getFotoPerfil(emailS.Autor));
    const foundObject = favReportes.find(obj => obj === emailS.key);
    setEstaEnMegusta(foundObject);

    if (emailS.Tipo === "Comentario") {

      setEmailComentarioTexto(await getEmailComentarioTexto(emailS.Libro, emailS.Capitulo, emailS.Comentario));
    }
  };

  const { handleLogOut } = useContext(AuthContext)

/* istanbul ignore next */
  const eliminarLibroDefinitivo = async () => {
    await eliminarReporte(email, email.key)
    await enviarAvisoLibro(emailSeleccionado.Autor, email);
    await eliminarLibro(emailSeleccionado);
    setModalEliminarLibro(false)
    cogerTodosLosEmail();

  };
/* istanbul ignore next */
  const eliminarComentarioDefinitivo = async (emailS) => {

    await eliminarReporte(email, emailS.key)
    await eliminarComentario(emailSeleccionado)
    setModalEliminarComentario(false);
    cogerTodosLosEmail();

  };
  /* istanbul ignore next */
  const bloquearPersonaDefinitivo = async (emailS) => {

    await eliminarReporte(email, emailS.key)
    await bloquearPersona(emailSeleccionado)
    setModalEliminarPersona(false);
    cogerTodosLosEmail();

  };
/* istanbul ignore next */
  const rechazarLibro = async (email) => {
    await eliminarReporte(email, email.key)
  };

  const cogerReportesTipo = async (tipo) => {
    setEmailSeleccionado("");
    setFiltro(tipo)
    let e = await getTodosReportes()
    setEmails(e.filter(function (task) {
      return task.Tipo === tipo;
    }))
    setFiltro(tipo)

  };
/* istanbul ignore next */
  const añadirAFavReporte = async (key) => {
    await addFavReporte(email, key);
    setFavReportes(await getFavReportes(email));
    setEmails(await getFavReportesEmail(email))
    setEstaEnMegusta(true);
  };
  const cogerFavReportes = async () => {
    setEmailSeleccionado("");
    setEmails(await getFavReportesEmail(email))
    setFiltro("Favoritos")

  }
/* istanbul ignore next */
  const eliminarAFavReporte = async (key) => {
    await removeFavReporte(email, key);
    setFavReportes(await getFavReportes(email));
    setEmails(await getFavReportesEmail(email))
    setEstaEnMegusta(false);
  };

  const cogerTodosLosEmail = async () => {
    setEmailSeleccionado("");
    setEmails(await getTodosReportes());
    setFiltro("");

  };

  const InboxList = () => {
    return (
      <Box
        style={{

          display: "flex",
          marginTop: 80,
          marginLeft: 40,
          flexDirection: 'column',
        }}>

        <Avatar
          css={{ width: 150, height: 150, marginBottom: 10, margin: "auto" }} size="xl"
          src={fotoPerfil}
          color="warning"
          bordered

        />

        <Text css={{ margin: "auto", marginTop: 10, marginBottom: 10, textGradient: "to right, #429EBD 0%, #8EAF20 100% ", fontSize: 20 }} weight="bold">
          {email.split("@")[0]}
        </Text>

        <Box sx={{
          backgroundColor: "#fff",
          margin: "auto",
          width: 280,
          borderRadius: 5,
          boxShadow: "5px 10px #8EAF20",
          padding: 2,
          border: "1px solid",
          borderColor: "#8EAF20",

        }}>
          <List component="nav" aria-label="main mailbox folders" >
            <ListItemButton onClick={handleClick} sx={{
              '&:hover': {
                backgroundColor: "#EEF7D5",
              },
            }}>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="Bandeja de entrada" />
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton data-testid= "buttoncogerTodosLosEmail" sx={{ pl: 4, '&:hover': { backgroundColor: "#EEF7D5", } }} onClick={() => cogerTodosLosEmail()} >
                  <ListItemIcon>
                    <EmailIcon />
                  </ListItemIcon>
                  <ListItemText primary="Todos" />
                </ListItemButton>
                <ListItemButton data-testid= "buttoncogerReportesTipo" sx={{ pl: 4, '&:hover': { backgroundColor: "#EEF7D5", } }} onClick={() => cogerReportesTipo("Persona")} >
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary="Personas" />
                </ListItemButton>
                <ListItemButton sx={{ pl: 4, '&:hover': { backgroundColor: "#EEF7D5", } }} >
                  <ListItemIcon>
                    <TextsmsIcon />
                  </ListItemIcon>
                  <ListItemText data-testid= "buttoncogerReportesTipoComentario" primary="Comentarios" onClick={() => cogerReportesTipo("Comentario")} />
                </ListItemButton>
                <ListItemButton data-testid= "buttoncogerReportesTipoLibro" sx={{ pl: 4, '&:hover': { backgroundColor: "#EEF7D5", } }} onClick={() => cogerReportesTipo("Libro")}>
                  <ListItemIcon>
                    <BookIcon />
                  </ListItemIcon>
                  <ListItemText primary="Libros" />
                </ListItemButton>
              </List>
            </Collapse>
          </List>
          <ListItemButton data-testid= "buttoncogerFavReportes" sx={{ '&:hover': { backgroundColor: "#EEF7D5", } }} onClick={() => cogerFavReportes()}>
            <ListItemIcon>
              <StarBorder/>
            </ListItemIcon>
            <ListItemText primary="Favoritos" />
          </ListItemButton>
          <Divider />
          <List component="nav" aria-label="secondary mailbox folder">
            <ListItemButton  data-testid= "buttonhandleLogOut" onClick={() => handleLogOut()} sx={{ '&:hover': { backgroundColor: "#EEF7D5", } }}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>

              <ListItemText primary="Cerrar sesión" />
            </ListItemButton>

          </List>
        </Box>
      </Box >
    );
  };
  /* istanbul ignore next */
  function EmailDetailLibro({ email }) {
    return (
      <Box style={{ display: "flex", marginTop: 50, flexDirection: "column", marginLeft: 40 }}>

        <Modal style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',

        }} open={modalEliminarLibro} onClose={() => setModalEliminarLibro(false)}>
          <div style={{
            width: 400, height: 200, backgroundColor: 'white', padding: 16, borderRadius: 5,
            boxShadow: "5px 10px #8EAF20",
            border: "1px solid",
            borderColor: "#8EAF20",

          }}>
            <div style={{
              padding: 10, maring: "auto"

            }}>
              <h2 >¿Seguro que quieres eliminar el libro?</h2>
              <p style={{
                marginLeft: 30,

              }}>Mandaremos un correo al autor</p>
              <Box
                style={{
                  flexDirection: 'row',
                  marginTop: 20,
                  marginLeft: 50,
                }}>
                <Button variant="contained" style={{ backgroundColor: "#DA4646", borderRadius: 20, marginRight: 10 }} onClick={() => eliminarLibroDefinitivo()}>
                  Eliminar
                </Button>
                <Button variant="contained" style={{ backgroundColor: "#E39801", borderRadius: 20, marginLeft: 10 }} onClick={() => setModalEliminarLibro(false)}>
                  Cerrar
                </Button>

              </Box>
            </div>
          </div>
        </Modal>

        <Box style={{ flexDirection: "row" }}>

          <Typography sx={{ marginBottom: 1, fontSize: 25, color: "#429EBD", fontWeight: "bold" }} >{email.Motivo}:
            <Typography sx={{ color: "#000", }} variant="h7"> {email.Tipo} </Typography>

            {!estaEnMegusta ?
              <Button onClick={() => añadirAFavReporte(email.key)} >
                <StarBorderIcon style={{ color: "#E39801" }} />
              </Button>
              : <Button onClick={() => eliminarAFavReporte(email.key)}>
                <GradeIcon style={{ color: "#E39801" }} />
              </Button>}

          </Typography>



          <Typography sx={{ marginLeft: 5, }} variant="h7">De: {email.Autor}</Typography>
        </Box>

        <Box style={{
          marginLeft: 30, marginTop: 10, boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
          borderRadius: '4px', padding: 16, maxWidth: 550,
        }}>
          <Typography sx={{ marginLeft: 2, marginBottom: 2, marginRight: 2, }}  >Debido a: {email.Motivo2}</Typography>
          <Typography sx={{ marginLeft: 5, marginTop: 3 }} variant="h7">En  el libro con id:
            <Typography sx={{ color: "#429EBD", marginRight: 2, }} variant="h7"> {email.Libro}</Typography></Typography>
          <Grid container direction="row" sx={{ direction: "flex" }} >
            <Avatar
              css={{ width: 20, height: 20, marginTop: 10, marginRight: 5, }}
              src={fotoPerfilEmail}
              color="warning"
              bordered

            />
            <Typography sx={{ marginTop: 3, marginRight: 2 }} >{email.Texto}</Typography>
          </Grid>
        </Box>

        <Box display="flex"
          style={{
            flexDirection: 'row',
            marginTop: 20,
            justifyContent: "center"
          }}>

          <Button variant="contained" style={{ backgroundColor: "#E39801", borderRadius: 20, marginRight: 10 }} onClick={() => setModalEliminarLibro(true)}>
            Aceptar
          </Button>
          <Button variant="contained" style={{ backgroundColor: "#DA4646", borderRadius: 20, marginLeft: 10 }} onClick={() => rechazarLibro(email)}>
            Rechazar
          </Button>
        </Box>
      </Box >
    );
  }
  /* istanbul ignore next */
  function EmailDetailComentarios({ email }) {
    return (
      <Box style={{ display: "flex", marginTop: 50, flexDirection: "column", marginLeft: 40 }}>

        <Modal style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',

        }} open={modalEliminarComentario} onClose={() => setModalEliminarComentario(false)}>
          <div style={{
            width: 400, backgroundColor: 'white', padding: 16, borderRadius: 5,
            boxShadow: "5px 10px #8EAF20",
            border: "1px solid",
            borderColor: "#8EAF20",

          }}>
            <div style={{
              padding: 10, maring: "auto"

            }}>
              <h2 >¿Seguro que quieres eliminar el comentario?</h2>

              <Box
                style={{
                  flexDirection: 'row',

                  marginLeft: 50,
                }}>
                <Button variant="contained" style={{ backgroundColor: "#DA4646", borderRadius: 20, marginRight: 10 }} onClick={() => { eliminarComentarioDefinitivo(email) }}>
                  Eliminar
                </Button>
                <Button variant="contained" style={{ backgroundColor: "#E39801", borderRadius: 20, marginLeft: 10 }} onClick={() => setModalEliminarComentario(false)}>
                  Cerrar
                </Button>

              </Box>
            </div>
          </div>
        </Modal>
        <Box style={{ flexDirection: "row" }}>

          <Typography sx={{ marginBottom: 1, fontSize: 25, color: "#429EBD", fontWeight: "bold" }} >{email.Motivo}:
            <Typography sx={{ color: "#000", }} variant="h7"> {email.Tipo} </Typography>

            {!estaEnMegusta ?
              <Button onClick={() => añadirAFavReporte(email.key)}>
                <StarBorderIcon />
              </Button>
              : <Button onClick={() => eliminarAFavReporte(email.key)}>
                <GradeIcon />
              </Button>}

          </Typography>


          <Typography sx={{ marginLeft: 5, }} variant="h7">De: {email.Autor}</Typography>

        </Box>

        <Box style={{
          marginLeft: 30, marginTop: 10, boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
          borderRadius: '4px', padding: 16, width: 550,
        }}>
          <Typography sx={{ marginLeft: 2, marginBottom: 2, marginRight: 2, }}  >Debido a: {email.Motivo2}</Typography>
          <Box style={{ flexDirection: "row" }}>
            <p style={{ marginLeft: 5, marginTop: 3 }} >En  el libro con id:
              <p style={{ color: "#429EBD", marginRight: 2, }}> {email.Libro}</p></p>
          </Box>
          <Box style={{ flexDirection: "row" }}>
            <p style={{ marginLeft: 5, marginTop: 3 }}>Con comentario:
              <p style={{ color: "#429EBD", marginRight: 2, }}> {emailComentarioTexto}</p>
            </p>
          </Box>
          <Grid container direction="row" sx={{ direction: "flex" }} >
            <Avatar
              css={{ width: 20, height: 20, marginTop: 10, marginRight: 5, }}
              src={fotoPerfilEmail}
              color="warning"
              bordered

            />
            <Typography sx={{ marginTop: 3, marginRight: 2, minWidth: "10%", maxWidth: "90%", }} >{email.Texto}</Typography>
          </Grid>
        </Box>

        <Box display="flex"
          style={{
            flexDirection: 'row',
            marginTop: 20,
            justifyContent: "center"
          }}>

          <Button variant="contained" style={{ backgroundColor: "#E39801", borderRadius: 20, marginRight: 10 }} onClick={() => { setModalEliminarComentario(true) }}>
            Aceptar
          </Button>
          <Button variant="contained" style={{ backgroundColor: "#DA4646", borderRadius: 20, marginLeft: 10 }} onClick={() => { eliminarReporte(email) }}>
            Rechazar
          </Button>
        </Box>
      </Box>
    );
  }
/* istanbul ignore next */
  function EmailDetailPersona({ email }) {
    return (
      <Box style={{ display: "flex", marginTop: 50, flexDirection: "column", marginLeft: 40 }}>

        <Modal style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',

        }} open={modalEliminarPersona} onClose={() => setModalEliminarPersona(false)}>
          <div style={{
            width: 400, backgroundColor: 'white', padding: 16, borderRadius: 5,
            boxShadow: "5px 10px #8EAF20",
            border: "1px solid",
            borderColor: "#8EAF20",

          }}>
            <div style={{
              padding: 10, maring: "auto"

            }}>
              <h2 >¿Seguro que quieres bloquear al usuario?</h2>

              <Box
                style={{
                  flexDirection: 'row',

                  marginLeft: 50,
                }}>
                <Button variant="contained" style={{ backgroundColor: "#DA4646", borderRadius: 20, marginRight: 10 }} onClick={() => { bloquearPersonaDefinitivo(email) }}>
                  Bloquear
                </Button>
                <Button variant="contained" style={{ backgroundColor: "#E39801", borderRadius: 20, marginLeft: 10 }} onClick={() => setModalEliminarPersona(false)}>
                  Cerrar
                </Button>

              </Box>
            </div>
          </div>
        </Modal>
        <Box style={{ flexDirection: "row" }}>

          <Typography sx={{ marginBottom: 1, fontSize: 25, color: "#429EBD", fontWeight: "bold" }} >{email.Motivo}:
            <Typography sx={{ color: "#000", }} variant="h7"> {email.Tipo} </Typography>

            {!estaEnMegusta ?
              <Button onClick={() => añadirAFavReporte(email.key)}>
                <StarBorderIcon />
              </Button>
              : <Button onClick={() => eliminarAFavReporte(email.key)}>
                <GradeIcon />
              </Button>}

          </Typography>


          <Typography sx={{ marginLeft: 5, }} variant="h7">De: {email.Autor}</Typography>

        </Box>

        <Box style={{
          marginLeft: 30, marginTop: 10, boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
          borderRadius: '4px', padding: 16, width: 550,
        }}>
          <Typography sx={{ marginLeft: 2, marginBottom: 2, marginRight: 2, }}  >Debido a: {email.Motivo2}</Typography>
          <Box style={{ flexDirection: "row" }}>
            <p style={{ marginLeft: 5, marginTop: 3 }}>Reporte a:
              <p style={{ color: "#429EBD", marginRight: 2, }}> {email.AutorReportado}</p>
            </p>
          </Box>
          <Grid container direction="row" sx={{ direction: "flex" }} >
            <Avatar
              css={{ width: 20, height: 20, marginTop: 10, marginRight: 5, }}
              src={fotoPerfilEmail}
              color="warning"
              bordered

            />
            <Typography sx={{ marginTop: 3, marginRight: 2, minWidth: "10%", maxWidth: "90%", }} >{email.Texto}</Typography>
          </Grid>
        </Box>

        <Box display="flex"
          style={{
            flexDirection: 'row',
            marginTop: 20,
            justifyContent: "center"
          }}>

          <Button variant="contained" style={{ backgroundColor: "#E39801", borderRadius: 20, marginRight: 10 }} onClick={() => { setModalEliminarPersona(true) }}>
            Aceptar
          </Button>
          <Button variant="contained" style={{ backgroundColor: "#DA4646", borderRadius: 20, marginLeft: 10 }} onClick={() => { eliminarReporte(email) }}>
            Rechazar
          </Button>
        </Box>
      </Box>
    );
  }
  const Mail = () => {
    return (

      <Box display="flex" style={{
        marginLeft: 40, backgroundColor: "#fff", flexDirection: 'column',
      }}>

        <Typography variant="h4" gutterBottom sx={{ marginTop: 5 }}>
          Reportes:   <Typography variant="h7" gutterBottom sx={{ fontSize: 20 }}>
            {filtro}
          </Typography>
        </Typography>
        <Divider sx={{ borderRight: "3px", backgroundColor: "#8EAF20" }} />
        <List sx={{ borderRight: `3px solid #8EAF20`, backgroundColor: "#fff", height: "100%" }} >
          {
            emails.length !== 0 ?

              emails.map((email) => (
                <div >
                  <ListItem key={email.key} data-testid="buttonhandleEmailClick" button onClick={() => handleEmailClick(email)} sx={{
                    '&:hover': {

                      backgroundColor: "#EEF7D5",
                    },
                  }}>
                    <ListItemText
                      primary={email.Motivo}
                      secondary={`${email.Autor} - ${email.FechaEnviado?.toDate().toDateString()}`}

                    />
                  </ListItem>
                  <Divider />
                </div>

              )) : <Grid display="flex" style={{ alignItems: "center", marginTop: 50, flexDirection: "column" }}>
                <img src="https://firebasestorage.googleapis.com/v0/b/tfgbook-f69af.appspot.com/o/NoCorreo.png?alt=media&token=a44d851f-7474-4c86-bac5-6dfd5941a7d6" alt="No hay libros" style={{ width: 150, height: 150 }} />
                <Typography sx={{ marginTop: 2, }} >No hay reportes</Typography>
              </Grid>
          }

        </List>

      </Box>
    );
  };

  function renderComponent() {
    if (emailSeleccionado !== "") {
      if (emailSeleccionado.Tipo === "Libro") {
        return (<Box display="flex" style={{ flexDirection: 'row', }}>
          <InboxList />
          <Mail />
          < EmailDetailLibro email={emailSeleccionado} />
        </Box>)
      }
      else if (emailSeleccionado.Tipo === "Comentario") {
        return (<Box display="flex" style={{ flexDirection: 'row', }}>
          <InboxList />
          <Mail />
          <EmailDetailComentarios email={emailSeleccionado} />
        </Box>)
      }
      else{
        return (<Box display="flex" style={{ flexDirection: 'row', }}>
        <InboxList />
        <Mail />
        <EmailDetailPersona email={emailSeleccionado} />
      </Box>)
      }
    }
    else {
      return (<Box display="flex" style={{ flexDirection: 'row', }}>
        <InboxList />
        <Mail />
        <Grid display="flex" style={{ margin: "auto", flexDirection: "column" }}>
          <img src="https://firebasestorage.googleapis.com/v0/b/tfgbook-f69af.appspot.com/o/NoLibros.png?alt=media&token=6eed6167-194a-49f9-a12e-285586ffc860" alt="No hay libros" style={{ width: 500, height: 500 }} />
          <Typography sx={{ marginLeft: 10, marginTop: 5, }} >Selecciona un reporte para leerlo</Typography>
        </Grid>
      </Box>)

    }
  }

  return (
    <div>
    {renderComponent()}
    </div>

  );

}


