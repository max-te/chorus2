@Kodi.module "Views", (Views, App, Backbone, Marionette, $, _) ->

  class Views.LayoutWithSidebarFirstView extends App.Views.LayoutView
    template: "views/layouts/layout_with_sidebar_first"
    regions:
      regionSidebarFirst:  ".region-first-primary"
      regionContent:  ".region-content"
    events:
      "click .region-first-toggle": "toggleRegionFirst"
    toggleRegionFirst: ->
      @$el.toggleClass('region-first-open');
    # Allow dynamically adding multiple sidebar views to a region
    appendSidebarView: (viewId, appendView) ->
      $('.region-first-secondary', @$el).append '<div id="' + viewId + '">'
      @regionManager.addRegion viewId, '#' + viewId
      this[viewId].show appendView

  class Views.LayoutWithHeaderView extends App.Views.LayoutView
    template: "views/layouts/layout_with_header"
    regions:
      regionHeader:  ".region-header"
      regionContentTop:  ".region-content-top"
      regionContent:  ".region-content"

  class Views.LayoutDetailsHeaderView extends App.Views.LayoutView
    template: "views/layouts/layout_details_header"
    regions:
      regionSide:  ".region-details-side"
      regionTitle:  ".region-details-title"
      regionMeta: ".region-details-meta" ## Using this region removes the below regions.
      regionMetaSideFirst:  ".region-details-meta-side-first"
      regionMetaSideSecond:  ".region-details-meta-side-second"
      regionMetaBelow:  ".region-details-meta-below"
      regionFanart:  ".region-details-fanart"
    onRender: ->
      ## Get swatches
      helpers.ui.getSwatch @model.get('thumbnail'), (swatches) ->
        helpers.ui.applyHeaderSwatch(swatches)
    initialize: ->
      if not @model.get('progress')
        @model.set({progress: 0})
