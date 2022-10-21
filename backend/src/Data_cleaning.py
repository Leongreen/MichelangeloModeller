# -*- coding: utf-8 -*-
# @Time    : 19/10/2022 6:13 pm
# @Author  : William
# @FileName: Data_cleaning.py
# @Software: PyCharm
import pandas as pd
from io import StringIO
from pandas import util
from DataManager import DataManager
from sklearn.impute import SimpleImputer
import numpy as np

class DataCleaning():

    def __init__(self, path):
        """
        This is to read the file
        :param path: This is the file path of the data file.
        """
        self.path = path

    def default_cleaning(self):
        '''
        The default cleaning function does the follwoing:
        1. If a categorical value is null,  we remove the entire row.
        2. Drop columns where all column values are empty.
        4. Replace null by the column mean
        '''
        d = DataManager()
        self.data = d.ReadFile(self.path)

        # 2.drop columns where all column values are null
        a = self.data.dropna(how='all')

        #4. Replace null by the column mean
        numerical_data = a.select_dtypes(include=['float64', 'int64'])
        categorical_data = a.select_dtypes(include='object')
        columnName_list = []
        for name in numerical_data:
            columnName_list.append(name)
        imputer = SimpleImputer(missing_values=np.nan, strategy='mean')
        imputer = imputer.fit(numerical_data)
        X = imputer.transform(numerical_data)
        df_numerical_part = pd.DataFrame(X, columns=columnName_list)
        frames = [df_numerical_part, categorical_data]
        result = pd.concat(frames, axis=1, join='inner')
        #Drops all row that has a null value
        result.dropna(axis=0)
        return result

    def select_columns(self, column_names_list:list):
        """
        1. Construct a new dataframe by specifying the variable names
        2. Seperating the data frame into numerical and categorical
        3. Replace the null by preference, mean, medianm, mode.
        """
        #1. Construct a new dataframe by specifying the variable names
        d = DataManager()
        self.data = d.ReadFile(self.path)
        Selected_columns = self.data[column_names_list]
        return Selected_columns

    def numerical_dataframe(self):
        '''
        Seperating the data frame into numerical dataframe
        '''
        d = DataManager()
        self.data = d.ReadFile(self.path)
        numerics = ['int16', 'int32', 'int64', 'float16', 'float32', 'float64']
        numerical_data = self.data.select_dtypes(exclude = ['object'])
        return numerical_data

    def categorical_dataframe(self):
        '''
        Seperating the data frame into categorical dataframe
        '''
        d = DataManager()
        self.data = d.ReadFile(self.path)
        categorical_dataframe = self.data.select_dtypes(exclude=['float64', 'int64'])
        return categorical_dataframe


    def replace_null_by_mean(self):
        '''
        Replace the null by preference, mean, medianm, mode.
        '''
        d = DataManager()
        self.data = d.ReadFile(self.path)
        numerical_data = self.data.select_dtypes(include=['float64', 'int64'])
        categorical_data = self.data.select_dtypes(include='object')
        columnName_list = []
        for name in numerical_data:
            columnName_list.append(name)
        imputer = SimpleImputer(missing_values=np.nan, strategy='mean')
        imputer = imputer.fit(numerical_data)
        X = imputer.transform(numerical_data)
        df_numerical_part = pd.DataFrame(X, columns=columnName_list)
        frames = [df_numerical_part, categorical_data]
        result = pd.concat(frames, axis=1, join='inner')
        return result

    def replace_null_by_median(self):
        '''
        Replace the null by preference, mean, median.
        '''
        d = DataManager()
        self.data = d.ReadFile(self.path)
        numerical_data = self.data.select_dtypes(include=['float64', 'int64'])
        categorical_data = self.data.select_dtypes(include='object')
        columnName_list = []
        for name in numerical_data:
            columnName_list.append(name)
        imputer = SimpleImputer(missing_values=np.nan, strategy='median')
        imputer = imputer.fit(numerical_data)
        X = imputer.transform(numerical_data)
        df_numerical_part = pd.DataFrame(X, columns=columnName_list)
        frames = [df_numerical_part, categorical_data]
        result = pd.concat(frames, axis=1, join='inner')
        return result

















path = r"C:\Users\Willi\Desktop\aut degree\Second year\R_and_D\Semester 2\Clean_coding\MichelangeloModeller\backend\src\iris.csv"
a = DataCleaning(path)
print(a.replace_null_by_median())










