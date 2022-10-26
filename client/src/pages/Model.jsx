import React, {useEffect, useState} from "react"
import generateATable from "../functions/TableCreator";
import Plotly from 'plotly.js-dist';
import HorizontalTable from '../components/HorizontalTable';
import SelectionMenu from '../components/SelectionMenu';
import VariableSelector from "../components/VariableSelector";

const Model = () => {
    const [setVar1, var1] = useState('defaultVariable');
    const [table1, setTable1] = useState(<HorizontalTable title="Classifiers" description="The following table will show basic Classification performance for the selected variable."
    labels={['Classifier', 'Accuracy']} data={[]} ></HorizontalTable>);

    useEffect(() => {
        let fd = new FormData()
        let file = new File([new Blob([window.data])],
            sessionStorage.getItem('raw_file_fileName'));

        fd.append('file', file);
        fd.append('var', var1);

        // Table for Mean/Mode/Median/SD
        fetch("/applyModel", {
            method: 'POST',
            body: fd
        }).then(
            res => res.json()
        ).then(
            data => {
                let d = data[var1];

                setTable1(<HorizontalTable title="Classifiers"
                                           description="The following table will show basic Classification performance for the selected variable."
                                           labels={['Classifier', 'Accuracy']} data={d}></HorizontalTable>);

            }
        );

    }, [var1]);

    return (
        <div className='h-full'>
            <div className='px-8 py-8 grid grid-cols-2 grid-rows-3 h-full gap-4'>
                <div className='w-full h-full bg-gray-100 border border-gray-400 rounded-lg shadow-sm'>
                    <div className='px-2 py-2'>
                        <div className=" max-h-[400px]">
                            <div className="shadow-lg">
                                <VariableSelector setState={setVar1} label="Select Variable"></VariableSelector>
                            </div>
                            <div className="grid grid-rows-2 gap-2 mt-2">
                                <div className="w-full text-left text-gray-700 max-h-[200px]" id="table1">{table1}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-full h-full bg-gray-100 border border-gray-400 rounded-lg shadow-sm'>
                    <div className='px-2 py-2'>Here goes forecasting</div>
                </div>
                <div
                    className='w-full h-full bg-gray-100 border border-gray-400 rounded-lg shadow-sm col-span-2 row-span-2'>
                    <div className='px-2 py-2'>Here goes the graph</div>
                </div>

            </div>
        </div>
    )
}

export default Model;