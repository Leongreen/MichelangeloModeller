import React from 'react'

const DefaultPage = ({children}) => {
    return (
        <div className='shadow-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
        bg-gray-200 mx-auto min-h-1/4 rounded-xl
        min-w-full w-auto
        md:min-w-4/5 md:min-h-1/4
        lg:min-w-3/5 lg:min-h-1/4
        xl:min-w-2/5 xl:min-h-1/4
        xxl:min-w-1/5 xxl:min-h-1/4
        grow'>
            {children}
        </div>
    )
}

export default DefaultPage;