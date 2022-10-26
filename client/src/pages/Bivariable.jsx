import React, {useState, useEffect } from "react"
import generateATable from "../functions/TableCreator.js";
import VariableSelector from "../components/VariableSelector";
import Plotly from 'plotly.js-dist';
import HorizontalTable from "../components/HorizontalTable.jsx";

const BivA = () => {
    const [tablesLoaded, setTablesLoaded] = useState(false);

    const [var1, setVar1] = useState('DefaultVariable');
    const [var2, setVar2] = useState('DefaultVariable');
    const [table1, setTable1] = useState(<HorizontalTable title="Bivariable Table" description="This table contains basic bivariable information"
    labels={['Slope','Intercept', 'R_sqr', 'P_value']} data={[]} ></HorizontalTable>)
    const [table2, setTable2] = useState(<HorizontalTable title="Correlation Matrix" description="This table reveals a correlation matrix for the entire provided data set"
    labels={[]} data={[]} ></HorizontalTable>)

    
    useEffect(() => {
        setTablesLoaded(false);

        let fd = new FormData()
        let file = new File(    [new Blob([window.data])], 
                                sessionStorage.getItem('raw_file_fileName'));
        
        fd.append('file', file);
        fd.append('var1', var1);
        fd.append('var2', var2);

        fetch("/bivariableAnlysisTable",{
            method: 'POST',
            body: fd
        }).then(
            res=>res.json()
        ).then(
            data=> {
                let tableData = [   data.slope.toFixed(2),
                                    data.intercept.toFixed(2),
                                    data.r_value.toFixed(2),
                                    data.p_value.toFixed(2)]

                setTable1(  <HorizontalTable title="Bivariable Table" description="This table contains basic bivariable information"
                            labels={['Slope','Intercept', 'R_sqr', 'P_value']} data={[tableData]} ></HorizontalTable>);

                setTablesLoaded(true);
            })
        fetch("/CorrelationMatrix",{
            method: 'POST',
            body: fd
        }).then(
            res=>res.json()
        ).then(
            data=> {
                console.log(data)
                
                let tableData = [];
                let temp = 0;
                for (let i = 0; data[i] !== undefined; i++){
                    tableData.push([])
                    for (let k = 0; data[i][k] !== undefined; k++){
                        if (!isNaN(data[i][k])){
                            temp = data[i][k];
                            temp = Math.round(temp*100)/100
                            tableData[i].push(temp)
                        } else {
                            tableData[i].push(data[i][k])
                        }
                    }
                }    

                setTable2(  <HorizontalTable title="Correlation Matrix" description="This table reveals a correlation matrix for the entire provided data set"
                            labels={[]} data={tableData} ></HorizontalTable>);

                setTablesLoaded(true);
                console.log(var1 + " " + var2)
            })
                //        Plotting a graph
            fetch("/bivariableAnlysisGraph",{
                method: 'POST',
                body: fd
            }).then(
                res=>res.json()
            ).then(
                data=> {
                    let traces = {
                        name: "Var",
                        x: data.x,
                        y: data.y,
                        mode: 'markers',
                        type: 'scatter',
                        trendline: 'ols',
                        marker: {
                            color: "rgba(68,107,166,0.7)",
                            line: {
                                color: "rgba(68,107,166,1)",
                                width:1
                            }
                        },
                        opacity: 0.6
                    }
                    let traces2 = {
                        name: "LR",
                        x: data.xl,
                        y: data.yl,
                        type: 'line',
                        line: {
                            color: "rgba(68,155,166,0.7)",
                        },
                    }
                    let layout = {
                        margin: {
                            b:24,
                            t:24,
                            r:24,
                            l:24
                        },
                        showlegend:false
                    }
                    let d = [traces, traces2];
                    Plotly.newPlot('graph', d, layout, {responsive: true});
                }
            );
    }, [var1, var2]);



    return (
        <div className="mb-4">

            {/* Grid */}
            <div className="grid grid-cols-2 gap-4 mr-4">
                {/* Selection tab and  a table*/}
                <div className=" bg-gray-200 ml-5 mt-4 grow">
                    {/* Selection tab */}
                    <div className="grid grid-rows-2 gap-4">
                        <div className="shadow-lg">
                            <VariableSelector setState={setVar1} label="Select Variable 1"></VariableSelector>
                        </div>
                        <div className="shadow-lg">
                            <VariableSelector setState={setVar2} label="Select Variable 2"></VariableSelector>
                        </div>
                    </div>
                    
                    {/* Table */}
                    <div className="mx-auto text-gray-700 text-center mt-4">
                            {tablesLoaded? table1 : <HorizontalTable title="Bivariable Table" description="This table contains basic bivariable information"
                            labels={['Slope','Intercept', 'R_sqr', 'P_value']} data={[]} ></HorizontalTable>}
                    </div>
                </div>
                <div className="mx-auto text-gray-700 text-center mt-4 w-full">
                            {tablesLoaded? table2 : <HorizontalTable title="Correlation Matrix" description="This table reveals a correlation matrix for the entire provided data set"
                            labels={[]} data={[]} ></HorizontalTable>}
                </div>
                
                <div className="mr-4 mt-4 grow w-full col-span-2">
                    
                    <div id="graph" className="w-full ml-2 mb-4 ">

                    </div>
                </div>
            </div>
        </div>
    )
}

export default BivA;