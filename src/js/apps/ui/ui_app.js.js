// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("UiApp", function(UiApp, App, Backbone, Marionette, $, _) {

  //# TODO: Clean this up, it is a bit messy and needs some better abstraction.

  var API = {

    openModal(titleHtml, msgHtml, open, style) {
      //# Get the modal parts
      if (open == null) { open = true; }
      if (style == null) { style = ''; }
      const $title = App.getRegion('regionModalTitle').$el;
      const $body = App.getRegion('regionModalBody').$el;
      const $modal = App.getRegion('regionModal').$el;
      $modal.removeClassStartsWith('style-');
      $modal.addClass('style-' + style);
      //# Populate its content
      $title.html(titleHtml);
      $body.html(msgHtml);
      //# Open model
      if (open) {
        $modal.modal();
      }
      $modal.on('hidden.bs.modal', e => $body.html(''));
      return $modal;
    },

    closeModal() {
      App.getRegion('regionModal').$el.modal('hide');
      return $('.modal-body').html('');
    },

    closeModalButton(text) {
      if (text == null) { text = 'close'; }
      return API.getButton(t.gettext(text), 'default').on('click', () => API.closeModal());
    },

    getModalButtonContainer() {
      return App.getRegion('regionModalFooter').$el.empty();
    },

    getButton(text, type) {
      if (type == null) { type = 'primary'; }
      return $('<button>').addClass('btn btn-' + type).text(text);
    },

    defaultButtons(callback) {
      const $ok = API.getButton(t.gettext('ok'), 'primary').on('click', function() {
        if (callback) {
          callback();
        }
        return API.closeModal();
      });
      return API.getModalButtonContainer()
        .append(API.closeModalButton())
        .append($ok);
    },

    confirmButtons(callback) {
      const $ok = API.getButton(t.gettext('yes'), 'primary').on('click', function() {
        if (callback) {
          callback();
        }
        return API.closeModal();
      });
      return API.getModalButtonContainer()
      .append(API.closeModalButton('no'))
      .append($ok);
    },

    //# Toggle player menu state.
    playerMenu(op) {
      if (op == null) { op = 'toggle'; }
      const $el = $('.player-menu-wrapper');
      const openClass = 'opened';
      switch (op) {
        case 'open':
          return $el.addClass(openClass);
        case 'close':
          return $el.removeClass(openClass);
        default:
          return $el.toggleClass(openClass);
      }
    },

    //# Open a options modal.
    //# options is an object with a title and items, items is an array of single objects with
    //# a title and callback key. when the option is clicked the callback is called.
    //# Options are HTML (must be pre-escaped).
    buildOptions(options) {
      if (options.length === 0) {
        return;
      }
      const $wrap = $('<ul>').addClass('modal-options options-list');
      const $option = $('<li>');
      for (var option of Array.from(options)) {
        var $newOption = $option.clone();
        $newOption.html(option);
        $newOption.click(function(e) {
          API.closeModal();
          return $(this).closest('ul').find('li, span').unbind('click');
        });
        $wrap.append($newOption);
      }
      return $wrap;
    }
  };

  //# Open a text input modal window, callback receives the entered text.
  //# Options properties: {msgHtml: 'string', open: 'bool', defaultVal: 'string'}
  App.commands.setHandler("ui:textinput:show", function(title, options, callback) {
    if (options == null) { options = {}; }
    const msg = options.msg ? options.msg : '';
    const open = options.open ? true : false;
    const val = options.defaultVal ? options.defaultVal : '';
    const $input = $('<input>', {id: 'text-input', class: 'form-control', type: 'text', value: val}).on('keyup', function(e) {
      if ((e.keyCode === 13) && callback) {
        callback( $('#text-input').val() );
        return API.closeModal();
      }
    });
    const $msg = $('<p>').text(msg);
    API.defaultButtons(() => callback($('#text-input').val()));
    API.openModal(title, $msg, callback, open);
    const el = App.getRegion('regionModalBody').$el.append($input.wrap('<div class="form-control-wrapper"></div>'));
    setTimeout(() => el.find('input').first().focus()
    , 200);
    return $.material.init();
  });

  App.commands.setHandler("ui:modal:close", () => API.closeModal());

  //# Open a confirm modal
  App.commands.setHandler("ui:modal:confirm", function(titleHtml, msgHtml, callback) {
    if (msgHtml == null) { msgHtml = ''; }
    API.confirmButtons(() => callback(true));
    return API.openModal(titleHtml, msgHtml, true, 'confirm');
  });

  //# Open a modal window
  App.commands.setHandler("ui:modal:show", function(titleHtml, msgHtml, footerHtml, closeButton, style) {
    if (msgHtml == null) { msgHtml = ''; }
    if (footerHtml == null) { footerHtml = ''; }
    if (closeButton == null) { closeButton = false; }
    if (style == null) { style = ''; }
    API.getModalButtonContainer().html(footerHtml);
    if (closeButton) {
      API.getModalButtonContainer().prepend(API.closeModalButton());
    }
    return API.openModal(titleHtml, msgHtml, true, style);
  });

  //# Open a form modal window
  App.commands.setHandler("ui:modal:form:show", function(titleHtml, msgHtml, style) {
    if (msgHtml == null) { msgHtml = ''; }
    if (style == null) { style = 'form'; }
    return API.openModal(titleHtml, msgHtml, true, style);
  });

  //# Close a modal window
  App.commands.setHandler("ui:modal:close", () => API.closeModal());

  //# Open a youtube video in a modal
  App.commands.setHandler("ui:modal:youtube", function(titleHtml, videoid) {
    API.getModalButtonContainer().html('');
    const msgHtml = '<iframe width="560" height="315" src="https://www.youtube.com/embed/' + videoid + '?rel=0&amp;showinfo=0&amp;autoplay=1" frameborder="0" allowfullscreen></iframe>';
    return API.openModal(titleHtml, msgHtml, true, 'video');
  });

  //# Open an options modal
  App.commands.setHandler("ui:modal:options", function(titleHtml, items) {
    const $options = API.buildOptions(items);
    return API.openModal(titleHtml, $options, true, 'options');
  });

  //# Toggle player menu
  App.commands.setHandler("ui:playermenu", op => API.playerMenu(op));

  //# Bind closing the f#@kn dropdown on item click
  App.commands.setHandler("ui:dropdown:bind:close", $el => $el.on("click", '.dropdown-menu li, .dropdown-menu a', e => $(e.target).closest('.dropdown-menu').parent().removeClass('open').trigger('hide.bs.dropdown')));

  //# When shell ready.
  return App.vent.on("shell:ready", options => {
    //# Close player menu on anywhere click
    return $('html').on('click', () => API.playerMenu('close'));
  });
});
