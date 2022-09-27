import pandas as pd
from sklearn.impute import SimpleImputer
from sklearn.manifold import TSNE
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.preprocessing import LabelEncoder
from sklearn.compose import ColumnTransformer
from sklearn.svm import LinearSVC
from sklearn import metrics
import numpy as np


class Model:

    def __init__(self, params):
        self.data = pd.DataFrame(params['data'])
        self.response = params['response']
        if self.response == 'None':
            self.supervised = False
        else:
            self.supervised = True
        self.samples = len(self.data.index)
        self.missing_values = params['missing_values']
        self.scalar = params['scalar']
        self.encoder = params['encoder']
        self.clusters = params['clusters']
        self.gridsearch = params['gridsearch']
        self.encoder_history = None

        if 'force_comp' in params:
            self.force_comp = params['force_comp']
        else:
            self.force_comp = False

        if 'classifier' in params:
            self.classifier = params['classifier']
        else:
            self.classifier = 'auto'

        if 'reduction' in params:
            self.reduction = params['reduction']
        else:
            self.reduction = 'auto'

        if 'imputer' in params:
            self.imputer = params['imputer']
        else:
            self.imputer = 'mean'

        if 'allow_fail' in params:
            self.allow_fail = params['allow_fail']
        else:
            self.allow_fail = True

        if 'continuous_threshold' in params:
            self.continuous_threshold = params['continuous_threshold']
        else:
            self.continuous_threshold = 0.4

        if 'testsplit' in params:
            self.testsplit = params['testsplit']
        else:
            self.testsplit = 0.3

        if 'discreatize' in params:
            self.discreatize = params['discreatize']
        else:
            self.discreatize = False

    def data_clean(self):
        self.data = self.data.dropna(axis=1)
        num = pd.DataFrame(self.data.select_dtypes(include=['float64', 'int64']))
        if num.isnull().values.sum() != 0:
            if self.missing_values == 'remove':
                num = pd.DataFrame(num.dropna())
            elif self.missing_values == 'impute':
                Simputer = SimpleImputer(strategy=self.imputer)
                num = pd.DataFrame(Simputer.fit_transform(num))
        self.data[num.columns] = num
        self.data = self.data.dropna(axis=0)

    def data_transform(self):

        num = self.data.select_dtypes(include=['float64', 'int64'])
        str = self.data.select_dtypes(exclude=['float64', 'int64'])
        for c in num.columns:
            if (self.data[c].nunique() / self.samples) < self.continuous_threshold and self.discreatize:
                pass  # TODO discreatize
        match self.scalar:
            case 'standard':
                col_names = num.columns
                features = self.data[col_names]
                scaler = StandardScaler()
                scaler.fit(features)
                features = scaler.transform(features.values)
                self.data[col_names] = features

        match self.encoder:
            case 'Label':
                col_names = str.columns
                features = self.data[col_names]
                labelencoder = LabelEncoder()
                labelencoder.fit(features.values)
                features = labelencoder.transform(features.values)
                self.encoder_history = labelencoder
                self.data[col_names.all()] = features
                print(self.data.columns)

    def run_model(self):
        scount = self.samples
        if scount < 50:
            return "failed get more data"
        results = []
        if self.supervised:
            if scount < 100000:
                results.append(self.linearsvc())
                text = True
                for x in self.data.columns:
                    if self.data.dtypes[x] == 'float64' or self.data.dtypes[x] == 'int64':
                        text = False
                if text:
                    results.append(self.naivebayes())
                else:
                    results.append(self.kneighbor())
                    results.append(self.svc())
                    results.append(self.ensemble())
            else:
                results.append(self.sgd())
                results.append(self.kernal())
        else:
            if self.clusters != -1:
                if scount < 10000:
                    results.append(self.meanshift())
                    results.append(self.vbgmm())
                else:
                    pass  # too much data
            else:
                if scount < 10000:
                    results.append(self.kmeans())
                    results.append(self.spectral())
                    results.append(self.gmm())
                else:
                    results.append(self.mkmeans())
        return results

    # return form
    # dict
    # ['supervised'] boolean
    # ['model'] sckit-learn model
    # ['acc'] float
    # ['recall'] float
    # ['pre'] float
    # ['f1'] float
    # ['confusion'] 2d array
    # ['graphinfo'] :
    #   ['x'] list
    #   ['y'] list
    #   ['z'] list

    def linearsvc(self):
        result = {"supervised" : True}
        pred = None
        train = self.data.copy().loc[:, self.data.columns != self.response]
        response = self.data[self.response]
        print(self.response)
        xtrain, xtest, ytrain, ytest = train_test_split(train, response, test_size=self.testsplit)
        if self.gridsearch:
            param_grid = [{
                'C': [0.25, 0.5, 1, 1.5],
                'tol': [1e-2, 1e-3, 1e-4],
                'max_iter': [800, 1600, 2400, 5000]
            }]
            grid = GridSearchCV(LinearSVC(), param_grid, cv=5, return_train_score=True)
            print(xtrain)
            print(ytrain)
            grid.fit(xtrain, ytrain)
            pred = grid.predict(xtest)
            result['model'] = grid
        else:
            lsvc = LinearSVC()
            lsvc.fit(xtrain, ytrain)
            pred = lsvc.predict(xtest)
        result['acc'] = metrics.accuracy_score(ytest, pred)
        result['recall'] = metrics.recall_score(ytest, pred, average='macro')
        result['pre'] = metrics.precision_score(ytest, pred, average='macro')
        result['f1'] = metrics.f1_score(ytest, pred, average='macro')
        result['confusion'] = metrics.confusion_matrix(ytest, pred)
        x,y,z = None,None,None
        z = []
        full = pd.DataFrame()
        for i in range(len(xtrain)):
            full = pd.concat([full, xtrain.iloc[[i]]])
            z.append(0)
        for i in range(len(xtest)):
            full = pd.concat([full, xtest.iloc[[i]]])
            if pred.tolist()[i] == ytest.tolist()[i]:
                z.append(1)
            else:
                z.append(2)

        print(full)
        print(z)
        graphinfo = {}
        c_count = len(xtrain.columns)
        if c_count > 2:
            if self.reduction == 'auto':
                tsne = TSNE(n_components=2, learning_rate='auto', init='random',random_state=1)
                comps = tsne.fit_transform(full)
                x = comps[:, 0]
                y = comps[:, 1]


        graphinfo['x'] = x
        graphinfo['y'] = y
        graphinfo['z'] = z
        #graphinfo['g'] = response

        result['graphinfo'] = graphinfo
        if self.gridsearch:
            result['bestp'] = grid.best_params_
        return result

    def buildgraphinfo(self, train, response, model):
        graphinfo = {}
        c_count = len(train.columns)
        if c_count > 2:
            if self.reduction == 'auto':
                tsne = TSNE(n_components=2, learning_rate='auto', init='random')
                comps = tsne.fit_transform(train)
                graphinfo['x'] = comps[:, 0]
                graphinfo['y'] = comps[:, 1]
        result = model.fit(train)
        result = model.predict(train)
        matches = []
        for i in range(len(response.index)):
            if response.iloc[i] == result[i]:
                matches.append(1)
            else:
                matches.append(0)

        graphinfo['z'] = matches
        return graphinfo

    def naivebayes(self):
        pass

    def kneighbor(self):
        pass

    def svc(self):
        pass

    def ensemble(self):
        pass

    def sgd(self):
        pass

    def kernal(self):
        pass

    def meanshift(self):
        result = {"supervised": False}
        pass

    def vbgmm(self):
        pass

    def kmeans(self):
        pass

    def spectral(self):
        pass

    def gmm(self):
        pass

    def mkmeans(self):
        pass