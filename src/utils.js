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
    ELEMENT, ENEMY_NORMAL_HEAD, ENEMY_BODY, COMMANDS, ENEMY_ELEMENTS, SELF_ELEMENTS
} = require('./constants');

var X = 0;
var Y = 1;

// Here is utils that might help for bot development
function getBoardAsString(board) {
    var size = getBoardSize(board);

    return getBoardAsArray(board).join("\n");
}
exports.getBoardAsString = getBoardAsString;
/**
 *
 * @param {string} board
 */
function getBoardAsArray(board) {
    var size = getBoardSize(board);
    /**
     * @type {string[]}
     */
    var result = [];
    for (var i = 0; i < size; i++) {
        result.push(board.substring(i * size, (i + 1) * size));
    }
    return result;
}
exports.getBoardAsArray = getBoardAsArray;


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

function isEnemy(element) {
    return ENEMY_ELEMENTS.indexOf(element) > -1;
}
exports.isEnemy = isEnemy;

function isSelf(element) {
    return SELF_ELEMENTS.indexOf(element) > -1;
}
exports.isSelf = isSelf

/**
 *
 * @param {[number, number]} a1
 * @param {[number, number]} a2
 */
function sumPositions(a1, a2) {
    return [a1[X] + a2[X], a1[Y] + a2[Y]];
}
exports.sumPositions = sumPositions;
/**
 *
 * @param {[number, number]} a
 * @param {number} x
 */
function multPositions(a, x) {
    return [a[X] * x, a[Y] * x];
}
exports.multPositions = multPositions;

/**
 *
 * @param {Array<string[]>} board
 * @param {string} el
 * @return {[number, number]|undefined}
 */
function findElementPos(board, el) {
    for (var y = board.length - 1; y >= 0; y--) {
        var row = board[y];
        for (var x = row.length - 1; x >= 0; --x) {
            if (el === row[x]) {
                return [x, y];
            }
        }
    }
    return;
}
exports.findElementPos = findElementPos;


/**
 * @param {Array<string[]>} board
 * @param {string} el
 */
function findElementsPos(board, el) {
    /**
     * @type {Array<[number, number]>}
     */
    var result = [];
    for (var y = board.length - 1; y >= 0; --y) {
        var row = board[y];
        for (var x = row.length - 1; x >= 0; --x) {
            if (el === row[x]) {
                result.push([x, y]);
            }
        }
    }
    return result;
}
exports.findElementsPos = findElementsPos;

function getDirectionByPos(from, to) {
    if (from[X] < to[X]) {
        return COMMANDS.RIGHT;
    } else if (from[X] < to[X]) {
        return COMMANDS.LEFT;
    } else if (from[Y] < to[Y]) {
        return COMMANDS.UP;
    } else {
        return COMMANDS.DOWN;
    }
}
exports.getDirectionByPos = getDirectionByPos;

function isSamePos(from, to) {
    return from[X] === to[X] && from[Y] === to[Y];
}
exports.isSamePos = isSamePos;




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
    var boardSize = getBoardSize(board);
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

    var size = getBoardSize(board);
    return {
        x: position % size,
        y: (position - (position % size)) / size
    };
}
exports.getXYByPosition = getXYByPosition;

/**
 *
 * @param {[number, number]} a1
 * @param {[number, number]} a2
 * @return {[number, number]}
 */
function sum(a1, a2) {
    return [a1[X] + a2[X], a1[Y] + a2[Y]];;
}
exports.sum = sum;

/**
 * @returns {string}
 */
function getElementByXY(board, position) {
    var size = getBoardSize(board);
    return board[size * position.y + position.x];
}
exports.getElementByXY = getElementByXY;
/**
 * @returns {string}
 */
function getElementByXYArr(boardArr, position) {
    var size = getBoardSize(boardArr);
    return boardArr[size * position.y + position.x];
}
exports.getElementByXYArr = getElementByXYArr;
