//===
// HSP v1.0.0 (06-March-2022)
// https://do.meni.co/hsp
//
// Core JS
//===

//function to open or close the side menu
function showNav(state){//pass state as boolean
	
	var navContainer = document.getElementById('nav');//get nav container
	// var articleContainer = document.getElementsByTagName('article')[0];//get first <article> tag
	
	if(state === true){
		navContainer.classList.remove('closed')//remove closed class
		navContainer.classList.add('open')//apply open class
		saveShowNavState(state)//save open state
		
		var navElement = navContainer.getElementsByTagName('nav')[0];//get <nav> tag
		var scrollBarWidth = navElement.offsetWidth - navElement.clientWidth;//calculate scrollbar width
		//alert(scrollBarWidth)
		if(scrollBarWidth > 0){//if scrollbar width returns number value greater than 0
			navContainer.classList.add('open-with-scrollbar')//apply open with scrollbar class
		}else{
			navContainer.classList.remove('open-with-scrollbar')//remove class
		}

	}else if(state === false){
		navContainer.classList.remove('open')//remove open class
		navContainer.classList.remove('open-with-scrollbar')//remove open with scrollbar class
		navContainer.classList.add('closed')//apply closed class
		saveShowNavState(state)//save closed state
	}else{
		console.log('openMenu() run without variable passed.')
	}
	
	loadScrollPosition()//load scroll on nav change
}

// function to recall whether the side menu should be opened or not on page load, using HTML5 storage
function loadShowNavState(){
	if (typeof(Storage) !== "undefined") {//from https://www.w3schools.com/html/html5_webstorage.asp
		// Code for localStorage/sessionStorage.
		if(localStorage.showNavState && localStorage.showNavState === 'true'){//if value saved, and value is true showNav true. Nb localStorage only saves strings, so we evaluate the string and pass the appropriate boolean operator
			showNav(true)
		}else if(localStorage.showNavState && localStorage.showNavState === 'false'){//close the nav if the state is set to closed
			showNav(false)
		}
	} else {
		// No Web Storage support.
		console.log("No Web Storage support.")
	}
}

//function for saving the open or closed state of the side menu, this information is used by loadShowNavState()
function saveShowNavState(state){//pass state as boolean
	if (typeof(Storage) !== "undefined") {//from https://www.w3schools.com/html/html5_webstorage.asp
		localStorage.showNavState = state;//save the passed state, although localStorage will save as string
	} else {
		console.log("No Web Storage support.")
	}
}

//function to scroll nav box based on active element
function syncNavScroll(){
	//alert(document.getElementsByClassName('active')[0].offsetTop)
	var getNavBox = document.getElementsByTagName("nav")[0];//get nav box
	var navActiveElement = getNavBox.getElementsByClassName('active')[0];//get active element in nav box
	if(navActiveElement !== undefined){//check if there is an active element
		//getNavBox.scrollTop = navActiveElement.offsetTop - 50;//set nav box scroll to distance of active element from top, -50 px for some extra space above active item 
		navActiveElement.scrollIntoView({behavior: "smooth", block: "start"})//smooth scroll
	}else{//if no active states found
		getNavBox.scrollTop = 0;//scroll to top
	}
}

//this function mirrors the classes of the section heading in view to the parent nav box to allow things such as the mirroring of styles
function syncNavItemClass(){
	var getNavBox = document.getElementsByTagName("nav")[0];//get nav box
	var navActiveElement = getNavBox.getElementsByClassName('active')[0];//get active element in nav box
	if(navActiveElement !== undefined){//check if there is an active element
		//console.log(navActiveElement.classList);
		getNavBox.classList = navActiveElement.classList;//set nav box class to active nav item class
		getNavBox.classList.remove('active', 'h1', 'h2', 'h3', 'h4', 'noprint', 'nolist', 'nocount');//remove known classes on nav items that could cause interference
		var getNavSpanBox = document.getElementById('nav').getElementsByTagName('span')[0];//get the span box used for the closed nav
		getNavSpanBox.classList = getNavBox.classList;//mirror the classes fron the nav box to nav span box
	}
}

//function to highlight the section heading in view in the side menu. It applies a CSS class called 'active' to the side menu item
function highlightNavItems(){
	var bodyTextContainer = document.getElementsByTagName("article")[0];//get body text, first <article> element
	
	var bodyTextContainerNavItems = bodyTextContainer.querySelectorAll('h2:not(.hidetarget,.nolist),h3:not(.hidetarget,.nolist),h4:not(.hidetarget,.nolist),h5:not(.hidetarget,.nolist)');//get body items without hidetarget or nolist class, nolist is included so if only nolist is applied there are no issues with trying to apply active states to a hidden menu item

	var navItemContainer = document.getElementsByTagName('nav')[0];//get nav item container, first <nav> element
	
	var navItemContainerNavItems = navItemContainer.querySelectorAll(".h2:not(.hidetarget,.nolist),.h3:not(.hidetarget,.nolist),.h4:not(.hidetarget,.nolist),.h5:not(.hidetarget,.nolist)");//get nav items with heading tag classes but without hidetarget or nolist class from nav item container <nav>

	var scrollDistance = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;//https://stackoverflow.com/a/28633515 cross browser compatible method for getting the Y offset i.e. distance scrolled down

	for(i = 0; i < navItemContainerNavItems.length; i++){//remove active class from all nav items
		navItemContainerNavItems[i].classList.remove('active')
	}

	for(var i = bodyTextContainerNavItems.length - 1; i >= 0; i--){//for each nav item without hidetarget or nolist class, starting in reverse because we want the last most match that meets with the scroll position. The below logic runs on the presumption matched items found in body will be same order in nav

		//bodyTextContainerNavItems[i].innerHTML += " " + i;

		if(bodyTextContainerNavItems[i].offsetTop - 20 <= scrollDistance && navItemContainerNavItems[i]){//if the item appears before the position in page, -20 to return result a bit earlier ALSO check that navItemContainerNavItems[i] is valid
			// console.log("Distance scrolled: " + scrollDistance + "\n Active ID: " + bodyTextContainerNavItems[i].id + "\n  Heading offset: " + bodyTextContainerNavItems[i].offsetTop);
			navItemContainerNavItems[i].classList.add('active')//add active state to nav item with same index
			return;//we only want the first match from the reverse loop
		}
	}
}

//detect stopped scrolling from https://gomakethings.com/detecting-when-a-visitor-has-stopped-scrolling-with-vanilla-javascript/
// Setup isScrolling variable
var isScrolling;

// Listen for scroll events
window.addEventListener('scroll', function ( event ) {

	// Clear our timeout throughout the scroll
	window.clearTimeout( isScrolling );

	// Set a timeout to run after scrolling ends
	isScrolling = setTimeout(function() {//run the following when scrolling stops
			saveScrollPosition()//save scroll position
			highlightNavItems()//highlight nav items based on scroll
			syncNavScroll()//sync the nav scrolling with active item
			syncNavItemClass()//sync nav item classes with nav container
			//console.log( 'Scrolling has stopped.' );
	}, 100);

}, false);

//function to save nearest targetable element so users can return to the same element when reloading the page
function saveScrollPosition(){

	var scrollDistance = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;//https://stackoverflow.com/a/28633515 cross browser compatible

	if (typeof(Storage) !== "undefined") {
		var mainTextContainer = document.getElementsByTagName('article')[0];//get first <article>

		for(var i = mainTextContainer.childNodes.length - 1; i >= 0; i--){//for each childNode in <article>, starting in reverse because we want the last most match, not to go through each match from the start and get the last one
			
			if(mainTextContainer.childNodes[i].offsetTop - 10 <= scrollDistance){//if the item appears before the position in page, -10 to return result a bit earlier
				//mainTextContainer.childNodes[i].style.backgroundColor = "green";
				localStorage.scrollPositionElementIndex = i;//save index of scroll position element
				//localStorage.scrollRatio = Number(scrollDistance/document.body.clientHeight);
				//console.log('Scroll position saved.')
				return;//we only want the first match from the reverse loop
			}
		}
	}else {
		// No Web Storage support.
		console.log("No Web Storage support.")
	}
}

//function to load saved scroll position element (or target in URL) into view
function loadScrollPosition(){
	if (typeof(Storage) !== "undefined") {
		if(localStorage.scrollPositionElementIndex){//if an element index is saved
			var elementIndex = Number(localStorage.scrollPositionElementIndex);//set var for element index as number since localStorage only stores strings
			var mainTextContainer = document.getElementsByTagName('article')[0];//get first <article>
			setTimeout(function(){//timeout to make sure target will scroll at 1sec, avoids shenanigans with nav/open close effect affecting scroll
				if(window.location.hash) {//if there is a hash
					//scroll to hash in URL bar and clear it for good UX if link ever needs to be saved or copied from URL bar
					document.getElementById(window.location.hash.substr(1)).scrollIntoView({behavior: "smooth", block: "start"})//get href by ID, by removing # with substr(1) and scroll into view
					history.pushState("", document.title, window.location.pathname + window.location.search);//remove hash from URL bar
				}else{//if there is no hash, load the saved state
					mainTextContainer.childNodes[elementIndex].scrollIntoView({behavior: "smooth", block: "start"});//scroll saved element into view
					//console.log('Scroll position loaded.');
				}
			}, 1000);
		}else{//if no index, load function to make one
			saveScrollPosition();
		}
	} else {
		// No Web Storage support.
		console.log("No Web Storage support.")
	}
}

//function to add listener to target links and make sure the page scrolls smoothly. Note scrolling for the side menu items is handled in syncNavScroll() and does not need to be performed in thsi function
function smoothScrollTargets(){

	var getDocAnchors = document.getElementsByTagName("a");//get all anchors

	for (var i = 0; i < getDocAnchors.length; i++) {
		var anchorHref = getDocAnchors[i].getAttribute("href");
		if(anchorHref.charAt(0) === "#"){//if first character of href is a #, i.e it's an internal link
			getDocAnchors[i].addEventListener("click", function(event){//add a click listener

				event.preventDefault();//stop default behaviour when clicking nav item, as default target activation will block smooth scrolling
				setTimeout(function(){//timeout to not mess-up scrolling effect
					window.location.hash = currentHref;//add current hash to URL on click, allows going back to place 
				}, 1000);
				
				var currentHref = event.target.getAttribute("href");//get href from element, event.target is the element being clicked on
				
				//smooth scroll for page element
				document.getElementById(currentHref.substr(1)).scrollIntoView({behavior: "smooth", block: "start"})//get corresponding ID from href, by removing # with substr(1) and scroll the element into view
			
				
			}); 
		}
	}

}

window.onload = function(){//on window load
	
	smoothScrollTargets()//listener for smooth scrolling

	loadShowNavState()//loads nav open/closed and loads saved position

	//reload scroll position recorded from last session
	document.getElementsByTagName('body')[0].onresize = function(){//on window resize
		loadScrollPosition()//load scroll position
	};
    
}