# AI Detection for Online Studies
**Developed by:** Michael Asher, Eason Chen, and Gillian Gold

---

This repository contains a behavioral tracking system for Qualtrics surveys. This tool provides empirical evidence of outsourced resonding by tracking real-time keystrokes, paste events, and text-entry sequences.

By comparing the final character length of a response to the number of keys actually pressed, researchers can objectively identify participants who pasted externally generated text (e.g., from ChatGPT).

If you use this tool, please cite Asher et al., 2026 (article DOI: 10.1177/25152459261424723)

## How It Works
1.  **Header Engine:** A "stateless" JavaScript engine runs in the background of your survey.
2.  **Question Snippets:** Small listeners attached to specific questions report activity to the engine.
3.  **JSON Logging:** All behavior is bundled into a single hidden Qualtrics field called `keystroke_log`.
4.  **R Analysis:** A script parses the JSON, maps question IDs to your dataset, and flags suspicious responses.

---

## Setup Instructions

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

### 4. Data Analysis: Flagging Suspicious Responses

After exporting your data from qualtrics as a CSV (with Numeric Values), use the R script `flagging_cheaters.R` in this repository to flag participants who may have outsourced their responses.
