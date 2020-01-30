import pandas as pd
from typing import List
import datetime

class DataProcessor:
    def __init__(self, metrics: List[str], defaults: List[float]):
        self.metrics = metrics
        self.defaults = defaults

    def _removeColumns(self, dataframes: List[pd.DataFrame]) -> List[pd.DataFrame]:
        """ Funzione che rimuove le colonne aggiuntive ritornate dalla query al database influx. """

        toRet = []

        for dataframe, metric in zip(dataframes, self.metrics):
            dataframe.rename(columns={ 'Unnamed: 0': 'time' }, inplace=True)

            toRet.append(dataframe[['time', 'processInstanceId', metric]])
        
        return toRet

    def _modifyTimestamp(self, dataframes: List[pd.DataFrame]) -> List[pd.DataFrame]:
        """ Funzione che modifica il timestamp di ogni misurazione in slot di tempo per facilitare i controlli seguenti"""

        toRet = []

        for dataframe in dataframes:
            for i in range(len(dataframe.index)):
                timeData = dataframe['time'][i][:16]
                
                timeObj = datetime.datetime.strptime(timeData, "%Y-%m-%d %H:%M")
                
                dataframe.at[i, 'time'] = timeObj.replace(minute=timeObj.minute//15).strftime("%Y-%m-%d %H:%M:%S")
            
            toRet.append(dataframe)
        
        return toRet

    def _collapseData(self, dataframes: List[pd.DataFrame]) -> List[pd.DataFrame]:
        """ Funzione che raggruppa i dati per processInstanceId e per slot di tempo """

        toRet = []

        for dataframe in dataframes:
            dataframe = dataframe.groupby(['processInstanceId', 'time']).mean()
            dataframe = dataframe.reset_index()

            toRet.append(dataframe)

        return toRet

    def _joinData(self, dataframes: List[pd.DataFrame]) -> pd.DataFrame:
        """ Funzione che esegue il join tra le misurazioni delle diverse metriche basandosi sullo slot di tempo e sul processInstanceId """

        df = dataframes[0]

        for i in range(1, len(dataframes)):
            df = pd.merge(df, dataframes[i], how='outer', left_on=['time', 'processInstanceId'], right_on=['time', 'processInstanceId'])

        return df

    def _fillNaNs(self, df: pd.DataFrame) -> pd.DataFrame:
        """ Funzione che sovrascrive i valori non presenti all'interno del database """

        sorted = df.sort_values('time')
        grouped = sorted.groupby('processInstanceId')
        forwardFilled = grouped.ffill() # Provo a sovrascrivere i valori non presenti con l'ultima misurazione della corrispettiva metrica
        forwardFilled['processInstanceId'] = sorted['processInstanceId']
        beforeFilled = forwardFilled.groupby(['processInstanceId']).bfill() # provo a sovrascrivere i valori non presenti con la prossima misurazione della corrispettiva metrica
        beforeFilled['processInstanceId'] = sorted['processInstanceId']

        for metric, default in zip(self.metrics, self.defaults): # se in entrambi i precedenti casi non sono riuscito a sostituire i dati mancanti allora sovrascrivo con valori di default
            beforeFilled['{}'.format(metric)].fillna(default, inplace=True)

        return beforeFilled

    def applyPipeline(self, dataframes: List[pd.DataFrame]) -> pd.DataFrame:
        """ Applica tutte le funzioni precedentemente definite in cascata. """
        
        return self._fillNaNs(
            self._joinData(
                self._collapseData(
                    self._modifyTimestamp(
                        self._removeColumns(dataframes)))))
