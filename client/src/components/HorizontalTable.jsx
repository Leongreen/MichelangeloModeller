import React from 'react';


export default function HorizontalTable(props) {

    function generateTH() {
        let TR = [];
        for (let i = 0; i < props.labels.length; i++) {
            TR.push(<th scope="col" className="border py-3 px-8">{props.labels[i]}</th>);
        }
        return TR;
    }
    function generateTR(d){
        let TD = [];
        for (let k = 0; k < d.length; k++){
            TD.push(<td scope="col" className="border py-2 px-8 transition hover:bg-gray-200">{d[k]}</td>);
        }
        return TD;
    }
    function generateTD() {
        let TR = [];
        for (let i = 0; i < props.data.length; i++) {
            TR.push(<tr>
                {generateTR(props.data[i])}
            </tr>)
        }
        return TR;
    }


    return (
        <div className="overflow-hidden hover:overflow-y-scroll overflow-x-auto shadow-md sm:rounded-lg border border-gray-400">
            <table className="w-full text-sm text-left text-gray-700">
                <caption className="p-5 text-lg font-semibold text-left text-gray-700 bg-white ">{props.title}
                    <p className="mt-1 text-sm font-normal text-gray-500 ">{props.description}</p>
                </caption>
            
            <thead className="text-xs text-gray-700 bg-gray-100">
                <tr >
                    {generateTH()}
                </tr>
            </thead>
            <tbody className='bg-white min-w-full'>
                {generateTD()}
                
            </tbody>
            </table>
        </div>
    )
}