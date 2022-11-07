import React from 'react';
import { Menu, Transition } from '@headlessui/react'
import { Fragment, useEffect, useRef, useState } from 'react'

export default class SelectionMenu extends React.Component {
    constructor(props){
        super(props);
        this.elements = props.elements;
        this.setState = props.setState;
        this.label = props.label;
        this.rows = [];
        for (let i = 0; i < this.elements.length; i++) {
            this.rows.push(     <Menu.Item>
                                    <button key={this.elements[i]} value={this.elements[i]} onClick={() => this.ChangeState(this.elements[i])} className='rounded-md transition w-full text-left text-base font-medium text-slate-600 py-2 px-4 hover:bg-slate-300 hover:text-slate-900 z-50'>{this.elements[i]}</button>
                                </Menu.Item>)
        }
    }

    ChangeState = (v) => {
        console.log(this.label)
        document.getElementById(this.label).innerHTML = v;
        this.setState(v);
    }

    render(){
        return (
            <div className="w-full text-left border border-gray-400 rounded-md bg-white z-50">
                <Menu as="div" className="relative">
                    <div>
                        <Menu.Button className="transition rounded-md rounded-mdtransition w-full text-left text-base font-medium text-slate-600 py-4 px-4 hover:bg-slate-200 hover:text-slate-900">
                            <label id={this.label}>
                                {this.label}
                            </label>
                        </Menu.Button>
                    </div>
                    <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="z-50 absolute right-0 w-full origin-top-right divide-y divide-gray-100 rounded-b-md bg-gray-100 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none max-h-[800px] overflow-y-auto">
                            {this.rows}
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
        )
    }
}
