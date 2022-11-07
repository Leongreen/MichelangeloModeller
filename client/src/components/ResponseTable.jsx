import React, {useState, useEffect, useContext} from 'react';
import Toggle from '../components/Toggle';
import { UserContext } from '../App';

export default function ResponseTable(props) {
    const [labels, setLabels] = useState([]);
    const [prediction, setPrediction] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [rawDataChanged, setRawDataChanged, resChanged, setResChanged]= useContext(UserContext);
    useEffect(() =>{
        let fd = new FormData()
        let file = new File(    [new Blob([window.data_raw])], 
                                            sessionStorage.getItem('raw_file_fileName'))
        
        fd.append('file', file)
        fetch("/ObtainResponseColumnNames",{
            method: 'POST',
            body: fd
        }).then(
            res=>res.json()
        ).then(
            data=> {

                setLabels(data);
            })
    }, [loaded])

    function changeResponse(res){
        window.responseVar = res;
        props.setParentState(res);
        setResChanged(true);
    }

    function generateTR(i){
        let TD = [];
        
        TD.push(<td scope="col" className="border py-2 px-8 transition hover:bg-gray-200">{labels[i]}</td>);
        if (labels[i] == window.responseVar) {
            TD.push(<td scope="col" className="border py-2 px-8 transition"><input className='mx-auto' type="radio" name="response" checked value={labels[i]} 
                                onChange={() => changeResponse(labels[i])} /></td>)
        } else {
            TD.push(<td scope="col" className="border py-2 px-8 transition"><input className='mx-auto' type="radio" name="response" value={labels[i]} 
            onChange={() => changeResponse(labels[i])} /></td>)
        }

        return TD;
    }
    function generateTD() {
        let TR = [];
        for (let i = 0; i < labels.length; i++) {
            TR.push(<tr>
                {generateTR(i)}
            </tr>)
        }
        return TR;
    }

    return (
        <div className="overflow-hidden  shadow-md sm:rounded-lg border border-gray-400">
            <table className="w-full text-sm text-left text-gray-700">
                <caption className="p-5 text-lg font-semibold text-left text-gray-700 bg-white ">{props.title}
                    <p className="mt-1 text-sm font-normal text-gray-500 ">{props.description}</p>
                </caption>
            
            <thead className="text-xs text-gray-700 bg-gray-100">
                <tr>
                    <td scope="col" className="border py-2 px-8 ">Label</td>
                    <td scope="col" className="border py-2 px-8 ">To Use</td>
                </tr>
            </thead>
            <tbody className='bg-white min-w-full'>

                {generateTD()}
            </tbody>
            </table>
        </div>
    )
}