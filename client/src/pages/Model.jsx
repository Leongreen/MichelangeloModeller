import React, {useEffect, useState} from "react"
import generateATable from "../functions/TableCreator";
import Plotly from 'plotly.js-dist';
import HorizontalTable from '../components/HorizontalTable';
import SelectionMenu from '../components/SelectionMenu';
import VariableSelector from "../components/VariableSelector";

const Model = () => {
    const images = require.context("../../../backend", true);

    const [loadedPage, setLoadedPage] = useState(true);

    const [localImage1, setLocalImage1] = useState(null);
    const [localImage2, setLocalImage2] = useState(null);
    const [localImage3, setLocalImage3] = useState(null);
    const [localImage4, setLocalImage4] = useState(null);

    const [tablesLoaded, setTablesLoaded] = useState(false);
    const [table1, setTable1] = useState(<HorizontalTable title="Classifiers" description="The following table will show basic Classification performance for the selected variable."
    labels={['Classifier', 'Accuracy']} data={[]} ></HorizontalTable>);


    useEffect(() => {
        setTablesLoaded(false);
        let fd = new FormData()
        let file = new File([new Blob([window.data])],
            sessionStorage.getItem('raw_file_fileName'));

        fd.append('file', file);
        fd.append('response', window.responseVar);

        
        fetch("/applyModel", {
            method: 'POST',
            body: fd
        }).then(
            res => res.json()
        ).then(
            data => {
                console.log(data);
                // let d = data[var1];

                setTable1(<HorizontalTable title="Classifiers"
                                           description="The following table will show basic Classification performance of each model"
                                           labels={['Classifier', 'Accuracy']} data={
                                           [[data.summarytable[0][0], data.summarytable[0][1].toFixed(2)],
                                            [data.summarytable[1][0], data.summarytable[1][1].toFixed(2)],
                                            [data.summarytable[2][0], data.summarytable[2][1].toFixed(2)],
                                            [data.summarytable[3][0], data.summarytable[3][1].toFixed(2)]]}></HorizontalTable>);
                
                
                

                setLocalImage1(images('./gpc.png'));
                setLocalImage2(images('./mlp.png'));
                setLocalImage3(images('./sgd.png'));
                setLocalImage4(images('./svc.png'));

                setTablesLoaded(true)
            }
        );
        
    }, [loadedPage]);

    return (
        <div className='h-full'>
           {/* Main grid */}
           <div className="grid-cols-2 mx-4 my-4 gap-4 grow ">
                {/* Classifier */}
                <div className=" max-h-[400px] ">

                    <div className="flex mb-4 gap-2 mt-2 max-w-[455]">
                        <div className="w-full " id="table1">
                            {tablesLoaded? table1 : <HorizontalTable title="Classifiers" description="The following table will show basic Classification performance for the selected variable."
                                                    labels={['Classifier', 'Accuracy']} data={[]} ></HorizontalTable>}
                        </div>

                    </div>
                </div>
                


                
                
            </div>
            <div className="max-w-[1000px] max-h-[1000px] grid grid-rows-2 grid-cols-2 gap-4 my-4 mx-4">
             <div className="overflow-hidden rounded-lg shadow-lg max-w-[500px] max-h-[500px]">
                <img className="max-w-[500px] max-h-[500px] mx-auto " src={localImage1}></img>
             </div>
             <div className="overflow-hidden rounded-lg shadow-lg max-w-[500px] max-h-[500px]">
                <img className="max-w-[500px] max-h-[500px] mx-auto " src={localImage2}></img>
            </div>
             <div className="overflow-hidden rounded-lg shadow-lg max-w-[500px] max-h-[500px]">
                <img className="max-w-[500px] max-h-[500px] mx-auto " src={localImage3}></img>
             </div>
             <div className="overflow-hidden rounded-lg shadow-lg max-w-[500px] max-h-[500px]">
                <img className="max-w-[500px] max-h-[500px] mx-auto " src={localImage4}></img>
             </div>
            </div>
        </div>
    )
}

export default Model;