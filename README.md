#Biotility - 4a

##Pivotal Tracker
https://www.pivotaltracker.com/n/projects/1521659

##Skills Breakdown

- Matt - Any
- Isabel
  - Knows: HTML / CSS 
  - Wants to learn: Database Organization / JavaScript
- Ryan
  - Wants to learn: JavaScript
- Michael
  - Wants to learn: Bootstrap
- Eric
  - Wants to learn: Eloquent JavaScript 
- Spencer 
  - Wants to learn: JavaScript

##Sprint #1
- [ ] Task 1
- [ ] Task 2
- [ ] Etc.

##Installation
1. npm install
2. grunt

##Database Info
Every time a user signs up the database is automatically updated.
When a user goes to their profile page, they can edit their profile info.
Database is automically updated as well with quiz results when a student takes a quiz.

The user schema is defined in `Biotility/modules/users/server/models/user.server.model.js`
The quiz question schema is defined in `Biotility/modules/quiz/server/models/quizQuestion.server.model.js`

Database connection: `mongodb://devteam:devteam@ds027769.mongolab.com:27769/software5c`

To change the connection go to `/Biotility/config/env/production.js` and input the new connection, along with the correct credentials
