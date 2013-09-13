var https = require('https'),
    redis = require("redis"),
    client = redis.createClient();

exports.askYoda = function (req, res, next) {
    client.get(req.query.sentence, function (err, reply) {
        if (reply) {
            req.yodaSays = reply;
            return next();
        }
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
            var yodaSays = "";
            response.on('data', function (data) {
                if (data) yodaSays += data;
            });
            response.on('end', function (data) {
                if (data) yodaSays += data;
                req.yodaSays = yodaSays;
                client.set(req.query.sentence, yodaSays);
                // cache result for 30 seconds
                client.expire(req.query.sentence, 30);
                return next();
            });
        }).end();
    });
};
