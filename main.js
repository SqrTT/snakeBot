const { getBoardAsString } = require('./src/utils');

const { getNextSnakeMove } = require('./src/bot');

var WebSocketClient = require('websocket').client;


var client = new WebSocketClient();

client.on('connectFailed', function (error) {
    console.log('Connect Error: ' + error.toString());
});

client.on('connect', function (connection) {
    console.log('WebSocket Client Connected');

    connection.on('error', function (error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function () {
        console.log('echo-protocol Connection Closed');
    });

    function processBoard(board) {
        var programLogs = "";
        function logger(message) {
            programLogs += message + "\n"
        }
        try {
            var answer = getNextSnakeMove(board, logger);
            var boardString = getBoardAsString(board);

            var logMessage = '';
            if (programLogs) {
                logMessage += "-----------------------------------\n";
                logMessage += programLogs;
            }
            logMessage += "-----------------------------------\n";
            logMessage += "Answer: " + answer + "\n";


            console.info(boardString);
            console.debug(logMessage);
            return answer;
        } catch (e) {
            logger(`!!!!!!!!!!!!!!!!!!!!!!!!`);
            logger(JSON.stringify(e));
            logger(`!!!!!!!!!!!!!!!!!!!!!!!!`);


            console.error(boardString);

            //logger(`next: ${q[1]} ${q[2]}`);
            return 'ACT';
        }

        //printBoard(boardString);
        //printLog(logMessage + '\n\n' + boardString);
    }


    connection.on('message', function (event) {
        var pattern = new RegExp(/^board=(.*)$/);

        var message = event.utf8Data;
        var parameters = message.match(pattern);
        var board = parameters[1];
        var answer = processBoard(board);
        connection.send(answer);
    });

});

var URL = 'https://game1.epam-bot-challenge.com.ua/codenjoy-contest/board/player/tolik@sqrtt.pro?code=1950246074193093654';
//var URL = 'https://game3.epam-bot-challenge.com.ua/codenjoy-contest/board/player/tolik@sqrtt.pro?code=1950246074193093654';

var url = URL.replace("http", "ws").replace("board/player/", "ws?user=").replace("?code=", "&code=");

client.connect(url);
