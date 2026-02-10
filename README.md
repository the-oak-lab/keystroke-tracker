# AI Detection for Online Studies
**Developed by:** Michael Asher, Eason Chen, and Gillian Gold

---

This repository contains a keystroke tracking system for Qualtrics surveys. This tool can provide empirical evidence of outsourced resonding (namely, AI use) by tracking participants' keystrokes and paste events. By examining paste events and comparing the final character length of a response to the number of keys actually pressed, researchers can objectively identify participants who pasted externally generated text (e.g., from ChatGPT).

If you use this tool, please cite Asher et al., 2026 (article DOI: 10.1177/25152459261424723)

## How It Works
1.  **A Tracking Function (Header):** A script placed in the survey header that prepares Qualtrics to record keystroke data.
2.  **A Question Listener (JS Snippet):** A short command added to individual text questions to enable tracking for that specific input box.
3.  **JSON Logging:** Keystrokes, keystroke counts, paste events, and final text are automatically bundled into a single embedded data JSON field called `keystroke_log`.
4.  **R Analysis:** A script parses the JSON and identifies responses that were likely AI-generated.

---

## Setup Instructions <a href="https://www.youtube.com/watch?v=AosGYlN1b1Q" target="_blank">(Youtube Tutorial Here)</a>

### 1. Survey Flow
Before adding any code, go to your **Survey Flow** and add an **Embedded Data** element at the very top.
* Add a field named `keystroke_log`.
* Leave the value blank.
* <img width="464" height="80" alt="image" src="https://github.com/user-attachments/assets/bec7c6db-498b-497c-9eb3-33eafe3ccc74" />


### 2. The Header Script
Go to **Look & Feel > General > Header > Edit > Source**. 

Paste the following code:

```html
<script>
window.trackQuestion = function(context) {
    const qid = context.questionId;
    const container = context.getQuestionContainer();
    const input = container.querySelector('textarea, input[type="text"]');
    if (!input) return;

    let qData = { 
        keypresses: 0, 
        pastes: 0, 
        copies: 0, 
        keystroke_order: [] 
    };

    input.addEventListener('keyup', (e) => { 
        qData.keypresses++; 
        qData.keystroke_order.push(e.key); 
    });
    input.addEventListener('paste', () => { 
        qData.pastes++; 
        qData.keystroke_order.push("paste"); 
    });
    input.addEventListener('copy', () => { 
        qData.copies++; 
        qData.keystroke_order.push("copy"); 
    });

    Qualtrics.SurveyEngine.addOnPageSubmit(function() {
        let questionRecord = {
            qid: qid,
            keypresses: qData.keypresses,
            pastes: qData.pastes,
            copies: qData.copies,
            keystroke_order: qData.keystroke_order,
            text: input.value
        };

        let raw = Qualtrics.SurveyEngine.getEmbeddedData('keystroke_log');
        let master = { data: [] };
        try { 
            if (raw && raw.trim() !== "") {
                master = JSON.parse(raw);
            }
        } catch(e) { 
            master = { data: [] }; 
        }

        master.data.push(questionRecord);
        
        Qualtrics.SurveyEngine.setEmbeddedData('keystroke_log', JSON.stringify(master));
    });
};
</script>
```
<img width="900" height="616" alt="image" src="https://github.com/user-attachments/assets/7a67b21d-1c6a-4813-a2f3-202330a1e72e" />

### 3. Question Logic

For every question you wish to track, click the JavaScript icon on the question and add this to the addOnReady section:

```JavaScript
Qualtrics.SurveyEngine.addOnReady(function() {
    if (window.trackQuestion) window.trackQuestion(this);
});
```
<img width="1054" height="626" alt="image" src="https://github.com/user-attachments/assets/8b29a7a5-26b2-403a-a1b9-0623b1e04498" />

### 3b. Publish Your Survey

You have now added all of the necessary code to track keystrokes for your study, but it will not be added to the live version of your survey unless you click "Publish" on Qualtrics. Don't forget this step!

### 4. Data Analysis: Flagging Suspicious Responses

After exporting your data from qualtrics as a CSV (with Numeric Values), use the R script [`flagging_cheaters.R`](https://github.com/the-oak-lab/keystroke-tracker/blob/main/flagging_cheaters.R) in this repository to flag participants who may have outsourced their responses.
