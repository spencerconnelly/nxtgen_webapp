import React, { Component } from 'react';
import './App.css';
import {Navbar} from 'react-bootstrap';
import logo from './logo.png';
import HomePage from './Components/HomePage';
import Portfolio from './Components/Portfolio';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {isProfile: false};
  }

  render() {


    return (
      <div className="App">
        <Navbar inverse collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="/"><img class="App-logo" src={logo}/></a>
            </Navbar.Brand>
            <h3 class="name">NextGen Blockchain Technologies</h3>
          </Navbar.Header>
          <ul class="nav navbar-nav navbar-right">
            <li class="nav-item">
              <a class="navbutton" href="/portfolio">My Portfolio</a>
            </li>
          </ul>
        </Navbar>
        <Router>
          <div>
            <Route exact path="/" component={HomePage} />
            <Route path="/portfolio" component={Portfolio} />
          </div>
        </Router>
      </div>    
    );
  }
}

export default App;
