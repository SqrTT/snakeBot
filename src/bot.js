
const { ELEMENT, COMMANDS, COMMANDS_LIST, DIRECTIONS_MAP, ENEMY_HEAD, ENEMY_TAIL, ENEMIES_HEAD_LIST } = require('./constants');
const {
    isGameOver, getHeadPosition, getBoardSize, getElementByXY, getBoardAsArray, findElementPos, sum, isEnemyHead, isEnemyBody, getAt, isSleep, isSelf, isEnemy, findElementsPos
} = require('./utils');
const { AlphaBetaMulti } = require('./minimax');

var { State, getValAt } = require('./state');
var PF = require('pathfinding');
const EATING_STONE_SIZE = 12;
let turnsCount = 0;


const X = 0,
    Y = 1;

/**
 * @type {string}
 */
var sessionID;
var pathMatrix;
/**
 * @type {State}
 */
var lastState;
/**
 *
 * @param {string} board
 * @param {(asg: any)=> void} logger
 */
function getNextSnakeMoveInner(board, logger, logState) {
    if (isGameOver(board)) {
        return '';
    }

    var currentState = State.getState(board, lastState);
    lastState = currentState;

    if (!currentState.player || currentState.player.isDead) {
        sessionID = '';
        turnsCount = 0;
        return '';
    } else {
        if (!sessionID) {
            sessionID = (new Date()).toISOString();
        }
        turnsCount++;
    }
    pathMatrix = '';

    function writeLog(el, nextStep) {
        var nextPos = nextStep;
        if (!nextPos) {
            nextPos = sum(DIRECTIONS_MAP[el.command], currentState.player.head.getPos())
        }
        var logObject = {
            pathMatrix: pathMatrix || [[]],
            tickNumber: turnsCount,
            board: board,
            snakeIsDead: false,
            possibleTargets: (directions && directions.map(dir => ({
                points: dir.distance,
                element: {
                    x: dir.pos[X],
                    y: dir.pos[Y]
                }
            }))) || [],
            selectedTarget: {
                x: el.pos[X],
                y: el.pos[Y]
            },
            nextPosition: {
                x: (nextStep && nextStep[X]) || nextPos[X],
                y: (nextStep && nextStep[Y]) || nextPos[Y]
            }
        }

        logState(sessionID, logObject);
    }


    logger(`turn: ${turnsCount} x:${currentState.player.head.pos[0]} y: ${currentState.player.head.pos[1]} evil: ${currentState.player.furyCount} fly: ${currentState.player.flyCount}`);


    var selfSize = currentState.player.elements.length;
    var maxEnemiesSize = 0;
    currentState.enemies.forEach(en => {
        if (maxEnemiesSize < en.elements.length) {
            maxEnemiesSize = en.elements.length;
        }
    });

    var isFullEnough = selfSize > maxEnemiesSize + 5;
    logger(`Size: ${selfSize} - ${maxEnemiesSize} - ${isFullEnough}`);


    var mode = 'normal';
    if (currentState.player.flyCount > 0) {
        mode = 'fly';
    } else if (currentState.player.furyCount > 0) {
        mode = 'evil';
    }
    var eatStones = mode === 'evil' || currentState.player.elements.length >= maxEnemiesSize + 10;


    var el;
    var ACT = mode === 'evil' ? 'ACT,' : '';
    var closestEnemy = currentState.getClosestEnemy()

    if ((closestEnemy.distance < ( 7)) && closestEnemy.enemy) {
        logger('> attack mode <\n ' + ` d: ${closestEnemy.distance.toFixed()} s: ${closestEnemy.enemy.elements.length}\n evil: ${closestEnemy.enemy.furyCount} fly: ${closestEnemy.enemy.flyCount}`);
        var enIdx = 0;

        currentState.enemies.some((en, idx) => {
            if (closestEnemy.enemy && en.isSelf(closestEnemy.enemy.head.pos)) {
                enIdx = idx;
                return true;
            } else {
                return false;
            }
        })
        // debugger;
        var res = AlphaBetaMulti(5, currentState, enIdx, ['NO', -Infinity], ['NO', Infinity], 0);
        logger(`Enemy size: ${currentState.enemies[enIdx].elements.length}`);
        logger(`Attack score: ${res[1]} - ${res[0]}`);
        if (res[0] !== 'NO') {
            writeLog(closestEnemy.enemy.head, sum(DIRECTIONS_MAP[res[0]], currentState.player.head.pos));
            return res[0];
        }
    } else if (!isFullEnough) {
        // harvest
        var result = State.harvestingMove(12, currentState, 0);
        if (result[0] !== 'NONE') {
            logger(`harvest score: ${result[1]} - ${result[0]}`);
            writeLog(currentState.player.head, sum(DIRECTIONS_MAP[result[0]], currentState.player.head.pos));
            return result[0];
        }
    }
    var directions = getDirections(board, currentState.player.head.pos, selfSize, rateElement, false, eatStones, mode);
    logger('path count: ' + JSON.stringify(directions.length));
    /// attack
    if (mode === 'evil' && (el = directions.find(x => x.element === ELEMENT.STONE && x.distance < currentState.player.furyCount))) {
        logger('fury stone (evil): ' + el.distance);
        writeLog(el)
        return ACT + el.command;
    } else if ((el = directions.find(x => x.element === ELEMENT.GOLD && x.distance === 1))) {
        logger('extra short gold: ' + el.distance);
        writeLog(el)
        return ACT + el.command;
    } else if ((el = directions.find(x => x.element === ELEMENT.APPLE && x.distance === 1))) {
        logger('extra short apple: ' + el.distance);
        writeLog(el)
        return ACT + el.command;
    } else if (selfSize >= maxEnemiesSize + 10 && (el = directions.find(x => x.element === ELEMENT.STONE && x.distance < 2))) {
        logger('short self cut stone: ' + el.distance);
        writeLog(el)
        return ACT + el.command;
    } else if ((el = directions.find(x => x.element === ELEMENT.FURY_PILL && x.distance < 15))) {
        logger('short fury: ' + el.distance);
        writeLog(el)
        return ACT + el.command;
    } else if ((el = directions.find(x => x.element === ELEMENT.GOLD && x.distance < 9))) {
        logger('short gold: ' + el.distance);
        writeLog(el)
        return ACT + el.command;
    } else if ((el = directions.find(x => !isFullEnough && x.element === ELEMENT.APPLE && x.distance < 10))) {
        logger('short apple: ' + el.distance);
        writeLog(el)
        return ACT + el.command;
    } else if (selfSize >= maxEnemiesSize + 10 && (el = directions.find(x => x.element === ELEMENT.STONE && x.distance < 8))) {
        logger('self cut stone: ' + el.distance);
        writeLog(el)
        return ACT + el.command;
    } else if ((el = directions.find(x => x.element === ELEMENT.FLYING_PILL && x.distance < 3))) {
        logger('short fly: ' + el.distance);
        writeLog(el)
        return ACT + el.command;
    } else {
        logger('find goods');
        var foodDir = {
            [COMMANDS.LEFT]: 0,
            [COMMANDS.RIGHT]: 0,
            [COMMANDS.DOWN]: 0,
            [COMMANDS.UP]: 0
        }

        directions.forEach(x => {
            if (x.element === ELEMENT.GOLD) {
                foodDir[x.command] += 8 / (x.distance * x.distance);
            } else if (!isFullEnough && x.element === ELEMENT.APPLE) {
                foodDir[x.command] += 5 / (x.distance * x.distance);
            } else if (x.element === ELEMENT.FURY_PILL) {
                foodDir[x.command] += 7 / (x.distance * x.distance);
            } else if (isEnemyHead(x.element)) {
                foodDir[x.command] += 2 + (currentState.player.elements.length - maxEnemiesSize ) / (x.distance * x.distance);
            }
        });
        logger(JSON.stringify(foodDir));

        var nextCommand = 'NONE';
        var nextWeight = 0;

        currentState.player.nextSteps.forEach(cmnd => {
            if (nextWeight < foodDir[cmnd]) {
                nextWeight = foodDir[cmnd];
                nextCommand = cmnd;
            }
        })
        if (nextWeight === 0) {
            logger('no goods, avoid walls');
            nextCommand = currentState.player.nextSteps[0] || COMMANDS.RIGHT;

        }

        var nextPos = sum(DIRECTIONS_MAP[nextCommand], currentState.player.head.getPos())
        var logObject = {
            pathMatrix: pathMatrix,
            tickNumber: turnsCount,
            board: board,
            snakeIsDead: false,
            possibleTargets: directions.map(dir => ({
                points: dir.distance,
                element: {
                    x: dir.pos[X],
                    y: dir.pos[Y]
                }
            })),
            selectedTarget: {
                x: 0,
                y: 0
            },
            nextPosition: {
                x: nextPos[X],
                y: nextPos[Y]
            }
        }

        logState(sessionID, logObject);
        //writeLog(el);
        return ACT + nextCommand;
    }
}


function getDirections(board, headPosition, selfSize, rateElement, findFloor = false, eatStones = true, mode = 'normal') {
    const directions = [];
    const boardSize = getBoardSize(board);

    const filteredBoard = board.split('').map(x => {
        if (
            x === ELEMENT.WALL ||
            x === ELEMENT.ENEMY_TAIL_INACTIVE ||
            x === ELEMENT.ENEMY_HEAD_DEAD ||
            (x === ELEMENT.START_FLOOR && !findFloor) ||
            x === ELEMENT.ENEMY_HEAD_SLEEP
        ) {
            return 1;
        } else if (x === ELEMENT.NONE) {
            return 0;
        } else if (isEnemyHead(x)) {
            return 0;
        } else if (isEnemy(x)) {
            if (mode === 'normal') {
                return 1;
            } else if (mode === 'evil') {
                if (ENEMY_TAIL.indexOf(x) > -1) {
                    return 1;
                } else {
                    return 0;
                }
            } else {
                return 0;
            }
        } else if (x === ELEMENT.STONE && mode === 'normal' && !eatStones) {
            return 1;
        } else if (isSelf(x)) {
            return 1;
        } else {
            return 0;
        }
    }).join('');

    const boardClone = getBoardAsArray(filteredBoard).map(x => x.split('').map(Number));

    if (!pathMatrix) {
        pathMatrix = boardClone;
    }

    for (let x = 0; x < boardSize; x++) {
        for (let y = 0; y < boardSize; y++) {
            var elementPos = [x, y];
            var element = getAt(board, x, y);

            if (rateElement(element, mode) > 0) {
                var path = getPaths(boardClone, headPosition, x, y);
                if (path && path.length > 1) {
                    // logger(`path length: ${path.length}`);
                    //path.shift();
                    var [nextX, nextY] = path[1];

                    if (findFloor || isEnemyHead(element) || !isDeadEnd(board, elementPos, path)) {
                        if (element === ELEMENT.FURY_PILL && path.length >= 7) {
                            var stones = getDirections(board, elementPos, +Infinity, (el) => el === ELEMENT.STONE ? 1 : -1);

                            if ((stones && stones.length && stones[0].distance < 8)) {
                                directions.push({
                                    pos: elementPos,
                                    element: element,
                                    distance: path.length - 1,
                                    command: getCommandByCoords(headPosition[X], headPosition[Y], nextX, nextY)
                                });
                            }
                        } else if (!findFloor && (element === ELEMENT.APPLE || element === ELEMENT.GOLD || element === ELEMENT.FURY_PILL)) {
                            var enemies = getDirections(board, elementPos, +Infinity, (el) => !el.ahead && ENEMY_HEAD.indexOf(el) > -1 ? 1 : -1, false, false, 'evil');

                            if (!enemies || !enemies.length || enemies[0].distance > 2) {
                                directions.push({
                                    pos: elementPos,
                                    element: element,
                                    distance: path.length - 1,
                                    command: getCommandByCoords(headPosition[X], headPosition[Y], nextX, nextY)
                                });
                            }
                        } else {
                            directions.push({
                                pos: elementPos,
                                element: element,
                                distance: path.length - 1,
                                command: getCommandByCoords(headPosition[X], headPosition[Y], nextX, nextY)
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
    var path = finder.findPath(headPosition[X], headPosition[Y], x, y, grid);
    return path;
}

function isDeadEnd(board, pos, path) {
    const arrayBoard = getBoardAsArray(board).map(x => x.split(''));
    path.forEach((posInner) => {
        arrayBoard[posInner[Y]][posInner[X]] = ELEMENT.WALL;
    });

    const strBoard = arrayBoard.map(x => x.join('')).join('');

    var dir = getDirections(strBoard, pos, +Infinity, (e) => e === ELEMENT.START_FLOOR, true)

    return dir.length === 0;
}
function getCommandByCoords(x, y, x2, y2) {
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
    } else if (isEnemyHead(element)) {
        return 2;
    } else if (element === ELEMENT.STONE) {
        return 3;
    } else if (isSelf(element)) {
        return -5;
    }

    return -10;
}


exports.getNextSnakeMove = function (board, logger, logState = () => { }) {
    var time = Date.now();
    const res = getNextSnakeMoveInner(board, logger, logState);
    logger('turn time: ' + (Date.now() - time));
    return res;
};
exports.resetState = () => { lastState = undefined }

