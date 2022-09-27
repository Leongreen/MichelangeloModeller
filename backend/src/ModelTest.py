import pandas as pd
from .ModelControl import ModelControl

m = ModelControl()

p = {}
p['data'] = pd.DataFrame(pd.read_csv(
    'https://raw.githubusercontent.com/pkmklong/Breast-Cancer-Wisconsin-Diagnostic-DataSet/master/data.csv'))
p['response'] = 'diagnosis'
p['missing_values'] = 'impute'
p['scalar'] = 'standard'
p['encoder'] = 'Label'
p['gridsearch'] = True
p['classifier'] = 'auto'
p['clusters'] = -1
p['testsplit'] = 0.5
m.setParemters(p)
r = m.run()
for l in r:
    for k in l.keys():
        print("=================")
        print(k)
        print(l[k])