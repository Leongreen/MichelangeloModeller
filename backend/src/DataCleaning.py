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
    # print(type(data))
    # print(data)
    # # fC = list(data.columns.values)
    # # print(fC)

    # data = data.iloc[2: , :]
    # for columns in data:
    #     print(columns)
    # container = data.iloc[:,1:4]
    # for columns in container:
    #     print(columns)
    # print(data.iloc[1:4,1:2])
    returnEntries = {}

    # print(data.iloc[1:4,1:2].values.tolist())

    for i in range(len(data.columns)):
        returnEntries[i] = {
            'label': data.columns[i],
            'data': data.iloc[0:len(data.columns),i:i+1].values.tolist()
        }
        # localList = data.iloc[1:4,i:i+1].values
        # returnEntries[i] = localList

    # print(returnEntries)


    return returnEntries


def ObtainDataLabels(file):
    d = DataManager()
    data = d.ReadFile(file)
    return data.columns

