'use strict';


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
    Subject.find({},{'name':1}).lean().exec(function(err, courses) {
		for(var place=0; place<courses.length; place++){
		
		getAttempts(courses[place].name);
		
		}
		return res.end(JSON.stringify(courses));
	});
			//console.log("Quiz: "+ courses[place].name);
	function getAttempts(cat){
			StudentGrades.find({'analytics.question.type':'SC','category':cat},{'analytics':1,'category':1}).lean().exec(function(err, aData) {
				var sizeOfQuiz=0;
				for(var g=0;g<aData.length;g++){
					if(aData[g].analytics.length>sizeOfQuiz)sizeOfQuiz=aData[g].analytics.length;
				}
				var avgs = [0];
				var modes = [0];
				//make array of averages
				//make arrar of modes0
				for(var ez=1;ez<sizeOfQuiz;ez++){
					avgs[avgs.length] =0;
					modes[modes.length]=0;
				}
				
				for(var j = 0 ; j<sizeOfQuiz;j++){
					var choice = 0;
					var total=0;
					var counter=0;
					var ans = [0,0,0,0,0,0];
					for(var i=0;i<aData.length;i++){
						
						if(j>=aData[i].analytics.length)var z=5;
						else{
							if(aData[i].analytics[j].attempts==1){
								choice=parseInt(aData[i].analytics[j].question.answers.correct);
								//console.log("answer: "+choice);
								
							}
							else{
								for(var wrong=0;wrong<aData[i].analytics[j].question.answers.MCTF.length;wrong++){
									if(aData[i].analytics[j].firstIncorrect==aData[i].analytics[j].question.answers.MCTF[wrong]){
										choice=wrong;
										break;
									}
								}
								choice++;
								//console.log("answer: "+choice);
								
							}
							total+=aData[i].analytics[j].attempts;
							ans[choice]+=1;
							counter++;
							
						}
					}
					var average=total/counter;
					var amount = 0;
					var mode = 0;
					avgs[j]=average;
					 for(var ayy=1; ayy< ans.length; ayy++){
						 
                        if(ans[ayy] > amount){
                                amount = ans[ayy];
								mode = ayy;
						}
								 
					}
					modes[j]=mode;	
						
					
					
				}
				
				
				//////////////////////////////////////////////////////////// 
				
				
				
				
				//loop again
				//get data
				//somehow save it?
				//console.log("Quiz: "+cat);
			for(var pr = 0;pr<avgs.length;pr++){
				//console.log("Question: "+pr+"   Average: "+ avgs[pr]+ "    Mode: "+ modes[pr]);
				}
				
				
				return res.end(JSON.stringify(aData));
			});
		}

	
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
  console.log("plotting statistics");
  
  var nameofClass = req.param('classname');
  var searchQuiz = req.param('quiz');
  var courseCodes = req.param('code');
  console.log(nameofClass +" "+  searchQuiz);

  //array of courses for the teacher
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
    findStudents();
  }

  for(var gradesize = 0; gradesize < 20 ; gradesize++){
    grade[gradesize] = 0;
  }

  function findStudents(){
    User.find({ 'profileType': 'Student', 'courseCode': courseCodes}).lean().exec(function(err, users) {  
      for (var i = 0; i < users.length; i++) {           
          console.log("STUDENTS: " +users[i].userName);  
          if (i === users.length -1 ) {
            findcount = true;
          } 
          findGrades(users[i], courseCodes);
      }
    });
  }

   //find all grades for the course code
  function findGrades(givenstudent, course){
    StudentGrades.find({'student.studentName' : givenstudent.userName}).lean().exec(function(err, grades) { 
        //lookup a test

        for (var i = 0; i < grades.length;  i++) {
            // console.log(grades[i].category);
            for (var c = 0; c < grades[i].student.courses.length; c++){
                //see if the test has a category that the teacher is looking for
                if(grades[i].category === searchQuiz){
                  // console.log("Current course code: "+ courseCodes);
                    //see if test has a course code that matches the teachers 
                  console.log(grades[i].student.courses[c]);
                   if(grades[i].student.courses[c] == courseCodes){                    
                    console.log("COURSES: "+ grades[i].student.courses[0]);

                    //Get the amount of questions in the quiz
                    datagraph.size = grades[i].analytics.length;
                    var questionSize =  grades[i].analytics.length;
                    console.log("Question size:" + grades[i].analytics.length); 
                    
                    //iterate through analytics and see if attempt = 1
                       for (var analytics = 0; analytics< questionSize; analytics++){
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

//Isabel- send emails to Admins for resource request
exports.email = function(req,res){
 
  var data = req.body;
  var message = {

    //sender info
    from: data.email,

    // Send to Admin
    to: 'lwojo@ufl.edu',

    // Subject of the message
    subject: 'Resource Request', 

    //text
    text: 'Subject: '+ data.subject + '\nSubheading: ' + data.subheading + '\nLink: ' + data.link  + '\nComments: ' + data.comments

    };

    // console.log('Sending Mail');
    // Sending Mail
    transport.sendMail(message, function(error){
      if(error){
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
exports.parseClicks = function(req, res) {

    Resource.find({}).sort({clicks: -1}).exec(function(err, subs) {
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
