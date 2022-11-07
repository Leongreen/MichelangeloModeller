import React from 'react';
import { useEffect, useState, useContext } from 'react';
import generateATable from '../functions/TableCreator';
import HorizontalTable from '../components/HorizontalTable';
import LoadingSpinner from '../components/LoadingSpinner';
import { createElement } from 'react';
import { UserContext } from '../App';


const DataUpload = () => {
    const [dataLoaded, setDataLoaded] = useState(true);
    const [table, setTable] = useState('');
    const [rawDataChanged, setRawDataChanged, resChanged, setResChanged ]= useContext(UserContext);
    
    const uploadDataset = () => {
        let input = document.getElementById("file");
        let file;
        input.click();

        input.onchange = e => {
            // Resetting the state to false making a point we are currently loading it
            setDataLoaded(false);

            // Obtaining user passed file and creating a formdata to
            // pass this file to the backend
            file = e.target.files[0];
            var fd = new FormData()
            // Appending file to the formdata
            fd.append('file', file);

            // Saving a file name to retrive it later
            let filename = file.name

            try {
                // This fetch sends a request to python so it can parse the file to json
                fetch("/SendJSONFile", {
                    method: 'POST',
                    body: fd
                }).then(
                    res => res.json()
                ).then(
                    data => {
                        // Setting UseState to remember the file
                        window.data_raw = JSON.stringify(data)
                        fd = new FormData();
                        sessionStorage.setItem('raw_file_fileName', filename.substr(0, filename.indexOf('.')) + '.json')
                        file = new File([new Blob([window.data_raw])],
                            sessionStorage.getItem('raw_file_fileName'))
                        
                        fd.append('file', file)

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

                                setDataLoaded(true);
                                // Cleaning the data since the response is messed up
                                let d = [];
                                let l = [];
                                for (let i = 0; data[i] !== undefined; i++) {
                                    l.push(data[i].label);
                                    d.push([])
                                    for (let j = 0; data[j] !== undefined; j++){
                                        d[i].push(data[j].data[i])
                                    }
                                }
                                setTable(<HorizontalTable 
                                    title="Dataset preview"
                                    labels={l}
                                    data={d}
                                    description="The following table shows data preview which allows you to confirm that the loaded dataset is not corrupted and succesfully uploaded."></HorizontalTable>)

                                setRawDataChanged(true);
                                if (window.data === undefined){
                                    window.data = "";
                                }
                            }
                        ) // FirstEntries Fetch ends
                    }
                )
            } catch(e) {
                console.log('Error fetching data: ' + e.message)
                setDataLoaded(false);
            } // Main Fetch Ends    
        } // Listener for the file upload ends
    }

    return (
        <div className='h-full'>
            <div className='mx-auto my-auto'>
                <input type="file" id="file" accept=".csv, .xlsx, .xls, .parquet, .txt, .json" hidden="hidden"></input>
                <button onClick={uploadDataset} className='bg-white border transition border-gray-400 rounded-xl
                grid gap-2 content-center
                shadow-md
                px-16
                hover:bg-slate-300
                hover:transition
                mt-8 mx-auto
                text-2xl text-gray-700'>
                    <div className='conter-center mx-auto my-auto mb-8'>
                        <svg className=" mt-8
                        stroke-[rgb(23,66,112)] w-32 h-32 "
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                            stroke="#334155">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
                        </svg>
                    </div>
                    <div className='mb-8'>
                        Upload Dataset
                    </div>
                </button>
                <div className='mt-12 mx-8 max-h-[400px] overflow-hidden hover:overflow-y-scroll max-w-[1200px]'>
                    {dataLoaded? <div className='w-full h-full mb-8'>{table}</div> : <LoadingSpinner/>}
                </div>
            </div>
        </div>
    )
};

export default DataUpload;