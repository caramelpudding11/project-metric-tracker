import React, { Component } from 'react';
import { Form, Button, Row, Col } from "react-bootstrap";
import { Container } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import './addActivity.css'

import variables from '../env';
var URL=variables.getURL();

class addActDetails extends Component {
  constructor(props) {
    super(props)

    this.state = {
      code: '',
      detail: '',
      activityData: [],
      errors: {}
    };

    this.getActCode = this.getActCode.bind(this);
    this.getActDet = this.getActDet.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  getActCode(e) {
    var descObjList = this.state.activityData.filter(item => item.code === e.target.value);
    var detailail = '';
    if (descObjList != null) {
      for (const record of descObjList) {
        detailail = record.detail;
      }
    }
    this.setState({ code: e.target.value, detail: detailail })
  }
  getActDet(e) {
    this.setState({ detail: e.target.value })
  }

  // Function for handling validation
  handleValidation(detailsObj) {
    let errors = {};
    let formIsValid = true;
    if (['', undefined, null, 'Choose...'].includes(detailsObj.code)) {
      formIsValid = false;
      errors["formActCode"] = "Activity Code is a required field!!";
    }
    if (['', undefined, null, 'Choose...'].includes(detailsObj.detail)) {
      formIsValid = false;
      errors["formActDet"] = "Activity Detail is a required field!";
    }
    this.setState({ errors: errors });
    return formIsValid;
  }

  onSubmit(e) {
    e.preventDefault()

    const detailsObj = {
      code: this.state.code,
      detail: this.state.detail,
    };

    const isValid = this.handleValidation(detailsObj);
    if (isValid) {
      axios.post(URL+'/activity/addActivity', detailsObj)
        .then(res => console.log(res.data));
      alert("Form submitted");

      this.setState({ code: '', detail: ''})
    } else {
      alert("Form has errors.");
    }
  }


  render() {
    const activityObj = [];
    for (const record of this.state.activityData) {
      activityObj.push({ key: record.detail, value: record.code });
    }

    return (

      <Container className="cont-form">
        <Form onSubmit={this.onSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formActCode">
              <Form.Label>Activity Code</Form.Label>
              <Form.Control placeholder='Activity Code' value={this.state.code} onChange={this.getActCode}>
              </Form.Control >
              <span style={{ color: "red" }}>{this.state.errors["formActCode"]}</span>
            </Form.Group>

            <Form.Group as={Col} controlId="formActDet">
              <Form.Label>Activity Detail</Form.Label>
              <Form.Control placeholder="Activity Detail" value={this.state.detail} onChange={this.getActDet} />
              <span style={{ color: "red" }}>{this.state.errors["formActDet"]}</span>
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

export default addActDetails
