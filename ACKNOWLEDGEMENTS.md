Code that was borrowed for the production of this website includes:

- Michael Arboleda:
  -http://www.w3schools.com/bootstrap/bootstrap_ref_js_carousel.asp
  	-used code for fixing home page banner carousel

- Ryan Blanchard:
  -Features from Bootcamp Assignment 5:
    -https://github.com/BootcampAssignments/Assignment-5
    -used parts of code from listings table, search bar, and navigating to individual items
    
- Eric Gordon:
  -Features from Bootcamp Assignment 3,4,5:
    -https://github.com/CEN3031-spr16/UF-Directory-App-Assignment
    -https://github.com/CEN3031-spr16/Assignment-4
    -https://github.com/BootcampAssignments/Assignment-5
    -used in creating most changes to resources: grunt functions, filtering, routing, etc.
  
- Isabel Laurenceau:
  
  
- Matt Lemmone:
	
	- Borrowed from [here](http://www.howwaydo.com/how-to-check-if-two-arrays-are-equal-with-javascript/).

	- Used to compare two arrays. Used for seeing if quiz matching answers are correct.
		
	```
	function arraysEqual(a, b) {
	    if (a === b) return true;
	    if (a === null || b === null) return false;
	    if (a.length !== b.length) return false;
	
	    for (var i = 0; i < a.length; ++i) {
	        if (a[i] !== b[i]) return false;
	    }
	    return true;
	}
	```
		
	- Borrowed from [here](https://stackoverflow.com/questions/7376598/in-javascript-how-do-i-check-if-an-array-has-duplicate-values).
	
	- Used to determine if an array has duplicates. Useful for checking unique selections in quizzes.
		
	```
	function hasDuplicates(array) {
	    return (new Set(array)).size !== array.length;
	}
	```

  
-Spencer Reyka:
  -
  
