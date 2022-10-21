import pandas as pd

class excelgen:

    def __init__(self):
        self.content = {}

    def add_content(self,dataframe,sheet_name):
        self.content[sheet_name] = dataframe

    def generate(self):

        writer = pd.ExcelWriter('temp_results.xlsx', engine='xlsxwriter')

        for key, values in self.content.items():
            values.copy().to_excel(writer,sheet_name=key)

        writer.save()