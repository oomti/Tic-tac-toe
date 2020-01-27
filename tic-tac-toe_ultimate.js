const OPPONENT = 1;
const PLAYER = 2;
const EMPTY = 0;
const FULL = 3;

const TRIPLETS = [
	[{x:0,y:0},{x:1,y:0},{x:2,y:0}],
	[{x:0,y:1},{x:1,y:1},{x:2,y:1}],
	[{x:0,y:2},{x:1,y:2},{x:2,y:2}],
	[{x:0,y:0},{x:0,y:1},{x:0,y:2}],
	[{x:1,y:0},{x:1,y:1},{x:1,y:2}],
	[{x:2,y:0},{x:2,y:1},{x:2,y:2}],
	[{x:0,y:0},{x:1,y:1},{x:2,y:2}],
	[{x:2,y:0},{x:1,y:1},{x:0,y:2}]
];

const STATEARRAY = [[0,0,0],[0,0,1],[0,1,1],[1,1,1],[0,0,2],[0,2,2],[2,2,2]];

function filterTRIPLETS(x,y) {
	return TRIPLETS.filter(triplet=>triplet.find(cell=>cell.x==x%3&&cell.y==y%3));
}



class Grid {
	constructor() {
		this.cells = new Array(81);
		this.cells.fill(0);
		//this.cells=this.cells.map((cell,i)=>Math.floor(Math.random()*3))
		this.history = [];
		this.sPlayer = Math.floor(Math.random()*2)+1;
		this.lastStep = null;
		this.stepCount = 0;

		this.cellStates = new Array(81).fill(0)
		this.cellStates = this.cellStates.map(cellState=>[0,0,0,0,0,0,0])

		this.boardStates = new Array(9).fill(0);

	}
	clone() {
		let cloneGrid = new Grid();
		cloneGrid.cells = this.cells.map((cellValue)=>cellValue);
		cloneGrid.history = [...this.history];
		cloneGrid.sPlayer = this.sPlayer;
		cloneGrid.this.lastStep = this.lastStep;
		cloneGrid.stepCount = this.stepCount;

		cloneGrid.cellStates = this.cellStates.map(cellState=>cellState.map(state=>state));
		cloneGrid.boardStates = this.boardStates.map(boardState=>boardState)

		return cloneGrid; 
	}
	set(x,y,value=EMPTY) {
		if (x>=0&&x<9&&y>=0&&y<9)
			this.cells[x+9*y]=value;
		else return 0;
		if (value!=EMPTY) {
			this.stepCount++;
			this.lastStep = {x:x,y:y};
			this.evalMiniboard(this.lastStep.x,this.lastStep.y);
			this.history = [...this.history, {x:x,y:y}];
		}
		return 1;
	}

	get(x,y) {
		if (x>=0&&x<9&&y>=0&&y<9)
			return this.cells[x+9*y];
		else return null;
	}

	getState(x,y) {
		if (x>=0&&x<9&&y>=0&&y<9)
			return this.cellStates[x+9*y];
		else return null;
	}

	play(x,y) {
		this.set(x,y,PLAYER);
		print(y,x);
	}

	miniBoard(x,y) {
		let mX = Math.floor(x/3)*3;
		let mY = Math.floor(y/3)*3;
		let pnt= mX + mY*9
		let miniBoard = 
			[this.cells.slice(pnt + 0 ,pnt + 3)
			,this.cells.slice(pnt + 9 ,pnt + 12)
			,this.cells.slice(pnt + 18,pnt + 21)] ;
		return miniBoard;
	}

	stateBoard(x,y) {
		let sbX = Math.floor(x/3)*3;
		let sbY = Math.floor(y/3)*3;
		let pnt = sbX + sbY*9
		let stateBoard = 
			[this.cellStates.slice(pnt + 0 ,pnt + 3)
			,this.cellStates.slice(pnt + 9 ,pnt + 12)
			,this.cellStates.slice(pnt + 18,pnt + 21)] ;
		return stateBoard;
	}


	listValidActions() {
		let X = null
		let Y = null

		if (this.lastStep!=null){
			X=(this.lastStep.x%3)*3;
			Y=(this.lastStep.y%3)*3;
		}

		if (
			this.lastStep == null 
			|| this.boardStates[X/3+Y]!=EMPTY
			) 
		{
			console.error("Target board is unavailable",X/3,Y/3)
			return this.cells
				.map((cell,i)=>
				{	let x = i%9;
					let y = ~~(i/9);
					return cell==EMPTY
						&& this.boardStates[Math.floor(x/3)+Math.floor(y/3)*3]==EMPTY
						? {x:x,y:y}
						: null
				})
				.filter(cell=>cell)			
		}

		let validActions = new Array(9).fill(0)
		validActions = validActions
			.map((action,i)=>this.get(
				X+i%3,Y+~~(i/3))==EMPTY
					?{x:X+i%3,y:Y+~~(i/3)}:null)
			.filter(cell=>cell);
		return validActions;
			
	}

	evalMiniboard(x,y){
		let X = x%3;
		let Y = y%3;
		let miniBoardState = Array(9)
		for (let i=0;i<3;i++)for (let j=0;j<3;j++) {
			miniBoardState[i+j*3] = this.getState(X*3+i,Y*3+j).fill(0);
		}

		let miniBoard = this.miniBoard(x,y);
		TRIPLETS.map(triplet=>{
			let cellState;
			let values =[
				miniBoard[triplet[0].y][triplet[0].x]
				,miniBoard[triplet[1].y][triplet[1].x]
				,miniBoard[triplet[2].y][triplet[2].x]
				].sort();
			const stateIndex = STATEARRAY.findIndex(fValue=>
				fValue[0]==values[0]
				&&fValue[1]==values[1]
				&&fValue[2]==values[2]
			)
			if (stateIndex == 3) {
				this.boardStates[~~(x/3)+3*(~~(y/3))]=OPPONENT;
			}
			if (stateIndex == 6) {
				this.boardStates[~~(x/3)+3*(~~(y/3))]=PLAYER;
			}

			if (stateIndex>-1){
				
				for (let i=0;i<3;i++) {
					miniBoardState[triplet[i].x + 3 * triplet[i].y][stateIndex]++;
				}	
				
			}
		})
		if (miniBoard.flat()
				.find(cell=>cell==EMPTY)
				==undefined 
			&& this.boardStates[~~(x/3)+3*~~(y/3)]==0) 
		{
			this.boardStates[~~(x/3)+3*~~(y/3)]=FULL;
		}
		return this.boardStates; 
	}

	printBoard() {
		for (let i = 0;i<9;i++) {
			if (i%3==0)console.log("-".repeat(25));
			console.log(this
				.cells.slice(i*9,i*9+9)
				.map(cell=>cell==0?" ":cell==1?"O":"X")
				.join`::`
				.replace(/::/g,(x,i,j,k)=>i==7||i==16?"||":x));
			if (i==8)console.log("-".repeat(25));
		}
	}



	drawBoardState() {
		console.error("Board states:",this.boardStates.slice(0,3).join(` `));
		console.error("            :",this.boardStates.slice(3,6).join(` `))
		console.error("            :",this.boardStates.slice(6,9).join(` `))
	}

	drawStateBoard(x,y) {
		let states = this.stateBoard(x,y);
		console.error("Step, stateBoard:",x,y)
		console.error(states.map(line=>line.join`|`).join`\n`);

	}

}

function getInputs(gameGrid) {
	let row,col;
	[row,col] = readline().split` `.map(Number);
	gameGrid.set(col,row,OPPONENT);
	const validActionsNumber = parseInt(readline());
	let validActions = [];
	for (let i = 0;i<validActionsNumber;i++) {
		[row,col] = readline().split` `.map(Number);
		validActions[i]={x:col,y:row};
		
	}
	return validActions;
}

function monitorGame(game) {

	let bX = game.lastStep.x%3*3;
	let bY = game.lastStep.y%3*3;

	game.printBoard();

	console.error("Last step",gameState.lastStep);
	console.error("Target board: "
		,game.lastStep.x%3,game.lastStep.y%3 )
	
	game.drawBoardState();

	//game.drawStateBoard(bX,bY);

}

function decideAction(game) {
	let validActions = game.listValidActions();
	let vAStates = validActions.map(action=>game.getState(action.x,action.y))
	let index
	index = vAStates.findIndex(state=>state[5]>0);
	if (index == -1) {
		index = vAStates.findIndex(state=>state[2]>0);
	}
	if (index == -1) {
		index = vAStates.findIndex(state=>state[1]>1);
	}
	if (index == -1) {
		index = vAStates.findIndex(state=>state[4]>1);
	}
	if (index == -1) {
		index = Math.floor(Math.random()*validActions.length)
	}
	let step = validActions[index];

	return step;
}

gameState = new Grid();



