import React, {useState} from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import './index.css';
import DefaultPage from './components/DefaultPage';
import WelcomePage from './components/WelcomePage';
import UniVarA from "./components/UnivariateAnalysis"
import DataReveal from './components/DataReveal';
import BivA from './components/Bivariable';
import ModelCreation from './components/ModelCreating';

const App = () => {
  const [raw_data, setRaw_data] = useState();
  return (
    
    <div className="min-h-screen bg-gradient-to-br from-cyan-900 to-[rgb(18,26,56)] bg-cover">
        <Router>
        <Switch>
          {/* File Upload page */}
          <Route exact path="/">
            <WelcomePage></WelcomePage>
          </Route>
          <Route exact path="/DataReveal">
            <DefaultPage>
              <DataReveal></DataReveal>
            </DefaultPage>
          </Route>
          {/* Univariable Analysis */}
          <Route exact path="/UA">
            <DefaultPage>
                <UniVarA />
            </DefaultPage>
          </Route>
          {/* Bivariable Analysis */}
          <Route exact path="/BivA">
            <DefaultPage>
                <BivA />
            </DefaultPage>
          </Route>
          {/* Model Creation */}
          <Route exact path="/ModC">
            <DefaultPage>
                <ModelCreation />
            </DefaultPage>
          </Route>
        </Switch>
      </Router>  
    </div>
  );
}

export default App;
