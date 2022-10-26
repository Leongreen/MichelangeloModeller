import React from 'react';

const MultiA = () => {
    let fd = new FormData()
    let file = new File(    [new Blob([window.data])], 
                            sessionStorage.getItem('raw_file_fileName'));
    
    fd.append('file', file);
    

    fetch("/MultilinearRegression",{
        method: 'POST',
        body: fd
    }).then(
        res=>res.json()
    ).then(
        data=> {
            console.log(data)
            document.getElementById('output').innerHTML = data;
        })
    return (
        <div className='h-full'>
            <div className='px-8 py-8 grid grid-cols-2 grid-rows-3 h-full gap-4'>
                <div id='output'></div>
            </div>
        </div>
    )
}

export default MultiA;