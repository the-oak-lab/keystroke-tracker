# AI Detection for Online Studies

**Code to Track Keystrokes on Short Response Questions in Qualtrics**  
**File:** `key_tracking.js`  
**Developed by:** Michael Asher, Eason Chen, and Gillian Gold

---

This code will track keystrokes and copy/paste behavior on a page in Qualtrics, across all questions on that page.

## How to Use if You are Only Tracking One Page

### 1. Add the Script to a Question on a Page That You Want to Track, and Update Variable Names
- Go to the **JavaScript editor** in the **"Question behavior"** of one question on the page in Qualtrics.
- Paste the entire contents of `key_tracking.js` into the JavaScript section of that question.
- Update the `QUESTION_NAMES` array in the JavaScript code to match the names of the Qualtrics questions you are tracking (highlighted with red boxes below):
- <img width="629" alt="image" src="https://github.com/user-attachments/assets/f407167e-dc8c-4149-bfc8-5c0823628d81" />  
- This is what the code should look like to match the example:
- <img width="629" height="213" alt="image" src="https://github.com/user-attachments/assets/baab6f38-d060-4bcd-a73e-a16c37f2f3fb" />

### 2. Add Embedded Data Fields to Your Survey Flow to Hold Tracked Data
- Here is what they should look like (in this example the `PAGE_ID` is "page1", the default):  <img width="1099" height="310" alt="image" src="https://github.com/user-attachments/assets/ba81f214-be3d-49e5-ba2d-c1dc8335fc04" />

**You Can Copy and Paste These Embedded Data Fields into the Survey Flow**  
kt_qnames_page1  
kt_keypresses_page1  
kt_pastes_page1  
kt_copies_page1  
kt_order_page1  


# How to Use if You are Tracking More Than One Page

### 2. Repeat Step 1 for Any Other Pages That You Want to Track, Updating Variable Names
- For additional pages, update the `PAGE_ID` in the javascript file (e.g., "page2", "page3", etc.) so it does not conflict with the first page.
- It remains **mandatory** to update the `QUESTION_NAMES` array to match the names of the text entry questons on the relevant page.

### 3. Add Embedded Data Fields
- For each page that you track, add five embedded data fields to your survey flow. The end of each name must match the the `PAGE_ID` that you assigned in javascript (which is "page1" by default)
- Use these names:
    - kt_qnames_[PAGE_ID]: This stores the names of the questions on the relevant page.
    - kt_keypresses_[PAGE_ID]: The number of key presses on the page.
    - kt_pastes_[PAGE_ID]: Number of paste events
    - kt_copies_[PAGE_ID]: Number of copy events
    - kt_order_[PAGE_ID]: Ordered list of all keystrokes and paste/copy actions
- Here is what theis should look like (in this example the `PAGE_ID` is "page1", the default):  <img width="1099" height="310" alt="image" src="https://github.com/user-attachments/assets/ba81f214-be3d-49e5-ba2d-c1dc8335fc04" />
- We recommend duplicating the five fields and updating the page identifier if you are tracking multiple pages. 

**You Can Copy and Paste These Embedded Data Fields into the Survey Flow**  
kt_qnames_page1  
kt_keypresses_page1  
kt_pastes_page1  
kt_copies_page1  
kt_order_page1  

## Additonal Features

### 1. Interaction Control

- By default right-clicking and text selection are disabled to reduce the risk of copying and pasting from external sources.

### 2. Automatic Cleanup

- Event listeners are automatically removed when the respondent clicks the **Next** button or navigates away from the page. This prevents data duplication and avoids interference with other survey elements.
