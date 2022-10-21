import React from 'react';
import Toggle from '../components/Toggle';
import HorizontalTable from '../components/HorizontalTable';

export default function DataCleaning () {
    return(
        <div>
            <div className='w-[400px] mx-auto my-12'>
                <HorizontalTable title="TestTitle" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ac rutrum leo. Suspendisse porta sodales dolor."
                labels={['l1','l2','l3']} data={[[1,2,7],[3,4,8],[5,6,9]]} ></HorizontalTable>
                <Toggle></Toggle>
            </div>
        </div>
    )
}