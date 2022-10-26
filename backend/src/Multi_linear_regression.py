# -*- coding: utf-8 -*-
# @Time    : 11/10/2022 7:56 pm
# @Author  : William
# @FileName: Multi_linear_regression.py
# @Software: PyCharm
# -*- coding: utf-8 -*-


import pandas as pd
import numpy as np
import statsmodels.api as sm
from .DataManager import DataManager
# from spicy import stats
import scipy.stats
from statsmodels.formula.api import ols


class Multi_variable_analysis():

    def __init__(self, path):
        """
        This is to read the file
        :param path: This is the file path of the data file.
        """
        self.path = path


    def numeric_multi_linear_regression(self, response_variable,predictor_variable_list:list):
        '''
        This part it to run the multi-linear regression model with only the numerical data.
        :param response_variable:
        :param predictor_variable_list: A list of prediction variables for the multi-linear regression model
        :return:
        '''
        d = DataManager()
        self.data = d.ReadFile(self.path)
        # define response variable
        y = self.data[response_variable]
        # define predictor variables
        x = self.data[predictor_variable_list]
        # fit linear regression model
        model = sm.OLS(y, x).fit()
        # view model summary

        print(model.summary().as_html())
        return model.summary().as_html()

    def dummy_multi_linear_regression(self,categorical_variable,response_variable,prediction_variable:list):
        '''
        This part contains two part,  one is to turn categorical variable into encoded variables and the
        other is to run the regression model with a selected list of prediction variables (i.e. can be dummy
        variables included.)
        :param categorical_variable: The categorical variable in the dataframe that will be encoded
        :param response_variable: The variable that takes the effect of the prediction variables
        :param prediction_variable: The independent variable list to predict the response variable.
        :return:
        '''
        d = DataManager()
        self.data = d.ReadFile(self.path)
        #Encoding the categorical variable
        df_dummy = pd.get_dummies(self.data[categorical_variable])
        #concate the dummy variable with the original data
        df_dummy = pd.concat([self.data, df_dummy],axis=1)
        #finalising the data frame
        df_dummy.drop([categorical_variable], inplace = True, axis=1)
        # print(list(df_dummy))
        reg = sm.OLS(df_dummy[response_variable], sm.add_constant(df_dummy[prediction_variable])).fit()
        # print(reg.summary())
        confidence_interval = reg.conf_int()
        R_adjt = reg.rsquared_adj
        return round(R_adjt,3)







    def main(self):
        return self.numeric_multi_linear_regression('sepal.length', ['sepal.width','petal.length'])
        # self.dummy_multi_linear_regression('variety', 'sepal.length',['petal.length','Setosa'])



# path = r"C:\Users\MarkO\Desktop\MichelangeloModeller\MichelangeloModeller\backend\src\iris.csv"

# a = Multi_variable_analysis(path)
# print(a.main())