from .Model import Model


class ModelControl:

    def __init__(self):
        self.model = None

    def setParemters(self, params):
        # expects a dict
        self.model = Model(params)

    def run(self):
        if self.model is not None:
            self.model.data_clean()
            self.model.data_transform()
            result = self.model.run_model()
            return result