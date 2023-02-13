const { Router } = require("express");
const { Sequelize } = require("sequelize");
const axios = require("axios").default;
const router = Router();
const fs = require("fs");
const moment = require("moment");

const sendContents = async (html, json, sku, country) => {
  const { data } = await axios.post(
    "",
    {
      parm: null,
      refactor: true
    }
  );
  return data;
};

const sendImages = async (images, sku, country) => {
  const { data } = await axios.post(
    "",
    {
      param: null
    }
  );
  return data;
};

const getBDI = async (sku, country) => {

  await axios.get('');
  const { data } = await axios.post(
    "",
    {
      parm: null,
    }
  );
  return data;
};

router.get("/getskus", async (req, res) => {
  const { sku, country } = req.query;
  const nowDate = moment().format("MM-DD-YYYY"); 
  
  fs.exists(`./src/json/${nowDate}/${sku}.json`, (exists) => {
    if (exists) {
      fs.readFile(
        "./src/json/" + nowDate + "/" + sku + ".json",
        async (err, data) => {
          
          if (err) throw err;
          const getBDIData = await getBDI(sku, country);
          
          let response = JSON.parse(data.toString());
          if (getBDIData[0].html && getBDIData[0].html !== '') {
            const res = await axios.get(getBDIData[0].html);
            getBDIData[0]["html"] = res.data;
          }

          response["agency"] = getBDIData;
          res.status(200).json(response);
        }
      );
    } else {
      res.status(200).json(null);
    }
  });
});

const verySku = async (item) => {
  const dataVery = await new Promise((resolve, reject) => {
    const nowDate = moment().format("MM-DD-YYYY");
    fs.exists(`./src/json/${nowDate}/${item}.json`, (exists) => {

      if (exists) {
        fs.readFile(`./src/json/${nowDate}/${item}.json`, (err, data) => {
          if (err) {
            reject(err); // in the case of error, control flow goes to the catch block with the error occured.
          } else {
            resolve(data); // in the case of success, control flow goes to the then block with the content of the file.
          }
        });
      } else {
        resolve({html:''});
      }

    });


  }).then((data) => {
      return JSON.parse(data.toString());
  }).catch((err) => {
      return null;
  });
  return dataVery?.html!==''|| dataVery.image?.length>0?item:null
}

router.get("/getjson", async (req, res) => { 
  fs.readFile("./data.json", (err, data) => {
      if (err) throw err;
      const skus = JSON.parse(data.toString());
      const promiAllList = skus.map((item) => verySku(item));
      Promise.all(promiAllList)
      .then((responses) => {
        const send = responses.filter((json) => json);
        res.status(200).json(send);
      });
  });
});

router.get("/putcontent", (req, res) => {
  const { sku, load, country } = req.query;
  const nowDate = moment().format("MM-DD-YYYY");
  fs.exists(`./src/json/${nowDate}/${sku}.json`, (exists) => {

    if (exists) {  
      fs.readFile("./src/json/"+nowDate+"/" + sku + ".json", async (err, data) => {    
        if (err) throw err;
        if (load === 'load') {
          const dataP = JSON.parse(data.toString());
          sendContents(dataP.html, dataP.json, sku, country);
          sendImages(dataP.image, sku, country);
        }
      });
    }

    fs.readFile("./data.json", (err, data) => {
      if (err) throw err;
      const skus = JSON.parse(data.toString());
      const promiAllList = skus.map((item) => verySku(item));
      Promise.all(promiAllList).then((responses) => {
        const send = responses.filter((json) => json && json !== sku);
        fs.writeFile(
          "./data.json",
          JSON.stringify(send),
          "utf8",
          function (err) {
            if (err) {
              return console.log("send", err);
            }
          }
        );
      });
    });
    res.status(200).json(true);    

  });
});

module.exports = router;