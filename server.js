//npm install connect serve-static

var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic(__dirname)).listen(8080, function(){
        console.log('Servidor rodando na porta 8080...');
});