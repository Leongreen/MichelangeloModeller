# -*- coding: utf-8 -*-
# @Time    : 21/09/2022 3:27 AM
# @Author  : William
# @FileName: Bivariable_analysis.py
# @Software: PyCharm
# @Blog    ：https://bornforthis.cn/
from .DataManager import DataManager
import pandas as pd
from scipy import stats
import plotly.express as px

class Bivariable_analysis():

    def __init__(self, path):
        """
        This is to read the file
        :param path:
        """
        self.path = path

    def convert_format(self):
        data = pd.DataFrame(self.path)
        corr = data.corr()
        labels = list(corr.columns)
        output = {}
        for i in range(corr.shape[0] + 1):
            row = []
            for j in range(corr.shape[0] + 1):
                if(i == 0):
                    if(j == 0):
                        row.append(' ')
                    else:
                        row.append(labels[j-1])
                else:
                    if (j==0):
                        row.append(labels[i-1])
                    else:
                        row.append(corr.iloc[i-1,j-1])
            output[i] = row

        return output

    def datainjesting(self):
        """
        this is to read the data
        :param path:
        :return:
        """
        d = DataManager()
        self.data = d.ReadFile(self.path)
        return self.data

    def full_correlation_analysis(self):
        """
        This returns the all correlation value and their coresponding p-values (maybe p-value)
         for all the numerical variables
        :return:
        """
        df = self.data
        full_correlation_value = df.corr()
        return full_correlation_value

    def singular_correlation_analysis(self, variable_1, variable_2):
        """
        This returns the correlation value between two selected variables
        :return:
        """
        discribtion_dict = {'(correlation value, p-value)': None}
        df = self.data
        full_correlation_value = df.corr()
        correlation_value = full_correlation_value[variable_1][variable_2]
        corr_value_1, p_value_1 = stats.pearsonr(df[variable_1], df[variable_2])
        discribtion_dict['(correlation value, p-value)'] = [corr_value_1, p_value_1]
        return discribtion_dict

    def full_linear_regression(self):
        """
        This returns the linear regression model for all variables and their related
        p-values, R-values
        :return:
        """
        # df = self.data
        # df_numeric = df.select_dtypes(include=['float64', 'int64'])
        # for i in df_numeric:
        #     print(i)
        pass

    def singular_linear_regression(self, varaible_1, variable_2):
        """
        This returns the linear regression model between the two selected variables
        and its related p-value, R-value
        :return:
        """
        df = self.data
        x = df[varaible_1]
        y = df[variable_2]
        slope, intercept, r_value, p_value, std_err = stats.linregress(x, y)
        summery_dict = {'slope':slope, 'intercept':intercept, 'r_value': r_value**2,
                        'p_value': p_value}
        # print(slope, intercept, r_value, p_value, std_err)
        return summery_dict

    def ploting(self, varaible_1, variable_2):
        df = self.data
        df_numeric = df.select_dtypes(include=['float64', 'int64'])
        # fig = px.scatter(df_numeric, x=varaible_1, y=variable_2, trendline="ols")
        # fig.show()

        temp = self.coordinate_return(varaible_1, variable_2)
        return_dict = {'x': df_numeric[varaible_1].tolist(), 'y': df_numeric[variable_2].tolist(),'xl': temp['x'], 'yl': temp['y']}
        
        return return_dict

    def coordinate_return(self, varaible_1, variable_2):
        df = self.data
        df_numeric = df.select_dtypes(include=['float64', 'int64'])
        para_dict = self.singular_linear_regression(varaible_1, variable_2)
        x_1 = max(df_numeric[varaible_1])
        x_2 = min(df_numeric[varaible_1])
        self.slope = float(para_dict['slope'])
        self.intercept = float(para_dict['intercept'])
        y_1 = x_1*self.slope + self.intercept
        y_2 = x_2 * self.slope + self.intercept
        corrdinate_dict = {'x': [x_1, x_2],  'y': [y_1,y_2]}
        return corrdinate_dict

    def forecast(self,x:float):
        y = x * self.slope + self.intercept
        return y

    def main(self):
        self.datainjesting()
        print(self.singular_linear_regression('sepal.length', 'sepal.length'))
        print(self.ploting('sepal.length', 'sepal.length'))
