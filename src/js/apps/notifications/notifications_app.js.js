/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("NotificationsApp", function(NotificationApp, App, Backbone, Marionette, $, _) {

  const API =

    {notificationMinTimeOut: 5000};

  return App.commands.setHandler("notification:show", function(msg, severity) {
    //# Average 100 characters takes 10 sec to read
    if (severity == null) { severity = 'normal'; }
    const timeout = msg.length < 50 ? API.notificationMinTimeOut : (msg.length * 100);
    //# Trigger a ui notification.
    return $.snackbar({
      content: msg,
      style: 'type-' + severity,
      timeout
    });
  });
});
