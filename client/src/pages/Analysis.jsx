import React, {useState, useContext} from 'react';
import {useNavigate, Routes} from "react-router-dom";
import { UserContext } from '../App';


const Analysis = ({children}) => {
    const navigate = useNavigate();


    const [rawDataChanged, setRawDataChanged, resChanged, setResChanged] = useContext(UserContext);


    React.useEffect(() => {

    },)

    function downloadResults(){
        let fd = new FormData()
        let f = new File([new Blob([window.data])],
            sessionStorage.getItem('raw_file_fileName'));

        fd.append('file', f);
        fd.append('response', window.responseVar);
        fetch("/downloadResults", {
            method: 'POST',
            body: fd
        }).then(resp => resp.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.style.display = "none";
            a.href = url;
            a.download = "results.xlsx";
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            })
        
    }


    return (
            <div className='h-full mt-16 flex'>
                <div className='bg-gray-200 rounded-lg shadow-lg mx-auto border border-gray-400'>
                    <div className=''>
                        <div className='grid grid-cols-5'>
                            <div className='bg-white h-full rounded-l-lg border-r border-slate-300'>
                                <div className='grid grid-rows items-stretch'>
                                    <button onClick={() => navigate('/')} className='transition text-left text-base font-medium text-slate-600 py-4 px-4 hover:bg-slate-200 hover:text-slate-900 rounded-tl-lg'>Upload Dataset</button>
                                    {!rawDataChanged? <div className='transition text-left text-base font-medium text-gray-400 py-4 px-4 border-b'>Data Cleaning</div> :
                                    <button onClick={() => navigate('/DataCleaning')} 
                                    className='transition text-left text-base font-medium text-slate-600 py-4 px-4 hover:bg-slate-200 hover:text-slate-900 border-b'>Data Cleaning</button>}
                                    {!resChanged? <div className='transition text-left text-base font-medium text-gray-400 py-4 px-4'>Univariable Analysis</div> :
                                    <button onClick={() => navigate('/Univariable')}
                                     className='transition text-left text-base font-medium text-slate-600 py-4 px-4 hover:bg-slate-200 hover:text-slate-900 '>Univariable Analysis</button>}
                                    
                                    {!resChanged? <div className='transition text-left text-base font-medium text-gray-400 py-4 px-4'>Bivariable Analysis</div> :
                                    <button onClick={() => navigate('/Bivariable')} 
                                    className='transition text-left text-base font-medium text-slate-600 py-4 px-4 hover:bg-slate-200 hover:text-slate-900 '>Bivariable Analysis</button>}
                                    
                                    <div className='transition text-left text-base font-medium text-gray-400 py-4 px-4'>Multilinear Regression</div>
                                    
                                    {!resChanged? <div className='transition text-left text-base font-medium text-gray-400 py-4 px-4 border-b'>Model</div> :
                                    <button onClick={() => navigate('/Model')} 
                                    className='transition text-left text-base font-medium text-slate-600 py-4 px-4 hover:bg-slate-200 hover:text-slate-900 border-b'>Model</button>}

                                    {!resChanged? <div className='transition text-left text-base font-medium text-gray-400 py-4 px-4 border-b'>Export Results</div> :
                                    <button onClick={() => downloadResults()} 
                                    className='transition text-left text-base font-medium text-slate-600 py-4 px-4 hover:bg-slate-200 hover:text-slate-900 border-b'>Export Results</button>}
                                </div>
                            </div>
                            {/* Analysis Section */}
                            <div className='col-span-4'>
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    ) 
}

export default Analysis;