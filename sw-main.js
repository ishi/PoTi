/* global clients */
/* global self */

define(['scripts/timer/timer'], function (Timer) {
  var timer;

  //self.addEventListener('fetch', function (event) {
  //});

  self.addEventListener('message', function onMessage(event) {
    var msg = event.data;
    console.log(msg);
    switch (msg.type) {
      case 'notification':
        showNotification(msg.payload);
        break;
      case 'timer-start':
        startTimer(msg.payload);
        break;
      case 'timer-stop':
        stopTimer();
        break;
    }
  });

  function sendMessage(message) {
    clients.matchAll({type: 'window'})
      .then(function (clientList) {
        for (var i = 0; i < clientList.length; i++) {
          var client = clientList[i];
          client.postMessage(message);
        }
      });
  }

  function startTimer(interval) {
    stopTimer();
    timer = new Timer(interval).onTick(_onTickCb).onTimeUp(_onTimeUpCb);
    timer.start();
  }

  function stopTimer() {
    if (timer)
      timer.stop();
  }

  function _onTickCb(newInterval) {
    sendMessage({type: 'timer-tick', payload: newInterval});
  }

  function _onTimeUpCb() {
    sendMessage({type: 'timer-time-up'});
    showNotification({title: 'Pomodoro', body: {body: 'Your time is up'}});
  }

  function showNotification(data) {
    this.registration.showNotification(data.title, data.body);
  }

  self.addEventListener('notificationclick', function notificationClick(event) {
    //console.log('On notification click: ', event.notification.tag);
    // Android doesn't close the notification when you click on it
    // See: http://crbug.com/463146
    event.notification.close();

    // This looks to see if the current window is already open and
    // focuses if it is
    event.waitUntil(
      clients.matchAll({type: 'window'})
        .then(function (clientList) {
          for (var i = 0; i < clientList.length; i++) {
            var client = clientList[i];
            if (/*client.url == '/' && */'focus' in client)
              return client.focus()
                .then(function (client) {
                  client.postMessage('message from worker');
                });
          }
          if (clients.openWindow) {
            return clients.openWindow('/')
              .then(function (client) {
                client.postMessage('message from worker');
              });
          }
        })
    );
  });
});

