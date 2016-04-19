describe('Core Tests:', function() {

	beforeEach(function() {
		browser.get('http://localhost:3000/');
	});

	afterEach(function() {
		browser.sleep(3000);
	});
	
	describe('Nav Bar Tests', function(){
		//Test Contact
		it('should send user to contact page', function() {
			element(by.id('contact')).click();

			expect(browser.getCurrentUrl()).toBe('http://localhost:3000/contact');
		});
		
		//Test About 
		it('should send user to contact page', function() {
			element(by.id('about')).click();

			expect(browser.getCurrentUrl()).toBe('http://localhost:3000/about');
		});
		
		//Test Login
		it('should send user to contact page', function() {
			element(by.id('login')).click();

			expect(browser.getCurrentUrl()).toBe('http://localhost:3000/authentication/signin');
		});
	});  
	
	// test resources page route
	it('should send user to subject resources page', function() {
		//Testing Biochemistry Page
		element(by.repeater('subject in subjects').row(11)).element(by.id('resources')).click();
		expect(browser.getCurrentUrl()).toBe('http://localhost:3000/Chemistry%20&%20Biochemistry/resources');
	});

	// test assessment page route
	it('should send user to subject resources page', function() {
		//Testing 
		element(by.repeater('subject in subjects').row(1)).element(by.id('assessment')).click();
		expect(browser.getCurrentUrl()).toBe('http://localhost:3000/Genetics/quiz');	
	});
	
	describe('Student Login and Uses', function(){
		//Signin
		it('should let our default/dummy student-user sign-in', function() {
				element(by.id('login')).click();
				element(by.model('credentials.username')).sendKeys('1');
				element(by.model('credentials.password')).sendKeys('1');
				element(by.css('[ng-click="open()"]')).click();
				expect(browser.getCurrentUrl()).toBe('http://localhost:3000/');
		});
		
		//Check Profle
		it('should let our default/dummy student-user go to its unique page', function() {
				element(by.css('[ng-click="profile()"]')).click();
				expect(browser.getCurrentUrl()).toBe('http://localhost:3000/student/1');
		});
		
		//Try a quiz
		it('should start a quiz', function() {
				element(by.repeater('subject in subjects').row(0)).element(by.id('assessment')).click();
				element(by.css('[ng-click="start()"]')).click();
				
				expect(element(by.id('P-test1')).getText()).toEqual("Most ATP in eukaryotic cells is produced in the:");
				
				//var x = element.findElements(by.cssSelector("p").getText());
				//expect(x).toBe('Most ATP in eukaryotic cells is produced in the:');
				//expect(element(by.id('P-test1').getText()).toEqual("Most ATP in eukaryotic cells is produced in the:");
		});
	});
});