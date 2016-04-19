'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    mongoose = require('mongoose'),
    passport = require('passport'),
    User = mongoose.model('User');
//reCAPTCHA=require('recaptcha2');


// URLs for which user can't be redirected on signin
var noReturnUrls = [
    '/authentication/signin',
    '/authentication/signup'
];
//var app = angular.module('myApp', ['noCAPTCHA']);
//recaptcha=new reCAPTCHA({
//  siteKey:'6LcGiBsTAAAAAObQA4QThOJ5IuEu2Czosh4RZXfo',
//  secretKey:'6LcGiBsTAAAAAFxhCXEIXj40XpmvyrtVywvpYqUR'
//})
/**
 * Signup
 */
exports.loadTeachers = function(req, res) {

    User.find({}, function(err, docs) {
        if (!err) {
            console.log(docs);
        } else {
            throw err;
        }
    });
    User.find({}).lean().exec(function(err, users) {
        return res.end(JSON.stringify(users));
    });
};

exports.signupStudent = function(req, res) {
    // First looks through Teachers course code
    User.findOne({
            "profileType": "Teacher",
            "courses.number": parseInt(req.body.courseCode)
        },
        function(err, user) {
            console.log("User", user);
            console.log("Error", err);
            if (user) { // if exists, authenticate with provided password.
                ///////Previous Code/////
                // Init Schema
                var newUser = new User(req.body);

                // potential error message
                var message = null;

                // Then save the user
                newUser.save(function(err) {
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err),
                            tried: newUser
                        });
                    } else {
                        // Remove sensitive data before login
                        newUser.password = undefined;
                        newUser.salt = undefined;

                        req.login(newUser, function(err) {
                            if (err) {
                                return res.status(403).send({
                                    message: errorHandler.getErrorMessage(err)
                                });
                            } else {
                                res.json(newUser);
                            }
                        });
                    }
                });
                //////End of Previous Code//////

            } else {
                // no user found, send error.
                res.status(500).send("No teacher code found.");
            }
        });


};

exports.signup = function(req, res) {
    ///////Previous Code/////
    // Init Schema
    var newUser = new User(req.body);

    // potential error message
    var message = null;

    // Then save the user
    newUser.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err),
                tried: newUser
            });
        } else {
            // Remove sensitive data before login
            newUser.password = undefined;
            newUser.salt = undefined;

            req.login(newUser, function(err) {
                if (err) {
                    return res.status(403).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.json(newUser);
                }
            });
        }
    });
    //////End of Previous Code//////
};

exports.signupTeacher = function(req, res) {
    ///////Previous Code/////
    // Init Schema
    var newUser = new User(req.body);

    // potential error message
    var message = null;

    // Then save the user
    newUser.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err),
                tried: newUser
            });
        } else {
            // Remove sensitive data before login
            newUser.password = undefined;
            newUser.salt = undefined;

            req.login(newUser, function(err) {
                if (err) {
                    return res.status(403).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.json(newUser);
                }
            });
        }
    });
    //////End of Previous Code//////
};

exports.signupAdmin = function(req, res) {
    ///////Previous Code/////
    // Init Schema
    var newUser = new User(req.body);

    // potential error message
    var message = null;

    // Then save the user
    newUser.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err),
                tried: newUser
            });
        } else {
            // Remove sensitive data before login
            newUser.password = undefined;
            newUser.salt = undefined;

            req.login(newUser, function(err) {
                if (err) {
                    return res.status(403).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.json(newUser);
                }
            });
        }
    });
    //////End of Previous Code//////
};

/**
 * Signin after passport authentication
 */
exports.signin = function(req, res) {
    console.log("Sign in");
    // First find if user name exists in db.
    User.findOne({
            'userName': req.body.username
        },
        function(err, user) {
            if (user) { // if exists, authenticate with provided password.
                req.login(user, function(err) {
                    if (err || !user.authenticate(req.body.password)) {
                        return res.status(403).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    } else {
                        //No Error
                        res.json(user);
                    }
                });
            } else {
                // no user found, send error.
                res.status(500).send("No user found.");
            }
        });
};

/**
 * Signout
 */
exports.signout = function(req, res) {
    req.logout();
    res.redirect('/');
};

/**
 * OAuth provider call
 */
exports.oauthCall = function(strategy, scope) {
    return function(req, res, next) {
        // Set redirection path on session.
        // Do not redirect to a signin or signup page
        if (noReturnUrls.indexOf(req.query.redirect_to) === -1) {
            req.session.redirect_to = req.query.redirect_to;
        }
        // Authenticate
        passport.authenticate(strategy, scope)(req, res, next);
    };
};

/**
 * OAuth callback
 */
exports.oauthCallback = function(strategy) {
    return function(req, res, next) {
        // Pop redirect URL from session
        var sessionRedirectURL = req.session.redirect_to;
        delete req.session.redirect_to;

        passport.authenticate(strategy, function(err, user, redirectURL) {
            if (err) {
                return res.redirect('/authentication/signin?err=' + encodeURIComponent(errorHandler.getErrorMessage(err)));
            }
            if (!user) {
                return res.redirect('/authentication/signin');
            }
            req.login(user, function(err) {
                if (err) {
                    return res.redirect('/authentication/signin');
                }

                return res.redirect(redirectURL || sessionRedirectURL || '/');
            });
        })(req, res, next);
    };
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function(req, providerUserProfile, done) {
    if (!req.user) {
        // Define a search query fields
        var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
        var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

        // Define main provider search query
        var mainProviderSearchQuery = {};
        mainProviderSearchQuery.provider = providerUserProfile.provider;
        mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

        // Define additional provider search query
        var additionalProviderSearchQuery = {};
        additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

        // Define a search query to find existing user with current provider profile
        var searchQuery = {
            $or: [mainProviderSearchQuery, additionalProviderSearchQuery]
        };

        User.findOne(searchQuery, function(err, user) {
            if (err) {
                return done(err);
            } else {
                if (!user) {
                    var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

                    User.findUniqueUsername(possibleUsername, null, function(availableUsername) {
                        user = new User({
                            firstName: providerUserProfile.firstName,
                            lastName: providerUserProfile.lastName,
                            username: availableUsername,
                            displayName: providerUserProfile.displayName,
                            email: providerUserProfile.email,
                            profileImageURL: providerUserProfile.profileImageURL,
                            provider: providerUserProfile.provider,
                            providerData: providerUserProfile.providerData
                        });

                        // And save the user
                        user.save(function(err) {
                            return done(err, user);
                        });
                    });
                } else {
                    return done(err, user);
                }
            }
        });
    } else {
        // User is already logged in, join the provider data to the existing user
        var user = req.user;

        // Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
        if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
            // Add the provider data to the additional provider data field
            if (!user.additionalProvidersData) {
                user.additionalProvidersData = {};
            }

            user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

            // Then tell mongoose that we've updated the additionalProvidersData field
            user.markModified('additionalProvidersData');

            // And save the user
            user.save(function(err) {
                return done(err, user, '/settings/accounts');
            });
        } else {
            return done(new Error('User is already connected using this provider'), user);
        }
    }
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function(req, res, next) {
    var user = req.user;
    var provider = req.query.provider;

    if (!user) {
        return res.status(401).json({
            message: 'User is not authenticated'
        });
    } else if (!provider) {
        return res.status(400).send();
    }

    // Delete the additional provider
    if (user.additionalProvidersData[provider]) {
        delete user.additionalProvidersData[provider];

        // Then tell mongoose that we've updated the additionalProvidersData field
        user.markModified('additionalProvidersData');
    }

    user.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            req.login(user, function(err) {
                if (err) {
                    return res.status(400).send(err);
                } else {
                    return res.json(user);
                }
            });
        }
    });
};
