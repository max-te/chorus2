// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("CommandApp.Local", function(Api, App, Backbone, Marionette, $, _) {


  //# Base commander with shared functionality.
  Api.Commander = class Commander extends Api.Base {};
    //# See Api.Base for soundmanager abstraction

  //# Player commander.
  return Api.Player = class Player extends Api.Commander {

    playEntity(type, position, callback) {
      if (type == null) { type = 'position'; }
      const collection = App.request("localplayer:get:entities");
      const model = collection.findWhere({position});
      return this.localLoad(model, () => {
        this.localPlay();
        //# Start playback of playlist position x
        return this.doCallback(callback, position);
      });
    }

    //# Mimics Kodi Player Commands.
    sendCommand(command, param) {
      switch (command) {
        case 'GoTo':
          this.localGoTo(param);
          break;
        case 'PlayPause':
          this.localPlayPause();
          break;
        case 'Seek':
          this.localSeek(param);
          break;
        case 'SetRepeat':
          //# param can be 'cycle', 'off', 'all' or 'one'
          this.localRepeat(param);
          break;
        case 'SetShuffle':
          //# Toggles shuffle
          this.localShuffle();
          break;
        case 'Stop':
          this.localStop();
          break;
        default:
      }
          //# nothing
      return this.localStateUpdate();
    }

    //# Start, stop, toggle local party mode
    setPartyMode(op, callback) {
      if (op == null) { op = 'toggle'; }
      return App.execute('playlist:local:partymode', op, resp => {
        return this.doCallback(callback, resp);
      });
    }
  };
});
