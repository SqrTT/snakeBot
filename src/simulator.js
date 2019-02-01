import { ELEMENT, COMMANDS, PLAYER_HEAD_LIST, PLAYER_BODY, DIRECTIONS_MAP, DIRECTIONS_RAW, PLAYER_TAIL, ENEMIES_HEAD_LIST, ENEMY_BODY, ENEMY_TAIL } from "./constants";
import { getBoardAsArray, findElementPos, sum, findElementsPos } from "./utils";


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
 * @returns {keyof import("./constants").ELEMENT}
 */
function getValAt(board, [x, y]) {
    return (board[y] && board[y][x]) || ELEMENT.OTHER;
}


class Element {
    constructor(x, y, type, owner) {
        this.x = x;
        this.y = y;
        this.owner = owner;
        this.type = type;
    }
}

class Snake {
    constructor() {
        this.isFury = 0;
        this.isFly = 0;
        this.isDead = false;
        /**
         * @type {Element}
         */
        this.head = null;
        this.elements = [];
    }
}

export class State {
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
    static getState(board, prevState = new State()) {
        const boardMatrix = getBoardAsArray(board).map(x => x.split(''));
        const state = new State();


        // player
        PLAYER_HEAD_LIST.some(headType => {
            const pos = findElementPos(boardMatrix, headType);
            if (pos) {
                state.player = new Snake();
                state.player.head = new Element(pos[0], pos[1], headType, state.player);
                state.player.elements.push(state.player.head);
                state.snakesElements.push(state.player.head);
                setValAtMut(boardMatrix, pos, ELEMENT.NONE);

                if (headType === ELEMENT.HEAD_FLY) {
                    state.player.isFly = 1;
                } else if (headType === ELEMENT.HEAD_EVIL) {
                    state.player.isFury = 1;
                } else if (headType === ELEMENT.HEAD_SLEEP || headType === ELEMENT.HEAD_DEAD) {
                    state.player.isDead = true;
                }
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
                            const newEl = new Element(currentPos[0], currentPos[1], elAtPos, state.player);
                            state.player.elements.push(newEl);
                            state.snakesElements.push(state.player.head);

                            setValAtMut(boardMatrix, currentPos, ELEMENT.NONE);

                            // bodyPart
                        } else if (PLAYER_TAIL.indexOf(elAtPos) > -1) {
                            currentPos = next;
                            isEnd = 0;
                            // tail
                            currentPos = next;
                            const newEl = new Element(currentPos[0], currentPos[1], elAtPos, state.player);
                            state.player.elements.push(newEl);
                            state.snakesElements.push(state.player.head);

                            setValAtMut(boardMatrix, currentPos, ELEMENT.NONE);
                            break;
                        }
                    }

                } while (isEnd > 0);

                return true;
            }
        });

        // enemies
        ENEMIES_HEAD_LIST.forEach(headType => {
            const enemiesPos = findElementsPos(boardMatrix, headType);

            for (let enemyPos of enemiesPos) {
                const snake = new Snake();
                state.enemies.push(snake)
                snake.head = new Element(enemyPos[0], enemyPos[1], headType, snake);
                snake.elements.push(snake.head);
                state.snakesElements.push(snake.head);
                setValAtMut(boardMatrix, enemyPos, ELEMENT.NONE);

                if (headType === ELEMENT.HEAD_FLY) {
                    snake.isFly = 1;
                } else if (headType === ELEMENT.HEAD_EVIL) {
                    snake.isFury = 1;
                } else if (headType === ELEMENT.HEAD_SLEEP || headType === ELEMENT.HEAD_DEAD) {
                    snake.isDead = true;
                }
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
                            const newEl = new Element(currentPos[0], currentPos[1], elAtPos, snake);
                            snake.elements.push(newEl);
                            state.snakesElements.push(newEl);
                            setValAtMut(boardMatrix, currentPos, ELEMENT.NONE);

                            // bodyPart
                        } else if (ENEMY_TAIL.indexOf(elAtPos) > -1) {
                            currentPos = next;
                            isEnd = 0;
                            // tail
                            currentPos = next;
                            const newEl = new Element(currentPos[0], currentPos[1], elAtPos, snake);
                            snake.elements.push(newEl);
                            state.snakesElements.push(newEl);

                            setValAtMut(boardMatrix, currentPos, ELEMENT.NONE);
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






export function step(board, playerMove, payerPos, enemyes) {

}
