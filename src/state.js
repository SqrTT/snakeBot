var { ELEMENT, COMMANDS, COMMANDS_LIST, PLAYER_HEAD_LIST, PLAYER_BODY, DIRECTIONS_MAP, DIRECTIONS_RAW, PLAYER_TAIL, ENEMY_TAIL, ENEMIES_HEAD_LIST, ENEMY_BODY, ENEMY_TAIL } = require("./constants");
var { getBoardAsArray, findElementPos, sum, isEnemy, findElementsPos, getDirectionByPos, isSelf, isSamePos, isEnemyHead } = require("./utils");

const X = 0,
    Y = 1;
const SCORE = 1;

var EVALUATION_MAP = {
    NORMAL: {

        [ELEMENT.NONE]: 0,
        [ELEMENT.WALL]: -50,
        [ELEMENT.START_FLOOR]: -50,
        [ELEMENT.OTHER]: -50,

        [ELEMENT.APPLE]: 10,
        [ELEMENT.STONE]: -50,
        [ELEMENT.FLYING_PILL]: 0,
        [ELEMENT.FURY_PILL]: 0,
        [ELEMENT.GOLD]: 10,
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
        [ELEMENT.STONE]: 5,
        [ELEMENT.FLYING_PILL]: 1,
        [ELEMENT.FURY_PILL]: 1,
        [ELEMENT.GOLD]: 10,
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
        [ELEMENT.GOLD]: 10,
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

function isOtherBodyPartsAround(pos, boardMatrix) {
    for (var dir = COMMANDS_LIST.length - 1; dir >= 0; --dir) {
        var currentDir = COMMANDS_LIST[dir];
        var nextPos = sum(pos, DIRECTIONS_MAP[currentDir]);
        if (PLAYER_BODY.indexOf(getValAt(boardMatrix, nextPos)) > -1) {
            return true;
        }
    }
    return false;
}
function isOtherEnemyBodyPartsAround(pos, boardMatrix) {
    for (var dir = COMMANDS_LIST.length - 1; dir >= 0; --dir) {
        var currentDir = COMMANDS_LIST[dir];
        var nextPos = sum(pos, DIRECTIONS_MAP[currentDir]);
        if (ENEMY_BODY.indexOf(getValAt(boardMatrix, nextPos)) > -1) {
            return true;
        }
    }
    return false;
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
    isSame(pos) {
        return pos[X] === this.pos[X] && pos[Y] === this.pos[Y];
    }
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
    eat(boardMatrix) {

    }
    isNeck(pos) {
        var neck = this.elements[this.elements.length - 2];

        return !neck || neck.pos[X] === pos[X] && neck.pos[Y] === pos[Y];
    }
    isSelf(pos) {
        return this.contains(pos);
    }
    bodyContains(pos) {
        if (this.isDead) {
            return false;
        } else {
            for (var idx = this.elements.length - 2; idx >= 0; idx--) {
                if (isSamePos(this.elements[idx].pos, pos)) {
                    return true;
                }
            }
            return false;
        }
    }
    contains(pos) {
        if (this.isDead) {
            return false;
        } else {
            for (var idx = this.elements.length - 1; idx >= 0; idx--) {
                if (isSamePos(this.elements[idx].pos, pos)) {
                    return true;
                }
            }
            return false;
        }
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
            var val = el.type;
            if (el.owner.furyCount && el.isSame(el.owner.head.pos)) {
                if (el.owner.isSelf(this.player.head.pos)) {
                    val = ELEMENT.HEAD_EVIL;
                } else {
                    val = ELEMENT.ENEMY_HEAD_EVIL;
                }
            }
            if (el.owner.flyCount && el.isSame(el.owner.head.pos)) {
                if (el.owner.isSelf(this.player.head.pos)) {
                    val = ELEMENT.HEAD_FLY;
                } else {
                    val = ELEMENT.ENEMY_HEAD_EVIL;
                }
            }
            board = setValAt(board, el.pos, val);
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
     * @param {Snake?} enemy
     */
    evaluatePlayer(newState, enemy) {
        var playerScore = -Infinity;
        var mode = 'NORMAL';
        if (this.player.furyCount > 0) {
            mode = 'EVIL';
        } else if (this.player.flyCount) {
            mode = 'FLY';
        }
        var elAtPos = getValAt(newState.boardMatrix, newState.player.head.pos);
        if (newState.player.isDead) {
            playerScore = -State.SCORE_FOR_DEATH;
        } else if (elAtPos === ELEMENT.NONE) {
            if (!newState.player.flyCount && newState.player.bodyContains(newState.player.head.pos)) {
                playerScore = -State.SCORE_FOR_DEATH / 2;
            } else if (enemy) {
                var otherEnemy = newState.getEnemyAtPos(newState.player.head.pos, enemy);

                if (otherEnemy) {
                    playerScore = newState.snakesFight(newState, otherEnemy);
                    // if (playerScore === 0) {

                    // }
                    //playerScore = 0;
                } else {
                    playerScore = 0;
                }
            } else {
                playerScore = 0;
            }
        } else if (elAtPos === ELEMENT.FLYING_PILL) {
            newState.player.flyCount += 10;
            playerScore = 50;
            newState.boardMatrix = setValAt(newState.boardMatrix, newState.player.head.pos, ELEMENT.NONE);
        } else if (elAtPos === ELEMENT.FURY_PILL) {
            newState.player.furyCount += 10;
            playerScore = 100;
            newState.boardMatrix = setValAt(newState.boardMatrix, newState.player.head.pos, ELEMENT.NONE);
        } else if (elAtPos === ELEMENT.STONE) {
            if (newState.player.elements.length >= 5) {
                //reduce length
                newState.player.elements.shift();
                newState.player.elements.shift();
                newState.player.elements.shift();
                playerScore = -100;
            } else {
                playerScore = -State.SCORE_FOR_DEATH;
            }
            newState.boardMatrix = setValAt(newState.boardMatrix, newState.player.head.pos, ELEMENT.NONE);
        } else if (elAtPos === ELEMENT.APPLE) {
            newState.player.elements.unshift(this.player.elements[0]);// restore old tail
            newState.boardMatrix = setValAt(newState.boardMatrix, newState.player.head.pos, ELEMENT.NONE);
            playerScore = 100;
        } else if (elAtPos === ELEMENT.GOLD) {
            playerScore = 150;
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
    evaluateEnemy(enemy, newState, idx) {
        var mode = 'NORMAL';
        var enemyScore = Infinity;
        if (enemy.furyCount > 0) {
            mode = 'EVIL';
        } else if (enemy.flyCount) {
            mode = 'FLY';
        }
        var elAtPos = getValAt(this.boardMatrix, enemy.head.pos);
        if (enemy.isDead) {
            enemyScore = State.SCORE_FOR_DEATH;
        } else if (elAtPos === ELEMENT.NONE) {
            if (!enemy.flyCount && enemy.bodyContains(enemy.head.pos)) {
                enemyScore = State.SCORE_FOR_DEATH / 2;
            } else {
                enemyScore = 0;
            }
        } else if (elAtPos === ELEMENT.FLYING_PILL) {
            enemy.flyCount += 10;
            enemyScore = -EVALUATION_MAP[mode][elAtPos];
            newState.boardMatrix = setValAt(newState.boardMatrix, enemy.head.pos, ELEMENT.NONE);
        } else if (elAtPos === ELEMENT.FURY_PILL) {
            enemy.furyCount += 10;
            enemyScore = -EVALUATION_MAP[mode][elAtPos];
            newState.boardMatrix = setValAt(newState.boardMatrix, enemy.head.pos, ELEMENT.NONE);
        } else if (elAtPos === ELEMENT.STONE) {
            if (enemy.elements.length >= 5) {
                //reduce length
                enemy.elements.shift();
                enemy.elements.shift();
                enemy.elements.shift();
                enemyScore = 0;
            } else {
                enemyScore = -State.SCORE_FOR_DEATH;
            }
            newState.boardMatrix = setValAt(newState.boardMatrix, newState.player.head.pos, ELEMENT.NONE);
        } else if (elAtPos === ELEMENT.GOLD) {
            enemyScore = -150;
            newState.boardMatrix = setValAt(newState.boardMatrix, newState.player.head.pos, ELEMENT.NONE);
        } else if (elAtPos === ELEMENT.APPLE) {
            newState.enemies[idx].elements.unshift(this.enemies[idx].elements[0]);// restore old tail
            enemyScore = -100;
            newState.boardMatrix = setValAt(newState.boardMatrix, newState.player.head.pos, ELEMENT.NONE);
        } else {// check other els
            enemyScore = -EVALUATION_MAP[mode][elAtPos];
            newState.boardMatrix = setValAt(newState.boardMatrix, enemy.head.pos, ELEMENT.NONE);
        }
        return enemyScore * 2;
    }
    /**
     *
     * @param {[number, number]} pos
     * @param {Snake} enemy
     */
    getEnemyAtPos(pos, enemy) {
        for (var enemyIDx = this.enemies.length - 1; enemyIDx >= 0; enemyIDx--) {
            if (this.enemies[enemyIDx] !== enemy && this.enemies[enemyIDx].contains(pos)) {
                return this.enemies[enemyIDx];
            }
        }
    }
    /**
     *
     * @param {number} depth
     * @param {State} newState
     * @param {number} score
     */
    static harvestingMove(depth, newState, score) {
        if (depth < 1) {
            return ['NO', score];
        } else {
            var playerSteps = newState.player.nextSteps;
            var playerBetter = ['NONE', 0]

            for (var playerStepsIdx = playerSteps.length - 1; playerStepsIdx >= 0; playerStepsIdx--) {
                var emulState = new State();
                emulState.boardMatrix = newState.boardMatrix;
                emulState.player = newState.player.move(playerSteps[playerStepsIdx], emulState.boardMatrix);
                var currScore = emulState.evaluatePlayer(emulState, null);
                var scr = State.harvestingMove(depth - 1, emulState, (currScore * depth) + score)

                if (scr[SCORE] > playerBetter[SCORE]) {
                    playerBetter = [playerSteps[playerStepsIdx], scr[SCORE]];
                }
            }
            return playerBetter;
        }
    }
    /**
     *
     * @param {string} playerAction
     * @param {string} action
     */
    step(playerAction, action, enemyID) {
        var newState = new State();
        newState.boardMatrix = this.boardMatrix;
        /**
         * @type {number}
         */
        var score = 0;
        /**
         * @type {Snake|undefined}
         */
        var enemy = undefined;

        /// snakesMove();
        newState.player = this.player.move(playerAction, this.boardMatrix);
        var enemiesLength = this.enemies.length;
        newState.enemies.length = enemiesLength;
        for (var enemyIDX = 0; enemyIDX < enemiesLength; enemyIDX++) {
            var enemyIn = this.enemies[enemyIDX];

            if (action && enemyIDX === enemyID) {
                enemy = newState.enemies[enemyIDX] = enemyIn.move(action, this.boardMatrix);
            } else {
                newState.enemies[enemyIDX] = this.enemies[enemyIDX];
            }
        }
        if (!enemy) {
            throw Error('Enemy not found');
        }

        var firstFight = score = this.snakesFight(newState, enemy);


        score += this.evaluatePlayer(newState, enemy);

        score += this.evaluateEnemy(enemy, newState, enemyID);

        score += this.snakesFight(newState, enemy) - firstFight;

        return {
            score,
            state: newState
        };
    }
    snakesFight(newState, enemy) {
        var score = 0;
        if (!newState.player.isDead && enemy.contains(newState.player.head.pos) && newState.player.flyCount === 0) {
            if (enemy.furyCount && !newState.player.furyCount) {
                newState.player.isDead = true;
                score = -State.SCORE_FOR_DEATH;
            }
            else if (!enemy.furyCount && newState.player.furyCount) {
                enemy.isDead = true;
                score = State.SCORE_FOR_DEATH;
            }
            else {
                if (newState.player.head.isSame(enemy.head.pos) || enemy.isNeck(newState.player.head.pos)) {
                    if (newState.player.elements.length - enemy.elements.length >= 2) {
                        score = newState.player.elements.length * State.SCORE_ELEMENT;
                        enemy.isDead = true;
                    } else {
                        score = -State.SCORE_FOR_DEATH;
                        newState.player.isDead = true;
                    }
                } else {
                    score = -State.SCORE_FOR_DEATH;
                    newState.player.isDead = true;
                }
            }
        }
        //////
        if (!enemy.isDead && newState.player.contains(enemy.head.pos) && enemy.flyCount === 0) {
            // enemy hits player
            if (enemy.furyCount && !newState.player.furyCount) {
                newState.player.isDead = true;
                score = -State.SCORE_FOR_DEATH;
            } else if (!enemy.furyCount && newState.player.furyCount) {
                enemy.isDead = true;
                score = State.SCORE_FOR_DEATH;
            } else {
                if (enemy.head.isSame(newState.player.head.pos) || newState.player.isNeck(enemy.head.pos)) {
                    if (enemy.elements.length - newState.player.elements.length >= 2) {
                        score = -State.SCORE_FOR_DEATH;
                        newState.player.isDead = true;
                    } else {
                        score = -State.SCORE_FOR_DEATH;
                        enemy.isDead = true;
                        //newState.player.isDead = true;
                    }
                } else {
                    score = State.SCORE_FOR_DEATH;
                    enemy.isDead = true;
                }
            }
        }
        return score;
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
                setValAtMut(boardMatrix, nextPos, ELEMENT.NONE);
                if (isOtherBodyPartsAround(headPos, boardMatrix)) {
                    setValAtMut(boardMatrix, nextPos, currentElAtPos);
                } else {
                    snakeElements.push({
                        pos: nextPos,
                        type: currentElAtPos
                    });
                    break;
                }

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
                if (isOtherEnemyBodyPartsAround(headPos, boardMatrix)) {
                    setValAtMut(boardMatrix, nextPos, currentElAtPos);
                } else {
                    snakeElements.push({
                        pos: nextPos,
                        type: currentElAtPos
                    });
                    break;
                }
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
                        snake.flyCount = 3;
                    } else if (snake.head.type === ELEMENT.HEAD_EVIL) {
                        snake.furyCount = 3;
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

                for (var dirs = COMMANDS_LIST.length - 1; dirs >= 0; --dirs) {
                    var nextPos = sum(snake.head.pos, DIRECTIONS_MAP[COMMANDS_LIST[dirs]]);
                    var elAtPos = getValAt(boardMatrix, nextPos);

                    if (elAtPos !== ELEMENT.WALL && elAtPos !== ELEMENT.START_FLOOR && !snake.isNeck(nextPos)) {
                        snake.nextSteps.push(COMMANDS_LIST[dirs]);
                    }
                }
            }
        });
        if (prevState && prevState.boardMatrix) {
            // handle snakes state
            state.enemies.forEach(enemy => {
                var matchEnemy = prevState.enemies.find(oldEnemy => {
                    for (var dirs = COMMANDS_LIST.length - 1; dirs >= 0; --dirs) {
                        var nextPos = sum(oldEnemy.head.pos, DIRECTIONS_MAP[COMMANDS_LIST[dirs]]);

                        if (isSamePos(enemy.head.pos, nextPos)) {
                            return true;
                        }
                    }
                    return false;
                });

                if (matchEnemy) {
                    if (matchEnemy.flyCount > 0) {
                        enemy.flyCount = matchEnemy.flyCount;
                    }
                    if (matchEnemy.furyCount > 0) {
                        enemy.furyCount = matchEnemy.furyCount;
                    }
                }

                var prevEl = getValAt(prevState.boardMatrix, enemy.head.pos);

                if (prevEl === ELEMENT.FLYING_PILL) {
                    enemy.flyCount += 10;
                } else if (prevEl === ELEMENT.FURY_PILL) {
                    enemy.furyCount += 10;
                }

                if (
                    enemy.head.type === ELEMENT.ENEMY_HEAD_SLEEP ||
                    enemy.head.type === ELEMENT.ENEMY_HEAD_DEAD
                ) {
                    enemy.isDead = true;
                }
                if (enemy.flyCount > 0) {
                    enemy.flyCount--;
                }
                if (enemy.furyCount > 0) {
                    enemy.furyCount--;
                }
            });
        }


        //debugger;
        state.boardMatrix = boardMatrix;
        return state;
    }
}
State.SCORE_ELEMENT = 10;
State.SCORE_FOR_DEATH = 1000;
exports.State = State;
