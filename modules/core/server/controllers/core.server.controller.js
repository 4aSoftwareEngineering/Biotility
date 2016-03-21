'use strict';

var mongoose = require('mongoose'),

    QuizQuestion = mongoose.model('QuizQuestion'),
    User = mongoose.model('User'),
    Subject = mongoose.model('Subject'),
    Resource = mongoose.model('Resource');
    // Grades = mongoose.model('studentgrades');

/**
 * Render the main application page
 */
 var plotly = require('plotly')("biotilitysp18","tmplea9qm7");
 var nodemailer = require('nodemailer');
 var transport = nodemailer.createTransport("SMTP", {
        service: 'Gmail',
        auth: {
            user: "biotilitysp18@gmail.com",
            pass: "team4asp18"
        }
    });

 // var Email = require('email').Email;
 var CronJob = require('cron').CronJob;

exports.renderIndex = function(req, res) {
    res.render('modules/core/server/views/index', {
        user: req.user || null
    });
};

/**
 * Render the server error page
 */
exports.renderServerError = function(req, res) {
    res.status(500).render('modules/core/server/views/500', {
        error: 'Oops! Something went wrong...'
    });
};


exports.plot = function(req,res){
    console.log("PLOTLY "+req.user.courses.length );
    var num = [];
       
    //find all the courses   
    for(var i = 0; i < req.user.courses.length ; i++){
        num.push(req.user.courses[i].number);
            // console.log(req.user.courses[i].number);
    }  

    //find all the students in that course
    for(var s = 0; s < req.user.courses.length ; s++){     
        findStudents(num[s]);
    }

   

    function findStudents(stud){
        User.find({ 'profileType': 'Student', 'courseCode': stud }).lean().exec(function(err, users) {
            
            for (var i = 0; i < users.length; i++) {           
                
                console.log(users);  
                // findGrades(users[i], stud);
            }

            return res.end(JSON.stringify(users));
        });
    }

    //in each student that matches go to the other database studentgrades and see their scores.
    // function findGrades(student, stud){
    //     Grades.find({ "studentname" : student.userName , 'courseCode': stud }).lean().exec(function(err, grades) { 
    //         for (var i = 0; i < grades.length; i++) {           
                
    //             console.log(grades);  
    //         }
    //         return res.end(JSON.stringify(grades));
    //     });
    // }

    var data = [
              {
                x: ["isabel", "matt", "eric"],
                y: [5, 5, 5],
                type: "bar"
              }
            ];

            var graphOptions = {filename: "basic-bar", fileopt: "overwrite"};

            plotly.plot(data, graphOptions, function (err, msg) {
                console.log(msg);
            });

           
};

exports.email = function(req,res){
   console.log("EMAILS");

   // var transporter = nodemailer.createTransport();
   var data = req.body;
  var message = {

// sender info
    from: data.email,

    // Comma separated list of recipients
    to: 'biotilitysp18@gmail.com',

    // Subject of the message
    subject: 'Resource Request', 

    //text
    text: 'Subject: '+ data.subject + '\nSubheading: ' + data.subheading + '\nLink: ' + data.link  + '\nComments: ' + data.comments

    };

    console.log('Sending Mail');
    transport.sendMail(message, function(error){
      if(error){
          console.log('Error occured');
          console.log(error.message);
          return;
      }
      console.log('Message sent successfully!');

      // if you don't want to use this transport object anymore, uncomment following line
      //transport.close(); // close the connection pool
    });

};

exports.cron = function(req,res){
   console.log("CRON");
    
    new CronJob('* * * * * *', function() {
      console.log('You will see this message every second');
    }, null, true, 'America/Los_Angeles');
};


/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function(req, res) {

    res.status(404).format({
        'text/html': function() {
            res.render('modules/core/server/views/404', {
                url: req.originalUrl
            });
        },
        'application/json': function() {
            res.json({
                error: 'Path not found'
            });
        },
        'default': function() {
            res.send('Path not found');
        }
    });
};

// Retrieve subject data, send as response.
exports.parseSubjects = function(req, res) {

    Subject.find({}, function(err, docs) {

        if (!err) {
            console.log(docs);
        } else {
            throw err;
        }
    });
    Subject.find({}, function(err, subs) {
        return res.end(JSON.stringify(subs));
    });
};


//retrives all Resources from database
exports.parseResources = function(req, res) {

    Resource.find({}, function(err, subs) {
        return res.end(JSON.stringify(subs));
    });
};

//Creates a new resource for the database
exports.addResource = function(req, res) {
    var newResource = new Resource(req.body);
    newResource.save(function(err) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        } else {
            res.json(newResource);
        }
    });
};

//Deletes a resource from the database
exports.deleteResource = function(req, res) {
    var resource_to_delete = req.resource;
    resource_to_delete.remove(function(err) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.end();
        }
    });
};


// Retrieve user data, send as response.
exports.parseUsers = function(req, res) {
    
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

// Retrieve question data, send as response.
exports.parseQuestions = function(req, res) {
    QuizQuestion.find({}, function(err, docs) {
        if (!err) {
            console.log(docs);
        } else {
            throw err;
        }
    });
    QuizQuestion.find({}).lean().exec(function(err, users) {
        return res.end(JSON.stringify(users));
    });
};

// Find student data
exports.findStudents = function(req, res) {
    User.find({ 'profileType': 'Student', 'courseCode': { $in: req.body.courseNums } }).lean().exec(function(err, users) {
        return res.end(JSON.stringify(users));
    });
};

exports.update = function(req, res) {
    console.log("UPDATES");
    var User = req.User;

    User.courses = req.body.courses;


    User.save(function(err) {
        if (err) {
            console.log("NOOOOO");
            return res.status(400).send({
                message: err
            });
        } else {
            res.json(req.User);
        }
    });
};

exports.userByID = function(req, res, next, id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'No user'
        });
    }

    User.findOne({
        _id: id
    }).exec(function(err, user) {
        if (err) {
            return next(err);
        } else if (!user) {
            return next(new Error('Failed to load User ' + id));
        }

        req.profile = user;
        next();
    });
};

exports.tester = function(req, res) {
    console.log("TESTER");
    User.find({ 'profileType': 'Student', 'courseCode': { $in: req.body.courseNums } }).lean().exec(function(err, users) {
        return res.end(JSON.stringify(users));
    });
};

//middleware to delete resources
exports.resourceByID = function(req, res, next, id) {
    Resource.findById(id).exec(function(err, resource) {
        if (err) {
            res.status(400).send(err);
        } else {
            req.resource = resource;
            next();
        }
    });
};
