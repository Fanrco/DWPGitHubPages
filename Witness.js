cols=5;
rows=5;
path=[]
grid=[];
thicc=80/rows;
px=0;
py=0;
blocks=[];
scl=100/rows;

density=0.3;
function setup(){
	cnv1=createCanvas(320,320);
	cnv1.parent('Witness');
	scl=height/rows;
	p=new Puzzle(22,27,270,270);
	origin=createVector(0,0);
	path=[origin];
	genBlocks();
}

function draw(){
	background(0);
	p.drawGrid();
	p.drawPath();
	p.drawBlocks();


}
function genBlocks(){
	for(i=0;i<cols;i++){
		blocks[i]=[];
		for(j=0;j<rows;j++){
			blocks[i][j]=0;
			if(random(0,1)<density){
				blocks[i][j]=1;
			}
			if(random(0,1)<density/2){
				blocks[i][j]=2;
			}
		}
	}
}
function keyPressed(){
	lx=px;
	ly=py;
	if(keyCode==UP_ARROW){
		py++;
		path[path.length]=createVector(px,py);
		
	}
	else if(keyCode==DOWN_ARROW){
		py--;
		path[path.length]=createVector(px,py);
	}
	else if(keyCode==LEFT_ARROW){
		px--;
		path[path.length]=createVector(px,py);
		}
	else if(keyCode==RIGHT_ARROW){
		px++;
		path[path.length]=createVector(px,py);
	}
	else if(keyCode==ENTER){
		findZones();
	}
	console.log(path[path.length-1]);
	//if player is attempting to backtrack, remove the current and previous path
	if(path.length>2){
		if(path[path.length-1].x==path[path.length-3].x &&
			path[path.length-1].y==path[path.length-3].y ){
			path.splice(-1,1);
			path.splice(-1,1);
		}
	}
	selfint=false;
	//check for intersections with self
	for(i=0; i<path.length-1; i++){
		if(path[i].x == path[path.length-1].x && path[i].y == path[path.length-1].y){
			selfint=true;
		}
	}
	if(px>rows || px<0 || py>cols || py<0 || selfint){
		path.splice(-1,1);
		px=lx;
		py=ly;
	}
}

function findZones(){
	//initialize a blank grid
	for(i=0;i<rows*2+1;i++){
		grid[i]=[];
		for(j=0;j<cols*2+1;j++){
			if(i==0 || i==rows*2 || j==0 || j==cols*2){
				grid[i][j]=1;
			}else{
				grid[i][j]=0;
			}
			
		}
	}
	console.log(grid);
	//for each point on the path color it black on the grid
	for(i=0;i<path.length;i++){
		grid[path[i].x*2][grid.length-1-path[i].y*2]=1;

		//check which direction the path is going, color acordingly
		if(i!=path.length-1){
			if(path[i].x==path[i+1].x){
				if(path[i].y>path[i+1].y){
					grid[path[i].x*2][grid.length-path[i].y*2]=1;
				}else{
					grid[path[i].x*2][grid.length-2-path[i].y*2]=1;
				}
			}else{
				if(path[i].x>path[i+1].x){
					grid[path[i].x*2-1][grid.length-1-path[i].y*2]=1;
				}else{
					grid[path[i].x*2+1][grid.length-1-path[i].y*2]=1;
				}
			}
		}
	}
	//apply floodfill 
	zonecolor=2;
	for(i=0;i<grid.length;i++){
		for(j=0;j<grid[i].length;j++){
			if(grid[i][j]==0){
				floodfill(i,j,0,zonecolor);
				zonecolor+=1;
			}
		}
	}

	zgrid=[];
	for(i=0;i<rows;i++){
		zgrid[i]=[];
		for(j=0;j<cols;j++){
			zgrid[i][j]=grid[i*2+1][j*2+1];
		}
	}

	//draw grid zones
	push();
	translate(520,50);
	colorMode(HSB);
	for(i=0;i<grid.length;i++){
		for(j=0;j<grid[i].length;j++){
			cval=grid[i][j];
			col=map(cval,0,zonecolor,255,0);
			fill(col,200,255);
			if(cval==1){
				fill(0);
			}
			rect(i*scl/4,j*scl/4,scl/4,scl/4);
		}
	}
	pop();

}

function floodfill(x,y,target,replace){
	if(target==replace){
		return;
	}
	if(grid[x][y]!=target){
		return;
	}
	grid[x][y]=replace;
	floodfill(x-1,y,target,replace);
	floodfill(x+1,y,target,replace);
	floodfill(x,y+1,target,replace);
	floodfill(x,y-1,target,replace);
}
function Puzzle(x,y,w,h){
	xscl=w/cols;
	yscl=h/rows;
	zones=[];

	this.drawGrid=function(){
	push();
	noStroke();
	fill(244, 176, 66);
	rect(x,y,w,h);
	stroke(255, 148, 10);
	strokeWeight(thicc);
	for(i=0;i<=cols;i++){
		line(x+i*xscl,y,x+i*xscl,y+h);
	}
	for(i=0;i<=rows;i++){
		line(x,y+i*yscl,x+w,y+i*yscl);
	}
	line(x+cols*xscl,y,x+cols*xscl+xscl/4,y-xscl/4)
	strokeWeight(thicc*2);
	point(x,rows*yscl+y);
	pop();
	}

	this.drawPath=function(){
	if(path.length!=0){
		push();
		strokeWeight(thicc);
		stroke(255);
		for(i=0;i<path.length-1;i++){
			line(path[i].x*xscl+x,w-path[i].y*yscl+y,path[i+1].x*xscl+x,w-path[i+1].y*yscl+y);
		}
		pop();
		}
	}
	this.drawBlocks=function(){
		noStroke();
	for(i=0;i<cols;i++){
		for(j=0;j<rows;j++){
			if(blocks[i][j]==1){
				fill(255);
				rect(x+i*xscl+xscl/4,y+j*yscl+xscl/4,xscl/2,xscl/2);
			}
			if(blocks[i][j]==2){
				fill(0);
				rect(x+i*xscl+xscl/4,y+j*yscl+xscl/4,xscl/2,xscl/2);
			}
		}
	}
	}

}
