/*******************************************************************
* File Name         : key_tracking.js
* Description       : This file contains JavaScript code to track key usage
*                     on short response questions on Qualtrics.
*                    
* Revision History  :
* Date				Author    		Comments
* ---------------------------------------------------------------------------
* XX/XX/2025		Michael Asher	Created.
* 04/01/2025		Eason Chen	    Edited code.
/******************************************************************/

Qualtrics.SurveyEngine.addOnload(function () {
    let keyPressCounter = 0;
    let pasteCounter = 0;
    let copyCounter = 0;

    const questionElement = this.getQuestionContainer();
    let keystroke_order = [];

    // Disable right-click
    questionElement.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    });

    // Disable text selection
    questionElement.style.userSelect = "none";
    questionElement.style.webkitUserSelect = "none";
    questionElement.style.msUserSelect = "none";

    // --- Define and store listener references globally ---
    window._trackKeyPress = function (e) {
        keyPressCounter++;
        keystroke_order.push(e.key);
        Qualtrics.SurveyEngine.setEmbeddedData("key_press_counter_question1", keyPressCounter);
        Qualtrics.SurveyEngine.setEmbeddedData("keystroke_order_question1", JSON.stringify(keystroke_order));
        console.log(keystroke_order);
    };

    window._trackPaste = function (e) {
        pasteCounter++;
        keystroke_order.push("paste");
        Qualtrics.SurveyEngine.setEmbeddedData("paste_counter_question1", pasteCounter);
        Qualtrics.SurveyEngine.setEmbeddedData("keystroke_order_question1", JSON.stringify(keystroke_order));
    };

    window._trackCopy = function (e) {
        copyCounter++;
        keystroke_order.push("copy");
        Qualtrics.SurveyEngine.setEmbeddedData("copy_counter_question1", copyCounter);
        Qualtrics.SurveyEngine.setEmbeddedData("keystroke_order_question1", JSON.stringify(keystroke_order));
    };

    // --- Remove any lingering listeners from previous pages ---
    document.removeEventListener("keyup", window._trackKeyPress);
    document.removeEventListener("copy", window._trackCopy);
    document.querySelectorAll("input[type='text'], textarea").forEach(input => {
        input.removeEventListener("paste", window._trackPaste);
    });

    // --- Attach current listeners ---
    document.addEventListener("keyup", window._trackKeyPress);
    document.addEventListener("copy", window._trackCopy);
    document.querySelectorAll("input[type='text'], textarea").forEach(input => {
        input.addEventListener("paste", window._trackPaste);
    });

    // --- Cleanup on Next button ---
    document.querySelector("#NextButton").onclick = function () {
        document.removeEventListener("keyup", window._trackKeyPress);
        document.removeEventListener("copy", window._trackCopy);
        document.querySelectorAll("input[type='text'], textarea").forEach(input => {
            input.removeEventListener("paste", window._trackPaste);
        });
    };
});

Qualtrics.SurveyEngine.addOnUnload(function () {
    // Backup cleanup in case Next button removal doesn't fire
    document.removeEventListener("keyup", window._trackKeyPress);
    document.removeEventListener("copy", window._trackCopy);
    document.querySelectorAll("input[type='text'], textarea").forEach(input => {
        input.removeEventListener("paste", window._trackPaste);
    });
});
