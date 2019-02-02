
var { ELEMENT, COMMANDS, COMMANDS_LIST, DIRECTIONS_MAP } = require('./constants');
var {
    isGameOver, getHeadPosition, getElementByXY, getBoardAsArray, findElementPos, sum
} = require('./utils');
var { State, getValAt } = require('./state');

const ANSWER = 0,
    SCORE = 1,
    COMMENT = 2,
    X = 0,
    Y = 1,
    COMMANDS_LIST_LENGTH = COMMANDS_LIST.length - 1;


var minimaxCounter = 0
function getNextSnakeMove(board, logger) {
    if (isGameOver(board)) {
        return '';
    }

    var timeBoard = Date.now();
    var arrBoard = getBoardAsArray(board);
    var state = State.getState(board);
    // console.log(state);
    var timeBoardEnd = Date.now();


    var timeStep = Date.now();
    minimaxCounter = 0;
    var q = minimax(6, state, arrBoard.length);
    var timeStepEnd = Date.now();

    logger(`next: ${q[SCORE]} ${q[COMMENT]}`);
    logger(`time: board: ${timeBoardEnd - timeBoard}, step: ${timeStepEnd - timeStep}`);
    logger(`calls ${minimaxCounter}  (${(minimaxCounter/(timeStepEnd - timeStep)).toFixed()} call/ms)`);


    return q[ANSWER];
}
exports.getNextSnakeMove = getNextSnakeMove;

function getMax(a, b) {
    return a[SCORE] > b[SCORE] ? a : b;
}
function getMin(a, b) {
    return a[SCORE] < b[SCORE] ? a : b;
}

/**
 *
 * @param {number} depth
 * @param {State} state
 * @returns {[string, number, string]}
 */
function minimax(depth = 0, state, boardSize = 30) {
    minimaxCounter++;
    if (depth < 1) {
        return [COMMANDS.RIGHT, -Infinity, 'END'];
    } else if (state.player && !state.player.isDead) {
        /**
         * @type {[string, number, string]}
         */
        var maxPlayerVal = [COMMANDS.ACT, -Infinity, 'MAX'];

        for (var playerActionIDX = COMMANDS_LIST_LENGTH; playerActionIDX >= 0; --playerActionIDX) {
            var playerAction = COMMANDS_LIST[playerActionIDX];
            var minEnemyVal = [COMMANDS.ACT, +Infinity];
            var nextPos = sum(state.player.head.getPos(), DIRECTIONS_MAP[playerAction]);

            // short circuit for walls and for out of range
            if (nextPos[X] < 0 || nextPos[Y] < 0 || nextPos[X] > boardSize - 1 || nextPos[Y] > boardSize - 1) {
                maxPlayerVal = getMax(maxPlayerVal, [playerAction, -100, 'OUTOFRANGE']);
            } else if (state.boardMatrix[nextPos[Y]][nextPos[X]] === ELEMENT.WALL) {
                maxPlayerVal = getMax(maxPlayerVal, [playerAction, -100, 'WALL']);
            } else if (state.player.isNeck(nextPos)) {
                maxPlayerVal = getMax(maxPlayerVal, [playerAction, -100, 'NECK']);
            } else {
                //for (var enemy of board.enemies) {
                for (var enemyActionIdx = COMMANDS_LIST_LENGTH; enemyActionIdx >= 0; --enemyActionIdx) {
                    var enemyAction = COMMANDS_LIST[enemyActionIdx];
                    // all enemies walk in same side (for speed up)
                    var emulatedStep = state.step(playerAction, state.enemies.map(() => enemyAction));
                    var playerScore = emulatedStep.scores.shift();
                    playerScore[ANSWER] = playerAction;
                    //playerScore[1] =  playerScore[1] / 1.5;
                    maxPlayerVal = getMax(maxPlayerVal, playerScore);

                    for (var scoreIdx = emulatedStep.scores.length - 1; scoreIdx >= 0; --scoreIdx) {
                        var score = emulatedStep.scores[scoreIdx];
                        score[0] = playerAction;
                        minEnemyVal = getMin(minEnemyVal, score);
                    }
                    var value = minimax(depth - 1, emulatedStep.state, boardSize);
                    value[ANSWER] = playerAction;
                    value[SCORE] = value[SCORE] / 1.1;

                    minEnemyVal = getMin(minEnemyVal, value);
                }
                //}
                maxPlayerVal = getMax(maxPlayerVal, minEnemyVal);
            }
        }
        return maxPlayerVal;
    } else {
        return [COMMANDS.RIGHT, 0, 'NO Player'];
    }
}


