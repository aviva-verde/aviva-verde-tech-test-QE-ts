import React, { Component } from "react";
import HomePage from "./components/HomePage";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import EstablishmentsDetails from "./components/EstablishmentsDetails"


class App extends Component {
  render() {
    return <Router>
      <Switch>
        <Route exact path="/" component={HomePage}/>
        <Route path="/establishment/:id" component={EstablishmentsDetails}/>
      </Switch>
    </Router>
  }
}

export default App;
