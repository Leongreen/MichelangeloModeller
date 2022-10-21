import React, { useEffect, useState } from "react"
import generateATable from "../functions/TableCreator";
import Plotly from 'plotly.js-dist';
import HorizontalTable from '../components/HorizontalTable';
import SelectionMenu from '../components/SelectionMenu';
import VariableSelector from "../components/VariableSelector";


const UniVarA = () => {    
    const [var1, setVar1] = useState('defaultVariable');
    const [table1, setTable1] = useState(<HorizontalTable title="Univariable Analysis Table" description="The following table will show basic univariable analysis for the selected variable."
    labels={['Mean','Mode', 'Median', 'SD']} data={[]} ></HorizontalTable>);
    const [table2, setTable2] = useState(<HorizontalTable title="Quantile Table" description="The following table will show several common quantiles for the selected variable."
    labels={['25%','50%', '75%', '100%']} data={[]} ></HorizontalTable>);
    useEffect(() => {
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
                console.log(var1)
                setTable1(<HorizontalTable title="Univariable Analysis Table" description="The following table will show basic univariable analysis for the selected variable."
                labels={['Mean','Mode', 'Median', 'SD']} data={tableData} ></HorizontalTable>);

            }
        );
        
    }, [var1]);


    // Updating the tables and graphs on the page
    const updateVisualization = (e) => {

        
        


        // // Table for Quantiles
        // fetch("/univariableAnalysisTABLEq",{
        //     method: 'POST',
        //     body: fd
        // }).then(
        //     res=>res.json()
        // ).then(
        //     data=> {

        //         // MODE/MEAN/MEDIAN/SD TABLE
        //         let lab = ['25%','50%', '75%', '100%']
        //         let tableData = [   [data[1].toFixed(2)],
        //                             [data[2].toFixed(2)],
        //                             [data[3].toFixed(2)],
        //                             [data[4].toFixed(2)]]

        //         //document.getElementById('table2').innerHTML = generateATable(lab, tableData);


        //     }
        // );


        // // ALL DESCRIPTORS
        // // Table for Mean/Mode/Median/SD
        // fetch("/univariableAnalysisTABLEAll",{
        //     method: 'POST',
        //     body: fd
        // }).then(
        //     res=>res.json()
        // ).then(
        //     data=> {
        //         console.log(data)

        //         // MODE/MEAN/MEDIAN/SD TABLE
        //         let lab = ['Mean','Mode', 'Median', 'SD']
        //         let tableData = [   [data.mean.toFixed(2)],
        //                             [data.mode.toFixed(2)],
        //                             [data.Median.toFixed(2)],
        //                             [data.Standard_deviation.toFixed(2)]]

        //         document.getElementById('table3').innerHTML = generateATable(lab, tableData);


        //     }
        // );

        // // Table for Quantiles
        // fetch("/univariableAnalysisTABLEqAll",{
        //     method: 'POST',
        //     body: fd
        // }).then(
        //     res=>res.json()
        // ).then(
        //     data=> {

        //         // MODE/MEAN/MEDIAN/SD TABLE
        //         let lab = ['25%','50%', '75%', '100%']
        //         let tableData = [   [data[1].toFixed(2)],
        //                             [data[2].toFixed(2)],
        //                             [data[3].toFixed(2)],
        //                             [data[4].toFixed(2)]]

        //         document.getElementById('table4').innerHTML = generateATable(lab, tableData);


        //     }
        // );

        // // Plotting a graph
        // fetch("/univariableAnalysisHistogram",{
        //     method: 'POST',
        //     body: fd
        // }).then(
        //     res=>res.json()
        // ).then(
        //     data=> {
        //         let traces = {
        //             x: data.data_in_list,
        //             type: 'histogram',
        //             marker: {
        //                 color: "rgba(68,107,166,0.7)",
        //                 line: {
        //                     color: "rgba(68,107,166,1)",
        //                     width:1
        //                 }
        //             },
        //             opacity: 0.6
        //         }
        //         let layout = {
        //             height: 352,
        //             radius: 32,
        //             margin: {
        //                 b:32,
        //                 t:24,
        //                 r:32,
        //                 l:24,
                        
        //             }
        //         }
        //         let d = [traces];
        //         document.getElementById('graph').innerText = ''
        //         Plotly.newPlot('graph', d, layout, {responsive: true});
                
        //     }
        // );
    }

    return (
        
        <div>{console.log("Rendered")}
            {/* Main grid */}
            <div className="grid-flow-row-dense grid grid-rows-2 grid-cols-2 mx-4 my-4 gap-4 ">
                {/* Variable Selector */}
                <div className=" max-h-[400px]">
                    <div className="shadow-lg">
                        <VariableSelector setState={setVar1} label="Select Variable"></VariableSelector>
                    </div>
                    <div className="grid grid-rows-2 gap-2 mt-2">
                        <div className="w-full text-left text-gray-700 max-h-[200px]" id="table1">{table1}</div>
                        <div className="w-full mx-auto max-h-[200px]" id="table2">{table2}</div>
                    </div>
                </div>
                
                {/* Full Description */}
                <div className="shadow-md bg-gray-100 rounded-lg border border-gray-400 px-4 py-4 max-h-[400px]">
                    <div className="grid grid-rows-2">
                        <div className="w-full mx-auto text-gray-700 text-left pt-2" id="table3">
                        </div>
                        <div className="w-full mx-auto " id="table4"></div>
                    </div>
                </div>
                


                {/* Graph */}
                <div className="shadow-md max-h-[400px] border border-gray-400 bg-gray-100 col-span-2">
                    <div id="graph" className="mx-4 my-4">

                    </div>
                </div>

            </div>



        </div>
    )
}

export default UniVarA;