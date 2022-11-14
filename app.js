const express = require("express");
const app = express();

const { getCategories } = require("./controllers/categories.controllers");

app.get("/api/categories/", getCategories);

//error handling

const {
	handleCustomErrors,
	handlePsqlErrors,
	handleServerErrors,
} = require("./errors/index");

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);
app.all("/*", (req, res) => {
	res.status(404).send({ msg: "Sorry, route not found :(" });
});
module.exports = app;
