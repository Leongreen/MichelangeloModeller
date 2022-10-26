import React, {useState, useEffect} from 'react';
import Toggle from '../components/Toggle';
import HorizontalTable from '../components/HorizontalTable';
import ResponseTable from '../components/ResponseTable';
import CheckBoxTable from '../components/CheckBoxTable';

export default function DataCleaning () {
    const [responseState, setResponseState] = useState('');

    useEffect(() => {

    })
    return(
        <div>
            <div className="gap-4 my-4 mx-4 flex">
                
                <div className='w-[400px]'>
                    <CheckBoxTable  givenState={responseState} title="Column Selection" description="Select variables to use during analyses and modelling. Prediction column will be visible only if response variable when chosen, this prediction column shows the impact of the feature on the response variable"></CheckBoxTable>
                </div>
                <div className='w-[400px]'>
                    <ResponseTable setParentState={setResponseState} title="Select a Categorical variable to use as a response variable. This variable will use the selected predictor variables to predict the class membership of this variable"></ResponseTable>
                </div>
                
            </div>
        </div>
    )
}