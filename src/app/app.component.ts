import { Component, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from  '@angular/forms';

import { MazeService } from './maze.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'maze-ga';

    public maze: Array<Block> = [];
    public eltismo: boolean = false;
    public crossover: number = 0.7;
    public mutation: number = 0.3;
    public populationLength: number = 100;
    public maxGenerations: number = 1000;
    public solution: string = "000001010100";
    public characters: Array<string> = ["00", "01", "10", "11"];
    public genesTotal: number;
    public generations: Array<string> = [];

    public paramsForm: FormGroup;

    constructor(
        private mazeService: MazeService,
        private ref: ChangeDetectorRef,
        private formBuilder: FormBuilder
    ) {
        // this.paramsForm = this.formBuilder.group({
        //     crossover: this.crossover,
        //     mutation: this.mutation,
        //     populationLength: this.populationLength,
        //     maxGenerations: this.maxGenerations
        // });
        
        this.genesTotal = this.solution.length / 2;
        this.maze = mazeService.generateMaze();
    }

    public ngOnInit(): void {
        // this.start();
        console.log('ngOnInit');

        // let hasSolution = false;
        // let generation = 0;

        // //cria a primeira população aleatória
        // let population = this.createPopulation(this.genesTotal, this.populationLength);

        // console.log(population);

        // this.ref.detectChanges();
        // console.log(population.individuos[0]);
        // this.renderMaze(population.individuos[0]);
        // this.ref.detectChanges();
    }
    public ngAfterViewInit(): void {
        console.log('ngAfterViewInit');
        // this.start();
    }

    public onSubmit(): void {
        // let crossover = this.crossover.toString();
        // let newCrossover = crossover.replace(/,/g, '.');
        // let formatedCrossover = parseInt(newCrossover);
        // this.crossover = formatedCrossover;
        
        // if(this.crossover > 1 || this.crossover < 0){
        //     this.crossover = 0.7;
        // }

        // let mutation = this.mutation.toString();
        // let newmutation = mutation.replace(/,/g, '.');
        // let formatedmutation = parseInt(newmutation);
        // this.mutation = formatedmutation;
        
        // if(this.mutation > 1 || this.mutation < 0){
        //     this.mutation = 0.3;
        // }

        this.start();
    }

    public start(): void {
        let hasSolution = false;
        let generation = 0;

        //cria a primeira população aleatória
        // let population;
        this.generations = [];
        let population = this.createPopulation(this.genesTotal, this.populationLength);

        // console.log('populationpopulationpopulation', population);

        // this.ref.detectChanges();
        // console.log(population.individuos[0]);
        // this.renderMaze(population.individuos[0]);
        // this.ref.detectChanges();


        //verifica se tem a solucao
        // hasSolution = this.verifyHasSolutionReal(population.individuos[0]);

        while (!hasSolution && generation < this.maxGenerations) {
            // setTimeout(() => {
            // }, 0);
            generation++;

            //cria nova populacao
            population = this.newGeneration(population, this.eltismo);

            // console.log('population.individuos', population.individuos);

            console.log("Geração " + generation + " | Aptidão: " + population.individuos[0].fitness + " | Melhor: " + population.individuos[0].genes);
            this.generations.push("Geração " + generation + " | Aptidão: " + population.individuos[0].fitness + " | Melhor: " + population.individuos[0].genes);

            //verifica se tem a solucao
            hasSolution = this.verifyHasSolutionReal(population.individuos[0]);

            this.renderMaze(population.individuos[0]);
            this.ref.detectChanges();
        }

        if (generation == this.maxGenerations) {
            // console.log('population.individuos', population.individuos);
            console.log("Atingiu o número máximo de gerações | " + population.individuos[0].genes + " | Aptidão: " + population.individuos[0].fitness);
            this.generations.push("Atingiu o número máximo de gerações | " + population.individuos[0].genes + " | Aptidão: " + population.individuos[0].fitness);
        }

        if (hasSolution) {
            // console.log('population.individuos', population.individuos);
            console.log("Encontrado resultado na geração " + generation + " | " + population.individuos[0].genes + " (Aptidão: " + population.individuos[0].fitness + ")");
            this.generations.push("Encontrado resultado na geração " + generation + " | " + population.individuos[0].genes + " (Aptidão: " + population.individuos[0].fitness + ")");
        }

        this.renderMaze(population.individuos[0]);
        this.ref.detectChanges();
    }

    private verifyHasSolution(population: Population): boolean {
        let individuo: Individuo = null;

        population.individuos.forEach(i => {
            if (i.genes == this.solution) {
                individuo = i;
                return;
            }
        });

        return individuo == null ? false : true;
    }

    private verifyHasSolutionReal(individuo: Individuo): boolean {
        let lastField = this.getLastFieldTraveled(individuo);
        let exitField = this.maze[3];

        // console.log('individuo.wallsHit', individuo.wallsHit);
        // console.log('individuo.hadImpossibleMove', individuo.hadImpossibleMove);
        // console.log('exitField.id', exitField.id);
        // console.log('lastField.id', lastField.id);

        return individuo.fitness == 0 && exitField.id == lastField.id;
        // return individuo.wallsHit == 0 && !individuo.hadImpossibleMove && exitField.id == lastField.id;
    }

    private getLastFieldTraveled(individuo: Individuo): Block {
        let maze = this.maze.slice(0, this.maze.length);
        maze.forEach(m => m.current = false);
        maze[12].current = true;

        let currentField = maze.find(m => m.current);

        for (let i = 0; i < individuo.genes.length; i += 2) {
            let move = individuo.genes[i] + individuo.genes[i + 1];

            currentField = this.getNextMazeFieldByDirection(maze, currentField, move);
        }

        return currentField;
    }

    private newGeneration(population: Population, elitismo: boolean): Population {
        //nova população do mesmo tamanho da antiga
        let newPopulation = new Population();
        newPopulation.individuos = [];

        population.individuos.sort((a, b) => (a.fitness < b.fitness) ? 1 : -1);

        //se tiver elitismo, mantém o melhor indivíduo da geração atual
        if (elitismo) {
            newPopulation.individuos.push(population.individuos[0]);
        }

        //insere novos indivíduos na nova população, até atingir o tamanho máximo
        while (newPopulation.individuos.length < this.populationLength) {
            //seleciona os 2 pais por torneio
            let parents = this.tournament(population);

            let children = [];

            //verifica a taxa de crossover, se sim realiza o crossover, se não, mantém os pais selecionados para a próxima geração
            if (this.randomDoubleFromInterval(0, 100) <= this.crossover) {
                children = this.generateCrossover(parents[1], parents[0]);
            }
            else {
                children.push(parents[0]);
                children.push(parents[1]);
            }

            //adiciona os filhos na nova geração
            newPopulation.individuos.push(children[0]);
            newPopulation.individuos.push(children[1]);
        }

        //ordena a nova população
        newPopulation.individuos.sort((a, b) => (a.fitness < b.fitness) ? 1 : -1)
        return newPopulation;
    }

    public tournament(population: Population): Array<Individuo> {
        let newPopulation = new Population();
        newPopulation.individuos = [];

        //seleciona 3 indivíduos aleatóriamente na população
        newPopulation.individuos.push(population.individuos[this.randomIntFromInterval(0, this.populationLength - 1)]);
        newPopulation.individuos.push(population.individuos[this.randomIntFromInterval(0, this.populationLength - 1)]);
        newPopulation.individuos.push(population.individuos[this.randomIntFromInterval(0, this.populationLength - 1)]);

        //ordena a população
        newPopulation.individuos.sort((a, b) => (a.fitness < b.fitness) ? 1 : -1);

        let parents: Array<Individuo> = [];

        //seleciona os 2 melhores deste população
        parents.push(newPopulation.individuos[0]);
        parents.push(newPopulation.individuos[1]);

        return parents;
    }

    public generateCrossover(individuo1: Individuo, individuo2: Individuo) {
        //sorteia o ponto de corte
        let pontoCorte1 = this.randomIntFromInterval(0, (individuo1.genes.length / 2) - 2) + 1; // entre 0 e 4
        let pontoCorte2 = this.randomIntFromInterval(0, (individuo1.genes.length / 2) - 2) + individuo1.genes.length / 2; // entre 0 e 4 MAIS a metade (6) (0 ~10)
        // console.log('(individuo1.genes.length / 2) - 2', (individuo1.genes.length / 2) - 2);
        // console.log(pontoCorte1, pontoCorte2);

        let children = [];

        //pega os genes dos pais
        let parentGene1 = individuo1.genes;
        let parentGene2 = individuo2.genes;


        //realiza o corte, 
        let childGene1 = parentGene1.substr(0, pontoCorte1);
        childGene1 = childGene1 + parentGene2.substr(pontoCorte1, (pontoCorte2 - pontoCorte1));
        childGene1 = childGene1 + parentGene1.substr(pontoCorte2, (parentGene1.length - pontoCorte2));

        let childGene2 = parentGene2.substr(0, pontoCorte1);
        childGene2 = childGene2 + parentGene1.substr(pontoCorte1, (pontoCorte2 - pontoCorte1));
        childGene2 = childGene2 + parentGene2.substr(pontoCorte2, (parentGene2.length - pontoCorte2));

        //cria o novo indivíduo com os genes dos pais
        children.push(this.createIndividuoByGenes(childGene1));
        children.push(this.createIndividuoByGenes(childGene2));

        return children;
    }

    private createPopulation(genesTotal: number, length: number): Population {
        let population = new Population();
        population.length = length;

        population.individuos = [];
        for (let i = 0; i < length; i++) {
            population.individuos[i] = this.createIndividuo(genesTotal);
        }

        // console.log('population', population);

        return population;
    }

    private createIndividuo(genesTotal: number): Individuo {
        let individuo = new Individuo();
        individuo.genes = "";
        individuo.fitness = 0;

        for (let i = 0; i < genesTotal; i++) {
            var index = this.randomIntFromInterval(0, 3);
            individuo.genes = individuo.genes + this.characters[index];
        }

        this.generateFitnessReal(individuo);

        return individuo;
    }

    private createIndividuoByGenes(genes: string): Individuo {
        let individuo = new Individuo();
        individuo.genes = genes;

        //se for mutar, cria um gene aleatório
        if (this.randomDoubleFromInterval(0, 100) <= this.mutation) {
            let geneNovo = "";
            let posAleatoria = this.randomIntFromInterval(0, genes.length);
            // let posAleatoria = this.randomIntFromInterval(0, genes.length / 2);

            // console.log('TEM MUTACAO', posAleatoria);

            if (posAleatoria % 2 != 0) {
                posAleatoria--;
            }

            //8 passos x 2 = 16
            if (posAleatoria == 16) {
                posAleatoria--;
            }

            for (let i = 0; i < genes.length; i++)
            {
                // console.log('posAleatoria', posAleatoria, i);
                if (i == posAleatoria + 1) continue;

                if (i == posAleatoria) {
                    // console.log('antigo GENE', geneNovo);
                    geneNovo = geneNovo + this.characters[this.randomIntFromInterval(0, this.characters.length - 1)];
                    // console.log('NOOV GENE', geneNovo);
                }
                else {
                    geneNovo = geneNovo + genes[i];
                }

            }
            individuo.genes = geneNovo;
        }

        //this.generateFitness(individuo);
        this.generateFitnessReal(individuo);

        return individuo;
    }

    private randomIntFromInterval(min, max): number { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    private randomDoubleFromInterval(min, max): number { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min) / 100;
    }

    private resetCurrent(): void {
        this.maze.find(m => {
            m.current = false;
        });

        this.maze[12].current = true;
    }

    private generateFitnessReal(individuo: Individuo): void {
        if (!individuo.fitness) individuo.fitness = 0;
        if (!individuo.wallsHit) individuo.wallsHit = 0;
        if (!individuo.repeatedInput) individuo.repeatedInput = 0;

        this.resetCurrent();
        let fieldsTraveled = [];
        let currentField = this.maze.find(m => m.current);

        // console.log('-----------------------------------');

        let verifyMove = (direction: Direction, cantMove: boolean, test: boolean): void => {
            //Verifica se a direção está dentro das possíveis direções do campo atual no labirinto
            if (currentField.possibleDirections.findIndex(d => d == direction) > -1) {
                // console.log('dentro');

                // console.log('cantMove', fieldsTraveled.findIndex(f => f.id == currentField.id));

                //Verifica se a parede na direção que ele deseja ir
                if (cantMove) {
                    // console.log('bate na parede');
                    individuo.wallsHit += 30;
                }

                //Verifica o bot já passou por esse campo antes
                if (fieldsTraveled.findIndex(f => f.id == currentField.id) > -1) {
                    // console.log('andou mesmo caminho');
                    individuo.repeatedInput += 10;
                    // individuo.repeatedInput++;
                } else {
                    fieldsTraveled.push(currentField);
                }
            } else {
                if (fieldsTraveled.findIndex(f => f.id == currentField.id) > -1) {
                    individuo.repeatedInput += 10;
                }
                else {
                    fieldsTraveled.push(currentField);
                }


                individuo.fitness -= 100;
                individuo.hadImpossibleMove = true;
            }
        }

        let moves = [];
        for (let i = 0; i < individuo.genes.length; i += 2) {
            let move = individuo.genes[i] + individuo.genes[i + 1];

            // console.log('move', move, move);
            let test = false;

            if((individuo.genes.length-2) == i){
                test = true;
            }

            switch (move) {
                case Direction.Left:
                    verifyMove(move, currentField.wallLeft, test);
                    moves.push('esquerda');
                    break;
                case Direction.Top:
                    verifyMove(move, currentField.wallTop, test);
                    moves.push('cima');
                    break;
                case Direction.Right:
                    moves.push('direita');
                    verifyMove(move, currentField.wallRight, test);
                    break;
                case Direction.Bottom:
                    moves.push('baixo');
                    verifyMove(move, currentField.wallBottom, test);
                    break;
            }

            currentField = this.getNextMazeFieldByDirection(this.maze, currentField, move);
        }

        individuo.fitness -= individuo.wallsHit;
        individuo.fitness -= individuo.repeatedInput;
        // console.log('moves', moves);
        // console.log('individuo.fitness', individuo.fitness);

        // this.generatePenalty(individuo, fieldsTraveled);

        // console.log('+++++++++++++++++++++++++++++++++');
    }

    private getNextMazeFieldByDirection(maze: Array<Block>, currentField: Block, move: string): Block {
        let oldIndex = maze.findIndex(m => m.current);

        if (currentField.possibleDirections.findIndex(d => d == move) > -1) {
            switch (move) {
                case Direction.Left:
                    oldIndex--;
                    break;
                case Direction.Top:
                    oldIndex = oldIndex - 4;
                    break;
                case Direction.Right:
                    oldIndex++;
                    break;
                case Direction.Bottom:
                    oldIndex = oldIndex + 4;
                    break;
            }

            this.maze.find(m => {
                m.current = false;
            });

            this.maze[oldIndex].current = true;
        }

        return maze[oldIndex];
    }

    private renderMaze(individuo: Individuo): void{
        this.resetCurrent();
        this.maze.forEach(m => m.active = false);

        let currentField = this.maze.find(m => m.current);
        currentField.active = true;

        for (let i = 0; i < individuo.genes.length; i += 2) {
            let move = individuo.genes[i] + individuo.genes[i + 1];

            currentField = this.getNextMazeFieldByDirection(this.maze, currentField, move);
            currentField.active = true;
        }
    }
}


export enum Direction {
    Right = "00",
    Top = "01",
    Left = "10",
    Bottom = "11"
}

export class Block {
    public id: number;
    public cordX: number;
    public cordY: number;
    public wallLeft: boolean;
    public wallRight: boolean;
    public wallTop: boolean;
    public wallBottom: boolean;
    public current: boolean;
    public active: boolean;
    public possibleDirections: Array<Direction>;
}

export class Population {
    public individuos: Array<Individuo>;
    public length: number;
}

export class Individuo {
    public genes: string;
    public fitness: number;
    public wallsHit: number;
    public repeatedInput: number;
    public hadImpossibleMove: boolean;
}