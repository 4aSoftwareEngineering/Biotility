'use strict';
var Q = require('q');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport();
var mongoose = require('mongoose'),
    QuizQuestion = mongoose.model('QuizQuestion'),
    User = mongoose.model('User'),
    Subject = mongoose.model('Subject'),
    Resource = mongoose.model('Resource'),
    StudentGrades = mongoose.model('StudentGrades'),
  	Comments = mongoose.model('Comments'),
    SubHead = mongoose.model('SubHead');
mongoose.Promise = require('q').Promise;

/**
 * Render the main application page
 */
 var plotly = require('plotly')("isalau","qezih8jic7");
 var nodemailer = require('nodemailer');
 var transport = nodemailer.createTransport("SMTP", {
        service: 'Gmail',
        auth: {
            user: "biotilitysp18@gmail.com",
            pass: "team4asp18"
        }
    });

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
		for(var i=0;i<comments.length;i++){
			console.log(i+": "+comments[i].comment);
			
		}
		
        return res.end(JSON.stringify(comments));
    });
};
exports.sendMail = function(req, res) {
    console.log("EMAILS");
    var data = req.body;
    var message= {
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
    transport.sendMail(message, function(error){
        if(error){
            console.log('Error occured');
            console.log(error.message);
            return;
        }
        console.log('Message sent successfully!');
        // $("#myModal").modal("show");
        // $("#myModal").modal('show');
    });
};

exports.getGradesForAdmin = function(req, res) {
    var searchSubject = req.param('subject');
    
    QuizQuestion.find({'category': searchSubject}).exec().then(function(questions){
      var question_ids = [];
      for(var i = 0; i < questions.length; i++) {
        question_ids.push(questions[i]._id);
      }
      console.log("question_ids:");
      console.log(question_ids);
      return question_ids;
    }).then(function(ids){
      StudentGrades.find({'category':searchSubject}).exec().then(function(grades){
        var correct_instances = [];
        //for each assesment
        for(var i = 0; i <grades.length; i++){
          console.log("ASSESMENT : "+i);
          var use_assesment = true;
          //for each id found above
          if(grades[i].analytics.length === ids.length) {
            for(var j = 0; j<ids.length; j++){
              console.log("QUESTION : "+j);
              console.log(ids[j]);
              console.log(grades[i].analytics[j].question._id);
              //KEEP AS != NEVER CHANGE TO !==
              if(grades[i].analytics[j].question._id != ids[j]) {
                use_assesment = false;
                console.log("DON'T USE!");
              }
            }
          }
          else {
            use_assesment = false;
            console.log("DON'T USE!");
          }
          if(use_assesment === true) {
            console.log("ASSESMENT ADDED");
            correct_instances.push(grades[i]);
          }
        }

        return correct_instances;
      }).then(function(aData){
        var question_names = [];
        for (var ques = 0;ques<aData[0].analytics.length; ques++) {
          console.log("QUESTION NAMES : "+aData[0].analytics[ques].question.text.substring(0,20));
          question_names.push(aData[0].analytics[ques].question.text.substring(0,20));
        }
        var perc_correct = [];
        var avgs = [];
        var modes = [];
        //for each question
        for (var perc = 0; perc < aData[0].analytics.length; perc++) {
          var perc_add = 0;
          var average_sum = 0;
          var mode_start = 0;
          //for each assessment
          for(var corr = 0; corr < aData.length;corr++) {
            if(aData[corr].analytics[perc].attempts === 1) {
              perc_add++;
            }
            average_sum = average_sum + aData[corr].analytics[perc].attempts;
            if(aData[corr].analytics[perc].attempts > mode_start) {
              mode_start = aData[corr].analytics[perc].attempts;
            }
          }
          perc_correct.push(perc_add/aData.length);
          avgs.push(average_sum/aData.length);
          modes.push(mode_start);
        }

        return {'question_names': question_names, 'avgs':avgs, 'modes':modes, 'perc_correct':perc_correct};
    }).then(function(data){
        return res.end(JSON.stringify(data));
    });
  });
};

//exports.plot = function(req,res){
//    console.log("PLOTLY "+req.user.courses.length );
    // console.log("COURSE GIVEN: " + req.course);
    // var params = req.body; 
    // console.log("PLOTLY "+params.person.user.courses.length );
    // console.log("COURSE GIVEN: " + req.param('given'));
//    var searchCourse = req.param('given');
//    var num = [];
//    var classes = [];
//    var grade = [];
//    var xside = [];
    // var datagraph = [];
       
    //find all the courses   
//    for(var i = 0; i < req.user.courses.length ; i++){
//        num.push(req.user.courses[i].number);
//    }  

    //find all the students in that course
//    var findcount = false; 
//    console.log("AMOUNT:" + req.user.courses.length);
//    for(var s = 0; s < req.user.courses.length ; s++){
        
//        findStudents(num[s]);
//    }

    //for(var gradesize = 0; gradesize < 20 ; gradesize++){
     //   grade[gradesize] = 0;
    //}
//=======
//Old Plotly Refernce
// exports.plot = function(req,res){
//   var ctx = $("#myChart").get(0).getContext("2d");
//   console.log("PLOT "+req.user.courses.length );
//   var searchCourse = req.param('given');
//   var num = [];
//   var classes = [];
//   var grade = [];
//   var xside = [];
     
//   //find all the courses   
//   for(var i = 0; i < req.user.courses.length ; i++){
//       num.push(req.user.courses[i].number);
//   }  

  
//   var findcount = false; 
//   //find all the students in that course 
//   console.log("AMOUNT:" + req.user.courses.length);
//   for(var s = 0; s < req.user.courses.length ; s++){  
//     findStudents(num[s]);
//   }

//   for(var gradesize = 0; gradesize < 20 ; gradesize++){
//     grade[gradesize] = 0;
//   }
//>>>>>>> master
    
//     //find all grades for the course code
//   function findGrades(givenstudent, course){
//     StudentGrades.find({'student.studentName' : givenstudent.userName}).lean().exec(function(err, grades) { 
//         //lookup a test
        
//         for (var i = 0; i < grades.length;  i++) {
            
//             for (var c = 0; c < grades[i].student.courses.length; c++){
                
//                 //see if the test has a category that the teacher is looking for
//                 if(grades[i].category === searchCourse){
                    
//                     //see if test has a course code that matches the teachers 
//                    if(grades[i].student.courses[c] === course){
//                     console.log("COURSES: "+ grades[i].student.courses);

//                     //iterate through analytics and see if attempt = 1
//                        for (var analytics = 0; analytics< grades[i].analytics.length; analytics++){
//                             if(grades[i].analytics[analytics].attempts === 1){
//                                 // console.log("you got it right");
//                                 grade[analytics] = grade[analytics]+1;
//                             }
//                         }
//                    }
//                 }
//             }   
//             datagraph = grade;        
//         }

//         if(findcount === true ){
//             callgraph(datagraph);
//         }    
//         return res.end(JSON.stringify(grades));
//     });
//   }

//   function findStudents(stud){
//       User.find({ 'profileType': 'Student', 'courseCode': stud }).lean().exec(function(err, users) {
          
//           for (var i = 0; i < users.length; i++) {           
//               // console.log("STUDENTS: " +users[i].userName);  
//               if (i === users.length -1 ) {
//                       findcount = true;
//               } 
//               findGrades(users[i], stud);
//           }

//           return res.end(JSON.stringify(users));
//       });
//   }

//   //actual plot
//   function callgraph(datagraph){
//     console.log("DATAGRAPH");

//     for(var size = 0; size < 20 ; size++){
//       console.log(datagraph[size]);
//     }

//     for(var xaxis = 1; xaxis < 20; xaxis++){
//       xside[xaxis]  = xaxis;
//     }

//     var data = [{
//       labels: ["January", "February", "March", "April", "May", "June", "July"],
//       datasets: [
//         {
//             label: "Class Statistics",
//             fillColor: "rgba(220,220,220,0.5)",
//             strokeColor: "rgba(220,220,220,0.8)",
//             highlightFill: "rgba(220,220,220,0.75)",
//             highlightStroke: "rgba(220,220,220,1)",
//             data: xside
//         },
//     ]
//     }];

//     var myBarChart = new Chart(ctx).Bar(data); 
//   }
// };

// Isabel - plot for statistics on teachers page 
exports.plot = function(req,res){
  console.log("IN PLOT");
  
  var searchCourse = req.param('given');
  console.log(searchCourse);
  var num = [];
  var classes = [];
  var grade = [];
  
     
  //find all the courses   
  for(var i = 0; i < req.user.courses.length ; i++){
    num.push(req.user.courses[i].number);
  }  

  
  var findcount = false; 
  //find all the students in that course 
  console.log("AMOUNT:" + req.user.courses.length);
  for(var s = 0; s < req.user.courses.length ; s++){  
    findStudents(num[s]);
  }

  for(var gradesize = 0; gradesize < 20 ; gradesize++){
    grade[gradesize] = 0;
  }

   function findStudents(stud){
      User.find({ 'profileType': 'Student', 'courseCode': stud }).lean().exec(function(err, users) {  
        for (var i = 0; i < users.length; i++) {           
            // console.log("STUDENTS: " +users[i].userName);  
            if (i === users.length -1 ) {
              findcount = true;
            } 
            findGrades(users[i], stud);
        }
      });
  }

   //find all grades for the course code
  function findGrades(givenstudent, course){
    StudentGrades.find({'student.studentName' : givenstudent.userName}).lean().exec(function(err, grades) { 
        //lookup a test

        for (var i = 0; i < grades.length;  i++) {
            
            for (var c = 0; c < grades[i].student.courses.length; c++){
                
                //see if the test has a category that the teacher is looking for
                if(grades[i].category === searchCourse){
                    
                    //see if test has a course code that matches the teachers 
                   if(grades[i].student.courses[c] === course){
                    console.log("COURSES: "+ grades[i].student.courses);
                    datagraph.size = grades[i].analytics.length; 
                    
                    //iterate through analytics and see if attempt = 1
                       for (var analytics = 0; analytics< grades[i].analytics.length; analytics++){
                            if(grades[i].analytics[analytics].attempts === 1){
                                // console.log("you got it right");
                                grade[analytics] = grade[analytics]+1;
                            }
                        }
                   }
                }
            }   
            datagraph = grade;        
        }

        if(findcount === true ){
            callgraph(datagraph);
        }    
    });
  }

 

  //output data
  function callgraph(datagraph){
    console.log("DATAGRAPH");

    for(var size = 0; size < 20 ; size++){
      console.log(datagraph[size]);
    }
  }


  console.log("DATA" + datagraph);
  // var data = [65, 59, 80, 81, 56, 55];
  return res.send(datagraph);
};

//Isabel
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
        // $("#myModal").modal("show");
        // $("#myModal").modal('show');
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
exports.parseClicks = function(req, res) {
    var searchSubject = req.param('subject');
    var promises = [];
    console.log("Got:" + searchSubject);
    console.log("Calling Subhead.find");
    SubHead.find({'subject': searchSubject}).exec().then(function(SubHead_Return) {
      console.log("SubHead_Return");
      console.log(SubHead_Return);
      var SubHead_ids = [];
      for(var i = 0; i < SubHead_Return.length; i++) {
        SubHead_ids.push(SubHead_Return[i]._id);
      }
      return SubHead_ids;
    }).then(function(SubHead_ids){
      console.log("SubHead_ids");
      console.log(SubHead_ids);
      Resource.find({}).sort({clicks: -1}).exec().then(function(clicks){
        var data = [];
        for(var i = 0; i < clicks.length; i++) {
          console.log(clicks[i].title);
          for(var j = 0; j < SubHead_ids.length; j++) {
            if(clicks[i].subject == SubHead_ids[j]) {
              data.push({'name': clicks[i].title, 'clicks': clicks[i].clicks});
              console.log("success");
            }  
            console.log(clicks[i].subject);
            console.log(SubHead_ids[j]);
          }
        }
        console.log("DATA");
        console.log(data);
        return data;
      }).then(function(data){
        return res.end(JSON.stringify(data));
      });
      // console.log("Promises when Q called");
      // console.log(promises);
      // Q.all(promises).then(function(){
      // console.log("Responding after forEach");
      // console.log(data);
      // return res.end(JSON.stringify(data));
      // }); 
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
    Resource.find({subject: subHead_to_delete._id}).remove(function(err) {
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

// Retrieve user data, send as response.
exports.parseUsers = function(req, res) {
    User.find({}).lean().exec(function(err, users) {
        return res.end(JSON.stringify(users));
    });
};
// Retrieve question data, send as response.
exports.parseQuestions = function(req, res) {
    // get a;; questions and sort by category 
    QuizQuestion.find({}).lean().sort({category:1}).exec(function(err, questions) {
        return res.end(JSON.stringify(questions));
    });
};

// Read current question
exports.readQuestion = function(req, res) {
  /* send back the question as json from the request */
  res.json(req.quizQuestion);
};

// Create new quiz question 
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

// Update quiz question 
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

// Delete quiz question 
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

//Isabel
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

//middleware for quizQuestions
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
