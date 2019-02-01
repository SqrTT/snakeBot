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
import { ELEMENT, COMMANDS, ENEMIES_HEAD_LIST, PLAYER_HEAD_LIST } from './constants';
import {
    isGameOver, getHeadPosition, getElementByXY, getBoardAsArray, findElementPos
} from './utils';
import { State } from './simulator';


// Bot Example
export function getNextSnakeMove(board, logger) {
    if (isGameOver(board)) {
        return '';
    }
    const headPosition = getHeadPosition(board);
    if (!headPosition) {
        return '';
    }
    logger('Head:' + JSON.stringify(headPosition));

    const sorround = getSorround(board, headPosition); // (LEFT, UP, RIGHT, DOWN)
    logger('Sorround: ' + JSON.stringify(sorround));



    const raitings = sorround.map(rateElement);
    logger('Raitings:' + JSON.stringify(raitings));
    console.time('step');
    const state = State.getState(board);

    var q = minimax(4, state);
    console.timeEnd('step');

    console.log(q);

    const command = getCommandByRaitings(raitings);

    return q[0];
}


/**
 *
 * @param {[number, number]} param0
 * @param {[number, number]} param1
 * @return {[number, number]}
 */
function sum([x1, y1], [x2, y2]) {
    return [x1 + x2, y1 + y2];
}



function getMax([a1, value1], [a2, value2]) {
    return value1 > value2 ? [a1, value1] : [a2, value2];
}
function getMin([a1, value1], [a2, value2]) {
    return value1 < value2 ? [a1, value1] : [a2, value2];
}

/**
 *
 * @param {number} depth
 * @param {State} board
 */
function minimax(depth = 0, board) {
    if (depth < 1) {
        return [COMMANDS.RIGHT, 0, 'END'];
    } else {
        let maxPlayerVal = ['ACT', -Infinity];
        const playerPos = findElementPos(board, ELEMENT.HEAD_UP);
        if (!playerPos) {
            return [COMMANDS.RIGHT, 0, 'sleep?'];
        }
        let minEnemyVal = ['ACT', +Infinity];
        const enemiesPos = findElementsPos(board, ELEMENT.ENEMY_HEAD_UP, 5);

        for (let playerAction of COMMANDS_LIST) {
            for (let enemyPos of enemiesPos) {
                for (let action of COMMANDS_LIST) {

                    emulateStep(board, playerAction, playerPos);
                    // [left, left, left]
                    // const nextPos = sum(enemyPos, DIRECTIONS_MAP[action]);

                    // const val = evaluateEnemy(board, enemyPos, nextPos);
                    // if (val < 10) {


                    //     var max = minimax(depth - 1, movedCleanBoard);
                    //     minEnemyVal = getMin(max, [action, val]);
                    // } else {
                    //     minEnemyVal = getMin(minEnemyVal, [action, val]);
                    // }
                }
            }


            const val = evaluatePlayer(board, playerPos, nextPos);
            if (val >= -10) {

                // const min = minimax(depth - 1, movedCleanBoard, steps);
                maxPlayerVal = getMax(min, [playerAction, val]);
            } else {
                maxPlayerVal = getMax(maxPlayerVal, [playerAction, val]);
            }
        }
        return maxPlayerVal;
    }
}



/**
 * @param {Array<[string]>} board
 * @param {string} el
 * @return {Array<[number, number]>}
 */
function findElementsPos(board, el, limit = Infinity) {
    const result = [];
    for (let y in board) {
        const row = board[y];
        for (let x in row) {
            if (el === row[x]) {
                result.push([Number(x), Number(y)]);
                if (result.length >= limit) {
                    return result;
                }
            }
        }
    }
    return result;
}



function getSorround(board, position) {
    const p = position;
    return [
        getElementByXY(board, { x: p.x - 1, y: p.y }), // LEFT
        getElementByXY(board, { x: p.x, y: p.y - 1 }), // UP
        getElementByXY(board, { x: p.x + 1, y: p.y }), // RIGHT
        getElementByXY(board, { x: p.x, y: p.y + 1 }) // DOWN
    ];
}

function rateElement(element) {
    if (element === ELEMENT.NONE) {
        return 0;
    }
    if (
        element === ELEMENT.APPLE ||
        element === ELEMENT.GOLD
    ) {
        return 1;
    }

    return -1;
}


function getCommandByRaitings(raitings) {
    var indexToCommand = ['LEFT', 'UP', 'RIGHT', 'DOWN'];
    var maxIndex = 0;
    var max = -Infinity;
    for (var i = 0; i < raitings.length; i++) {
        var r = raitings[i];
        if (r > max) {
            maxIndex = i;
            max = r;
        }
    }

    return indexToCommand[maxIndex];
}
