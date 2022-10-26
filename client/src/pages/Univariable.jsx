import React, { useEffect, useState } from "react"
import generateATable from "../functions/TableCreator";
import Plotly from 'plotly.js-dist';
import HorizontalTable from '../components/HorizontalTable';
import LoadingSpinner from '../components/LoadingSpinner';
import SelectionMenu from '../components/SelectionMenu';
import VariableSelector from "../components/VariableSelector";


const UniVarA = () => {
    const [var1, setVar1] = useState('DefaultVariable');
    const [tablesLoaded, setTablesLoaded] = useState(false);
    const [table1, setTable1] = useState(<HorizontalTable title="Univariable Analysis Table" description="The following table will show basic univariable analysis for the selected variable."
    labels={['Mean','Mode', 'Median', 'SD']} data={[]} ></HorizontalTable>)
    const [table2, setTable2] = useState(<HorizontalTable title="Quantile Table" description="The following table will show several common quantiles for the selected variable."
    labels={['0%','25%','50%', '75%', '100%']} data={[]} ></HorizontalTable>);

    const [table3, setTable3] = useState(<HorizontalTable title="Full Univariable Analysis Table" description="The following table will show full univariable description for the dataset."
    labels={['Label','Mean','Mode', 'Median', 'SD']} data={[]} ></HorizontalTable>)
    const [table4, setTable4] = useState(<HorizontalTable title="Full Quantile Table" description="The following table will show full quantile description for the dataset."
    labels={['0%','25%','50%', '75%', '100%']} data={[]} ></HorizontalTable>);

    function updateTables(){
        setTablesLoaded(false);
        let fd = new FormData()
        let file = new File(    [new Blob([window.data])], 
                                sessionStorage.getItem('raw_file_fileName'));
        
        fd.append('file', file);
        fd.append('var', var1);
        
        // Table for Mean/Mode/Median/SD
        fetch("/univariableAnalysisTABLE",{
            method: 'POST',
            body: fd
        }).then(
            res=>res.json()
        ).then(
            data=> {
                let d = data[var1];
                // MODE/MEAN/MEDIAN/SD TABLE

                let tableData = [   [d.mean.toFixed(2),
                                    d.mode.toFixed(2),
                                    d.Median.toFixed(2),
                                    d.Standard_deviation.toFixed(2)]]
                                    
                
                setTable1(  <HorizontalTable title="Univariable Analysis Table" description="The following table will show basic univariable analysis for the selected variable."
                            labels={['Mean','Mode', 'Median', 'SD']} data={tableData} ></HorizontalTable>);

                
            }
        );
         // Table for Mean/Mode/Median/SD Full description
         fetch("/univariableAnalysisTABLEAll",{
            method: 'POST',
            body: fd
        }).then(
            res=>res.json()
        ).then(
            data=> {
    
                let tableData = []
                for (let i = 0; data.mean[i] !== undefined; i++) {
                    tableData.push([data.labels[i], data.mean[i].toFixed(2), data.mode[i].toFixed(2), data.Median[i].toFixed(2), data.Standard_deviation[i].toFixed(2)])
                }
                console.log(data.mean)            
                
                setTable3(  <HorizontalTable title="Full Univariable Analysis Table" description="The following table will show full univariable description for the dataset."
                            labels={['Label','Mean','Mode', 'Median', 'SD']} data={tableData} ></HorizontalTable>);

                
            }
        );
        
        // Table for QUANTILES
        fetch("/univariableAnalysisTABLEq",{
            method: 'POST',
            body: fd
        }).then(
            res=>res.json()
        ).then(
            data=> {
                
                let d = data[var1];
                // MODE/MEAN/MEDIAN/SD TABLE
                let tableData = [   [data[0].toFixed(2),
                                    data[1].toFixed(2),
                                    data[2].toFixed(2),
                                    data[3].toFixed(2),
                                    data[4].toFixed(2)]]
                                    
                setTable2(  <HorizontalTable title="Quantile Table" description="The following table will show several common quantiles for the selected variable."
                            labels={['0%','25%','50%', '75%', '100%']} data={tableData} ></HorizontalTable>);
                
            }
        );

                // Plotting a graph
        fetch("/univariableAnalysisHistogram",{
            method: 'POST',
            body: fd
        }).then(
            res=>res.json()
        ).then(
            data=> {
                let traces = {
                    x: data.data_in_list,
                    type: 'histogram',
                    marker: {
                        color: "rgba(68,107,166,0.7)",
                        line: {
                            color: "rgba(68,107,166,1)",
                            width:1
                        }
                    },
                    opacity: 0.6
                }
                let layout = {

                    radius: 32,
                    margin: {
                        height: 406,
                        b:32,
                        t:24,
                        r:32,
                        l:24,
                        
                    }
                }
                let d = [traces];
                document.getElementById('graph').innerText = ''
                Plotly.newPlot('graph', d, layout, {responsive: true});
                setTablesLoaded(true);
            }
        );
    }

    useEffect(() => {
        
        updateTables()
        
    }, [var1]);

    return (
        
        <div>
            {/* Main grid */}
            <div className="flex-wrap flex mx-4 my-4 gap-4 grow ">
                {/* Variable Selector */}
                <div className=" max-h-[400px] mb-16">
                    <div className="shadow-lg">
                        <VariableSelector setState={setVar1} label="Select Variable"></VariableSelector>
                    </div>
                    <div className="grid grid-rows-2 gap-2 mt-2 max-w-[455]">
                        <div className="w-full " id="table1">
                            {tablesLoaded? table1 : <HorizontalTable title="Univariable Analysis Table" description="The following table will show basic univariable analysis for the selected variable."
                            labels={['Mean','Mode', 'Median', 'SD']} data={[]} ></HorizontalTable>}
                        </div>
                        <div className="w-full  " id="table2">
                            {tablesLoaded? table2 : <HorizontalTable title="Quantile Table" description="The following table will show several common quantiles for the selected variable."
                            labels={['0%','25%','50%', '75%', '100%']} data={[]} ></HorizontalTable>}
                        </div>
                    </div>
                </div>
                
                {/* Full Description */}
                <div className="max-h-[600px]">

                        <div className="w-full mx-auto" id="table3">
                            {tablesLoaded? table3 : <HorizontalTable title="Full Univariable Analysis Table" description="The following table will show full univariable description for the dataset."
                                                    labels={['Label','Mean','Mode', 'Median', 'SD']} data={[]} ></HorizontalTable>}
                        </div>
                        
                </div>

            </div>
            {/* Graph */}
                <div className="shadow-md h-full border border-gray-400 bg-gray-100 col-span-2 mx-4 mb-4 min-h-[400px]">
                    <div id="graph" className="mx-4 my-4 ">

                    </div>
                </div>
        </div>
    )
}

export default UniVarA;