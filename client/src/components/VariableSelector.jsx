import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import SelectionMenu from './SelectionMenu';


export default class VariableSelector extends React.Component {
    constructor(props){
        super(props);
        this.setS = props.setState;
        this.label = props.label;
        this.state = {isLoading: true, elements: undefined};
        
    }

    componentDidMount(){

        let fd = new FormData()
        let file = new File(    [new Blob([window.data])], 
                                            sessionStorage.getItem('raw_file_fileName'))
        
        fd.append('file', file)
        
        fetch("/ObtainColumnNames",{
            method: 'POST',
            body: fd
        }).then(
            res=>res.json()
        ).then(
            data=> {
                this.setState({elements: data});
                this.setState({isLoading: false});  

            })
    }


    render(){
        const {isLoading, elements} = this.state;

        if (isLoading){
            return <LoadingSpinner />
        }
        return (
            <SelectionMenu elements={this.state.elements} label={this.label} setState={this.setS}></SelectionMenu>
        )
    }
}