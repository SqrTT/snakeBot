
const {
    getNextSnakeMove,
} = require('./bot');
const {
    COMMANDS
} = require('./constants');

describe("bot", () => {
    describe("getNextSnakeMove", () => {
        const mockLogger = (a) => {
            console.log(a);
        };

        it("should define method", () => {
            expect(getNextSnakeMove).toBeDefined();
        });
        it("should avoid horisontal wall", () => {
            const board =
                '☼☼☼☼☼' +
                '#   ☼' +
                '☼   ☼' +
                '☼ ╘►☼' +
                '☼☼☼☼☼';
            const move = getNextSnakeMove(board, mockLogger);
            expect(move).toEqual(COMMANDS.UP);
        });
        it("should avoid wall", () => {
            const board =
                '☼☼☼☼☼' +
                '☼ ╘►☼' +
                '☼   ☼' +
                '#   ☼' +
                '☼☼☼☼☼';

            const move = getNextSnakeMove(board, mockLogger);
            expect(move).toEqual(COMMANDS.DOWN);
        });

        it("should try to catch apples", () => {
            const board =
                '☼☼☼☼☼☼' +
                '☼ ╘► ☼' +
                '☼  ○ ☼' +
                '☼    ☼' +
                '#    ☼' +
                '☼☼☼☼☼☼';
            const move = getNextSnakeMove(board, mockLogger);
            expect(move).toEqual(COMMANDS.DOWN);
        });

        it("sdf", () => {
            const board =

`☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼
☼☼                   ●   ●   ☼
☼#                       ○   ☼
☼☼       ●                   ☼
☼☼                           ☼
☼☼           ●               ☼
☼☼     ☼☼☼☼☼                 ☼
☼☼     ☼                     ☼
☼#     ☼☼☼        ☼☼☼☼ø      ☼
☼☼     ☼®         ☼   ☼  ●   ☼
☼☼     ☼☼☼☼#      ☼☼☼☼#      ☼
☼☼                ☼          ☼
☼☼                ☼          ☼
☼☼                           ☼
☼ø                           ☼
☼☼                           ☼
☼☼        ☼☼☼                ☼
☼☼       ☼  ☼        ○  ●    ☼
☼☼      ☼☼☼☼ø     ☼☼   ☼#    ☼
☼☼      ☼   ☼     ☼®☼ ☼ ☼    ☼
☼#   ©  ☼   ☼     ☼  ☼  ☼    ☼
☼☼                ☼     ☼    ☼
☼☼                ☼     ☼    ☼
☼☼○                     ○    ☼
☼☼                           ☼
☼☼             ●          ●  ☼
╘►     <──┐   æ              ☼
☼☼        │   │         ○    ☼
☼☼        └───┘          ©   ☼
☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼`;
            const move = getNextSnakeMove(board.replace(/\n/g, ''), mockLogger);
            expect(move).toEqual(COMMANDS.RIGHT);
        })
    });
});
