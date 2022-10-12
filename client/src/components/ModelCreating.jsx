import React, { useEffect } from "react";
import generateATable from "../functions/TableCreator.js";
import Plotly from 'plotly.js-dist';
import {
    useHistory
  } from "react-router-dom";


const ModelCreation = () => {
    const navigate = useHistory()

    // On page update
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
                
                let selectionBox = document.getElementById('response')
                selectionBox.innerHTML = "";
                
                for (let i = 0; i < data.length; i++){
                    selectionBox.innerHTML += "<option value="+data[i]+">"+data[i]+"</option>"
                }

            })
    });
    const applyModel = () => {
        let fd = new FormData()
        let file = new File(    [new Blob([window.data])], 
                                sessionStorage.getItem('raw_file_fileName'));
                                
        fd.append('file', file);
        fd.append('response', document.getElementById('response').value);
        fd.append('missing_values', document.getElementById('missingValues').value);
        fd.append('scalar', document.getElementById('scalar').value);
        fd.append('encoder', document.getElementById('encoder').value);
        fd.append('NClusters', document.getElementById('Nclusters').value);
        fd.append('gridsearch', document.getElementById('gridsearch').value);

        fetch("/applyModel",{
            method: 'POST',
            body: fd
        }).then(
            res=>res.json()
        ).then(
            data=> {
                console.log(data);
                let traces = {
                    x: data.graphinfo.x,
                    y: data.graphinfo.y,
                    mode: 'markers',
                    type: 'scatter',
                    marker: {
                        color: data.graphinfo.z,
                        size: 11,
                        line: {
                            color: "rgba(68,107,166,1)",
                            width:1
                        }
                    },
                    opacity: 0.95
                }
                let layout = {
                    margin: {
                        b:24,
                        t:24,
                        r:24,
                        l:24
                    },
                    showlegend:true
                }
                let d = [traces];

                let lab = ['Acc','Rec', 'Pre', 'f1']
                let tableData = [   [data.acc.toFixed(2)],
                                    [data.recall.toFixed(2)],
                                    [data.pre.toFixed(2)],
                                    [data.f1.toFixed(2)],
                                    [data.bestp.max_iter.toFixed(2)]]

                document.getElementById('table').innerHTML = generateATable(lab, tableData);
                Plotly.newPlot('graph1', d, layout);
            }
        );
    }

    const returnB = () => {
        navigate.push('/BivA');
    }
    // Making graph resize with the window
    window.addEventListener('resize', () => {
            
        // Yes, it works awfully bad
        let graphDiv = document.getElementById('graph1');
        let update = {
            width:  graphDiv.offsetWidth,
            height: graphDiv.offsetHeight
        }
        Plotly.relayout(graphDiv, update, 0);

    });
    return (
        <div>
            {/* Title */}
            <h1 className='flex items-center justify-center
            mt-2 text-3xl text-gray-700 font-semibold'>Model Creation</h1>
            <div className="grid grid-cols-2 gap-4 mt-2 ml-2">
                <div className="mt-2 border-gray-400 bg-gray-300 border rounded-lg px-4 py-4 mx-2 my-2">
                    {/* Response Variable */}
                    <div className="grid grid-cols-2 gap-1 mb-2">
                        <label className="mb-1">*Response: </label>
                        <select id="response" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                        w-full h-full justify-center pb-1 pl-1">

                        </select>
                    </div>
                    {/* Missing Values */}
                    <div className="grid grid-cols-2 gap-1 mb-2">
                        <label className="mb-1">*MissingValues: </label>
                        <select id="missingValues" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                        w-full h-full justify-center pb-1 pl-1">
                            <option value="impute">Impute</option>
                            <option value="remove">Remove</option>
                        </select>
                    </div>
                    {/* Scalar */}
                    <div className="grid grid-cols-2 gap-1 mb-2">
                        <label className="mb-1">*Scalar: </label>
                        <select id="scalar" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                        w-full h-full justify-center pb-1 pl-1">
                            <option value="standard">Standard</option>
                            <option value="MinMax">MinMax</option>
                        </select>
                    </div>
                    {/* Encoder */}
                    <div className="grid grid-cols-2 gap-1 mb-2">
                        <label className="mb-1">*Encoder: </label>
                        <select id="encoder" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                        w-full h-full justify-center pb-1 pl-1">
                            <option value="Label">Label</option>
                            <option value="Onehot">Onehot</option>
                            <option value="Dummy">Dummy</option>
                        </select>
                    </div>
                    {/* Nclusters */}
                    <div className="grid grid-cols-2 gap-1 mb-2">
                        <label className="mb-1">*NClusters: </label>
                        <input placeholder="*Input '-1' if unknown" id="Nclusters" type="input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                    w-full h-full justify-center pl-2"></input>
                    </div>
                    {/* Grid Search */}
                    <div className="mb-2">
                        <label className="mb-1">*GridSearch: </label>
                        <input type="checkbox" id="gridsearch"className="ml-2"></input>
                    </div>
                </div>

                            {/* Not essential options */}
                <div className="mt-2 border-gray-400 bg-gray-300 border rounded-lg px-4 py-4 my-2 pl-2 mr-4">
                    {/* Dimensionality Reduction */}
                    <div className="grid grid-cols-2 gap-1 mb-2">
                        <label className="mb-1">DReduction: </label>
                        <select id="reduction" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                            w-full h-full justify-center pb-1 pl-1">
                            <option value="auto">Auto</option>
                            <option value="none">None</option>
                            <option value="pca">PCA</option>
                            <option value="tsne">TSNE</option>
                        </select>
                    </div>
                    {/* classifier  */}
                    <div className="grid grid-cols-2 gap-1 mb-2">
                        <label className="mb-1">Classifier: </label>
                        <select id="classifier" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                            w-full h-full justify-center pb-1 pl-1">
                            <option value="auto">Auto</option>
                            <option value="none">None</option>
                            <option value="pca">PCA</option>
                            <option value="tsne">TSNE</option>
                        </select>
                    </div>
                    {/* imputer  */}
                    <div className="grid grid-cols-2 gap-1 mb-2">
                        <label className="mb-1">Imputer: </label>
                        <select id="imputer" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                            w-full h-full justify-center pb-1 pl-1">
                            <option value="auto">Auto</option>
                            <option value="none">None</option>
                            <option value="pca">PCA</option>
                            <option value="tsne">TSNE</option>
                        </select>
                    </div>
                    {/* continuous_threshold  */}
                    <div className="grid grid-cols-2 gap-1 mb-2">
                        <label className="mb-1">CT: </label>
                        <input id="continuous_threshold" type="input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                    w-full h-full justify-center pl-2"></input>
                    </div>
                    {/* testsplit   */}
                    <div className="grid grid-cols-2 gap-1 mb-2">
                        <label className="mb-1">TestSplit: </label>
                        <input id="testsplit " type="input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                    w-full h-full justify-center pl-2"></input>
                    </div>
                    {/* Force_Comp */}
                    <div className="grid grid-cols-2 gap-1">
                        <div className="mb-2">
                            <label className="mb-1">Force_comp: </label>
                            <input type="checkbox" id="force_comp"className="ml-2"></input>
                        </div>
                    </div>

                    {/* discreatize   */}
                    <div className="grid grid-cols-2 gap-1">
                        <div className="mb-2">
                            <label className="mb-1">Discreatize: </label>
                            <input type="checkbox" id="discreatize "className="ml-2"></input>
                        </div>
                    </div>
                    {/* allow_fail  */}
                    <div className="grid grid-cols-2 gap-1">
                        <div className="mb-2">
                            <label className="mb-1">Allow_fail: </label>
                            <input type="checkbox" id="allow_fail"className="ml-2"></input>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div id="table" className="mx-4"></div>

            {/* Graphs */}
            <div className="mb-2 mx-8 my-8">
                <div id="graph1"></div>
            </div>
            

            
            {/* Apply Model Buttpom */}
            <div className="flex justify-between ">
                <button id ="return" className='
                mb-3 ml-4 right-0 h-8 w-16
                bg-gray-100 rounded-md shadow-lg
                text-gray-900 border border-gray-400
                hover:transition
                hover:bg-gray-400 hover:border-gray-500' onClick={returnB}>
                    Return
                </button>
                <button id ="continueButton" className='
                mb-3 mr-4 right-0 h-8 w-16
                bg-blue-300 rounded-md shadow-lg
                text-gray-900 border border-blue-400
                hover:transition
                hover:bg-sky-600 hover:border-blue-700' onClick={applyModel}>
                    Apply
                </button>
            </div>
        </div>
    )
}

export default ModelCreation;