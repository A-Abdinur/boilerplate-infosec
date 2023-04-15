const express = require('express');
const app = express();
const helmet = require('helmet')
app.use(helmet())
app.use(helmet.hidePoweredBy());
// Sets "X-Frame-Options: DENY"
app.use(
  helmet.frameguard({
    action: "deny",
  })
);
app.use(helmet.xssFilter());
app.use(helmet.noSniff());
app.use(helmet.ieNoOpen())
const timeinSeconds = 90 * 24 * 60 * 60
app.use(
  helmet.hsts({
    maxAge: timeinSeconds,
    force: true
  })
);
app.use(
  helmet.dnsPrefetchControl({
    allow: false,
  })
);
app.use(helmet.noCache())

// Sets "Content-Security-Policy: default-src 'self';script-src 'self' example.com;object-src 'none';upgrade-insecure-requests"
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: false,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "trusted-cdn.com"],
    },
  })
);

// app.use(helmet({
//   frameguard: {         // configure
//     action: 'deny'
//   },
//   contentSecurityPolicy: {    // enable and configure
//     directives: {
//       defaultSrc: ["'self'"],
//       styleSrc: ['style.com'],
//     }
//   },
//   dnsPrefetchControl: false     // disable
// }))





module.exports = app;
const api = require('./server.js');
app.use(express.static('public'));
app.disable('strict-transport-security');
app.use('/_api', api);
app.get("/", function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Your app is listening on port ${port}`);
});
