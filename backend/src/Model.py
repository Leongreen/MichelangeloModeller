import pandas as pd
from keras.layers import TextVectorization
from sklearn.linear_model import SGDClassifier
from sklearn.svm import LinearSVC
from sklearn.gaussian_process import GaussianProcessClassifier
from sklearn.gaussian_process.kernels import RBF
from sklearn.impute import SimpleImputer
from sklearn.manifold import TSNE
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.neural_network import MLPClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import OrdinalEncoder
from sklearn.compose import ColumnTransformer
from sklearn.svm import LinearSVC
from sklearn import metrics
import numpy as np


class Model:

    def __init__(self):

        """
        self.data = pd.DataFrame(params['data'])
        self.raw_data = self.data
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
            """
        pass


    def data_transform(self,data):
        # reset index to 0,1,2,3...
        data.index = range(0, len(data))

        # separate the numbered and text columns
        nums = data.select_dtypes(include=['float64', 'int64'])
        strs = data.select_dtypes(exclude=['float64', 'int64'])

        # determine which columns are categorical and which are discrete
        likely_cat = {}
        for var in strs.columns:
            # test number of unique values in column
            likely_cat[var] = 1. * strs[var].nunique() / strs[var].count() < 0.02

        # dict to store label encoder incase needed
        encoders = {}

        # create dataframe to hold new vectorized data
        feature_space = pd.DataFrame(nums)
        for var in strs.columns:
            if likely_cat[var]:
                # text column is categorical so use a label encoder
                le = OrdinalEncoder()
                encoded_labels = pd.DataFrame(le.fit_transform(strs[var].to_numpy().reshape(-1, 1)))
                encoded_labels.columns = [var]
                for x in encoded_labels.columns:
                    feature_space.loc[:, x] = encoded_labels[x]
                encoders[var] = le
            else:
                # text column is discrete so use a text vectorizer

                # calculate the average word (token) count per cell for a column
                max_length = 0
                for x in strs[var]:
                    max_length += len(x.split())
                max_length = round(max_length / len(strs[var]))

                # Keras text vectorization function tokenizes and then vectorizes the text
                vectoriser = TextVectorization(output_sequence_length=max_length, output_mode='int')
                # train the vectoriser on the data
                vectoriser.adapt(strs[var].to_numpy())
                # call the vectoriser function on the data
                vectored = pd.DataFrame(vectoriser(strs[var]).numpy())
                # generate the names for the new columns in the form [column_name]_X
                c_names = []
                for i in range(len(vectored.columns)):
                    c_names.append(str(str(var) + "_" + str(i)))
                vectored.columns = c_names
                # copy over the vectorised columns into the feature space dataframe
                for x in vectored.columns:
                    feature_space.loc[:, x] = vectored[x]

        # normalise the values in feature space (but ignore the class variables)
        for x in feature_space.columns:
            if x in likely_cat:
                if not likely_cat[x]:
                    feature_space[x] = (feature_space[x] - feature_space[x].mean()) / feature_space[x].std()
            else:
                feature_space[x] = (feature_space[x] - feature_space[x].mean()) / feature_space[x].std()
        return feature_space

    def run_model(self,data, label):
        data = data
        labels = data[label]
        data = data.drop(label, axis=1)
        feature_space = self.data_transform(data)

        x_train, x_test, y_train, y_test = train_test_split(data, labels, test_size=0.25)

        classifiers = []
        # SGDClassifier
        classifiers.append(self.run_sgd(x_train, y_train, x_test, y_test))
        classifiers.append(self.run_svc(x_train, y_train, x_test, y_test))
        classifiers.append(self.run_mlp(x_train, y_train, x_test, y_test))
        classifiers.append(self.run_gaussian(x_train, y_train, x_test, y_test))
        return classifiers

    def run_sgd(self, x, y, X, Y):
        # create the classifier object
        sgd = SGDClassifier()
        # fit classifier to training data (x,y)
        sgd.fit(x, y)
        # make a prediction on the test data
        p = sgd.predict(X)
        # generate and return results
        results = {'Classifier': 'SGD'}
        results['summary'] = metrics.classification_report(Y, p, output_dict=True)
        results['ConfusionMatrix'] = metrics.confusion_matrix(Y, p)
        print(f"SGD Complete: Accuracy:{metrics.accuracy_score(Y, p)}")
        return results

    def run_svc(self, x, y, X, Y):
        # create the classifier object
        svc = LinearSVC()
        # fit classifier to training data (x,y)
        svc.fit(x, y)
        # make a prediction on the test data
        p = svc.predict(X)
        # generate and return results
        results = {'Classifier': 'LinearSVC'}
        results['summary'] = metrics.classification_report(Y, p, output_dict=True)
        results['ConfusionMatrix'] = metrics.confusion_matrix(Y, p)
        print(f"SVC Complete: Accuracy:{metrics.accuracy_score(Y, p)}")
        return results

    def run_mlp(self, x, y, X, Y):
        # create the classifier object
        mlp = MLPClassifier()
        # fit classifier to training data (x,y)
        mlp.fit(x, y)
        # make a prediction on the test data
        p = mlp.predict(X)
        # generate and return results
        results = {'Classifier': 'MLP Neural Network'}
        results['summary'] = pd.concat([pd.DataFrame(metrics.classification_report(Y, p, output_dict=True)),pd.DataFrame(mlp.coefs_)],axis=0,join='outer')
        results['ConfusionMatrix'] = metrics.confusion_matrix(Y, p)
        print(f"MLP Complete: Accuracy:{metrics.accuracy_score(Y, p)}")
        return results

    def run_gaussian(self, x, y, X, Y):
        results = {'Classifier': 'Gaussian Process'}
        if (len(x) * len(x.columns)) > 10000:
            print("Skipping Guassian")
            return results
        # create the classifier object and kernel
        kernel = 1.0 * RBF(1.0)
        mlp = GaussianProcessClassifier(kernel=kernel)
        # fit classifier to training data (x,y)
        mlp.fit(x, y)
        # make a prediction on the test data
        p = mlp.predict(X)
        # generate and return results

        results['summary'] = metrics.classification_report(Y, p, output_dict=True)
        results['ConfusionMatrix'] = metrics.confusion_matrix(Y, p)
        print(f"Gaussian Complete: Accuracy:{metrics.accuracy_score(Y, p)}")
        return results

    def generateXY(self, data):
        process_limit = 1000
        value_count = len(data) * len(data.columns)
        if value_count > process_limit:
            nums = data.iloc[:process_limit, :].select_dtypes(include=['float64', 'int64'])
        else:
            nums = data.select_dtypes(include=['float64', 'int64'])
        tsne = TSNE(n_components=2, learning_rate='auto', init='pca')
        tsne.fit(nums)
        return tsne.fit_transform(nums)