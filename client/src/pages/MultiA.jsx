import React from 'react';

const MultiA = () => {
    return (
        <div className='h-full'>
            <div className='px-8 py-8 grid grid-cols-2 grid-rows-3 h-full gap-4'>
                <div className='w-full h-full bg-gray-100 border border-gray-400 rounded-lg shadow-sm'>
                    <div className='px-2 py-2'>Here goes Variable selection and a table</div>
                </div>
                <div className='w-full h-full bg-gray-100 border border-gray-400 rounded-lg shadow-sm'>
                    <div className='px-2 py-2'>Here goes forecasting</div>
                </div>
                <div className='w-full h-full bg-gray-100 border border-gray-400 rounded-lg shadow-sm col-span-2 row-span-2'>
                    <div className='px-2 py-2'>Here goes the graph</div>
                </div>

            </div>
        </div>
    )
}

export default MultiA;