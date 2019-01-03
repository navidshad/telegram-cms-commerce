# telegram-cms-commerce
this is a commerce module for Telegram-CMS package on NPM.

##use
```
const tcms = require('telegram-cms');

const option = {
  // see telegram-cms readme
};
// start bot
tcms.start(option);

// add commerce
let commerce = require('../telegram-cms-commerce/index');
commerce.startServer(1000);
tcms.addModule(commerce.module);
```
