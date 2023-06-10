
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import React from 'react';

import {LogInScreen}from "./screens/Authentication/LoginScreen"; 
import {AuthScreen} from "./screens/AuthScreen"; 
import {HomeScreen} from "./screens/HomeScreen"; 
function App() {



  return (


      <Router>
        <Switch>
        <Route exact path='/' render={() => <AuthScreen/>} />
        <Route path="/home" render={() => <HomeScreen/>} />
        <Route path="/login" render={() => <LogInScreen/>} />

        </Switch>
      </Router>


    
  );
}

export default App;
