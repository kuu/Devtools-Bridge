/* 
 * configApp
 * Returns an object that defines optional values for this devtools panel.
 */
function configApp() {
  return {
    /*
     * panelName {string}
     * Title that is displayed next to the extension icon in the Developer Tools toolbar.
     * @default 'Devtools-Bridge'
     */
    panelName: 'Dummy App',

    /*
     * panelIconPath {string}
     * Path of the panel's icon relative to the extension directory.
     * @default 'sample/img/icon.png'
     */
    panelIconPath: 'sample/img/icon.png',

    /*
     * panelHtmlPath {string}
     * Path of the panel's HTML page relative to the extension directory.
     * @default 'sample/index.html'
     */
    panelHtmlPath: 'sample/index.html',

    /*
     * panelScripts {Array<string>}
     * Array of the path of the JavaScript files used by the panel relative to the extension directory.
     * Note that the files will be loaded in the order listed here.
     * Please see the sample files to learn how to write event handlers for communication between the devtools panel and web pages.
     * @default []
     */
    panelScripts: [
      'sample/panel.js',
      'sample/webpage.js'
      ]
  };
}

