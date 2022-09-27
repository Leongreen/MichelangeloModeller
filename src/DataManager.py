import pandas as pd
import os
import sys


# Class DataManager version 1

class DataManager:
    def __init__(self):
        print("DataManager - Init")
        self.filepath = None
        self.filetype = None

        try:
            self.df = pd.DataFrame()
        except:
            print("Failed to initialize Data Reader")

    def ReadFile(self, path):
        print("Reading file: " + str(path))
        self.filepath = path
        # Trying to inject directly if file was passed
        # try:
        #     self.df = pd.DataFrame()
        #     return self.df
        # except:
        #     print("Path was given")
        # Code for reading from the path
        # print(path.filename)
        try:
            x = path.filename.split(".")[-1].lower()
        except:
            x = path.split(".")[-1].lower()


        self.filetype = x

        if (x == "csv"):
            self.InjectCSV(path)
        elif (x == "xlsx" or x == "xls"):
            self.InjectEXCEL(path)
        elif (x == "parquet"):
            self.InjectPARQUET(path)
        elif (x == "txt"):
            self.InjectTXT(path)
        elif (x == "json"):
            self.InjectJSON(path)
        else:
            print("Unsupported filetype")
        print("Data imported: "+ str(self.df))
        return self.df
        # A gate similar to switch state in order to call correct function
        # Else statement if none of   the common functions appliable

    # A bunch of function to read data depending on extension
    def InjectCSV(self, path):
        try:
            self.df = pd.read_csv(path)
        except Exception as e:
            print("Failed to CSV inject data: ", e)

    def InjectEXCEL(self, path):
        try:
            self.df = pd.read_excel(path)
        except Exception as e:
            print("Failed to EXCEL inject data: ", e)

    def InjectTXT(self, path):
        try:
            self.df = pd.read_fwf(path)
        except Exception as e:
            print("Failed to TXT inject data: ", e)

    def InjectPARQUET(self, path):
        try:
            self.df = pd.read_parquet(path)
        except Exception as e:
            print("Failed to PARQUET inject data: ", e)

    def InjectJSON(self, path):
        try:
            self.df = pd.read_json(path)
        except Exception as e:
            print("Failed to JSON inject data: ", e)

    def returnfilepath(self):
        if self.filepath is not None:
            return self.filepath
        else:
            print("Error: run DataManager.ReadFile() first")
            return None

    def returnfiletype(self):
        if self.filetype is not None:
            return self.filetype
        else:
            print("Error: run DataManager.ReadFile() first")
            return None

    # Function to output Data
    def OutputDataEXCEL(self, df, path):
        try:
            if not df.empty:
                df.to_excel(path)
        except Exception as e:
            print("Failed to write a file: ", e)

if __name__ == '__main__':
    d = DataManager()
    d.ReadFile("iris.csv")
    print(d.df)