/* 
 * registerPanelListeners
 * The code for handling the events from the web pages needs to be implemented here.
 * @param {Window} global The global object that represents the window of the panel.
 */
function registerPanelListeners(global) {

  var myPanel = global.devtoolsBridge;
  var document = global.document;
  var button = document.getElementsByTagName('button')[0];
  var result = document.getElementById('result');

  /* 
   * global.devtoolsBridge.on
   * @param {string} eventType The event type to listen for.
   * @param {function} listener A callback function.
   * The callback function takes the following arguments:
   *    {object} event The event received from the web page.
   *    {function} sendEvent A function for sending an event to the web page.
   * The sendEvent takes the following arguments:
   *    {string} eventType The event type to send.
   *    {object} params The optional data associated with the event.
   *    {number} windowId The optional id that represents a specific frame within the tab.
   */
  myPanel.on('load', function (event, sendEvent) {
    button.addEventListener('click', function () {
      sendEvent('jqcheck', null, event.id);
    }, false);
  });

  myPanel.on('jqcheck', function (event, sendEvent) {
    var idStr = 'result-' + event.id;
    var div = document.getElementById(idStr);
    if (!div) {
      div = document.createElement('div');
      div.id = idStr;
      result.appendChild(div);
    }
    div.innerHTML = '[windowId=' + event.id + ' : ' + event.url  + '](' + event.title + ')<br> => jQuery is ' + (event.data ? 'used.' : 'not used.');
  });

  
};
