var jwt     = require('jwt-simple');
var request = require('request');
var async   = require('async');
var User    = require('../model/userModel');
var Group   = require('../model/groupModel');
var Picture = require('../model/pictureModel');

var auth = {
    login: function(req, res) {
        var username        = req.body.username        || '';
        var password        = req.body.password        || '';
        var fb_access_token = req.body.fb_access_token || '';

        if (fb_access_token != '') {
            // Fire a query to your DB and check if the credentials are valid
            return auth.validateByFb(res, fb_access_token);
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
                request.get('https://graph.facebook.com/v2.3/me?fields=email,birthday,first_name,last_name,gender,picture{url}&access_token=' + fb_access_token, function(err, response, data) {
                    if (response.statusCode != 200) {   // If errors, return status code and error message
                        callback({
                            "status": response.statusCode,
                            "message": response.statusMessage
                        }, null)
                    } else if (response.statusCode == 200) {
                        // Good FB Access Token
                        var parsedData = JSON.parse(data);

                        console.log("User findOne");
                        User.findOne({ email: parsedData.email }, function(err, user) {
                            if (err) {
                                console.log("User findOne - Error");
                                callback({
                                    "status": 400,
                                    "message": err
                                }, null)
                            }

                            if (!user) {
                                // First Log - Register user
                                console.log("User findOne - Bad User");
                                console.log("User Register");
                                // Register user
                                var birthday  = parsedData.birthday;
                                //  Get Age from birthday
                                var birth = birthday.split("/").reverse();
                                var Bdate = new Date(birth[0], birth[2] - 1, birth[1]);
                                var age   = Math.floor( ( (new Date() - Bdate) / 1000 / (60 * 60 * 24) ) / 365.25 );

                                var newUser = new User({
                                    firstname      : parsedData.first_name,
                                    lastname       : parsedData.last_name,
                                    email          : parsedData.email,
                                    age            : age,
                                    gender         : parsedData.gender,
                                });
                                // Save user in DB
                                newUser.save(function(err) {
                                    if (err) {
                                        return err;
                                    }

                                    var profilePicture = new Picture({
                                        url: parsedData.picture.data.url,
                                        userId: newUser._id
                                    });

                                    profilePicture.save(function(err) {
                                        if (err) {
                                            return err;
                                        }

                                        newUser.profilePicture = profilePicture._id;
                                        newUser.save(function(err) {
                                            if (err) {
                                                return err;
                                            }

                                            callback(null, {
                                                "status" : 201,
                                                "user"   : newUser,
                                                "message": "User created"
                                            })
                                        });
                                    })

                                    
                                })
                            } else {
                                // User login
                                console.log("User findOne - Good :)");
                                callback(null, {
                                    "status" : 200,
                                    "user"   : user,
                                    "message": "User logged"
                                })
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

            res.status(200);
            res.json({
                "status" : results[0].status,
                "token"  : genToken(results[0].user),
                "message": results[0].message,
                "user"   : results[0].user
            });

            return;
        });
    },
 
    validateUser: function(req, res, next, email) {
        User.findOne({ email: email }, function(err, user) {
            if (err) {
                console.log("Validate User Error");
                return err;
            }

            if (user) {
                console.log("Validate User Find user");
                req.Cluztr = {};
                req.Cluztr.user = user;
                next(); // To move to next middleware
            } else {
                // No user with this name exists, respond back with a 401
                res.status(401);
                res.json({
                    "status": 401,
                    "message": "Invalid User"
                });
            }
        })
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