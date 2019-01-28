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

    const raitingsBoard = getWheigts(board, headPosition, logger);
    //logger('Food: ' + JSON.stringify(raitingsBoard));

    //console.log(JSON.stringify(getArrayBoardAsArray(raitingsBoard), undefined, '\t'));

    const sorround = getSorround(raitingsBoard, headPosition); // (LEFT, UP, RIGHT, DOWN)
    logger('Sorround: ' + JSON.stringify(sorround, undefined, '  '));

    //console.log(raitingsBoard)

    const command = getCommandByRaitings(sorround);
    console.timeEnd('st');
    return command;
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

function getWheigts(board, headPosition, logger) {
    const wheigtBoard = [];
    const boardSize = getBoardSize(board);
    wheigtBoard.length = boardSize * boardSize;

    for (let x = 0; x < boardSize; x++) {
        for (let y = 0; y < boardSize; y++) {
            wheigtBoard[boardSize * y + x] = 0;
        }
    }

    var mode = 'normal';
    if (getAt(board, headPosition.x, headPosition.y) === ELEMENT.HEAD_FLY) {
        mode = 'fly';
    } else if (getAt(board, headPosition.x, headPosition.y) === ELEMENT.HEAD_EVIL) {
        mode = 'evil';
    }

    for (let x = 0; x < boardSize; x++) {
        for (let y = 0; y < boardSize; y++) {
            var something = getAt(board, x, y);

            var rating = rateElement(something, mode);
            wheigtBoard[boardSize * y + x] = rating;

            if (rating > 0) {
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
                //console.log(boardClone);
                const grid = new PF.Grid(boardClone);
                const finder = new PF.AStarFinder();
                var path = finder.findPath(
                    headPosition.x, headPosition.y, x, y, grid);

                if (path && path.length > 1) {
                    // logger(`path length: ${path.length}`);
                    path.shift();
                    var [nextX, nextY] = path[0];
                    // logger(`x: ${nextX}, y: ${nextY}`);
                    renderPath(filteredBoard, path)

                    if (wheigtBoard[boardSize * nextY + nextX] >= 0) {
                        var newWalue = (wheigtBoard[boardSize * nextY + nextX]) + rating / (path.length * path.length);

                        if (typeof newWalue === 'undefined') {
                            throw Error('undef val');
                        } if (newWalue < 0) {
                            throw Error('zero val');
                        }

                        wheigtBoard[boardSize * nextY + nextX] += newWalue;
                        // var out = {
                        //     newWalue: newWalue,
                        //     score: rating / (path.length * path.length),
                        //     rating: rating,
                        //     length: path.length,
                        //     sqrLength: path.length * path.length
                        // };

                        // console.log(Object.keys(out).map(k => {
                        //     return `${k} - ${out[k]}`;
                        // }).join('\n'));
                    } else {
                        console.log('______' + wheigtBoard[boardSize * nextY + nextX], nextX, nextY, boardSize);
                    }
                }
            }
        };
    };
    //wheigtBoard[boardSize * headPosition.y + headPosition.x] = "S";

    return wheigtBoard;

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
        return 7;
    } else if (element === ELEMENT.WALL) {
        return -11;
    } else if (element === ELEMENT.GOLD) {
        return 8;
    } else if (
        element === ELEMENT.FURY_PILL ||
        element === ELEMENT.FLYING_PILL
    ) {
        return 2;
    } else if (!isFury && !isFly && isEnemy(element)) {
        return -12
    } else if (isFly && element === ELEMENT.STONE) {
        return 0;
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
