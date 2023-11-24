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
        <center><h1>CorpSpace</h1>
          <br></br>
          <div class="main_left">
            <p>CorpSpace Private Limited is a technology and solutions start up based in Inida.</p>
            <p>Our mission is to provide a platform for people to connect and work together to solve <br></br>real world problems.</p>
            <p>We provide services and assistance to do this using the lastest technologies.</p>
            <p>We are growing rapidly and now are present in over 6 locations all over India.</p>
            </div>
            </center>
        </header>
      </div>
    );
  }
}