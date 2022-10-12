from re import M
from flask import Flask
from flask import request
from flask import jsonify

from src.Model import *
from src.ModelControl import *
from src.Bivariable_analysis import Bivariable_analysis
from src.univariabel_analysis import Univariable
from src.univariabel_histogram import Univariable_histogram
from src.DataManager import DataManager
from src.DataCleaning import *

import pandas as pd
import numpy as np

app = Flask(__name__)

def index():
    return ("Hello")

# This function sends back whatever file was passed into json format
# So it can be stored for future use on the front end
@app.route("/SendJSONFile", methods=['GET', 'POST'])
def SendJSONFile():
    if request.method == 'POST':
        raw_file = request.files['file'] 
        d = DataManager()
        d.ReadFile(raw_file)
        # print("Sending Dataframe: " + str(d.df))
        return d.df.to_json()
    return "A get method was launched"

@app.route("/FirstEntriesToFE", methods=['GET', 'POST'])
def FirstEntriesToFE():
    if request.method == 'POST':
        raw_file = request.files['file']
        a = FirstEntries(raw_file)
        print(a)
        return jsonify(a)
    return "A get method was launched"


@app.route("/ObtainColumnNames", methods=['GET', 'POST'])
def ObtainColumnNames():
    if request.method == 'POST':
        raw_file = request.files['file']
        return jsonify(ObtainDataLabels(raw_file))
    return "A get method was launched"


# Obtaining attributes for the uni table
@app.route("/univariableAnalysisTABLE", methods=['GET', 'POST'])
def univariableAnalysisTABLE():
    if request.method == 'POST':
        # An actual file that can be read with data manager.
        raw_file = request.files['file'] 
        var = request.form['var'] 

        a = Univariable(raw_file)
        a.datainjesting()

        return jsonify(a.Full_discribtion(var))
    return "A get method was launched"

# Obtaining attributes for the quantile table
@app.route("/univariableAnalysisTABLEq", methods=['GET', 'POST'])
def univariableAnalysisTABLEq():
    if request.method == 'POST':
        # An actual file that can be read with data manager.
        raw_file = request.files['file'] 
        var = request.form['var'] 

        a = Univariable(raw_file)
        a.datainjesting()

        return jsonify(a.singular_quantile(var))
    return "A get method was launched"

# Obtaining a dict with histogram data
@app.route("/univariableAnalysisHistogram", methods=['GET', 'POST'])
def univariableAnalysisHistogram():
    if request.method == 'POST':
        # An actual file that can be read with data manager.
        raw_file = request.files['file'] 
        var = request.form['var'] 

        a = Univariable_histogram(raw_file, var)

        return a.main()
    return "A get method was launched"


@app.route("/bivariableAnlysisTable", methods=['GET', 'POST'])
def bivariableAnlysisTable():
    if request.method == 'POST':
        # An actual file that can be read with data manager.
        raw_file = request.files['file'] 
        var1 = request.form['var1'] 
        var2 = request.form['var2'] 

        a = Bivariable_analysis(raw_file)
        a.datainjesting()
        return jsonify(a.singular_linear_regression(var1, var2))
    return "A get method was launched"

@app.route("/bivariableAnlysisGraph", methods=['GET', 'POST'])
def bivariableAnlysisGraph():
    if request.method == 'POST':
        # An actual file that can be read with data manager.
        raw_file = request.files['file'] 
        var1 = request.form['var1'] 
        var2 = request.form['var2'] 

        a = Bivariable_analysis(raw_file)
        a.datainjesting()

        return jsonify(a.ploting(var1, var2))
    return "A get method was launched"

@app.route("/bivariableAnlysisForecast", methods=['GET', 'POST'])
def bivariableAnlysisForecast():
    if request.method == 'POST':
        # An actual file that can be read with data manager.
        raw_file = request.files['file'] 
        var1 = request.form['var1'] 
        var2 = request.form['var2'] 
        forecast = request.form['forecast']

        a = Bivariable_analysis(raw_file)
        a.datainjesting()
        a.coordinate_return(var1, var2)
        try:
            return jsonify(a.forecast(float(forecast)))
        except:
            return 'undefined'
    return "A get method was launched"

@app.route("/applyModel", methods=['GET', 'POST'])
def applyModel():
    if request.method == 'POST':
        raw_file = request.files['file'] 
        d = DataManager()
        d.ReadFile(raw_file)
        
        p = {}
        p['data'] = d.df
        p['response'] = request.form['response']
        p['missing_values'] = request.form['missing_values']
        p['scalar'] = request.form['scalar']
        p['encoder'] = request.form['encoder']
        p['gridsearch'] = True
        p['classifier'] = 'auto'
        p['clusters'] = request.form['NClusters']
        p['testsplit'] = 0.5
        
        m = ModelControl()
        m.setParemters(p)

        r_dict = m.run()[0]
        

        r_dict['graphinfo']['x'] = r_dict['graphinfo']['x'].tolist()
        r_dict['graphinfo']['y'] = r_dict['graphinfo']['y'].tolist()
        #r_dict['graphinfo']['z'] = r_dict['graphinfo']['z'].tolist() already a list?
        r_dict['confusion'] = r_dict['confusion'].tolist()
        r_dict['model'] = ''
        
        print(r_dict)
        return jsonify(r_dict)
    return "A get method was launched"


if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')