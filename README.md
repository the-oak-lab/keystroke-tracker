# AI Detection for Online Studies

**Code to Track Keystrokes on Short Response Questions in Qualtrics**  
**File:** `key_tracking.js`  
**Developed by:** Michael Asher, Eason Chen, and Gillian Gold

---

## How to Use

### 1. Add the Script to the Question
- Go to the **JavaScript editor** in the **"Question behavior"** of a specific question in Qualtrics.
- Paste the entire contents of `key_tracking.js` into the JavaScript section of that question.

### 2. Tracking Details

The script captures the following behaviors:
- `key_press_counter_question1`: Number of key presses
- `paste_counter_question1`: Number of paste events
- `copy_counter_question1`: Number of copy events
- `keystroke_order_question1`: Ordered list of all keystrokes and paste/copy actions

These values are stored as **Embedded Data** and can be accessed later in the **Survey Flow** or downloaded for analysis.

### 3. Interaction Control

- Right-clicking and text selection are disabled to reduce the risk of copying and pasting from external sources.

### 4. Automatic Cleanup

- Event listeners are automatically removed when the respondent clicks the **Next** button or navigates away from the page. This prevents data duplication and avoids interference with other survey elements.

> **Note:** If using this script on multiple questions, update the embedded data variable names (e.g., change `question1` to a unique identifier) to avoid overwriting data.
