const CategoryModel = require("../models/CategoryModel")
const getCategory = (req, res) => {
    const name = req.body.name
    const insert = new CategoryModel({ name })

    insert.save()
        .then((item) => {
            res.json(item)
        })
        .catch((err) => {
            res.json(err)
        })
}

module.exports = {
    getCategory
}