/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("CommandApp.Kodi", (Api, App, Backbone, Marionette, $, _) => //# PVR
(function() {
  const Cls = (Api.PVR = class PVR extends Api.Commander {
    static initClass() {

      this.prototype.commandNameSpace = 'PVR';
    }

    //# Start recording a channel
    setRecord(id, fields, callback) {
      if (fields == null) { fields = {}; }
      let params = {channel: id, record: 'toggle'};
      params = _.extend(params, fields);
      return this.singleCommand(this.getCommand('Record'), params, resp => {
        return this.doCallback(callback, resp);
      });
    }

    //# Toggle timer on a broadcast
    toggleTimer(id, timerRule, callback) {
      if (timerRule == null) { timerRule = false; }
      const params = {broadcastid: id, timerrule: timerRule};
      return this.singleCommand(this.getCommand('ToggleTimer'), params, resp => {
        return this.doCallback(callback, resp);
      });
    }

    //# Add timer on a broadcast
    addTimer(id, timerRule, callback) {
      if (timerRule == null) { timerRule = false; }
      const params = {broadcastid: id, timerrule: timerRule};
      return this.singleCommand(this.getCommand('AddTimer'), params, resp => {
        return this.doCallback(callback, resp);
      });
    }

    //# Remove a timer id
    deleteTimer(id, callback) {
      const params = {timerid: id};
      return this.singleCommand(this.getCommand('DeleteTimer'), params, resp => {
        return this.doCallback(callback, resp);
      });
    }
  });
  Cls.initClass();
  return Cls;
})());
