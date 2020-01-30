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
import requests

from DataAnalyzer import DataAnalyzer
from DataProcessor import DataProcessor
from DataRetriever import DataRetriever

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
logging.getLogger('tensorflow').setLevel(logging.FATAL)

metrics = ['temperature', 'systolic', 'diastolic', 'pulse', 'spo2', 'weight', 'glucose']
defaults = [36, 115, 75, 75, 98, 75, 80]

fromTypeIDToName = { 
    1: 'Patologie cardiache (solo cuore)', 
    2: 'Ipertensione', 
    3: 'Patologie vascolari', 
    4: 'Patologie respiratorie', 
    5: 'O.O.N.G.L', 
    6: 'Apparato GI superiore', 
    7: 'Apparato GI inferiore', 
    8: 'Patologie epatiche', 
    9: 'Patologie renali', 
    10: 'Patologie genito-urinarie', 
    11: 'Sistema muscolo-scheletro-cute', 
    12: 'Patologie sistema nervoso centrale e periferico (no demenza)',  
    13: 'Patologie endocrine-metaboliche (include diabete, infezioni, sepsi, stati tossici)', 
    14: 'Patologie psichiatriche-comportamentali (include demenza, depressione, ansia, agitazione, psicosi)'
}

def generate_input_sequence(window_size,data):
  """ Funzione per dividere un set di dati in un insieme di finestre di 3 elementi.
      Utilizzato per i dati di input. """

  sequences = []
  for j in range(len(data)):
    seq = data[j:j+window_size]
    if (len(seq) == window_size):
      sequences.append(seq.values)
      
  return sequences

def generate_output_sequence(window_size,data):
  """ Funzione per dividere un set di dati in un insieme di finestre di 3 elementi.
      Utilizzato per i dati di output. """

  sequences = []

  for j in range(len(data)):
    seq = data[j:j+window_size]
    if (len(seq) == window_size):
      sequences.append(seq[-1])
      
  return sequences

def returnModel():
    """ Funzione che ritorna il modello di rete neurale """

    input_data = Input(shape=(3,9))
    lstm_layer1 = LSTM(units=40, return_sequences=True)(input_data)
    lstm_layer2 = LSTM(units=40, return_sequences=False)(lstm_layer1)
    shared = Dense(40, activation='relu')(lstm_layer2)
    sub1 = Dense(20, activation='relu')(shared)
    sub2 = Dense(20, activation='relu')(shared)
    sub3 = Dense(20, activation='relu')(shared)
    sub4 = Dense(20, activation='relu')(shared)
    sub5 = Dense(20, activation='relu')(shared)
    sub6 = Dense(20, activation='relu')(shared)
    sub7 = Dense(20, activation='relu')(shared)
    sub8 = Dense(20, activation='relu')(shared)
    sub9 = Dense(20, activation='relu')(shared)
    sub10 = Dense(20, activation='relu')(shared)
    sub11 = Dense(20, activation='relu')(shared)
    sub12 = Dense(20, activation='relu')(shared)
    sub13 = Dense(20, activation='relu')(shared)
    sub14 = Dense(20, activation='relu')(shared)
    out1 = Dense(5, activation='softmax')(sub1)
    out2 = Dense(5, activation='softmax')(sub2)
    out3 = Dense(5, activation='softmax')(sub3)
    out4 = Dense(5, activation='softmax')(sub4)
    out5 = Dense(5, activation='softmax')(sub5)
    out6 = Dense(5, activation='softmax')(sub6)
    out7 = Dense(5, activation='softmax')(sub7)
    out8 = Dense(5, activation='softmax')(sub8)
    out9 = Dense(5, activation='softmax')(sub9)
    out10 = Dense(5, activation='softmax')(sub10)
    out11 = Dense(5, activation='softmax')(sub11)
    out12 = Dense(5, activation='softmax')(sub12)
    out13 = Dense(5, activation='softmax')(sub13)
    out14 = Dense(5, activation='softmax')(sub14)

    model = Model(input_data, outputs=[out1, out2, out3, out4, out5, out6, out7, out8, out9, out10, out11, out12, out13, out14])
    model.compile(loss=['categorical_crossentropy']*14, optimizer='rmsprop')

    return model

def mapFunction(vals):
    risks = [0.0, 0.11, 0.41, 0.61]
    vals_list = vals[0].tolist()

    return risks[vals_list.index(max(vals_list))]

""" Le funzioni getToken() e getDataFromAPI() servono per effettuare chiamate al server igcom remoto. """

def getToken():
    endpoint = 'http://37.148.227.52/semprevicini/token'
    payload = {
        'username': "Smartme",
        'password': "Smartme2019",
        'grant_type': "password"
    }

    r = requests.post(url=endpoint, data=payload)
    return json.loads(r.text)['access_token']

def getDataFromAPI(token):
    endpoint = 'http://37.148.227.52/semprevicini/api/healthRisk/FetchByProcessInstanceIds'
    payload = {
        'processInstanceIds': []
    }
    headers = {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
    }

    r = requests.post(url=endpoint, data=json.dumps(payload), headers=headers)

    return json.loads(r.text)

def getDataFromDB():
    """ Funzione per ottenere i dati dal server locale influxdb contenente le misurazioni dei pazienti. """

    ipDB = os.getenv('INFLUX_IP_AI', 'localhost')
    portDB = os.getenv('INFLUX_PORT_AI', '8086')
    userDB = os.getenv('INFLUX_USER_AI', 'admin')
    passwordDB = os.getenv('INFLUX_PW_AI', 'G10m1R0m3')
    nameDB = os.getenv('INFLUX_DB_AI', 'giomi')
    
    dr = DataRetriever(metrics)
    dfs = dr.loadDataFromDB(ipDB, portDB, userDB, passwordDB, nameDB)

    dp = DataProcessor(metrics, defaults)
    df = dp.applyPipeline(dfs)

    return df

# def evaluate(inputs, outputs, model):
#     Y_one_hots = []

#     for col in outputs.columns:
#         value = outputs[col].iloc[0]

#         for idx in range(0, 5):
#             if idx == value:
#                 Y_one_hots.append([1]*len(outputs))
#             else:
#                 Y_one_hots.append([0]*len(outputs))

#     # Y_one_hots = [np.array(pd.get_dummies(outputs[col])) for col in outputs.columns]
#     seq_one_hots = np.concatenate(Y_one_hots)
#     reshaped = np.reshape(seq_one_hots, (int(len(seq_one_hots)/len(Y_one_hots)), 14, 5), order='F')

#     seq_input = generate_input_sequence(3, inputs)
#     seq_input_array = np.concatenate(seq_input)
#     inputs = np.reshape(seq_input_array, (len(seq_input), 3, seq_input_array.shape[1]))
    
#     seq_output = generate_output_sequence(3, reshaped)
#     seq_output_array = np.concatenate(seq_output)
#     outputs = np.reshape(seq_output_array, (14, -1, 5), order='F')

#     ret = model.evaluate(inputs, [*outputs])
#     print(ret)

def train(inputs, outputs, model):
    Y_one_hots = []

    # Il for sottostante si occupa di effettuare una codifica one-hot dell'output.
    for col in outputs.columns:
        value = outputs[col].iloc[0]

        for idx in range(0, 5):
            if idx == value:
                Y_one_hots.append([1]*len(outputs))
            else:
                Y_one_hots.append([0]*len(outputs))

    # Y_one_hots = [np.array(pd.get_dummies(outputs[col])) for col in outputs.columns]
    seq_one_hots = np.concatenate(Y_one_hots) # Concatenazione degli array di output
    reshaped = np.reshape(seq_one_hots, (int(len(seq_one_hots)/len(Y_one_hots)), 14, 5), order='F') # Reshaping in 3D in modo tale da avere un formato di dati
                                                                                                    # conforme a quanto richiesto dalla libreria keras per le lstm

    # Generazione sequenza di ingresso e output e reshaping per avere formato conforme a quanto richiesto dalla libreria keras per gli input per lstm.
    seq_input = generate_input_sequence(3, inputs)
    seq_input_array = np.concatenate(seq_input)
    inputs = np.reshape(seq_input_array, (len(seq_input), 3, seq_input_array.shape[1]))

    seq_output = generate_output_sequence(3, reshaped)
    seq_output_array = np.concatenate(seq_output)
    outputs = np.reshape(seq_output_array, (14, -1, 5), order='F')

    model.fit(inputs, [*outputs], epochs=100) # Training della rete

def main(data: str, method: str):
    filePath = os.path.dirname(os.path.realpath(__file__))

    if method == 'predict': # Inferenza
        processInstanceId = data

        df = getDataFromDB()

        patientData = [d for d in getDataFromAPI(getToken()) if d['processInstanceId'] == processInstanceId] # Ottengo i dati del paziente dal server IGCOM

        if len(patientData) == 0: # Paziente non idoneo
            print('2')
            exit()

        # Ottengo le ultime 3 misurazioni del paziente selezionato.
        inputs = df[df['processInstanceId'] == processInstanceId]

        inputs = inputs[-3:]
        inputs = inputs[metrics]
         
        # Inserisco sesso e stile di vita del paziente (ottenuti dal server IGCOM) nel dataset di ingresso

        sexType = patientData[-1]['sexType']
        lifeStyle = patientData[-1]['lifeStyle']

        inputs.insert(0, 'sex', [sexType]*3)
        inputs.insert(0, 'lifestyle', [lifeStyle]*3)

        inputs = inputs.values.reshape(1, 3, 9)

        # try:
        with open(os.path.join(filePath, 'model.json'), 'r') as jsonFile: # Leggo il modello di rete neurale da filesystem
            readJson = jsonFile.read()
        
        model = model_from_json(readJson)
        model.load_weights(os.path.join(filePath, 'model.h5')) # Leggo i pesi della rete
        
        output = model.predict(inputs) # Inferenza

        toprint = []

        for arr in output:
            toprint.append(np.argmax(arr[0]))
        
        print({ "output": toprint})
        # except:
        #     print('1')

    elif method == 'train': # Training
        filename = data

        try: # Controllo se esiste già un modello di rete neurale presente, se non esiste lo creo da 0
            with open(os.path.join(filePath, 'model.json'), 'r') as jsonFile:
                readJson = jsonFile.read()
            
            model = model_from_json(readJson)
            model.compile(loss='categorical_crossentropy', optimizer='rmsprop', metrics=['accuracy'])
            model.load_weights(os.path.join(filePath, 'model.h5'))
            
        except:
            model = returnModel()

        if filename == 'online': # Se è necessario fare il training online (utilizzando le misurazioni effettaute dai pazienti)
            onlineData = getDataFromAPI(getToken()) # Ottengo i dati dal server IGCOM   
            df = getDataFromDB() # Ottengo le misurazioni dal server influxdb

            out = pd.DataFrame(columns=['processInstanceId'] + list(fromTypeIDToName.values()))

            # Creazione del dataset di training 

            for idx, risk in enumerate(onlineData):
                pid = risk['processInstanceId']
                typeID = risk['type']
                
                if out.isin([pid]).any().any():
                    out.loc[out['processInstanceId'] == pid, fromTypeIDToName[typeID]] = risk['level']
                else:
                    toAdd = list([0]*15)
                    toAdd[0] = risk['processInstanceId']
                    toAdd[risk['type']] = risk['level']

                    out.loc[idx] = toAdd
            
            merged = df.merge(out, how='left', on='processInstanceId').dropna().sort_values(['processInstanceId', 'time'])
            dfs = [merged[merged['processInstanceId'] == pid] for pid in merged['processInstanceId'].unique()]

            for df in dfs[:-4]:
                patientData = [d for d in getDataFromAPI(getToken()) if d['processInstanceId'] == df['processInstanceId'].iloc[0]]
                sexType = patientData[-1]['sexType']
                lifeStyle = patientData[-1]['lifeStyle']

                df.insert(2, 'sex', [sexType]*len(df))
                df.insert(2, 'lifestyle', [lifeStyle]*len(df))

                train(df[df.columns[2:11]], df[df.columns[11:]], model) # Training del modello
                with open(os.path.join(filePath, 'model.json'), 'w') as json_file: # Salvataggio del modello su file system
                    json_file.write(model.to_json())

                model.save_weights(os.path.join(filePath, 'model.h5')) # Salvataggio dei pesi del modello su file system
            # for df in dfs[-4:]:
            #     patientData = [d for d in getDataFromAPI(getToken()) if d['processInstanceId'] == df['processInstanceId'].iloc[0]]
            #     sexType = patientData[-1]['sexType']
            #     lifeStyle = patientData[-1]['lifeStyle']

            #     df.insert(2, 'sex', [sexType]*len(df))
            #     df.insert(2, 'lifestyle', [lifeStyle]*len(df))

            #     evaluate(df[df.columns[2:11]], df[df.columns[11:]], model)
        else:
            # Se il training viene effettuato da file csv

            data = pd.read_csv(os.path.join(filePath, filename), sep=';')
            inputs = data[data.columns[2:11]]
            outputs = data[data.columns[11:]]

            # Le operazioni sono analoghe al caso del training online
            
            Y_one_hots = [np.array(pd.get_dummies(outputs[col])) for col in outputs.columns]

            seq_one_hots = np.concatenate(Y_one_hots)
            reshaped = np.reshape(seq_one_hots, (int(len(seq_one_hots)/len(Y_one_hots)), 14, 5), order='F')

            seq_input = generate_input_sequence(3, inputs)
            seq_input_array = np.concatenate(seq_input)
            inputs = np.reshape(seq_input_array, (len(seq_input), 3, seq_input_array.shape[1]))

            seq_output = generate_output_sequence(3, reshaped)
            seq_output_array = np.concatenate(seq_output)
            outputs = np.reshape(seq_output_array, (14, -1, 5), order='F')

            model.fit(inputs, [*outputs], epochs=100)

            with open(os.path.join(filePath, 'model.json'), 'w') as json_file:
                json_file.write(model.to_json())

            model.save_weights(os.path.join(filePath, 'model.h5'))
            print('0')
        
if __name__ == '__main__':
    if len(sys.argv) != 3:
        print('Usage: python3 lstm.py <train|predict> <filename>|<processInstanceId>)')
        exit()
    
    # python3 lstm <train|load> 
    #                train: <filename>
    #                load: <processInstanceId>

    data = sys.argv[2]
    method = sys.argv[1]

    if method not in ['train', 'predict']:
        print('Usage: python3 lstm.py <train|predict> <filename>|<processInstanceId>)')
        exit()
    
    main(data, method)
