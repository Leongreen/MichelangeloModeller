from re import M
from flask import Flask
from flask import request
from flask import send_file
from flask import jsonify

from src.Model import Model
from src.Bivariable_analysis import Bivariable_analysis
from src.univariabel_analysis import Univariable
from src.univariabel_histogram import Univariable_histogram
from src.excelgen import excelgen
from src.DataManager import DataManager
from src.DataCleaning import *
from src.Multi_linear_regression import Multi_variable_analysis
from src.Data_cleaning import DataCleaning

from src.timeout import timeout

import json
import pandas as pd
import numpy as np

app = Flask(__name__)
output = excelgen()


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

        return jsonify(a)
    return "A get method was launched"


@app.route("/ObtainColumnNames", methods=['GET', 'POST'])
def ObtainColumnNames():
    if request.method == 'POST':
        raw_file = request.files['file']
        return jsonify(ObtainDataLabels(raw_file))
    return "A get method was launched"

@app.route("/ObtainResponseColumnNames", methods=['GET', 'POST'])
def ObtainResponseColumnNames():
    if request.method == 'POST':
        raw_file = request.files['file']
        d = DataManager()
        d.ReadFile(raw_file)
        return jsonify(cat_labels(d.df))
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


# Obtaining attributes for the uni table
@app.route("/univariableAnalysisTABLEAll", methods=['GET', 'POST'])
def univariableAnalysisTABLEAll():
    if request.method == 'POST':
        # An actual file that can be read with data manager.
        raw_file = request.files['file'] 


        a = Univariable(raw_file)
        a.datainjesting()

        return jsonify(a.full_unvariable_analysis())
    return "A get method was launched"

# Obtaining attributes for the quantile table
@app.route("/univariableAnalysisTABLEqAll", methods=['GET', 'POST'])
def univariableAnalysisTABLEqAll():
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
        model = Model()
        response = request.form['response']
        print(f"Applying model on data: {d.df}, with response:{response}")
        output.add_content(d.df, 'Raw Data')
        output.add_content(model.data_transform(d.df), 'Feature Space')
        output.add_content(d.df.corr(), 'Correlation')

        if response is None:
            # NOTE: unsupervised learning is unimplemented
            model.run_model(d.df)
        else:
            results = model.run_model(d.df, response)

        for x in results['output']:
            output.add_content(pd.DataFrame(x['summary']),x['Classifier'])
        del results['output']

        # return form is a list of following dicts
        # results['summarytable'] : array for table on top left
        # results['classifiers'] : list of classifiers
        # results['graph'] : 2d array for graph
        # result['graphlabel'] : label/color for graph

        # result[classifier_name] : table showing stats about that classifier

        output.generate()
        return jsonify(results)
    return "A get method was launched"

@app.route("/downloadResults", methods=['GET', 'POST'])
def downloadResults():
    if request.method == 'POST':
        raw_file = request.files['file']
        d = DataManager()
        d.ReadFile(raw_file)
        model = Model()
        response = request.form['response']
        output.add_content(d.df, 'Raw Data')
        output.add_content(model.data_transform(d.df), 'Feature Space')
        output.add_content(d.df.corr(), 'Correlation')

        if response is None:
            # NOTE: unsupervised learning is unimplemented
            model.run_model(d.df)
        else:
            results = model.run_model(d.df, response)

        for x in results['output']:
            output.add_content(pd.DataFrame(x['summary']),x['Classifier'])
        del results['output']

        # return form is a list of following dicts
        # results['summarytable'] : array for table on top left
        # results['classifiers'] : list of classifiers
        # results['graph'] : 2d array for graph
        # result['graphlabel'] : label/color for graph
        # result[classifier_name] : table showing stats about that classifier

        output.generate()
        return send_file('temp_results.xlsx')
    return "A get method was launched"

@app.route("/ObtainPredictions", methods=['GET', 'POST'])
def ObtainPredictions():
    if request.method == 'POST':
        raw_file = request.files['file']
        d = DataManager()
        d.ReadFile(raw_file)
        var = request.form['var']
        return jsonify(list(score_features(d.df, var)))
    return "A get method was launched"

@app.route("/MultilinearRegression", methods=['GET', 'POST'])
def MultilinearRegression():
    if request.method == 'POST':
        raw_file = request.files['file']
        a = Multi_variable_analysis(raw_file)

        return jsonify(str(a.main()))
    return "A get method was launched"

@app.route("/CorrelationMatrix", methods=['GET', 'POST'])
def CorrelationMatrix():
    if request.method == 'POST':
        # An actual file that can be read with data manager.
        raw_file = request.files['file']


        a = Bivariable_analysis(raw_file)
        a.datainjesting()
        
        return jsonify(a.convert_format())
    return "A get method was launched"

@app.route("/DropColumns", methods=['GET', 'POST'])
def DropColumns():
    if request.method == 'POST':
        # An actual file that can be read with data manager.
        raw_file = request.files['file']

        columnList = request.form['columnList']

        a = DataCleaning(raw_file)
        # print(json.loads(columnList))
        # return ''
        df = a.select_columns(json.loads(columnList))
        print(df)
        return df.to_json()
    return "A get method was launched"

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')
