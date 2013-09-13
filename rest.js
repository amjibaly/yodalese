var https = require('https');

exports.askYoda = function (req, res, next) {
    var options = {
        hostname: 'yoda.p.mashape.com',
        port: 443,
        path: '/yoda?sentence=' + encodeURIComponent(req.query.sentence),
        method: 'GET',
        headers: {
            'X-Mashape-Authorization': process.env.MASHAPE_AUTH
        }
    };
    https.request(options, function (response) {
        var yodaSays = "ha: ";
        response.on('data', function (data) {
            if (data) yodaSays += data;
        });
        response.on('end', function (data) {
            if (data) yodaSays += data;
            req.yodaSays = yodaSays;
            return next();
        });
    }).end();
};
