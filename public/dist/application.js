'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function () {
  // Init module configuration options
  var applicationModuleName = 'mean';
  var applicationModuleVendorDependencies = ['ngResource', 'ngAnimate', 'ngMessages', 'ui.router', 'ui.bootstrap', 'ui.utils', 'angularFileUpload','angular-loading-bar', 'chart.js'];

  // Add a new vertical module
  var registerModule = function (moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  };

  return {
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: applicationModuleVendorDependencies,
    registerModule: registerModule
  };
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider', '$httpProvider',
  function ($locationProvider, $httpProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');

    $httpProvider.interceptors.push('authInterceptor');
  }
]);

angular.module(ApplicationConfiguration.applicationModuleName).run(["$rootScope", "$state", "Authentication", function ($rootScope, $state, Authentication) {

  // Check authentication before changing state
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    if (toState.data && toState.data.roles && toState.data.roles.length > 0) {
      var allowed = false;
      toState.data.roles.forEach(function (role) {
        if (Authentication.user.roles !== undefined && Authentication.user.roles.indexOf(role) !== -1) {
          allowed = true;
          return true;
        }
      });

      if (!allowed) {
        event.preventDefault();
        if (Authentication.user !== undefined && typeof Authentication.user === 'object') {
          $state.go('forbidden');
        } else {
          $state.go('authentication.signin');
        }
      }
    }
  });

  // Record previous state
  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    if (!fromState.data || !fromState.data.ignoreState) {
      $state.previous = {
        state: fromState,
        params: fromParams,
        href: $state.href(fromState, fromParams)
      };
    }
  });
}]);

//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash && window.location.hash === '#_=_') {
    if (window.history && history.pushState) {
      window.history.pushState('', document.title, window.location.pathname);
    } else {
      // Prevent scrolling by storing the page's current scroll offset
      var scroll = {
        top: document.body.scrollTop,
        left: document.body.scrollLeft
      };
      window.location.hash = '';
      // Restore the scroll offset, should be flicker free
      document.body.scrollTop = scroll.top;
      document.body.scrollLeft = scroll.left;
    }
  }

  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use Applicaion configuration module to register a new module
//console.log("Core Ran here");
ApplicationConfiguration.registerModule('core');
ApplicationConfiguration.registerModule('core.admin', ['core']);
ApplicationConfiguration.registerModule('core.admin.routes', ['ui.router']);

//register module for quiz is ran twice, had an error where quiz.client.module didn't work but left it there for sake of clarity
//ApplicationConfiguration.registerModule('quiz');

'use strict';

// Use Applicaion configuration module to register a new module
//For whatever reason this doesn't work... Added ApplicationConfiguration.registerModule('quiz'); to the core.client.js file
ApplicationConfiguration.registerModule('quiz', ['ngFileUpload']);

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users', ['core']);
ApplicationConfiguration.registerModule('users.admin', ['core.admin']);
ApplicationConfiguration.registerModule('users.admin.routes', ['core.admin.routes']);

'use strict';

// Setting up route
angular.module('core.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin', {
        abstract: true,
        url: '/admin',
        template: '<ui-view/>',
        data: {
          roles: ['admin']
        }
      });
  }
]);

'use strict';

// This file contains all of the physical client-side URLs and the HTML views that they correspond to.

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function($injector, $location) {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });
    // Home state routing
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'modules/core/client/views/home.client.view.html'
      })
      .state('quiz', {
        url: '/{courseName:.+}/quiz',
        templateUrl: 'modules/quiz/client/views/quizTemplate.client.view.html'
      })
      .state('quiz.results', {
        url: '/results',
        templateUrl: 'modules/quiz/client/views/quizResults.client.view.html',
        params: {
          correctScore: null,
          numQuestion: null,
          category: null,
        }
      })
      .state('resources', {
        url: '/{courseName:.+}/resources',
        templateUrl: 'modules/core/client/views/resources.client.view.html'
      })
      .state('question_upload', {
        url: '/admin/question_upload',
        templateUrl: 'modules/quiz/client/views/quizUpload.client.view.html'
      })
      .state('question_edit', {
        url: '/admin/question_edit',
        templateUrl: 'modules/core/client/views/data.questions.client.view.html'
      })
      .state('question_view', {
        url: '/admin/question_edit/:questionId',
        templateUrl: '/modules/core/client/views/view-question.client.view.html'
      })
      .state('question_create', {
        url: '/admin/question_add/new',
        templateUrl: '/modules/core/client/views/create-question.client.view.html'
      })
      .state('studentprofile', {
        url: '/student/{userName:.+}',
        templateUrl: 'modules/core/client/views/profile.client.view.html'
      })
      .state('teacherprofile', {
        url: '/teacher/{userName:.+}',
        templateUrl: 'modules/core/client/views/teacherprofile.client.view.html'
      })
      .state('adminprofile', {
        url: '/admin/{userName:.+}',
        templateUrl: 'modules/core/client/views/adminprofile.client.view.html'
      })
      .state('userData', {
        url: '/data/users',
        templateUrl: 'modules/core/client/views/data.users.client.view.html'
      })
      .state('about', {
        url: '/about',
        templateUrl: 'modules/core/client/views/about.client.view.html'
      })
      .state('contact', {
        url: '/contact',
        templateUrl: 'modules/core/client/views/contact.client.view.html'
      })
      .state('bad-request', {
        url: '/bad-request',
        templateUrl: 'modules/core/client/views/400.client.view.html',
        data: {
          ignoreState: true
        }
      })
      .state('not-found', {
        url: '/not-found',
        templateUrl: 'modules/core/client/views/404.client.view.html',
        data: {
          ignoreState: true
        }
      })
      .state('forbidden', {
        url: '/forbidden',
        templateUrl: 'modules/core/client/views/403.client.view.html',
        data: {
          ignoreState: true
        }
      });
  }
]);

'use strict';

angular.module('core').controller('UserData', ['$scope', '$http',
    function($scope, $http) {
      $http.get('/api/data/users')
      .success(function(res){
      	$scope.data = res;
      });
  }
]);

// This controller simply retrieves all quiz questions from the DB
angular.module('core').controller('QuestionData', ['$scope', '$http',
    function($scope, $http) {
      $http.get('/api/data/questions')
      .success(function(res){
      	$scope.data = res;
      });
      
		$scope.deleteQuestion = function(index) {
		  $scope.data.splice(index, 1);
		};
      
  	}
]);

// This controller defines all of the quiz question CRUD DB functions -RB
// Used for admin capability to add/edit/delete individual questions 
angular.module('core').controller('QuestionControl',['$scope', '$http', '$state', '$location', '$stateParams', 'QuizQuestions',
	function($scope, $http, $state, $location, $stateParams, QuizQuestions){
		// get full list of quiz questions from DB 
		$scope.findQuestions = function(){
			QuizQuestions.loadQuestions().then(function(response) {
            	$scope.questions = response.data;
        	});
		};
		
		// pull up individual question details for viewing/editing
		$scope.findOneQuestion = function(question_obj){
			var id = $stateParams.questionId;	//id of current question
			console.log("id is " + id);
			$http.get('/api/data/questions/' + id)
				.then(function(response){
					$scope.question = response.data;
				}, function(error){
          			$scope.error = 'Unable to get question!\n' + error;
				});
		};
		
		// add a new quiz question to the DB 
		$scope.createQuestion = function(isValid){
			if(!isValid){
				return false;
			}
			// Multiple Answer question: 
			if($scope.type === 'MA'){
				var quizQuestion = {
					category: $scope.category,
				    type: $scope.type,
				    text: $scope.qtext,
				    answers: {
				        MA: {
				        	present: [
				        		$scope.ma3,
				        		$scope.ma1,
				        		$scope.ma5,
				        		$scope.ma2,
				        		$scope.ma4
				        	],
				        	correct: [
				        		$scope.ma1,
				        		$scope.ma2,
				        		$scope.ma3,
				        		$scope.ma4,
				        		$scope.ma5
				        	],
				        },
				        MCTF: [
				        	$scope.mc1,
				        	$scope.mc2,
				        	$scope.mc3,
				        	$scope.mc4,
				        	$scope.mc5
				        ]
				    },
				    hint: $scope.hint,
				    link: $scope.link
				};
			} else if($scope.type === 'TF') {
				// True/False quiz question:
				var quizQuestion = {
					category: $scope.category,
				    type: $scope.type,
				    text: $scope.qtext,
				    answers: {
				        MCTF: [],
				        correct: $scope.correct
				    },
				    hint: $scope.hint,
				    link: $scope.link
				};
			} else {
				// Single Choice quiz question: 
				var quizQuestion = {
					category: $scope.category,
				    type: $scope.type,
				    text: $scope.qtext,
				    answers: {
				        MCTF: [
				        	$scope.mc1,
				        	$scope.mc2,
				        	$scope.mc3,
				        	$scope.mc4,
				        	$scope.mc5
				        ],
				        correct: $scope.correct
				    },
				    hint: $scope.hint,
				    link: $scope.link
				};
			}
	
			// Save the question to DB
			$http.post('/api/data/questions', quizQuestion)
				.then(function(response){
					//redirect back to list of all questions if successful
					$scope.findQuestions();	// refresh the list 
          			$state.go('question_edit', { successMessage: 'Question succesfully added!' });
				}, function(error){
          			$scope.error = 'Unable to save question!\n' + error;
				});
		};
		
		// Save new details to an existing quiz question in DB 
		$scope.updateQuestion = function(question_obj, isValid){
			var id = question_obj._id;	//id of current question
			if (!isValid){
				return false;
			}
			if($scope.type === 'MA'){
				var quizQuestion = {
					category: $scope.category,
				    type: $scope.type,
				    text: $scope.qtext,
				    answers: {
				        MA: {
				        	present: [
				        		$scope.ma3,
				        		$scope.ma1,
				        		$scope.ma5,
				        		$scope.ma2,
				        		$scope.ma4
				        	],
				        	correct: [
				        		$scope.ma1,
				        		$scope.ma2,
				        		$scope.ma3,
				        		$scope.ma4,
				        		$scope.ma5
				        	],
				        },
				        MCTF: [
				        	$scope.mc1,
				        	$scope.mc2,
				        	$scope.mc3,
				        	$scope.mc4,
				        	$scope.mc5
				        ]
				    },
				    hint: $scope.hint,
				    link: $scope.link
				};
			} else if($scope.type === 'TF') {
				var quizQuestion = {
					category: $scope.category,
				    type: $scope.type,
				    text: $scope.qtext,
				    answers: {
				        MCTF: [],
				        correct: $scope.correct
				    },
				    hint: $scope.hint,
				    link: $scope.link
				};
			} else {
				var quizQuestion = {
					category: $scope.category,
				    type: $scope.type,
				    text: $scope.qtext,
				    answers: {
				        MCTF: [
				        	$scope.mc1,
				        	$scope.mc2,
				        	$scope.mc3,
				        	$scope.mc4,
				        	$scope.mc5
				        ],
				        correct: $scope.correct
				    },
				    hint: $scope.hint,
				    link: $scope.link
				};
			} 
			
			// save it in the DB 
			$http.put('/api/data/questions/' + id, quizQuestion)
				.then(function(response){
					//redirect to list if successful
					$scope.findQuestions();	// refresh the list 
          			$state.go('question_edit', { successMessage: 'Question succesfully added!' });
				}, function(error){
          			$scope.error = 'Unable to save question!\n' + error;
				});
		};
		
		// remove a quiz question from DB
		$scope.removeQuestion = function(question_obj){
			var id = question_obj._id;	//id of current question
			//.delete map to service
			$http.delete('api/data/questions/' + id)
				.success(function(response){
					//redirect to list if successful
					$scope.findQuestions();	// refresh the list 
          			$state.go('question_edit', { successMessage: 'Question succesfully deleted!' });
				}).error( function(response){
          			$scope.error = 'Unable to delete question!\n' + response;
					console.log(response);
				});
		};
	}
]);

angular.module('core').controller('SubjectData', ['$scope', '$http',
    function($scope, $http) {
      $http.get('/api/parse/subjects')
      .success(function(res){
      	$scope.data = res;
      });
  }
]);

//might not be necessary-Eric G.
angular.module('core').controller('ResourceData', ['$scope', '$http',
    function($scope, $http) {
      $http.get('/api/parse/resources')
      .success(function(res){
        $scope.data = res;
      });
  }
]);

'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', '$location', 'Authentication', 'NavCrumbs',
  function($scope, $state, $location, Authentication, NavCrumbs) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;

    // Array of page changes for breadcrumb recall
    $scope.breadcrumb = NavCrumbs.breadcrumb;

    // On breadcrumb clicked
    $scope.click = function(crumb) {
      $location.url(crumb.url);
    };

    // Go to profile
    $scope.profile = function() {

      // routing depending on profile type
      if ($scope.authentication.user.profileType === 'Teacher') {
        $location.url('/teacher/' + $scope.authentication.user.userName);
      } else if ($scope.authentication.user.profileType === 'Admin'){
        $location.url('/admin/' + $scope.authentication.user.userName);
      } else {
        $location.url('/student/' + $scope.authentication.user.userName);

      }
    };

    

    // logout: set current auth user to null
    $scope.logout = function() {
      $scope.authentication.user = null;
      $location.url('/');
    };

  }
]);

'use strict';

angular.module('core').controller('MainController', ['$scope', '$state', '$location', 'Authentication', '$http', 'Subjects', 'Users',

    function($scope, $state, $location, Authentication, $http, Subjects, Users) {

        $scope.ready = function() {
            $scope.carousel({
                interval: 1200
            });
        };

        // This provides Authentication context.
        $scope.authentication = Authentication;

        Subjects.loadSubjects().then(function(response) {
            $scope.subjects = response.data;
            //console.log($scope.subjects);
        });

        $scope.gotoQuiz = function(subjectObj) {
            $location.path('/' + subjectObj.name + '/quiz');
        };

        $scope.gotoResource = function(subjectObj) {
            $location.path('/' + subjectObj.name + '/resources');
        };



        // $scope.codeReset = function(){
        //      console.log("cron go");
        //     var route = '/api/data/cron';
        //     $http.get(route).success(function (req, res) {

        //     });
        // };


    }
]);


angular.module('core').controller('SubjectController', ['$scope', '$http', '$state', '$location', 'Authentication', '$stateParams', 'Resources', 'Subjects', 'SubHeads', '$window',
    function($scope, $http, $state, $location, Authentication, $stateParams, Resources, Subjects, SubHeads, $window) {

        // This provides Authentication context.
        $scope.authentication = Authentication;

        //Remember the subjected we are in
        $scope.subject = $stateParams.courseName;

        //some variables for the resource view
        $scope.success = null;
        $scope.error = null;

        //Checks wheter or not user is admin to allow edit controls
        if($scope.authentication.user == null) {
            $scope.editMode = false;
        }
        else {
            if($scope.authentication.user.profileType === 'Admin') {
                $scope.editMode = true;
            }
        }

        //Flags used when editing
        $scope.updateMode = false;
        $scope.ResourceField = true;
        $scope.isAdmin = false;

        //Load Subjects
        Subjects.loadSubjects().then(function(response) {
            $scope.subjects = response.data;
        });

        //Load all the resources from the database
        Resources.loadResources().then(function(response) {
            $scope.resources = response.data;
        });

        //Load all the subheadings from the database
        SubHeads.loadSubHeads().then(function(response) {
            $scope.subHeads = response.data;
        });

        //Used to create a new Resource on database
        $scope.addResource = function() {
            $scope.newResource.clicks = 0;
            var name = $scope.newResource.title;

            $http.post('api/data/resources', $scope.newResource).success(function(response) {
                Resources.loadResources().then(function(response) {
                    $scope.resources = response.data;
                    $scope.success = name + ' Successfully Added.';
                });
            }).error(function(response) {
                $scope.error = name + ' Unsuccessfully added.';
            });

            $scope.newResource = null;
        };

        //Used to delete a Resource from the database
        $scope.deleteResource = function(resource_obj) {
            var id = $scope.deleteResourceObj._id;
            var name = $scope.deleteResourceObj.title;
            $http.delete('api/data/resources/' + id).success(function(response) {
                Resources.loadResources().then(function(response) {
                    $scope.resources = response.data;
                });
                $scope.success = name + ' Successfully Deleted.';
            }).error(function(response) {
                $scope.error = name + ' Unsuccessfully Deleted.';
            });

            $scope.newResource = null;
        };

        //Preps Modal with data of resource to delete
        $scope.getDeleteResource = function(resource_obj) {
            $scope.deleteResourceObj = resource_obj;
        };

        //Used to update a Resource from the database
        $scope.updateResource = function(resource_obj) {
            var id = resource_obj._id;
            var name = resource_obj.title;
            $http.put('api/data/resources/' + id, $scope.newResource).success(function(response) {
                $scope.newResource = {};
                $scope.updateMode = false;
                $scope.success = name + ' Successfully Edited.';
            }).error(function(response) {
                $scope.error = name + ' Unsuccessfully Edited.';
            });
        };

        //Angular SubHeading Functions like the ones above
        $scope.addSubHead = function() {
            var name = $scope.newSubHead.title;
            $http.post('api/data/subHeads', $scope.newSubHead).success(function(response) {
                SubHeads.loadSubHeads().then(function(response) {
                    $scope.subHeads = response.data;
                });
                $scope.success = name + ' Successfully Added.';
            }).error(function(response) {
                $scope.error = $scope.newSubHead.title + ' Unsuccessfully Added.';
            });

            $scope.newSubHead = null;
        };
        $scope.deleteSubHead = function(subHead_obj) {
            var id = $scope.deleteSubHeadObj._id;
            var name = $scope.deleteSubHeadObj.title;
            $http.delete('api/data/subheads/' + id).success(function(response) {
                SubHeads.loadSubHeads().then(function(response) {
                    $scope.subHeads = response.data;
                });
                $scope.success = name + ' Successfully Deleted.';
            }).error(function(response) {
                $scope.error = name + ' Unsuccessfully Deleted.';
            });

            $scope.newResource = null;
        };
        $scope.getDeleteSubHead = function(subHead_obj) {
            $scope.deleteSubHeadObj = subHead_obj;
        };
        $scope.updateSubHead = function(subHead_obj) {
            var id = subHead_obj._id;
            $http.put('api/data/subheads/' + id, $scope.newSubHead).success(function(response) {
                $scope.success = $scope.newSubHead.title + ' Successfully Edited.';
                $scope.newSubHead = {};
                $scope.updateMode = false;
            }).error(function(response) {
                $scope.error = $scope.newSubHead.title + ' Unsuccessfully Edited.';
            });
        };

        //Used to Update Angular Parameters
        $scope.editResource = function(resource_obj) {
            $scope.updateMode = true;
            $scope.newResource = resource_obj;
            $scope.updateID = resource_obj._id;
            $scope.ResourceField = true;
            $scope.setEditHeading();

        };
        $scope.editSubHead = function(subHead_obj) {
            $scope.updateMode = true;
            $scope.newSubHead = subHead_obj;
            $scope.updateSubHeadID = subHead_obj._id;
            $scope.ResourceField = false;
            $scope.setEditHeading();
        };

        //Clears all fields, including the SubHead field        
        $scope.clearResourceField = function() {
            $scope.newResource = {};
            $scope.newSubHead = {};
            $scope.updateMode = false;
            $scope.setEditHeading();
        };

        //Sets text for edit panel heading
        $scope.setEditHeading = function() {
            if($scope.updateMode === false) {
                $scope.editHeading = "Create A New Heading / Link";
            }
            else {
                $scope.editHeading = "Edit An Existing Heading / Link";
            }
        };

        //Intilized EditHeading for inital setting
        $scope.setEditHeading();

        //Clocks pop-up messages
        $scope.clearSuccessMessage = function() {
            $scope.success = null;
        };
        $scope.clearErrorMessage = function() {
            $scope.error = null;
        };

        //Whenever student account clicks link, resource's click param incremented
        $scope.recordClick = function(resource_obj,index,link_url) {
            var id = resource_obj._id;
            var name = resource_obj.title;
            if($scope.authentication.user !== null) {
                if($scope.authentication.user.profileType === 'Student') {
                    $http.put('api/data/resources/click/' + id, resource_obj).success(function(response) {
                    }).error(function(response) {});
                }
            }
            $scope.resources[index].clicks = $scope.resources[index].clicks + 1;
            $window.open(link_url, '_blank');
        };//End Resource editing functions and vars

        $scope.startQuiz = function() {
            $location.path('/' + $scope.subject + '/quiz');
        };
    }
]);


angular.module('core').controller('authController', ['$scope', '$state', '$location', 'Users', 'Authentication', '$http',
    function($scope, $state, $location, Users, Authentication, $http) {
        //This is a min config controller for authenticating admin/teacher features only
        // It defines $scope flags that can be used for hiding/showing admin or teacher only content
        $scope.authentication = Authentication;
        $scope.user = $scope.authentication.user;

        $scope.isTeacher = false;
        $scope.isAdmin = false;

        //Set flags to true if admin or teacher 
        if ($scope.authentication.user.profileType === "Admin") {
            console.log("I am a admin");
            $scope.isAdmin = true;
        } else if ($scope.authentication.user.profileType === "Teacher") {
            console.log("I am a teacher");
            $scope.isTeacher = true;
        }
    }
]);


angular.module('core').controller('ProfileController', ['$scope', '$state', '$location', 'Users', 'Authentication', '$http', 'Subjects', 'Temp', 'plotly', 'ResourceClicks', 'Comments', 'Upload',
    function($scope, $state, $location, Users, Authentication, $http, Subjects, Temp, plotly, ResourceClicks, Comments, Upload) {

        $scope.mikes = 0;













        $scope.myFunction = function(){
            console.log($scope.mikes);
            // Split these out so they are easy to log and debug
            var path = '/api/its' + i;

            // This must mirror the structure expected in your document for the element
            // Therefore "comments" is represented as an array of objects, even
            // where this is only one.
            var data = {
                comments: [{
                    words: $scope.comment,
                    userId: $scope.getCurrentUser().name
                }]
            };

            // Call service with response
            $http.put(path,data).success(function(stuff){
                document.location.reload(true);
            });
        }


        $scope.myFunction = function(mikes){
            console.log('Hi Hi Hi');
            console.log($scope.mikes);
            var a = parseInt($scope.mikes);
            $scope.user.courseCode.push(a);
            var route = '/api/auth/signup/student';

            $http.post(route, $scope.credentials).success(function(response) {

                // If successful we assign the response to the global user model
                $scope.authentication.user = response;

                // And redirect to the home page
                $location.url('/');
            }).error(function(response) {
                console.log("Invalid (Sign up)", response);
                //sets error if invalid info
                alert("Use a valid course code. For testing, check the database for a teacher and use their course numbers.");

                $scope.error = response.message;
            });
        };


        //Isabel- modal for resource request 
        $(document).ready(function() {
            $("#myBtn").click(function() {
                $("#myModal").modal();
            });
        });

        $scope.getComs = function() {


            $http.get('/api/leave_comment')
                .success(function(res) {
                    console.log(res);
                });

        }
        Comments.loadComments().then(function(response) {
            $scope.Comments = response.data;
        });




        $scope.authentication = Authentication;
        $scope.user = $scope.authentication.user;
        //to check the type that the user is
        $scope.oneAtATime = true;
        $scope.isTeacher = false;
        $scope.isAdmin = false;
        $scope.profileVisible = true;

        //checks if teacher
        if ($scope.authentication.user.profileType === "Teacher") {
            // console.log("I am a teacher");
            $scope.isTeacher = true;
        } else if ($scope.authentication.user.profileType === "Admin") {
            // console.log("I am an admin");
            $scope.isAdmin = true;
        }

        //input to put courseNames
        $scope.input = {};

        //courseNums array
        $scope.input.courseNums = [];
        $scope.input.courseNames = [];
        $scope.input.coursePeriods = [];

        //Load subjects for admin chart selection
        Subjects.loadSubjects().then(function(response) {
            $scope.subjects = response.data;
        });
        var ctx1;
        var myClicksChart;
        if($scope.authentication.user.profileType === "Admin") {
            ctx1 = $("#myClicksChart").get(0).getContext("2d");
        }
        //setup chart and function for view clicks
        $scope.viewClicks = function(subject){
            var route = '/api/data/resources/clicks';
            $http.get(route, {params:{"subject": subject}}).then(function(res) { 
                if(myClicksChart !==  undefined){
                    myClicksChart.destroy();
                }
                var clicks = res.data;
                var click_labels = [];
                var click_data = [];
                for(var i = 0; i < clicks.length; i++) {
                    click_labels.push(clicks[i].name);
                    click_data.push(clicks[i].clicks);
                }
                  var data = {
                    labels: click_labels,
                    datasets: [
                        {
                            label: "Number of Clicks",
                            fillColor: "rgba(220,220,220,0.5)",
                            strokeColor: "rgba(220,220,220,0.8)",
                            highlightFill: "rgba(220,220,220,0.75)",
                            highlightStroke: "rgba(220,220,220,1)",
                            data: click_data
                        },
                    ]
                  };
                myClicksChart = new Chart(ctx1).Bar(data);
            });
        };
        var ctx2;
        var myQuizStatsChart;
        if($scope.authentication.user.profileType === "Admin") {
            ctx2 = $("#myQuizStatsChart").get(0).getContext("2d");
        }
        //setup chart and function for quiz statistics
        $scope.viewQuizStats = function(subject){
            var route = '/api/data/adminGrades';
            $http.get(route, {params:{"subject": subject}}).then(function(res) { 
                if(myQuizStatsChart !==  undefined){
                    myQuizStatsChart.destroy();
                }
                var labels = [];
                var questNames = [];
                for(var ques_names = 1; ques_names < res.data.question_names.length+1; ques_names++) {
                    labels.push("Question "+ ques_names);
                    questNames.push(ques_names+". "+res.data.question_names[ques_names-1]);
                }
                var data = {
                        labels: labels,
                        datasets: [
                            {
                                label: "Percent Correct",
                                fillColor: "rgba(204, 167, 148,0.5)",
                                strokeColor: "rgba(204, 167, 148,0.8)",
                                highlightFill: "rgba(204, 167, 148,0.75)",
                                highlightStroke: "rgba(204, 167, 148,1)",
                                data: res.data.perc_correct
                            }
                        ]
                    };
                myQuizStatsChart = new Chart(ctx2).Bar(data,{scaleOverride: true, scaleStartValue: 0, scaleStepWidth: 0.1, scaleSteps: 10});
                $scope.questNames = questNames;
                $scope.averageAttempts = res.data.avgs;
                $scope.firstIncorrect = res.data.modes;
            });

        };
	//This is to get the Course data for teacher and student 
        if ($scope.authentication.user.profileType !== "Admin") {
            //for each course in their schema
            $scope.authentication.user.courses.forEach(
                function(element, index, array) {
                    //stores each course Name and number of the course that a teacher has

                    $scope.input.courseNames.push(element.courseName);
                    $scope.input.courseNums.push(element.number);
                    $scope.input.coursePeriods.push(element.section);

                    //used for testing purposes to make sure a teacher has the correct courses
                    // console.log($scope.input.courseNums);
                }
            );
        }

        //Isabel- how I actuall populate the classes shown
        $scope.input.coursesComplete = $scope.authentication.user.courses;


        // credentials object
        $scope.credentials = {};
        $scope.credentials.courses = [];
        $scope.hello = 0;


        // array of class names
        $scope.classNames = [];
        $scope.Periods = [];
        $scope.classCodes = [];
        $scope.classQuiz = [];
        $scope.classPeriods = [];


        if ($scope.authentication.user.profileType !== "Admin") {
            //get course names
            var teachersCurrentClasses = $scope.authentication.user.courses;
            console.log(teachersCurrentClasses);
            for (var k = 0; k < teachersCurrentClasses.length; k++) {
                var label = teachersCurrentClasses[k].courseName;
                // var label = teachersCurrentClasses[k].courseName +" "+  teachersCurrentClasses[k].section;
                $scope.classQuiz.push(label);
                $scope.classCodes.push(teachersCurrentClasses[k].number);
                // console.log(teachersCurrentClasses[k].courseName);
            }
        }

        //get quiz names
        Subjects.loadSubjects().then(function(response) {
            $scope.subjects = response.data;

            // grab all the courses, and read their names.
            for (var i = 0; i < $scope.subjects.length; i++) {
                $scope.classNames.push($scope.subjects[i].name);
                //console.log("JHDKJAHSDKFJHA  " + $scope.subjects[i].name);
            }

            for (var j = 1; j < $scope.subjects.length; j++) {
                $scope.Periods.push("Period " + j);
                $scope.classPeriods.push("Period " + j);
            }

        });


        //Isabel- New Course Names
        $scope.newclassNames = ["Biotechnology 1",
            "Biotechnology 2",
            "Biotechnology 3",
            "PLTW Principles of Biomedical Science",
            "PLTW Human Body Systems",
            "PLTW Medical Interventions",
            "PLTW Biomedical Innovation",
            "Agricultural Biotechnology",
            "Biology",
            "Honors Biology",
            "AP Biology",
            "AICE Biology",
            "IB Biology",
            "Genetics",
            "Forensics",
            "Other"
        ];


        //Isabel AND MATT - change profile picture
        $scope.uploadFiles = function(file, errFiles) {
            console.log("uploading photo...");
            $scope.f = file;
            $scope.errFile = errFiles && errFiles[0];
            //Get file
            var data = {
                file: file
            };
            //Upload if file exists.
            if (file) {
                file.upload = Upload.upload({
                    url: '/photo_upload',
                    data: data
                });

                //File upload
                file.upload.then(function(response) {
                    //Change current picture to newly uploaded one!
                    console.log("Photo upload:", response.data.message);
                    if (response.status == 200) {
                        $(".user-pic").attr("src", response.data.url);
                    }
                });
            }
        };
	//this retrieves the subject's statistics from the server which retrieved it from the DB, and exports it to a excel file
		$scope.exportToCSV = function(subject) {
        var arrData = ["Cells", "Genetics", "Laboratory Skills and Applications", "Research & Scientific Method","General Topics","Applied Mathematics","Biotechnology Skills","Laboratory Equipment","Preparing Solutions","Biotech Careers","Applications","Chemistry & Biochemistry"];
        var CSV = "";
        var route = '/api/data/adminGrades';
        CSV+= "Statistics for "+subject + '\r\n\n';
        //for(var v=0;v<arrData.length;v++){
            
                //CSV+=arrData[v];
                //CSV+="";
                //var subject=arrData[v];
            //$http.get(route, {params:{"subject": subject}}).then(function(res) { 
            $http.get(route, {params:{"subject": subject}}).then(function(res) { 
                
                    for(var g=0;g<res.data.avgs.length;g++){
                    CSV += "question: "+g+"\n\n";
                    CSV += "averages , "+res.data.avgs[g]+" , ";
                    CSV += "modes , "+res.data.modes[g]+" , ";
                    CSV += "% correct , "+res.data.perc_correct[g]+"\n";
                    console.log(g);
                    }
                CSV+='\r\n\n';
                
        //}
            
        
                    
                //Set Report title in first row or line
                
                //CSV += "Statistics" + '\r\n\n';
                
               
            
                if (CSV == '') {        
                    alert("Invalid data");
                    return;
                }   
                
                //Generate a file name
                var fileName = "Statistics";
                var ReportTitle = "Quiz Statistics";
                
                fileName += ReportTitle.replace(/ /g,"_");   
                
                //Initialize file format you want csv or xls
                var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
                
                 
                
                
                var link = document.createElement("a");    
                link.href = uri;
                
                //set the visibility hidden so it will not effect on your web-layout
                link.style = "visibility:hidden";
                link.download = fileName + ".csv";
                
                //this part will append the anchor tag and remove it after automatic click
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                    
                });
            
                
        };
		
	
		//Isabel- add a course 
        $scope.add = function(course, period) {

            if (course !== '') {

                //Creates a new object to be used for user course schema
                var courseObj = {};
                courseObj.courseName = course;
                courseObj.content = "";
                courseObj.progress = "";
                courseObj.section = period;

                //Generate number when you add the course
                courseObj.number = Math.floor((Math.random() * 1000) + 1);
                //$scope.credentials.courses.push(courseObj);
                $scope.authentication.user.courses.push(courseObj);
                // console.log("new class " + courseObj.courseName);
            }


            $scope.authentication.user.courses.forEach(
                function(element, index, array) {
                    //$scope.authentication.user.courses.push(courseObj);
                    // console.log("current classes: " + element.courseName);
                });

            //to display on profile view
            $scope.input = {};
            //courseNums array
            $scope.input.courseNums = [];
            // for each course in their schema
            $scope.authentication.user.courses.forEach(
                function(element, index, array) {
                    //stores each course Name and number of the course that a teacher has
                    $scope.input.courseNums.push(element.courseName + " : " + element.number + " : " + element.section);
                    //used for testing purposes to make sure a teacher has the correct courses
                    // console.log("input class: " + $scope.input.courseNums);
                });

            // $scope.tester();
            // $scope.update();
            console.dir($scope);
            var route = '/api/users/' + $scope.authentication.user._id;

            $http.put(route, $scope.user.courses).success(function(response) {

                // If successful we assign the response to the global user model
                $scope.authentication.user = response;

                // And redirect to the home page
                $location.url('/');

            }).error(function(response) {
                // console.log("Unable to PUT.");
                console.dir(response);
                //sets error if invalid info
                //alert("Not updating.");

                $scope.error = response.message;
            });

            //reset what they see to empty
            $scope.toAdd = '';
        };

        //Isabel- teachers can update their settings
        $scope.settingsupdate = function(isValid) {

            // console.log("Changing Settings");
            $scope.error = null;

            // console.dir("scope: " + $scope);
            // console.log($scope.credentials.firstName);

            var route = '/api/users/' + $scope.authentication.user._id;

            //do if statements to allow users to not have to edit every single element and just pull from database what they did not change
            if ($scope.credentials.firstName !== undefined) {
                $scope.authentication.user.firstName = $scope.credentials.firstName;
            } else {
                // console.log("no first name");
            }


            if ($scope.credentials.lastName !== undefined) {
                $scope.authentication.user.lastName = $scope.credentials.lastName;
            } else {
                // console.log("no last name");
            }


            if ($scope.credentials.userName !== undefined) {
                $scope.authentication.user.userName = $scope.credentials.userName;
            } else {
                // console.log("no username");
            }

            if ($scope.credentials.email !== undefined) {
                $scope.authentication.user.email = $scope.credentials.email;
            } else {
                // console.log("no email");
            }


            if ($scope.credentials.password !== undefined) {
                $scope.authentication.user.password = $scope.credentials.password;
            } else {
                // console.log("no password");
            }


            $scope.authentication.user.displayName = $scope.authentication.user.lastName + ', ' + $scope.authentication.user.firstName;

            //check to make sure passwords match
            if ($scope.credentials.password === $scope.confirmpassword) {
                // console.log("Passwords match");
                $http.post(route, $scope.user).success(function(response) {

                    // If successful we assign the response to the global user model
                    $scope.authentication.user = response;

                    //redirect to the home page
                    //$location.url('/');
                }).error(function(response) {
                    // console.log("Unable to POST.");
                    // console.log(response);
                    console.dir("response: " + response);
                    //sets error if invalid info
                    //alert("Not updating.");

                    $scope.error = response.message;
                });
            } else {
                // console.log("Passwords do not match");
                //do not save, tell user to create matching passwords
                $("#settingsMoodal").modal();
            }
        };

        //Isabel- update function
        $scope.update = function() {
            $scope.error = null;

            var user = $scope.user;
            console.log("user= " + user.email);
            user.$update(function() {
                console.log("home controller update");
                // $location.path('/teacher/' + user._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };


        //Isabel- send email to Admin for request resource
        $scope.sendEmail = function(isValid) {
            // console.log("sending email for resources");
            // console.log("Subject: " + $scope.resource.subject);
            // console.log("Subject Details: " + $scope.resource.subjectdetails);
            // console.log("Link: " + $scope.resource.resourcelink);
            // console.log("Comments: " + $scope.resource.comments);

            //information from the form 
            var data = ({

                subject: $scope.resource.subject,
                subheading: $scope.resource.subjectdetails,
                link: $scope.resource.resourcelink,
                comments: $scope.resource.comments,
                email: $scope.resource.email
            });

            //send the actual data
            var route = '/api/data/email';
            $http.post(route, data).success(function(req, res) {
                console.log("sending email");
            });
        };


        //creates groups
        $scope.groups = [{
            title: 'Cells',
            content: 'Lesson 4: The Nucleus',
            progress: 0
        }, {
            title: 'Biology',
            content: 'Lesson 2: Ecosystems',
            progress: 25
        }, {
            title: 'Chemistry',
            content: 'Lesson 13: Electron Mobility',
            progress: 75
        }];

        $scope.items = ['Item 1', 'Item 2', 'Item 3'];

        $scope.status = {
            isFirstOpen: true,
            isFirstDisabled: false
        };

        $scope.$on('creation', function(event, args) {
            console.log(args);
            //console.log("controller2");
            $scope.test = "testing";
            console.log($scope.section);
            $scope.section = args.firstName;
            console.log($scope.section);

        });

        //gets student grades
        $scope.studentGrades = [];
        $http.get('/api/quiz_result')
            .success(function(res) {
                // console.log("quiz result: ", res);
                byStudent(res);
            });

        //gets student  grades by student and stores them
        var byStudent = function(allStudentGrades) {
            for (var i = 0; i < allStudentGrades.length; i++) {
                //console.log(allStudentGrades[i].studentName);
                //console.log($scope.user.userName);
                //console.log("BANG: " + allStudentGrades[i].studentName + " " + $scope.user.userName);
                if (allStudentGrades[i].studentName === $scope.user.userName) {
                    $scope.studentGrades.push(allStudentGrades[i]);
                    //TODO: "Applications" should be the name of the course, like "Biology"
                    //TODO: quiz should have a pass/fail variable, to determine if adding to progress.
                    /*
                    for (var j = 0; j < $scope.groups.length; j++) {
                        if (allStudentGrades[i].category === $scope.groups[j].title) {
                            if (allStudentGrades[i].pass == true) {
                                //add progress to group
                            }
                        }
                    }
                    */
                    if (allStudentGrades[i].category === "Applications") {
                        //have to hardcode this until what "applications" is, is resolved
                        $scope.groups[0].progress++;
                        //TODO: this should be:
                        /* if (allStudentGrades[i].pass == true) { */
                    }
                }
                // console.log($scope.studentGrades[i].studentName);

            }
            $scope.groups[0].progress *= 25;
        };

        //Isabel - bar graph
                $scope.viewStats = function(classname, code, quiz){
           
            // Plotly Stuff
            console.log("Passing: "+ classname);
            var route = '/api/data/plot';

            // var params = ({
            //     person: $scope.user, 
            //     quiz: quiz 

            // });

            $http.get(route, {params:{"person": $scope.user, "quiz": quiz, "classname": classname, "code": code}}).then(function(res) { 
                // your data
               //  console.log("ploting");
               //  console.log(res.data);
               // console.log(res.data.length);
                
                //get correct number of questions for X axis
                var label =[];
                for(var i = 0; i < res.data.length; i++){
                    var number = i+1;
                    label[i] = "Question " + number; 
                }

                // console.log(res);
                var ctx = $("#myChart").get(0).getContext("2d");
                // ctx.destroy();
                // ctx.canvas.width = 5;
                // ctx.canvas.height = 5;
                  var data = {
                    labels: label,
                    datasets: [
                        {
                            label: "Course Settings",
                            fillColor: "blue",
                            strokeColor: "rgba(220,220,220,0.8)",
                            // highlightFill: "rgba(220,220,220,0.75)",
                            // highlightStroke: "rgba(220,220,220,1)",
                            data: res.data
                        },
                    ]
                  };

                  var options = { 
                        responsive: false,
                        maintainAspectRatio: true,
                        barShowStroke : false
                    }

                  var myBarChart = new Chart(ctx).Bar(data,options);
                    }).then(function(error) {
                        console.log("Plot eror" + error);
                    });

            // if (parsedData.Item1 != "") {
            //     $("#nograpdata").show();
            // }

                  

            // Chart.defaults.global.responsive = true;

        };



        // Isabel- reset a single teachers code
        $scope.resetCodes = function() {

            var d = new Date();
            var dlog = d.getDate();
            // console.log("Date: "+dlog);

            var m = new Date();
            var mlog = d.getMonth();
            // console.log("Month: "+mlog);

            var h = new Date();
            var hlog = d.getHours();
            // console.log("Hour: "+ hlog);

            var mi = new Date();
            var milog = mi.getMinutes();
            // console.log("Miniute: "+milog);

            var s = new Date();
            var slog = s.getSeconds();


            //if so change all course arrays to empty
            if (dlog === 1 && mlog === 7 && hlog === 0 && milog === 0 && s === 0) {
                // if(dlog === 18 && mlog === 2 && hlog === 18 && milog === 22){

                Temp.parseUsers().then(function(response) {
                    $scope.users = response.data;
                    //dowload all current course codes
                    for (var i = 0; i < $scope.users.length; i++) {

                        while ($scope.users[i].courses.length > 0) {
                            $scope.users[i].courses.pop();
                        }

                        updateresetCodes($scope.users[i]);
                    }


                    function updateresetCodes(newuser) {

                        var route = '/api/users/no';

                        $scope.put(route, newuser.courses).success(function(response) {

                        }).error(function(response) {
                            console.log("Unable to PUT.");
                            console.dir(response);
                            $scope.error = response.message;
                        });

                    }
                });
            }
        };

        //Isabel - reset all the teachers code
        $scope.resetAllCodes = function() {
            //get all teachers

            //check to see if date is August 1st
            var d = new Date();
            var dlog = d.getDate();
            // console.log(dlog);

            var m = new Date();
            var mlog = d.getMonth();
            // console.log(mlog);

            //if so change all course arrays to empty

            if (dlog === 1 && mlog === 7) {
                // console.log("It's August 1st, time for a reset!");

                while ($scope.authentication.user.courses.length > 0) {
                    $scope.authentication.user.courses.pop();
                }


                var route = '/api/users/' + $scope.authentication.user._id;

                $http.put(route, $scope.user.courses).success(function(response) {

                    // If successful we assign the response to the global user model
                    $scope.authentication.user = response;

                    // And redirect to the home page
                    $location.url('/');

                }).error(function(response) {
                    console.log("Unable to PUT.");
                    console.dir(response);
                    $scope.error = response.message;
                });
            }
        };

    }
]);

'use strict';

/**
 * Edits by Ryan Hutchison
 * Credit: https://github.com/paulyoder/angular-bootstrap-show-errors */

angular.module('core')
  .directive('showErrors', ['$timeout', '$interpolate', function ($timeout, $interpolate) {
    var linkFn = function (scope, el, attrs, formCtrl) {
      var inputEl, inputName, inputNgEl, options, showSuccess, toggleClasses,
        initCheck = false,
        showValidationMessages = false,
        blurred = false;

      options = scope.$eval(attrs.showErrors) || {};
      showSuccess = options.showSuccess || false;
      inputEl = el[0].querySelector('.form-control[name]') || el[0].querySelector('[name]');
      inputNgEl = angular.element(inputEl);
      inputName = $interpolate(inputNgEl.attr('name') || '')(scope);

      if (!inputName) {
        throw 'show-errors element has no child input elements with a \'name\' attribute class';
      }

      var reset = function () {
        return $timeout(function () {
          el.removeClass('has-error');
          el.removeClass('has-success');
          showValidationMessages = false;
        }, 0, false);
      };

      scope.$watch(function () {
        return formCtrl[inputName] && formCtrl[inputName].$invalid;
      }, function (invalid) {
        return toggleClasses(invalid);
      });

      scope.$on('show-errors-check-validity', function (event, name) {
        if (angular.isUndefined(name) || formCtrl.$name === name) {
          initCheck = true;
          showValidationMessages = true;

          return toggleClasses(formCtrl[inputName].$invalid);
        }
      });

      scope.$on('show-errors-reset', function (event, name) {
        if (angular.isUndefined(name) || formCtrl.$name === name) {
          return reset();
        }
      });

      toggleClasses = function (invalid) {
        el.toggleClass('has-error', showValidationMessages && invalid);
        if (showSuccess) {
          return el.toggleClass('has-success', showValidationMessages && !invalid);
        }
      };
    };

    return {
      restrict: 'A',
      require: '^form',
      compile: function (elem, attrs) {
        if (attrs.showErrors.indexOf('skipFormGroupCheck') === -1) {
          if (!(elem.hasClass('form-group') || elem.hasClass('input-group'))) {
            throw 'show-errors element does not have the \'form-group\' or \'input-group\' class';
          }
        }
        return linkFn;
      }
    };
}]);

angular.module('quiz').directive('readCSVFile', ["$parse", function ($parse) {
  console.log("hello");
  return {
    restrict: 'A',
    scope: false,
    link: function(scope, element, attrs) {
            var fn = $parse(attrs.onReadFile);
            
      element.on('change', function(onChangeEvent) {
        var reader = new FileReader();
                
        reader.onload = function(onLoadEvent) {
          scope.$apply(function() {
            fn(scope, {$fileContent:onLoadEvent.target.result});
          });
        };

        reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
      });
    }
  };
}]);





'use strict';

angular.module('core').factory('authInterceptor', ['$q', '$injector',
  function ($q, $injector) {
    return {
      responseError: function(rejection) {
        if (!rejection.config.ignoreAuthModule) {
          switch (rejection.status) {
            case 401:
              $injector.get('$state').transitionTo('authentication.signin');
              break;
            case 403:
              $injector.get('$state').transitionTo('forbidden');
              break;
          }
        }
        // otherwise, default behaviour
        return $q.reject(rejection);
      }
    };
  }
]);

'use strict';

// Main service for holding persistent data
angular.module('core').service('Subjects',  ['$http', function($http) {

  // Array for question objects we have for the selected subject.
  this.questionsForSubject = [{}];

  // Load questions of a subject into the questions array.
  this.loadQuestions = function() {
    $http({
      method: 'GET',
      url: '/api/question-data/' // ADD subject name var
    }).success(function(res) {

    });
  };

  // A subject was clicked, time to parse the question data we need,
  // while the user is taken to the pre-quiz page.
  this.subjectClicked = function(subject) {
    var subjectName = this.getSubjectByName(subject);
    this.questionsForSubject = this.loadQuestions();
  };

  // Return a subject whose name is equal to the given name.
  this.getSubjectByName = function(subjectName) {

    this.subjects.forEach(function(elem, index, array) {
      if (elem.name === subjectName)
        return elem;
    });

    return null;
  };

  return {
    loadSubjects: function() {
      return $http({
        method: 'GET',
        url: '/api/parse/subjects'
      });
    }
  };

}]);

//passes in function to load questions from database
angular.module('core').service('QuizQuestions', ['$http', function($http) {

  return {
    loadQuestions: function() {
      return $http({
        method: 'GET',
        url: '/api/data/questions'
      });
    }
  };
}]);

//passes in function to load resources from database
angular.module('core').service('Resources', ['$http', function($http) {

  return {
    loadResources: function() {
      return $http({
        method: 'GET',
        url: '/api/parse/resources'
      });
    }
  };
}]);

angular.module('core').service('ResourceClicks', ['$http', function($http) {
  return {
    loadClicks: function() {
      return $http({
        method: 'GET',
        url: '/api/parse/resources/clicks'
      });
    }
  };
}]);
//passes in function to load subheadings from database
angular.module('core').service('SubHeads', ['$http', function($http) {

  return {
    loadSubHeads: function() {
      return $http({
        method: 'GET',
        url: '/api/parse/subheads'
      });
    }
  };

}]);
angular.module('core').service('Comments', ['$http', function($http) {

  return {
    loadComments: function() {
      return $http({
        method: 'GET',
        url: '/api/get_Comments'
      });
    }
  };

}]);


angular.module('core').service('Temp', ['$http', function($http) {

  return {
    parseUsers: function() {
      return $http({
        method: 'GET',
        url: '/api/parse/user'
      });
    }
  };

}]);

angular.module('core').service('plotly', ['$http', function($http) {

}]);


angular.module('core').service('NavCrumbs', [
  function() {
    this.breadcrumb = [{
      name: "Home",
      url: "/"
    }];
  }
]);

'use strict';

// Create the Socket.io wrapper service
angular.module('core').service('Socket', ['Authentication', '$state', '$timeout',
  function (Authentication, $state, $timeout) {
    // Connect to Socket.io server
    this.connect = function () {
      // Connect only when authenticated
      if (Authentication.user) {
        this.socket = io();
      }
    };
    this.connect();

    // Wrap the Socket.io 'on' method
    this.on = function (eventName, callback) {
      if (this.socket) {
        this.socket.on(eventName, function (data) {
          $timeout(function () {
            callback(data);
          });
        });
      }
    };

    // Wrap the Socket.io 'emit' method
    this.emit = function (eventName, data) {
      if (this.socket) {
        this.socket.emit(eventName, data);
      }
    };

    // Wrap the Socket.io 'removeListener' method
    this.removeListener = function (eventName) {
      if (this.socket) {
        this.socket.removeListener(eventName);
      }
    };
  }
]);

"use strict";

$(document).ready(function() {
    $('body').on('click', '#next.btn', function() {
        var hasError = angular.element("#quizError").scope().$parent.hasError;
        var isDone = angular.element("#quizError").scope().$parent.isDone;
        var isMC = angular.element("#quizError").scope().$parent.isMultipleChoice;

        //Clear radio btn.
        if (!hasError && !isDone && isMC) {
            setTimeout(function() {
                $('input[type="radio"]').prop('checked', false);
            }, 35);
        }
    });
});
'use strict';

// Quiz main controller - this work is a combination of Matt (4a)'s work and the old groupm 5c's work.
//The quiz feedback/comments are Spencer's.
angular.module('quiz').controller('QuizController', ['$rootScope', '$scope', '$location', '$stateParams', '$state', 'Authentication', '$http', '$window',
    function($rootScope, $scope, $location, $stateParams, $state, Authentication, $http, $window) {
        //Get questions for each category.
        console.log("Loading Qs:", $stateParams.courseName);
        //Matt
        //Account for slight variations in excel file course name differences.
        var courseName = $stateParams.courseName;
        switch (courseName) {
            case "Chemistry & Biochemistry":
                courseName = "Chemistry/Biochemistry";
                break;
            case "General Topics":
                courseName = "General Topics in Biotechnology";
                break;
            case "Laboratory Skills and Applications":
                courseName = "Laboratory Skills/Applications";
                break;
            case "Research and Scientific Method":
                courseName = "Research & Scientific Method";
                break;
        }
        $http.get('/api/quiz', {
            params: {
                "category": courseName
            }
        }).then(
            function(listOfQuestions) { //Checks to see if the value is correctly returned before printing out the console.
                byCategory(listOfQuestions.data);
            });


        $scope.authentication = Authentication;
        //Matt
        //Init variables.
        var max = 0;
        $scope.isDone = false; //checks if the quiz is finished ->switches models to done state
        $scope.quizStarted = false; //checks if quiz start button is triggered

        $scope.questions = [];
        $scope.index = -1;
        $scope.score = 0;
        $scope.analytics = [];
        $scope.numQuestion = 0;
        $scope.hasError = false;
        $scope.hasHint = false;
        $scope.hasStart = true;
        $scope.loggedIn = $scope.authentication.user ? true : false;
        $scope.currCategory = $stateParams.courseName;
        $scope.progress = 0;
        $scope.numOpts = 0;
        $scope.ansMA = [];
        $scope.answer = { val: -1 };
        //Matt
        //Used for when radio selection happens in MC questions.
        $scope.changehappened = function(data) {
            $rootScope.$emit('radioSel', data);
        };
        $rootScope.$on('radioSel', function(evt, data) {
            $scope.answer = data;
        });
        //
        //Matt
        //Start quiz
        $scope.start = function() {
            if (max === 0) {
                $scope.error = "No questions found.";
                $scope.hasError = true;
                $scope.hasStart = false;
            } else {
                console.log("Starting quiz.");
                $scope.quizStarted = true;
                $scope.hasStart = false;
                $scope.increment();
                max = $scope.questions.length - 1; // (Index of array starts as 0)
            }
        };


        //Matt
        //Check answer, log analytics.
        $scope.checkAnswer = function(answer) {
            console.log("Checking answer...");

            //Boolean values to see if there is no selection for true/false, multi. choice, and matching answer.
            var TF_NoSel = $scope.isTF && $scope.answer.val === -1;
            var MC_NoSel = $scope.isMultipleChoice && $scope.answer === -1;
            var MA_NoSel = $scope.isMA && $scope.ansMA.length < $scope.question.answers.MCTF.length;

            //No answer selected.
            if (TF_NoSel || MC_NoSel || MA_NoSel) {
                $scope.hasError = true;
                $scope.error = "Please select a valid option.";
                return;
            }

            //Create analytics obj.
            if (!$scope.analytics[$scope.index]) {
                console.log("Creating analytics...");

                $scope.analytics[$scope.index] = {};
                $scope.analytics[$scope.index].question = $scope.question;
                $scope.analytics[$scope.index].attempts = 1;

                //First attempt, make sure to show hint.
                $scope.hasHint = true;
            }

            var correct = $scope.question.answers.correct;
            var expected;

            //Check answer based on question type.
            //MA needs array comparison.
            if ($scope.isMultipleChoice)
                expected = $scope.question.answers.MCTF[correct - 1];
            else if ($scope.isTF) {
                answer = answer.val;
                expected = correct;
            } else if ($scope.isMA) {
                //Check MA questions.
                expected = $scope.question.answers.MA.correct;
                answer = [];

                //Letter array before conversion.
                console.log($scope.ansMA);

                //Convert answer's characters to numbers; A->1, B->2,...
                for (var i = 0; i < $scope.ansMA.length; i++) {
                    var letterIdx = $scope.ansMA[i];
                    var idx = $scope.charToNum(letterIdx.toLowerCase()) - 1;
                    var ansDesc = $scope.question.answers.MA.present[i];
                    answer[idx] = ansDesc;
                }

                //Make sure that same answer options were not selected.
                if (hasDuplicates($scope.ansMA)) {
                    $scope.hasError = true;
                    $scope.error = "Make sure to make unique selections.";
                    return;
                }


                console.log('expected');
                console.log(expected);
                console.log('answer');
                console.log(answer);
            }

            //Correct answer.
            if (expected === answer || $scope.isMA && arraysEqual(expected, answer)) {
                console.log("Correct!");
                console.dir($scope.analytics[$scope.index]);
                $scope.increment();
            } else {
                //Incorrect answer.
                console.log("Incorrect!");
                $scope.hasError = true && $scope.questions[$scope.index].hint.length;
                $scope.error = "Incorrect. Please try again.";

                //If first incorrect, log the answer selection.
                if (!$scope.analytics[$scope.index].firstIncorrect)
                    $scope.analytics[$scope.index].firstIncorrect = answer;
                console.log('First Incorrect', $scope.analytics[$scope.index].firstIncorrect);

                //Increment attempts for current question.
                $scope.analytics[$scope.index].attempts++;
                console.dir($scope.analytics[$scope.index]);

            }

            //Load next question.
        };
        //Matt
        //Determines question type and if quiz is finished.
        $scope.increment = function() {
            $scope.hasError = false;
            $scope.hasHint = false;
            //Set question info.
            if ($scope.index === max) {
                console.log("Quiz finished.");
                $scope.isDone = true;
                $scope.progress = 100;
                $scope.hasStart = false;
            } else {
                $scope.index = ($scope.index + 1) % $scope.questions.length;
                $scope.question = $scope.questions[$scope.index];
                $scope.hasError = false;
                if ($scope.questions[$scope.index].answers.MA) {
                    $scope.numOpts = $scope.questions[$scope.index].answers.MA.present.length;
                    for (var i = $scope.questions[$scope.index].answers.MA.present.length - 1; i >= 0; i--) {
                        if ($scope.questions[$scope.index].answers.MA.present[i].length)
                            break;
                        else
                            $scope.numOpts--;
                    }
                }

                //Set new question type.
                if ($scope.question.type === "TF") {
                    $scope.answer = { val: -1 }; //Resets for TF
                    $scope.isMA = false;
                    $scope.isTF = true;
                    $scope.isMultipleChoice = false;
                } else if ($scope.question.type === "SC") {
                    $scope.isMA = false;
                    $scope.isMultipleChoice = true;
                    $scope.isTF = false;
                    $scope.answer = -1; //Resets for MC
                } else if ($scope.question.type === "MA") {
                    $scope.ansMA = []; //Resets for MA
                    $scope.isMA = true;
                    $scope.isMultipleChoice = false;
                    $scope.isTF = false;
                } else {
                    //Unknown question type.
                    $scope.hasError = true;
                    $scope.isMA = false;
                    $scope.isMultipleChoice = false;
                    $scope.isTF = false;
                }

                //Set progress.
                $scope.numQuestion++;
                $scope.progress = Math.round(100 * ($scope.numQuestion - 1) / $scope.questions.length);
            }
        };

        //Matt - used Eric's function.
        //Open link in new tab.
        $scope.openTab = function(link_url) {
            $window.open(link_url, '_blank');
        };


        //Get question by category.
        var byCategory = function(listOfQuestions) {
            console.log("Questions");
            $scope.loadedQ = false;
            $scope.questions = [];
            for (var i = 0; i < listOfQuestions.length; i++) {
                $scope.questions.push(listOfQuestions[i]);
            }

            //Matt
            //Added # questions found to inform user BEFORE they start their quiz that there are x # of questions.
            max = $scope.questions.length;
            $scope.loadedQ = true;
            console.log($scope.questions.length + " question(s) found.");
            console.log($scope.questions);
            $scope.canStart = $scope.questions.length && $scope.loggedIn;
        };
        //Matt
        //Create array of numbers.
        $scope.getNumber = function(num) {
            return new Array(num);
        };
        //Matt
        //Num -> Char, 1->A, ...
        $scope.numToChar = function(n) {
            return String.fromCharCode(96 + parseInt(n)).toUpperCase();
        };
        //Matt
        //Num -> Char, arr, [1,2,3] -> [A,B,C]
        $scope.numToCharArr = function(arr) {
            var ltrArr = [];
            for (var num in arr) {
                ltrArr.push($scope.numToChar(num));
            }
            return ltrArr.join(", ");
        };
        //Matt
        //A->1,...
        $scope.charToNum = function(c) {
            return c.charCodeAt(0) - 96;
        };
        //Matt
        //Load resource from quiz start page.
        $scope.gotoResource = function(subjectName) {
            $location.path('/' + subjectName + '/resources');
        };
        //Matt
        //Load quiz from quiz start page.
        $scope.gotoQuiz = function(subjectName) {
            $location.path('/' + subjectName + '/quiz');
        };

    } //End of function for controller

]);

/*
Controller for the finished quiz results
*/

angular.module('quiz').controller('QuizResults', ['$http', '$scope', '$stateParams', 'Authentication',
    function($http, $scope, $stateParams, Authentication) {
        $scope.comment = null;
        $scope.authentication = Authentication;
        $scope.user = $scope.authentication.user;
        $(document).ready(function() {
            $("#myBtn").click(function() {
                $("#myModal").modal();
            });
        });

        var sub = document.getElementsByClassName("btn btn-default btn-success btn-block")[0];
        sub.onclick = function() {

            $scope.uploadUserComment();
        };

        //Creates a new student grades and stores it into collection view StudentGrades
        var studentGrades = {
            category: $stateParams.category,
            student: {
                studentName: $scope.user.userName,
                courses: $scope.user.courses
            },
            analytics: $scope.analytics,
        };

        console.log("User", $scope.user);

        $scope.uploadUserComment = function() {

            $scope.comment = $('input[id="comment"]').val();

            var commentToUpload = {
                category: $stateParams.category,
                comment: $scope.comment,
            };


            $http.post('/api/leave_comment', commentToUpload)
                .success(function(res) {
                    console.log(res);
                });

        };

        $http.post('/api/quiz_result', studentGrades)
            .success(function(res) {
                console.log(res);
            });

    }
]);


//Matt
//Controller for storing quiz into MongoDB
angular.module('quiz').controller('QuizCreate', ['$scope', '$http', 'Upload', '$timeout',
    function($scope, $http, Upload, $timeout) {
        //Create quiz via file upload.
        $scope.success = false;
        $scope.numSave = 0; //successfully saved.
        $scope.numDupe = 0; //duplicates found.

        $scope.uploadFiles = function(file, errFiles) {
            //File upload
            $scope.f = file;
            $scope.errFile = errFiles && errFiles[0];
            var data = {
                file: file
            };
            if (file) {
                file.upload = Upload.upload({
                    url: '/question_upload',
                    data: data
                });

                //Results from file upload.
                file.upload.then(function(response) {
                    $scope.numSave = response.data.numSaved;
                    $scope.numDupe = response.data.numDuplicates;
                    $scope.success = $scope.numSave > 0 || $scope.numDupe > 0;
                    $scope.error = response.data.error;
                    $scope.errorMsg = $scope.error ? response.data.errorMsg : null;

                    //Progress bar
                    if ($scope.error) {
                        file.progress = 0;
                        return;
                    }
                    $timeout(function() {
                        file.result = response.config.data.file.progress;
                    });
                }, function(response) {
                    if (response.status > 0) {
                        $scope.error = true;
                        $scope.errorMsg = response.status + ': ' + response.data;
                    }
                }, function(evt) {
                    file.progress = Math.min(100, parseInt(100.0 *
                        evt.loaded / evt.total));
                    if (file.progress === 100 || file.progress === 100.00) {
                        return;
                    }
                });
            }
        };
    }
]);

//Matt
//Compare two arrays.
function arraysEqual(a, b) {
    if (a === b) return true;
    if (a === null || b === null) return false;
    if (a.length !== b.length) return false;

    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

//Matt
//Array has duplicates.
function hasDuplicates(array) {
    return (new Set(array)).size !== array.length;
}

'use strict';


//Articles service used for communicating with the articles REST endpoints
angular.module('quiz').factory('QuizQuestion', ['$resource',
    function($resource) {
    	console.log("quiz factory");
        return $resource('api/quiz/', {}, {
            getQuestions: {
                method: 'GET',
                url: '/api/quiz',
                isArray: true,
            }
        });
    }
]);

'use strict';

// Setting up route
angular.module('users.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin.users', {
        url: '/users',
        templateUrl: 'modules/users/client/views/admin/list-users.client.view.html',
        controller: 'UserListController'
      })
      .state('admin.user', {
        url: '/users/:userId',
        templateUrl: 'modules/users/client/views/admin/view-user.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        }
      })
      .state('admin.user-edit', {
        url: '/users/:userId/edit',
        templateUrl: 'modules/users/client/views/admin/edit-user.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        }
      });
  }
]);

'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
  function ($httpProvider) {
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push(['$q', '$location', 'Authentication',
      function ($q, $location, Authentication) {
        return {
          responseError: function (rejection) {
            switch (rejection.status) {
              case 401:
                // Deauthenticate the global user
                Authentication.user = null;

                // Redirect to signin page
                $location.path('signin');
                break;
              case 403:
                // Add unauthorized behaviour
                break;
            }

            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]);

'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
  function($stateProvider) {
    // Users state routing
    $stateProvider
      .state('settings', {
        abstract: true,
        url: '/settings',
        templateUrl: 'modules/users/client/views/settings/settings.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('settings.profile', {
        url: '/profile',
        templateUrl: 'modules/users/client/views/settings/edit-profile.client.view.html'
      })
      .state('settings.password', {
        url: '/password',
        templateUrl: 'modules/users/client/views/settings/change-password.client.view.html'
      })
      .state('settings.accounts', {
        url: '/accounts',
        templateUrl: 'modules/users/client/views/settings/manage-social-accounts.client.view.html'
      })
      .state('settings.picture', {
        url: '/picture',
        templateUrl: 'modules/users/client/views/settings/change-profile-picture.client.view.html'
      })
      .state('authentication', {
        abstract: true,
        url: '/authentication',
        templateUrl: 'modules/users/client/views/authentication/authentication.client.view.html'
      })
      .state('authentication.signup', {
        url: '/signup',
        templateUrl: 'modules/users/client/views/authentication/signup.client.view.html'
      })
      .state('authentication.signin', {
        url: '/signin?err',
        templateUrl: 'modules/users/client/views/authentication/signin.client.view.html'
      })

      .state('teacherProfileTeacherView', {
        url: '/list/students',
        templateUrl: 'modules/core/client/views/studentProfileTeacherView.client.view.html',
        params: {
          username: "Username",
          email: "email",
          firstname: "first",
          lastname: "last",
        }
      })

      .state('studentList', {
        url: '/list',
        templateUrl: 'modules/users/client/views/studentlist.client.view.html'
      })
      .state('password', {
        abstract: true,
        url: '/password',
        template: '<ui-view/>'
      })
      .state('password.forgot', {
        url: '/forgot',
        templateUrl: 'modules/users/client/views/password/forgot-password.client.view.html'
      })
      .state('password.reset', {
        abstract: true,
        url: '/reset',
        template: '<ui-view/>'
      })
      .state('password.reset.invalid', {
        url: '/invalid',
        templateUrl: 'modules/users/client/views/password/reset-password-invalid.client.view.html'
      })
      .state('password.reset.success', {
        url: '/success',
        templateUrl: 'modules/users/client/views/password/reset-password-success.client.view.html'
      })
      .state('password.reset.form', {
        url: '/:token',
        templateUrl: 'modules/users/client/views/password/reset-password.client.view.html'
      });
  }
]);

'use strict';

angular.module('users.admin').controller('UserListController', ['$scope', '$filter', 'Admin',
  function ($scope, $filter, Admin) {
    Admin.query(function (data) {
      $scope.users = data;
      $scope.buildPager();
    });

    $scope.buildPager = function () {
      $scope.pagedItems = [];
      $scope.itemsPerPage = 15;
      $scope.currentPage = 1;
      $scope.figureOutItemsToDisplay();
    };

    $scope.figureOutItemsToDisplay = function () {
      $scope.filteredItems = $filter('filter')($scope.users, {
        $: $scope.search
      });
      $scope.filterLength = $scope.filteredItems.length;
      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
      var end = begin + $scope.itemsPerPage;
      $scope.pagedItems = $scope.filteredItems.slice(begin, end);
    };

    $scope.pageChanged = function () {
      $scope.figureOutItemsToDisplay();
    };
  }
]);

'use strict';

angular.module('users.admin').controller('UserController', ['$scope', '$state', 'Authentication', 'userResolve',
  function ($scope, $state, Authentication, userResolve) {
    $scope.authentication = Authentication;
    $scope.user = userResolve;

    $scope.remove = function (user) {
      if (confirm('Are you sure you want to delete this user?')) {
        if (user) {
          user.$remove();

          $scope.users.splice($scope.users.indexOf(user), 1);
        } else {
          $scope.user.$remove(function () {
            $state.go('admin.users');
          });
        }
      }
    };

    $scope.update = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = $scope.user;

      user.$update(function () {
        $state.go('admin.user', {
          userId: user._id
        });
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', 'PasswordValidator', 'Authentication', 'Subjects', 'Teachers',
    function($scope, $state, $http, $location, $window, PasswordValidator, Authentication, Subjects, Teachers) {

        //Pop for email varification - MA
        $(document).ready(function(){
            console.log('Hello');
            $("#myBtn").click(function(){
                $("#myModal").modal();
            });
        });

        //Added Stuff
        $scope.authentication = Authentication;
        $scope.popoverMsg = PasswordValidator.getPopoverMsg();

        // Get an eventual error defined in the URL query string:
        $scope.error = $location.search().err;


        // credentials object
        $scope.credentials = {};
        $scope.credentials.courses = [];

        // array of class names
        $scope.classNames = [];
        $scope.Periods = [];

        //array of saved codes
        var savedCodes = [];
        

        // load subjects
        Subjects.loadSubjects().then(function(response) {
            $scope.subjects = response.data;

            // grab all the courses, and read their names.
            for (var i = 0; i < $scope.subjects.length; i++) {
                $scope.classNames.push($scope.subjects[i].name);
            }
            //periods
            for (var j = 1; j < $scope.subjects.length; j++) {
                $scope.Periods.push("Period "+ j);
            }

        });

        $scope.newclassNames = ["Biotechnology 1",
                            "Biotechnology 2",
                            "Biotechnology 3",
                            "PLTW Principles of Biomedical Science",
                            "PLTW Human Body Systems",
                            "PLTW Medical Interventions",
                            "PLTW Biomedical Innovation",
                            "Agricultural Biotechnology",
                            "Biology",
                            "Honors Biology",
                            "AP Biology",
                            "AICE Biology",
                            "IB Biology",
                            "Genetics",
                            "Forensics",
                            "Other"];

        //Michael and Isabel- registration email
        $scope.sendMail = function (contactEmail) {

            console.log('Sending registration email!');
            console.log(contactEmail);
            var data = ({
                email : contactEmail
            });
            

            console.log(data.email);
            var route = '/api/auth/email';

            // Simple POST request example (passing data) :
            $http.post(route, data).success(function(req, res) {
                console.log("sending email");
            });
        };

        //Isabel- check if course code already existis before adding new course
        $scope.add = function(course,period) {
            console.log("Found course:" + course);
            if (course !== '') {
                //Creates a new object to be used for user course schema
                var courseObj = {};
                courseObj.courseName = course;
                courseObj.content = "";
                courseObj.progress = "";
                courseObj.section = period;

                //Generate number when you add the course
                //get all the coursecodes
                Teachers.loadTeachers().then(function(response) {
                    $scope.teachers = response.data;
                    //dowload all current course codes
                    for (var i = 0; i < $scope.teachers.length; i++) {
                        // if ($scope.teacher[i].courses !== undefined) {
                            // console.log("not empty");
                            // console.log($scope.teachers[i].courses[0].number);
                            // var number = $scope.teachers[i].courses[0].number;
                            for(var f = 0; f < $scope.teachers[i].courses.length; f++){
                                // console.log($scope.teachers[i].courses[f].number);
                                var number = $scope.teachers[i].courses[f].number;
                                //save course codes to savedCodes array
                                savedCodes.push(number);
                            }
                        // }  
                    }

                    var posted = false;
                    var match = false;
                    var num =  Math.floor((Math.random() * 1000) + 1);
                    while (posted === false){
                        match = false;
                        //check if there is a match
                        while (match === false){
                            //make random number
                            num =  Math.floor((Math.random() * 1000) + 1);
                            match = true;
                            for (var s = 0; s < savedCodes.length; s++) {
                                //if there is go back to beginning 
                                if (num === savedCodes[s]) {
                                    match = false;
                                    console.log("Duplicate Code");
                                    break;
                                }
                            }

                        }
                        //if not add course code
                        console.log("New Course Code Created");
                        courseObj.number = num;
                        $scope.credentials.courses.push(courseObj);
                        console.log($scope.credentials.courses[0]);
                        posted = true; 
                    }
                });
            }

            $scope.toAdd = '';
        };

        $scope.signup = function(isValid) {
            $scope.error = null;
			//recaptcha.validate(key)
			//.then(function(){
			  // validated and secure
			//})
			//.catch(function(errorCodes){
			  // invalid
			//  console.log(recaptcha.translateErrors(errorCodes));// translate error codes to human readable text
			//  console.log("invalid");
                //sets error if invalid info
            //    alert("Use a valid course code. For testing, use 863.");

            //    $scope.error = response.message;
			//});
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'userForm');
				
                return false;
            }

            // Add displayName
            $scope.credentials.displayName = $scope.credentials.lastName + ', ' + $scope.credentials.firstName;
            $scope.credentials.courses = [parseInt($scope.credentials.courseCode)].length? [parseInt($scope.credentials.courseCode)] : [];
            var route = '/api/auth/signup/teacher';
            if ($scope.credentials.profileType === "Student") {
                route = '/api/auth/signup/student';
                console.log("Is a student");
            } else if($scope.credentials.profileType === "Admin") {
                // user the teacher route because it doesn't ask for course code to register
                route = '/api/auth/signup/teacher';
                console.log("Is an Admin");
            } else if($scope.credentials.profileType === "Teacher") {
                route = '/api/auth/signup/teacher';
                console.log("Is a Teacher");
            }


            $http.post(route, $scope.credentials).success(function(response) {

                // If successful we assign the response to the global user model
                $scope.authentication.user = response;

                // And redirect to the home page
                $location.url('/');
            }).error(function(response) {
                console.log("Invalid (Sign up)", response);
                //sets error if invalid info
                alert("Use a valid course code. For testing, check the database for a teacher and use their course numbers.");

                $scope.error = response.message;
            });

        };
// 
        $scope.signin = function(isValid) {

            $scope.error = null;

            if (!isValid) {
                //$scope.$broadcast('show-errors-check-validity', 'userForm');
                return false;
            }

            $http.post('/api/auth/signin', $scope.credentials).success(function(response) {

                // If successful we assign the response to the global user model
                $scope.authentication.user = response;

                // And redirect to home page
                $state.go('home');
            }).error(function(response) {
                console.log("Invalid (Sign in)", response);
                //sets popup for invalid usernmae or password
                setTimeout(function() {
                    alert("Invalid Username or Password");
                }, 0);
                $scope.error = response.message;
            });
        };

        // OAuth provider request
        $scope.callOauthProvider = function(url) {
            if ($state.previous && $state.previous.href) {
                url += '?redirect_to=' + encodeURIComponent($state.previous.href);
            }

            // Effectively call OAuth authentication route:
            $window.location.href = url;
        };

        if ($scope.authentication.user) {
            // flags for determining if current user is an admin or teacher
            $scope.authentication = Authentication;
            $scope.isAdmin = false;
            $scope.isTeacher = false;
            if ($scope.authentication.user.profileType === "Admin") {
                console.log("I am a admin");
                $scope.isAdmin = true;
            } else if ($scope.authentication.user.profileType === "Teacher") {
                console.log("I am a teacher");
                $scope.isTeacher = true;
            }
        }
    }
]);

'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'PasswordValidator',
  function ($scope, $stateParams, $http, $location, Authentication, PasswordValidator) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    //If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    // Submit forgotten password account id
    $scope.askForPasswordReset = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'forgotPasswordForm');

        return false;
      }

      $http.post('/api/auth/forgot', $scope.credentials).success(function (response) {
        // Show user success message and clear form
        $scope.credentials = null;
        $scope.success = response.message;

      }).error(function (response) {
        // Show user error message and clear form
        $scope.credentials = null;
        $scope.error = response.message;
      });
    };

    // Change user password
    $scope.resetUserPassword = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'resetPasswordForm');

        return false;
      }

      $http.post('/api/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.passwordDetails = null;

        // Attach user profile
        Authentication.user = response;

        // And redirect to the index page
        $location.path('/password/reset/success');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);


'use strict';

//controler for teacher page list retrieval of students
angular.module('users').controller('StudentListController', ['$rootScope', '$scope', '$state', '$location', '$filter', '$http', 'Authentication',
    function($rootScope, $scope, $state, $location, $filter, $http, Authentication) {
        $scope.$state = $state;
        $scope.authentication = Authentication;
        // $scope.section = null;
        $scope.user = "";
        $scope.email = "";
        $scope.firstname = "";
        $scope.lastname = "";
        $scope.check = "hello";

        $scope.input = {};
        $scope.input.courseNums = [];
        $scope.authentication.user.courses.forEach(
            function(element, index, array) {
                $scope.input.courseNums.push(element.number);
            }
        );

        $http.post('/api/data/students', $scope.input)
            .then(function(response) {
                $scope.data = response.data;
                console.log(response);
            });

        //gets the name from the param list
        $scope.getName = function(disName) {
            $scope.user = disName.userName;
            $scope.email = disName.email;
            $scope.firstname = disName.firstName;
            $scope.lastname = disName.lastName;
            console.log("hello");
            console.log($scope.user);
        };
    }
]);

//controller for the student teacher page
angular.module('users').controller('StudentGetController', ['$rootScope', '$scope', '$state', '$stateParams', '$location', '$filter', '$http', 'Authentication',
    function($rootScope, $scope, $state, $stateParams, $location, $filter, $http, Authentication) {

        $scope.authentication = Authentication;
        // $scope.section = null;
        //testing
        console.log("in state params:");
        //testing
        console.log($stateParams.username);
        //pass to scope
        $scope.userFinal = $stateParams.username;
        $scope.emailFinal = $stateParams.email;
        $scope.firstnameFinal = $stateParams.firstname;
        $scope.lastnameFinal = $stateParams.lastname;

        //testing
        console.log("Second controller");
        console.log($scope.userFinal);
        console.log($scope.email);
        console.log($scope.firstname);
        console.log($scope.lastname);
    }
]);

'use strict';

angular.module('users').controller('ChangePasswordController', ['$scope', '$http', 'Authentication', 'PasswordValidator',
  function ($scope, $http, Authentication, PasswordValidator) {
    $scope.user = Authentication.user;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // Change user password
    $scope.changeUserPassword = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'passwordForm');

        return false;
      }

      $http.post('/api/users/password', $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.$broadcast('show-errors-reset', 'passwordForm');
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('ChangeProfilePictureController', ['$scope', '$timeout', '$window', 'Authentication', 'FileUploader',
  function ($scope, $timeout, $window, Authentication, FileUploader) {
    $scope.user = Authentication.user;
    $scope.imageURL = $scope.user.profileImageURL;

    // Create file uploader instance
    $scope.uploader = new FileUploader({
      url: 'api/users/picture'
    });

    // Set file uploader image filter
    $scope.uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    // Called after the user selected a new picture file
    $scope.uploader.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            $scope.imageURL = fileReaderEvent.target.result;
          }, 0);
        };
      }
    };

    // Called after the user has successfully uploaded a new picture
    $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      // Show success message
      $scope.success = true;

      // Populate user object
      $scope.user = Authentication.user = response;

      // Clear upload buttons
      $scope.cancelUpload();
    };

    // Called after the user has failed to uploaded a new picture
    $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
      // Clear upload buttons
      $scope.cancelUpload();

      // Show error message
      $scope.error = response.message;
    };

    // Change user profile picture
    $scope.uploadProfilePicture = function () {
      // Clear messages
      $scope.success = $scope.error = null;

      // Start upload
      $scope.uploader.uploadAll();
    };

    // Cancel the upload process
    $scope.cancelUpload = function () {
      $scope.uploader.clearQueue();
      $scope.imageURL = $scope.user.profileImageURL;
    };
  }
]);

'use strict';

angular.module('users').controller('EditProfileController', ['$scope', '$http', '$location', 'Users', 'Authentication',
  function ($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;

    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = new Users($scope.user);

      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'userForm');

        $scope.success = true;
        Authentication.user = response;
      }, function (response) {
        $scope.error = response.data.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('SocialAccountsController', ['$scope', '$http', 'Authentication',
  function ($scope, $http, Authentication) {
    $scope.user = Authentication.user;

    // Check if there are additional accounts
    $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }

      return false;
    };

    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function (provider) {
      return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
    };

    // Remove a user social account
    $scope.removeUserSocialAccount = function (provider) {
      $scope.success = $scope.error = null;

      $http.delete('/api/users/accounts', {
        params: {
          provider: provider
        }
      }).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('SettingsController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    $scope.user = Authentication.user;
  }
]);

'use strict';

angular.module('users')
  .directive('passwordValidator', ['PasswordValidator', function(PasswordValidator) {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, modelCtrl) {
        modelCtrl.$parsers.unshift(function (password) {
          var result = PasswordValidator.getResult(password);
          var strengthIdx = 0;

          // Strength Meter - visual indicator for users
          var strengthMeter = [
            { color: "danger", progress: "20" },
            { color: "warning", progress: "40"},
            { color: "info", progress: "60"},
            { color: "primary", progress: "80"},
            { color: "success", progress: "100"}
          ];
          var strengthMax = strengthMeter.length;

          if (result.errors.length < strengthMeter.length) {
            strengthIdx = strengthMeter.length - result.errors.length - 1;
          }

          scope.strengthColor = strengthMeter[strengthIdx].color;
          scope.strengthProgress = strengthMeter[strengthIdx].progress;

          if (result.errors.length) {
            scope.popoverMsg = PasswordValidator.getPopoverMsg();
            scope.passwordErrors = result.errors;
            modelCtrl.$setValidity('strength', false);
            return undefined;
          } else {
            scope.popoverMsg = '';
            modelCtrl.$setValidity('strength', true);
            return password;
          }
        });
      }
    };
}]);

'use strict';

angular.module('users')
  .directive("passwordVerify", function() {
    return {
      require: "ngModel",
      scope: {
        passwordVerify: '='
      },
      link: function(scope, element, attrs, modelCtrl) {
        scope.$watch(function() {
          var combined;
          if (scope.passwordVerify || modelCtrl.$viewValue) {
            combined = scope.passwordVerify + '_' + modelCtrl.$viewValue;
          }
          return combined;
        }, function(value) {
          if (value) {
            modelCtrl.$parsers.unshift(function(viewValue) {
              var origin = scope.passwordVerify;
              if (origin !== viewValue) {
                modelCtrl.$setValidity("passwordVerify", false);
                return undefined;
              } else {
                modelCtrl.$setValidity("passwordVerify", true);
                return viewValue;
              }
            });
          }
        });
     }
    };
});

'use strict';

// Users directive used to force lowercase input
angular.module('users').directive('lowercase', function () {
  return {
    require: 'ngModel',
    link: function (scope, element, attrs, modelCtrl) {
      modelCtrl.$parsers.push(function (input) {
        return input ? input.toLowerCase() : '';
      });
      element.css('text-transform', 'lowercase');
    }
  };
});

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$window',
  function ($window) {
    var auth = {
      user: $window.user
    };

    return auth;
  }
]);

//passes in function to load teachers from database
angular.module('core').service('Teachers', ['$http', function($http) {

  return {
    loadTeachers: function() {
      return $http({
        method: 'GET',
        url: '/api/auth/signup'
      });
    }
  };

}]);

'use strict';

// PasswordValidator service used for testing the password strength
angular.module('users').factory('PasswordValidator', ['$window',
  function ($window) {
    var owaspPasswordStrengthTest = $window.owaspPasswordStrengthTest;

    return {
      getResult: function (password) {
        var result = owaspPasswordStrengthTest.test(password);
        return result;
      },
      getPopoverMsg: function () {
        var popoverMsg = "Please enter a passphrase or password with greater than 10 characters, numbers, lowercase, upppercase, and special characters.";
        return popoverMsg;
      }
    };
  }
]);

'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
  function ($resource) {
    return $resource('api/users', {}, {
      update: {
        method: 'PUT'
      },
      parseUsers:{
        method: 'GET' , 
        isArray: true
      }
    });
  }
]);

angular.module('users').factory('Temps', ['$resource',
  function ($resource) {
    return $resource('api/users', {}, {
      update: {
        method: 'PUT'
      },
      parseUsers:{
        method: 'GET' , 
        isArray: true
      }
    });
  }
]);

angular.module('core').factory('Users', ['$http', function($http) {

  this.parseUsers = function() {
        return $http.get('/app/parse/users/').then(
            
            function() {
              console.log('Error checking server.');
            }
        );
    };

}]);

//TODO this should be Users service
angular.module('users.admin').factory('Admin', ['$resource',
  function ($resource) {
    return $resource('api/users/:userId', {
      userId: '_id'
    }, {
      update: {
        method: 'PUT'
      },
      parseUsers:{
        method: 'GET' , 
        isArray: true
      }

    });
  }
]);
