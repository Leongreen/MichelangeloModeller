from .DataManager import DataManager
import pandas as pd
import numpy

class Univariable():
    """
    1.Read files
    """

    def __init__(self, path):
        self.path = path
        self.data = None

    def datainjesting(self):
        """
        this is to read the data
        :param path:
        :return:
        """
        d = DataManager()
        self.data = d.ReadFile(self.path)
        return self.data

    def unvariable_analysis(self):
        """
        1. Analysing the mode，mean，median and Standard deviation for each column.
        2. Return a dictionary that contains the  mode，mean，median and Standard deviation for each column.
           sample： {column1:{mean:value,mode:value,median:value}, column 2: {mean:value,mode:value,median:value}}
        :return:
        """
        """
        The following first drop empty rows of the data,
        then it calculates the mean, mode, median, and standard deviation
        for each variable (column).
        """
        self.drop_empty_row = self.data.dropna(axis=0)
        means = self.drop_empty_row.mean(axis=0, numeric_only=True)
        modes = self.drop_empty_row.mode(axis=0, numeric_only=True)
        medians = self.drop_empty_row.median(axis=0, numeric_only=True)
        SD = self.drop_empty_row.std(axis=0, numeric_only=True).dropna(axis=0)
        # print("-----------------------------------------")
        """
        The following is to create a mode dictionary corresponding to all variables
        as there are some weired issue by using the modes_dict = dict(modes)
        to create a dictionary
        """
        modes_dict = {}
        mode_num_list = []
        mode_var_list = []
        for i in modes:
            mode_var_list.append(i)
        for j in modes.values[0]:
            mode_num_list.append(j)
        for k in range(0, len(mode_num_list)):
            modes_dict[mode_var_list[k]] = mode_num_list[k]
        """
        The following creates a dictionary for of means corresponding 
        to their variables.
        """
        means_dict = dict(means)
        ""
        """
        The following creates a dictionary for of medians corresponding 
        to their variables.
        """
        Median_dict = dict(medians)
        # print(medians_dict_test)
        # print("SD_dict")
        # print("--------------------SD_dict")
        """
        The following creates a dictionary for of medians corresponding 
        to their variables.
        """
        SD_dict = dict(SD)
        # print(SD_dict)
        """
        This is what we want. 
        """
        data_dict = {"mean": means_dict, "mode": modes_dict, "Standard_deviation": SD_dict, "Median":Median_dict}

        return data_dict


    def Full_discribtion(self, variable_selection):
        """
        The following returns a dictionary that contains the mean, mode, etc. of the selected variable.
        :param variable_selection:
        :return:
        """
        discribtion_dict = {variable_selection:{"mean":None,"mode":None,"Standard_deviation":None,"Median":None}}
        parameters = self.unvariable_analysis()
        for parameter in parameters:
            if variable_selection in parameters[parameter]:
                discribtion_dict[variable_selection][parameter] = parameters[parameter][variable_selection]
        return discribtion_dict

    def singular_quantile(self, selected_variabel):
        df = self.data
        numeric_data= df.select_dtypes(include=['float64', 'int64'])
        # names = data['variety']
        # names_quantile = names.quantile(names)
        quantile = numpy.quantile(numeric_data[selected_variabel], [0,0.25,0.5,0.75,1])
        # print(sepal_length == str)
        # print(type(names_quantile))

        return quantile.tolist()

    def all_quantile(self):
        df = self.drop_empty_row
        numeric_data = df.select_dtypes(include=['float64', 'int64'])
        full_descrbtion = {}
        for variable in numeric_data:
            full_descrbtion[variable] = numpy.quantile(numeric_data[variable], [0,0.25,0.5,0.75,1])
        # for head in self.data
        
        return full_descrbtion

    def main(self):
        self.datainjesting()
        self.unvariable_analysis()