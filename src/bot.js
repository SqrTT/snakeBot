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
import { ELEMENT, COMMANDS, ENEMY_ELEMENTS, SELF_ELEMENTS } from './constants';
import {
    isGameOver, getHeadPosition, getElementByXY, getBoardSize, getAt, getBoardAsArray, getArrayBoardAsArray, getElementByXYArr
} from './utils';
import PF from 'pathfinding';

/**
 *
 * @param {string} board
 * @param {(asg: any)=> void} logger
 */
export function getNextSnakeMove(board, logger) {
    if (isGameOver(board)) {
        return '';
    }
    console.time('st');
    const headPosition = getHeadPosition(board);
    if (!headPosition) {
        return '';
    }

    logger('Head:' + JSON.stringify(headPosition));

    var mode = 'normal';
    if (getAt(board, headPosition.x, headPosition.y) === ELEMENT.HEAD_FLY) {
        mode = 'fly';
    } else if (getAt(board, headPosition.x, headPosition.y) === ELEMENT.HEAD_EVIL) {
        mode = 'evil';
    }

    const directions = getDirections(board, headPosition, logger);
    logger('Food amount: ' + JSON.stringify(directions.length));

    var el;
    if (mode === 'evil' && (el = directions.find(x => x.element === ELEMENT.STONE && x.distance < 6))) {
        logger('evil stone:' + el.distance);
        return el.command;
    } else if ((el = directions.find(x => x.element === ELEMENT.GOLD && x.distance < 15))) {
        logger('short gold:' + el.distance);
        return el.command;
    } else if ((el = directions.find(x => x.element === ELEMENT.APPLE && x.distance < 10))) {
        logger('short apple:' + el.distance);

        return el.command;
    } else if ((el = directions.find(x => x.element === ELEMENT.FLYING_PILL && x.distance < 3))) {
        logger('short fly:' + el.distance);

        return el.command;
    } else if ((el = directions.find(x => x.element === ELEMENT.FURY_PILL && x.distance < 7))) {
        logger('short fury:' + el.distance);
        return el.command;
    } else {
        logger('many food dir');
        var foodDir = {
            [COMMANDS.LEFT]: 0,
            [COMMANDS.RIGHT]: 0,
            [COMMANDS.DOWN]: 0,
            [COMMANDS.UP]: 0
        }

        directions.forEach(x => {
            foodDir[x.command] += x.element === ELEMENT.GOLD ? 3 : 1;
        });
        logger(JSON.stringify(foodDir));

        var nextCommand = 'ACT';
        var nextWheight = 0;

        Object.keys(foodDir).forEach(cmnd => {
            if (nextWheight < foodDir[cmnd]) {
                nextWheight = foodDir[cmnd];
                nextCommand = cmnd;
            }
        })
        return nextCommand;
    }
}

function renderPath(filteredBoard, path) {
    if (true) {
        return;
    }
    filteredBoard = filteredBoard.split('');
    var size = getBoardSize(filteredBoard);
    if (path && path.length) {
        path.forEach(([x, y]) => {
            filteredBoard[size * y + x] = '.';
        })
    }
    filteredBoard = filteredBoard.join('');

    console.log(getBoardAsArray(filteredBoard).join('\n'))
}

function getDirections(board, headPosition, logger) {
    const directions = [];
    const boardSize = getBoardSize(board);

    var mode = 'normal';
    if (getAt(board, headPosition.x, headPosition.y) === ELEMENT.HEAD_FLY) {
        mode = 'fly';
    } else if (getAt(board, headPosition.x, headPosition.y) === ELEMENT.HEAD_EVIL) {
        mode = 'evil';
    }

    for (let x = 0; x < boardSize; x++) {
        for (let y = 0; y < boardSize; y++) {

            var element = getAt(board, x, y);

            if (rateElement(element, mode) > 0) {
                const filteredBoard = board.split('').map(x => {
                    if (mode === 'normal' && isEnemy(x)) {
                        return 1;
                    } else if (x === ELEMENT.WALL || x === ELEMENT.START_FLOOR) {
                        return 1;
                    } else if (x === ELEMENT.STONE && mode === 'normal') {
                        return 1;
                    } else if (isSelf(x)) {
                        return 1;
                    } else {
                        return 0;
                    }
                }).join('');

                const boardClone = getBoardAsArray(filteredBoard).map(x => x.split('').map(Number));

                const grid = new PF.Grid(boardClone);
                const finder = new PF.AStarFinder();
                var path = finder.findPath(
                    headPosition.x, headPosition.y, x, y, grid);

                if (path && path.length > 1) {
                    // logger(`path length: ${path.length}`);
                    path.shift();
                    var [nextX, nextY] = path[0];

                    directions.push({
                        element: element,
                        distance: path.length,
                        command: getCoomandByCoord(headPosition.x, headPosition.y, nextX, nextY)
                    });
                }
            }
        }
    }
    directions.sort((a, b) => a.distance - b.distance);

    return directions;
}

function getCoomandByCoord(x, y, x2, y2) {
    if (x < x2) {
        return COMMANDS.RIGHT;
    } else if (x > x2) {
        return COMMANDS.LEFT;
    } else if (y > y2) {
        return COMMANDS.UP;
    } else {
        return COMMANDS.DOWN;
    }
}

function getSorround(board, position) {
    const p = position;
    return [
        getElementByXYArr(board, { x: p.x - 1, y: p.y }), // LEFT
        getElementByXYArr(board, { x: p.x, y: p.y - 1 }), // UP
        getElementByXYArr(board, { x: p.x + 1, y: p.y }), // RIGHT
        getElementByXYArr(board, { x: p.x, y: p.y + 1 }) // DOWN
    ];
}


function isEnemy(element) {
    return ENEMY_ELEMENTS.indexOf(element) > -1;
}

function isSelf(element) {
    return SELF_ELEMENTS.indexOf(element) > -1;
}

function rateElement(element, mode) {
    var isFly = mode === 'fly';
    var isFury = mode === 'evil';

    if (element === ELEMENT.NONE) {
        return 0;
    } else if (element === ELEMENT.APPLE) {
        return 20;
    } else if (element === ELEMENT.WALL) {
        return -11;
    } else if (element === ELEMENT.GOLD) {
        return 25;
    } else if (
        element === ELEMENT.FURY_PILL ||
        element === ELEMENT.FLYING_PILL
    ) {
        return 2;
    } else if (!isFury && !isFly && isEnemy(element)) {
        return -12
    } else if ((isFly || isFury )&& element === ELEMENT.STONE) {
        return 3;
    } else if (isSelf(element)) {
        return -5;
    } else if (element === ELEMENT.STONE) {
        return -7;
    }

    return -10;
}

/** */
function getCommandByRaitings(raitings) {
    var indexToCommand = [COMMANDS.LEFT, COMMANDS.UP, COMMANDS.RIGHT, COMMANDS.DOWN];
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
