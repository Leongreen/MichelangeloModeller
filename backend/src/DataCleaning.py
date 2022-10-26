from threading import local
from .DataManager import DataManager 
import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression


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
    return list(data.columns)

def cat_labels(data):
    strs = data.select_dtypes(exclude=['float64', 'int64'])

    # determine which columns are categorical and which are discrete
    likely_cat = {}
    for var in strs.columns:
        # test number of unique values in column
        likely_cat[var] = 1. * strs[var].nunique() / strs[var].count() < 0.10
    output = []
    for x in strs.columns:
        if likely_cat[x]:
            output.append(x)
    return output

def NormalizeData(data):
    return (data - np.min(data)) / (np.max(data) - np.min(data))

def score_features(data, label):
    labels = data[label].to_numpy()
    predictors = data.drop([label],axis=1)
    nums = data.select_dtypes(include=['float64', 'int64'])

    for x in nums:
        nums[x] = (nums[x]-nums[x].mean())/nums[x].std()

    model = LogisticRegression()
    model.fit(nums,labels)
    output = []
    pd_count = 0
    for i in data.columns:
        if i in predictors.columns:
            output.append(abs(model.coef_[0][pd_count]))
            pd_count += 1
        else:
            output.append(0)
    output = NormalizeData(output)
    for x in range(len(output)):
        output[x] *= 100
    return list(output)