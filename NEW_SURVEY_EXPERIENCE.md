# AI Detection for Online Studies — For Qualtrics "New Survey Taking Experience"

> ⚠️ This guide is for users who have enabled the **New Qualtrics Survey Taking Experience**. Looking for the standard setup? See the [main setup guide](README.md) instead.

**Developed by:** Michael Asher, Eason Chen, and Gillian Gold

---

This repository contains a keystroke tracking system for Qualtrics surveys. This tool can provide empirical evidence of outsourced responding (namely, AI use) by tracking participants' keystrokes and paste events. By examining paste events and comparing the final character length of a response to the number of keys actually pressed, researchers can objectively identify participants who pasted externally generated text (e.g., from ChatGPT).

In a three-study evaluation of this tool on Prolific (N = 928), the tool conclusively showed that 10% of our participants were outsourcing their open-ended responses to tools like ChatGPT. Read the article, published in AMPPS, [here](https://doi.org/10.1177/25152459261424723).

## Citation

If you use this tool, please cite:
```
Asher, M. W., Gold, G., Chen, E., & Carvalho, P. F. (2026). Chatbots Are Undermining
Crowdsourced Research in the Behavioral Sciences: Detecting Artificial Intelligence–Assisted
Cheating With a Keystroke-Based Tool. Advances in Methods and Practices in Psychological
Science, 9(1), 25152459261424723. https://doi.org/10.1177/25152459261424723
```

## How It Works
1.  **A Tracking Function (Header):** A script placed in the survey header that prepares Qualtrics to record keystroke data.
2.  **A Question Listener (JS Snippet):** A short command added to individual text questions to enable tracking for that specific input box.
3.  **JSON Logging:** Keystrokes, keystroke counts, paste events, and final text are automatically bundled into a single embedded data JSON field called `keystroke_log`.
4.  **R Analysis:** A script parses the JSON and identifies responses that were likely AI-generated.

---

## Setup Instructions

### 1. Survey Flow
Before adding any code, go to your **Survey Flow** and add an **Embedded Data** element at the top.

* Add a field named `__js_keystroke_log`
* Leave the value blank

> ⚠️ The `__js_` prefix is required by the new Qualtrics experience to allow JavaScript to write to embedded data fields.

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
    if (input._tracked) return;
    input._tracked = true;

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

    Qualtrics.SurveyEngine.addOnPageSubmit(function onSubmit() {
        let questionRecord = {
            qid: qid,
            keypresses: qData.keypresses,
            pastes: qData.pastes,
            copies: qData.copies,
            keystroke_order: qData.keystroke_order,
            text: input.value
        };

        let raw = Qualtrics.SurveyEngine.getJSEmbeddedData('keystroke_log');
        let master = { data: [] };
        try { 
            if (raw && raw.trim() !== "" && raw !== "undefined") {
                master = JSON.parse(raw);
            }
        } catch(e) { 
            master = { data: [] }; 
        }

        master.data.push(questionRecord);
        
        Qualtrics.SurveyEngine.setJSEmbeddedData('keystroke_log', JSON.stringify(master));
    });
};
</script>
```

<img width="900" height="616" alt="image" src="https://github.com/user-attachments/assets/7a67b21d-1c6a-4813-a2f3-202330a1e72e" />

### 3. Question Logic

For every question you wish to track, click the JavaScript icon on the question and add this to the `addOnReady` section:

```javascript
Qualtrics.SurveyEngine.addOnReady(function() {
    if (window.trackQuestion) window.trackQuestion(this);
});
```

<img width="1054" height="626" alt="image" src="https://github.com/user-attachments/assets/8b29a7a5-26b2-403a-a1b9-0623b1e04498" />

### 3b. Publish Your Survey

You have now added all of the necessary code to track keystrokes for your study, but it will not be added to the live version of your survey unless you click **Publish** on Qualtrics. Don't forget this step!

### 4. Data Analysis: Flagging Suspicious Responses

After exporting your data from Qualtrics as a CSV (with Numeric Values), use the R script [`flagging_cheaters.R`](https://github.com/the-oak-lab/keystroke-tracker/blob/main/flagging_cheaters.R) in this repository to flag participants who may have outsourced their responses.

If you prefer not to write code, you can use this interactive web application to screen for cheaters in your data: https://the-oak-lab.github.io/keystroke-viz/
