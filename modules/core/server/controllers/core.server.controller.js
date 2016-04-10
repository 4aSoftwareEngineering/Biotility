'use strict';


var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport();
var mongoose = require('mongoose'),

    QuizQuestion = mongoose.model('QuizQuestion'),
    User = mongoose.model('User'),
    Subject = mongoose.model('Subject'),
    Resource = mongoose.model('Resource'),
    StudentGrades = mongoose.model('StudentGrades'),
    SubHead = mongoose.model('SubHead');

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
 var CronJob = require('cron').CronJob;
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


exports.sendMail = function(req, res) {

    var data = req.body;

    transporter.sendMail({
        from: 'bio@biotility.com',
        to: data.contactEmail,
        subject: 'Biotility: Course code ',
        text: 'The course code for you to use is 1234'
    });
    res.json(data);
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
				//make arrar of modes
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

exports.plot = function(req,res){
    console.log("PLOTLY "+req.user.courses.length );
    // console.log("COURSE GIVEN: " + req.course);
    // var params = req.body; 
    // console.log("PLOTLY "+params.person.user.courses.length );
    // console.log("COURSE GIVEN: " + req.param('given'));
    var searchCourse = req.param('given');
    var num = [];
    var classes = [];
    var grade = [];
    var xside = [];
    // var datagraph = [];
       
    //find all the courses   
    for(var i = 0; i < req.user.courses.length ; i++){
        num.push(req.user.courses[i].number);
    }  

    //find all the students in that course
    var findcount = false; 
    console.log("AMOUNT:" + req.user.courses.length);
    for(var s = 0; s < req.user.courses.length ; s++){
        
        findStudents(num[s]);
    }

    for(var gradesize = 0; gradesize < 20 ; gradesize++){
        grade[gradesize] = 0;
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

                        //iterate through analytics and see if attempt = 1
                           for (var analytics = 0; analytics< grades[i].analytics.length; analytics++){
                                //console.log("firstIncorrect: "+ grades[i].analytics[0].firstIncorrect);
                                //if it is equal to one add it to the correct array 
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
            // console.log("FINDCOUNT: " + findcount);

             
             



            // for(var results = 0; results < grade.length ; results++){
                // console.log("RESULTS: " + grade[results]);
            // } 

            return res.end(JSON.stringify(grades));
        });

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

            return res.end(JSON.stringify(users));
        });
    }

    //actual plot
    function callgraph(datagraph){
         console.log("DATAGRAPH");
           for(var size = 0; size < 20 ; size++){
               console.log(datagraph[size]);
            }

            for(var xaxis = 1; xaxis < 20; xaxis++){
                xside[xaxis]  = xaxis;
            }



        var data = [
          {
            x: xside,
            y: datagraph,
            type: "bar"
          }
        ];

        var graphOptions = {title: searchCourse, filename: "GRADES", fileopt: "overwrite"};
        plotly.plot(data, graphOptions, function (err, msg) {
            console.log(msg);
        });
    }



    //reset the data array
    


    //find all grades for the course code
    // function findGrades(givenstudent, course){
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
    //                             //console.log("firstIncorrect: "+ grades[i].analytics[0].firstIncorrect);
    //                             //if it is equal to one add it to the correct array 
    //                             if(grades[i].analytics[analytics].attempts === 1){
    //                                 console.log("you got it right");
    //                                 grade[analytics] = grade[analytics]+1;
    //                             }
    //                         }
    //                    }
    //                 }
    //             }                
    //         }
        

    //          for(var results = 0; results < grade.length ; results++){
    //             console.log("RESULTS: " + grade[results]);
    //         } 

    //         return res.end(JSON.stringify(grades));
    //     });
    // }

    // var datagraph=[12,13,14,13,12,11];





   


    // console.log("GRADES: ");
    //in each student that matches go to the other database studentgrades and see their scores.
    // function findGrades(student, course){
    //     StudentGrades.find({'student.studentName' : student.userName }).lean().exec(function(err, grades) { 
    //         console.log("AMOUNT: "+ grades.length);  
    //         for (var i = 0; i < grades.length;  i++) { 
    //             for (var c = 0; c< grades[i].student.courses.length; c++){
    //                 if (grades[i].student.courses[c] === course){       
    //                 // var size = Object.keys(grades[i].student.analytics).length;
    //                 // console.log("Size: "+ size); 
    //                 //     for(var j=0; j < size; j++){
    //                 //         console.log("Name: "+ grades[i].student.studentName);  
    //                 //         console.log("analytics: "+ grades[i].student.analytics); 
    //                 //     } 
    //                 }

    //             }                
    //         }
    //         return res.end(JSON.stringify(grades));
    //     });
    // }

    //find the students in each class
    //check if their attempt for each question is 1
        //if so add 1 to that location in array
    //if not move to next question

    
           
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
