import React, { useEffect } from "react"
import generateATable from "../functions/TableCreator.js";
import Plotly from 'plotly.js-dist';
import {
    useHistory
  } from "react-router-dom";

const UniVarA = () => {
    const navigate = useHistory()
    
    useEffect((lab, tableData) => {
        // MODE/MEAN/MEDIAN/SD TABLE
        lab = ['Mean','Mode', 'Median', 'SD']
        tableData = [[1.1],[2.1],[3.1],[4.1]]

        document.getElementById('table1').innerHTML = generateATable(lab, tableData);

        // QUANTILE TABLE
        lab = ['25%','50%', '75%', '100%']
        tableData = [[1.1],[2.1],[3.1],[4.1]]

        document.getElementById('table2').innerHTML = generateATable(lab, tableData);
    });

    // On page load
    useEffect(() => {
        // Filling a selection box with the labels
        let fd = new FormData()
        let file = new File(    [new Blob([sessionStorage.getItem('raw_file')])], 
                                            sessionStorage.getItem('raw_file_fileName'))
        
        fd.append('file', file)
        
        fetch("/ObtainColumnNames",{
            method: 'POST',
            body: fd
        }).then(
            res=>res.json()
        ).then(
            data=> {
                let selectionBox = document.getElementById('variableList')
                selectionBox.innerHTML = "";
                for (let i = 0; i < data.length; i++){
                    selectionBox.innerHTML += "<option value="+data[i]+">"+data[i]+"</option>"
                }
                // Calling first update of the visualizations
                updateVisualization(document.getElementById('variableList').value);
            })
    });

    // Updating the tables and graphs on the page
    const updateVisualization = (e) => {

        let fd = new FormData()
        let file = new File(    [new Blob([sessionStorage.getItem('raw_file')])], 
                                sessionStorage.getItem('raw_file_fileName'));
        
        fd.append('file', file);
        fd.append('var', document.getElementById('variableList').value);

        // Table for Mean/Mode/Median/SD
        fetch("/univariableAnalysisTABLE",{
            method: 'POST',
            body: fd
        }).then(
            res=>res.json()
        ).then(
            data=> {
                let d = data[document.getElementById('variableList').value];
                // MODE/MEAN/MEDIAN/SD TABLE
                let lab = ['Mean','Mode', 'Median', 'SD']
                let tableData = [   [d.mean.toFixed(2)],
                                    [d.mode.toFixed(2)],
                                    [d.Median.toFixed(2)],
                                    [d.Standard_deviation.toFixed(2)]]

                document.getElementById('table1').innerHTML = generateATable(lab, tableData);


            }
        );

        // Table for Quantiles
        fetch("/univariableAnalysisTABLEq",{
            method: 'POST',
            body: fd
        }).then(
            res=>res.json()
        ).then(
            data=> {

                // MODE/MEAN/MEDIAN/SD TABLE
                let lab = ['25%','50%', '75%', '100%']
                let tableData = [   [data[1].toFixed(2)],
                                    [data[2].toFixed(2)],
                                    [data[3].toFixed(2)],
                                    [data[4].toFixed(2)]]

                document.getElementById('table2').innerHTML = generateATable(lab, tableData);


            }
        );

        // Plotting a graph
        fetch("/univariableAnalysisHistogram",{
            method: 'POST',
            body: fd
        }).then(
            res=>res.json()
        ).then(
            data=> {
                let traces = {
                    x: data.data_in_list,
                    type: 'histogram',
                    marker: {
                        color: "rgba(68,107,166,0.7)",
                        line: {
                            color: "rgba(68,107,166,1)",
                            width:1
                        }
                    },
                    opacity: 0.6
                }
                let layout = {
                    margin: {
                        b:24,
                        t:24,
                        r:24,
                        l:24
                    }
                }
                let d = [traces];
                Plotly.newPlot('graph', d, layout);
            }
        );
    }

    const returnB = () => {
        navigate.push('/DataReveal');
    }
    const continueB = () => {
        navigate.push('/BivA');
    }


    // Making graph resize with the window
    window.addEventListener('resize', (event) => {
            
        // Yes, it works awfully bad and I have no idea why we call resize twice
        let graphDiv = document.getElementById('graph');
        let update = {
            width:  graphDiv.offsetWidth,
            height: graphDiv.offsetHeight
        }
        Plotly.relayout(graphDiv, update, 0);

    });
    return (
        <div className="mb-4">
            {/* Title */}
            <h1 className='flex items-center justify-center
            mt-4 text-3xl text-gray-700 font-semibold'>Univariate Analysis</h1>

            {/* Grid */}
            <div className="grid md:grid-cols-2 grid-cols-1 gap-4 md:mr-0 mr-4">
                {/* Selection tab and  a table*/}
                <div className=" bg-gray-200 ml-5 mt-4 grow">
                    {/* Selection tab */}
                    <div className="grid grid-cols-2 lg:grid-cols-2">
                        {/* Possible spot for Completeness and variability slider. Code is commented out in the bottom of the file */}
                        {/* Variable Selector */}
                        <label className="mb-2 block text-xl font-medium text-gray-700">Variable:</label>
                        <div className="right-0">
                            <select id="variableList" onChange={updateVisualization}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                            w-full h-full justify-center lg:ml-4">
                            </select>
                        </div>
                    </div>
                    
                    {/* Table for Mean/Mode/Median/SD*/}
                    <label className="text-xl">Parameters:</label>
                    <div className="mx-auto text-xl text-gray-700 text-center" id="table1">Table</div>

                    {/* Table for quantiles*/}
                    <label className="text-xl">Quantiles:</label>
                    <div className="mx-auto text-xl text-gray-700 text-center" id="table2">Table</div>
                </div>

                {/* Graph*/}
                <div className="mr-4 mt-4 grow w-256">
                    
                    <div id="graph" className="ml-8 mb-4 pr-32">

                    </div>
                </div>
            </div>
                        {/* Continue and return */}
            <div className="flex justify-between ">
                <button id ="return" className='
                mt-2 ml-4 right-0 h-8 w-16
                bg-gray-100 rounded-md shadow-lg
                text-gray-900 border border-gray-400
                hover:transition
                hover:bg-gray-400 hover:border-gray-500' onClick={returnB}>
                    Return
                </button>
                <button id ="continueButton" className='
                mt-2 mr-4 right-0 h-8 w-24
                bg-blue-300 rounded-md shadow-lg
                text-gray-900 border border-blue-400
                hover:transition
                hover:bg-sky-600 hover:border-blue-700' onClick={continueB}>
                    Continue
                </button>
            </div>
        </div>
    )
}

export default UniVarA;

                        // {/* Completeness */}
                        // <div className="grid grid-rows-2">
                        //     <label className="text-lg">Completeness:</label>
                        //     <label className="text-lg">Variability:</label>
                        // </div>
                        // {/* Variablity */}
                        // <div className="lg:col-span-2 lg:w-4/5 xl:w-full">
                        //     <input
                        //         type="range"
                        //         className="form-range
                        //         w-full h-6 p-0 mt-1 mr-4 lg:ml-8 xl:ml-4
                        //         bg-transparent"
                        //         min="0" max="100" step="1"
                        //         id="completeness"
                        //     />
                        //     <input
                        //         type="range"
                        //         className="form-range
                        //         w-full h-6 p-0 mt-1 mr-4 lg:ml-8 xl:ml-4
                        //         bg-transparent"
                        //         min="0" max="100" step="1"
                        //         id="variablity"
                        //     />
                        // </div>

