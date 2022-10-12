import React, { useEffect } from "react"
import generateATable from "../functions/TableCreator.js";
import Plotly from 'plotly.js-dist';
import {
    useHistory
  } from "react-router-dom";

const BivA = () => {
    const navigate = useHistory()
    let forecastArray = [];
    let slope = 'slope';
    let intercept = 'intercept';
    useEffect((lab, tableData) => {
        // MODE/MEAN/MEDIAN/SD TABLE
        lab = ['Mean','Mode', 'Median', 'SD']
        tableData = [[1.1],[2.1],[3.1],[4.1]]

        document.getElementById('table').innerHTML = generateATable(lab, tableData);
    });

    // On update load
    useEffect(() => {
        // Checking if data is loaded
        if (window.data == undefined || window.data == null){
            navigate.push('/');
        }
        // Filling a selection box with the labels
        let fd = new FormData()
        let file = new File(    [new Blob([window.data])], 
                            sessionStorage.getItem('raw_file_fileName'))
        
        fd.append('file', file)

        fetch("/ObtainColumnNames",{
            method: 'POST',
            body: fd
        }).then(
            res=>res.json()
        ).then(
            data=> {
                
                let selectionBox = document.getElementById('variableList1')
                selectionBox.innerHTML = "";
                
                for (let i = 0; i < data.length; i++){
                    selectionBox.innerHTML += "<option value="+data[i]+">"+data[i]+"</option>"
                }

                selectionBox = document.getElementById('variableList2')
                selectionBox.innerHTML = "";
                let secondValue = null;
                for (let i = 0; i < data.length; i++){
                    if (i <= 1){
                        secondValue = data[i];
                    }
                    
                    selectionBox.innerHTML += "<option value="+data[i]+">"+data[i]+"</option>"
                }
                selectionBox.value = secondValue;
                // Calling first update of the visualizations
                updateVisualization();
            })
    });

    // Updating the tables and graphs on the page
    const updateVisualization = () => {

        let fd = new FormData()
        let file = new File(    [new Blob([window.data])], 
                                sessionStorage.getItem('raw_file_fileName'));
        
        fd.append('file', file);
        fd.append('var1', document.getElementById('variableList1').value);
        fd.append('var2', document.getElementById('variableList2').value);

        // Table
        fetch("/bivariableAnlysisTable",{
            method: 'POST',
            body: fd
        }).then(
            res=>res.json()
        ).then(
            data=> {
                let lab = ['Slope','Intercept', 'R_sqr', 'P_value']
                let tableData = [   [data.slope.toFixed(2)],
                                    [data.intercept.toFixed(2)],
                                    [data.r_value.toFixed(2)],
                                    [data.p_value.toFixed(2)]]

                document.getElementById('table').innerHTML = generateATable(lab, tableData);
                slope       = data.slope.toFixed(2);
                intercept   = data.intercept.toFixed(2);
            }
        );
//        Plotting a graph
        fetch("/bivariableAnlysisGraph",{
            method: 'POST',
            body: fd
        }).then(
            res=>res.json()
        ).then(
            data=> {
                let traces = {
                    name: "Var",
                    x: data.x,
                    y: data.y,
                    mode: 'markers',
                    type: 'scatter',
                    trendline: 'ols',
                    marker: {
                        color: "rgba(68,107,166,0.7)",
                        line: {
                            color: "rgba(68,107,166,1)",
                            width:1
                        }
                    },
                    opacity: 0.6
                }
                let traces2 = {
                    name: "LR",
                    x: data.xl,
                    y: data.yl,
                    type: 'line',
                    line: {
                        color: "rgba(68,155,166,0.7)",
                    },
                }
                let layout = {
                    margin: {
                        b:24,
                        t:24,
                        r:24,
                        l:24
                    },
                    showlegend:false
                }
                let d = [traces, traces2];
                Plotly.newPlot('graph', d, layout);
            }
        );

        {}
    }

    const forecast = () => {

        let fd = new FormData()
        let file = new File(    [new Blob([window.data])], 
                                sessionStorage.getItem('raw_file_fileName'));
                                
        fd.append('file', file);
        fd.append('var1', document.getElementById('variableList1').value);
        fd.append('var2', document.getElementById('variableList2').value);
        fd.append('forecast', document.getElementById('forecasting').value)
        fetch("/bivariableAnlysisForecast",{
            method: 'POST',
            body: fd
        }).then(
            res=>res.json()
        ).then(
            data=> {
                forecastArray.unshift(data)
                for (let i = 0; i < 5; i++){
                    document.getElementById('forecastingOutput'+i).innerHTML = forecastArray[i]
                }
            }
        );
    }

    const returnB = () => {
        navigate.push('/UA');
    }
    const continueB = () => {
        navigate.push('/ModC');
    }


    // Making graph resize with the window
    window.addEventListener('resize', () => {
            
        // Yes, it works awfully bad
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
            mt-4 text-3xl text-gray-700 font-semibold'>Bivariate Analysis</h1>

            {/* Grid */}
            <div className="grid md:grid-cols-2 grid-cols-1 gap-4 md:mr-0 mr-4">
                {/* Selection tab and  a table*/}
                <div className=" bg-gray-200 ml-5 mt-4 grow">
                    {/* Selection tab */}
                    <div className="grid grid-cols-2 lg:grid-cols-2">
                        {/* Possible spot for Completeness and variability slider. Code is commented out in the bottom of the file */}
                        {/* Variable Selector */}
                        <label className="mb-2 block text-xl font-medium text-gray-700">Variable1:</label>
                        <div className="right-0">
                            <select id="variableList1" onChange={updateVisualization}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                            w-full h-full justify-center lg:ml-4">
                            </select>
                        </div>
                    </div>
                    {/* Selection tab */}
                    <div className="grid grid-cols-2 lg:grid-cols-2">
                        {/* Possible spot for Completeness and variability slider. Code is commented out in the bottom of the file */}
                        {/* Variable Selector */}
                        <label className="mb-2 block text-xl font-medium text-gray-700">Variable2:</label>
                        <div className="right-0">
                            <select id="variableList2" onChange={updateVisualization}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                            w-full h-full justify-center lg:ml-4">
                            </select>
                        </div>
                    </div>
                    
                    {/* Table */}
                    <label className="text-xl">Parameters:</label>
                    <div className="mx-auto text-xl text-gray-700 text-center" id="table">Table</div>

                    {/* Forecasting */}
                    <div>
                        <label>y= {slope} * x + {intercept}: </label>
                    </div>
                    <div className="mt-2 border-gray-400 bg-gray-300 border rounded-lg">
                        <div className="ml-2 mt-2">
                            
                            <button onClick={forecast} className="ml-2 bg-gray-200 rounded-lg pl-2 pr-2 pb-0.5 right-0 hover:bg-gray-400 shadow-md">Forecast</button>
                            <input  id="forecasting" type="input" className="ml-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                w-1/4 h-full justify-center md:w-1/3 pl-2"></input>
                        </div>
                        <div className="ml-4 mt-2 mb-2">
                            <label>Prediction: </label>
                            <label id="forecastingOutput0">undefined</label>
                        </div>
                        <div className="ml-4 mt-2 mb-2">
                            <label>Prediction: </label>
                            <label id="forecastingOutput1">undefined</label>
                        </div>
                        <div className="ml-4 mt-2 mb-2">
                            <label>Prediction: </label>
                            <label id="forecastingOutput2">undefined</label>
                        </div>
                        <div className="ml-4 mt-2 mb-2">
                            <label>Prediction: </label>
                            <label id="forecastingOutput3">undefined</label>
                        </div>
                        <div className="ml-4 mt-2 mb-2">
                            <label>Prediction: </label>
                            <label id="forecastingOutput4">undefined</label>
                        </div>
                    </div>

                </div>
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

export default BivA;