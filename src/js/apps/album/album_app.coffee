@Kodi.module "AlbumApp", (AlbumApp, App, Backbone, Marionette, $, _) ->

  class AlbumApp.Router extends App.Router.Base
    appRoutes:
      "music/albums"      : "list"
      "music/album/:id"   : "view"

  API =

    list: ->
      new AlbumApp.List.Controller()

    view: (id) ->
      new AlbumApp.Show.Controller
        id: id

    action: (op, view) ->
      model = view.model
      playlist = App.request "command:kodi:controller", 'audio', 'PlayList'
      switch op
        when 'play'
          App.execute "command:audio:play", 'albumid', model.get('albumid')
        when 'add'
          playlist.add 'albumid', model.get('albumid')
        when 'localadd'
          App.execute "localplaylist:addentity", 'albumid', model.get('albumid')
        when 'localplay'
          localPlaylist = App.request "command:local:controller", 'audio', 'PlayList'
          localPlaylist.play 'albumid', model.get('albumid')
        else
        ## nothing


  App.on "before:start", ->
    new AlbumApp.Router
      controller: API

  App.commands.setHandler 'album:action', (op, model) ->
    API.action op, model

  App.reqres.setHandler 'album:action:items', ->
    {
      actions: {thumbs: 'Thumbs up'}
      menu: {add: tr('Queue in Kodi'), 'divider-1': '', localadd: tr('Add to playlist'), localplay: tr('Play in browser'), 'divider-2': '', edit: tr('Edit')}
    }

  App.commands.setHandler 'album:edit', (model) ->
    loadedModel = App.request "album:entity", model.get('id')
    App.execute "when:entity:fetched", loadedModel, =>
      new AlbumApp.Edit.Controller
        model: loadedModel
