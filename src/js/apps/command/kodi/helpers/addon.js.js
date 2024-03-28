/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("CommandApp.Kodi", (Api, App, Backbone, Marionette, $, _) => //# Application commander.
(function() {
  const Cls = (Api.AddOn = class AddOn extends Api.Commander {
    constructor(...args) {
      this.getEnabledAddons = this.getEnabledAddons.bind(this);
      this.getAllAddons = this.getAllAddons.bind(this);
      super(...args);
    }

    static initClass() {

      this.prototype.commandNameSpace = 'Addons';

      this.prototype.addonAllFields = [
        "name",
        "version",
        "summary",
        "description",
        "path",
        "author",
        "thumbnail",
        "disclaimer",
        "fanart",
        "dependencies",
        "broken",
        "extrainfo",
        "rating",
        "enabled"
      ];
    }

    // Get an array of addons from the api
    getAddons(type, enabled, fields, callback) {
      if (type == null) { type = "unknown"; }
      if (enabled == null) { enabled = true; }
      if (fields == null) { fields = []; }
      return this.singleCommand(this.getCommand('GetAddons'), [type, "unknown", enabled, fields], resp => {
        return this.doCallback(callback, resp.addons);
      });
    }

    // If load set then get all the addon fields else get basics
    getEnabledAddons(load, callback) {
      if (load == null) { load = true; }
      const fields = load ? this.addonAllFields : ["name"];
      return this.getAddons("unknown", true, fields, resp => {
        return this.doCallback(callback, resp);
      });
    }

    // If load set then get all the addon fields else get basics
    getAllAddons(callback) {
      return this.getAddons("unknown", "all", this.addonAllFields, resp => {
        return this.doCallback(callback, resp);
      });
    }

    // Execute an addon
    executeAddon(addonId, params, callback) {
      if (params == null) { params = {}; }
      const opts = {addonid: addonId};
      if (!_.isEmpty(params)) {
        opts.params = params;
      }
      return this.singleCommand(this.getCommand('ExecuteAddon'), opts, resp => {
        return this.doCallback(callback, resp.addons);
      });
    }
  });
  Cls.initClass();
  return Cls;
})());
