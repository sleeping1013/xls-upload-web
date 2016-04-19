#!/usr/bin/python
# -*- coding: utf-8 -*-

import xlrd
import json
import requests

url = 'http://googledrive.com/host/0ByYeZ5yUNKAwLUpqUEUxemVjUHc/SA900_3month2015-09-11.xls'

file = requests.get(url)

data = xlrd.open_workbook(file_contents=file.content)

table = data.sheets()[0] 

nrows = table.nrows
 
ncols = table.ncols

data = [];

for i in range(nrows):
    if i > 2:
        data.append(table.row_values(i))

print ("Access-Control-Allow-Origin: * ")
print ("Access-Control-Allow-Headers: X-CSRF-TOKEN ")
print ("Content-type: application/json\n")
print json.dumps(data)