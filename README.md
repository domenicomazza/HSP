# HTML Simple Publishing (HSP) <sup>v1.0.0</sup> Documentation 

[HTML Simple Publishing (HSP)](https://github.com/domenicomazza/HSP) allows you to make easy to navigate publications for the web. HSP uses JavaScript (JS) and CSS styling to turn well-formatted HTML into neat publications you can put on the web and generate into print PDFs.

Read this documentation formatted with HSP at: [https://domenicomazza.github.io/HSP/](https://domenicomazza.github.io/HSP/).

## Features

HSP extends a HTML web document to do the nice things one would find in a document preparation system like LaTeX such as neat cross-references and section numbering. HSP features:

- **Responsive layout** which works on screens small and large
- **Pop-out Side Menu** that allows the reader to quickly skip through sections or see where they are in the document
- **Silent session saving** so the user can come back to where they left off when re-opening a document on the same device and web browser
- **Followable section links** to guide a reader to a specific element in the document (just right click and 'Copy Link' for any link)
- **Bibliography item A-Z sorting and organisation** which makes links clickable with special recognition of YouTube and Vimeo links
- **Automatic cross-reference formatting** for section headings, bibliography items, figures and tables—just give your anchor an internal link
- **Automatic lists** such as contents, list of figures and list of tables
- **Print ready PDF formatting and automatic heading bookmarks** not supported by web browsers, but accessible via [Prince](https://www.princexml.com) which leverages [CSS Paged Media](https://www.w3.org/TR/css-page-3/)

## Demos

Two demos are included in the `/demo` directory:
- `/demo/exegesis`: a [PhD exegesis](https://domenicomazza.github.io/HSP/demo/exegesis/) with all features in action
- `/demo/exhibition`: a [PhD exhibition documentation](https://domenicomazza.github.io/HSP/demo/exhibition/) with an emphasis on multimedia

## Recommendations

To enjoy using HSP it's recommended you have:
- Basic HTML knowledge. Great guides are available at [Codecademy's Learn HTML](https://www.codecademy.com/learn/learn-html) or [W3Schools' HTML Tutorial](https://www.w3schools.com/html/default.asp)
- Basic CSS knowledge, such that [selectors](https://www.w3schools.com/css/css_selectors.asp) make sense 
- The ability to write Markdown and export HTML documents using an application such as [iA Writer](https://ia.net/writer). This is a better option than manually writing all your HTML tags

To get your hands dirty with HSP, plain JavaScript is all you need and Codecademy once again has a great [Introduction to Javascript](https://www.codecademy.com/learn/introduction-to-javascript).

## Structure

You can explore fully featured demos in the `/demo` directory. These HSP documents are made of:
- A HTML document. The writing you see goes in-between the `<article>` tags
- JavaScript `master-script.js` which processes the HTML to populate links, populate navigation and lists. It also assists with navigation by saving and loading the reader's view and highlighting the current section being read
- CSS `stylesheet.css` contains all the default style rules

## HTML

HSP treats some HTML tags in a particular way. Consider the tags below as HTML tags that have special meaning to HSP, or can be leveraged in other helpful ways.

| HTML | Usage | Note |
| :------------- | :----------: | :----------: |
| `<h1>`, `<h2>`, `<h3>`, `<h4>`, `<h5>`, `<h6>`,  | Enclose your headings with these heading tags. `<h1>` signifies the highest level heading while `<h6>` signifies the lowest level. | HSP honours `<h1>` as your document title so section numbering begins from `<h2>` (e.g. 1 Subtitle) and `<h4>` defines a section number three levels deep (e.g. 1.2.2 Sub-sub-subtitle). `<h6>` being five levels deep does not get numbered by HSP.  |
| `<figure>` and `<figcaption>`| Use `<figure>` to enclose images and tables and `<figcaption>` for the associated caption | HSP reads `<figure>` for figure and table numbering. It will detect `<table>` nested inside `<figure>` and name anything that's not a table a *figure*  |
| `<table>` (or class `table` applied to an element) inside `<figure>` | To add your table to the list of tables `tableListDiv` if available | You can substitute a `<table>` element with any element assigned the class `table` in instances where you prefer to not use a native HTML table |
| `<div>` | `<div>` serves to enclose content (in CSS `block` style). Web browsers give no special visual attribute to `<div>`. | Great for defining 'list of figures' areas or setting up page breaks for print using the `pagebreak` class |
| `<span>` | `<span>` serves to enclose content (in CSS `inline` style). Web browsers give no special visual attribute to `<span>`. | Great for styling text with your own custom CSS classes or preset classes such as `greyout` or `secondary` |

## Classes and IDs

HSP looks for specific classes and IDs to perform actions related to compiling lists and building the side menu navigation. There are also CSS classes to help with common formatting requirements and print-ready styling. These classes and IDs are recommended for particular HTML elements.

### List IDs

HSP generates automatic lists of headings, figures and tables. Below are the IDs instruct where HSP should output these lists if you need them.

| ID | Usage | Recommended for |
| :------------- | :----------: | :----------: |
| `contentsDiv` | container for contents list | `<div>` |
| `figureListDiv` | container for list of figures | `<div>` |
| `tableListDiv` | container for list of tables | `<div>` |

### Navigation classes

Below are classes which help with formatting things related to navigation of a HSP publication.

| Class | Functionality | Use | Compatible with |
| :------------- | :----------: | :----------: |:----------: |
| `open` or `closed` | Will by default open or close the side menu on load. Nb. this does not override the saved open or closed state | When the side menu needs to be open or closed by default | `<div id='nav'>` |
| `hidetarget` | Removes menu highlighting on applied heading | Wherever you might prefer the parent element to be highlighted instead e.g. very small sections of text | `<h2>`, `<h3>`, `<h4>`, `<h5>` |
| `nocount` | Skips automatic counting on the applied heading. Useful for sections that are not numbered. | Useful for front matter headings e.g. preface, list of figures, etc. | `<h2>`, `<h3>`, `<h4>`, `<h5>` |
| `nolist` | Apply this to titles to hide them from the menu  | For content that only appears in print e.g. a table of contents heading  |  `<h2>`, `<h3>`, `<h4>`, `<h5>` |
| `appendix` | Add this class to your appendix headings for appropriate numbering of appendices prefixed with letters e.g. A.1 or B.2.1 | Appendix numbering | `<h2>`, `<h3>`, `<h4>`, `<h5>` |

### Additional text styles

Below are classes which help with styling text in a HSP publication. Most text is styled based on its HTML tag, for additional styles it's recommended to utilise a custom CSS stylesheet as shown in the demo folder.

| Class | Functionality | Use | Compatible with |
| :------------- | :----------: | :----------: |:----------: |
| `center` | Will center an element | For center aligning headings or blocks of text | Text elements such as `<h1>` or `<p>`|
| `greyout` | Greys out text anywhere in the document when applied to a `<span>` | For greying out text outside of figure/table captions | `<span>` |

Note, you can leverage HTML for text styling such as `<sup>` for superscript text. In addition to formatting, such as `<ul>` for unordered lists and `<ol>` for ordered lists.

### Figure styles

Styles for figure in HSP. Applied to `<figure>` or `<figcaption>`

| Class | Functionality | Use | Compatible with |
| :------------- | :----------: | :----------: |:----------: |
| `sidebyside` | Place images two to a row | Image grid | `<figure>` |
| `sidebysidethree` | Place images three to a row | Image grid | `<figure>` |
| `sidebysidefour` | Place images four to a row | Image grid | `<figure>` |
| `fullwidth` | Set a `<figure>` to occupy the full text block width | For tables and images which can benefit from full width | `<figure>` |
| `halfwidth` | Set a `<figure>` to occupy the half of the text block width  | For tall images | `<figure>` |
| `secondary` | Greys out and reduces the size of secondary text in `<figcaption>` when applied to a `<span>`. Greyed out style is also applied in list of figures/tables | For secondary text in figures such as copyright notices | `<span>` in  `<figcaption>` |

### Print classes

Below are classes for print styling. Additional styles should be written in standalone custom stylesheets as shown in the demo folder.

| Class | Functionality | Use | Compatible with |
| :------------- | :----------: | :----------: |:----------: |
| `noprint` | Do not show an element in print | Avoid print out of digital content such as the side menu | any HTML element |
| `printonly` | Show an element only in print | For replacing digital content (e.g. show list of contents while hiding the side menu with `noprint`), adding print only content such as a contents page, or adding special notes for print. | any HTML element |
| `frontmatter` | Defines front matter headings. The first instance of the class is used as the point in which to start counting in lowercase roman numerals | Show lowercase roman numerals | Apply to heading tags in frontmatter |
| `pagenumreset` | Resets page numbering for print | Useful for defining when numeric page numbers start (allows lower case roman numerals to end) | Best applied to appropriate heading tag e.g. Introduction |
| `pagebreak` | Adds a one page break for print. `<h2>` have page breaks applied by default | To add blank pages | empty `<div>` |

## Cross-references and citations

One of the most satisfying features of HSP is cross-referencing. It leverages HTML's natural internal linking abilities, known as *HTML targets*. However, HSP does some special work to differentiate and style a link to your bibliography, a figure, a table or a section heading.

### HTML internal linking

HTML internal links are simple, and the basis for HSP cross-referencing. Normally your `<a>` tags have a `href` value that points to an external URL e.g. `href='https://do.meni.co'`. An internal link instead uses the ID of any element prefixed with a `#`. If you want to link to an element with the ID `myAmazingThing` your link will be `href='#myAmazingThing'`. The user that clicks on this will be moved to that element. 

### Cross-reference types

There are four cross reference types that get special treatment in HSP, described in the table below with examples and descriptions.

| Cross reference type | Example output | Description |
| :------------- | :----------: |:----------: |
| Section heading | `Section Title [§ 1.2.3]` | Title is copied along with automatic numbering and section symbol |
| Figure | `Figure 1.2` | Figure label along with automatic numbering and caption on hover |
| Table | `Table 1.2` | Table label along with automatic numbering and caption on hover |
| Bibliography citation | `[12]` or `[12, pp.11-23]` | Automatic numbering OR automatic numbering with custom text from text within link anchor e.g. `<a href='#citation:2022'>pp.11-23</a>`. Citation text from bibliography shown on hover |

#### Recommendations for cross-reference IDs

Cross-reference IDs are set manually, except for section heading IDs which are generated automatically for the side menu navigation. You must exercise caution in naming your IDs. HSP will notify you if you have any attempted internal links which are not working i.e. href beginning with a `#` and no corresponding ID. Recommendations are as follows:

- For bibliography items use an ID which is distinct. An author surname, combined with year and a unique character combination should be enough to create a unique ID e.g. `id="surname-2022-01`. The included demos use BibTeX style cite keys e.g. `id="Mazza:2017kn"`
- Make figure and table IDs easy to distinguish and nice looking in any links by prefixing them with 'fig-' and 'tab-' respectively (e.g. `id='fig-graph-1'`)
- If you require a neater heading ID you can assign your own section heading IDs to overwrite automatically generated IDs

## Optimisation

Since HSP's `master-script.js` will redo all its processing on load, you can save loading time by copying all of the HTML produced by HSP and placing it into a standalone document for publication. You can easily do this by opening the document in a web browser, viewing the page source and copying all of the source code. Nb. do this in a private window without scrolling to ensure the code is free of any generated classes to highlight the current section heading.

`script.js` is provided for you to use in place of `master-script.js` in your copied source code—it is for navigation only (scroll position and side menu visibility saving and loading, and current section highlighting).

This optimisation is a requirement for generating print ready PDFs as described ahead in *Print-ready PDFs*.

Check out optimised versions of the demo exegesis at [https://do.meni.co/phd](https://do.meni.co/phd) and exhibition documentation at [https://do.meni.co/phd/exhibition](https://do.meni.co/phd/exhibition).

## Print-ready PDFs

[Prince](https://www.princexml.com) can be used to generate print ready PDFs from optimised HSP documents (see Optimisation), for free for non-commercial use. Once Prince is installed, the command to output a PDF can be as simple as: `prince index.html -o output.pdf`

## Colophon

HSP was born with love at the end of the author's PhD. Making research writing as easy to access as possible is at the heart of this project.

The default typeface used in HSP is *Roboto Mono* by Christian Robertson, available at [Google Fonts](https://fonts.google.com/specimen/Roboto+Mono). This typeface is distributed under an Apache License, Version 2.0.

## License

HSP is distributed under a GNU GPLv3 license. The publications in the `/demo` directory maintain their respective copyright and have their own copyright notice.
