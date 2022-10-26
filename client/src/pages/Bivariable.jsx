import React, {useState, useEffect } from "react"
import generateATable from "../functions/TableCreator.js";
import VariableSelector from "../components/VariableSelector";
import Plotly from 'plotly.js-dist';
import HorizontalTable from "../components/HorizontalTable.jsx";

const BivA = () => {
    const [tablesLoaded, setTablesLoaded] = useState(false);

    const [var1, setVar1] = useState('DefaultVariable');
    const [var2, setVar2] = useState('DefaultVariable');
    const [table1, setTable1] = useState(<HorizontalTable title="Univariable Analysis Table" description="The following table will show basic univariable analysis for the selected variable."
    labels={['Slope','Intercept', 'R_sqr', 'P_value']} data={[]} ></HorizontalTable>)

    let fd = new FormData()
    let file = new File(    [new Blob([window.data])], 
                            sessionStorage.getItem('raw_file_fileName'));
    
    fd.append('file', file);

    useEffect(() => {
        fetch("/CorrelationMatrix",{
            method: 'POST',
            body: fd
        }).then(
            res=>res.json()
        ).then(
            data=> {
                console.log(data)

            })
    });



    return (
        <div className="mb-4">
            {/* Title */}
            <h1 className='flex items-center justify-center
            mt-4 text-3xl text-gray-700 font-semibold'>Bivariate Analysis</h1>

            {/* Grid */}
            <div className="grid md:grid-cols-2 grid-cols-1 gap-4 md:mr-0 mr-4">
                {/* Selection tab and  a table*/}
                <div className=" bg-gray-200 ml-5 mt-4 grow">
                    {/* Selection tab */}
                    <div className="grid grid-rows-2 gap-4">
                        <div className="shadow-lg">
                            <VariableSelector setState={setVar1} label="Select Variable"></VariableSelector>
                        </div>
                        <div className="shadow-lg">
                            <VariableSelector setState={setVar2} label="Select Variable"></VariableSelector>
                        </div>
                    </div>
                    
                    {/* Table */}

                    <div className="mx-auto text-gray-700 text-center mt-4">
                    {tablesLoaded? table1 : <HorizontalTable title="Quantile Table" description="The following table will show several common quantiles for the selected variable."
                            labels={['Slope','Intercept', 'R_sqr', 'P_value']} data={[]} ></HorizontalTable>}
                    </div>



                </div>
                <div className="mr-4 mt-4 grow w-256">
                    
                    <div id="graph" className="ml-8 mb-4 pr-32">

                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default BivA;