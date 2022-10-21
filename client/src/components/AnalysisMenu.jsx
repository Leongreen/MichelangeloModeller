import { Menu, Transition } from '@headlessui/react'
import { Fragment, useEffect, useRef, useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

export default function Example() {
  return (
    <div className="w-full text-left">
      <Menu as="div" className="relative">
        <div>
          <Menu.Button className="transition w-full text-left text-base font-medium text-slate-600 py-4 px-4 hover:bg-slate-200 hover:text-slate-900">
            Add Analysis
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
          <Menu.Items className="absolute right-0 w-full origin-top-right divide-y divide-gray-100 rounded-b-md bg-gray-100 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {/* Analysis choice */}
            <div className="px-1 py-1 ">
                <Menu.Item>
                    <button className='rounded-md transition w-full text-left text-base font-medium text-slate-600 py-2 px-4 hover:bg-slate-300 hover:text-slate-900'>Univariable Analysis</button>
                </Menu.Item>
                <Menu.Item>
                    <button className='rounded-md transition w-full text-left text-base font-medium text-slate-600 py-2 px-4 hover:bg-slate-300 hover:text-slate-900'>Bivariable Analysis</button>
                </Menu.Item>
                <Menu.Item>
                    <button className='rounded-md transition w-full text-left text-base font-medium text-slate-600 py-2 px-4 hover:bg-slate-300 hover:text-slate-900'>Multivariable Analysis</button>
                </Menu.Item>
                <Menu.Item>
                    <button className='rounded-md transition w-full text-left text-base font-medium text-slate-600 py-2 px-4 hover:bg-slate-300 hover:text-slate-900'>Multilinear Regression</button>
                </Menu.Item>
                <Menu.Item>
                    <button className='rounded-md transition w-full text-left text-base font-medium text-slate-600 py-2 px-4 hover:bg-slate-300 hover:text-slate-900'>Randomization Test</button>
                </Menu.Item>
                <Menu.Item>
                    <button className='rounded-md transition w-full text-left text-base font-medium text-slate-600 py-2 px-4 hover:bg-slate-300 hover:text-slate-900'>Modelling</button>
                </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}