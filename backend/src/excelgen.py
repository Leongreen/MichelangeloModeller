import pandas as pd


class excelgen:

    def __init__(self):
        self.content = {}

    def add_content(self,dataframe,sheet_name):
        # add dataframe to content dict
        self.content[sheet_name] = dataframe

    def generate(self):
        # create the writer object
        writer = pd.ExcelWriter('temp_results.xlsx', engine='xlsxwriter')

        # for each dataframe in the content dict, place the dataframe in a sheet with the name being the key in the dict
        for key, values in self.content.items():
            values.copy().to_excel(writer,sheet_name=key)

        writer.save()