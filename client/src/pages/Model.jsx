import React, {useEffect, useState} from "react"
import generateATable from "../functions/TableCreator";
import Plotly from 'plotly.js-dist';
import HorizontalTable from '../components/HorizontalTable';
import SelectionMenu from '../components/SelectionMenu';
import VariableSelector from "../components/VariableSelector";

const Model = () => {
    const [setVar1, var1] = useState('defaultVariable');
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

        // Table for Mean/Mode/Median/SD
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
                                           description="The following table will show basic Classification performance for the selected variable."
                                           labels={['Classifier', 'Accuracy']} data={
                                           [[data.summarytable[0][0], data.summarytable[0][1].toFixed(2)],
                                            [data.summarytable[1][0], data.summarytable[1][1].toFixed(2)],
                                            [data.summarytable[2][0], data.summarytable[2][1].toFixed(2)],
                                            [data.summarytable[3][0], data.summarytable[3][1].toFixed(2)]]}></HorizontalTable>);

                setTablesLoaded(true)
            }
        );
        
    }, []);

    return (
        <div className='h-full'>
           {/* Main grid */}
           <div className="grid-flow-row-dense grid grid-rows-2 grid-cols-2 mx-4 my-4 gap-4 grow ">
                {/* Classifier */}
                <div className=" max-h-[400px] ">

                    <div className="grid grid-rows-2 gap-2 mt-2 max-w-[455]">
                        <div className="w-full " id="table1">
                            {tablesLoaded? table1 : <HorizontalTable title="Classifiers" description="The following table will show basic Classification performance for the selected variable."
                                                    labels={['Classifier', 'Accuracy']} data={[]} ></HorizontalTable>}
                        </div>

                    </div>
                </div>
                
                {/* Classifier Specified */}
                <div className="max-h-[600px]">
                    <div className="grid grid-rows-2 gap-2 ">

                    </div>
                </div>
                


                {/* Graph */}
                <div className="shadow-md h-full border border-gray-400 bg-gray-100 col-span-2">
                    <div id="graph" className="mx-4 my-4">

                    </div>
                </div>

            </div>
        </div>
    )
}

export default Model;