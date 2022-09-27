from threading import local
from .DataManager import DataManager 
import pandas as pd


def isDataValid(file):
    d = DataManager()
    data = d.ReadFile(file)
    return True

def CleanData(df):
    return df

def FirstEntries(file):
    d = DataManager()
    data = d.ReadFile(file)

    data = CleanData(data)

    xlim = 6
    ylim = 15

    if len(data.columns) > xlim:
        x_range = xlim
    else:
        x_range = len(data.columns)

    if len(data.index) > ylim:
        y_range = ylim
    else:
        y_range = len(data.index)


    returnEntries = {}


    returnEntries['labels'] = data.columns[0:x_range]
    for x in data.columns[0:x_range]:
        returnEntries['data'] = returnEntries['data'] + data.iloc[x].values.toList()



    print("=========================")
    print(returnEntries)
    print("=========================")

    return returnEntries


def ObtainDataLabels(file):
    d = DataManager()
    data = d.ReadFile(file)
    returnEntries = []
    data = data.iloc[2: , :]
    for columns in data:
        returnEntries.append(columns)
    
    return returnEntries

