import React, {useEffect} from 'react'
import {
    useHistory
} from "react-router-dom";
import Plotly from 'plotly.js-dist';
import generateATable from '../functions/TableCreator.js'

const DataReveal = () => {
    const navigate = useHistory()

    /**
     * The following function runs if user decides to change the dataset. Basically a repetition of
     * the code from the WelcomePage component.
     */
    const uploadDataset = () => {
        let lab = []
        let tableData = []


        let input = document.getElementById("file");
        let file;
        input.click();

        input.onchange = e => {
            // Obtaining user passed file and creating a formdata to
            // pass this file to the backend
            file = e.target.files[0];

            var fd = new FormData()
            // Appending file to the formdata
            fd.append('file', file);

            // TODO: Make a call to verify if the dataset is readable on the backend

            // Saving a file name to retrive it later
            let filename = file.name

            // This fetch sends a request to python so it can parse the file to json
            // Only JSON files can be stored on this end and we don't want to store anything
            // on the server side.
            fetch("/SendJSONFile", {
                method: 'POST',
                body: fd
            }).then(
                res => res.json()
            ).then(
                data => {
                    // An example of how to save files to the session
                    sessionStorage.setItem('raw_file', JSON.stringify(data))
                    // This parse is needed to remove previous extension of a file and add a .json extension
                    sessionStorage.setItem('raw_file_fileName', filename.substr(0, filename.indexOf('.')) + '.json')

                    // The following fetch has to be called after file is saved since it is going
                    // to call the saved file for the testing purposes
                    /**
                     * The following code snippet show how to access raw_file
                     * and send it back to backend. Session storage cannot store
                     * a file itself so store contents of a file in json and create
                     * a new file in json format to pass it to the backend
                     */
                    // SNIPPET STARTS {
                    fd = new FormData()
                    file = new File([new Blob([sessionStorage.getItem('raw_file')])],
                        sessionStorage.getItem('raw_file_fileName'))

                    fd.append('file', file)
                    // } SNIPPET ENDS

                    // Sending a post request to FirstEntriesToFE
                    // So we can represent first entries of the provided
                    // dataset
                    fetch("/FirstEntriesToFE", {
                        method: 'POST',
                        body: fd
                    }).then(
                        // Parsing the response into json once received
                        res => res.json()
                    ).then(
                        // Making manipulations with the response
                        data => {


                            console.log(data.values);
                            var data = [{
                                type: 'table',
                                header: {
                                    values: data.labels,
                                    align: "center",
                                    line: {width: 1, color: 'black'},
                                    fill: {color: "grey"},
                                    font: {family: "Arial", size: 12, color: "white"}
                                },
                                cells: {
                                    values: data.values,
                                    align: "center",
                                    line: {color: "black", width: 1},
                                    font: {family: "Arial", size: 11, color: ["black"]}
                                }
                            }]

                            Plotly.newPlot('graph1', data);
                        }
                    ) // FirstEntries Fetch ends
                }
            ) // Main Fetch Ends    
        } // Listener for the file upload ends
    } // Function for the upload button ends

    /**
     * This useEffect literally repeats the contents of the nested fetch above but is run
     * on the access of this page.
     */
    // UseEffect to present a dataset
    useEffect((lab, tableData) => {
        let fd = new FormData()
        let file = new File([new Blob([sessionStorage.getItem('raw_file')])],
            sessionStorage.getItem('raw_file_fileName'));

        fd.append('file', file);

        // A fetch to get new data
        fetch("/FirstEntriesToFE", {
            method: 'POST',
            body: fd
        }).then(
            // Parsing the response into json once received
            res => res.json()
        ).then(
            // Making manipulations with the response
            data => {


                console.log(data);
                var data = [{
                    type: 'table',
                    header: {
                        values: data.labels,
                        align: "center",
                        line: {width: 1, color: 'black'},
                        fill: {color: "grey"},
                        font: {family: "Arial", size: 12, color: "white"}
                    },
                    cells: {
                        values: data.values,
                        align: "center",
                        line: {color: "black", width: 1},
                        font: {family: "Arial", size: 11, color: ["black"]}
                    }
                }]

                Plotly.newPlot('graph1', data);
            }
        )
    });

    // A continue button function
    const forwardToUA = () => {
        navigate.push('/UA');
    }
    return (
        <div>
            {/* Title */}
            <h1 className='flex items-center justify-center
            mt-8 text-3xl text-gray-700 font-semibold'>Dataset Visualisation</h1>

            {/* Button to upload */}
            <input type="file" id="file" accept=".csv, .xlsx, .xls, .parquet, .txt, .json" hidden="hidden"></input>
            <button onClick={uploadDataset} className='bg-gray-100 rounded-xl
            grid grid-rows-1 gap-2 content-center
            shadow-md
            pl-16 pr-16
            hover:bg-gray-300
            hover:transition
            mt-8 mx-auto
            text-2xl text-gray-700'>
                <div className='conter-center mx-auto my-auto mb-8'>
                    <svg className=" mt-8
                    stroke-[rgb(23,66,112)] w-32 h-32 "
                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                         stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
                    </svg>
                </div>
                <div className='mb-8'>
                    Change Dataset
                </div>
            </button>

            {/* Maybe create a drop box if needed */}

            {/* Some Table */}
            <div className="flex flex-col mt-8 text-xl text-gray-700 text-center overflow-hidden" id="table">
            </div>
            <div className="mb-2 mx-8 my-8">
                <div id="graph1"></div>
            </div>

            {/* Button to continue */}
            <div className='mx-auto mb flex items-center 
            justify-center
            md:justify-end'>
                <button id="continueButton" className='
                bg-blue-300 rounded-md shadow-lg
                text-gray-900 border border-blue-400
                mt-4 mb-4 w-3/5 h-16
                md:mt-4 md:h-8 md:ml-4 md:mr-4 md:w-32
                hover:transition
                hover:bg-sky-600 hover:border-blue-700' onClick={forwardToUA}>
                    Continue
                </button>
            </div>
        </div>
    )
}

export default DataReveal;