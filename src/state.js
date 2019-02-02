var { ELEMENT, COMMANDS, PLAYER_HEAD_LIST, PLAYER_BODY, DIRECTIONS_MAP, DIRECTIONS_RAW, PLAYER_TAIL, ENEMIES_HEAD_LIST, ENEMY_BODY, ENEMY_TAIL } = require("./constants");
var { getBoardAsArray, findElementPos, sum, findElementsPos } = require("./utils");

const X = 0,
    Y = 1;

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
        [ELEMENT.TAIL_INACTIVE]: -50,
        [ELEMENT.BODY_HORIZONTAL]: -50,
        [ELEMENT.BODY_VERTICAL]: -50,
        [ELEMENT.BODY_LEFT_DOWN]: -50,
        [ELEMENT.BODY_LEFT_UP]: -50,
        [ELEMENT.BODY_RIGHT_DOWN]: -50,
        [ELEMENT.BODY_RIGHT_UP]: -50,

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

        [ELEMENT.ENEMY_HEAD_DOWN]: 50,
        [ELEMENT.ENEMY_HEAD_LEFT]: 50,
        [ELEMENT.ENEMY_HEAD_RIGHT]: 50,
        [ELEMENT.ENEMY_HEAD_UP]: 50,
        [ELEMENT.ENEMY_HEAD_DEAD]: 50,
        [ELEMENT.ENEMY_HEAD_EVIL]: 50,
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

/**
 * @param {[[string]]} board
 * @param {[number, number]} x
 * @param {string} value
 * @returns {[[string]]}
 */
function setValAtMut(board, [x, y], value) {
    board[y][x] = value;
    return board;
}
/**
 * @param {[string[]]} board
 * @param {[number, number]} pos
 * @param {string} value
 * @returns {[string[]]}
 */
function setValAt(board, pos, value) {
    /**
     * @type {[string[]]}
     */
    var newArr = new Array(board.length);

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
 * @param {[number, number]} param0
 * @returns {string}
 */
function getValAt(board, [x, y]) {
    return (board[y] && board[y][x]) || ELEMENT.OTHER;
}
exports.getValAt = getValAt;


class Element {
    constructor(pos, type, owner) {
        /**
         * @type {number}
         */
        this.x = pos[X];
        /**
         * @type {number}
         */
        this.y = pos[Y];
        /**
         * @type {Snake}
         */
        this.owner = owner;
        /**
         * @type {string}
         */
        this.type = type;
    }
    /**
     * @returns {[number, number]}
     */
    getPos() {
        return [this.x, this.y];
    }
}

class Snake {
    constructor() {
        this.furyCount = 0;
        this.flyCount = 0;
        this.isDead = false;
        /**
         * @type {Element}
         */
        this.head = undefined;


        /**
         * @type {Element[]}
         */
        this.elements = [];
    }
    move(direction) {
        var nextPos = sum(DIRECTIONS_MAP[direction], this.head.getPos());
        var newSnake = new Snake();
        var newHead = new Element(nextPos, ELEMENT.HEAD_UP, newSnake);

        newSnake.head = newHead;

        var elementsLength = this.elements.length;
        for (var oldElementIdx = 1; oldElementIdx < elementsLength; oldElementIdx++) {
            var oldElement = this.elements[oldElementIdx];
            newSnake.elements.push(new Element(oldElement.getPos(), oldElement.type, newSnake));
        }
        newSnake.elements.push(newHead);

        if (this.furyCount > 0) {
            newSnake.furyCount = this.furyCount - 1;
        }
        if (this.flyCount > 0) {
            newSnake.flyCount = this.flyCount - 1;
        }
        return newSnake;

    }
    isNeck(pos) {
        var neck = this.elements[this.elements.length - 2];

        return !neck || neck.x === pos[X] && neck.y === pos[Y];
    }
    isSelf(pos) {
        for (var idx = this.elements.length - 1; idx >= 0; idx--) {
            if (this.elements[idx].x === pos[X] && this.elements[idx].y === pos[Y]) {
                return true;
            }
        }
        return false;
    }
}
class State {
    constructor() {
        this.boardMatrix = undefined;
        /**
         * @type Snake
         */
        this.player = undefined;
        /**
         * @type Snake[]
         */
        this.enemies = [];
        /**
         * @type Element[]
         */
        this.snakesElements = [];
    }
    step(playerAction, enemiesActions = []) {
        var scores = [];
        var newState = new State();

        // player score
        var nextPlayerPos = sum(DIRECTIONS_MAP[playerAction], this.player.head.getPos());

        var mode = 'NORMAL';
        if (this.player.furyCount > 0) {
            mode = 'EVIL';
        } else if (this.player.flyCount) {
            mode = 'FLY';
        }
        var elAtPos = getValAt(this.boardMatrix, nextPlayerPos);
        if (elAtPos !== ELEMENT.NONE) {
            scores.push([playerAction, EVALUATION_MAP[mode][elAtPos], elAtPos]);
        } else {// check other els
            var body = this.snakesElements.find(snakeEl => snakeEl.x === nextPlayerPos[0] && snakeEl.y === nextPlayerPos[1]);

            if (body) {
                scores.push([playerAction, EVALUATION_MAP[mode][body.type], body.type]);
            } else {
                scores.push([playerAction, EVALUATION_MAP[mode][elAtPos], elAtPos]);
            }
        }
        /// move player
        newState.player = this.player.move(playerAction);




        for (var enemyIDX = this.enemies.length - 1; enemyIDX >= 0; enemyIDX--) {
            var enemy = this.enemies[enemyIDX];
            var enemyAction = enemiesActions[enemyIDX];

            // player score
            var nextEnemyPos = sum(DIRECTIONS_MAP[enemyAction], enemy.head.getPos());

            var mode = 'NORMAL';
            if (enemy.furyCount > 0) {
                mode = 'EVIL';
            } else if (enemy.flyCount) {
                mode = 'FLY';
            }
            var elAtPos = getValAt(this.boardMatrix, nextEnemyPos);
            if (elAtPos !== ELEMENT.NONE) {
                scores.push([enemyAction, -EVALUATION_MAP[mode][elAtPos], elAtPos]);
            } else {// check other els
                var body = this.snakesElements.find(snakeEl => snakeEl.x === nextEnemyPos[0] && snakeEl.y === nextEnemyPos[1]);

                if (body) {
                    scores.push([enemyAction, -EVALUATION_MAP[mode][body.type], body.type]);
                } else {
                    scores.push([enemyAction, -EVALUATION_MAP[mode][elAtPos], elAtPos]);
                }
            }
            newState.enemies.push(enemy.move(enemyAction));
        }

        newState.boardMatrix = this.boardMatrix;

        return {
            scores,
            state: newState
        };
    }
    static getState(board, prevState = new State()) {
        var boardMatrix = getBoardAsArray(board).map(x => x.split(''));
        var state = new State();

        // player
        PLAYER_TAIL.some(tailType => {
            var pos = findElementPos(boardMatrix, tailType);
            if (pos) {
                var snake = new Snake();
                state.player = snake;

                var newEl = new Element(pos, tailType, snake);
                snake.elements.push(newEl);
                state.snakesElements.push(newEl);

                setValAtMut(boardMatrix, pos, ELEMENT.NONE);
                // find snake body
                var isEnd = 100;
                var currentPos = pos;
                do {
                    isEnd--;
                    for (var direction of DIRECTIONS_RAW) {
                        var next = sum(currentPos, direction);
                        var elAtPos = getValAt(boardMatrix, next)
                        if (PLAYER_BODY.indexOf(elAtPos) > -1) {
                            currentPos = next;
                            var newEl = new Element(currentPos, elAtPos, snake);
                            snake.elements.push(newEl);
                            state.snakesElements.push(newEl);

                            setValAtMut(boardMatrix, currentPos, ELEMENT.NONE);

                            // bodyPart
                        } else if (PLAYER_HEAD_LIST.indexOf(elAtPos) > -1) {
                            currentPos = next;
                            isEnd = 0;
                            // tail
                            currentPos = next;
                            var newEl = new Element(currentPos, elAtPos, snake);
                            snake.elements.push(newEl);
                            state.snakesElements.push(newEl);

                            setValAtMut(boardMatrix, pos, ELEMENT.NONE);

                            if (elAtPos === ELEMENT.HEAD_FLY) {
                                snake.flyCount = 1;
                            } else if (elAtPos === ELEMENT.HEAD_EVIL) {
                                snake.furyCount = 1;
                            } else if (elAtPos === ELEMENT.HEAD_SLEEP || elAtPos === ELEMENT.HEAD_DEAD) {
                                snake.isDead = true;
                            }
                            setValAtMut(boardMatrix, currentPos, ELEMENT.NONE);
                            break;
                        }
                    }

                } while (isEnd > 0);
                snake.head = snake.elements[snake.elements.length - 1];

                return true;
            }
        });

        // enemies
        ENEMY_TAIL.forEach(tailType => {
            var enemiesPos = findElementsPos(boardMatrix, tailType);

            for (var enemyPos of enemiesPos) {
                var snake = new Snake();
                state.enemies.push(snake)

                var newEl = new Element(enemyPos, tailType, snake);
                snake.elements.push(newEl);
                state.snakesElements.push(newEl);

                // find snake body
                var isEnd = 100;
                var currentPos = enemyPos;
                do {
                    isEnd--;
                    for (var direction of DIRECTIONS_RAW) {
                        var next = sum(currentPos, direction);
                        var elAtPos = getValAt(boardMatrix, next)
                        if (ENEMY_BODY.indexOf(elAtPos) > -1) {
                            currentPos = next;
                            var newEl = new Element(currentPos, elAtPos, snake);
                            snake.elements.push(newEl);
                            state.snakesElements.push(newEl);
                            setValAtMut(boardMatrix, currentPos, ELEMENT.NONE);

                            // bodyPart
                        } else if (ENEMIES_HEAD_LIST.indexOf(elAtPos) > -1) {
                            currentPos = next;
                            isEnd = 0;
                            // head
                            var newEl = new Element(currentPos, elAtPos, snake);
                            snake.elements.push(newEl);
                            state.snakesElements.push(newEl);

                            setValAtMut(boardMatrix, currentPos, ELEMENT.NONE);

                            if (elAtPos === ELEMENT.HEAD_FLY) {
                                snake.flyCount = 1;
                            } else if (elAtPos === ELEMENT.HEAD_EVIL) {
                                snake.furyCount = 1;
                            } else if (elAtPos === ELEMENT.HEAD_SLEEP || elAtPos === ELEMENT.HEAD_DEAD) {
                                snake.isDead = true;
                            }
                            break;
                        }
                    }

                } while (isEnd > 0);
                snake.head = snake.elements[snake.elements.length - 1];

            }
        });

        //debugger;
        state.boardMatrix = boardMatrix;
        return state;

    }
}
exports.State = State;
