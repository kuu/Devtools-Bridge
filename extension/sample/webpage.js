/* 
 * registerWebPageListeners
 * The code for handling the events from the devtools panel needs to be implemented here.
 * @param {Window} global The global object that represents the top-level window or a frame of the web page.
 * Please note that this function will be injected into every frame of the inspected page.
 */
function registerWebPageListeners(global) {

  var myWebPage = global.devtoolsBridge;

  /* 
   * global.devtoolsBridge.on
   * @param {string} eventType The event type to listen for.
   * @param {function} listener A callback function.
   * The callback function takes the following arguments:
   *    {object} event The event received from the devtools panel.
   *    {function} sendEvent A function for sending an event to the devtools panel.
   * The sendEvent takes the following arguments:
   *    {string} eventType The event type to send.
   *    {object} params The optional data associated with the event.
   */
  myWebPage.on('inspect', function (event, sendEvent) {
    if (global.Array) {
      var tToString = global.Array.prototype.toString;
      global.Array.prototype.toString = function () {
        sendEvent('alert', {msg: 'Array.toString is called!'});
        return 'Injected: ' + tToString.call(this);
      };
    }
  });

  myWebPage.on('jqcheck', function (event, sendEvent) {
    var isUsed = false;
    if (global.jQuery) {
      isUsed = true;
    }
    sendEvent('jqcheck', {data: isUsed});
  });
};
