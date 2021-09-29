# Overview-API

## How to init
1. make sure mongodb is running with<br/>
  ```sudo service /etc/init.d/mongodb start```<br/>
  or<br/>
  ```sudo service mongodb start```<br/>

2. import csv files to mongodb using following commands below (products, features, styles, photos, skus)<br/>
  ```mongoimport -d <database_name> -c <collection_name> --type csv --file <csv_file.csv> --headerline```

3. Add indexes<br/>
  ```db.products.createIndex({ id:1 })```<br/>
  ```db.features.createIndex({ product_id:1 })```<br/>
  ```db.styles.createIndex({ id:1, productId:1 })```<br/>
  ```db.styles.createIndex({ id:1, productId:1 })```<br/>
  ```db.photos.createIndex({ styleId:1 })```<br/>
  ```db.skus.createIndex({ id:1, styleId:1 })```<br/>
  ```db.skus.createIndex({ id:1, styleId:1 })```<br/>

4. npm install && start the server<br/>
  ```npm i && npm start```

