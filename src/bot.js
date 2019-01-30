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
import { ELEMENT, COMMANDS, ENEMY_ELEMENTS, SELF_ELEMENTS, ENEMY_HEAD, ENEMY_HEAD_TO_DIRECTION, DIRECTION } from './constants';
import {
    isGameOver, getHeadPosition, getElementByXY, getBoardSize, getAt, getBoardAsArray, getElementByXYArr, isSleep, isEnemyHead, multPositions, sumPositions, isEnemyBody
} from './utils';
import PF from 'pathfinding';
const EATING_STONE_SIZE = 6;
let turnsCount = 0;
let stayOnTheWayCount = 0;
export function getNextSnakeMove(board, logger) {
    console.time('move');
    const res = getNextSnakeMoveInner(board, logger);
    console.timeEnd('move');
    return res;
}
/**
 *
 * @param {string} board
 * @param {(asg: any)=> void} logger
 */
function getNextSnakeMoveInner(board, logger) {
    if (isGameOver(board)) {
        return '';
    }
    if (isSleep(board)) {
        turnsCount = 0;
    } else {
        turnsCount++;
    }
    const headPosition = getHeadPosition(board);
    if (!headPosition) {
        return '';
    }

    logger(`Turn: ${turnsCount} - Head: x:${headPosition.x} y: ${headPosition.y}`);
    var selfSize = 0;
    var enemiesSize = 0;
    var enemiesCount = 0;
    board.split('').forEach(x => {
        if (isSelf(x)) {
            selfSize += 1;
        } else if (isEnemy(x)) {
            enemiesSize++;
            if (ENEMY_HEAD.indexOf(x) > -1) {
                enemiesCount++;
            }
        }
    });
    var enemiesMiddleLength = Math.ceil(enemiesSize / enemiesCount)
    logger(`Size: ${selfSize}`);
    logger(`Enemy count: ${enemiesCount} - ${enemiesSize} -  ${enemiesMiddleLength}`);

    var mode = 'normal';
    if (getAt(board, headPosition.x, headPosition.y) === ELEMENT.HEAD_FLY) {
        mode = 'fly';
    } else if (getAt(board, headPosition.x, headPosition.y) === ELEMENT.HEAD_EVIL) {
        mode = 'evil';
    }

    const directions = getDirections(board, headPosition, selfSize, rateElement);
    logger('Food amount: ' + JSON.stringify(directions.length));

    var el;
    var ACT = mode === 'evil' ? 'ACT,' : '';

    /// attack
    // cut body
    if (mode === 'evil' && (el = directions.find(x => (isEnemyBody(x.element) && isEnemyHead(x.element)) && x.distance < 5))) {
        logger('attack enemy body:' + el.distance);
        console.log('attack enemy body:' + el.distance);

        return ACT + el.command;
    }
    // stay on the way
    if (stayOnTheWayCount === 0 && (el = directions.find(x => x.ahead === 2 && isEnemyHead(x.element) && x.distance < 2))) {
        logger('stay on the way 2:' + el.distance);
        console.log('stay on the way 2:' + el.distance);

        stayOnTheWayCount++;
        return ACT + el.command;
    } else if (stayOnTheWayCount === 0 && (el = directions.find(x => x.ahead === 3 && isEnemyHead(x.element) && x.distance < 3))) {
        logger('stay on the way 3:' + el.distance);
        console.log('stay on the way 3:' + el.distance);

        stayOnTheWayCount++;
        return ACT + el.command;
    } else {
        stayOnTheWayCount = 0;
    }
    ///

    if ((mode === 'evil' || selfSize > EATING_STONE_SIZE) && (el = directions.find(x => x.element === ELEMENT.STONE && x.distance < 9))) {
        logger('fury stone:' + el.distance);
        return ACT + el.command;
    } else if ((el = directions.find(x => x.element === ELEMENT.APPLE && x.distance < 2))) {
        logger('extra short apple:' + el.distance);
        return ACT + el.command;
    } else if ((el = directions.find(x => x.element === ELEMENT.FURY_PILL && x.distance < 15))) {
        logger('short fury:' + el.distance);
        return ACT + el.command;
    } else if ((el = directions.find(x => x.element === ELEMENT.GOLD && x.distance < 15))) {
        logger('short gold:' + el.distance);
        return ACT + el.command;
    } else if ((el = directions.find(x => x.element === ELEMENT.APPLE && x.distance < 10))) {
        logger('short apple:' + el.distance);

        return ACT + el.command;
    } else if ((el = directions.find(x => x.element === ELEMENT.FLYING_PILL && x.distance < 3))) {
        logger('short fly:' + el.distance);

        return ACT + el.command;
    } else {
        logger('many food dir');
        var foodDir = {
            [COMMANDS.LEFT]: 0,
            [COMMANDS.RIGHT]: 0,
            [COMMANDS.DOWN]: 0,
            [COMMANDS.UP]: 0
        }

        directions.forEach(x => {
            if (x.element === ELEMENT.GOLD) {
                foodDir[x.command] += 6;
            } else if (x.element === ELEMENT.APPLE) {
                foodDir[x.command] += 2;
            }
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
        return ACT + nextCommand;
    }
}


function getDirections(board, headPosition, selfSize, rateElement, findFloor = false) {
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
                    } else if (
                        x === ELEMENT.WALL ||
                        (x === ELEMENT.START_FLOOR && !findFloor) ||
                        x === ELEMENT.ENEMY_TAIL_INACTIVE ||
                        x === ELEMENT.ENEMY_HEAD_DEAD ||
                        x === ELEMENT.ENEMY_HEAD_SLEEP
                    ) {
                        return 1;
                    } else if (x === ELEMENT.STONE && mode === 'normal' && selfSize < EATING_STONE_SIZE + 1) {
                        return 1;
                    } else if (isSelf(x)) {
                        return 1;
                    } else {
                        return 0;
                    }
                }).join('');

                const boardClone = getBoardAsArray(filteredBoard).map(x => x.split('').map(Number));

                if (isEnemyHead(element)) {
                    const headDirection = ENEMY_HEAD_TO_DIRECTION[element];
                    [2, 3, 4].forEach(ahead => {
                        const currentHeadPos = multPositions(DIRECTION[headDirection], ahead);
                        const [nextMoveX, nextMoveY] = sumPositions([x, y], currentHeadPos);

                        if (boardClone[nextMoveY] && boardClone[nextMoveY][nextMoveX] === 0) {
                            var headPath = getPaths(boardClone, headPosition, nextMoveX, nextMoveY);

                            if (headPath && headPath.length > 1 && !isDeadEnd(board, x, y, headPath)) {

                                //headPath.shift();
                                const [nextX, nextY] = headPath[1];


                                directions.push({
                                    element: element,
                                    ahead: ahead,
                                    distance: headPath.length,
                                    command: getCoomandByCoord(headPosition.x, headPosition.y, nextX, nextY)
                                });
                            }
                        }
                    });
                }
                const path = getPaths(boardClone, headPosition, x, y);
                if (path && path.length > 1) {
                    // logger(`path length: ${path.length}`);
                    //path.shift();
                    const [nextX, nextY] = path[1];

                    if (findFloor || !isDeadEnd(board, x, y, path)) {
                        if (element === ELEMENT.FURY_PILL && path.length >= 6) {
                            const stones = getDirections(board, ({ x, y }), +Infinity, (el) => el === ELEMENT.STONE ? 1 : -1);

                            if ((stones && stones.length && stones[0].distance < 8)) {
                                //console.log('see firy pill');
                                directions.push({
                                    element: element,
                                    distance: path.length,
                                    command: getCoomandByCoord(headPosition.x, headPosition.y, nextX, nextY)
                                });
                            }
                        } else {
                            directions.push({
                                element: element,
                                distance: path.length,
                                command: getCoomandByCoord(headPosition.x, headPosition.y, nextX, nextY)
                            });
                        }
                    }

                    if (findFloor && directions.length) {
                        return directions;
                    }
                }
            }
        }
    }
    directions.sort((a, b) => a.distance - b.distance);

    return directions;
}

function getPaths(boardClone, headPosition, x, y) {
    const grid = new PF.Grid(boardClone);
    const finder = new PF.AStarFinder();
    var path = finder.findPath(headPosition.x, headPosition.y, x, y, grid);
    return path;
}

function isDeadEnd(board, x, y, path) {
    const arrayBoard = getBoardAsArray(board).map(x => x.split(''));
    path.forEach(([x, y]) => {
        arrayBoard[y][x] = ELEMENT.WALL;
    });
    arrayBoard[y][x] = 'X';
    const strBoard = arrayBoard.map(x => x.join('')).join('');

    var dir = getDirections(strBoard, { x, y }, +Infinity, (e) => e === ELEMENT.START_FLOOR, true)

    return dir.length === 0;
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

function rateElement(element) {
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
    } else if (isEnemy(element)) {
        return 2;
    } else if (element === ELEMENT.STONE) {
        return 3;
    } else if (isSelf(element)) {
        return -5;
    }

    return -10;
}
