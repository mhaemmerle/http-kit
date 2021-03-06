(function () {
  var $i = $('#i'),
      $history = $('#history');

  var max_id = 1;

  var conn = new WebSocket("ws://127.0.0.1:9899/ws");

  conn.onopen = function (e) {
    conn.send(JSON.stringify({command: 'getall'}));
  };

  conn.onmessage = function (e) {
    var msgs = JSON.parse(e.data);
    for(var i = 0; i < msgs.length; i++) {
      var msg = msgs[i];
      if(msg.id > max_id) {
        add_msg(msg);
        max_id = msg.id;
      }
    }
  };

  function add_msg (msg) {
    var now = Math.round(new Date().getTime() / 1000);
    var t = (now - msg.time) + 's ago';
    t = ["<span class=\"time\">", t + "</span>"].join('');
    var author = ["<span class=\"author\">",
                  msg.author,
                  "</span>: "].join('');
    // console.log(msg, ymdate(msg.time));
    $history.append('<li>' + author + msg.msg + t +'</li>');
    $history.find('li:last')[0].scrollIntoView();
  }

  function send_to_server () {
    var msg = $.trim($i.val()),
        author = $.trim($('#name').val() || 'anonymous');
    if(msg) {
      conn.send(JSON.stringify({msg: msg, author: author}));
      $i.val('');
    }
  }

  $('#send').click(send_to_server);

  $i.keyup(function (e) {
    if(e.which === 13) {        // enter
      send_to_server();
    }
  });

  $i.focus();
})();
