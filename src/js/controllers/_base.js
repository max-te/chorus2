@Kodi.module "Controllers", (Controllers, App, Backbone, Marionette, $, _) ->

  class Controllers.Base extends Backbone.Marionette.Controller

    params: {}

    constructor: (options = {}) ->
      super options
      @region = options.region or App.request "default:region"
      @params = helpers.url.params()
      @_instance_id = _.uniqueId("controller")
      App.execute "register:instance", @, @_instance_id

    close: (args...) ->
      delete @region
      delete @options
      super args
      App.execute "unregister:instance", @, @_instance_id

    show: (view) ->
      @listenTo view, "close", @close
      @region.show view
