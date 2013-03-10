function defineGlobalObject (global) {
  var myDevtools = global.devtoolsBridge;

  if (myDevtools) {
    myDevtools.listeners = {};
  } else {
    myDevtools = global.devtoolsBridge = {
      listeners: {}
    };
  }

  myDevtools.on = function (pEventType, pCallback) {
    var tListener = this.listeners[pEventType];
    if (tListener) {
      tListener.push(pCallback);
    } else {
      this.listeners[pEventType] = [pCallback];
    }
  };
}

var config = configApp();

chrome.devtools.panels.create(
  config.panelName || 'DevtoolsBridge',
  '../' + (config.panelIconPath || 'img/icon.png'),
  '../' + (config.panelHtmlPath || 'app/index.html'),
  function (pPanel) {

    var mInitialized = false;

    pPanel.onShown.addListener(function (window) {

      if (mInitialized) {
        return;
      }

      defineGlobalObject(window);
      registerPanelListeners(window);

      // Establishes a connection with the background page.
      var mPort = chrome.extension.connect();
      var mWindowData = [];

      // A unitility function to post a message to the web pages.
      var doPostMessage = function (pType, pParams, pId) {
        var tData = {
          from: 'devtools', 
          id: pId || 0,
          type: pType
        };
        for (var k in pParams) {
          tData[k] = pParams[k];
        }
        mPort.postMessage(tData);
      };


      mPort.onMessage.addListener(function (pMsg) {
        if (pMsg.from !== 'webpage') return;
        if (pMsg.type === 'injected') {
          mWindowData[pMsg.id] = {
            state: 'injected'
          };
        } else if (pMsg.type === 'load') {
          mWindowData[pMsg.id].state = 'loaded';
        }
        var response = pMsg.data;
        var tListener = window.devtoolsBridge.listeners[pMsg.type];
        if (tListener) {
          for (var i = 0, il = tListener.length; i < il; i++) {
            tListener[i](pMsg, doPostMessage);
          }
        }
      });

      // The script will be injected into every frame of the inspected page
      //  immediately upon load, before any of the frame's scripts.
      var mFunctionToInject = function (global) {
        // A global variable to hold every data.
        var privObj = global.devtoolsPanelBoilerplate = {};
        privObj.windowId = -1;

        // Get the window's id that is unique within the tab.
        var topLevelWindowPrivObj = global.top.devtoolsPanelBoilerplace;
        if (!topLevelWindowPrivObj) {
          topLevelWindowPrivObj = global.top.devtoolsPanelBoilerplace = {windowNum: 0};
        }
        privObj.windowId = topLevelWindowPrivObj.windowNum++;
        console.log('#### Script injected. windowId = ' + privObj.windowId);

        // A unitility function to post a message to the devtools panel.
        var doPostMessage = function (pType, pParams) {
          var tData = {
            from: 'webpage', 
            id: privObj.windowId,
            type: pType
          };
          for (var k in pParams) {
            tData[k] = pParams[k];
          }
          global.postMessage(JSON.stringify(tData), '*');
        };

        // Notify the devtools panel that the script is injected.
        doPostMessage('injected');

        // Notify the devtools panel that the web page is loaded.
        global.onload = function () {
          doPostMessage('load');
        };

        // Handles the messages from the devtools panel.
        global.addEventListener('message', function(event) {
          if (event.source != global) return;
          var tMsg = event.data;
          if (tMsg.from !== 'devtools') return;
          if (tMsg.id !== privObj.windowId) return;
          console.log('[Web page] postMessage received.', tMsg);

          var tListener = global.devtoolsBridge.listeners[tMsg.type];
          if (tListener) {
            for (var i = 0, il = tListener.length; i < il; i++) {
              tListener[i](tMsg, doPostMessage);
            }
          }
        }, false);

      }; // mFunctionToInject


      var mScriptToInject = [
        '(' + defineGlobalObject.toString() + '(this));',
        '(' + registerWebPageListeners.toString() + '(this));',
        '(' + mFunctionToInject.toString() + '(this));'
        ].join('');

      chrome.devtools.inspectedWindow.reload({
        injectedScript: mScriptToInject
      });

      mInitialized = true;
    });
  });
