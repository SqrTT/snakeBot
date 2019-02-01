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
    const headPosition = getHeadPosition(board);
    if (!headPosition) {
        return '';
    }

    console.time('board');
    const arrBoard = getBoardAsArray(board);
    const state = State.getState(board);
    // console.log(state);
    console.timeEnd('board');

    console.time('step');
    var q = minimax(1, state);
    console.timeEnd('step');

    logger(`next: ${q[1]} ${q[2]}`);

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
function minimax(depth = 0, state) {
    if (depth < 1) {
        return [COMMANDS.RIGHT, -Infinity, 'END'];
    } else if (state.player && !state.player.isDead) {
        let maxPlayerVal = ['ACT', -Infinity];

        for (let playerAction of COMMANDS_LIST) {
            let minEnemyVal = ['ACT', +Infinity];
            const nextPos = sum(state.player.head.getPos(), DIRECTIONS_MAP[playerAction]);

            // short circuit for walls
            if (state.boardMatrix[nextPos[1]][nextPos[0]] === ELEMENT.WALL) {
                maxPlayerVal = getMax(maxPlayerVal, [playerAction, -100, 'WALL']);
            } else if (state.player.isNeck(nextPos)) {
                maxPlayerVal = getMax(maxPlayerVal, [playerAction, -100, 'NECK']);
            } else {
                //for (let enemy of board.enemies) {
                //for (let enemyAction of COMMANDS_LIST) {
                // all enemies walk in same side (for speed up)
                const emulatedStep = state.step(playerAction, state.enemies.map(() => []));
                //emulatedStep.scores.shift();
                maxPlayerVal = getMax(maxPlayerVal, emulatedStep.scores.shift());

                for (let score of emulatedStep.scores) {
                    minEnemyVal = getMin(minEnemyVal, score);
                }
                const value = minimax(depth - 1, emulatedStep.state);
                minEnemyVal = getMin(minEnemyVal, value);
                // }
                //}
                maxPlayerVal = getMax(maxPlayerVal, minEnemyVal);
            }
        }
        return maxPlayerVal;
    } else {
        return [COMMANDS.RIGHT, 0, 'NO Player'];
    }
}


