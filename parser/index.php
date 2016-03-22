<?php

require __DIR__ . '/excel-reader.php';

// $file = __DIR__ . '/../SA900 _3month2015-09-11.xls';
$url = 'http://googledrive.com/host/0ByYeZ5yUNKAwLUpqUEUxemVjUHc/SA900_3month2015-09-11.xls';
$data = new Spreadsheet_Excel_Reader($url);

$stringArray = $data->sheets[0]['cells'];
$rawArray = $data->sheets[0]['cellsInfo'];

$data = array();

/*function remapKeys($ref, $oldname, $newname)
{
  $indecies = array();
  foreach ($ref as $key => $value) {
    foreach ($oldname as $nameToFind) {
      if($value == $nameToFind) {
        $indecies[] = $key;
      }
    }
  }
  $result = array();
  foreach ($indecies as $key => $index) {
    $result[$newname[$key]] = $index;
  }
  return $result;
}

$newKeyIndex;*/

foreach ($rawArray as $index => $Row)
{
/*  if($index == 4) {
    $newKeyIndex = remapKeys($Row, ['统计日期', '访客数'], ['date', 'visits']);
  }*/
  
  if($index > 4) {
    
    $parsed = array(
      'date' => $stringArray[$index]['1'],
      'visits' => $Row['2']['raw']
    );
    $data[] = $parsed;
  }
}
header("Content-type: application/json; charset=utf-8");

echo json_encode($data);
