const { ELEMENT, COMMANDS, PLAYER_HEAD_LIST, PLAYER_BODY, DIRECTIONS_MAP, DIRECTIONS_RAW, PLAYER_TAIL, ENEMIES_HEAD_LIST, ENEMY_BODY, ENEMY_TAIL } = require("./constants");
const { getBoardAsArray, findElementPos, sum, findElementsPos } = require("./utils") ;


const EVALUATION_MAP = {
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
 * @param {[[string]]} board
 * @param {[number, number]} x
 * @param {string} value
 * @returns {[[string]]}
 */
function setValAt(board, [x, y], value) {
    const newArr = Array(board.length);
    board.forEach((row, by) => {
        if (y === by) {
            const newRow = Array(...row);
            newRow[x] = value;
            newArr[y] = newRow;
        } else {
            newArr[by] = row;
        }
    });
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
    constructor([x, y], type, owner) {
        /**
         * @type {number}
         */
        this.x = x;
        /**
         * @type {number}
         */
        this.y = y;
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
        const nextPos = sum(DIRECTIONS_MAP[direction], this.head.getPos());
        const newSnake = new Snake();
        const newHead = new Element(nextPos, ELEMENT.HEAD_UP, newSnake);

        newSnake.head = newHead;
        let first = true;
        for (let oldElement of this.elements) {
            if (first) {// skip old tail
                first = false;
            } else {
                newSnake.elements.push(new Element(oldElement.getPos(), oldElement.type, newSnake));
            }
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
    isNeck([x, y]) {
        const neck = this.elements[this.elements.length - 2];

        return neck.x === x && neck.y === y;
    }
    isSelf([x, y]) {
        for (let e of this.elements) {
            if (e.x === x && e.y === y) {
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
    step(playerAction, enemiesAction = []) {
        const scores = [];
        const newState = new State();

        // player score
        const nextPlayerPos = sum(DIRECTIONS_MAP[playerAction], this.player.head.getPos());

        let mode = 'NORMAL';
        if (this.player.furyCount > 0) {
            mode = 'EVIL';
        } else if (this.player.flyCount) {
            mode = 'FLY';
        }
        const elAtPos = getValAt(this.boardMatrix, nextPlayerPos);
        if (elAtPos !== ELEMENT.NONE) {
            scores.push([playerAction, EVALUATION_MAP[mode][elAtPos], elAtPos]);
        } else {// check other els
            const body = this.snakesElements.find(snakeEl => snakeEl.x === nextPlayerPos[0] && snakeEl.y === nextPlayerPos[0]);

            if (body) {
                scores.push([playerAction, EVALUATION_MAP[mode][body.type], body.type]);
            } else {
                scores.push([playerAction, EVALUATION_MAP[mode][elAtPos], elAtPos]);
            }
        }
        /// move player
        this.player = this.player.move(playerAction);

        ///

        return {
            scores,
            state: newState
        };
    }
    static getState(board, prevState = new State()) {
        const boardMatrix = getBoardAsArray(board).map(x => x.split(''));
        const state = new State();

        // player
        PLAYER_TAIL.some(tailType => {
            const pos = findElementPos(boardMatrix, tailType);
            if (pos) {
                const snake = new Snake();
                state.player = snake;

                const newEl = new Element(pos, tailType, snake);
                snake.elements.push(newEl);
                state.snakesElements.push(newEl);

                setValAtMut(boardMatrix, pos, ELEMENT.NONE);
                // find snake body
                let isEnd = 100;
                let currentPos = pos;
                do {
                    isEnd--;
                    for (let direction of DIRECTIONS_RAW) {
                        const next = sum(currentPos, direction);
                        const elAtPos = getValAt(boardMatrix, next)
                        if (PLAYER_BODY.indexOf(elAtPos) > -1) {
                            currentPos = next;
                            const newEl = new Element(currentPos, elAtPos, snake);
                            snake.elements.push(newEl);
                            state.snakesElements.push(newEl);

                            setValAtMut(boardMatrix, currentPos, ELEMENT.NONE);

                            // bodyPart
                        } else if (PLAYER_HEAD_LIST.indexOf(elAtPos) > -1) {
                            currentPos = next;
                            isEnd = 0;
                            // tail
                            currentPos = next;
                            const newEl = new Element(currentPos, elAtPos, snake);
                            snake.elements.push(newEl);
                            state.snakesElements.push(newEl);
                            snake.head = newEl;

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

                return true;
            }
        });

        // enemies
        ENEMY_TAIL.forEach(tailType => {
            const enemiesPos = findElementsPos(boardMatrix, tailType);

            for (let enemyPos of enemiesPos) {
                const snake = new Snake();
                state.enemies.push(snake)

                const newEl = new Element(enemyPos, tailType, snake);
                snake.elements.push(newEl);
                state.snakesElements.push(newEl);

                // find snake body
                let isEnd = 100;
                let currentPos = enemyPos;
                do {
                    isEnd--;
                    for (let direction of DIRECTIONS_RAW) {
                        const next = sum(currentPos, direction);
                        const elAtPos = getValAt(boardMatrix, next)
                        if (ENEMY_BODY.indexOf(elAtPos) > -1) {
                            currentPos = next;
                            const newEl = new Element(currentPos, elAtPos, snake);
                            snake.elements.push(newEl);
                            state.snakesElements.push(newEl);
                            setValAtMut(boardMatrix, currentPos, ELEMENT.NONE);

                            // bodyPart
                        } else if (ENEMIES_HEAD_LIST.indexOf(elAtPos) > -1) {
                            currentPos = next;
                            isEnd = 0;
                            // head
                            const newEl = new Element(currentPos, elAtPos, snake);
                            snake.elements.push(newEl);
                            state.snakesElements.push(newEl);
                            snake.head = newEl;
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
            }
        });

        //debugger;
        state.boardMatrix = boardMatrix;
        return state;

    }
}
exports.State = State;
