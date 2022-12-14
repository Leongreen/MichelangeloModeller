import pandas as pd
from keras.layers import TextVectorization
from sklearn import metrics
from sklearn.gaussian_process import GaussianProcessClassifier
from sklearn.gaussian_process.kernels import RBF
from sklearn.linear_model import SGDClassifier
from sklearn.manifold import TSNE
from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPClassifier
from sklearn.preprocessing import OrdinalEncoder
from sklearn.preprocessing import LabelEncoder
from sklearn.svm import LinearSVC
import matplotlib as plt
from sklearn.inspection import DecisionBoundaryDisplay

class Model:

    def __init__(self):
        # set parameters
        self.TIMEOUT = 5
        self.TEST_SPLIT = 0.25


    def data_transform(self, data):
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

    # unsupervised learning
    def run_model(self, data):
        pass

    # supervised learning
    def run_model(self, data, label):
        print(f"model.py given data:{data}, label:{label}")
        result = {}
        #data = data.dropna()
        print(f"data contains nulls? {pd.DataFrame(data).isnull().values.any()}")
        result['filenames'] = self.generateGraph(data, label)
        # organize data into separate label and data dataframes
        data = data
        labels = data[label]
        data = data.drop(label, axis=1)
        # feature space is the form of data the algorithm will actually see
        feature_space = self.data_transform(data)

        # split data and labels in sperate training and testing sets
        x_train, x_test, y_train, y_test = train_test_split(data, labels, test_size=self.TEST_SPLIT)

        # record results inside a list
        classifiers = []

        # try each classifier
        classifiers.append(self.run_sgd(x_train, y_train, x_test, y_test))
        classifiers.append(self.run_svc(x_train, y_train, x_test, y_test))
        classifiers.append(self.run_mlp(x_train, y_train, x_test, y_test))
        classifiers.append(self.run_gaussian(x_train, y_train, x_test, y_test))
        # dict['Classifier'] : name of classifier. The user should see this
        # dict['ConfusionMatrix'] : ndarray showing TP, TN, FN, FP. Useful for user but not necessary
        # dict['summary'] : dict containing acc, pre, recall, f1 ect. The user should see this
        summaryTable = []
        models = []

        for x in classifiers:
            summaryTable.append(list([x['Classifier'],round(x['summary']['accuracy'],2)]))
            models.append(x['Classifier'])
            c_report = []
            for i in x['summary'].keys():
                if type(x['summary'][i]) != float:
                    n = x['summary'][i]
                    c_report.append(n)

                    #n = list(x['summary'][i].values())
                    #c_report.append(list([round(item, 2) for item in n]))
            result[x['Classifier']] = list(c_report)

        result['classifiers'] = list(models)
        result['graphlabel'] = list(labels)
        result['summarytable'] = list(summaryTable)
        result['output'] = classifiers

        return result

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
        results['summary'] = metrics.classification_report(Y, p, output_dict=True)
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
        gpc = GaussianProcessClassifier(kernel=kernel)
        # fit classifier to training data (x,y)
        gpc.fit(x, y)
        # make a prediction on the test data
        p = gpc.predict(X)
        # generate and return results

        results['summary'] = metrics.classification_report(Y, p, output_dict=True)
        results['ConfusionMatrix'] = metrics.confusion_matrix(Y, p)
        print(f"Gaussian Complete: Accuracy:{metrics.accuracy_score(Y, p)}")
        return results

    # function to convert high dimensional into 2 principle components for visualization
    def generateGraph(self, data, label):
        print("Generating Graph")
        print(data)
        # set limit on the amount of data to process
        data = pd.DataFrame(data).dropna(axis=1)
        data = pd.DataFrame(data).dropna(axis=0)
        process_limit = 1500
        # calculate the amount of values in the dataframe
        value_count = len(data) * len(data.columns)
        print(data.shape)
        print(f"Total Values: {value_count}, Process limit: {process_limit}")
        if value_count > process_limit:
            data = data.sample(frac=1)
            data = data.sample(round(process_limit/len(data.columns)))
        print(data.shape)
        labels = data[label]
        data = data.drop(label, axis=1)
        nums = data.select_dtypes(['int64','float64'])
        if len(nums.columns) >= 2:
            print(f"Enough numeric columns: {len(nums.columns)}")
            print(nums)
            data = nums
        data = self.data_transform(data)
        # select either the first [process_limit] rows of data or if < process limit then select all rows


        # create the T-SNE object and fit it to the numerical columns
        tsne = TSNE(n_components=2, learning_rate='auto', init='pca')
        print("TSNE object created")
        comps = tsne.fit_transform(data)
        print("TSNE transform complete")

        kernel = 1.0 * RBF(1.0)
        gpc = GaussianProcessClassifier(kernel=kernel)
        mlp = MLPClassifier()
        svc = LinearSVC()
        sgd = SGDClassifier()
        le = LabelEncoder()
        labels = le.fit_transform(labels)

        print("fitting gpc")
        gpc.fit(comps,labels)
        print("fitting mlp")
        mlp.fit(comps,labels)
        print("fitting svc")
        svc.fit(comps,labels)
        print("fitting sgd")
        sgd.fit(comps,labels)
        print("fitting complete")
        print(f"data contains nulls? {pd.DataFrame(comps).isnull().values.any()}")
        names = []
        print("creating boundries")
        names.append(self.createBoundry("gpc","Gaussian Process Classifier",gpc,comps,labels))
        names.append(self.createBoundry("mlp","Multi-Layer Perceptron",mlp,comps,labels))
        names.append(self.createBoundry("svc","Support Vector",svc,comps,labels))
        names.append(self.createBoundry("sgd","SGD Classifier",sgd,comps,labels))
        # return the nums dataframe which consists of 2 columns of principle components
        print(f"=============Graph generating complete: {names}===========")
        return names

    def createBoundry(self,classifier,name, clf, comps, labels, ax=None):
        plt.rcParams['figure.figsize'] = [20, 10]
        filename = str(classifier + ".png")
        title = str("Decision Boundary of "+name)
        d = DecisionBoundaryDisplay.from_estimator(clf,comps,xlabel="Compressed X",ylabel="Compressed Y")
        d.ax_.scatter(comps[:,0],comps[:,1],c=labels,edgecolor='black',linewidth=1.5)
        d.figure_.set_dpi(300)
        d.ax_.title.set_text(title)
        d.figure_.savefig(filename)
        return filename