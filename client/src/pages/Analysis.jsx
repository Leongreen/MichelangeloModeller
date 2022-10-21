import React from 'react';
import {useNavigate, Routes} from "react-router-dom";


const Analysis = ({children}) => {
    const navigate = useNavigate();

    return (
            <div className='h-full mt-16 '>
                <div className='bg-gray-200 rounded-lg shadow-lg mx-auto max-w-[1200px] border border-gray-400'>
                    <div className=''>
                        <div className='grid grid-cols-5'>
                            <div className='bg-white h-full w-full rounded-l-lg border-r border-slate-300'>
                                <div className='grid grid-rows items-stretch'>
                                    <button onClick={() => navigate('/')} className='transition w-full text-left text-base font-medium text-slate-600 py-4 px-4 hover:bg-slate-200 hover:text-slate-900 rounded-tl-lg'>Upload Dataset</button>
                                    <button onClick={() => navigate('/DataCleaning')} className='transition w-full text-left text-base font-medium text-slate-600 py-4 px-4 hover:bg-slate-200 hover:text-slate-900 border-b'>Data Cleaning</button>
                                    <button onClick={() => navigate('/Univariable')} className='transition w-full text-left text-base font-medium text-slate-600 py-4 px-4 hover:bg-slate-200 hover:text-slate-900 '>Univariable Analysis</button>
                                    <button onClick={() => navigate('/Bivariable')} className='transition w-full text-left text-base font-medium text-slate-600 py-4 px-4 hover:bg-slate-200 hover:text-slate-900 '>Bivariable Analysis</button>
                                    <button onClick={() => navigate('/Multivariable')} className='transition w-full text-left text-base font-medium text-slate-600 py-4 px-4 hover:bg-slate-200 hover:text-slate-900 '>Multivariable Analysis</button>
                                    <button onClick={() => navigate('/Multilinear')} className='transition w-full text-left text-base font-medium text-slate-600 py-4 px-4 hover:bg-slate-200 hover:text-slate-900 '>Multilinear Regression</button>
                                    <button onClick={() => navigate('/Randomization')} className='transition w-full text-left text-base font-medium text-slate-600 py-4 px-4 hover:bg-slate-200 hover:text-slate-900 '>Randomization Test</button>
                                    <button onClick={() => navigate('/Model')} className='transition w-full text-left text-base font-medium text-slate-600 py-4 px-4 hover:bg-slate-200 hover:text-slate-900 border-b'>Model Creation</button>
                                    <button onClick={() => navigate('/Export')} className='transition w-full text-left text-base font-medium text-slate-600 py-4 px-4 hover:bg-slate-200 hover:text-slate-900 border-b'>Export Results</button>
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