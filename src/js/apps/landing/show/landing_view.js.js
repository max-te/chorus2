@Kodi.module "LandingApp.Show", (Show, App, Backbone, Marionette, $, _) ->

  class Show.Layout extends App.Views.LayoutWithSidebarFirstView
    className: "landing-page"

  class Show.Page extends App.Views.LayoutView
    template: "apps/landing/show/landing_page"
    className: "landing-content"
    regions:
      regionHero: '#landing-hero'
      regionSection1: '#landing-section-1'
      regionSection2: '#landing-section-2'
      regionSection3: '#landing-section-3'
      regionSection4: '#landing-section-4'
      regionSection5: '#landing-section-5'
      regionSection6: '#landing-section-6'

    class Show.ListSet extends App.Views.SetLayoutView
      className: 'landing-set'
      triggers:
        'click .more'     : 'landing:set:more'
      initialize: () ->
        @setOptions()
        @createModel()
      setOptions: () ->
        @options.menu = {}
        if @options.filter isnt false and @options.section.title
          @options.title = t.sprintf(tr(@options.section.title), @options.filter)
        else if @options.section.title
          @options.title = tr(@options.section.title)
        if @options.section.moreLink
          @options.menu.more = tr 'More like this'
        if @options.section.preventSelect
          @options.noMenuDefault = true
