import React from 'react'
import {
    useHistory
  } from "react-router-dom";

const WelcomePage = () => {
    const navigate = useHistory()
    window.data = "Hello";
    const uploadDataset = () => {
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
            fetch("/SendJSONFile",{
                method: 'POST',
                body: fd
            }).then(
                res=>res.json()
            ).then(
                data=> {
                    window.data = JSON.stringify(data)
                    sessionStorage.setItem('raw_file_fileName', filename.substr(0, filename.indexOf('.')) + '.json')
                    // LEGACY
                    // // An example of how to save files to the session
                    // sessionStorage.setItem('raw_file', JSON.stringify(data))
                    // // This parse is needed to remove previous extension of a file and add a .json extension
                    // sessionStorage.setItem('raw_file_fileName', filename.substr(0,filename.indexOf('.')) + '.json')

                    // // The following fetch has to be called after file is saved since it is going
                    // // to call the saved file for the testing purposes
                    //  /**
                    //  * The following code snippet show how to access raw_file
                    //  * and send it back to backend. Session storage cannot store
                    //  * a file itself so store contents of a file in json and create
                    //  * a new file in json format to pass it to the backend
                    //  */
                    // // SNIPPET STARTS {
                    //     fd = new FormData()
                    //     file = new File(    [new Blob([sessionStorage.getItem('raw_file')])], 
                    //                         sessionStorage.getItem('raw_file_fileName'))
                        
                    //     fd.append('file', file)
                    // // } SNIPPET ENDS

                    // TODO: Check if Session storage contains "raw_file" else send an error
                    navigate.push('/DataReveal')
                }
            ) // Main Fetch Ends    
        } // Listener for the file upload ends
    } // Function for the upload button ends

    return (
        <div className='flex items-center justify-center mx-auto mt-auto w-auto
        transform -translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2'>
            {/* Button to upload */}
            <input type="file" id="file" accept=".csv, .xlsx, .xls, .parquet, .txt, .json" hidden="hidden"></input>
            <button onClick ={uploadDataset} className='bg-gray-100 rounded-xl 
            grid grid-rows-1 gap-2 content-center
            shadow-md
            pl-16 pr-16
            hover:bg-gray-300
            hover:transition
            mx-auto
            text-2xl text-gray-700'>
                <div className='conter-center mx-auto my-auto mb-8'>
                    <svg className=" mt-8 
                    stroke-[rgb(23,66,112)] w-32 h-32 " 
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                </div>
                <div className='mb-16'>
                    Click here to upload a Dataset
                </div>
            </button>
        </div>
    )
}

export default WelcomePage;