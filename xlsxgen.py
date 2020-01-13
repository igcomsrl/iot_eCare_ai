from DataRetriever import DataRetriever
from datetime import datetime
import sys
from openpyxl import Workbook
import pandas as pd
import pytz

def main(processInstanceId: str, date1: datetime, date2: datetime):
    metrics = ['temperature', 'systolic', 'diastolic', 'pulse', 'spo2', 'weight']

    dr = DataRetriever(metrics)
    dfs = dr.loadDataFromDB('localhost', '8086', 'admin', 'G10m1R0m3', 'giomi')

    wb = Workbook()
    ws = wb.active

    for index, df in enumerate(dfs):
        ws.cell(index*3 + 2, 1, metrics[index])
        df['time'] = pd.to_datetime(df['time'])
        df = df[(df['time'] >= date1) & (df['time'] <= date2)]
        df = df[df['processInstanceId'] == processInstanceId]
        df.reset_index(inplace=True)

        for row, data in df.iterrows():
            ws.cell(index * 3 + 1, row + 2, datetime.strftime(data['time'], '%d-%m-%Y %H:%M:%S'))
            ws.cell(index * 3 + 2, row + 2, data[metrics[index]])

        for col in ws.iter_cols():
            ws.column_dimensions[col[0].column_letter].width = 23
    wb.save('out.xlsx')

if __name__ == '__main__':
    if len(sys.argv) != 4:
        print("Usage: python3 main.py <processInstanceId> <date1> <date2>\nDates should be given in the following format: dd-mm-aaaa")
        exit()
    
    processInstanceId = sys.argv[1]
    try:
        date1 = datetime.strptime(sys.argv[2], '%d-%m-%Y')
        date2 = datetime.strptime(sys.argv[3], '%d-%m-%Y')
    except ValueError:
        print("Dates should be given in the following format: dd-mm-aaaa")
        exit(1)

    timezone = pytz.timezone('UTC')
    date1 = timezone.localize(date1)
    date2 = timezone.localize(date2)

    main(processInstanceId, date1, date2)

    
