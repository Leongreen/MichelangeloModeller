import React from 'react'


const LoadingSpinner = () => {
    return (
        <div className='h-full flex justify-center'>
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-reload mx-auto my-auto animate-spin" width="48" height="48" viewBox="0 0 24 24" strokeWidth="2" stroke="#334155" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1.002 7.935 1.007 9.425 4.747"></path>
                <path d="M20 4v5h-5"></path>
            </svg>
        </div>
    )
}

export default LoadingSpinner;