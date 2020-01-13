from sklearn.decomposition import PCA
import matplotlib
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d.axes3d import Axes3D
from sklearn.cluster import KMeans
import matplotlib.cm as cm
import numpy as np
import pandas as pd
from typing import List
from matplotlib.axes import Axes
import matplotlib.patches as mpatches

class DataAnalyzer:
    def __init__(self, n_components: int, metrics: List[str]):
        try:
            if n_components < 2 or n_components > 3:
                raise ValueError('n_components should be 2 or 3.')

            self.n_components = n_components
            self.metrics = metrics
            self.axis = ['x', 'y', 'z']
            self.cmap = self._getCM()

        except ValueError as e:
            print(e)
    
    def applyPCA(self, dataframe: pd.DataFrame):
        pca = PCA(n_components=self.n_components)
        fitted = pca.fit_transform(dataframe[self.metrics])

        dataframe[self.axis[:self.n_components]] = pd.DataFrame(fitted, index=dataframe.index)
    
    def applyKMeans(self, dataframe: pd.DataFrame, n_clusters: int) -> KMeans:
        kmeans = KMeans(n_clusters=n_clusters, random_state=42)
        kmeans.fit(dataframe[self.axis[:self.n_components]])

        return kmeans

    def _getCM(self):
        cmap = cm.jet
        cmaplist = [cmap(i) for i in range(cmap.N)]
        cmap = cmap.from_list('cmap', cmaplist, cmap.N)

        return cmap

    def plot(self, dataframe: pd.DataFrame, labels: List[int], centroids: List[List[float]], zoom = False):
        if self.n_components == 2:
            ax = plt.subplot(1, 1, 1)
            scat = ax.scatter(dataframe['x'], dataframe['y'], c=labels, cmap=self.cmap, label=labels)
        else:
            fig = plt.figure()
            ax = Axes3D(fig)
            scat = ax.scatter(dataframe['x'], dataframe['y'], dataframe['z'], c=labels, cmap=self.cmap, label=labels, alpha=0.3)

        # handle = list(scat.legend_elements())
        # handle.append(mpatches.Patch(color='black', label='Selected patient'))

        legend = ax.legend(*scat.legend_elements(), loc='upper right', title='Clusters')
        ax.add_artist(legend)

        # arr = np.arange(len(centroids))
        # ax.scatter(centroids[:, 0], centroids[:, 1], c=arr, cmap=self.cmap, marker='*', s=500, lw=1.5, edgecolor=(0, 0, 0, 1))
        # if (self.n_components == 2):

        if zoom is True:
            ax.set_xlim(-100000, 0)
            ax.set_ylim(-50, 150)

        ax.set_xticklabels([])
        ax.set_yticklabels([])
        if (self.n_components == 3):
            ax.set_zticklabels([])

        return ax, plt

    def addPatientPoint(self, dataframe: pd.DataFrame, ax: Axes, processInstanceId: str, lastOrKM: bool):
        #If lastOrKM is true it plots the cluster of all patient's data
        patientData = dataframe[dataframe['processInstanceId'] == processInstanceId]

        if lastOrKM:
            kmeansPatient = KMeans(n_clusters=1)
            kmeansPatient.fit(patientData[self.axis[:self.n_components]])
            pointToPlot = kmeansPatient.cluster_centers_[0]
        else:
            pointToPlot = patientData.tail(1)[self.axis[:self.n_components]].to_numpy()[0]

        if self.n_components == 2:
            ax.scatter(pointToPlot[0], pointToPlot[1], marker='*', c='black', s=450, label='Selected patient')
        else:
            ax.scatter(pointToPlot[0], pointToPlot[1], pointToPlot[2], marker='*', c='black', s=450, label='Selected patient')
        
        return pointToPlot

    

        



