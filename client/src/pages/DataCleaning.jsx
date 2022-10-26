import React, {useState, useEffect} from 'react';
import Toggle from '../components/Toggle';
import HorizontalTable from '../components/HorizontalTable';
import ResponseTable from '../components/ResponseTable';
import CheckBoxTable from '../components/CheckBoxTable';

export default function DataCleaning () {
    const [responseState, setResponseState] = useState('');
    const [columnsToSave, setColumnsToSave] = useState([]);
    useEffect(() => {

    })
    return(
        <div>
            <div className="gap-4 my-4 mx-4 flex">
                
                <div className='w-[400px]'>
                    <CheckBoxTable columns={columnsToSave} setColumns={setColumnsToSave} givenState={responseState} title="Column Selection" description="Manually select columns to use during analysises and modelling. Prediction column will be visible only if response variable is chosen"></CheckBoxTable>
                </div>
                <div className='w-[400px]'>
                    <ResponseTable setParentState={setResponseState} title="Response Column" description="Manually select columns to use during analysises and modelling. Prediction column will be visible only if response variable is chosen"></ResponseTable>
                </div>
                
            </div>
        </div>
    )
}