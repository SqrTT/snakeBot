/*-
 * #%L
 * Codenjoy - it's a dojo-like platform from developers to developers.
 * %%
 * Copyright (C) 2018 - 2019 Codenjoy
 * %%
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public
 * License along with this program.  If not, see
 * <http://www.gnu.org/licenses/gpl-3.0.html>.
 * #L%
 */
var { ELEMENT, COMMANDS, COMMANDS_LIST, DIRECTIONS_MAP } = require('./constants');
var {
    isGameOver, getHeadPosition, getElementByXY, getBoardAsArray, findElementPos, sum
} = require('./utils');
var { State, getValAt } = require('./state');



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
    var q = minimax(5, state, arrBoard.length);
    var timeStepEnd = Date.now();

    logger(`next: ${q[1]} ${q[2]}`);
    logger(`time: board: ${timeBoardEnd - timeBoard}, step: ${timeStepEnd - timeStep}`);

    return q[0];
}
exports.getNextSnakeMove = getNextSnakeMove;

function getMax(a, b) {
    return a[1] > b[1] ? a : b;
}
function getMin(a, b) {
    return a[1] < b[1] ? a : b;
}

/**
 *
 * @param {number} depth
 * @param {State} state
 */
function minimax(depth = 0, state, boardSize = 30) {
    if (depth < 1) {
        return [COMMANDS.RIGHT, -Infinity, 'END'];
    } else if (state.player && !state.player.isDead) {
        var maxPlayerVal = ['ACT', -Infinity];

        for (var playerAction of COMMANDS_LIST) {
            var minEnemyVal = ['ACT', +Infinity];
            var nextPos = sum(state.player.head.getPos(), DIRECTIONS_MAP[playerAction]);

            // short circuit for walls and for out of range
            if (nextPos[1] < 0 || nextPos[0] < 0 || nextPos[1] > boardSize - 1 || nextPos[0] > boardSize - 1) {
                maxPlayerVal = getMax(maxPlayerVal, [playerAction, -100, 'OUTOFRANGE']);
            } else if (state.boardMatrix[nextPos[1]][nextPos[0]] === ELEMENT.WALL) {
                maxPlayerVal = getMax(maxPlayerVal, [playerAction, -100, 'WALL']);
            } else if (state.player.isNeck(nextPos)) {
                maxPlayerVal = getMax(maxPlayerVal, [playerAction, -100, 'NECK']);
            } else {
                //for (var enemy of board.enemies) {
                for (var enemyAction of COMMANDS_LIST) {
                    // all enemies walk in same side (for speed up)
                    var emulatedStep = state.step(playerAction, state.enemies.map(() => enemyAction));
                    var playerScore = emulatedStep.scores.shift();
                    playerScore[0] = playerAction;
                    //playerScore[1] =  playerScore[1] / 1.5;
                    maxPlayerVal = getMax(maxPlayerVal, playerScore);

                    for (var score of emulatedStep.scores) {
                        score[0] = playerAction;
                        minEnemyVal = getMin(minEnemyVal, score);
                    }
                    var value = minimax(depth - 1, emulatedStep.state, boardSize);
                    value[0] = playerAction;
                    value[1] = value[1] / 1.3;

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


