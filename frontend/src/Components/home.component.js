import React, { Component } from "react";
import '../App.css';
import UserService from "../services/user.service";
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: ""
    };
  }
  componentDidMount() {
    UserService.getPublicContent().then(
      response => {
        this.setState({
          content: response.data
        });
      },
      error => {
        this.setState({
          content:
            (error.response && error.response.data) ||
            error.message ||
            error.toString()
        });
      }
    );
  }
  render() {
    return (
      <div className="container">
        <header className="jumbotron">
          <h1><center>CorpSpace</center></h1>
          <br></br>
          <div class="home_content">
              <div class="left">
                <h4>LIST OF PROJECTS</h4>
                <ul>
                  <li>101 - Airline Management</li>
                  <p>A project to maintain details of available airlines,<br></br> passenger details and booking details.</p>
                  <li>102 - Game Developemnt </li>
                  <p>A project to provide useful templates that game<br></br> developers can make use of.</p>
                  <li>103 - Expense Tracker</li>
                  <p>An app to keep records of how much you spend and <br></br>make the process of splitting the expenses amongst<br></br> groups easier.</p>
                </ul>
              </div>

              <div class="right">
                <h4>LIST OF ACTIVITIES</h4>
                <ul>
                  <li>501 - Planning</li>
                  <p>The planning phase consists of breaking down the <br></br>project into smaller tasks.</p>
                  <li>502 - Coding </li>
                  <p>In this stage, the actual software/design is<br></br> actually implemented using code.</p>
                  <li>503 - Testing</li>
                  <p>The implemented code is testing to ensure it works <br></br>for all possible scenarios.</p>
                  <li>504 - Documentation </li>
                  <p>A proper report of all the tasks performed to help <br></br>us refer back to the project.</p>
                </ul>
              </div>
              </div>
        </header>
      </div>
    );
  }
}