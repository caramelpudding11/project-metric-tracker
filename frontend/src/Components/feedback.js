import React, { Component } from 'react';
import { Form, Button, Row, Col } from "react-bootstrap";
import { Container } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import moment from 'moment';
import '../Table/table.css';
import './addActivity.css'
import AuthService from "../services/auth.service";
import BasicTable from '../Table/basicTable';
import { COLUMNS } from '../Table/columns';


import variables from '../env';
var URL=variables.getURL();

class FillDetails extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userName: '',
      date: moment(new Date()).format("YYYY-MM-DD"),
      subject: ' ',
      message: ' ',
      success: false,
      enteredData: [],
      errors: {}
    };
    this.getUser = this.getUser.bind(this);
    this.getDate = this.getDate.bind(this);
    this.getSubject = this.getSubject.bind(this);
    this.getMessage = this.getMessage.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }


  getUser(e) {
    const user = AuthService.getCurrentUser();
    this.setState({userName: user.username})
  }
  
  getMessage(e) {
    this.setState({ message: e.target.value })
  }
  getSubject(e) {
    this.setState({ subject: e.target.value })
  }
  getDate(e) {
    this.setState({ date: e.target.value })
  }

  // Function for handling validation

  onSubmit(e) {
    e.preventDefault()
    const user = AuthService.getCurrentUser();
    const detailsObj = {
      userName: user.username,
      subject: this.state.subject,
      message: this.state.message,
      date: this.state.date,
    };
    
      axios.post(URL+'/feedback/addFeedback', detailsObj)
      alert("Feedback successfully sent!");
      this.state.enteredData.push(detailsObj);
      this.setState({success: true});
      this.setState({ userName: '', subject: '', message: '', date: ''})
  }


  render() {
    const activityObj = [];
    const columns = COLUMNS;
    return (
      <Container className="cont-form">
        <Form onSubmit={this.onSubmit}>
          <Row className="mb-4">
            <Form.Group as={Col} controlId="formDate">
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" onChange={this.getDate} value={this.state.date} max={this.state.date} required />
            </Form.Group>
          </Row>
          <Row className="mb-3">
          <Form.Group as={Col} controlId="subject">
              <Form.Label>Subject</Form.Label>
              <Form.Control placeholder="Subject" value={this.state.subject} onChange={this.getSubject} required />
            </Form.Group>
            <Form.Group as={Col} controlId="message">
              <Form.Label>Feedback</Form.Label>
              <Form.Control placeholder="Feedback" value={this.state.message} onChange={this.getMessage} required />
            </Form.Group>
          </Row>
          <Button className="subBtn" variant="primary" type="submit">
            Submit
          </Button>
        </Form>
        </Container>
      
    )
  }
}

export default FillDetails
