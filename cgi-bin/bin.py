#!/bin/python
# -*- coding: utf-8 -*-

import xlrd
import json

data = xlrd.open_workbook('data.xls')

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