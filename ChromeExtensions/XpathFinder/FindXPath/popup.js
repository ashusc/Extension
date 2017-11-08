/**
 * @ Author: Ashutosh Mishra, NNG Experiments.
 * @ Version 1.0.0
 * @ Started 25 AUG 2017
 * @ Modified 07 Nov 2017
 * @ Site Step Recorder, Locator XPath Generation
 *
 * @license : MIT License 2017
 * Use of this source code is open
 */

//Local vars for popup.
var data = {
		"message"	: '',
		"status"	: 'off',
		"element"	: '',
		"text"		: '',
		"name"		: '',
		"className"	: "",
		"id"		: '',
		'dimension'	: '',
		"xpath"		: '',
		"xpath_Suggestions"	: ''
};

// Ready to insert the script, when DOM is loaded.
	/*document.addEventListener('DOMContentLoaded', function() {
		console.log('started...');
		// Set the initial recording status.
		renderStatus();

		//getting buttons and then setting/registering click event for them.
		var btns = document.querySelectorAll('button');
		for (var i = 0; i < btns.length; i++) {
			btns[i].addEventListener('click', click);
		}

	});*/

//================================================================================================================
// Message Passing [popup, injection, background]
//================================================================================================================
	chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
		// Listening msg from background script
			if(msg.from == 'background'){
				console.log("Message from the background.");
				data.message = msg.message;
				data.element = msg.data.element;
				data.id		= msg.data.id;
				data.name	= msg.data.name;
				data.text	= msg.data.text;
				data.xpath	= msg.data.xpath;
				data.className = msg.data.className;
				data.dimension =  msg.data.dimension;
				data.xpath_Suggestions = msg.data.xpath_Suggestions;
				showData();
			}
	});

	function retrieveStatus(obj, msgTo){
		chrome.runtime.sendMessage({
				from	:	"popup",
				to		:	msgTo,
				message	:	"Sending data",
				data	:	obj
		});
	}

//================================================================================================================
// Functions
//================================================================================================================
	function recordOnClick(e) {
		//Executing a script on current tab window
		//chrome.tabs.executeScript(null,	{ code : "console.log('Recording Started'); window.localStorage.setItem('ext_setting_startRec_status','ON');" });
		//Sending this data to background
		chrome.runtime.sendMessage({'from':'popup', 'event':'on-recordbtn-click', 'message':'Sending the recording status.', 'data': {'status':'on'} });
	}

	function showData(){
		console.log("popup: Rendering Result.");
		//if(data.element !== undefined || data.element !== "" || !isNaN(data.element) ){
			//console.dir( data );
			document.getElementById('status').innerHTML = '<table cellspacing="0" border="1" cellpadding="2"><thead><tr><th width="20%">Property</th><th align="left">Value</th></tr></thead><tbody>' +
														 '<tr><td width="20%" align="right"> Id: </td><td> ' + data.id + '</td></tr>' +
														 '<tr><td width="20%" align="right"> Name: </td><td> ' + data.name + '</td></tr>' +
														 '<tr><td width="20%" align="right"> ClassName: </td><td> ' + data.className + '</td></tr>' +
														 '<tr><td width="20%" align="right"> Element: </td><td> ' + data.element + '</td></tr>' +
														 '<tr><td width="20%" align="right"> DIMENSIONs: </td><td> ' + data.dimension + '</td></tr>' +
														 '<tr><td width="20%" align="right" title="Considered first 10 charecters of innerText."> INNERTEXT: </td><td> ' + data.text + '</td></tr>' +
														 '<tr><td width="20%" align="right">' +
														 	' XPATH: </td><td> ' + data.xpath + '<table border="0" spacing="2"></tbody>' +
																'<br/> <b><u><i>Further Suggestions:</b></u></i> <tr><td> '+ data.xpath_Suggestions +' </td></tr>' +
															'</tbody></table>' +
														 '</td></tr>' +
														 '</tbody></table>';
		//}else {
			//document.getElementById('status').innerHTML = '<table cellspacing="0" border="1" cellpadding="2"><tr><th width="20%"> No Data </th></tr></table>';
		//}
	}

	//Whenever extension popup opens
	function cb_script_popup_open(data){
		chrome.runtime.sendMessage({'from':'popup', 'event':'on-popup-open', 'message':'Callback after successful injection.', 'data': {'info':'popup opened'}});
	}

//================================================================================================================
// Once This[Extension UI] POPUP DOM is Ready, then execute this script.
//================================================================================================================
	window.addEventListener('DOMContentLoaded', function () {

			// ...query for the active tab...
			chrome.tabs.query( { active: true, currentWindow: true }, function (tabs) {
					// ...and send a request for the DOM info...
					chrome.tabs.sendMessage( tabs[0].id, {from: 'injection', subject: 'DOMInfo'}, cb_script_popup_open );
			});

			// Load the current data, when popup is open/shown.
			showData();

			// Record Button click event registration.
			//document.getElementById('startBtn').addEventListener('click', recordOnClick);
	});
