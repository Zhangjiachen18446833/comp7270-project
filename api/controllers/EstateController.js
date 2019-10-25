/**
 * EstateController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

//Estate.sendNativeQuery(query)
module.exports = {

    index: async function (req, res) {
        var models = await Estate.find().sort('updatedAt');
        models = models.reverse().slice(0,4);
        console.log(models)
        return res.view('estate/index', { estates: models });
    },

    create: async function (req, res) {
        if (req.method == 'GET') {
            return res.view('estate/create');
        }

        console.log(req.body);

        if (!req.body.Estate) {
            return res.badRequest('Form-data not received.');
        }

        await Estate.create(req.body.Estate);

        return res.redirect('/');
    },

    search: async function (req, res) {
        if (req.method == 'GET') {
            return res.view('estate/search');
        }

        if (!req.body.Estate) {
            return res.json('Form-data not received.');
        }

        var model = await Estate.find({where: req.body.Estate});

        return res.json(model);
    },

    admin: async function (req, res) {
        var models = await Estate.find({});
        console.log(models);
        return res.view('estate/admin', { estates: models });
    },

    edit: async function (req, res) {
        if (req.method == 'GET') {

            var model = await Estate.findOne(req.params);
            if (!model) {
                return res.notFound();
            }
            return res.json(model);
        }

        if (!req.body.Estate) {
            return res.badRequest('Form-data not received.');
        }

        var models = await Estate.update(req.params).set({
            title: req.body.Estate.title,
            imageurl: req.body.Estate.imageurl,
            estate: req.body.Estate.estate,
            bedrooms: req.body.Estate.bedrooms,
            area: req.body.Estate.area,
            tenants: req.body.Estate.tenants,
            rent: req.body.Estate.rent,
            isHighlight: req.body.Estate.isHighlight,
        }).fetch();

        console.log(models);

        if (models.length == 0) {
            return res.notFound();
        }
        return res.redirect('/estate/admin');
    },

    delete: async function (req, res) {
        console.log(req.params);

        await Estate.destroy(req.params);

        return res.redirect('/estate/admin');
    },
};

