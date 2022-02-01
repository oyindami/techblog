const express = require("express");
const route = require("./controllers");
const sequelize = require("./config/connection");
const path = require("path");
const exphbs = require("express-handlebars");

const app = express();
const PORT = process.env.PORT || 3001;
const session = require("express-session");
const helpers = require("./utils/helpers");
const hbs = exphbs.create({ helpers });
const SequelizeStore = require("connect-session-sequelize")(session.Store);

// Session is setup so that it expires after 30 secs of no activity on the page. It's short only for testing purposes.
const sess = {
  secret: "Super secret secret",
  cookie: { maxAge: 30 * 1000 },
  resave: true,
  rolling: true,
  saveUninitialized: false,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

const hsb = exphbs.create({
  helpers: {
    format_date: (date) => {
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    },
  },
});

app.use(session(sess));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", hsb.engine);
app.set("view engine", "handlebars");

// to initilize the routes
app.use(route);

// to initilize the server adn the db
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log("App is now listening"));
});
