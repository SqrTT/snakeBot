
const { ELEMENT, COMMANDS, COMMANDS_LIST, DIRECTIONS_MAP, ENEMY_HEAD, ENEMY_TAIL } = require('./constants');
const {
    isGameOver, getHeadPosition, getBoardSize, getElementByXY, getBoardAsArray, findElementPos, sum, isEnemyHead, isEnemyBody, getAt, isSleep, isSelf, isEnemy
} = require('./utils');
var { State, getValAt } = require('./state');
var PF = require('pathfinding');
const EATING_STONE_SIZE = 6;
let turnsCount = 0;
let stayOnTheWayCount = 0;
let evilCount = 0;
let flyCount = 0;

const ANSWER = 0,
    SCORE = 1,
    COMMENT = 2,
    X = 0,
    Y = 1,
    COMMANDS_LIST_LENGTH = COMMANDS_LIST.length - 1;


var minimaxCounter = 0

/**
 * @type {State}
 */
var lastState;
/**
 *
 * @param {string} board
 * @param {(asg: any)=> void} logger
 */
function getNextSnakeMoveInner(board, logger) {
    if (isGameOver(board)) {
        return '';
    }

    var currentState = State.getState(board, lastState);
    lastState = currentState;

    if (!currentState.player.isDead) {
        turnsCount = 0;
        return '';
    } else {
        turnsCount++;
    }

    if (evilCount > 0) {
        evilCount--;
    }
    if (flyCount > 0) {
        flyCount--;
    }

    logger(`turn: ${turnsCount} x:${currentState.player.head[0]} y: ${currentState.player.head.pos[1]} evil: ${evilCount} fly: ${flyCount}`);
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
    if (currentState.player.flyCount > 0) {
        mode = 'fly';
    } else if (currentState.player.furyCount > 0) {
        mode = 'evil';
    }
    const scareEnemyes = mode !== 'evil' || currentState.player.elements.length >= enemiesSize + 2;
    const directions = getDirections(board, currentState.player.head.pos, selfSize, rateElement, false, scareEnemyes, mode);
    logger('path count: ' + JSON.stringify(directions.length));

    var el;
    var ACT = mode === 'evil' ? 'ACT,' : '';

    /// attack
    // attack enemy head (evil)
    if (mode === 'evil' && (el = directions.find(x => x.ahead === 1 && isEnemyHead(x.element) && x.distance === 1))) {
        logger('attack enemy head (evil): ' + el.distance);
        return ACT + el.command;
    }

    // attack enemy head (normal)
    if (selfSize - 2 > enemiesSize && (el = directions.find(x => x.ahead === 1 && isEnemyHead(x.element) && x.distance === 1))) {
        logger('attack enemy head (normal): ' + el.distance);
        return ACT + el.command;
    }
    // cut body
    if (mode === 'evil' && (el = directions.find(x => (isEnemyBody(x.element) || isEnemyHead(x.element)) && x.distance < evilCount + 1))) {
        logger('attack enemy body:' + el.distance);
        console.log('attack enemy body/head: ' + el.distance);

        return ACT + el.command;
    }
    // stay on the way
    if (stayOnTheWayCount === 0 && (el = directions.find(x => x.ahead === 2 && isEnemyHead(x.element) && x.distance < 2))) {
        logger('stay on the way 2: ' + el.distance);
        console.log('stay on the way 2: ' + el.distance);

        stayOnTheWayCount++;
        return ACT + el.command;
    } else if (stayOnTheWayCount === 0 && (el = directions.find(x => x.ahead === 3 && isEnemyHead(x.element) && x.distance < 3))) {
        logger('stay on the way 3: ' + el.distance);
        console.log('stay on the way 3: ' + el.distance);

        stayOnTheWayCount++;
        return ACT + el.command;
    } else {
        stayOnTheWayCount = 0;
    }
    ///

    if (mode === 'evil' && (el = directions.find(x => x.element === ELEMENT.STONE && x.distance < evilCount + 1))) {
        logger('fury stone: ' + el.distance);
        return ACT + el.command;
    } else if ((el = directions.find(x => x.element === ELEMENT.APPLE && x.distance === 1))) {
        logger('extra short apple: ' + el.distance);
        return ACT + el.command;
    } else if (selfSize >= EATING_STONE_SIZE && (el = directions.find(x => x.element === ELEMENT.STONE && x.distance < 3))) {
        logger('short self cut stone: ' + el.distance);
        return ACT + el.command;
    } else if ((el = directions.find(x => x.element === ELEMENT.FURY_PILL && x.distance < 15))) {
        logger('short fury: ' + el.distance);
        if (el.distance === 1) {
            evilCount = 10;
        }
        return ACT + el.command;
    } else if ((el = directions.find(x => x.element === ELEMENT.GOLD && x.distance < 15))) {
        logger('short gold: ' + el.distance);
        return ACT + el.command;
    } else if ((el = directions.find(x => x.element === ELEMENT.APPLE && x.distance < 10))) {
        logger('short apple: ' + el.distance);
        return ACT + el.command;
    } else if (selfSize >= EATING_STONE_SIZE && (el = directions.find(x => x.element === ELEMENT.STONE && x.distance < 8))) {
        logger('self cut stone: ' + el.distance);
        return ACT + el.command;
    } else if ((el = directions.find(x => x.element === ELEMENT.FLYING_PILL && x.distance < 3))) {
        logger('short fly: ' + el.distance);
        if (el.distance === 1) {
            flyCount = 10;
        }
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
                foodDir[x.command] += 6 / (x.distance * x.distance);
            } else if (x.element === ELEMENT.APPLE) {
                foodDir[x.command] += 2 / (x.distance * x.distance);
            } else if (x.element === ELEMENT.FURY_PILL) {
                foodDir[x.command] += 4 / (x.distance * x.distance);
            } else if (isEnemyHead(x.element)) {
                foodDir[x.command] += 3 / (x.distance * x.distance);
            }
        });
        logger(JSON.stringify(foodDir));

        var nextCommand = 'NONE';
        var nextWeight = 0;

        Object.keys(foodDir).forEach(cmnd => {
            if (nextWeight < foodDir[cmnd]) {
                nextWeight = foodDir[cmnd];
                nextCommand = cmnd;
            }
        })
        if (nextWeight === 0) {
            logger('no goods, avoid walls');

            nextCommand = currentState.player.nextSteps[0] || 'ACT';

        }
        return ACT + nextCommand;
    }
}


function getDirections(board, headPosition, selfSize, rateElement, findFloor = false, countOnEnemyHeads = true, mode = 'normal', skipAhead = true) {
    const directions = [];
    const boardSize = getBoardSize(board);

    for (let x = 0; x < boardSize; x++) {
        for (let y = 0; y < boardSize; y++) {

            var element = getAt(board, x, y);

            if (rateElement(element, mode) > 0) {
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
                    } else if (x === ELEMENT.STONE && mode === 'normal' && selfSize < EATING_STONE_SIZE + 1) {
                        return 1;
                    } else if (isSelf(x)) {
                        return 1;
                    } else {
                        return 0;
                    }
                }).join('');

                const boardClone = getBoardAsArray(filteredBoard).map(x => x.split('').map(Number));

                if (element === ELEMENT.ENEMY_HEAD_EVIL || (countOnEnemyHeads && isEnemyHead(element))) {
                    boardClone[y + 1][x] = 1;
                    boardClone[y - 1][x] = 1;
                    boardClone[y][x + 1] = 1;
                    boardClone[y][x - 1] = 1;
                    //console.log('count');
                }

                // if (!findFloor && !skipAhead && isEnemyHead(element)) {
                //     const headDirection = ENEMY_HEAD_TO_DIRECTION[element];
                //     [1, 2, 3].forEach(ahead => {
                //         const currentHeadPos = multPositions(DIRECTION[headDirection], ahead);
                //         const [nextMoveX, nextMoveY] = sumPositions([x, y], currentHeadPos);

                //         if (boardClone[nextMoveY] && boardClone[nextMoveY][nextMoveX] === 0) {
                //             var headPath = getPaths(boardClone, headPosition, nextMoveX, nextMoveY);

                //             if (headPath && headPath.length > 1 && !isDeadEnd(board, x, y, headPath)) {

                //                 //headPath.shift();
                //                 const [nextX, nextY] = headPath[1];


                //                 directions.push({
                //                     element: element,
                //                     ahead: ahead,
                //                     distance: headPath.length - 1,
                //                     command: getCoomandByCoord(headPosition.x, headPosition.y, nextX, nextY)
                //                 });
                //             }
                //         }
                //     });
                // }
                const path = getPaths(boardClone, headPosition, x, y);
                if (path && path.length > 1) {
                    // logger(`path length: ${path.length}`);
                    //path.shift();
                    const [nextX, nextY] = path[1];

                    if (findFloor || !isDeadEnd(board, x, y, path)) {
                        if (element === ELEMENT.FURY_PILL && path.length >= 7) {
                            const stones = getDirections(board, ({ x, y }), +Infinity, (el) => el === ELEMENT.STONE ? 1 : -1);

                            if ((stones && stones.length && stones[0].distance < 8)) {
                                //console.log('see firy pill');
                                directions.push({
                                    element: element,
                                    distance: path.length - 1,
                                    command: getCoomandByCoord(headPosition[X], headPosition[Y], nextX, nextY)
                                });
                            }
                        } else if (!findFloor && (element === ELEMENT.APPLE || element === ELEMENT.GOLD || element === ELEMENT.FURY_PILL)) {
                            const enemies = getDirections(board, ({ x, y }), +Infinity, (el) => !el.ahead && ENEMY_HEAD.indexOf(el) > -1 ? 1 : -1, false, false, 'evil', true);

                            if (!enemies || !enemies.length || enemies[0].distance > 2) {
                                directions.push({
                                    element: element,
                                    distance: path.length - 1,
                                    command: getCoomandByCoord(headPosition[X], headPosition[Y], nextX, nextY)
                                });
                            }
                        } else {
                            directions.push({
                                element: element,
                                distance: path.length - 1,
                                command: getCoomandByCoord(headPosition[X], headPosition[Y], nextX, nextY)
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


exports.getNextSnakeMove = function (board, logger) {
    var time = Date.now();
    const res = getNextSnakeMoveInner(board, logger);
    logger('turn time: ' + (Date.now() - time));
    return res;
};

