from .DataManager import DataManager
import plotly.graph_objects as go
import plotly.express as px

class Univariable_histogram():
    """
        1.Read files
    """

    def __init__(self, path, variable_name):
        self.path = path
        self.variable_name = variable_name

    def datainjesting(self):
        """
        this is to read the data
        :param path:
        :return:
        """
        d = DataManager()
        self.data = d.ReadFile(self.path)
        return self.data

    def histogram(self):
        """
        This function aims to return histograms for the selected variable.
        :return:
        """
        
        for columns in self.data:
            if columns == self.variable_name:

                column_data = self.data[columns]
                column_data_list = column_data.tolist()
        # fig = px.histogram(column_data, x=self.variable_name,range_x=None,nbins=100)

        a_dict = {"data_in_list": column_data_list, "x_interal_name" : f"{self.variable_name}"}
        return a_dict


    def main(self):
        self.datainjesting()
        return self.histogram()


