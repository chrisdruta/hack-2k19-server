import React, { Component } from "react";
import "./App.css";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Grow from '@material-ui/core/Grow';
import Divider from '@material-ui/core/Divider';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


import logo from "./logo_v1.png";

const base64 = require('base-64');

class App extends Component {

  state = {
    isLoggedIn: false,
    name: "demo",
    red: "",
    blue: ""
  };

  getAccountInfo = async () => {

    const data = {}
    let response, body;

    const requestOptions = {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-auth': base64.encode(this.state.name)
      }
    };

    response = await fetch("/logs", requestOptions);
    if (response.status === 200) {
      body = await response.json();
      data.logs = body.logs;
    }

    response = await fetch("/machineTotals", requestOptions);
    if (response.status === 200) {
      body = await response.json();
      data.qty = {};
      data.qty.red = body.red;
      data.qty.blue = body.blue;
    }

    response = await fetch("/prescription", requestOptions);
    if (response.status === 200) {
      body = await response.json();
      data.prescription = {};
      data.prescription.red = body.red;
      data.prescription.blue = body.blue;
    }
    console.log("done")
    return data;
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleLogin = async () => {
    const response = await fetch("/account", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({username: this.state.name })
    });

    if (response.status === 200) {
      this.setState({isLoggedIn: true});
    }
  };

  handleLogout = () => {
    this.setState({isLoggedIn: false});
  };

  handleRegister = async () => {
    const response = await fetch("/register", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.state.name,
        red: this.state.red ? this.state.red : 1,
        blue: this.state.blue ? this.state.blue : 1
      })
    });

    if (response.status === 201) {
      this.setState({isLoggedIn: true});
    }
  };

  render() {
    var data;
    if (this.state.isLoggedIn) {
      data = this.getAccountInfo();
      console.log("render")
      console.log(data)
    }


    return (
      <div className="App">
        <Grow in={this.state.isLoggedIn}>
          <AppBar position="static">
            <Toolbar>
              <div className="grow"></div>
              <Typography variant="h4" color="inherit" align="center">
                Pill Bot
              </Typography>
              <div className="grow"></div>
              <Button color="inherit" onClick={this.handleLogout}>Logout</Button>
            </Toolbar>
          </AppBar>
        </Grow>

        { !this.state.isLoggedIn &&
        <div className="loginRoot">
          <div align="center">
            <img alt="logo"  className="logo" src={logo}/>
          </div>
          <Paper elevation={5} className="paper">
            <form noValidate autoComplete="off" className="form">
              <TextField
                id="outlined-name"
                label="Name"
                className="textField"
                value={this.state.name}
                onChange={this.handleChange("name")}
                margin="normal"
                variant="outlined"
              />

              <br/>
              <Typography variant="caption" align="left">Prescription</Typography>

              <Divider variant="fullWidth" className="divider"/>
              <div className="formInputContainer">
                <TextField
                  id="outlined-name"
                  label="Red Qty"
                  className="textField formText"
                  value={this.state.red}
                  onChange={this.handleChange("red")}
                  margin="normal"
                  variant="outlined"
                />
                
                <TextField
                  id="outlined-name"
                  label="Blue Qty"
                  className="textField formText"
                  value={this.state.blue}
                  onChange={this.handleChange("blue")}
                  margin="normal"
                  variant="outlined"
                />
              </div>
              <br/>
              <div className="formButtonContainer">
                <Button variant="contained" color="primary" onClick={this.handleLogin}>
                  Login
                </Button>
                <Button variant="contained" color="primary" onClick={this.handleRegister}>
                  Register
                </Button>
              </div>
              <br/>
            </form>
          </Paper>
        </div>
        }

        { this.state.isLoggedIn &&
        <div className="accountRoot">
          <div className="accountDiv">

          </div>

          <div className="accountDiv">
            <Paper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Prescription</TableCell>
                    <TableCell align="right">Dosage</TableCell>
                    <TableCell align="right">Renewal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Red</TableCell>
                    <TableCell align="right">{data.prescription.red}</TableCell>
                    <TableCell align="right">Shoop</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Blue</TableCell>
                    <TableCell align="right">{data.prescription.blue}</TableCell>
                    <TableCell align="right">Whoop</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
          </div>
        </div>
        }

      </div>
    );
  }
}

export default App;
