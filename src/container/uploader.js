import React, { Component } from 'react'
import CSVReader from 'react-csv-reader'
import Table from './table'
import { CSVLink, CSVDownload } from "react-csv"

class Uploader extends Component {
    constructor(props) {
        super(props)
        this.state = {
            table: "",
            tableData: [],
            columns: [],
            title: '',
            loading: true,
            uploading: false
        }
    }

    componentDidMount = async () => {
        const data = JSON.parse(localStorage.getItem('csvData'));
        if (data && data != "" && data.length)
            this.processData(data)
        this.getTable()
    }

    processData = (data) => {
        this.setState({ loading: true, uploading: true })
        let columns = []
        for (let key in data[0]) {
            let clm = {}
            clm.title = key.charAt(0).toUpperCase() + key.slice(1)
            clm.field = key
            clm.headerSort = true
            clm.align = 'center'
            clm.headerFilter = 'input'
            clm.headerFilterPlaceholder = 'search...'
            columns.push(clm)
        }
        this.setState({ tableData: data, columns, loading: false, uploading: false }, () => {
            if (this.state.table != "")
                this.state.table.replaceData(data)
        })
    }

    getTable = (table) => {
        if (table)
            this.setState({ table })
    }

    perPageHandler = event => {
        let val = event.target.value
        if (val && val !== 'all') {
            this.state.table.setPageSize(parseInt(val));
        }
        else if (val === 'all') {
            this.state.table.setPageSize(this.state.tableData.length);
        }
    }

    fileUploadHandler = (data, fileInfo) => {
        this.processData(data)
        localStorage.setItem('csvData', JSON.stringify(data));
    }

    resetHandler = () => {
        localStorage.setItem('csvData', "");
        this.setState({ tableData: [], loading: false, uploading: false }, () => {
            if (this.state.table != "")
                this.state.table.replaceData([])
        })
    }

    render() {
        const csvData = [
            ["Name", "Age", "DOB", "Reporting Manager", "Salary", "Department"]
        ];

        return (
            <div>
                <div className="d-flex justify-content-center">
                    <div className="p-2">
                        <CSVLink data={csvData} filename={"employees.csv"}><button className="btn btn-primary">download template</button></CSVLink>
                    </div>
                    <div className="p-2">
                        <CSVReader
                            cssClass="csv-reader-input"
                            onFileLoaded={(data, fileInfo) => this.fileUploadHandler(data, fileInfo)}
                            parserOptions={{ header: true }}
                            inputId="file"
                            inputName="file"
                            inputStyle={{ color: 'blue' }}
                        />
                    </div>
                </div>
                <div>
                    <br />

                    <div className="d-flex justify-content-between">
                        <div className="p-2">
                            <button className="btn btn-primary" onClick={() => this.resetHandler()}>reset</button>
                        </div>
                        {this.state.tableData.length > 0 &&
                            <div className="p-2">
                                <b>Page Size</b>
                                <select id="sel2" onChange={this.perPageHandler} defaultValue='25'>
                                    <option key='25' value='25'>25</option>
                                    <option key='50' value='50'>50</option>
                                    <option key='100' value='100'>100</option>
                                    <option key='500' value='500'>500</option>
                                </select>
                            </div>
                        }
                    </div>
                    <div>
                        {this.state.loading && this.state.uploading &&
                            <div className="spinner-border text-primary" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        }
                    </div>
                    <div >
                        {!this.state.loading && <Table data={this.state.tableData} columns={this.state.columns} getTable={this.getTable} />}
                        {/* {this.state.tableData.length === 0 && this.state.columns.length > 0 &&  <Table data={this.state.tableData} columns={this.state.columns} getTable={this.getTable} />} */}
                    </div>
                </div>
            </div>
        )
    }
}

export default Uploader