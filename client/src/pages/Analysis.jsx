import React from 'react';
import {useNavigate, Routes} from "react-router-dom";


const Analysis = ({children}) => {
    const navigate = useNavigate();

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
                                    <button onClick={() => navigate('/DataCleaning')} className='transition text-left text-base font-medium text-slate-600 py-4 px-4 hover:bg-slate-200 hover:text-slate-900 border-b'>Data Cleaning</button>
                                    <button onClick={() => navigate('/Univariable')} className='transition text-left text-base font-medium text-slate-600 py-4 px-4 hover:bg-slate-200 hover:text-slate-900 '>Univariable Analysis</button>
                                    <button onClick={() => navigate('/Bivariable')} className='transition text-left text-base font-medium text-slate-600 py-4 px-4 hover:bg-slate-200 hover:text-slate-900 '>Bivariable Analysis</button>
                                    <button onClick={() => navigate('/MultiA')} className='transition text-left text-base font-medium text-slate-600 py-4 px-4 hover:bg-slate-200 hover:text-slate-900 '>Multilinear Regression</button>
                                    <button onClick={() => navigate('/Model')} className='transition text-left text-base font-medium text-slate-600 py-4 px-4 hover:bg-slate-200 hover:text-slate-900 border-b'>Model</button>
                                    <button onClick={() => downloadResults()} className='transition text-left text-base font-medium text-slate-600 py-4 px-4 hover:bg-slate-200 hover:text-slate-900 border-b'>Export Results</button>
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