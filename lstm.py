import json
import logging
import os
import sys

import keras
import numpy as np
import pandas as pd
from keras import initializers, regularizers
from keras.layers import LSTM, Dense, Dropout, Input
from keras.layers.core import Activation
from keras.models import Sequential, load_model, model_from_json, Model
from keras.optimizers import Adam
from sklearn import preprocessing
from sklearn.metrics import mean_squared_error

from DataAnalyzer import DataAnalyzer
from DataProcessor import DataProcessor
from DataRetriever import DataRetriever

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
logging.getLogger('tensorflow').setLevel(logging.FATAL)

def mapFunction(vals):
    risks = [0.0, 0.11, 0.41, 0.61]
    vals_list = vals[0].tolist()

    return risks[vals_list.index(max(vals_list))]

def main(processInstanceId: str, method: str):
    metrics = ['temperature', 'systolic', 'diastolic', 'pulse', 'spo2', 'weight']
    defaults = [36, 115, 75, 75, 98, 75]
    filePath = os.path.dirname(os.path.realpath(__file__))

    ipDB = os.getenv('INFLUX_IP_AI', 'localhost')
    portDB = os.getenv('INFLUX_PORT_AI', '8086')
    userDB = os.getenv('INFLUX_USER_AI', 'admin')
    passwordDB = os.getenv('INFLUX_PW_AI', 'G10m1R0m3')
    nameDB = os.getenv('INFLUX_DB_AI', 'giomi')
    
    dr = DataRetriever(metrics)
    dfs = dr.loadDataFromDB(ipDB, portDB, userDB, passwordDB, nameDB)

    dp = DataProcessor(metrics, defaults)
    df = dp.applyPipeline(dfs)
    
    inputs = df[df['processInstanceId'] == processInstanceId]

    inputs = inputs[-3:]
    inputs = inputs[metrics]
    inputs = inputs.values.reshape(1, 3, 6)

    model = None

    if method == 'save':
        input_data = Input(shape=(3,6))
        lstm_layer1 = LSTM(units=40, return_sequences=True)(input_data)
        lstm_layer2 = LSTM(units=40, return_sequences=False)(lstm_layer1)
        shared = Dense(40, activation='relu')(lstm_layer2)
        sub1 = Dense(20, activation='relu')(shared)
        sub2 = Dense(20, activation='relu')(shared)
        sub3 = Dense(20, activation='relu')(shared)
        sub4 = Dense(20, activation='relu')(shared)
        sub5 = Dense(20, activation='relu')(shared)
        out1 = Dense(4, activation='softmax')(sub1)
        out2 = Dense(4, activation='softmax')(sub2)
        out3 = Dense(4, activation='softmax')(sub3)
        out4 = Dense(4, activation='softmax')(sub4)
        out5 = Dense(4, activation='softmax')(sub5)

        model = Model(input_data, outputs=[out1, out2, out3, out4, out5])
        model.compile(loss='categorical_crossentropy', optimizer='rmsprop')
        # model.build((3,6))
        # model.summary()

        jsonModel = model.to_json()
        with open(os.path.join(filePath, 'model.json'), 'w') as jsonFile:
            jsonFile.write(jsonModel)
        
        model.save_weights(os.path.join(filePath, 'model.h5'))
    else:
        readJson = None

        with open(os.path.join(filePath, 'model.json'), 'r') as jsonFile:
            readJson = jsonFile.read()
        
        model = model_from_json(readJson)
        model.load_weights(os.path.join(filePath, 'model.h5'))


    #model.summary()

    output = model.predict(inputs)

    print(json.dumps({
        'output': list(map(mapFunction, output))
    }))

if __name__ == '__main__':
    if len(sys.argv) != 3:
        print("Usage: python3 lstm.py <processInstanceId> <load|save>")
        exit()
    
    
    processInstanceId = sys.argv[1]
    method = sys.argv[2]

    if method not in ['load', 'save']:
        print("Usage: python3 lstm.py <processInstanceId> <load|save>")
        exit()
    
    main(processInstanceId, method)
