'use strict';
var Q = require('q');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport();
var mongoose = require('mongoose'),

    fs = require('fs'),

    QuizQuestion = mongoose.model('QuizQuestion'),
    User = mongoose.model('User'),
    Subject = mongoose.model('Subject'),
    Resource = mongoose.model('Resource'),
    StudentGrades = mongoose.model('StudentGrades'),

  	Comments = mongoose.model('Comments'),
    SubHead = mongoose.model('SubHead');
mongoose.Promise = require('q').Promise;



var nodemailer = require('nodemailer');
var transport = nodemailer.createTransport("SMTP", {
    service: 'Gmail',
    auth: {
        user: "biotilitysp18@gmail.com",
        pass: "team4asp18"
    }
});


/**
 * Render the main application page
 */

// var Email = require('email').Email;
var datagraph = [];

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

//for the comments
exports.getComments = function(req, res) {
    Comments.find({}).lean().exec(function(err, comments) {
	    return res.end(JSON.stringify(comments));
    });
};

exports.sendMail = function(req, res) {
    console.log("EMAILS");
    var data = req.body;
    var message = {
        // sender info
        from: 'biotilitysp18@gmail.com',

        // Comma separated list of recipients
        to: data.email,

        // Subject of the message
        subject: 'Biotility: Course code ',

        //text
        text: 'The course code for you to use is 1234'

    };
    console.log('Sending Mail');
    transport.sendMail(message, function(error) {
        if (error) {
            console.log('Error occured');
            console.log(error.message);
            return;
        }
        console.log('Message sent successfully!');
        // $("#myModal").modal("show");
        // $("#myModal").modal('show');
    });
};


// Isabel - plot for statistics on teachers page 
exports.plot = function(req, res) {
    console.log("plotting statistics");

    var nameofClass = req.param('classname');
    var searchQuiz = req.param('quiz');
    var courseCodes = req.param('code');
    // console.log(nameofClass +" "+  searchQuiz);

    //array of courses for the teacher
    var num = [];
    var classes = [];
    var grade = [0];
    var students = [];


    //find all the courses   
    for (var i = 0; i < req.user.courses.length; i++) {
        num.push(req.user.courses[i].number);
    }

    var findcount = false;
    //find all the students in that course 
    // console.log("AMOUNT:" + req.user.courses.length);
    // for(var s = 0; s < req.user.courses.length ; s++){  
    findStudents();
    // }

    for (var gradesize = 0; gradesize < 5; gradesize++) {
        grade[gradesize] = 0;
    }



    function findStudents() {
        User.find({ 'profileType': 'Student', 'courseCode': courseCodes }).lean().exec(function(err, users) {
            for (var i = 0; i < users.length; i++) {
                // console.log("STUDENTS: " +users[i].userName);  
                if (i === users.length - 1) {
                    findcount = true;
                }
                findGrades(users[i], courseCodes);
            }
        });
    }

    //find all grades for the course code
    function findGrades(givenstudent, course) {
        StudentGrades.find({ 'student.studentName': givenstudent.userName }).lean().exec(function(err, grades) {
            //lookup a test

            for (var i = 0; i < grades.length; i++) {
                // console.log(grades[i].category);
                for (var c = 0; c < grades[i].student.courses.length; c++) {
                    //see if the test has a category that the teacher is looking for
                    if (grades[i].category === searchQuiz) {
                        // console.log("Current course code: "+ courseCodes);
                        //see if test has a course code that matches the teachers 
                        // console.log(grades[i].student.courses[c]);
                        if (grades[i].student.courses[c] === courseCodes) {
                            // console.log("COURSES: "+ grades[i].student.courses[0]);

                            //Get the amount of questions in the quiz
                            datagraph.length = grades[i].analytics.length;
                            var questionSize = grades[i].analytics.length;
                            // console.log("Question size:" + grades[i].analytics.length); 
                            console.log("Question size:" + datagraph.length);

                            //iterate through analytics and see if attempt = 1
                            for (var analytics = 0; analytics < questionSize; analytics++) {
                                if (grades[i].analytics[analytics].attempts === 1) {
                                    // console.log("you got it right");
                                    grade[analytics] = grade[analytics] + 1;
                                }
                            }
                        }
                    }
                }
            }
            datagraph = grade;
            return res.send(datagraph);
        });

    }

    // //output data
    // function callgraph(datagraph){
    //   console.log("DATAGRAPH");

    //   // for(var size = 0; size < 20 ; size++){
    //     console.log(datagraph.size);
    //   // }
    // }

    console.log("DATA" + datagraph);
    // var data = [65, 59, 80, 81, 56, 55];

};

//Isabel- send emails to Admins for resource request
exports.email = function(req, res) {

    var data = req.body;
    var message = {

        //sender info
        from: data.email,

        // Send to Admin
        to: 'lwojo@ufl.edu',

        // Subject of the message
        subject: 'Resource Request',

        //text
        text: 'Subject: ' + data.subject + '\nSubheading: ' + data.subheading + '\nLink: ' + data.link + '\nComments: ' + data.comments

    };

    // console.log('Sending Mail');
    // Sending Mail
    transport.sendMail(message, function(error) {
        if (error) {
            console.log('Error occured');
            console.log(error.message);
            return;
        }
        //Message sent successully!
        // console.log('Message sent successfully!');
    });
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
    Subject.find({}, function(err, subs) {
        return res.end(JSON.stringify(subs));
    });
};


//Retrieves all Resources from database
exports.parseResources = function(req, res) {

    Resource.find({}, function(err, subs) {
        return res.end(JSON.stringify(subs));
    });
};


//Retrieves all the SubHeadings from database
exports.parseSubHeads = function(req, res) {

    SubHead.find({}, function(err, subs) {
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

//Update a resource from the database
exports.updateResource = function(req, res) {
    var resource_to_update = req.resource;
    resource_to_update.title = req.body.title;
    resource_to_update.url = req.body.url;
    resource_to_update.subject = req.body.subject;


    resource_to_update.save(function(err) {
        if (err) {
            res.status(400).send(err);

        } else {
            res.json(resource_to_update);
        }
    });
};

exports.clickResource = function(req, res) {
    var resource_to_update = req.resource;
    resource_to_update.title = req.body.title;
    resource_to_update.url = req.body.url;
    resource_to_update.subject = req.body.subject;
    resource_to_update.clicks = req.body.clicks;
    console.log(resource_to_update);
    resource_to_update.save(function(err) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.json(resource_to_update);
        }
    });
};

//Server side mongoose functions for SubHeadings
exports.addSubHead = function(req, res) {
    var newSubHead = new SubHead(req.body);
    newSubHead.save(function(err) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        } else {
            res.json(newSubHead);
        }
    });
};
exports.deleteSubHead = function(req, res) {
    var subHead_to_delete = req.subHead;
    Resource.find({ subject: subHead_to_delete._id }).remove(function(err) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.end();
        }
    });
    subHead_to_delete.remove(function(err) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.end();
        }
    });
};
exports.updateSubHead = function(req, res) {
    var subHead_to_update = req.subHead;

    subHead_to_update.title = req.body.title;
    subHead_to_update.subject = req.body.subject;


    subHead_to_update.save(function(err) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.json(subHead_to_update);
        }
    });
};

//Eric - Get clicks from certin subject, sort by highest click total
exports.parseClicks = function(req, res) {
    var searchSubject = req.param('subject');
    var promises = [];
    SubHead.find({'subject': searchSubject}).exec().then(function(SubHead_Return) {
      var SubHead_ids = [];
      for(var i = 0; i < SubHead_Return.length; i++) {
        SubHead_ids.push(SubHead_Return[i]._id);
      }
      return SubHead_ids;
    }).then(function(SubHead_ids){
      Resource.find({}).sort({clicks: -1}).exec().then(function(clicks){
        var data = [];
        for(var i = 0; i < clicks.length; i++) {
          for(var j = 0; j < SubHead_ids.length; j++) {
            if(clicks[i].subject == SubHead_ids[j]) {
              data.push({'name': clicks[i].title, 'clicks': clicks[i].clicks});
            }  
          }
        }
        return data;
      }).then(function(data){
        return res.end(JSON.stringify(data));
      });
    });  
};

//Eric - Find questions for subject, match grades with same question id's,
//       then send back statistics about the results.
exports.getGradesForAdmin = function(req, res) {
    var searchSubject = req.param('subject');
    console.log("SUBJECT: "+searchSubject);
    //Get question from requested subject, then get their id's
    QuizQuestion.find({'category': searchSubject}).exec().then(function(questions){
      console.log("QUESTIONSSSS: "+questions);
      var question_ids = [];
      for(var i = 0; i < questions.length; i++) {
        question_ids.push(questions[i]._id);
      }
      console.log("Question_Ids");
      console.log(question_ids);
      return question_ids;
    }).then(function(ids){
      //Find grades when questions used match questions found above
      StudentGrades.find({'category':searchSubject}).exec().then(function(grades){
        var correct_instances = [];
        //for each assesment
        for(var i = 0; i <grades.length; i++){
          var use_assesment = true;
          //for each id found above
          if(grades[i].analytics.length === ids.length) {
            for(var j = 0; j<ids.length; j++){
              //KEEP AS != NEVER CHANGE TO !==
              if(grades[i].analytics[j].question._id != ids[j]) {
                use_assesment = false;
              }
            }
          }
          else {
            use_assesment = false;
          }
          if(use_assesment === true) {
            correct_instances.push(grades[i]);
          }
        }
        console.log("correct_instances");
        console.log(correct_instances);
        return correct_instances;
      }).then(function(aData){
        //Get Question names, calculate average,mode,percent correct
        if(aData.length !== 0) {
          var question_names = [];
          for (var ques = 0;ques<aData[0].analytics.length; ques++) {
            question_names.push(aData[0].analytics[ques].question.text.substring(0,20));
          }
          var perc_correct = [];
          var avgs = [];
          //for each question
          for (var perc = 0; perc < aData[0].analytics.length; perc++) {
            var perc_add = 0;
            var average_sum = 0;
            //for each assessment
            for(var corr = 0; corr < aData.length;corr++) {
              if(aData[corr].analytics[perc].attempts === 1) {
                perc_add++;
              }
              average_sum = average_sum + aData[corr].analytics[perc].attempts;
            }
            perc_correct.push(perc_add/aData.length);
            avgs.push(average_sum/aData.length);
          }

          //Finding Most common wrong first pick
          var modes = [];
          //for each question
          console.log("QUEST LENGTH: " + aData[0].analytics.length);
          for (var quest = 0; quest < aData[0].analytics.length; quest++) {
            console.log("QUEST LOOP: " + quest);
            var possible_answers = [];
            var tally_up = [];
            //if single choice
            console.log("QUESTION TYPE: " + aData[0].analytics[quest].question.type);
            if(aData[0].analytics[quest].question.type === "SC") {
              //populate possible_answers and tally
              for(var choice = 0; choice < aData[0].analytics[quest].question.answers.MCTF.length;choice++){
                console.log("CHOICE LOOP: " + choice);
                possible_answers.push(aData[0].analytics[quest].question.answers.MCTF[choice]);
                tally_up.push(0);
              }
              console.log("possible_answers: " + possible_answers);
              console.log("tally_up: " + tally_up);
              //for each grade
              console.log("GRADE LENGTH: " + aData.length);
              for(var grade = 0; grade < aData.length;grade++) {
                console.log("GRADE LOOP: " + grade);
                //if more than 1 attempt
                console.log("ATTEMPS: " + aData[grade].analytics[quest].attempts);
                if(aData[grade].analytics[quest].attempts !== 1) {
                  //find which answer first incorrect corresponds to, then inc tally
                  for(var poss = 0; poss < possible_answers.length; poss++) {
                    console.log("POSS LOOP: " + poss);
                    console.log("IF VALUE1: " + aData[grade].analytics[quest].firstIncorrect);
                    console.log("IF VALUE2: " + possible_answers[poss]);
                    if(aData[grade].analytics[quest].firstIncorrect === possible_answers[poss]) {
                      tally_up[poss]++;
                    }
                  }
                }
              }
              console.log("tally_up: " + tally_up);
              var most_chosen = 0;
              //for each tally slot
              for(var tal = 0; tal < possible_answers.length; tal++) {
                console.log("TAL LOOP: " + tal);
                console.log("TAL VALUE1: " + tally_up[tal]);
                //if its value is greater than the one with the greatest so far
                if(tally_up[tal] > tally_up[most_chosen]) {
                  //set this index to most_chosen
                  most_chosen = tal;
                }
                console.log("MOST CHOSEN: "+most_chosen);
              }
              if(tally_up[most_chosen] === 0) {
                modes.push("N/A");
              }
              else {
                modes.push(possible_answers[most_chosen]);
              }
            }
            else {
              modes.push(aData[quest].analytics[0].question.type);
            }
              
          }
          console.log("STATS");
          console.log({'question_names': question_names, 'avgs':avgs, 'modes':modes, 'perc_correct':perc_correct});
          return {'question_names': question_names, 'avgs':avgs, 'modes':modes, 'perc_correct':perc_correct};
        }
        else {
          return {'question_names': [], 'avgs':[], 'modes':[], 'perc_correct':[]};
        }
    }).then(function(data){
        return res.end(JSON.stringify(data));
    });
  });
};

// Retrieve user data, send as response.
exports.parseUsers = function(req, res) {
    User.find({}).lean().exec(function(err, users) {
        return res.end(JSON.stringify(users));
    });
};
// Retrieve question data, send as response.
exports.parseQuestions = function(req, res) {

    // get all questions and sort by category 
    QuizQuestion.find({}).lean().sort({category:1}).exec(function(err, questions) {
        return res.end(JSON.stringify(questions));
    });
};

// Read current question -RB
exports.readQuestion = function(req, res) {
    /* send back the question as json from the request */
    res.json(req.quizQuestion);
};

// Create new quiz question -RB
exports.addQuestion = function(req, res) {
    var newQuestion = new QuizQuestion(req.body);
    newQuestion.save(function(err) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        } else {
            res.json(newQuestion);
        }
    });
};

// Update quiz question -RB
exports.updateQuestion = function(req, res) {
    var question_to_update = req.quizQuestion;

    question_to_update.category = req.body.category;
    question_to_update.type = req.body.type;
    question_to_update.text = req.body.text;
    question_to_update.answers = req.body.answers;
    question_to_update.hint = req.body.hint;
    question_to_update.link = req.body.link;

    question_to_update.save(function(err) {
        if (err) {
            res.status(400).send(err);

        } else {
            res.json(question_to_update);
        }
    });
};

// Delete quiz question -RB
exports.deleteQuestion = function(req, res) {
    var question_to_delete = req.quizQuestion;
    question_to_delete.remove(function(err) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.end();
        }
    });
};

// Find student data
exports.findStudents = function(req, res) {
    User.find({ 'profileType': 'Student', 'courseCode': { $in: req.body.courseNums } }).lean().exec(function(err, users) {
        return res.end(JSON.stringify(users));
    });
};

//Isabel- update teacher's courses
exports.update = function(req, res) {
    // console.log("update");
    var User = req.User;

    User.courses = req.body.courses;

    User.save(function(err) {
        if (err) {
            // console.log("did not complete update");
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

//middleware for resources
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

//middleware for subheadings
exports.subHeadByID = function(req, res, next, id) {
    SubHead.findById(id).exec(function(err, subHead) {
        if (err) {
            res.status(400).send(err);
        } else {
            req.subHead = subHead;
            next();
        }
    });
};

//middleware for quizQuestions -RB 
exports.questionByID = function(req, res, next, id) {
    QuizQuestion.findById(id).exec(function(err, quizQuestion) {
        if (err) {
            res.status(400).send(err);
        } else {
            req.quizQuestion = quizQuestion;
            next();
        }
    });
};

//Matt
//Profile photo upload/change
exports.photoUpload = function(req, res) {
    var file = req.files.file,
        storePath = "profilePics/" + file.name,
        savePath = "public/" + storePath,
        User = req.user;

    //Save image from photo upload.
    fs.writeFile(savePath, file.buffer, 'binary', function(err) {
        if (err) {
            throw err;
        }
        //Upload Success
        User.profileImageURL = storePath;
        User.save(function(err) {
            if (err) {
                // console.log("did not complete update");
                return res.status(400).send({
                    message: err
                });
            } else {
                return res.status(200).send({
                    message: "User photo updated",
                    url: storePath
                });
            }
        });
    });
};
