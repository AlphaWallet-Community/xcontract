let express = require('express');
let router = express.Router();
let knexConfig = require('../knex/knexfile');
let knex = require('knex')(knexConfig[process.env.NODE_ENV || "development"]);

router.get("/search", (req,res,next) =>
{
    res.render('search', {
        searchResults: ""
    });
});

router.get("/search/:dappName", (req,res,next) =>
{
    let arrayOfResultObjects = [];
    let dappName = req.params.dappName;
    knex("dapptable").select().where("dappName" , "LIKE", "%" + dappName + "%").then( (data) =>
    {
        if(data == [])
        {
            res.render('search', {
                searchResults : "No dApps found"
            });
            return;
        }
        for(let result of data)
        {
            console.log("dApps found");
            let resultObj = {};
            resultObj.dAppName = result.dappName;
            resultObj.contractAddress = result.contractAddress;
            arrayOfResultObjects.push(resultObj);
        }

        res.render('search', {
            searchResults : arrayOfResultObjects
        });

    })
    .catch((err) => {
        if(err) throw err;
    });
});

module.exports = router;