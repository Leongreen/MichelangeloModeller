# -*- coding: utf-8 -*-
# @Time    : 11/10/2022 8:02 pm
# @Author  : William
# @FileName: Randomization_test.py
# @Software: PyCharm

import numpy as np
import pandas as pd
import scipy.stats as stats
import matplotlib.pyplot as plt
import math

from DataManager import DataManager

class Randomization_test():


    def __init__(self, path):
        """
        This is to read the file
        :param path: This is the file path of the data file.
        """
        self.path = path

    def one_sample_t_test(self, population, sample):
        '''
        This part is to test whether the sample comes from the population. If the p-values is smaller tha,
        0.05, then will have enough evidence to reject the null, which means we reject the null that
        the population data is sharing the same mean as the sample data.
        '''
        d = DataManager()
        self.data = d.ReadFile(self.path)
        pop_data = self.data[population]
        sample_data = self.data[sample]
        t_statistic, p_value = stats.ttest_1samp(a=sample_data,  popmean=pop_data.mean())
        if p_value < 0.05:
            return "We have enough evidence that these data are not coming from the population distribution"
        else:
            return "We do not have enough evidence that these data are coming from the population distribution"

    def two_sample_t_test(self,sample_1, sample_2):
        '''
        This investigates whether the means of two independent data samples differ from one another.
        In a two-sample test, the null hypothesis is that the means of both groups are the same.
        '''
        d = DataManager()
        self.data = d.ReadFile(self.path)
        sample1 = self.data[sample_1]
        sample2 = self.data[sample_2]
        t_statistic, p_value = stats.ttest_ind(a=sample1,
                                               b=sample2,
                                               equal_var=False) # here I assumed the two sample dataset is sharing the same varianve
        if p_value < 0.05:
            return "We have enough evidence that there is a difference in mean between these two data set"
        else:
            return "We are not comfortable to claim there is a difference between their mean"

    def pair_t_test(self,data_1, data_2):
        '''
        This investigates the difference between samples of the same group at different points. In comparison
        to the two sample t test.  This deals with data set that are not independent.  eg. Sample group of people,
        at time t they take medicine A and at time t-1 they took nothing.  If we want to check if there is a difference,
        we can use the pair t test.
        '''
        d = DataManager()
        self.data = d.ReadFile(self.path)
        data1 = self.data[data_1]
        data2 = self.data[data_2]
        t_statistic, p_value = stats.ttest_rel(a=data1,
                        b=data2)
        if p_value < 0.05:
            return "We have enough evidence that there is a difference in mean between these two data set"
        else:
            return "We are not comfortable to claim there is a difference between their mean"




path = r"C:\Users\Willi\Desktop\aut degree\Second year\R_and_D\Semester 2\Clean_coding\MichelangeloModeller\backend\src\iris.csv"
a = Randomization_test(path)
a.two_sample_t_test('sepal.length','sepal.width')