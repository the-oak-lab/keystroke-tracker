/*******************************************************************
* File Name         : key_tracking.js
* Description       : This file contains JavaScript code to track key usage
*                     on short response questions on Qualtrics. If you use
*                     this tool, please cite Asher et al., 2026: 
*                     article DOI: 10.1177/25152459261424723
*                    
* Revision History  :
* Date				  Author    		  Comments
* ---------------------------------------------------------------------------
* 03/01/2025		Michael Asher	 Created.
* 04/01/2025		Eason Chen	     Edited code.
* 11/27/2025        Michael Asher    Commented code. 
* 02/06/2026        Michael Asher    Updated code for easier sharing. 
/******************************************************************/

// Execute when the Qualtrics survey question loads
Qualtrics.SurveyEngine.addOnload(function () {

    // Change this to match your page (e.g., "page1", "page2", "demographics", etc.)
    var PAGE_ID = "page1";
	
    // List all text field variable names for this page
    var QUESTION_NAMES = ["part_1_q1", "part_1_q2"];
    
    var keyPressCounter = 0;  // Counts total number of key presses
    var pasteCounter = 0;     // Counts number of paste operations
    var copyCounter = 0;      // Counts number of copy operations

    var questionElement = this.getQuestionContainer();
    var keystroke_order = [];

    // Store metadata about which text fields are being tracked
    Qualtrics.SurveyEngine.setEmbeddedData(
        'kt_qnames_' + PAGE_ID, 
        JSON.stringify(QUESTION_NAMES)
    );

    // Prevent users from accessing browser's right-click menu
    questionElement.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    });

    // Prevent users from selecting text with mouse/keyboard
    questionElement.style.userSelect = "none";
    questionElement.style.webkitUserSelect = "none";
    questionElement.style.msUserSelect = "none";

    // ========== Event Listener Functions ==========
    
    window._trackKeyPress = function (e) {
        keyPressCounter++;
        keystroke_order.push(e.key);
        
        Qualtrics.SurveyEngine.setEmbeddedData('kt_keypresses_' + PAGE_ID, keyPressCounter);
        Qualtrics.SurveyEngine.setEmbeddedData('kt_order_' + PAGE_ID, JSON.stringify(keystroke_order));
        console.log(keystroke_order);
    };

    window._trackPaste = function (e) {
        pasteCounter++;
        keystroke_order.push("paste");
        
        Qualtrics.SurveyEngine.setEmbeddedData('kt_pastes_' + PAGE_ID, pasteCounter);
        Qualtrics.SurveyEngine.setEmbeddedData('kt_order_' + PAGE_ID, JSON.stringify(keystroke_order));
    };

    window._trackCopy = function (e) {
        copyCounter++;
        keystroke_order.push("copy");
        
        Qualtrics.SurveyEngine.setEmbeddedData('kt_copies_' + PAGE_ID, copyCounter);
        Qualtrics.SurveyEngine.setEmbeddedData('kt_order_' + PAGE_ID, JSON.stringify(keystroke_order));
    };

    // ========== Clean Up Any Existing Listeners ==========
    document.removeEventListener("keyup", window._trackKeyPress);
    document.removeEventListener("copy", window._trackCopy);
    document.querySelectorAll("input[type='text'], textarea").forEach(input => {
        input.removeEventListener("paste", window._trackPaste);
    });

    // ========== Attach Fresh Event Listeners ==========
    document.addEventListener("keyup", window._trackKeyPress);
    document.addEventListener("copy", window._trackCopy);
    document.querySelectorAll("input[type='text'], textarea").forEach(input => {
        input.addEventListener("paste", window._trackPaste);
    });

    // ========== Cleanup When Moving to Next Question ==========
    document.querySelector("#NextButton").onclick = function () {
        document.removeEventListener("keyup", window._trackKeyPress);
        document.removeEventListener("copy", window._trackCopy);
        document.querySelectorAll("input[type='text'], textarea").forEach(input => {
            input.removeEventListener("paste", window._trackPaste);
        });
    };
});

// ========== Backup Cleanup Handler ==========
Qualtrics.SurveyEngine.addOnUnload(function () {
    document.removeEventListener("keyup", window._trackKeyPress);
    document.removeEventListener("copy", window._trackCopy);
    document.querySelectorAll("input[type='text'], textarea").forEach(input => {
        input.removeEventListener("paste", window._trackPaste);
    });
});
