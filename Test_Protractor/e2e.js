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

}); 