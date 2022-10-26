import React from 'react';
import { useState } from 'react'
import { Switch } from '@headlessui/react'

export default class Toggle extends React.Component {
    constructor(props) {
        super(props);
        this.setS = this.props.setState;
        this.state = {enabled: props.default}
        this.onSwitch = this.props.onSwitch;
    }
    
    switchEnabled(){
        if (this.state.enabled){
            this.setState({enabled: false});

        } else{
            this.setState({enabled: true});

        }
        this.onSwitch()
    }
    render (){
        return (
            <Switch
            checked={this.state.enabled}
            onClick={() => {this.switchEnabled()}}
            className={`${
            this.state.enabled ? 'transition bg-blue-500 border-blue-600' : 'transition bg-gray-300'
            } relative inline-flex h-6 w-11 items-center rounded-full border border-gray-400`}
            >
                <span className="sr-only">Enable notifications</span>
                <span
                className={`${
                this.state.enabled ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
            </Switch>
        )
    }
}