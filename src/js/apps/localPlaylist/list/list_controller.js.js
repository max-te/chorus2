@Kodi.module "localPlaylistApp.List", (List, App, Backbone, Marionette, $, _) ->

  class List.Controller extends App.Controllers.Base

    initialize: (options) ->
      id = options.id
      playlists = App.request "localplaylist:entities"
      @layout = @getLayoutView playlists

      @listenTo @layout, "show", =>
        @getListsView(playlists)
        @getItems(id)

      App.regionContent.show @layout

    ## Get the layout
    getLayoutView: (collection) ->
      new List.ListLayout
        collection: collection

    ## Get the sidebar list
    getListsView: (playlists) ->
      @sideLayout = new List.SideLayout()
      view = new List.Lists
        collection: playlists
      App.listenTo @sideLayout, "show", =>
        if playlists.length > 0
          @sideLayout.regionLists.show view
      App.listenTo @sideLayout, 'lists:new', ->
        App.execute "localplaylist:newlist"
      @layout.regionSidebarFirst.show @sideLayout

    ## Get items then render
    getItems: (id) ->
      playlist = App.request "localplaylist:entity", id
      collection = App.request "localplaylist:item:entities", id
      @itemLayout = new List.Layout
        list: playlist
      App.listenTo @itemLayout, "show", =>
        if collection.length > 0
          media = playlist.get('media')
          view = App.request "#{media}:list:view", collection, true
          @itemLayout.regionListItems.show view
          @bindRemove id, view
          @initSortable id, view
      @bindLayout id
      @layout.regionContent.show @itemLayout

    ## Binds to layout
    bindLayout: (id) ->
      collection = App.request "localplaylist:item:entities", id
      App.listenTo @itemLayout, 'list:clear', ->
        App.execute "localplaylist:clear:entities", id
        App.execute "localplaylist:reload", id
      App.listenTo @itemLayout, 'list:delete', ->
        App.execute "localplaylist:clear:entities", id
        App.execute "localplaylist:remove:entity", id
        App.navigate "playlists", {trigger: true}
      App.listenTo @itemLayout, 'list:rename', ->
        App.execute "localplaylist:rename", id
      App.listenTo @itemLayout, 'list:play', ->
        kodiPlaylist = App.request "command:kodi:controller", 'audio', 'PlayList'
        kodiPlaylist.playCollection(collection)
      App.listenTo @itemLayout, 'list:localplay', ->
        localPlaylist = App.request "command:local:controller", 'audio', 'PlayList'
        localPlaylist.playCollection(collection)
      App.listenTo @itemLayout, 'list:export', ->
        App.execute "playlist:export", collection

    ## Binds to items
    bindRemove: (id, view) ->
      App.listenTo view, 'childview:song:remove', (parent, viewItem) =>
        # Update the order, exclude removed item
        @updateOrder id, view.$el, [parent.$el.data('id')]

    ## Bind sortable
    initSortable: (id, view) ->
      self = @
      $('tbody', view.$el).sortable({
        onEnd: (e) =>
          self.updateOrder id, @el
      });

    ## Rebuild the order of items after sort or item removal, excluded items
    ## will get removed from the collection
    updateOrder: (playlistId, $ctx, exclude = []) ->
      order = []
      pos = 0
      $('tr', $ctx).each (i, d) ->
        id = $(d).data('id')
        if helpers.global.inArray(id, exclude)
          $(d).remove()
        else
          order.push id
          $(d).data('id', pos)
          pos++
      App.request "localplaylist:item:updateorder", playlistId, order
