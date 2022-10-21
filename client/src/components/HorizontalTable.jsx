import React from 'react';


export default class HorizontalTable extends React.Component {
    constructor(props) {
        super(props);
        this.title = props.title;
        this.description = props.description;
        this.labels = props.labels;
        this.data = props.data;
    }
    generateTH() {
        let TR = [];
        for (let i = 0; i < this.labels.length; i++) {
            TR.push(<th scope="col" className="border py-3 px-8">{this.labels[i]}</th>);
        }
        return TR;
    }
    generateTR(d){
        let TD = [];
        for (let k = 0; k < d.length; k++){
            TD.push(<td scope="col" className="border py-2 px-8 transition hover:bg-gray-200">{d[k]}</td>);
        }
        return TD;
    }
    generateTD() {
        let TR = [];
        for (let i = 0; i < this.data.length; i++) {
            TR.push(<tr>
                {this.generateTR(this.data[i])}
            </tr>)
            

        }
        return TR;
    }

    render() {

        return (
            <div className="overflow-hidden hover:overflow-y-scroll shadow-md sm:rounded-lg border border-gray-400">
                <table className="w-full text-sm text-left text-gray-700">
                    <caption className="p-5 text-lg font-semibold text-left text-gray-700 bg-white ">{this.title}
                        <p className="mt-1 text-sm font-normal text-gray-500 ">{this.description}</p>
                    </caption>
                
                <thead className="text-xs text-gray-700 bg-gray-100">
                    <tr >
                        {this.generateTH()}
                    </tr>
                </thead>
                <tbody className='bg-white min-w-full'>
                    {this.generateTD()}
                    
                </tbody>
                </table>
            </div>
        )
    }
}