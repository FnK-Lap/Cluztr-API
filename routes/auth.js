var jwt     = require('jwt-simple');
var request = require('request');
var async   = require('async');

var auth = {
    login: function(req, res) {
        var username        = req.body.username        || '';
        var password        = req.body.password        || '';
        var fb_access_token = req.body.fb_access_token || '';

        if (fb_access_token != '') {
            // Fire a query to your DB and check if the credentials are valid
            return auth.validateByFb(res, fb_access_token§);
        } else if (username != '' && password != '') {
            // TODO : Username and password authentication
            // Fire a query to your DB and check if the credentials are valid
            return auth.validate(res, username, password);
        } else {
            res.status(401);
            res.json({
                "status": 401,
                "message": "Invalid credentials"
            });
            
            return;
        }
    },

    validate: function(res, username, password) {
        // TODO : Get user in DB
        
        // spoofing the DB response for simplicity
        var dbUserObj = { // spoofing a userobject from the DB. 
            name: 'arvind',
            role: 'admin',
            username: 'arvind@myapp.com'
        };
 
        return dbUserObj;
    },

    validateByFb: function(res, fb_access_token) {
        async.series([
            function(callback){
                request.get('https://graph.facebook.com/v2.3/me?access_token=' + fb_access_token, function(err, response, data) {
                    if (response.statusCode != 200) {   // If errors, return status code and error message
                        callback({
                            "status": response.statusCode,
                            "message": response.statusMessage
                        }, null)
                    } else if (response.statusCode == 200) {
                        var parsedData = JSON.parse(data);

                        // Call the callback function if success
                        callback(null, {
                            "status": response.statusCode,
                            "user": {
                                "firstName": parsedData.first_name,
                                "lastName": parsedData.last_name,
                                "email": parsedData.email
                            }
                        })
                    };      
                })
            }
        ],
        function(errors, results) {
            if (errors) {
                res.status(errors.status);
                res.json({
                    "status": errors.status,
                    "message": errors.message
                });

                return;
            };

            // TODO : Find user in DB and return informations
            res.status(200);
            res.json({
                "status": results[0].status,
                "token": genToken(results[0].user)
            });

            return;
        });
    },
 
    validateUser: function(username) {
        // TODO : Get user in DB

        // spoofing the DB response for simplicity
        var dbUserObj = { // spoofing a userobject from the DB. 
            name: 'arvind',
            role: 'admin',
            username: 'arvind@myapp.com'
        };

        return dbUserObj;
    },
}
 
// private method
function genToken(user) {
    var expires = expiresIn(7); // 7 days
    var token   = jwt.encode({
        exp: expires
    }, require('../config/secret')());
  
    return {
        token: token,
        expires: expires,
        user: user
    };
}
 
function expiresIn(numDays) {
    var dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
}
 
module.exports = auth;