/* See license.txt for terms of usage */

define(function(require, exports, module) {

// Dependencies
const React = require("react");
const { PopupPanel } = require("popup-panel");
const { OverlayStore } = require("overlay-store");

// Get overlay data from persistent store.
var state = {
  overlays: [],
  selection: null
}

// Render panel content
var panel = React.render(PopupPanel(state), document.body);

// Handle refresh events sent from the chrome scope and refresh
// the panel content (panel component).
window.addEventListener("refresh", onRefresh);
function onRefresh(event) {
  var data = JSON.parse(event.data);
  var selection = panel.state.selection;
  var overlay = selection ? getOverlay(data, selection.id) : null;
  panel.setState({overlays: data, selection: overlay ? overlay : data[0]});
}

function getOverlay(data, id) {
  for (var i=0; i<data.length; i++) {
    if (data[i].id == id) {
      return data[i];
    }
  }
}

// Display the page content when it's ready to avoid flashing
// during the page load.
document.addEventListener("load", event => {
  document.body.removeAttribute("collapsed");
}, true);

// Panel is loaded, let the chrome content send the first
// 'refresh' message.
postChromeMessage("panel-ready");

// End of main.js
});
