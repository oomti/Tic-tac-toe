// on reset
	//create a 3x3 table with a div
	//fill each table with a 3x3 grid

let bigTable = Array(9);
let celltable = [];

var currentPlayer = Math.random()>.5?1:0;

function clicked(e) {
	console.error(this.id,a=this.id.match(/\d/g).map(x=>Number(x)), this.innerText);
	
	let cell = document.getElementById(`mainGrid_${a[0]}_${a[1]}`)
	if (gameState.get(a[1],a[0]) == EMPTY) {
		(gameState.set(a[1],a[0],currentPlayer+1));
		cell.innerText = currentPlayer ? "X" : "O";
		currentPlayer=!currentPlayer
	}
	console.log(gameState.listValidActions());
	updateBackgroundColors();
	gameState.printBoard();
}

function updateBackgroundColors() {
	let boardState = gameState.boardStates;
	let bgColors = ["white","red","blue","gray"];

	for (let j=0; j<9;j++) for (let i=0; i<9;i++) {
		let cell = document.getElementById(`mainGrid_${j}_${i}`);
		cell.bgColor = bgColors[boardState[~~(i/3)+3*~~(j/3)]];
	}
	let validActions = gameState.listValidActions();
	for (let i=0 ; i<validActions.length; i++) {
		let x= validActions[i].x;
		let y= validActions[i].y;
		let cell = document.getElementById(`mainGrid_${y}_${x}`);
		console.log(cell)
		cell.bgColor = "green";

	}
	for (i in gameState.boardStates) {
		switch(boardState[i]) {
			case 0:
				break;
			case 1: 
		}
	}
}

function subclicked(e) {
	console.error(this.id)
}

function makeTable() {
	createGrid(9,9,"container","mainGrid"); 
	
}

function createGrid(m,n,container,name) {
	let parent = document.getElementById(container);
	let table = document.createElement("table");
	table.id = name;
	parent.appendChild(table);
	let cells = [];
	for (let i = 0; i<n;i++) {
		let row=document.createElement("tr");
		row.className = "row flexbox";
		table.appendChild(row);
		table.className = "board";
		for (j=0; j<m;j++) {
			let cell = document.createElement("td");
			cell.id = name+`_${i}_${j}`;
			cell.className = "cell";
			cell.innerText=" ";
			cell.addEventListener("click",clicked);
			row.appendChild(cell);
			cells.push(cell);
		}
	}
} 

function fill(game) {
	for (let i=0;i<game.cells.length;i++) {
		
	}
}




