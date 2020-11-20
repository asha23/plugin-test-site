=== WP Table Manager ===
Contributors: Joomunited
Donate link: 
Tags: table manager, nice table
Requires at least: 3.5
Tested up to: 5.5.1
Stable tag: 2.7.2
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

WP Table Manager is a table manager that helps you to categorize, create & edit table easily. UX is AJAX powered, the easiest table manager ever created.


== Description ==

More informations available here: http://www.joomunited.com/wordpress-products/wp-table-manager

Main plugins from JoomUnited:
WP Media Folder: https://www.joomunited.com/wordpress-products/wp-media-folder
WP File Download: https://www.joomunited.com/wordpress-products/wp-table-manager
WP Table Manager: https://www.joomunited.com/wordpress-products/wp-file-download
WP Meta SEO: https://www.joomunited.com/wordpress-products/wp-meta-seo
WP Latest Posts: https://www.joomunited.com/wordpress-products/wp-latest-posts

WP Table Manager is the only table manager for WordPress that offers a full spreadsheet interface to manage tables. 
Create a table, apply some really cool themes and start edit tables data. The tool is perfect for webmaster and final client.

As a webmaster you'll like to use advanced tools like html cell edition, table copy, use some calculation, edit custom CSS, theme modification, excel import/export and so on. 
Then, editing a table becomes as simple as click on cell, edit data with or without visual text editor and it's automatically saved! 
Usually tables require HTML/CSS knowledge, this is no longer the case, this extension is really easy for beginners. 
It works in the same way both public and admin side, plus, full table edition can be done right from your editor in a lightbox.

Main advantages:
- Manage tables like in a spreadsheet
- 6 themes included
- Visual & HTML cell edition
- AJAX automatic saving and undo
- Sortable data on frontend
- Create chart from data
- Resize line and column using handles
- Copy cell with drag'n drop
- Copy the full table in one click
- Responsive or scroll mode
- Excel import/export
- Get WP Table manager, the only and most advanced table manager for WordPress 


== Installation ==

1. Upload `WP Table Manager` to the `/wp-content/plugins/` directory or browse and upload zip file from WordPress standard installer
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Use the "Table Manager" menu to edit table or edit it from your editor using a dedicated button

== Frequently asked questions ==

= How do I add tables in my WordPress content? =

Just open you content and you'll a button named "WP Table Manager" at the top left of your editor.

= Can I put tables into categories? =

Yes you can classified tables into categories. 

== Changelog ==

= 2.7.2 =
 * Fix : Copy table
 * Fix : Add space as thousand separator in number format
 * Fix : Sync Excel function
 * Fix : Browse server window style
 * Fix : Undo/redo function

= 2.7.1 =
 * Fix : Set table height default to auto
 * Fix : Check url when fetch file from Google Spreadsheets
 * Fix : Table style on front-end
 * Fix : Warning when upgrading from old version

= 2.7.0 =
 * Add : New UX design of the table editor
 * Add : New UX design of the table and category manager
 * Add : Better responsive mode with cell group and accordion
 * Add : Possibility to define data type for column
 * Add : Improve table auto saving when table not edited
 * Add : Google Sheets import detects when the data are not accessible
 * Add : Improve loading table performance on front-end
 * Add : New database structure to store and modify large tables
 * Add : New design for table from database creation
 * Add : PHP 7.4 compatibility
 * Add : Option to remove all tables data when uninstalling the plugin

= 2.6.9 =
 * Fix : JoomUnited Updater compatible with WordPress 5.5

= 2.6.8 =
 * Fix : Translation sharing issue in some browsers

= 2.6.7 =
 * Add : Implement the block preview
 * Fix : change position of tooltip
 * Fix : Apply the decimal separator and the thousand separator separator setting when import excel file

= 2.6.6 =
 * Add : Sync Google Sheets automatically on frontend page load
 * Fix : Apply dateFormat setting into table sort function
 * Fix : Remove unused taxonomy wptm-tag

= 2.6.5 =
 * Fix : Fix Jutranslation url

= 2.6.4 =
 * Fix : High commas as thousand separator option doesn't apply
 * Fix : Table not displayed in ACF field

= 2.6.3 =
 * Add : add wptm gutenberg block

= 2.6.2 =
 * Fix : warning on php 7.2

= 2.6.1 =
 * Fix : The function convert background color of default table to alternate color
 * Fix : The Functionality checks null when importing file .xlsx

= 2.6.0 =
 * Add : Rebuild the alternate color tool: create and apply your 2 lines colors
 * Add : Frontend button to download the table as XLSX file
 * Add : Upgrade phpspreadsheet library.
 * Fix : Improve function Import and Export files xlsx

= 2.5.3 =
 * Fix : conflict anchor-header plugin
 * Fix : site using http and https parallel

= 2.5.2 =
 * Add : Spreadsheet style fetch function autosaved
 * Add : Get hyperlink from Google Spreadsheets
 * Add : Get lines and columns sizes from Google Spreadsheets
 * Fix : Error page loading in Microsoft Edge
 * Fix : Merge cells properly when auto sync is activated
 * Fix : Change the color pickup by cell function

= 2.5.1 =
 * Fix : Chat color selector
 * Fix : Right click menu is returning wrong values
 * Fix : Improve design in editor tooltip table manager

= 2.5.0 =
 * Add : Admin full UX redesign
 * Add : Allow to edit data range of a chart
 * Add : Improve display ability in large/big table

= 2.4.3 =
 * Fix : Sharing translations

= 2.4.2 =
 * Fix : Improved the ability to create tables from database
 * Fix : Improved the ability to create tables from spreadsheet link

= 2.4.1 =
 * Fix : Enhance code readability and performance

= 2.4.0 =
 * Add : Calculation functions: DATE, DAY, DAYS, DAYS360, OR, XOR, AND
 * Add : Possibility to make calculation on money cells
 * Add : Addition of date calculation functions

= 2.3.2 =
 * Fix : Missing access permissions on new install

= 2.3.1 =
 * Fix : Update the updater :) for table manager 2.3.0
 * Fix : Multisite installation plugin deployment

= 2.3.0 =
 * Add : Setup rights per user role on table categories: Create, Delete, Edit, Edit own
 * Add : Setup rights per user role on tables: Create, Delete, Edit, Edit own
 * Add : Setup rights per user role to access to WP Table Manager UX
 * Add : Add a font color for cell highlight feature
 * Add : Possibility to sort a column by default, on page load

= 2.2.10 =
 * Fix : Display error when enable Freeze first
 * Fix : Pagination not displaying in table category

= 2.2.9 =
 * Fix : Import excel file which contain non utf-8 characters

= 2.2.8 =
 * Fix : Error when JU framework is not installed

= 2.2.7 =
 * Fix : Issue on upgrading from light version to full version

= 2.2.6 =
 * Fix : Update the updater for WordPress 4.8

= 2.2.5 =
 * Fix : Use default en_US language

= 2.2.4 =
 * Fix : Text domain related problem for JUTranslation

= 2.2.3 =
 * Add : JUTranslation implementation

= 2.2.2 =
 * Fix : CSS style frontend rendering
 * Fix : Import XLS tables style not complete

= 2.2.1 =
 * Fix : Excel importer issue
 * Fix : Display issue when freezing row on mobile devices

= 2.2.0 =
 * Add : Use WP Table manager with page builder: ACF
 * Add : Use WP Table manager with page builder: Beaver Builder
 * Add : Use WP Table manager with page builder: DIVI Builder
 * Add : Use WP Table manager with page builder: Site Origine
 * Add : Use WP Table manager with page builder: Themify builder
 * Add : Use WP Table manager with page builder: Live composer
 * Fix : Pagination display on database tables

= 2.1.0 =
 * Add : Create tables from WordPress database (not only WordPres tables, all the tables from the database)
 * Add : Automatic styling and filtering for database tables
 * Add : Table automatic update on database incrementation
 * Add : Database source: table, column, filters, define ordering and column custom name
 * Add : Create chart from database table
 * Fix : First time the tooltip is displayed it blinks (JS fix)

= 2.0.1 =
 * Fix : Admin column header not responsive layout
 * Fix : PHP7 compatibility for Excel table export

= 2.0.0 =
 * Add : Enhanced .xls Import/Export: possibility to Import/Export only data
 * Add : Handle Excel styles on Import/Export: HTML link, font color, font size, cell background color, cell border
 * Add : Sheet data synchronization: Select an excel file on the server, fetch data and define a sync delay
 * Add : Sheet data synchronization: Select a Google Sheet, fetch data and define a sync delay
 * Add : Notification when a file has an external sync to avoid data lost
 * Fix : Vertical scrolling issue on large table

= 1.4.1 =
 * Fix : PHP7 JU framework compatibility

= 1.4.0 =
 * Add : Data filtering and ordering tool as an option
 * Fix : Language update

= 1.3.0 =
 * Add : Add column and line freezing
 * Fix : Issue loading twice WPTM in a post
 * Fix : Height available of screen viewport

= 1.2.1 =
 * Fix : Tooltip have wrong size when column is resized

= 1.2.0 =
 * Add : Generate tooltip on cell, activate through a global option
 * Add : Respect WordPress user roles to give access to table data
 * Fix : Menu name change to fit WordPress admin column width
 * Fix : Polylang JS conflict
 * Fix : Custom CSS edition cursor not visible

= 1.1.1 =
 * Fix : Cell mergin not reflecting on public side
 * Fix : Table copy not copy all data

= 1.1.0 =
 * Add : JoomUnited automatic updater
 * Add : Performance optimization on loading time and for big tables
 * Add : Possibility to move a table from one category to another
 * Add : Possibility to reorder tables in a category
 * Add : Shortcode per table and chart
 * Add : Add codemiror in custom CSS edition window

= 1.0.0 =
 * Add : Initial release



== Upgrade notice ==

use our automatic updater or uninstall/install new version.

== Arbitrary section 1 ==