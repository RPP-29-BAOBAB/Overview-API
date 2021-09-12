# Overview-API

# How to init
1. make sure mongodb is running
  `sudo services /etc/init.d/mongodb start`

2. import csv files to mongodb using following commands below (product, features, styles, photos, skus)
`mongoimport -d <database_name> -c <collection_name> --type csv --file <csv_file.csv> --headerline`

