const express = require("express");
const app = express();

const { getCategories } = require("./controllers/categories.controllers");

app.get("/api/categories/", getCategories);

//error handling

app.all("/*", (req, res) => {
	res.status(404).send({ msg: "Sorry, route not found :(" });
});
module.exports = app;
