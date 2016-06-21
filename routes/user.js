var async    = require('async');
var Chat     = require('../model/chatModel.js');
var User     = require('../model/userModel.js');
var Interest = require('../model/interestModel.js');


var user = {
    putInterest: function (req, res) {
        var interestsArray = req.body.interests;
        interestsArray = interestsArray.map(function(interest){
            return interest.toLowerCase();
        })

        if (interestsArray) {
            Interest.find({ name: {$in: interestsArray} }, function(err, interests) {
                var user = req.Cluztr.user;

                user.interests = interests;
                user.save();

                res.status(200).json({
                    status: 200,
                    message: "Centre d'interets ajouté a l'utilisateur",
                    data: {
                        "interests": interests,
                        "user": user
                    }
                })
            })
        } else {
            res.json({
                status: 400,
                message: "Veuillez selectionner des centres d'interets"
            });
        };
    },
    setInterests: function () {
        var interests = ['soiree', 'jeuxvideo', 'shopping', 'musique', 'voyage', 'sport', 'cuisine', 'mode', 'litterature', 'technologie', 'restaurent', 'cinema', 'animaux', 'culture', 'dance', 'rencontre'];
        for (var i = 0; i < interests.length; i++) {
            var interest = new Interest({
                name: interests[i],
            });

            interest.save();
        }

        res.status(200).json({
            status: 200,
            message: 'done'
        })
    }
}

module.exports = user;