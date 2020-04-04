/**
creates a trigger to run this script on a 24-hour interval
*/
function createTimeDrivenTriggers() {
  ScriptApp.newTrigger('deleteOldFiles').timeBased().everyHours(24).create();
}

/**
gets all trashed items (files and folders) and deletes any with no activity for the configured timeframe. if an email address is configured,
the log for each execution will be sent to that address.
*/
function deleteOldFiles() {
  
  // configuration
  var daysRetentionNumber = 30; // number of days a file or folder should stay in the trash
  var email = ''; // (optional) email address to send logs to
  //
  
  var retentionPeriod = daysRetentionNumber * 24 * 60 * 60 * 1000;

  Logger.clear();
  Logger.log('Removing trashed items with no activity for ' + daysRetentionNumber + ' days');

  folderIterator = DriveApp.getTrashedFolders();
  while (folderIterator.hasNext()) {
    processItem(folderIterator.next(), retentionPeriod);
  }
  
  fileIterator = DriveApp.getTrashedFiles();
  while (fileIterator.hasNext()) {
    processItem(fileIterator.next(), retentionPeriod);
  }
  
  sendReport(email);
}

// process an individual item (file or folder) and determine if its latest activity is old enough to be deleted permanently
function processItem(item, retentionPeriod) {
  if (!item.isTrashed()) {
    Logger.log('Item is not trashed! Item: ' + item.getName());
    return;
  }
  
  Logger.log('Processing item: ' + item.getName());
  var age = new Date() - new Date(getLastActivityTime(item));
  Logger.log('Age: ' + age);
  Logger.log('Retention: ' + retentionPeriod);
  if (age > retentionPeriod) {
    Logger.log('Item '+ item.getName() + ' will be deleted');
    Drive.Files.remove(item.getId()); // comment this line for a dry-run
  }
  Logger.log('');
}

// send the log for this execution to the specified email address
function sendReport(email) {
  if (email != null && email != '' && Logger.getLog() != '') {
     MailApp.sendEmail(email, 'Drive trash cleanup report', Logger.getLog());
  }
}

// get the timestamp of the latest "activity" for a given item
function getLastActivityTime(item) {
  Logger.log('Getting last activity for ' + item.getName());
  var request = {pageSize: 1, itemName: 'items/' + item.getId()};
  var response = DriveActivity.Activity.query(request);
  var activities = response.activities;
  if (activities && activities.length > 0) {
    var time = getTimeInfo(activities[0]);
    Logger.log('Last activity time: ' + time);
    return time;
  } else {
    Logger.log('No activity');
    return new Date();
  }
}

// get the timestamp for a given activity
function getTimeInfo(activity) {
  if ('timestamp' in activity) {
    return activity.timestamp;
  }
  if ('timeRange' in activity) {
    return activity.timeRange.endTime;
  }
  return new Date();
}
