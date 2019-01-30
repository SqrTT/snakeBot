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
import {
    getNextSnakeMove,
} from './bot';
import {
  COMMANDS
} from './constants';

describe("bot", () => {
    describe("getNextSnakeMove", ()=> {
        const mockLogger = (a)=> {
            console.log(a);
        };

        it("should define method", ()=> {
            expect(getNextSnakeMove).toBeDefined();
        });
        xit("should avoid horisontal wall", ()=> {
            const board =
            '*****' +
            '#   *' +
            '*   *' +
            '* ═►*' +
            '*****';
            const move = getNextSnakeMove(board, mockLogger);
            expect(move).toEqual(COMMANDS.UP);
        });
        xit("should avoid wall", ()=> {
            const board =
            '*****' +
            '* ═►*' +
            '*   *' +
            '#   *' +
            '*****';
            const move = getNextSnakeMove(board, mockLogger);
            expect(move).toEqual(COMMANDS.DOWN);
        });

        it("should try to catch apples", ()=> {
            const board =
            '******' +
            '* ═► *' +
            '*  ○ *' +
            '*    *' +
            '#    *' +
            '******';
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
☼#     ☼☼☼  ╓     ☼☼☼*ø      ☼
☼☼     ☼®   ▼     ☼   ☼  ●   ☼
☼☼     ☼☼☼☼#      ☼☼☼☼#      ☼
☼☼                ☼          ☼
☼☼                ☼          ☼
☼☼                           ☼
*ø                           ☼
☼☼                           ☼
☼☼        ☼☼☼                ☼
☼☼       ☼  ☼        ○  ●    ☼
☼☼      ☼☼☼*ø     ☼☼   ☼#    ☼
☼☼      ☼   ☼     ☼®☼ ☼ ☼    ☼
☼#   ©  ☼   ☼     ☼  ☼  ☼    ☼
☼☼                ☼     ☼    ☼
☼☼                ☼     ☼    ☼
☼☼○                     ○    ☼
☼☼                           ☼
☼☼             ●          ●  ☼
☼#     <──┐   æ              ☼
☼☼        │   │         ○    ☼
☼☼        └───┘          ©   ☼
☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼`;
            const move = getNextSnakeMove(board.replace(/\n/g, ''), mockLogger);
            expect(move).not.toEqual(COMMANDS.LEFT);
        })
    });
});
