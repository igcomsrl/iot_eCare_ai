import json
import os
import sys

import numpy as np

from DataAnalyzer import DataAnalyzer
from DataProcessor import DataProcessor
from DataRetriever import DataRetriever


def main(n_dimensions: int, n_clusters: int, processInstanceId: str, method: str):
    metrics = ['temperature', 'systolic', 'diastolic', 'pulse', 'spo2', 'weight']
    defaults = [36, 115, 75, 75, 98, 75]

    ipDB = os.getenv('INFLUX_IP_AI', 'localhost')
    portDB = os.getenv('INFLUX_PORT_AI', '8086')
    userDB = os.getenv('INFLUX_USER_AI', 'admin')
    passwordDB = os.getenv('INFLUX_PW_AI', 'G10m1R0m3')
    nameDB = os.getenv('INFLUX_DB_AI', 'giomi')
    
    dr = DataRetriever(metrics)
    dfs = dr.loadDataFromDB(ipDB, portDB, userDB, passwordDB, nameDB)

    dp = DataProcessor(metrics, defaults)
    df = dp.applyPipeline(dfs)

    da = DataAnalyzer(n_dimensions, metrics)
    da.applyPCA(df)
    kmeans = da.applyKMeans(df, n_clusters)

    ax, plt = da.plot(df, kmeans.labels_, kmeans.cluster_centers_)

    method = True if method == 'cluster' else False

    point = da.addPatientPoint(df, ax, processInstanceId, method)

    plt.savefig('/tmp/out.png')

    da2 = DataAnalyzer(n_dimensions, metrics)
    da2.applyPCA(df)
    kmeans2 = da2.applyKMeans(df, n_clusters)

    ax2, plt2 = da2.plot(df, kmeans2.labels_, kmeans2.cluster_centers_, zoom=True)

    method = True if method == 'cluster' else False

    point2 = da2.addPatientPoint(df, ax2, processInstanceId, method)
    # da.addAllPatientPoints(df, ax, processInstanceId)
    #distance = kmeans.transform(point.reshape(1, -1))
    #normalizedDistance = (distance / np.linalg.norm(distance, ord=2, axis=1, keepdims=True))[0]
    # out = {
    #     "distances": normalizedDistance.tolist()
    # }

    #print(json.dumps(out))

    plt2.savefig('/tmp/out2.png')
    print("Eseguito con successo")

if __name__ == '__main__':
    if len(sys.argv) != 5:
        print("Usage: python3 main.py <n_dimensions> <n_clusters> <processInstanceId> <method>")
        exit()
    
    n_dimensions = int(sys.argv[1])
    n_clusters = int(sys.argv[2])
    processInstanceId = sys.argv[3]
    method = sys.argv[4]

    if n_dimensions not in [2,3]:
        print("n_dimensions should be 2 or 3")
    elif n_clusters < 1:
        print("n_clusters should be at least 1")
    elif method not in ['cluster', 'last']:
        print("methods accepted: cluster, last")
    else:
        main(n_dimensions, n_clusters, processInstanceId, method)
