import pandas as pd
from influxdb import DataFrameClient
from typing import List

class DataRetriever:
    def __init__(self, metrics: List[str]):
        self.metrics = metrics

    def _connect(self, host: str, port: str, user: str, password: str, dbname: str) -> DataFrameClient:
        # host = 'localhost'
        # port = '8086'
        # user = 'admin'
        # password = 'G10m1R0m3'
        # dbname = 'giomi'
    
        cl = DataFrameClient(host, port, user, password, dbname)
        return cl

    def _getFromDB(self, client: DataFrameClient, metric: str) -> pd.DataFrame:
        toRet = client.query("select * from " + metric)
        toRet = pd.DataFrame(toRet[metric])
        
        return toRet

    def loadDataFromDB(self, host:str, port:str, user:str, password:str, dbname:str) -> List[pd.DataFrame]:
        client = self._connect(host, port, user, password, dbname)

        toRet = []
        
        for metric in self.metrics:
            df = self._getFromDB(client, metric)
            df = df.reset_index()
            df = df.rename(columns={'index': 'time'})
            df['time'] = df['time'].astype(str)
            df['processInstanceId'] = df['processInstanceId'].astype(str)
            toRet.append(df)

        return toRet
        

    def loadDataFromFs(self, path='data') -> List[pd.DataFrame]:
        toRet = []

        for metric in self.metrics:
            toRet.append(pd.read_csv('{}/{}.csv'.format(path, metric)))

        return toRet

