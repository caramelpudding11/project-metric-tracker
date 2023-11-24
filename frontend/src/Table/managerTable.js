
import React, { Component } from 'react';
import { Form, Col, Row, Button } from "react-bootstrap";
import moment from 'moment';
import axios from 'axios';
import './table.css'
import { COLUMNS } from '../Table/columns';
import { useTable } from 'react-table';
import AuthService from "../services/auth.service";


import variables from '../env';
const URL = variables.getURL();

let flag = false;
let global_list = [];

const BasicTable = (params) => {

    const tableInstance = useTable({
        columns: params.columns,
        data: params.data
    })
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

    const ids = params.data.map(detail => detail.id);

    return (
        <table {...getTableProps()}>
            <thead>
                {
                    headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {
                                headerGroup.headers.map(column => (
                                    <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                ))
                            }
                            <th>
                                Approve
                            </th>
                        </tr>
                    ))
                }
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                    prepareRow(row)
                    return (
                        <tr {...row.getRowProps()} key={ids[i]}>
                            {row.cells.map((cell) => {
                                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                            })}
                            <td>
                                <Button type="submit" onClick={() => params.toggleFn(ids[i])}>
                                    Approve
                                </Button>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

function toCsv(detailsList) {
    const fields = Object.keys(detailsList[0]);
    const header = fields.join(',');
    const csvRows = detailsList.map(detail => Object.values(detail).join(','));
    const csvString = [header, ...csvRows].join('\n');
    const encoded = encodeURI('data:text/csv;charset=utf-8,' + csvString);
    return encoded;
}

export class DetailTable extends Component {
    constructor(props) {
        super(props)

        this.state = {
            maxDate: moment(new Date()).format("YYYY-MM-DD"),
            date: '',
            detailList: [],
            listLength: false,
            initialListLen: true,
            showTable: false,
            activityData: [],
            projectData: [],
            approved: false
        }

        this.getDate = this.getDate.bind(this);
    }

    componentDidMount() {
        console.log("flag", flag);
        fetch(URL + '/project')
            .then((response) => response.json())
            .then(ProjectDetList => {
                this.setState({ projectData: ProjectDetList });
            });
        fetch(URL + '/activity')
            .then((response) => response.json())
            .then(ActivityDetList => {
                this.setState({ activityData: ActivityDetList });
            });

    }
    getDate(e) {
        this.setState({ date: e.target.value }, () => {
            this.getActivityDetails(this.state.date)
            console.log("global", global_list.userName)
        })

    }

    async toggleApprove(id) {
        const detailList = this.state.detailList.filter(detail => detail.id !== id);
        this.setState({ detailList });
        await axios.post(`${URL}/details/editDetails/${id}/approval`);
    }

    

    getActivityDetails(date) {
        let detailListObj = [];
        axios.post(URL + '/details/detailList', { date: date, userName: AuthService.getCurrentUser().username, roles: AuthService.getCurrentUser().roles, project: AuthService.getCurrentUser().project }).then(response => {
            if (!['', undefined, null].includes(response.data)) {
                var a_code; var a_det; var p_code; var p_det;
                if (response.data.response.length !== 0) {
                    for (let i = 0; i < response.data.response.length; i++) {
                        for (let j = 0; j < this.state.activityData.length; j++) {
                            if (response.data.response[i].activity == this.state.activityData[j]._id) {
                                a_code = this.state.activityData[j].code;
                                a_det = this.state.activityData[j].detail;
                            }
                        }

                        for (let j = 0; j < this.state.projectData.length; j++) {
                            if (response.data.response[i].project == this.state.projectData[j]._id) {
                                p_code = this.state.projectData[j].p_code;
                                p_det = this.state.projectData[j].p_name;
                            }
                        }
                        const detailsObj = {
                            id: response.data.response[i]._id,
                            userName: response.data.response[i].userName,
                            activityCode: a_code,
                            activityDet: a_det,
                            description: response.data.response[i].description,
                            projectCode: p_code,
                            projectName: p_det,
                            duration: response.data.response[i].duration,
                            date: response.data.response[i].date,
                            approved: response.data.response[i].approved
                        };
                        detailListObj.push(detailsObj);
                        global_list.push(detailsObj);
                    }
                    this.setState({
                        detailList: detailListObj,
                        showTable: true,
                        listLength: false
                    });

                } else {
                    this.setState({
                        detailList: '',
                        listLength: true,
                        showTable: false
                    });
                }

            }

        });
    }

    render() {

        const columns = COLUMNS;

        return (

            <div className="detailListTable">
                <Row>
                    <Form>
                        <Form.Group as={Col} controlId="formDate">
                            <Form.Label>Choose Date : </Form.Label>
                            <Form.Control className="dateClass" type="date" onChange={this.getDate} value={this.state.date} max={this.state.maxDate} required />
                        </Form.Group>
                    </Form>
                </Row>
                <div className="detailListTable">
                    <div> {this.state.listLength && this.state.initialListLen ? " No Data !!" : null} </div>
                    <div>
                        {this.state.showTable ? <BasicTable data={this.state.detailList} toggleFn={this.toggleApprove.bind(this)} columns={columns} /> : null}
                        <Button type="submit" onClick={() => window.open(toCsv(global_list))}>
                            Download
                        </Button>
                    </div>
                </div>
            </div>
        )
    }
}

export default DetailTable
