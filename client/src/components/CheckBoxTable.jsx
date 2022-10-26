import React, {useState, useEffect} from 'react';
import Toggle from '../components/Toggle';

export default function CheckBoxTable(props) {
    const [labels, setLabels] = useState([]);
    const [prediction, setPrediction] = useState([]);
    const [loaded, setLoaded] = useState();
    useEffect(() =>{

        let fd = new FormData()
        let file = new File(    [new Blob([window.data])], 
                                            sessionStorage.getItem('raw_file_fileName'))
        
        fd.append('file', file)
        fd.append('var', window.responseVar)

        fetch("/ObtainPredictions",{
            method: 'POST',
            body: fd
        }).then(
            res=>res.json()
        ).then(
            data=> {
                setPrediction(data);
            })
        
        fetch("/ObtainColumnNames",{
            method: 'POST',
            body: fd
        }).then(
            res=>res.json()
        ).then(
            data=> {
                setLabels(data);
                props.setColumns(data);
            })
    }, [loaded, props.givenState])

    function turnColumn(index){
        console.log(labels[index])
        console.log(props.columns)
        let localArray = props.columns;
        if (localArray.indexOf(labels[index]) != -1){
            localArray.splice(localArray.indexOf(labels[index]), 1);
        } else {
            localArray.push(labels[index]);
        }
        props.setColumns(localArray);
    }

    function generateTR(i){
        let TD = [];
        if (labels[i] !== window.responseVar) {
            TD.push(<td scope="col" className="border py-2 px-8 transition hover:bg-gray-200">{labels[i]}</td>);
            TD.push(<td scope="col" className="border py-2 px-8 transition ">
                <Toggle onSwitch={() => turnColumn(i)} default={true}></Toggle>
            </td>)
            TD.push(<td scope="col" className="border py-2 px-8 transition ">{prediction[i]? prediction[i].toFixed(2) : 0}</td>)
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
                    <td scope="col" className="border py-2 px-8 ">Prediction</td>
                </tr>
            </thead>
            <tbody className='bg-white min-w-full'>
                {generateTD()}
            </tbody>
            </table>
        </div>
    )
}