let avatar  = require('./view.js');
let url     = new URL(window.location.href);
let address = url.searchParams.get("a");
if(address)
  avatar.view.load('viewer',address);
