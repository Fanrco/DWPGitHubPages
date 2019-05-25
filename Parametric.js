function setup(){
	cnv=createCanvas(420,420,WEBGL);
	cnv.parent('Threedee');
	background(0);

	showInputs();
	formulax=fxbox.value();
	formulay=fybox.value();
	formulaz=fzbox.value();
	tstart=float(ysbox.value());
	tend=float(yebox.value());
	vstart=float(xsbox.value());
	vend=float(xebox.value());
	subdivs=float(subox.value());
	xsub=(tend-tstart)/float(subdivs);
	ysub=(tend-tstart)/float(subdivs);
	xscl=float(xsclbox.value());
	yscl=float(ysclbox.value());
	zscl=float(zsclbox.value());
	g=[];

	pad=10;

	zmax=1;
	zmin=0;
	noStroke();
   
}

function draw(){
	background(0);
	orbitControl();
	for(q=0;q<g.length;q++){
		g[q].showPoints();
	}
}
function Grapher(){
	//update values before graphing
	UpdateGraph();

	newg=new Graph3D(formulax,formulay,formulaz);
	newg.getPoints();
	g.push(newg);
}
function clearGraph(){
	g=[];
}

function UpdateGraph(){
	formulax=fxbox.value();
	formulay=fybox.value();
	formulaz=fzbox.value();
	tstart=float(ysbox.value());
	tend=float(yebox.value());
	vstart=float(xsbox.value());
	vend=float(xebox.value());
	subdivs=float(subox.value());
	xsub=(tend-tstart)/float(subdivs);
	ysub=(vend-vstart)/float(subdivs);
	xscl=float(xsclbox.value());
	yscl=float(ysclbox.value());
	zscl=float(zsclbox.value());
}

function Graph3D(formx,formy,formz){
	this.formulax=formx;
	this.formulay=formy;
	this.formulaz=formz;
	this.points=[];
	this.zmax=-Infinity;
	this.zmin=Infinity;

	this.getPoints=function(){
		xindex=0;
		for(t=tstart;t<tend;t+=xsub){
		yindex=0;
		this.points[xindex]=[];
		for(v=vstart;v<vend;v+=ysub){
			x=eval(this.formulax);
			y=eval(this.formulay);
			z=eval(this.formulaz);
			ploc=[x,y,z];
			this.points[xindex][yindex]=ploc;
			if(ploc[2]>this.zmax){
				this.zmax=ploc[2];
			}else if(ploc[2]<this.zmin){
				this.zmin=ploc[2];
			}
			yindex++;
		}
		xindex++;
	}

	}

	this.showPoints=function(){
		push();
		pointLight(250, 250, 250, 0,0, 500);
		colorMode(HSB);
		for(i=0;i<this.points.length-1;i++){
		for(j=0;j<this.points[i].length-1;j++){
			p1=this.points[i][j];
			p2=this.points[i+1][j];
			p3=this.points[i+1][j+1];
			p4=this.points[i][j+1];

			fill(map(i*subdivs+j,0,subdivs*subdivs+subdivs,0,255),100,100);

			beginShape();
			vertex(p1[0]*xscl,p1[1]*yscl,p1[2]*zscl);
			vertex(p2[0]*xscl,p2[1]*yscl,p2[2]*zscl);
			vertex(p3[0]*xscl,p3[1]*yscl,p3[2]*zscl);
			vertex(p4[0]*xscl,p4[1]*yscl,p4[2]*zscl);
			endShape(CLOSE);
		}
	}
	pop();
	}
}


function showInputs(){
	txt1=createP('Equation X');
	txt1.parent('params');

	fxbox=createInput('(2+v*cos(t/2))*cos(t)');
	fxbox.parent('params');

	txt11=createP('Equation Y');
	txt11.parent('params');

	fybox=createInput('(2+v*cos(t/2))*sin(t)');
	fybox.parent('params');

	txt12=createP('Equation Z');
	txt12.parent('params');

	fzbox=createInput('v*sin(t/2)');
	fzbox.parent('params');

	spcer=createP('');
	spcer.parent('params');
	btn=createButton('plot');
	btn.mousePressed(Grapher);
	btn.parent('params');

	btn2=createButton('update');
	btn2.mousePressed(UpdateGraph);
	btn2.parent('params');

	btn3=createButton('clear');
	btn3.mousePressed(clearGraph);
	btn3.parent('params');

	txt3=createP('t start/end : v start/end');
	txt3.parent('params');

	ysbox=createInput("0");
	ysbox.size(20,20);
	ysbox.parent('params');

	yebox=createInput("6.4");
	yebox.size(20,20);
	yebox.parent('params');

	xsbox=createInput("-1");
	xsbox.size(20,20);
	xsbox.parent('params');

	xebox=createInput("1");
	xebox.size(20,20);
	xebox.parent('params');

	txt4=createP('subdivision: DO NOT EXCEED 100');
	txt4.parent('params');

	subox=createInput("50");
	subox.size(40,20);
	subox.parent('params');

	txt5=createP('scale: x y z');
	txt5.parent('params');

	xsclbox=createInput("40");
	xsclbox.size(40,20);
	xsclbox.parent('params');

	ysclbox=createInput("40");
	ysclbox.size(40,20);
	ysclbox.parent('params');

	zsclbox=createInput("40");
	zsclbox.size(40,20);
	zsclbox.parent('params');
}