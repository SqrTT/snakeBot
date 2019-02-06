var { ELEMENT, COMMANDS, COMMANDS_LIST, PLAYER_HEAD_LIST, PLAYER_BODY, DIRECTIONS_MAP, DIRECTIONS_RAW, PLAYER_TAIL, ENEMY_TAIL, ENEMIES_HEAD_LIST, ENEMY_BODY, ENEMY_TAIL } = require("./constants");
var { getBoardAsArray, findElementPos, sum, isEnemy, findElementsPos, getDirectionByPos, isSelf, isSamePos, isEnemyHead } = require("./utils");

const X = 0,
    Y = 1;


var ENEMY_EVALUATION_MAP = {
    NORMAL: {

        [ELEMENT.NONE]: 0,
        [ELEMENT.WALL]: -50,
        [ELEMENT.START_FLOOR]: -50,
        [ELEMENT.OTHER]: -50,

        [ELEMENT.APPLE]: 1,
        [ELEMENT.STONE]: 50,
        [ELEMENT.FLYING_PILL]: 0,
        [ELEMENT.FURY_PILL]: 0,
        [ELEMENT.GOLD]: 5,
        [ELEMENT.TAIL_END_DOWN]: 10,
        [ELEMENT.TAIL_END_LEFT]: 10,
        [ELEMENT.TAIL_END_UP]: 10,
        [ELEMENT.TAIL_END_RIGHT]: 10,
        [ELEMENT.TAIL_INACTIVE]: 50,
        [ELEMENT.BODY_HORIZONTAL]: 50,
        [ELEMENT.BODY_VERTICAL]: 50,
        [ELEMENT.BODY_LEFT_DOWN]: 50,
        [ELEMENT.BODY_LEFT_UP]: 50,
        [ELEMENT.BODY_RIGHT_DOWN]: 50,
        [ELEMENT.BODY_RIGHT_UP]: 50,
        // игрок
        [ELEMENT.HEAD_DOWN]: 50,
        [ELEMENT.HEAD_LEFT]: 50,
        [ELEMENT.HEAD_RIGHT]: 50,
        [ELEMENT.HEAD_UP]: 50,
        [ELEMENT.HEAD_DEAD]: 50,
        [ELEMENT.HEAD_EVIL]: 50,
        [ELEMENT.HEAD_FLY]: 0,
        [ELEMENT.HEAD_SLEEP]: 50,
        [ELEMENT.ENEMY_HEAD_DOWN]: 50,
        [ELEMENT.ENEMY_HEAD_LEFT]: 50,
        [ELEMENT.ENEMY_HEAD_RIGHT]: 50,
        [ELEMENT.ENEMY_HEAD_UP]: 50,
        [ELEMENT.ENEMY_HEAD_DEAD]: 50,
        [ELEMENT.ENEMY_HEAD_EVIL]: 50,
        [ELEMENT.ENEMY_HEAD_FLY]: 0,
        [ELEMENT.ENEMY_HEAD_SLEEP]: 50,
        [ELEMENT.ENEMY_TAIL_END_DOWN]: 50,
        [ELEMENT.ENEMY_TAIL_END_LEFT]: 50,
        [ELEMENT.ENEMY_TAIL_END_UP]: 50,
        [ELEMENT.ENEMY_TAIL_END_RIGHT]: 50,
        [ELEMENT.ENEMY_TAIL_INACTIVE]: 50,
        [ELEMENT.ENEMY_BODY_HORIZONTAL]: 50,
        [ELEMENT.ENEMY_BODY_VERTICAL]: 50,
        [ELEMENT.ENEMY_BODY_LEFT_DOWN]: 50,
        [ELEMENT.ENEMY_BODY_LEFT_UP]: 50,
        [ELEMENT.ENEMY_BODY_RIGHT_DOWN]: 50,
        [ELEMENT.ENEMY_BODY_RIGHT_UP]: 50
    },
    EVIL: {
        [ELEMENT.NONE]: 0,
        [ELEMENT.WALL]: -50,
        [ELEMENT.START_FLOOR]: -50,
        [ELEMENT.OTHER]: -50,

        [ELEMENT.APPLE]: 1,
        [ELEMENT.STONE]: 10,
        [ELEMENT.FLYING_PILL]: 1,
        [ELEMENT.FURY_PILL]: 1,
        [ELEMENT.GOLD]: 5,
        [ELEMENT.TAIL_END_DOWN]: -10,
        [ELEMENT.TAIL_END_LEFT]: -10,
        [ELEMENT.TAIL_END_UP]: -10,
        [ELEMENT.TAIL_END_RIGHT]: -10,
        [ELEMENT.TAIL_INACTIVE]: -50,
        [ELEMENT.BODY_HORIZONTAL]: -50,
        [ELEMENT.BODY_VERTICAL]: -50,
        [ELEMENT.BODY_LEFT_DOWN]: -50,
        [ELEMENT.BODY_LEFT_UP]: -50,
        [ELEMENT.BODY_RIGHT_DOWN]: -50,
        [ELEMENT.BODY_RIGHT_UP]: -50,
        // игрок
        [ELEMENT.HEAD_DOWN]: -50,
        [ELEMENT.HEAD_LEFT]: -50,
        [ELEMENT.HEAD_RIGHT]: -50,
        [ELEMENT.HEAD_UP]: -50,
        [ELEMENT.HEAD_DEAD]: -50,
        [ELEMENT.HEAD_EVIL]: -50,
        [ELEMENT.HEAD_FLY]: -50,
        [ELEMENT.HEAD_SLEEP]: -50,
        [ELEMENT.ENEMY_HEAD_DOWN]: 51,
        [ELEMENT.ENEMY_HEAD_LEFT]: 51,
        [ELEMENT.ENEMY_HEAD_RIGHT]: 51,
        [ELEMENT.ENEMY_HEAD_UP]: 51,
        [ELEMENT.ENEMY_HEAD_DEAD]: 51,
        [ELEMENT.ENEMY_HEAD_EVIL]: 51,
        [ELEMENT.ENEMY_HEAD_FLY]: 0,
        [ELEMENT.ENEMY_HEAD_SLEEP]: -50,
        [ELEMENT.ENEMY_TAIL_END_DOWN]: 10,
        [ELEMENT.ENEMY_TAIL_END_LEFT]: 10,
        [ELEMENT.ENEMY_TAIL_END_UP]: 10,
        [ELEMENT.ENEMY_TAIL_END_RIGHT]: 10,
        [ELEMENT.ENEMY_TAIL_INACTIVE]: 10,
        [ELEMENT.ENEMY_BODY_HORIZONTAL]: 30,
        [ELEMENT.ENEMY_BODY_VERTICAL]: 30,
        [ELEMENT.ENEMY_BODY_LEFT_DOWN]: 30,
        [ELEMENT.ENEMY_BODY_LEFT_UP]: 30,
        [ELEMENT.ENEMY_BODY_RIGHT_DOWN]: 30,
        [ELEMENT.ENEMY_BODY_RIGHT_UP]: 30
    },
    FLY: {
        [ELEMENT.NONE]: 0,
        [ELEMENT.WALL]: -50,
        [ELEMENT.START_FLOOR]: -50,
        [ELEMENT.OTHER]: -50,

        [ELEMENT.APPLE]: 1,
        [ELEMENT.STONE]: 0,
        [ELEMENT.FLYING_PILL]: 1,
        [ELEMENT.FURY_PILL]: 10,
        [ELEMENT.GOLD]: 5,
        [ELEMENT.TAIL_END_DOWN]: 0,
        [ELEMENT.TAIL_END_LEFT]: 0,
        [ELEMENT.TAIL_END_UP]: 0,
        [ELEMENT.TAIL_END_RIGHT]: 0,
        [ELEMENT.TAIL_INACTIVE]: 0,
        [ELEMENT.BODY_HORIZONTAL]: 0,
        [ELEMENT.BODY_VERTICAL]: 0,
        [ELEMENT.BODY_LEFT_DOWN]: 0,
        [ELEMENT.BODY_LEFT_UP]: 0,
        [ELEMENT.BODY_RIGHT_DOWN]: 0,
        [ELEMENT.BODY_RIGHT_UP]: 0,
        // игрок
        [ELEMENT.HEAD_DOWN]: 0,
        [ELEMENT.HEAD_LEFT]: 0,
        [ELEMENT.HEAD_RIGHT]: 0,
        [ELEMENT.HEAD_UP]: 0,
        [ELEMENT.HEAD_DEAD]: 0,
        [ELEMENT.HEAD_EVIL]: 0,
        [ELEMENT.HEAD_FLY]: 0,
        [ELEMENT.HEAD_SLEEP]: 0,
        [ELEMENT.ENEMY_HEAD_DOWN]: 0,
        [ELEMENT.ENEMY_HEAD_LEFT]: 0,
        [ELEMENT.ENEMY_HEAD_RIGHT]: 0,
        [ELEMENT.ENEMY_HEAD_UP]: 0,
        [ELEMENT.ENEMY_HEAD_DEAD]: -50,
        [ELEMENT.ENEMY_HEAD_EVIL]: 0,
        [ELEMENT.ENEMY_HEAD_FLY]: 0,
        [ELEMENT.ENEMY_HEAD_SLEEP]: -50,
        [ELEMENT.ENEMY_TAIL_END_DOWN]: 0,
        [ELEMENT.ENEMY_TAIL_END_LEFT]: 0,
        [ELEMENT.ENEMY_TAIL_END_UP]: 0,
        [ELEMENT.ENEMY_TAIL_END_RIGHT]: 0,
        [ELEMENT.ENEMY_TAIL_INACTIVE]: 0,
        [ELEMENT.ENEMY_BODY_HORIZONTAL]: 0,
        [ELEMENT.ENEMY_BODY_VERTICAL]: 0,
        [ELEMENT.ENEMY_BODY_LEFT_DOWN]: 0,
        [ELEMENT.ENEMY_BODY_LEFT_UP]: 0,
        [ELEMENT.ENEMY_BODY_RIGHT_DOWN]: 0,
        [ELEMENT.ENEMY_BODY_RIGHT_UP]: 0
    }
}

var EVALUATION_MAP = {
    NORMAL: {

        [ELEMENT.NONE]: 0,
        [ELEMENT.WALL]: -50,
        [ELEMENT.START_FLOOR]: -50,
        [ELEMENT.OTHER]: -50,

        [ELEMENT.APPLE]: 1,
        [ELEMENT.STONE]: -50,
        [ELEMENT.FLYING_PILL]: 1,
        [ELEMENT.FURY_PILL]: 10,
        [ELEMENT.GOLD]: 5,
        [ELEMENT.TAIL_END_DOWN]: -10,
        [ELEMENT.TAIL_END_LEFT]: -10,
        [ELEMENT.TAIL_END_UP]: -10,
        [ELEMENT.TAIL_END_RIGHT]: -10,
        [ELEMENT.TAIL_INACTIVE]: -10,
        [ELEMENT.BODY_HORIZONTAL]: -10,
        [ELEMENT.BODY_VERTICAL]: -10,
        [ELEMENT.BODY_LEFT_DOWN]: -10,
        [ELEMENT.BODY_LEFT_UP]: -10,
        [ELEMENT.BODY_RIGHT_DOWN]: -10,
        [ELEMENT.BODY_RIGHT_UP]: -10,
        // игрок
        [ELEMENT.HEAD_DOWN]: -50,
        [ELEMENT.HEAD_LEFT]: -50,
        [ELEMENT.HEAD_RIGHT]: -50,
        [ELEMENT.HEAD_UP]: -50,
        [ELEMENT.HEAD_DEAD]: -50,
        [ELEMENT.HEAD_EVIL]: -50,
        [ELEMENT.HEAD_FLY]: -50,
        [ELEMENT.HEAD_SLEEP]: -50,
        [ELEMENT.ENEMY_HEAD_DOWN]: -50,
        [ELEMENT.ENEMY_HEAD_LEFT]: -50,
        [ELEMENT.ENEMY_HEAD_RIGHT]: -50,
        [ELEMENT.ENEMY_HEAD_UP]: -50,
        [ELEMENT.ENEMY_HEAD_DEAD]: -50,
        [ELEMENT.ENEMY_HEAD_EVIL]: -50,
        [ELEMENT.ENEMY_HEAD_FLY]: 0,
        [ELEMENT.ENEMY_HEAD_SLEEP]: -50,
        [ELEMENT.ENEMY_TAIL_END_DOWN]: -50,
        [ELEMENT.ENEMY_TAIL_END_LEFT]: -50,
        [ELEMENT.ENEMY_TAIL_END_UP]: -50,
        [ELEMENT.ENEMY_TAIL_END_RIGHT]: -50,
        [ELEMENT.ENEMY_TAIL_INACTIVE]: -50,
        [ELEMENT.ENEMY_BODY_HORIZONTAL]: -50,
        [ELEMENT.ENEMY_BODY_VERTICAL]: -50,
        [ELEMENT.ENEMY_BODY_LEFT_DOWN]: -50,
        [ELEMENT.ENEMY_BODY_LEFT_UP]: -50,
        [ELEMENT.ENEMY_BODY_RIGHT_DOWN]: -50,
        [ELEMENT.ENEMY_BODY_RIGHT_UP]: -50
    },
    EVIL: {
        [ELEMENT.NONE]: 0,
        [ELEMENT.WALL]: -50,
        [ELEMENT.START_FLOOR]: -50,
        [ELEMENT.OTHER]: -50,

        [ELEMENT.APPLE]: 1,
        [ELEMENT.STONE]: 10,
        [ELEMENT.FLYING_PILL]: 1,
        [ELEMENT.FURY_PILL]: 1,
        [ELEMENT.GOLD]: 5,
        [ELEMENT.TAIL_END_DOWN]: -10,
        [ELEMENT.TAIL_END_LEFT]: -10,
        [ELEMENT.TAIL_END_UP]: -10,
        [ELEMENT.TAIL_END_RIGHT]: -10,
        [ELEMENT.TAIL_INACTIVE]: -50,
        [ELEMENT.BODY_HORIZONTAL]: -50,
        [ELEMENT.BODY_VERTICAL]: -50,
        [ELEMENT.BODY_LEFT_DOWN]: -50,
        [ELEMENT.BODY_LEFT_UP]: -50,
        [ELEMENT.BODY_RIGHT_DOWN]: -50,
        [ELEMENT.BODY_RIGHT_UP]: -50,
        // игрок
        [ELEMENT.HEAD_DOWN]: -50,
        [ELEMENT.HEAD_LEFT]: -50,
        [ELEMENT.HEAD_RIGHT]: -50,
        [ELEMENT.HEAD_UP]: -50,
        [ELEMENT.HEAD_DEAD]: -50,
        [ELEMENT.HEAD_EVIL]: -50,
        [ELEMENT.HEAD_FLY]: -50,
        [ELEMENT.HEAD_SLEEP]: -50,
        [ELEMENT.ENEMY_HEAD_DOWN]: 51,
        [ELEMENT.ENEMY_HEAD_LEFT]: 51,
        [ELEMENT.ENEMY_HEAD_RIGHT]: 51,
        [ELEMENT.ENEMY_HEAD_UP]: 51,
        [ELEMENT.ENEMY_HEAD_DEAD]: 51,
        [ELEMENT.ENEMY_HEAD_EVIL]: 51,
        [ELEMENT.ENEMY_HEAD_FLY]: 0,
        [ELEMENT.ENEMY_HEAD_SLEEP]: -50,
        [ELEMENT.ENEMY_TAIL_END_DOWN]: 10,
        [ELEMENT.ENEMY_TAIL_END_LEFT]: 10,
        [ELEMENT.ENEMY_TAIL_END_UP]: 10,
        [ELEMENT.ENEMY_TAIL_END_RIGHT]: 10,
        [ELEMENT.ENEMY_TAIL_INACTIVE]: 10,
        [ELEMENT.ENEMY_BODY_HORIZONTAL]: 30,
        [ELEMENT.ENEMY_BODY_VERTICAL]: 30,
        [ELEMENT.ENEMY_BODY_LEFT_DOWN]: 30,
        [ELEMENT.ENEMY_BODY_LEFT_UP]: 30,
        [ELEMENT.ENEMY_BODY_RIGHT_DOWN]: 30,
        [ELEMENT.ENEMY_BODY_RIGHT_UP]: 30
    },
    FLY: {
        [ELEMENT.NONE]: 0,
        [ELEMENT.WALL]: -50,
        [ELEMENT.START_FLOOR]: -50,
        [ELEMENT.OTHER]: -50,

        [ELEMENT.APPLE]: 1,
        [ELEMENT.STONE]: 0,
        [ELEMENT.FLYING_PILL]: 1,
        [ELEMENT.FURY_PILL]: 10,
        [ELEMENT.GOLD]: 5,
        [ELEMENT.TAIL_END_DOWN]: 0,
        [ELEMENT.TAIL_END_LEFT]: 0,
        [ELEMENT.TAIL_END_UP]: 0,
        [ELEMENT.TAIL_END_RIGHT]: 0,
        [ELEMENT.TAIL_INACTIVE]: 0,
        [ELEMENT.BODY_HORIZONTAL]: 0,
        [ELEMENT.BODY_VERTICAL]: 0,
        [ELEMENT.BODY_LEFT_DOWN]: 0,
        [ELEMENT.BODY_LEFT_UP]: 0,
        [ELEMENT.BODY_RIGHT_DOWN]: 0,
        [ELEMENT.BODY_RIGHT_UP]: 0,
        // игрок
        [ELEMENT.HEAD_DOWN]: 0,
        [ELEMENT.HEAD_LEFT]: 0,
        [ELEMENT.HEAD_RIGHT]: 0,
        [ELEMENT.HEAD_UP]: 0,
        [ELEMENT.HEAD_DEAD]: 0,
        [ELEMENT.HEAD_EVIL]: 0,
        [ELEMENT.HEAD_FLY]: 0,
        [ELEMENT.HEAD_SLEEP]: 0,
        [ELEMENT.ENEMY_HEAD_DOWN]: 0,
        [ELEMENT.ENEMY_HEAD_LEFT]: 0,
        [ELEMENT.ENEMY_HEAD_RIGHT]: 0,
        [ELEMENT.ENEMY_HEAD_UP]: 0,
        [ELEMENT.ENEMY_HEAD_DEAD]: -50,
        [ELEMENT.ENEMY_HEAD_EVIL]: 0,
        [ELEMENT.ENEMY_HEAD_FLY]: 0,
        [ELEMENT.ENEMY_HEAD_SLEEP]: -50,
        [ELEMENT.ENEMY_TAIL_END_DOWN]: 0,
        [ELEMENT.ENEMY_TAIL_END_LEFT]: 0,
        [ELEMENT.ENEMY_TAIL_END_UP]: 0,
        [ELEMENT.ENEMY_TAIL_END_RIGHT]: 0,
        [ELEMENT.ENEMY_TAIL_INACTIVE]: 0,
        [ELEMENT.ENEMY_BODY_HORIZONTAL]: 0,
        [ELEMENT.ENEMY_BODY_VERTICAL]: 0,
        [ELEMENT.ENEMY_BODY_LEFT_DOWN]: 0,
        [ELEMENT.ENEMY_BODY_LEFT_UP]: 0,
        [ELEMENT.ENEMY_BODY_RIGHT_DOWN]: 0,
        [ELEMENT.ENEMY_BODY_RIGHT_UP]: 0
    }
}
var OPPOSITE_MAP = {
    [COMMANDS.DOWN]: COMMANDS.UP,
    [COMMANDS.UP]: COMMANDS.DOWN,
    [COMMANDS.RIGHT]: COMMANDS.LEFT,
    [COMMANDS.LEFT]: COMMANDS.RIGHT
}

var PLAYER_BODY_MATRIX = {
    [COMMANDS.DOWN + ELEMENT.BODY_LEFT_DOWN]: COMMANDS.LEFT,
    [COMMANDS.LEFT + ELEMENT.BODY_LEFT_DOWN]: COMMANDS.DOWN,

    [COMMANDS.UP + ELEMENT.BODY_LEFT_UP]: COMMANDS.LEFT,
    [COMMANDS.LEFT + ELEMENT.BODY_LEFT_UP]: COMMANDS.UP,

    [COMMANDS.DOWN + ELEMENT.BODY_RIGHT_DOWN]: COMMANDS.RIGHT,
    [COMMANDS.RIGHT + ELEMENT.BODY_RIGHT_DOWN]: COMMANDS.DOWN,

    [COMMANDS.UP + ELEMENT.BODY_RIGHT_UP]: COMMANDS.RIGHT,
    [COMMANDS.RIGHT + ELEMENT.BODY_RIGHT_UP]: COMMANDS.UP,

    [COMMANDS.UP + ELEMENT.BODY_VERTICAL]: COMMANDS.DOWN,
    [COMMANDS.DOWN + ELEMENT.BODY_VERTICAL]: COMMANDS.UP,

    [COMMANDS.LEFT + ELEMENT.BODY_HORIZONTAL]: COMMANDS.RIGHT,
    [COMMANDS.RIGHT + ELEMENT.BODY_HORIZONTAL]: COMMANDS.LEFT,
}

var ENEMY_BODY_MATRIX = {
    [COMMANDS.DOWN + ELEMENT.ENEMY_BODY_LEFT_DOWN]: COMMANDS.LEFT,
    [COMMANDS.LEFT + ELEMENT.ENEMY_BODY_LEFT_DOWN]: COMMANDS.DOWN,

    [COMMANDS.UP + ELEMENT.ENEMY_BODY_LEFT_UP]: COMMANDS.LEFT,
    [COMMANDS.LEFT + ELEMENT.ENEMY_BODY_LEFT_UP]: COMMANDS.UP,

    [COMMANDS.DOWN + ELEMENT.ENEMY_BODY_RIGHT_DOWN]: COMMANDS.RIGHT,
    [COMMANDS.RIGHT + ELEMENT.ENEMY_BODY_RIGHT_DOWN]: COMMANDS.DOWN,

    [COMMANDS.UP + ELEMENT.ENEMY_BODY_RIGHT_UP]: COMMANDS.RIGHT,
    [COMMANDS.RIGHT + ELEMENT.ENEMY_BODY_RIGHT_UP]: COMMANDS.UP,

    [COMMANDS.UP + ELEMENT.ENEMY_BODY_VERTICAL]: COMMANDS.DOWN,
    [COMMANDS.DOWN + ELEMENT.ENEMY_BODY_VERTICAL]: COMMANDS.UP,

    [COMMANDS.LEFT + ELEMENT.ENEMY_BODY_HORIZONTAL]: COMMANDS.RIGHT,
    [COMMANDS.RIGHT + ELEMENT.ENEMY_BODY_HORIZONTAL]: COMMANDS.LEFT,
}
const scoreForOneElement = 10;
/**
 * @param {string[][]} board
 * @param {[number, number]} pos
 * @param {string} value
 */

function setValAtMut(board, pos, value) {
    board[pos[Y]][pos[X]] = value;
    return board;
}
/**
 * @param {string[][]} board
 * @param {[number, number]} pos
 * @param {string} value
 * @returns {string[][]}
 */
function setValAt(board, pos, value) {
    /**
     * @type {string[][]}
     */
    var newArr = [];
    newArr.length = board.length;

    for (var y = board.length - 1; y >= 0; y--) {
        if (y === pos[Y]) {
            var newRow = new Array(...board[y]);
            newRow[pos[X]] = value;
            newArr[y] = newRow;
        } else {
            newArr[y] = board[y];
        }
    }

    return newArr;
}

/**
 *
 * @param {*} board
 * @param {[number, number]} pos
 * @returns {string}
 */
function getValAt(board, pos) {
    if (pos[X] >= 0 && pos[Y] >= 0 && pos[X] < board.length && pos[Y] < board.length) {
        return board[pos[Y]][pos[X]];
    } else {
        return ELEMENT.OTHER;
    }
}
exports.getValAt = getValAt;


class Element {
    constructor(pos, type, owner) {
        /**
         * @type {[number, number]}
         */
        this.pos = pos;
        /**
         * @type {Snake}
         */
        this.owner = owner;
        /**
         * @type {string}
         */
        this.type = type;
    }
    getX() {
        return this.pos[X];
    }
    getY() {
        return this.pos[Y];
    }
    /**
     * @returns {[number, number]}
     */
    getPos() {
        return this.pos;
    }
}

class Snake {
    constructor(head) {
        this.furyCount = 0;
        this.flyCount = 0;
        this.isDead = false;
        /**
         * @type {string[]}
         */
        this.nextSteps = [];
        /**
         * @type {Element}
         */
        this.head = head;

        /**
         * @type {Element[]}
         */
        this.elements = [];
    }
    move(direction, boardMatrix) {
        var nextPos = sum(DIRECTIONS_MAP[direction], this.head.getPos());
        var newSnake = new Snake();


        var newHead = new Element(nextPos, this.head.type, newSnake);

        newSnake.head = newHead;

        var elementsLength = this.elements.length;
        for (var oldElementIdx = 1; oldElementIdx < elementsLength; oldElementIdx++) {
            var oldElement = this.elements[oldElementIdx];
            newSnake.elements.push(new Element(oldElement.getPos(), this.elements[oldElementIdx - 1].type, newSnake));
        }
        newSnake.elements.push(newHead);

        if (this.furyCount > 0) {
            newSnake.furyCount = this.furyCount - 1;
        }
        if (this.flyCount > 0) {
            newSnake.flyCount = this.flyCount - 1;
        }
        for (var dirs = COMMANDS_LIST.length - 1; dirs >= 0; --dirs) {
            var nextPos = sum(newSnake.head.pos, DIRECTIONS_MAP[COMMANDS_LIST[dirs]]);
            var elAtPos = getValAt(boardMatrix, nextPos);

            if (elAtPos !== ELEMENT.WALL && !newSnake.isNeck(nextPos)) {
                newSnake.nextSteps.push(COMMANDS_LIST[dirs]);
            }
        }
        return newSnake;

    }
    isNeck(pos) {
        var neck = this.elements[this.elements.length - 2];

        return !neck || neck.pos[X] === pos[X] && neck.pos[Y] === pos[Y];
    }
    isSelf(pos) {
        for (var idx = this.elements.length - 1; idx >= 0; idx--) {
            if (isSamePos(this.elements[idx].pos, pos)) {
                return true;
            }
        }
        return false;
    }
}
exports.Snake = Snake;
class State {
    constructor(player) {
        this.boardMatrix = undefined;
        /**
         * @type Snake
         */
        this.player = player;
        /**
         * @type Snake[]
         */
        this.enemies = [];
    }
    getClosestEnemy() {
        var distance = Infinity;
        /**
         * @type {Snake|undefined}
         */
        var enemy;
        //Math.hypot(x2-x1, y2-y1)
        this.enemies.forEach(x => {
            var calc = Math.hypot(this.player.head.pos[X] - x.head.pos[X], this.player.head.pos[Y] - x.head.pos[Y])
            if (calc < distance) {
                enemy = x;
                distance = calc;
            }
        });
        return {
            enemy,
            distance
        };

    }
    toString() {
        var board = this.boardMatrix;
        this.getSnakesElements().forEach((el) => {
            board = setValAt(board, el.pos, el.type);
        });
        return board.map(row => row.join('')).join('\n');
    }
    getSnakesElements() {
        var elements = [...this.player.elements];
        var enemiesLength = this.enemies.length;
        for (var enemyIDX = 0; enemyIDX < enemiesLength; enemyIDX++) {
            var enemyIn = this.enemies[enemyIDX];
            elements.push(...enemyIn.elements);
        }
        return elements;
    }
    /**
     *
     * @param {State} newState
     */
    evaluatePlayer(newState) {
        var playerScore = -Infinity;
        var mode = 'NORMAL';
        if (this.player.furyCount > 0) {
            mode = 'EVIL';
        } else if (this.player.flyCount) {
            mode = 'FLY';
        }
        var elAtPos = getValAt(newState.boardMatrix, newState.player.head.pos);
        if (elAtPos === ELEMENT.NONE) {
            var snakesElements = newState.getSnakesElements();
            for (var snakeElIds = snakesElements.length - 1; snakeElIds >= 0; --snakeElIds) {
                var snakeEl = snakesElements[snakeElIds];

                if (isSamePos(snakeEl.pos, newState.player.head.pos) && newState.player !== snakeEl.owner) {
                    if (isEnemyHead(snakeEl.type) || (isEnemy(snakeEl.type) && snakeEl.owner.isNeck(snakeEl.pos))) {
                        if (newState.player.furyCount > 0) {
                            playerScore = scoreForOneElement * snakeEl.owner.elements.length;
                        } else if (newState.player.flyCount) {
                            playerScore = 0;
                        } else {
                            if (snakeEl.owner.elements.length + 2 <= newState.player.elements.length) {
                                playerScore = scoreForOneElement * snakeEl.owner.elements.length;
                            } else {
                                playerScore = -50;
                            }
                        }
                    } else {
                        playerScore = EVALUATION_MAP[mode][snakeEl.type];
                    }

                    break;
                }
            }
            if (snakeElIds === -1) {
                playerScore = EVALUATION_MAP[mode][elAtPos];;
            }
        } else if (elAtPos === ELEMENT.FLYING_PILL) {
            newState.player.flyCount += 10;
            playerScore = EVALUATION_MAP[mode][elAtPos];
            newState.boardMatrix = setValAt(newState.boardMatrix, newState.player.head.pos, ELEMENT.NONE);
        } else if (elAtPos === ELEMENT.FURY_PILL) {
            newState.player.furyCount += 10;
            playerScore = EVALUATION_MAP[mode][elAtPos];
            newState.boardMatrix = setValAt(newState.boardMatrix, newState.player.head.pos, ELEMENT.NONE);
        } else {// check other els
            playerScore = EVALUATION_MAP[mode][elAtPos];
            newState.boardMatrix = setValAt(newState.boardMatrix, newState.player.head.pos, ELEMENT.NONE);
        }
        return playerScore;
    }
    /**
     *
     * @param {Snake} enemy
     * @param {State} newState
     */
    evaluateEnemy(enemy, newState) {
        var mode = 'NORMAL';
        var enemyScore = Infinity;
        if (enemy.furyCount > 0) {
            mode = 'EVIL';
        } else if (enemy.flyCount) {
            mode = 'FLY';
        }
        var elAtPos = getValAt(this.boardMatrix, enemy.head.pos);
        if (elAtPos === ELEMENT.NONE) {
            var snakesElements = newState.getSnakesElements();
            for (var snakeElIds = snakesElements.length - 1; snakeElIds >= 0; --snakeElIds) {
                var snakeEl = snakesElements[snakeElIds];

                if (
                    isSamePos(snakeEl.pos, enemy.head.pos) && enemy !== snakeEl.owner ||
                    PLAYER_BODY.indexOf(snakeEl.type) > -1 && snakeEl.owner.isNeck(snakeEl.pos)
                ) {
                    if (PLAYER_HEAD_LIST.indexOf(snakeEl.type) > -1) {
                        if (enemy.furyCount > 0) {
                            enemyScore = -scoreForOneElement * snakeEl.owner.elements.length;
                        } else if (enemy.flyCount) {
                            enemyScore = 0;
                        } else {
                            if (snakeEl.owner.elements.length + 2 <= enemy.elements.length) {
                                enemyScore = -scoreForOneElement * snakeEl.owner.elements.length;
                            } else {
                                enemyScore = 50;
                            }
                        }
                    } else {
                        enemyScore = -ENEMY_EVALUATION_MAP[mode][snakeEl.type];
                    }

                    break;
                }
            }
            if (snakeElIds === -1) {
                enemyScore = -EVALUATION_MAP[mode][elAtPos];
            }
        } else if (elAtPos === ELEMENT.FLYING_PILL) {
            enemy.flyCount += 10;
            enemyScore = -EVALUATION_MAP[mode][elAtPos];
            newState.boardMatrix = setValAt(newState.boardMatrix, enemy.head.pos, ELEMENT.NONE);
        } else if (elAtPos === ELEMENT.FURY_PILL) {
            enemy.furyCount += 10;
            enemyScore = -EVALUATION_MAP[mode][elAtPos];
            newState.boardMatrix = setValAt(newState.boardMatrix, enemy.head.pos, ELEMENT.NONE);
        } else {// check other els
            enemyScore = -EVALUATION_MAP[mode][elAtPos];
            newState.boardMatrix = setValAt(newState.boardMatrix, enemy.head.pos, ELEMENT.NONE);
        }
        return enemyScore;
    }
    playerStep(playerAction) {
        var newState = new State();
        /// move player
        newState.player = this.player.move(playerAction, this.boardMatrix);
        newState.enemies = this.enemies;
        newState.boardMatrix = this.boardMatrix;


        return {
            playerScore: this.evaluatePlayer(newState),
            newState
        }
    }
    enemyStep(action, enemyID) {
        /**
         * @type {number}
         */
        var enemyScore = -Infinity;
        var newState = new State();

        newState.player = this.player;
        var enemiesLength = this.enemies.length;
        newState.enemies.length = enemiesLength;
        for (var enemyIDX = 0; enemyIDX < enemiesLength; enemyIDX++) {
            var enemyIn = this.enemies[enemyIDX];

            if (action && enemyIDX === enemyID) {
                newState.enemies[enemyIDX] = enemyIn.move(action, this.boardMatrix);
            } else {
                newState.enemies[enemyIDX] = this.enemies[enemyIDX];
            }
        }
        newState.boardMatrix = this.boardMatrix;

        newState.enemies.length = enemiesLength;
        for (var enemyIDX = 0; enemyIDX < enemiesLength; enemyIDX++) {
            var enemy = newState.enemies[enemyIDX];
            if (enemyID !== enemyIDX) {
                continue;
            }
            enemyScore = this.evaluateEnemy(enemy, newState);
            break;
        }

        return {
            enemiesScore: enemyScore,
            newState
        };
    }
    /**
     *
     * @param {string} playerAction
     * @param {string} action
     */
    step(playerAction, action, enemyID) {
        /**
         * @type {number}
         */
        var enemiesScore = -Infinity;
        var newState = new State();
        /**
         * @type {number}
         */
        var playerScore = -Infinity;

        /// move player
        newState.player = this.player.move(playerAction, this.boardMatrix);
        var enemiesLength = this.enemies.length;
        newState.enemies.length = enemiesLength;
        for (var enemyIDX = 0; enemyIDX < enemiesLength; enemyIDX++) {
            var enemyIn = this.enemies[enemyIDX];

            if (action && enemyIDX === enemyID) {
                newState.enemies[enemyIDX] = enemyIn.move(action, this.boardMatrix);
            } else {
                newState.enemies[enemyIDX] = this.enemies[enemyIDX];
            }
        }
        newState.boardMatrix = this.boardMatrix;
        playerScore = this.evaluatePlayer(newState);

        newState.enemies.length = enemiesLength;
        for (var enemyIDX = 0; enemyIDX < enemiesLength; enemyIDX++) {
            var enemy = newState.enemies[enemyIDX];
            if (enemyID !== enemyIDX) {
                continue;
            }
            enemiesScore = this.evaluateEnemy(enemy, newState);
            break;
        }

        return {
            playerScore,
            enemiesScore,
            state: newState
        };
    }
    /**
     *
     * @param {[number, number]} headPos
     * @param {string[][]} boardMatrix
     */
    static getPlayerSnakePos(headPos, boardMatrix) {
        var snakeElements = [{ pos: headPos, type: getValAt(boardMatrix, headPos) }];
        setValAtMut(boardMatrix, headPos, ELEMENT.NONE);

        //neck
        for (var dir = COMMANDS_LIST.length - 1; dir >= 0; --dir) {
            var currentDir = COMMANDS_LIST[dir];
            var nextPos = sum(headPos, DIRECTIONS_MAP[currentDir]);
            var currentElAtPos = getValAt(boardMatrix, nextPos);
            var done = false;
            if (PLAYER_TAIL.indexOf(currentElAtPos) > -1) {
                snakeElements.push({
                    pos: nextPos,
                    type: currentElAtPos
                });
                setValAtMut(boardMatrix, nextPos, ELEMENT.NONE);
                break;
            }
            // other body parts

            while (isSelf(currentElAtPos) && PLAYER_BODY_MATRIX[OPPOSITE_MAP[currentDir] + currentElAtPos]) {
                snakeElements.push({
                    pos: nextPos,
                    type: currentElAtPos
                });
                setValAtMut(boardMatrix, nextPos, ELEMENT.NONE);

                var prevDir = currentDir;
                currentDir = PLAYER_BODY_MATRIX[OPPOSITE_MAP[currentDir] + currentElAtPos];
                nextPos = sum(nextPos, DIRECTIONS_MAP[currentDir]);
                currentElAtPos = getValAt(boardMatrix, nextPos);

                if (PLAYER_TAIL.indexOf(currentElAtPos) > -1) {
                    snakeElements.push({
                        pos: nextPos,
                        type: currentElAtPos
                    });
                    setValAtMut(boardMatrix, nextPos, ELEMENT.NONE);
                    done = true;
                    break;
                } else if (!isSelf(currentElAtPos)) {
                    done = true;
                    break;
                }
            }
            if (done) {
                break;
            }
        }
        return snakeElements.reverse();
    }
    /**
     *
     * @param {[number, number]} headPos
     * @param {string[][]} boardMatrix
     */
    static getEnemySnakePos(headPos, boardMatrix) {
        var snakeElements = [{ pos: headPos, type: getValAt(boardMatrix, headPos) }];
        setValAtMut(boardMatrix, headPos, ELEMENT.NONE);

        //neck
        for (var dir = COMMANDS_LIST.length - 1; dir >= 0; --dir) {
            var currentDir = COMMANDS_LIST[dir];
            var nextPos = sum(headPos, DIRECTIONS_MAP[currentDir]);
            var currentElAtPos = getValAt(boardMatrix, nextPos);
            var done = false;
            // other body parts
            if (ENEMY_TAIL.indexOf(currentElAtPos) > -1) {
                snakeElements.push({
                    pos: nextPos,
                    type: currentElAtPos
                });
                setValAtMut(boardMatrix, nextPos, ELEMENT.NONE);
                break;
            }
            while (isEnemy(currentElAtPos) && ENEMY_BODY_MATRIX[OPPOSITE_MAP[currentDir] + currentElAtPos]) {
                snakeElements.push({
                    pos: nextPos,
                    type: currentElAtPos
                });
                setValAtMut(boardMatrix, nextPos, ELEMENT.NONE);

                var prevDir = currentDir;
                currentDir = ENEMY_BODY_MATRIX[OPPOSITE_MAP[currentDir] + currentElAtPos];
                nextPos = sum(nextPos, DIRECTIONS_MAP[currentDir]);
                currentElAtPos = getValAt(boardMatrix, nextPos);

                if (ENEMY_TAIL.indexOf(currentElAtPos) > -1) {
                    snakeElements.push({
                        pos: nextPos,
                        type: currentElAtPos
                    });
                    setValAtMut(boardMatrix, nextPos, ELEMENT.NONE);
                    done = true;
                    break;
                } else if (!isEnemy(currentElAtPos)) {
                    done = true;
                    break;
                }
            }
            if (done) {
                break;
            }
        }
        return snakeElements.reverse();
    }
    static getState(board, prevState = new State()) {
        var boardMatrix = getBoardAsArray(board).map(x => x.split(''));
        var state = new State();

        // player
        PLAYER_HEAD_LIST.some(headType => {
            var pos = findElementPos(boardMatrix, headType);
            if (pos) {
                var snake = new Snake();
                state.player = snake;

                State.getPlayerSnakePos(pos, boardMatrix).forEach(elPos => {
                    var newEl = new Element(elPos.pos, elPos.type, snake);
                    snake.elements.push(newEl);
                });
                snake.head = snake.elements[snake.elements.length - 1];

                if (prevState.boardMatrix) {
                    var prevEl = getValAt(prevState.boardMatrix, snake.head.pos);

                    if (prevEl === ELEMENT.FLYING_PILL) {
                        snake.flyCount = 10;
                    } else if (prevEl === ELEMENT.FURY_PILL) {
                        snake.furyCount = 10;
                    }
                } else {
                    if (snake.head.type === ELEMENT.HEAD_FLY) {
                        snake.flyCount = 2;
                    } else if (snake.head.type === ELEMENT.HEAD_EVIL) {
                        snake.furyCount = 2;
                    }
                }
                if (prevState.player) {
                    if (prevState.player.flyCount > 0) {
                        snake.flyCount = prevState.player.flyCount;
                    }
                    if (prevState.player.furyCount > 0) {
                        snake.furyCount = prevState.player.furyCount;
                    }
                }
                if (snake.head.type === ELEMENT.HEAD_SLEEP || snake.head.type === ELEMENT.HEAD_DEAD) {
                    snake.isDead = true;
                }
                if (snake.flyCount > 0) {
                    snake.flyCount--;
                }
                if (snake.furyCount > 0) {
                    snake.furyCount--;
                }

                for (var dirs = COMMANDS_LIST.length - 1; dirs >= 0; --dirs) {
                    var nextPos = sum(snake.head.pos, DIRECTIONS_MAP[COMMANDS_LIST[dirs]]);
                    var elAtPos = getValAt(boardMatrix, nextPos);

                    if (elAtPos !== ELEMENT.WALL && elAtPos !== ELEMENT.START_FLOOR && !snake.isNeck(nextPos)) {
                        snake.nextSteps.push(COMMANDS_LIST[dirs]);
                    }
                }

                return true;
            } else {
                return false;
            }
        });

        // enemies
        ENEMIES_HEAD_LIST.forEach(tailType => {
            var enemiesPos = findElementsPos(boardMatrix, tailType);

            for (var enemyPos of enemiesPos) {
                var snake = new Snake();
                state.enemies.push(snake)

                State.getEnemySnakePos(enemyPos, boardMatrix).forEach(elPos => {
                    var newEl = new Element(elPos.pos, elPos.type, snake);
                    snake.elements.push(newEl);
                });
                snake.head = snake.elements[snake.elements.length - 1];

                if (prevState.boardMatrix) {
                    var prevEl = getValAt(prevState.boardMatrix, snake.head.pos);

                    if (prevEl === ELEMENT.FLYING_PILL) {
                        snake.flyCount += 11;
                    } else if (prevEl === ELEMENT.FURY_PILL) {
                        snake.furyCount += 11;
                    }
                } else {
                    if (snake.head.type === ELEMENT.ENEMY_HEAD_FLY) {
                        snake.flyCount = 2;
                    } else if (snake.head.type === ELEMENT.ENEMY_HEAD_EVIL) {
                        snake.furyCount = 2;
                    }
                }
                if (snake.head.type === ELEMENT.ENEMY_HEAD_SLEEP || snake.head.type === ELEMENT.ENEMY_HEAD_DEAD) {
                    snake.isDead = true;
                }
                if (snake.flyCount > 0) {
                    snake.flyCount--;
                }
                if (snake.furyCount > 0) {
                    snake.furyCount--;
                }

                for (var dirs = COMMANDS_LIST.length - 1; dirs >= 0; --dirs) {
                    var nextPos = sum(snake.head.pos, DIRECTIONS_MAP[COMMANDS_LIST[dirs]]);
                    var elAtPos = getValAt(boardMatrix, nextPos);

                    if (elAtPos !== ELEMENT.WALL && elAtPos !== ELEMENT.START_FLOOR && !snake.isNeck(nextPos)) {
                        snake.nextSteps.push(COMMANDS_LIST[dirs]);
                    }
                }
            }
        });

        //debugger;
        state.boardMatrix = boardMatrix;
        return state;
    }
}
exports.State = State;
