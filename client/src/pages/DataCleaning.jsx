import React from 'react';
import Toggle from '../components/Toggle';
import HorizontalTable from '../components/HorizontalTable';
import ResponseTable from '../components/ResponseTable';
import CheckBoxTable from '../components/CheckBoxTable';

export default function DataCleaning () {
    
    return(
        <div>
            <div className="gap-4 mt-4 mx-4 flex">
                
                <div className='w-[400px]'>
                    <CheckBoxTable title="Column Selection" description="Manually select columns to use during analysises and modelling. Prediction column will be visible only if response variable is chosen"></CheckBoxTable>
                </div>
                <div className='w-[400px]'>
                    <ResponseTable title="Response Column" description="Manually select columns to use during analysises and modelling. Prediction column will be visible only if response variable is chosen"></ResponseTable>
                </div>
                
            </div>
        </div>
    )
}