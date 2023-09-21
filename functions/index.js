const functions = require("firebase-functions");
const express = require("express");
const { ngExpressEngine } = require("@nguniversal/express-engine");
const { provideModuleMap } = require("@nguniversal/module-map-ngfactory-loader");

const app = express();

// Angular Universal yapılandırması
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require("./dist/client-angular/server/main");
const { renderModuleFactory } = require("@angular/platform-server");

// Angular Universal işlevi
app.engine(
  "html",
  ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
    providers: [provideModuleMap(LAZY_MODULE_MAP)],
  })
);

app.set("view engine", "html");
app.set("views", __dirname + "/dist/client-angular");

app.get("**", (req, res) => {
  res.render("index", { req, res });
});

// Firebase Cloud Function oluşturma
exports.app = functions.https.onRequest(app);
