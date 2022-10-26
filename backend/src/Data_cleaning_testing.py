# -*- coding: utf-8 -*-
# @Time    : 19/10/2022 6:58 pm
# @Author  : William
# @FileName: Data_cleaning_testing.py
# @Software: PyCharm

import pandas as pd
from io import StringIO
from pandas import util
from sklearn.impute import SimpleImputer
import numpy as np

#Aim: If there is less than half of the row being null, we replace it by the column mean
data = [['tom', 10, None,0.2], ['nick', 15, 0.1,0.2], ['juli', 14, 0.1,0.2], ['William', 13, 0.1,0.2], [None, 13, 0.1,0.2]]
df = pd.DataFrame(data, columns=['Name', 'Age',  'test1', 'test2'])
# test = df.dropna(axis=0)
# print(df)
# print(df[['Name', 'Age']])
print(len(df))

#If there is less than half of the row being null, we replace it by the column mean
# print(df)
# numerical_data = df.select_dtypes(include=['float64', 'int64'])
# print(numerical_data)
# categorical_data = df.select_dtypes(include='object')
# columnName_list = []
# for name in numerical_data:
#     columnName_list.append(name)
# # print(columnName_list)
# imputer = SimpleImputer(missing_values=np.nan, strategy='mean')
# imputer = imputer.fit(numerical_data)
# X = imputer.transform(numerical_data)
# # print(X)
# df_numerical_part = pd.DataFrame(X, columns=columnName_list)
# # print(df_numerical_part)
#
# frames = [df_numerical_part,categorical_data]
# result = pd.concat(frames,axis=1, join='inner')
# print(result)









# numerical_data = df.select_dtypes(include=['float64', 'int64'])
# print(numerical_data)
# categorical_data = df.select_dtypes(include='object')
# # print(numerical_data)
# # print(categorical_data)
# for column_name in numerical_data:
#     mean_value = numerical_data[column_name].mean()
#     numerical_data[column_name].fillna(value = mean_value)
# print(numerical_data)




#{column_name:[data], }

