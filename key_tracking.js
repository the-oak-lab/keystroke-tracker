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
/******************************************************************/

// Execute when the Qualtrics survey question loads
Qualtrics.SurveyEngine.addOnload(function () {
    let keyPressCounter = 0;  // Counts total number of key presses
    let pasteCounter = 0;     // Counts number of paste operations
    let copyCounter = 0;      // Counts number of copy operations

    // Store this question's container element for later use
    const questionElement = this.getQuestionContainer();
    
    // Array to store the sequence of all keystrokes and actions (paste/copy)
    let keystroke_order = [];

    // Prevent users from accessing browser's right-click menu
    questionElement.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    });

    // Prevent users from selecting text with mouse/keyboard
    questionElement.style.userSelect = "none";
    questionElement.style.webkitUserSelect = "none";
    questionElement.style.msUserSelect = "none";

    // ========== Event Listener Functions ==========
    // Store listeners as global window properties to enable proper cleanup
    
    // Function to count and store keystrokes
    window._trackKeyPress = function (e) {
        keyPressCounter++; // Increment key press count
        keystroke_order.push(e.key); // Record which key was pressed
        
        // Store count in Qualtrics embedded data
        Qualtrics.SurveyEngine.setEmbeddedData("key_press_counter_question1", keyPressCounter);
        
        // Store complete keystroke sequence as JSON string in embedded data
        Qualtrics.SurveyEngine.setEmbeddedData("keystroke_order_question1", JSON.stringify(keystroke_order));
        console.log(keystroke_order);  // Debug: log current keystroke sequence
    };

    // Function to count paste events
    window._trackPaste = function (e) {
        pasteCounter++;  // Increment paste count
        keystroke_order.push("paste");  // Add "paste" marker to sequence
        
        // Store paste count in Qualtrics embedded data
        Qualtrics.SurveyEngine.setEmbeddedData("paste_counter_question1", pasteCounter);
        // Update keystroke sequence with paste event
        Qualtrics.SurveyEngine.setEmbeddedData("keystroke_order_question1", JSON.stringify(keystroke_order));
    };

    // Function to count copy events
    window._trackCopy = function (e) {
        copyCounter++;  // Increment copy count
        keystroke_order.push("copy");  // Add "copy" marker to sequence
        
        // Store copy count in Qualtrics embedded data
        Qualtrics.SurveyEngine.setEmbeddedData("copy_counter_question1", copyCounter);
        // Update keystroke sequence with copy event
        Qualtrics.SurveyEngine.setEmbeddedData("keystroke_order_question1", JSON.stringify(keystroke_order));
    };

    // ========== Clean Up Any Existing Listeners ==========
    // Remove listeners from previous questions to prevent duplicate tracking
    // This is important if a version of this script is being run on multiple pages of a Qualtrics survey
    document.removeEventListener("keyup", window._trackKeyPress);
    document.removeEventListener("copy", window._trackCopy);
    document.querySelectorAll("input[type='text'], textarea").forEach(input => {
        input.removeEventListener("paste", window._trackPaste);
    });

    // ========== Attach Fresh Event Listeners ==========
    
    // Listen for all keyboard activity throughout the page
    document.addEventListener("keyup", window._trackKeyPress);
    
    // Track copy operations on the entire document
    document.addEventListener("copy", window._trackCopy);
    
    // Track paste operations specifically on text input fields and textareas
    document.querySelectorAll("input[type='text'], textarea").forEach(input => {
        input.addEventListener("paste", window._trackPaste);
    });

    // ========== Cleanup When Moving to Next Question ==========
    // Remove all event listeners when user clicks the Next button
    // This prevents tracking from continuing on subsequent pages
    document.querySelector("#NextButton").onclick = function () {
        document.removeEventListener("keyup", window._trackKeyPress);
        document.removeEventListener("copy", window._trackCopy);
        document.querySelectorAll("input[type='text'], textarea").forEach(input => {
            input.removeEventListener("paste", window._trackPaste);
        });
    };
});

// ========== Backup Cleanup Handler ==========
// Execute when the question is unloaded (page navigation, browser back button, etc.)
// Provides a safety net in case the Next button cleanup doesn't fire
Qualtrics.SurveyEngine.addOnUnload(function () {
    // Backup cleanup in case Next button removal doesn't fire
    document.removeEventListener("keyup", window._trackKeyPress);
    document.removeEventListener("copy", window._trackCopy);
    document.querySelectorAll("input[type='text'], textarea").forEach(input => {
        input.removeEventListener("paste", window._trackPaste);
    });
});
