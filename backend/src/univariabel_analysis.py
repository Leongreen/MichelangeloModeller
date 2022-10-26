from DataManager import DataManager
import pandas as pd
import numpy
'''test2'''
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

    def new_full_discribtion(self):
        '''
        This return a dict to serve the GUI side, here is the format:
        {label: [sepal.length, sepal.width],  mean: [values], mode: [values], sd: [values] etc}
        In general form {lable:[all variable names], means:[], mdoe:[], sd:[]}
        '''
        df = self.data
        numeric_data = df.select_dtypes(include=['float64', 'int64'])
        a_dict = {'lable':[],"mean":[], "mode":[], 'Standard_deviation':[], "Median":[]}
        for variable_names in numeric_data:
            print(variable_names)
            a_dict['lable'].append(variable_names)
        for variable_name in a_dict['lable']:
            mean = self.Full_discribtion(variable_name)[variable_name]['mean']
            mode = self.Full_discribtion(variable_name)[variable_name]['mode']
            Standard_deviation = self.Full_discribtion(variable_name)[variable_name]['Standard_deviation']
            Median = self.Full_discribtion(variable_name)[variable_name]['Median']

            a_dict["mean"].append(round(mean,2))
            a_dict["mode"].append(round(mode,2))
            a_dict["Standard_deviation"].append(round(Standard_deviation,2))
            a_dict["Median"].append(round(Median,2))

        print(a_dict)


        # for j in self.unvariable_analysis():
        #     print(j,self.unvariable_analysis()[j])

        # print(a_dict)
        return None

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
        df = self.data
        numeric_data = df.select_dtypes(include=['float64', 'int64'])
        full_descrbtion = {}
        for variable in numeric_data:
            full_descrbtion[variable] = list(numpy.quantile(numeric_data[variable], [0,0.25,0.5,0.75,1]))
        # for head in self.data
        
        return full_descrbtion

    def new_all_quantile(self):
        '''
        This return a dict to serve the GUI side, here is the format:
        a_dict = {'label': [], "0%": [4.3,2.0,1.0,0.1], "25%": [], '50%': [], "75%": [],"75%": []}
        In general form {lable:[all variable names], "0%":[], "25%":[], '50%':[], "75%": [],"75%": []}
        '''
        df = self.data
        numeric_data = df.select_dtypes(include=['float64', 'int64'])
        a_dict = {'label': [], "0%": [], "25%": [], '50%': [], "75%": [],"100%": []}
        all_quantile_dict = self.all_quantile()
        for variable_names in numeric_data:
            # print(variable_names)
            a_dict['label'].append(variable_names)
        all_quantile_dict = self.all_quantile()
        for index in range(len(a_dict["label"])):
            print(index)
            for variable_name in a_dict["label"]:
                a_dict["0%"].append(all_quantile_dict[variable_name][index])
                a_dict["25%"].append(all_quantile_dict[variable_name][index])
                a_dict["50%"].append(all_quantile_dict[variable_name][index])
                a_dict["75%"].append(all_quantile_dict[variable_name][index])
                a_dict["100%"].append(all_quantile_dict[variable_name][index])
                continue
        a_dict["0%"] = a_dict["0%"][0:len(a_dict['label'])]
        a_dict["25%"] = a_dict["25%"][0:len(a_dict['label'])]
        a_dict["50%"] = a_dict["50%"][0:len(a_dict['label'])]
        a_dict["75%"] = a_dict["50%"][0:len(a_dict['label'])]
        a_dict["100%"] = a_dict["100%"][0:len(a_dict['label'])]

        return a_dict







    # def main(self):
    #     self.datainjesting()
    #     self.unvariable_analysis()

path = r"C:\Users\Willi\Desktop\aut degree\Second year\R_and_D\Semester 2\Clean_coding\MichelangeloModeller\backend\src\iris.csv"
a = Univariable(path)
a.datainjesting()
# print(a.new_full_discribtion())
# print(a.Full_discribtion("petal.width"))
# print(a.all_quantile())
print(a.new_all_quantile())