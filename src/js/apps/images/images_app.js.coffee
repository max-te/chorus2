@Kodi.module "Images", (Images, App, Backbone, Marionette, $, _) ->

  API =

    imagesPath: 'dist/images/'

    defaultFanartPath: 'fanart_default/'

    defaultFanartFiles: [
      'wallpaper-443657.jpg'
      'wallpaper-45040.jpg'
      'wallpaper-765190.jpg'
      'wallpaper-84050.jpg'
    ]

    getDefaultThumbnail: ->
      API.imagesPath + 'thumbnail_default.png'

    getRandomFanart: ->
      rand = helpers.global.getRandomInt(0, API.defaultFanartFiles.length - 1)
      file = API.defaultFanartFiles[rand]
      path = API.imagesPath + API.defaultFanartPath + file
      path

    parseRawPath: (rawPath) ->
      path = 'image/' + encodeURIComponent(rawPath)
      path

    ## set background fanart, stting to 'none' removes fanart
    setFanartBackground: (path, region) ->
      $body = App.getRegion(region).$el
      if path isnt 'none'
        if not path
          path = @getRandomFanart()
        $body.css('background-image', 'url(' +  path + ')')
      else
        $body.removeAttr('style')

    getImageUrl: (rawPath, type = 'thumbnail') ->
      path = ''
      if not rawPath? or rawPath is ''
        switch type
          when 'fanart' then path = API.getRandomFanart()
          else path = API.getDefaultThumbnail()
      else
        path = API.parseRawPath(rawPath)
      path

  ## Handler to set the background fanart pic.
  App.commands.setHandler "images:fanart:set", (path, region = 'regionFanart') ->
    API.setFanartBackground path, region

  ## Handler to return a parsed image path.
  App.reqres.setHandler "images:path:get", (rawPath = '', type = 'thumbnail') ->
    API.getImageUrl(rawPath, type)

  ## Handler to apply correct paths to a model, expects to be called
  ## on the model attributes, typically during a model.parse()
  App.reqres.setHandler "images:path:entity", (model) ->
    if model.thumbnail?
      model.thumbnail = API.getImageUrl(model.thumbnail, 'thumbnail')
    if model.fanart?
      model.fanart = API.getImageUrl(model.fanart, 'fanart')
    model