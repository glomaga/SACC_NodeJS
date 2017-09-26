/*
GLORIA GALLEGO
MWA FINAL PROJECT
25-09-2017
*/

var express = require('express');
var router = express.Router();
var util = require("util");
var mongodb = require('mongodb');


//=========================================================LIST OPTIONS=====================================//
//==========================================================================================================//


//=================1.GET LIST OF ANIMALS=====================//
router.get('/animals', function (req, res, next) {
    let db = req.app.locals.db;
    db.collection("animal").find({}).toArray(function (err, docsArr) {
        res.json(docsArr);
    });
});


//=================2.GET ANIMAL BY ID =====================//
router.get('/animal/:id', function (req, res, next) {
    var id = req.params.id;
    var query = { _id: new mongodb.ObjectID(id) };
    let db = req.app.locals.db;
    db.collection('animal').findOne(query, function (err, values) {
        res.json(values);
    });
});

//=======================================================INSERT OPTIONS=====================================//
//==========================================================================================================//

//=================3.INSERT ANIMAL=====================//
router.post('/animal', function (req, res, next) {
    let db = req.app.locals.db;
    console.log("save new values");
    var errors = "";
    if (req.body.an_name.length === 0 || req.body.an_name == null) {
        errors = errors + "an_name is required";
    }
    if (req.body.an_gender.length === 0 || req.body.an_gender == null) {
        errors = errors + "\n" + "an_gender is required";
    }
    if (errors.length > 0) {
        res.sendStatus(400);
        res.end(errors);
    } else {
        let animal = ProcessAnimalBody(req, "insert");
        console.log("data to save" + animal);

        db.collection('animal').save(animal, (err, result) => {
            if (err) return console.log(err)
            res.sendStatus(200);
            res.end("'saved to database'");
        });
    }
}
);


//=================4.INSERT DEWORM=====================//
router.post('/animal/deworm/:id', function (req, res) {
    let db = req.app.locals.db;
    console.log("insert deworm values");
    id = req.params.id;
    var query = { "_id": new mongodb.ObjectID(id) };
    console.log("id" + util.inspect(query));

    let deworm = {
        "de_id": new mongodb.ObjectID(),
        "de_date": new Date(req.body.de_date),
        "de_name": req.body.de_name,
        "de_doctor": req.body.de_doctor
    }

    var operator = { $push: { 'an_deworm': deworm } };
    console.log("operator" + util.inspect(operator));
    db.collection('animal').update(query, operator, (err, result) => {
        if (err) return console.log(err)
        res.sendStatus(200);
        res.end("'updated to database'");
    });
});

//=================5.INSERT VACCINE=====================//
router.post('/animal/vaccine/:id', function (req, res) {
    let db = req.app.locals.db;
    console.log("insert vaccine values");
    id = req.params.id;
    var query = { "_id": new mongodb.ObjectID(id) };
    console.log("id" + util.inspect(query));

    let vaccine = {
        "va_id": new mongodb.ObjectID(),
        "va_date": new Date(req.body.va_date),
        "va_name": req.body.va_name,
        "va_batch": req.body.va_batch,
        "va_doctor": req.body.va_doctor
    }
    var operator = { $push: { 'an_vaccine': vaccine } };
    console.log("operator" + util.inspect(operator));
    db.collection('animal').update(query, operator, (err, result) => {
        if (err) return console.log(err)
        res.sendStatus(200);
        res.end("'updated to database'");
    });
});


//=================6.INSERT MICRICHIP=====================//
router.post('/animal/microchip/:id', function (req, res) {
    let db = req.app.locals.db;
    console.log("insert microchip values");
    id = req.params.id;
    var query = { "_id": new mongodb.ObjectID(id) };
    console.log("id" + util.inspect(query));

    let microchip = {
        "mr_id": new mongodb.ObjectID(),
        "mr_date": new Date(req.body.mr_date),
        "mr_description": req.body.mr_description,
        "mr_implantsite": req.body.mr_implantsite,
        "mr_brand": req.body.mr_brand,
        "mr_doctor": req.body.mr_doctor
    }
    var operator = { $push: { 'an_microchip': microchip } };
    console.log("operator" + util.inspect(operator));
    db.collection('animal').update(query, operator, (err, result) => {
        if (err) return console.log(err)
        res.sendStatus(200);
        res.end("'updated to database'");
    });
});

//=========================================================UPDATE OPTIONS===================================//
//==========================================================================================================//

//=================7.UPDATE ANIMAL=====================//
router.put('/animal/:id', function (req, res) {
    let db = req.app.locals.db;
    console.log("update values");
    id = req.params.id;
    var query = { "_id": new mongodb.ObjectID(id) };
    console.log("id" + util.inspect(query));
    let animal = ProcessAnimalBody(req, "update");
    var operator = { '$set': animal };
    console.log("operator" + util.inspect(operator));
    db.collection('animal').update(query, operator, (err, result) => {
        if (err) return console.log(err)
        console.log("result: " + result);
        res.sendStatus(200);
        res.end("'updated to database'");
    });
});


//=================8.UPDATE DEWORM=====================//
router.put('/animal/deworm/:id', function (req, res) {
    let db = req.app.locals.db;
    console.log("update deworm values");
    id = req.params.id;
    var query = { "_id": new mongodb.ObjectID(id), "an_deworm.de_id": new mongodb.ObjectID(req.body.de_id) };
    console.log("id" + util.inspect(query));

    let vaccine = {
        "an_deworm.$.de_date": new Date(req.body.de_date),
        "an_deworm.$.de_name": req.body.de_name,
        "an_deworm.$.de_doctor": req.body.de_doctor
    }
    var operator = { $set: vaccine };

    console.log("operator" + util.inspect(operator));
    db.collection('animal').update(query, operator, (err, result) => {
        if (err) return console.log(err)
        res.sendStatus(200);
        res.end("'updated to database'");
    });
});

//=================9.UPDATE VACCINE=====================//
router.put('/animal/vaccine/:id', function (req, res) {
    let db = req.app.locals.db;
    console.log("update vaccine values");
    id = req.params.id;
    var query = { "_id": new mongodb.ObjectID(id), "an_vaccine.va_id": new mongodb.ObjectID(req.body.va_id) };
    console.log("id" + util.inspect(query));

    let vaccine = {
        "an_vaccine.$.va_date": new Date(req.body.va_date),
        "an_vaccine.$.va_name": req.body.va_name,
        "an_vaccine.$.va_batch": req.body.va_batch,
        "an_vaccine.$.va_doctor": req.body.va_doctor
    }
    var operator = { $set: vaccine };

    console.log("operator" + util.inspect(operator));
    db.collection('animal').update(query, operator, (err, result) => {
        if (err) return console.log(err)
        res.sendStatus(200);
        res.end("'updated to database'");
    });
});

//=================10.UPDATE MICRICHIP=====================//
router.put('/animal/microchip/:id', function (req, res) {
    let db = req.app.locals.db;
    console.log("update microchip values");
    id = req.params.id;
    var query = { "_id": new mongodb.ObjectID(id), "an_microchip.mr_id": new mongodb.ObjectID(req.body.mr_id) };
    console.log("id" + util.inspect(query));

    let microchip = {
        "an_microchip.$.mr_date": new Date(req.body.mr_date),
        "an_microchip.$.mr_description": req.body.mr_description,
        "an_microchip.$.mr_implantsite": req.body.mr_implantsite,
        "an_microchip.$.mr_brand": req.body.mr_brand,
        "an_microchip.$.mr_doctor": req.body.mr_doctor
    }
    var operator = { $set: microchip };

    console.log("operator" + util.inspect(operator));
    db.collection('animal').update(query, operator, (err, result) => {
        if (err) return console.log(err)
        res.sendStatus(200);
        res.end("'updated to database'");
    });
});

//=========================================================DELETE OPTIONS===================================//
//==========================================================================================================//

//=================11.DELETE ANIMAL=====================//
router.delete('/animal/:id', function (req, res) {
    let db = req.app.locals.db;

    console.log("delete values");
    id = req.params.id;
    var query = { "_id": new mongodb.ObjectID(id) };
    console.log("id" + util.inspect(query));
    db.collection("animal").remove(query, (err, result) => {
        if (err) return console.log(err)
        res.sendStatus(200);
        res.end("'deleted to database'");
    });
});
//=================12.DELETE VACCINE=====================//
router.delete('/animal/vaccine/:id', function (req, res) {
    let db = req.app.locals.db;
    console.log("delete vaccine values");
    id = req.params.id;
    var query = { "_id": new mongodb.ObjectID(id) };
    console.log("id" + util.inspect(query));

    var operator = { $pull: { "an_vaccine": { "va_id": new mongodb.ObjectID(req.body.va_id) } } };

    console.log("operator" + util.inspect(operator));
    db.collection('animal').update(query, operator, (err, result) => {
        if (err) return console.log(err)
        res.sendStatus(200);
        res.end("'updated to database'");
    });
});
//=================13.DELETE DEWORM=====================//
router.delete('/animal/deworm/:id', function (req, res) {
    let db = req.app.locals.db;
    console.log("delete deworm values");
    id = req.params.id;
    var query = { "_id": new mongodb.ObjectID(id) };
    console.log("id" + util.inspect(query));

    var operator = { $pull: { "an_deworm": { "de_id": new mongodb.ObjectID(req.body.de_id) } } };

    console.log("operator" + util.inspect(operator));
    db.collection('animal').update(query, operator, (err, result) => {
        if (err) return console.log(err)
        res.sendStatus(200);
        res.end("'updated to database'");
    });
});

//=================14.DELETE MICRICHIP=====================//
router.delete('/animal/microchip/:id', function (req, res) {
    let db = req.app.locals.db;
    console.log("delete microchip values");
    id = req.params.id;
    var query = { "_id": new mongodb.ObjectID(id) };
    console.log("id" + util.inspect(query));

    var operator = { $pull: { "an_microchip": { "mr_id": new mongodb.ObjectID(req.body.mr_id) } } };

    console.log("operator" + util.inspect(operator));
    db.collection('animal').update(query, operator, (err, result) => {
        if (err) return console.log(err)
        res.sendStatus(200);
        res.end("'updated to database'");
    });
});

//=========================================================HELPER METHODS===================================//
//==========================================================================================================//
function ProcessAnimalBody(req, type) {
    let animal;
    if (type == "insert") {
        animal = {
            "an_name": req.body.an_name,
            "an_gender": req.body.gender,
            "an_neutered": req.body.an_neutered,
            "an_birth": new Date(req.body.an_birth),
            "an_color": req.body.an_color,
            "an_deceased": req.body.an_deceased == null ? null : new Date(req.body.an_deceased),
            "an_status": true,
            "an_createdate": new Date(),
            "an_specie": req.body.an_specie,
            "an_breed": req.body.an_breed,
            "an_owner": req.body.an_owner,
            "an_deworm": req.body.an_deworm,
            "an_vaccine": req.body.an_vaccine,
            "an_microchip": req.body.microchip
        }
    }
    if (type == "update") {
        animal = {
            "an_name": req.body.an_name,
            "an_gender": req.body.gender,
            "an_neutered": req.body.an_neutered,
            "an_birth": new Date(req.body.an_birth),
            "an_color": req.body.an_color,
            "an_deceased": req.body.an_deceased == null ? null : new Date(req.body.an_deceased),
            "an_status": true,
            "an_specie": req.body.an_specie,
            "an_breed": req.body.an_breed,
            "an_owner": req.body.an_owner,
            "an_deworm": req.body.an_deworm,
            "an_vaccine": req.body.an_vaccine,
            "an_microchip": req.body.microchip
        }
    }

    //change date string to DATE and Generata ID
    animal.an_deworm.forEach(function (value) {
        let temp = value.de_date;
        value.de_date = new Date(temp);
        value.de_id = new mongodb.ObjectID();
    });
    //change date string to DATE and Generata ID
    animal.an_vaccine.forEach(function (value) {
        let temp = value.va_date;
        value.va_date = new Date(temp);
        value.va_id = new mongodb.ObjectID();
    });

    //change date string to DATE and Generata ID
    animal.an_microchip.forEach(function (value) {
        let temp = value.mr_date;
        value.mr_date = new Date(temp);
        value.mr_id = new mongodb.ObjectID();
    });

    return animal;
};

module.exports = router;