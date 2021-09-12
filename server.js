const express = require('express');
const mongoose = require('mongoose');

// db connection
mongoose.connect('mongodb://localhost:27017/productAPI');
const db = mongoose.connection;

db.once('open', () => {
  console.log('Connected to MongoDB');
});

db.on('error', (err) => {
  console.log(err);
});

// Init App
const app = express();

// Middleware
app.use(express.json());

//Bring in models
const Product = require('./db/models/productModel');
const Style = require('./db/models/styleModel');
const Photo = require('./db/models/photoModel');

// get style data with photos and skus
const getStyleInfo = async function (productId) {
  let styles = await Style.aggregate([
    { $match: { productId: productId } },
    {
      $lookup: {
        from: "photos",
        let: { styleId: "$id" },
        as: "photos",
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$styleId', '$$styleId'] }
            }
          },
          { $limit: 1 }
        ]
      },
    },
    {
      $lookup:
      {
        from: "skus", let: { styleId: "$id" }, as: "skus",
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$styleId', '$$styleId'] }
            }
          },
          { $sort: { id: 1 } }
        ]
      }
    },
    {
      $project: {
        "style_id": "$id",
        "name": "$name",
        "original_price": "$original_price",
        "sale_price": "$sale_price",
        "default?": "$default_style",
        "photos": "$photos",
        "skus": "$skus"
      }
    },
    {
      $project: {
        "_id": 0,
        "productId": 0,
        "photos._id": 0,
        "photos.id": 0,
        "photos.styleId": 0,
        "skus._id": 0,
        "skus.styleId": 0
      }
    }
  ]).exec();
  // reconstruct skus within styles
  styles.map(style => {
    const newSkus = {}
    let skus = style.skus
    skus.map(sku => {
      let skuId = sku.id
      newSkus[skuId] = {
        size: sku.size,
        quantity: sku.quantity,
      }
    })
    style.skus = newSkus
  })

  return styles
}

app.get('/products', async (req, res) => {
  let page = Number(req.query.page) * 20 || 20;
  let count = Number(req.query.count) || 5;

  let products = await Product.find({
    id: {
      $gte: page - 20, $lte: page
    }
  }, { _id: 0, features: 0, styles: 0 })
    .limit(count)
    .exec()

  console.log(products)
  res.status(200).json(products)

})

app.get(`/products/:product_id`, async (req, res) => {
  let productId = Number(req.params.product_id)

  let style = await getStyleInfo(productId)

  let product = await Product.aggregate([
    { $match: { id: productId } },
    {
      $lookup:
        { from: "features", localField: "id", foreignField: "product_id", as: "features" }
    },
    {
      $project:
        { "_id": 0, "features._id": 0, "features.product_id": 0 }
    }
  ]).exec()
  product[0].styles = style
  res.json(product[0])
});

app.get('/products/:product_id/styles', async (req, res) => {
  let productId = Number(req.params.product_id)

  let styles = await getStyleInfo(productId)

  let result = {
    product_id: productId.toString(),
    results: styles
  }

  // res.json(result.results)
  // console.log(result)
  res.json(result)
})




app.listen('3001', () => {
  console.log('listening on port 3001');
});

module.exports = server;