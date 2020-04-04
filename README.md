# google-drive-trash-cleanup

This script can be configured as a Google Apps Script (https://script.google.com/home) to automatically delete files in the trash section of Google Drive. Currently, trashed files are not automatically deleted, resulting in my Drive frequently running out of space.

Setup:

* Create a new project and add the DriveTrashCleanup.gs script at https://script.google.com/home
* In Resources > Advanced Google Services, enable "Drive API v2" and "Drive Activity API v2"
* Optionally, configure the number of days to retain files (default 30) and the email report address in the script
* You will need to run the script once for it to prompt for permission
* To run the cleanup manually, run the deleteOldFiles method
* To set up a time-based trigger, run the createTimeDrivenTriggers method once - it will create a trigger to invoke the deleteOldFiles method every 24 hours
