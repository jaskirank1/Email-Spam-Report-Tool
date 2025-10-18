# Email Spam Report Tool

## What It Does
This project is an Email Spam Report Tool that allows users to check whether specific emails are spam or not. The tool performs automated tests on emails and provides detailed results in a clear, easy-to-read format.

## How It Works
1. **Input Emails:** Users can input a set of test emails.
2. **Run Tests:** The tool runs tests on the provided emails using predefined checks.
3. **Display Results:** Results are displayed in a structured format, indicating whether the email is likely spam or not.
4. **Export Reports:** Test results can be exported locally in HTML format for offline use.

## Current Features
- Works perfectly for 3 test emails.
- Local HTML report generation.
- Interactive UI for testing emails.

## What’s Missing / Could Be Improved
- Currently, only 3 test emails work reliably; the remaining two are still in progress.
- No database integration:  
  - Could add a database to store email history and compare past test results.
  - Could store reports in the cloud (e.g., AWS) instead of locally.
- PDF Export: Currently reports are saved locally as HTML; future versions could include PDF export functionality.
- Enhanced Test Coverage: Extend testing for all email types for more robust results.
- History Tracking: Maintain a history of past tests for comparison.

## Future Enhancements
- Add database support to save past tests and reports.
- Integrate cloud storage for reports.
- Improve test algorithms for more accurate spam detection.
- Implement PDF export functionality.
- Expand email testing to cover all edge cases.

## How to Use
1. Clone the repository.
2. Run the frontend and backend servers.
3. Enter the email addresses to test in the UI.
4. View the results and export reports locally.

---

Feel free to contribute, report issues, or suggest new features!