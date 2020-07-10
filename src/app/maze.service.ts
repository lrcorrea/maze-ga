import { Injectable } from '@angular/core';
import { Block, Direction } from './app.component';

@Injectable({
  providedIn: 'root'
})
export class MazeService {
    public maze: Array<Block> = [];
    constructor() { }

    public generateMaze(): Array<Block> {
        let cordX = 0;
        let cordY = 0;

        for (let i = 0; i < 16; i++) {
            if(cordY == 4){
                cordY = 0;
                cordX++; 
            }
        
            this.maze.push(
                {
                    id: i,
                    cordX: cordX,
                    cordY: cordY,
                    wallLeft: false,
                    wallRight: false,
                    wallTop: false,
                    wallBottom: false,
                    active: false,
                    current: false,
                    possibleDirections: []
                }
            );

            cordY++;
        }

        // console.log('1', this.maze);

        //Linha 1
        //Coluna 1
        this.maze[0].wallTop = true;
        this.maze[0].wallLeft = true;
        this.maze[0].possibleDirections.push(Direction.Right);
        this.maze[0].possibleDirections.push(Direction.Bottom);
        //Coluna 2
        this.maze[1].wallTop = true;
        this.maze[1].wallBottom = true;
        this.maze[1].possibleDirections.push(Direction.Left);
        this.maze[1].possibleDirections.push(Direction.Right);
        //Coluna 3
        this.maze[2].wallTop = true;
        this.maze[2].possibleDirections.push(Direction.Left);
        this.maze[2].possibleDirections.push(Direction.Right);
        this.maze[2].possibleDirections.push(Direction.Bottom);
        //Coluna 4
        this.maze[3].wallTop = true;
        this.maze[3].possibleDirections.push(Direction.Left);
        this.maze[3].possibleDirections.push(Direction.Right);
        this.maze[3].possibleDirections.push(Direction.Bottom);

        //Linha 2
        //Coluna 1
        this.maze[4].wallLeft = true;
        this.maze[4].possibleDirections.push(Direction.Top);
        this.maze[4].possibleDirections.push(Direction.Right);
        this.maze[4].possibleDirections.push(Direction.Bottom);
        //Coluna 2
        this.maze[5].wallTop = true;
        this.maze[5].wallRight = true;
        this.maze[5].possibleDirections.push(Direction.Left);
        this.maze[5].possibleDirections.push(Direction.Bottom);
        //Coluna 3
        this.maze[6].wallLeft = true;
        this.maze[6].possibleDirections.push(Direction.Top);
        this.maze[6].possibleDirections.push(Direction.Right);
        this.maze[6].possibleDirections.push(Direction.Bottom);
        //Coluna 4
        this.maze[7].wallRight = true;
        this.maze[7].wallBottom = true;
        this.maze[7].possibleDirections.push(Direction.Left);
        this.maze[7].possibleDirections.push(Direction.Top);

        //Linha 3
        //Coluna 1
        this.maze[8].wallLeft = true;
        this.maze[8].possibleDirections.push(Direction.Right);
        this.maze[8].possibleDirections.push(Direction.Bottom);
        this.maze[8].possibleDirections.push(Direction.Top);
        //Coluna 2
        this.maze[9].wallRight = true;
        this.maze[9].wallBottom = true;
        this.maze[9].possibleDirections.push(Direction.Left);
        this.maze[9].possibleDirections.push(Direction.Top);
        //Coluna 3
        this.maze[10].wallRight = true;
        this.maze[10].wallLeft = true;
        this.maze[10].possibleDirections.push(Direction.Top);
        this.maze[10].possibleDirections.push(Direction.Bottom);
        //Coluna 4
        this.maze[11].wallTop = true;
        this.maze[11].wallRight = true;
        this.maze[11].wallLeft = true;
        this.maze[11].possibleDirections.push(Direction.Bottom);

        //Linha 4
        //Coluna 1
        this.maze[12].wallBottom = true;
        this.maze[12].current = true;
        this.maze[12].possibleDirections.push(Direction.Right);
        // this.maze[12].possibleDirections.push(Direction.Left);
        this.maze[12].possibleDirections.push(Direction.Top);
        //Coluna 2
        this.maze[13].wallTop = true;
        this.maze[13].wallBottom = true;
        this.maze[13].possibleDirections.push(Direction.Left);
        this.maze[13].possibleDirections.push(Direction.Right);
        //Coluna 3
        this.maze[14].wallBottom = true;
        this.maze[14].possibleDirections.push(Direction.Top);
        this.maze[14].possibleDirections.push(Direction.Left);
        this.maze[14].possibleDirections.push(Direction.Right);
        //Coluna 4
        this.maze[15].wallBottom = true;
        this.maze[15].wallRight = true;
        this.maze[15].possibleDirections.push(Direction.Top);
        this.maze[15].possibleDirections.push(Direction.Left);

        // console.log('this.maze[12]', this.maze[12]);
        // console.log('2', this.maze);

        return this.maze;
    }
}
