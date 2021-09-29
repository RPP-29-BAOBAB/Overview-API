const express = require('express');
const db = require('./db/db');

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
  try {
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
            // { $limit: 1 }
          ]
        },
      },
      {
        $lookup: {
          from: "skus",
          let: { styleId: "$id" },
          as: "skus",
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

    if (!styles[0]) {
      throw new Error("didn't find any styles")
    }

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
      });
      style.skus = newSkus;
    });
    return styles;
  } catch (err) {
    return err
    // res.status(500).send({ err });
  }
}


app.get('/products', async (req, res) => {
  try {
    let page = Number(req.query.page) * 20 || 20;
    let count = Number(req.query.count) || 5;
    let products = await Product.find({
      id: {
        $gte: page - 20, $lte: page
      }
    }, { _id: 0, features: 0, styles: 0 })
      .limit(count)
      .exec();

    if (!products[0]) {
      throw new Error('invalid queries')
    } else {
      res.status(200).json(products);
    }
  } catch (err) {
    res.status(400).send();
  }
})

app.get(`/products/:product_id`, async (req, res) => {
  try {
    let productId = Number(req.params.product_id);
    let style = await getStyleInfo(productId);
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
    ]).exec();

    if (!product[0]) {
      throw new Error('product ID not found')
    } else {
      product[0].styles = style;
      res.json(product[0]);
    }
  } catch (err) {
    res.status(404).send();
  }
});

app.get('/products/:product_id/styles', async (req, res) => {
  try {
    let productId = Number(req.params.product_id);
    let styles = await getStyleInfo(productId)
    let result = {
      product_id: productId.toString(),
      results: styles
    };
    if (!styles[0]) {
      throw new Error('No styles associated with the product ID')
    } else {
      res.status(200).json(result);
    }
  } catch (err) {
    res.status(404).send();
  }
})

module.exports = app;
