describe('Core Tests:', function() {

  beforeEach(function() {
    browser.get('http://localhost:3000/');
  });

  afterEach(function() {
    browser.sleep(3000);
  });
  
  it('should send user to contact page', function() {
    element(by.id('contact')).click();

    expect(browser.getCurrentUrl()).toBe('http://localhost:3000/contact');
  });
  
});  