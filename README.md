#Biotility - 4a

### Intro
Biotility is a web app that provides students, professionals, and researchers assessments and resources to prepare for the Biotechnician Assistant Credentialing Exam (BACE). It is used by schools and teachers in Alachua county to better prepare students and provide teachers with testing metrics to assess the skills and proficiency of their students.  
This repository was an inherited from a previous group whose repository can be found [here](https://github.com/SoftwareEngineering5c/Biotility). 

### [Deployed Page](http://biotilitysp18.herokuapp.com)

### Credit people/organizations
- [Bossable](http://www.bossable.com/)
- [Bootstrap](http://getbootstrap.com/)
- [MeanJS](http://meanjs.org/)
- [MLab](http://www.mlab.com)
- UF Biotility
- Lori Wojciechowski
- Tamara Mandell
- [Code Acknowledgements](https://github.com/4aSoftwareEngineering/Biotility/blob/master/ACKNOWLEDGEMENTS.md)

### List of all project features implemented and associated screenshots -include landing or home page
- Home Page
 ![] (https://puu.sh/osk1T/f1f5b428aa.jpg)
- Allow non registered students to use site and take quizzes
 ![] (https://puu.sh/osk3t/9eee5c2f9a.png)
- Teachers can create classes with periods and receive course codes to give to students 
 ![] (http://i.imgur.com/UCKmPxg.png)
- Teachers can edit their settings
 ![] ( http://i.imgur.com/gBy4AHE.png)
- Teachers can view statistics based on their classes first attempts at quiz questions
 ![] (http://i.imgur.com/ecs4AlD.png)
- Teachers can request that a resource be added by the admin.
 ![] (http://i.imgur.com/RNmImHA.png)
- Teachers courses automatically reset on August 1st(backend no visual) 
- Students can take quizzes based on subject 
	- Quizzes have true/false, single choice, and matching answer questions.
	- Data is stored and saved for teacher and admin statistics
	
 ![] (http://i.imgur.com/tCjeJvc.jpg)
 ![] (http://i.imgur.com/IAcjt6c.png)
- Students and teachers can provide feedback on quizzes for Admins
 ![] (http://i.imgur.com/8RDIh2O.png)
- Admins now have an account
 ![] (http://i.imgur.com/YTtlIY1.png)
- Admins can upload quizzes from excel files
	- Duplicate questions are screened for and will not be uploaded 

 ![] (https://puu.sh/oskod/ed0ddb0975.png)
- Admins can add, edit and delete quiz questions 
 ![] (http://i.imgur.com/pZeQZsd.png)
- Admins also can see statistics on the quizzes
  ![] (http://i.imgur.com/tcGXR2T.png)
- Admins can see statistics on resource usage
 ![] (http://i.imgur.com/JjuyUuG.png)
- Admins can export statistics into csv files 
  ![] (http://puu.sh/oskiO/bb7c4792e0.png)
- Admins can edit resources 
 ![] (http://i.imgur.com/InQso6q.png)

#### Instructions for how to run the project locally
To run Biotility locally on your machines, first install the following 

npm install -g bower

npm install -g grunt-cli

npm install -g yo

npm install -g generator-meanjs

Clone the git repository to your computer `https://github.com/4aSoftwareEngineering/Biotility`.

Do an `npm install` and `bower install` to get the rest of the dependencies.

If you experience any errors requiring dependencies from the SERVER console, simply install those using `npm install --s MODULENAME`.

If you experience any errors requiring dependencies from the CLIENT console, simply install those using `bower install --s MODULENAME`.

Run by using `grunt`, or `grunt --f` if you experience lint errors.

On your browser, access Biotility by visiting `localhost:3000`.

To stop the server, simply type `CTRL - C` on your terminal. 

#### How to update database and server connections
Updates to the database can all be done on the app or manually through the mlabs server. 

Updating registered users can be done through the user registration page or the users' profile page. 

Admins can update quizzes in their profile. 

#### To connect to the database

Please use: `mongodb://team4a:team4a@ds041394.mlab.com:41394/biotility`.

To link the site to a new database connection please use: `/Biotility/config/env/production.js`.


