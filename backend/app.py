from re import M
from flask import Flask
from flask import request
from flask import jsonify

from src.Model import Model
from src.Bivariable_analysis import Bivariable_analysis
from src.univariabel_analysis import Univariable
from src.univariabel_histogram import Univariable_histogram
from src.excelgen import excelgen
from src.DataManager import DataManager
from src.DataCleaning import *

from src.timeout import timeout

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
        model = Model()
        response = request.form['response']

        if response is None:
            # NOTE: unsupervised learning is unimplemented
            model.run_model(d.df)
        else:
            results = model.run_model(d.df, response)
        # return form is a list of following dicts for each algorithm:

        # dict['Classifier'] : name of classifier. The user should see this
        # dict['ConfusionMatrix'] : ndarray showing TP, TN, FN, FP. Useful for user but not necessary
        # dict['summary'] : dict containing acc, pre, recall, f1 ect. The user should see this

        # NOTE it might be easier to convert dict['summary'] to a dataframe then to json
        # results[x]['summary'] = pd.Dataframe(results[x]['summary'])

        # Classifiers should be ranked by dict['summary']['accuracy']

        # add excel output sheets
        output.add_content(d.df, 'Raw Data')
        output.add_content(model.data_transform(d.df), 'Feature Space')
        output.add_content(d.df.corr(), 'Correlation')

        # loops over dicts and add them to the output
        r_dict = {}
        for x in results:
            if x['summary'] is not None:
                r_dict[x['Classifier']] = x['summary']
                output.add_content(pd.DataFrame(x['summary']), x['Classifier'])

        for x in r_dict.keys():
            r_dict[x] = pd.DataFrame(r_dict[x]).to_json()

        # any data passed to 'generateXY()' will be transformed from N x N to 2 X N.
        # used for visualising data
        pca = model.generateXY(d.df)

        output.generate()

        return jsonify(r_dict)
    return "A get method was launched"


if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')
