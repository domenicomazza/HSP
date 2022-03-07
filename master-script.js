//===
// HSP v1.0.0 (06-March-2022)
// https://do.meni.co/hsp
//
// Master JS
//===

function makeSafeForCSS(name) {//http://stackoverflow.com/questions/7627000/javascript-convert-string-to-safe-class-name-for-css this function helps make valid names for automatic HTML target links
	return name.replace(/[^a-z0-9]/g, function(s) {
		var c = s.charCodeAt(0);
		if (c == 32) return '-';
		if (c >= 65 && c <= 90) return '_' + s.toLowerCase();
		return '__' + ('000' + c.toString(16)).slice(-4);
	});
}

//decode HTML entities https://stackoverflow.com/a/9609450
//for using in HTML hover captions
var decodeEntities = (function() {
	// this prevents any overhead from creating the object each time
	var element = document.createElement('div');

	function decodeHTMLEntities (str) {
		if(str && typeof str === 'string') {
			// strip script/html tags
			str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
			str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
			element.innerHTML = str;
			str = element.textContent;
			element.textContent = '';
		}

		return str;
	}

return decodeHTMLEntities;
})();

function makeNav(){//function to build first <nav> with headings in first <article> with automatically generated links to headings, also helps send h2 and figure or table count to function which applies count to links

	var articleHeadingsAndFigures = document.getElementsByTagName('article')[0].querySelectorAll('h2,h3,h4,h5,figure');//select heading elements and figure elements for counting and linking

	var navArea = document.getElementsByTagName('nav')[0];//get first <nav>
	var contentsArea = document.getElementById('contentsDiv');//get contents container in document
	//contentsArea.innerHTML = "";//[FIXED with a better technique to stop scripts running again] clear the contentsArea div. Resolves a bug with 'Export as PDF' on Safari which runs this function run twice.
	var figureListArea = document.getElementById('figureListDiv');//get list of figures container
	var tableListArea = document.getElementById('tableListDiv');//get list of tables container
	//counters while this function runs to allow JS counting for <figures>, since :before on CSS counters cannot be read by JS
	var modH2Count = 0;//variable to store either h2 or appendix h2 count, can be letter or number
	var h2Count = 0;//variable to help count <h2> tags
	var apH2count = 0;//appendix h2 count
	var figCount = 0;//variable to help count <figure>s that aren't tables
	var figTabCount = 0;//variable to help count <figures> with tables
	//var takenIdCount = 0;//declare var for taken ID flag
	
	//extra counters for counting lower level heading section numbers
	var h3Count = 0;//variable to help count <h3> tags
	var h4Count = 0;//variable to help count <h4> tags
	var h5Count = 0;//variable to help count <h5> tags

	for (var i = 0; i < articleHeadingsAndFigures.length; i++) {//cycle through all children
		
		if (articleHeadingsAndFigures[i].tagName !== "FIGURE") {//if tag is not figure

			//this needs to be evaluated before applying h2count
			//appendix h2 count or not
			if (articleHeadingsAndFigures[i].tagName === "H2" && articleHeadingsAndFigures[i].classList.contains("appendix") === true && articleHeadingsAndFigures[i].classList.contains("nocount") === false) {//if <h2>, appendix and without nocount
				apH2count += 1;//add appendix h2 count
				//console.log(apH2count)
			}

			//<h2> count
			if (articleHeadingsAndFigures[i].tagName === "H2" && articleHeadingsAndFigures[i].classList.contains("nocount") === false) {//if <h2> without nocount class
				h2Count += 1;//add to h2 count
				//h2count needs to be applied first before the below evaluation
				//test appendix count or not and set transitory h2 value
				modH2Count = (apH2count > 0) ? String.fromCharCode(64 + apH2count):h2Count;//if there is an appendix h2 count make h2 equal that with adjustment to upper alpha see https://stackoverflow.com/a/3145054/2035311 if not continue using h2count
				
				figCount = 0;//reset figure count for new h2 section, for table/figure counting
				figTabCount = 0;//reset figure table count for new h2 section, for table/figure counting
				applyCount(modH2Count)
				//resets, to ensure sub sections can be recounted from scratch
				h3Count = 0;
				h4Count = 0;
				h5Count = 0;
			}

			//<h3> count
			if (articleHeadingsAndFigures[i].tagName === "H3" && articleHeadingsAndFigures[i].classList.contains("nocount") === false) {//if <h3> without nocount class
				h3Count += 1;//add to h3 count
				applyCount(modH2Count,h3Count)
				//resets, to ensure sub sections can be recounted from scratch
				h4Count = 0;
				h5Count = 0;
			}

			//<h4> count
			if (articleHeadingsAndFigures[i].tagName === "H4" && articleHeadingsAndFigures[i].classList.contains("nocount") === false) {//if <h4> without nocount class
				h4Count += 1;//add to h4 count
				applyCount(modH2Count,h3Count,h4Count)
				//reset to ensure sub sections can be recounted from scratch
				h5Count = 0;
			}

			//<h5> count
			if (articleHeadingsAndFigures[i].tagName === "H5" && articleHeadingsAndFigures[i].classList.contains("nocount") === false) {//if <h5> without nocount class
				h5Count += 1;//add to h5 count
				applyCount(modH2Count,h3Count,h4Count,h5Count)
			}

			if(articleHeadingsAndFigures[i].id === null || articleHeadingsAndFigures[i].id === ""){//if no ID already
				var idName = makeSafeForCSS(articleHeadingsAndFigures[i].textContent);//variable based on safe version of title
				
				if (document.getElementById(idName)){//check if idName exists to add unique id based on section number
					//console.log('taken')
					//idName += "-t" + takenIdCount;//add a taken flag as suffix with unique ID
					//takenIdCount += 1;//add a score to taken global var
					idName += "-" + (modH2Count ? modH2Count : "") + (h3Count ? "-" + h3Count : "") + (h4Count ? "-" + h4Count : "") + (h5Count ? "-" + h5Count : "");//add H count to taken name, an ID is too vague, conditional applied if counts are null. Should apply hard coded ID to conflicts found.
				}

				articleHeadingsAndFigures[i].id = idName;//make an ID based on contents of tag 
			}

			var sectionCountStored;//for storage of section count

			function applyCount(h2level,h3level,h4level,h5level){

				var sectionCount;

				if (h2level === 0) {//if h2 count equals zero
					h2level = h2level.toString();//turn h2 into string in the event that it starts with a 0 as leading zero will not convert. A leading zero will appear in the subheadings of a h2 with nocount applied
				}
				
				//based on available levels add to the section number
				if (h2level) {
					sectionCount = h2level;
				}
				if (h2level && h3level) {
					sectionCount = h2level + "." + h3level;
				}
				if (h2level && h3level && h4level) {
					sectionCount = h2level + "." + h3level + "." + h4level;
				}
				if (h2level && h3level && h4level && h5level) {
					sectionCount = h2level + "." + h3level + "." + h4level + "." + h5level;
				}

				//console.log(articleHeadingsAndFigures[i].innerHTML + "\n data: "+ h2level + "." + h3level + "." + h4level + "." + h5level + "\n sectionCount: " + sectionCount)

				articleHeadingsAndFigures[i].setAttribute("data-section", sectionCount);//add section number data to heading

				sectionCountStored = sectionCount;//save sectionCount to use outside of this function


			}

			if (navArea) {//for <nav>
				var navItem = document.createElement('a');//make a link for the nav item
				navItem.className = articleHeadingsAndFigures[i].className;//set the nav item to have the same classes as the heading tag found
				//navItem.classList.remove('showtarget');//(OLD we need these in nav now) remove the class target to avoid confusion with script for highlighting nav items
				navItem.classList.add(articleHeadingsAndFigures[i].tagName.toLowerCase());//add tagname as class
				navItem.href = "#" + articleHeadingsAndFigures[i].id;//give the link a href equal to the ID of the heading tag found
				if (sectionCountStored) {
					navItem.setAttribute("data-section-ref", sectionCountStored)//save data-section-ref attribute to navItem as a reference to the data-section attribute in the body text. AVOIDS using CSS to set counters
				}
				navItem.innerHTML = articleHeadingsAndFigures[i].textContent;//give the link text equal to the heading found
				navArea.appendChild(navItem);//append the navItem to the navArea
			}

			if (contentsArea) {//for contents list #contentsDiv
				var contentsItem = document.createElement('a');//make a link for the nav item
				contentsItem.className = articleHeadingsAndFigures[i].className;//set the nav item to have the same classes as the heading tag found
				contentsItem.classList.remove('hidetarget', 'pagenumreset');//remove the class target to avoid confusion with script for highlighting nav items AND remove page number reset class to avoid effects of this class other than for headings
				contentsItem.classList.add(articleHeadingsAndFigures[i].tagName.toLowerCase());//add tagname as class
				if (sectionCountStored) {
					contentsItem.setAttribute("data-section-ref", sectionCountStored)//save data-section-ref attribute to contentsItem as a reference to the data-section attribute in the body text. AVOIDS using CSS to set counters
				}
				contentsItem.href = "#" + articleHeadingsAndFigures[i].id;//give the link a href equal to the ID of the heading tag found
				contentsItem.innerHTML = articleHeadingsAndFigures[i].textContent;//give the link text equal to the heading found
				contentsArea.appendChild(contentsItem);//append the contentsItem to the contentsArea
			}



		}else{//tag is <figure>, run counts and add <figcaption> to list of figures

			//APPLY COUNT TO FIGURES table and image
			//REMOVE THE CSS FOR COUNTING

			//variables for storing figure numbers
			var figureCountStored;
			var figureTableCountStored;

			function countFig(figureElement){//function to do figure counting. Checks if table or figure, then adds count

				var elementFigcaption = figureElement.getElementsByTagName('figcaption')[0];//get figcaption from figure element

				if (elementFigcaption) {
					caption = elementFigcaption.innerHTML;
				}else{
					caption = "";
				}

				if(figureElement.getElementsByTagName('table')[0] || figureElement.getElementsByClassName('table')[0]){//if <figure> has <table> or element with the class table
					//console.log(table)
					figTabCount += 1;//add to table count
					count = String(modH2Count + "." + figTabCount);
					figureTableCountStored = count;//store count in table figure count
					applyCitation(figureElement, count, caption, "table");//apply count to where it is referenced in the document
					if (elementFigcaption) {//if figcaption is available
						elementFigcaption.setAttribute("data-table-ref", count);//apply table count reference data attribute to figcaption
					}
				}else{//<figure> first child is not a table
					figCount += 1;//add to figure count
					count = String(modH2Count + "." + figCount);
					figureCountStored = count;//store count in figure count
					applyCitation(figureElement, count, caption, "figure");//apply count to where it is referenced in the document
					if (elementFigcaption) {//if figcaption is available
						elementFigcaption.setAttribute("data-figure-ref", count);//apply figure count reference data attribute to figcaption
					}
				}
				
			}

			countFig(articleHeadingsAndFigures[i]);//add count to <figure>

			writeFigureLists(articleHeadingsAndFigures[i])//function to write lists of figures and tables
			
			function writeFigureLists(figureElement){//function to write figcaptions from figure element to list of figures
				
				var figcaptionElement = figureElement.getElementsByTagName('figcaption')[0];//get the figcaption inside the figure
					
				var figureLink = document.createElement('a');//make a link for the figcaption item
				figureLink.href = "#" + figureElement.id;//give the link a href equal to the ID of the heading tag found

				//apply attribute to mark the link creation as complete, useful for picking out user errors in refErrorCheck(), Using the parent function name so the attribute can be tracked back for debug
				//THIS MUST go here as the below conditional will write the elements to the respective lists
				figureLink.setAttribute("data-processed-by", "writeFigureLists")

				if(figureElement.querySelectorAll('table,.table').length > 0 && tableListArea){//if table (including tables with images or iframes, or elements marked with the table class) and tableListArea exists
					figureLink.setAttribute("data-table-ref", figureTableCountStored);//add count as table reference attribute to link
					writeFigureListItem(tableListArea);//set list element as list of tables div
				}else if(figureListArea){//catch all for figures and checks for figure list area
					figureLink.setAttribute("data-figure-ref", figureCountStored);//add count as figure reference attribute to link
					writeFigureListItem(figureListArea);//set list element as list of figures div
				}

				function writeFigureListItem(listElement){//this function writes list items to the element passed through
					var figureItem = document.createElement('p');//make paragraph for each figcaption
					figureItem.appendChild(figureLink);//append <figure> link to <p>
					if(figcaptionElement){//if figcaption is available
						figureItem.innerHTML += " <span>" + figcaptionElement.innerHTML + "</span>";//add <figcaption> text in <p> inside of span to allow nicer alignment with figure number
					}
					figureItem.className = figureElement.id;//make class name of item the same as the figure ID to allow table/figure matching with CSS
					listElement.appendChild(figureItem)//append <p> to list of figures
				}
					
			}
		}	
	}//end for loop
}

function applyCitation(element, count, caption, citestyle){//function for making links—this is the HSP special sauce right here. It takes element (such as <figure> <li>), count, caption text for hover, citestyle takes string "citation" to add square brackets, "section" for cross reference styling, "figure" to carry over title
	//console.log(figureElement.id)
	var elementId = element.id;

	var bodyTextContainer = document.getElementsByTagName("article")[0];//get body text, first <article> element
	//var figCaptionText = figureElement.getElementsByTagName('FIGCAPTION')[0].innerHTML;
	var elementLinks = bodyTextContainer.querySelectorAll("a[href='#" + elementId + "']");//get all anchors with element target link WITHIN body to avoid targeting links in nav
	
	if(elementLinks && elementId){//if elementlinks and element
		//console.log("ID: " +elementId + "\n Links:" + elementLinks.length)
		for (var i = 0; i < elementLinks.length; i++) {//for each element target link

			//elementLinks[i].classList = elementIdClasses;//add classes from elementId

			if(elementLinks[i].innerHTML !== "") {//if link is not blank
				elementLinks[i].textContent = count + ", " + elementLinks[i].textContent;//make link text equal to count plus existing text seperated with comma useful for adding specific time or page reference
			}else{
				elementLinks[i].textContent = count;//make link text equal to count
			}

			if (citestyle === "figure") {//if styling figure link
				elementLinks[i].textContent = "Figure " + elementLinks[i].textContent;//add label to count.. adding it this way to have actual text in document flow instead of CSS psuedo
				elementLinks[i].setAttribute("data-figure-ref", count);//add data attribute for figure count
			}

			if(citestyle === "table"){//if styling table link
				elementLinks[i].textContent = "Table " + elementLinks[i].textContent;//add label to count.. adding it this way to have actual text in document flow instead of CSS psuedo
				elementLinks[i].setAttribute("data-table-ref", count);//add data attribute for table count
			}

			if (citestyle === "citation") {//for styling citations
					elementLinks[i].textContent = "[" + elementLinks[i].textContent + "]";
			}
			
			if (citestyle === "citation" || citestyle === "figure" || citestyle === "table") {//for citations, table or figure references
				elementLinks[i].title = decodeEntities(caption);//apply text to title of link and decode HTML so it's visible on hover
			}

			if(citestyle === "section" && count){//for cross references with count
				//elementLinks[i].title = "";
				//elementLinks[i].innerHTML = caption + " [&sect;&nbsp;" + count + "]";
				elementLinks[i].innerHTML = caption;//add title text to link
				elementLinks[i].setAttribute("data-section-ref", count);//add data attribute for section count this way we can control when section text appears or not e.g. no section numbers are required in contents list
			}else if(citestyle === "section"){//for cross references without section number count
				elementLinks[i].innerHTML = caption;//add title text only
			}

			//apply attribute to mark the citation as complete, useful for picking out user errors in refErrorCheck(). Using the parent function name so the attribute can be tracked back for debug
			elementLinks[i].setAttribute("data-processed-by", "applyCitation")
		}
	}
	
}

function populateCrossRefLinks(){//function to populate cross references (for sections)

	var bodyTextContainer = document.getElementsByTagName("article")[0];//get body text, first <article> element
	
	var bodyTextContainerHeadings = bodyTextContainer.querySelectorAll('h2,h3,h4,h5,h6');//get headings

	for (var i = 0; i < bodyTextContainerHeadings.length; i++) {
		var headingElement = bodyTextContainerHeadings[i];//get heading element	

		//console.log("Title: " + headingElement.innerHTML + "\n data-section: " + headingElement.getAttribute("data-section"))

		applyCitation(headingElement, headingElement.getAttribute("data-section"), headingElement.innerHTML, "section")

	}

}

function sortAndLinkBib(){//function to automatically sort bibliography and turn text links into clickable links and call function to create citation links to bibliography
	var bibContainer = document.getElementById('bibliographyDiv');//get bibliography container
	//bibContainer.childNodes
	if (bibContainer) {//check for bibcontainer
		var bibItems = bibContainer.getElementsByTagName('li');//get items from bibliography container

		function sortList() {//from https://www.w3schools.com/howto/howto_js_sort_list.asp
			var list, i, switching, b, shouldSwitch;
			list = bibContainer;
			switching = true;
			while (switching) {//Make a loop that will continue until no switching has been done
				switching = false;//start by saying: no switching is done
				b = list.getElementsByTagName("li");
				for (i = 0; i < (b.length - 1); i++) {//Loop through all list-items
					
					shouldSwitch = false;//start by saying there should be no switching
					if (b[i].innerHTML.toLowerCase() > b[i + 1].innerHTML.toLowerCase()) {//check if the next item should switch place with the current item
						shouldSwitch = true;//if next item is alphabetically lower than current item, mark as a switch
						break;//and break the loop:
					}
				}
				if (shouldSwitch) {
					b[i].parentNode.insertBefore(b[i + 1], b[i]);//If a switch has been marked, make the switch
					switching = true;//and mark the switch as done
				}
			}
		}
		sortList()

		function replaceLinks(element){//function to make links out of plain text URLs. Takes a html element
			var string = element.innerHTML;//string is innerHTML of element
			var pattern = /(?:https?)(.+?(?=\.\s)|.+?(?=\,\s)|[^\s]+)/gi;//pattern for finding http, https and www until whitespace, excludes full stop and comma preceeding whitespace OLD pattern /(?:https?)[^\s]+/gi;

			//matching based on https://stackoverflow.com/a/432503
			match = pattern.exec(string);
			while (match != null) {
				// matched text: match[0]
				// match start: match.index
				// capturing group n: match[n]
				if(match[0].match(/youtube/g) || match[0].match(/vimeo/g) || match[0].match(/netflix/g)){//check for youtube or vimeo in URL. This allows for a nifty class which we can style with CSS
					element.classList.add("videoLink")//add videoLink class to video links
				}
				//console.log(match[0])
				var link = match[0];
				element.innerHTML = element.innerHTML.replace(link, "<a href='"+ link +"' target='_blank' data-processed-by='replaceLinks'>" + link + "</a>")//replace plain link in innerHTML with anchor in new tab, important not to do string.replace as it will just use the original unmodified element.innerHTML. ALSO apply attribute to mark the link creation as complete, useful for picking out user errors in refErrorCheck(), Using the parent function name so the attribute can be tracked back for debug
				match = pattern.exec(string);
			}

		}

		for (var i = 0; i < bibItems.length; i++) {//for all bib items
			replaceLinks(bibItems[i])//function to replace links
			//applyCitation MUST go last, so things all necessary processes for bib item text have run first
			applyCitation(bibItems[i], i+1, bibItems[i].innerHTML, "citation")//apply count and caption function with index of bib item after sort as count, inner html of bib item as caption and bibstyle set to true
			
		}
	}
}

//a function to check for any refererences which are not working, specifically where there's an attempt at a cross reference but none of HSPs functions have processed it
function refErrorCheck(){

	var lonelyAnchors = document.querySelectorAll('article a:not([data-processed-by])[href^="#"')//all anchors in the <article> that do not have a data-processed-by attribute and have a href begining with #

	if(lonelyAnchors.length > 0){//if there are anchors that need to be addressed

		for (var i = 0; i < lonelyAnchors.length; i++) {//go through all the anchors, apply error style and text
			lonelyAnchors[i].style.color = "white"
			lonelyAnchors[i].style.backgroundColor = "red"
			lonelyAnchors[i].innerHTML =  "NO&nbsp;MATCH&nbsp;FOR&nbsp;&rarr;&nbsp;" + lonelyAnchors[i].getAttribute("href");//added non breaking spaces to warning so it appears as one line
		}

		var instruction = ". Search this page with the term 'NO MATCH FOR' to locate the error"

		if (lonelyAnchors.length > 1) {//split warning into message for more than one error and one error
			alert("There are " + lonelyAnchors.length + " cross reference errors in this document" + instruction + "s.")
		}else{
			alert("There is " + lonelyAnchors.length + " cross reference error" + instruction + ".")
		}
		
	}

}

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

	//below is to counter Safari print PDF bug
	if (document.getElementsByTagName('body')[0].getAttribute("data-rendered") === "true") {//if scripts have been run
		return;//stop scripts
	}

	//at some point the HTML generated from three functions should be baked in rather than run each time the page is loaded.
	makeNav()//makes nav menu
	sortAndLinkBib()//sorts and adds links to bibliography
	populateCrossRefLinks()//populates cross refs
	refErrorCheck()//check for bad cross references
	
	smoothScrollTargets()//listener for smooth scrolling when clicking on HTML targets

	loadShowNavState()//loads nav open/closed and loads saved position

	var windowWidth = window.innerWidth;//capture window width, to double validate onresize

	//reload scroll position recorded from last session
	document.getElementsByTagName('body')[0].onresize = function(){//on window resize
		if (window.innerWidth != windowWidth) {//if window width has actually changed. There is a bug on iOS where onresize is triggered by scrolling
			windowWidth = window.innerWidth;//update the windowWidth var to the latest window width
			loadScrollPosition()//load scroll position
		}
	};

	document.getElementsByTagName('body')[0].setAttribute("data-rendered", "true");//add attribute once script has finished running to indicate that everything is printed. Safari 12.0.2 re-runs scripts on PDF exports that interfere with bibliography and figure links.

	//print rendered HTML to console.log
    //console.log(document.getElementsByTagName('html')[0].innerHTML);
    
}