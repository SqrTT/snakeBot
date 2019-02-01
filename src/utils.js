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
const {
    ELEMENT, ENEMY_NORMAL_HEAD, ENEMY_BODY
} = require('./constants');

// Here is utils that might help for bot development
 function getBoardAsString(board) {
    const size = getBoardSize(board);

    return getBoardAsArray(board).join("\n");
}
exports.getBoardAsString = getBoardAsString;
/**
 *
 * @param {string} board
 */
function getBoardAsArray(board) {
    const size = getBoardSize(board);
    var result = [];
    for (var i = 0; i < size; i++) {
        result.push(board.substring(i * size, (i + 1) * size));
    }
    return result;
}
exports.getBoardAsArray = getBoardAsArray;
/**
 *
 * @param {[*]} srcboard
 */
function getArrayBoardAsArray(srcboard) {
    const size = getBoardSize(srcboard);
    var result = [];
    var board = Array.from(srcboard);
    for (var i = 0; i < size; i++) {
        var line = board.slice(i * size, i * size + size);
        result.push(line.map(x => {
            if (x === 'S') {
                return 'HHHH';
            } if (x === 0) {
                return '    ';
            } else {
                return x < 0 ?  ' ' + x.toFixed(0) + ' ' : ' ' + x.toFixed(0) + '  '
             }
        }).join(''));
    }
    return result;
}
exports.getArrayBoardAsArray = getArrayBoardAsArray;

function getBoardSize(board) {
    return Math.sqrt(board.length);
}
exports.getBoardSize = getBoardSize;;

function isGameOver(board) {
    return board.indexOf(ELEMENT.HEAD_DEAD) !== -1;
}
exports.isGameOver = isGameOver;

function isSleep(board) {
    return board.indexOf(ELEMENT.HEAD_SLEEP) !== -1;
}
exports.isSleep = isSleep;

/**
 *
 * @param {[number, number]} param0
 * @param {[number, number]} param1
 */
function sumPositions([x1, y1], [x2, y2]) {
    return [x1 + x2, y1 + y2];
}
exports.sumPositions = sumPositions;
/**
 *
 * @param {[number, number]} param0
 * @param {number} x
 */
function multPositions([x1, y1], x) {
    return [x1 * x, y1 * x];
}
exports.multPositions = multPositions;

/**
 *
 * @param {Array<[string]>} board
 * @param {string} el
 * @return {[number, number]}
 */
function findElementPos(board, el) {
    for (let y in board) {
        const row = board[y];
        for (let x in row) {
            if (el === row[x]) {
                return [Number(x), Number(y)];
            }
        }
    }
    return;
}
exports.findElementPos = findElementPos;


/**
 * @param {Array<[string]>} board
 * @param {string} el
 * @return {Array<[number, number]>}
 */
function findElementsPos(board, el) {
    const result = [];
    for (let y in board) {
        const row = board[y];
        for (let x in row) {
            if (el === row[x]) {
                result.push([Number(x), Number(y)]);
            }
        }
    }
    return result;
}
exports.findElementsPos = findElementsPos;



function isEnemyHead(e) {
    return ENEMY_NORMAL_HEAD.indexOf(e) !== -1;
}
exports.isEnemyHead = isEnemyHead;

function isEnemyBody(e) {
    return ENEMY_BODY.indexOf(e) !== -1;
}
exports.isEnemyBody = isEnemyBody;

function isAt(board, x, y, element) {
    if (isOutOf(board, x, y)) {
        return false;
    }
    return getAt(board, x, y) === element;
}
exports.isAt = isAt;

/**
 *
 * @param {*} board
 * @param {*} x
 * @param {*} y
 */
function getAt(board, x, y) {
    if (isOutOf(board, x, y)) {
        return ELEMENT.WALL;
    }
    return getElementByXY(board, { x, y });
}
exports.getAt = getAt;

function isNear(board, x, y, element) {
    if (isOutOf(board, x, y)) {
        return ELEMENT.WALL;
    }

    return isAt(board, x + 1, y, element) ||
        isAt(board, x - 1, y, element) ||
        isAt(board, x, y + 1, element) ||
        isAt(board, x, y - 1, element);
}
exports.isNear = isNear;

function isOutOf(board, x, y) {
    const boardSize = getBoardSize(board);
    return x >= boardSize || y >= boardSize || x < 0 || y < 0;
}
exports.isOutOf = isOutOf;

function getHeadPosition(board) {
    return getFirstPositionOf(board, [
        ELEMENT.HEAD_DOWN,
        ELEMENT.HEAD_LEFT,
        ELEMENT.HEAD_RIGHT,
        ELEMENT.HEAD_UP,
        ELEMENT.HEAD_DEAD,
        ELEMENT.HEAD_EVIL,
        ELEMENT.HEAD_FLY,
        ELEMENT.HEAD_SLEEP,
    ]);
}
exports.getHeadPosition = getHeadPosition;

function getFirstPositionOf(board, elements) {
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        var position = board.indexOf(element);
        if (position !== -1) {
            return getXYByPosition(board, position);
        }
    }
    return null;
}
exports.getFirstPositionOf = getFirstPositionOf;

function getXYByPosition(board, position) {
    if (position === -1) {
        return null;
    }

    const size = getBoardSize(board);
    return {
        x: position % size,
        y: (position - (position % size)) / size
    };
}
exports.getXYByPosition = getXYByPosition;

/**
 *
 * @param {[number, number]} param0
 * @param {[number, number]} param1
 * @return {[number, number]}
 */
function sum([x1, y1], [x2, y2]) {
    return [x1 + x2, y1 + y2];
}
exports.sum = sum;

/**
 * @returns {keyof ELEMENT}
 */
function getElementByXY(board, position) {
    const size = getBoardSize(board);
    return board[size * position.y + position.x];
}
exports.getElementByXY = getElementByXY;
/**
 * @returns {keyof ELEMENT}
 */
function getElementByXYArr(boardArr, position) {
    const size = getBoardSize(boardArr);
    return boardArr[size * position.y + position.x];
}
exports.getElementByXYArr = getElementByXYArr;
