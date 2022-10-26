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

    const [table2, setTable2] = useState(<HorizontalTable title="Gaussian Process" description=""
    labels={['f1-score', 'precision','recall', 'support']} data={[]} ></HorizontalTable>);
    const [table3, setTable3] = useState(<HorizontalTable title="LinearSVC" description=""
    labels={['f1-score', 'precision','recall', 'support']} data={[]} ></HorizontalTable>);
    const [table4, setTable4] = useState(<HorizontalTable title="MLP Neural Network" description=""
    labels={['f1-score', 'precision','recall', 'support']} data={[]} ></HorizontalTable>);
    const [table5, setTable5] = useState(<HorizontalTable title="SGD" description=""
    labels={['f1-score', 'precision','recall', 'support']} data={[]} ></HorizontalTable>);

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
                
                
                setTablesLoaded(true)
            
                let tableData1 = [];
                let tableData2 = [];
                let tableData3 = [];
                let tableData4 = [];
                console.log(data['Gaussian Process'][1])
                // Parsing data
                for (let i = 0; data['Gaussian Process'][i] !== undefined; i++){
                    tableData1.push([data['Gaussian Process'][i]['f1-score'].toFixed(2), data['Gaussian Process'][i]['precision'].toFixed(2), data['Gaussian Process'][i]['recall'].toFixed(2), data['Gaussian Process'][i]['support'].toFixed(2)])
                    tableData2.push([data['LinearSVC'][i]['f1-score'].toFixed(2), data['LinearSVC'][i]['precision'].toFixed(2), data['LinearSVC'][i]['recall'].toFixed(2), data['LinearSVC'][i]['support'].toFixed(2)])
                    tableData3.push([data['MLP Neural Network'][i]['f1-score'].toFixed(2), data['MLP Neural Network'][i]['precision'].toFixed(2), data['MLP Neural Network'][i]['recall'].toFixed(2), data['MLP Neural Network'][i]['support'].toFixed(2)])
                    tableData4.push([data['SGD'][i]['f1-score'].toFixed(2), data['SGD'][i]['precision'].toFixed(2), data['SGD'][i]['recall'].toFixed(2), data['SGD'][i]['support'].toFixed(2)])
                }
                setTable2(<HorizontalTable title="Gaussian Process"
                                           description=""
                                           labels={['f1-score', 'precision','recall', 'support']} data={tableData1}></HorizontalTable>);
                setTable3(<HorizontalTable title="LinearSVC"
                                           description=""
                                           labels={['f1-score', 'precision','recall', 'support']} data={tableData2}></HorizontalTable>);
                setTable4(<HorizontalTable title="MLP Neural Network"
                                           description=""
                                           labels={['f1-score', 'precision','recall', 'support']} data={tableData3}></HorizontalTable>);
                setTable5(<HorizontalTable title="SGD"
                                           description=""
                                           labels={['f1-score', 'precision','recall', 'support']} data={tableData4}></HorizontalTable>);
            }
        );
        
    }, []);

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
                
                {/* Classifiers Specified */}
                <div className="grid grid-rows-2 grid-cols-2 gap-4">
                    <div className="max-h-[600px]">
                        <div className="w-full">
                                {tablesLoaded? table2 : <HorizontalTable title="Gaussian Process" description=""
                                                        labels={['f1-score', 'precision','recall', 'support']} data={[]} ></HorizontalTable>}
                        </div>
                    </div>
                    <div className="max-h-[600px]">
                        <div className="w-full">
                                {tablesLoaded? table3 : <HorizontalTable title="LinearSVC" description=""
                                                        labels={['f1-score', 'precision','recall', 'support']} data={[]} ></HorizontalTable>}
                        </div>
                    </div>
                    <div className="max-h-[600px]">
                        <div className="w-full">
                                {tablesLoaded? table4 : <HorizontalTable title="MLP Neural Network" description=""
                                                        labels={['f1-score', 'precision','recall', 'support']} data={[]} ></HorizontalTable>}
                        </div>
                    </div>
                    <div className="max-h-[600px]">
                        <div className="w-full">
                                {tablesLoaded? table5 : <HorizontalTable title="SGD" description=""
                                                        labels={['f1-score', 'precision','recall', 'support']} data={[]} ></HorizontalTable>}
                        </div>
                    </div>
                </div>

                

            </div>
        </div>
    )
}

export default Model;