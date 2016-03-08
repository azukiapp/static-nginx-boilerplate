function City_generator(){
	function point(x, y, seed) {
		this.x = x;
		this.y = y;
		this.r = 1;
		this.seed = seed;

		this.to_connects = [];
		this.fr_connects = [];
		this.connects = [];
		this.center = null;
		this.temp = null;

		this.text = null;
	}

	function road(start,end){
		this.s = start;
		this.e = end;
	}

	function build() {
		this.hight = 100;
		this.c= {x:0,y:0};
		this.seed = 0;
		this.points = [];
		this.min_points_dist = 0;
		this.area = 0;
	}

	this.centers = [];
	this.points = [];
	this.roads = [];
	this.builds = [];
	this.mesh = [];
	this.state = 0;
	this.sx = 0;
	this.sy = 0;
	this.cx = 0;
	this.cy = 0;
	this.end = false;

	this.r_vision = 750;
	this.r_procc = 1150;

	this.func = function(){};

	this.initiate_city =function (x,y){
		this.centers = [];
		this.points = [];
		this.roads = [];
		this.builds = [];
		this.state = 0;
		this.sx = x;
		this.sy = y;
		this.end = false;

		ind = 0;
	}

	var ind = 0;
	var temp;
	var w = 8;
	this.calculate_city = function (){
		if (this.state == 0){
			var p_t = performance.now();
			for (var i=0;i<w*w;i++){
				var x = 3000/w * (((i%w)-w/2+0.5) + this.sx);
				var y = 3000/w * ((Math.floor(i/w)-w/2+0.5) + this.sy);
				var p = new point(x,y,v_random(x,y));
				this.centers.push(p)

				var r = random(p.seed*157)*150
				p.x += Math.cos(Math.PI*p.seed)*r;
				p.y += Math.sin(Math.PI*p.seed)*r;

				p.r = random(p.seed*33)*220+100;
			}
			console.log("state_"+this.state+": "+ (performance.now() - p_t));
			this.state++;
		}
		else 
		if (this.state == 1){
			var p_t = performance.now();
			//create roads points
			for (var i=0;i<this.centers.length;i++){
				var dist = Math.sqrt(Math.pow(this.centers[i].x-this.sx*3000/w,2) + Math.pow(this.centers[i].y-this.sy*3000/w,2));
				var seed = this.centers[i].seed;
				
				var type =  random(seed+221.9)>0.3?1:0;
				if (type) { // rectangle type
					var w_s = 40 + random(seed+623)*40;
					var h_s = 50 + random(seed-231)*40;
					var rad = ind*h_s;
					var max = Math.round(this.centers[i].r/h_s)*h_s*2;

					if (dist<this.r_procc && rad<max) {
						var cnt = Math.round(random(seed+31)*6)+3;
						var an = random(seed)*Math.PI*2;;
						for (var j=0;j<cnt;j++){
							var x = this.centers[i].x + Math.cos(an)*(ind - max/h_s/2)*h_s + Math.cos(an+Math.PI/2)*(j-cnt/2+0.5)*w_s;
							var y = this.centers[i].y + Math.sin(an)*(ind - max/h_s/2)*h_s + Math.sin(an+Math.PI/2)*(j-cnt/2+0.5)*w_s;
							var p = new point(x,y,v_random(x,y));

							var r = random(p.seed*157)*4
							p.x += Math.cos(Math.PI*2*p.seed)*r;
							p.y += Math.sin(Math.PI*2*p.seed)*r;

							p.center = this.centers[i];

							this.points.push(p);
						}
					}
				}
				else{ // circle type
					var rad = Math.pow(ind,1.5)*30+Math.round(seed*3)*10;
					var max = this.centers[i].r

					if (dist<this.r_procc && rad<max) {
						var cnt = Math.pow(ind,1.5)*4+Math.round(seed*3)// + Math.round(this.centers[i].r/50);
						var temp = [];
						
						for (var j=0;j<cnt;j++){
							var an = random(seed)*Math.PI*2;
							var x = this.centers[i].x + Math.cos(j/cnt*Math.PI*2+an)*(rad)
							var y = this.centers[i].y + Math.sin(j/cnt*Math.PI*2+an)*(rad)
							var p = new point(x,y,v_random(x,y));

							var r = random(p.seed*157)*4
							p.x += Math.cos(Math.PI*2*p.seed)*r;
							p.y += Math.sin(Math.PI*2*p.seed)*r;

							p.center = this.centers[i];

							this.points.push(p);
						}
					}
				}
			}

			ind++;

			console.log("state_"+this.state+": "+ (performance.now() - p_t));

			if (ind>=10) {
				this.state++; 
				ind = 0;
			}
		}
		else
		if (this.state == 2){
			var p_t = performance.now();
			//delete excess roads points
			for (var j=0;j<15;j++){
				if (ind<this.points.length) {
					var p = this.points[ind];

					for (var i=0;i<this.points.length;i++){
						if (i!=ind){
							var dist = Math.sqrt(Math.pow(this.points[ind].x - this.points[i].x,2) + Math.pow(this.points[ind].y - this.points[i].y,2));

							if (dist<40){
								this.points.splice(ind, 1);
								ind--;
								break;
							}
						}
					}
					
					ind++;
				}
			}

			console.log("state_"+this.state+": "+ (performance.now() - p_t));

			if (ind>=this.points.length) {
				this.state++; 
				ind = 0;
			}
		}
		else
		if (this.state == 3){
			var p_t = performance.now();
			//connect road points
			for (var k=0;k<5;k++){
				if (ind<this.points.length) {
					var p = this.points[ind];
					for (var j=0;j<2;j++){
						var min = Number.MAX_SAFE_INTEGER;
						var min_i = -1;
						var b = false;
						for (var i=0;i<this.points.length;i++){
							if (i!=ind){
								var dist = Math.sqrt(Math.pow(this.points[ind].x - this.points[i].x,2) + Math.pow(this.points[ind].y - this.points[i].y,2));
								
								var d_an = Math.PI*2;
								var an_1 = Math.atan2(this.points[ind].y - this.points[i].y,this.points[ind].x - this.points[i].x);
								var curr = this.points[ind];
								curr.to_connects.forEach(function (c) {
									var an_2 = Math.atan2(curr.y - c.y,curr.x - c.x);

									an = Math.abs(an_2-an_1);
									an = an > Math.PI ? Math.PI*2 - an : an;
									an = Math.abs(an)%Math.PI;

									if (an<d_an) d_an = an;
								})

								curr.fr_connects.forEach(function (c) {
									var an_2 = Math.atan2(curr.y - c.y,curr.x - c.x);

									an = Math.abs(an_2-an_1);
									an = an > Math.PI ? Math.PI*2 - an : an;
									an = Math.abs(an)%Math.PI;

									if (an<d_an) d_an = an;
								})

								var max_d = 90;

								if (dist<min && dist<max_d && d_an>Math.PI*0.4 && 
									this.points[ind].to_connects.indexOf(this.points[i]) == -1 && 
									this.points[ind].fr_connects.indexOf(this.points[i]) == -1) {
									min = dist;
									min_i = i;
								}
							}
						}
						if (b) break;
						if (min_i!=-1){
							var len = this.points[ind].to_connects.length + this.points[ind].fr_connects.length;
							//var lec = this.points[min_i].to_connects.length + this.points[min_i].fr_connects.length;

							if (len<4){
								this.points[ind].to_connects.push(this.points[min_i]);
								this.points[min_i].fr_connects.push(this.points[ind]);

								this.roads.push(new road(this.points[ind],this.points[min_i]));
								this.points[ind].connects.push(this.roads[this.roads.length-1]);
								this.points[min_i].connects.push(this.roads[this.roads.length-1]);
							}
						}
					}

					ind++;
				}
			}

			console.log("state_"+this.state+": "+ (performance.now() - p_t));

			if (ind>=this.points.length) {
				this.state++; 
				ind = 0;
			}
		}
		else
		if (this.state == 4){
			var p_t = performance.now();
			//sorting roads of points
			for (var i=0;i<this.points.length;i++){
				var curr = this.points[i];
				curr.connects.sort(function (a, b) {
					var s; 
					s = curr != a.s?a.s:a.e;
					var an_0 = Math.atan2(s.y - curr.y,s.x - curr.x);

					s = curr != b.s?b.s:b.e;
					var an_1 = Math.atan2(s.y - curr.y,s.x - curr.x);

					if (an_0 > an_1) {
						return 1;
					}
					if (an_0 < an_1) {
						return -1;
					}

					return 0;
				});
			}

			console.log("state_"+this.state+": "+ (performance.now() - p_t));
			this.state++;
		}
		else
		if (this.state == 5){
			var p_t = performance.now();
			//create buildings 
			for (var i=0;i<200;i++){
				if (ind<this.points.length) {
					var curr = this.points[ind];
					ind++;
					var dist = Math.sqrt(Math.pow(curr.x-this.sx*3000/w,2) + Math.pow(curr.y - this.sy*3000/w,2));
					var len = curr.connects.length;
					if (len>=2 && dist<this.r_procc){
						for (var j=0;j<len;j++){
							var k = (j+1)%len

							var an_0;
							var an_1;


							an_0 = Math.atan2(curr.connects[j].s.y - curr.connects[j].e.y,curr.connects[j].s.x - curr.connects[j].e.x);
							an_1 = Math.atan2(curr.connects[k].s.y - curr.connects[k].e.y,curr.connects[k].s.x - curr.connects[k].e.x);

							if (curr.connects[j].s==curr){
								an_0 = an_0-Math.PI;
								an_0 = an_0  < -Math.PI ? Math.PI*2 + an_0 : an_0;
							}

							if (curr.connects[k].s==curr){
								an_1 = an_1-Math.PI;
								an_1 = an_1  < -Math.PI ? Math.PI*2 + an_1 : an_1;
							}

							var ds_0 = Math.sqrt(Math.pow(curr.connects[j].s.x - curr.connects[j].e.x,2) + Math.pow(curr.connects[j].s.y - curr.connects[j].e.y,2));
							var ds_1 = Math.sqrt(Math.pow(curr.connects[k].s.x - curr.connects[k].e.x,2) + Math.pow(curr.connects[k].s.y - curr.connects[k].e.y,2));
							var c_an = Math.abs(an_1-an_0)  > Math.PI ? Math.PI*2 - Math.abs(an_1-an_0) : Math.abs(an_1-an_0);
							//var cj_an = (an_1-an_0)  > Math.PI ? Math.PI*2 - (an_1-an_0) : (an_1-an_0);
							var p_an = 1/Math.pow(c_an/Math.PI,0.5);
							if (!c_an<Math.PI/2*0.9){

								var an = (an_0+an_1)/2
								if (k==0) {
									an = an-Math.PI;
									var a = an_0;
									var d = ds_0
									an_0 = an_1;
									ds_0 = ds_1;
									an_1 = a;
									ds_1 = d;
								}

								
								var rad;

								rad = 8*p_an;
								var x = curr.x + Math.cos(an)*rad
								var y = curr.y + Math.sin(an)*rad
								var p1 = new point(x,y,v_random(x,y));

								var nz = Math.min(Math.abs(an-an_0),Math.abs(an-an_1))- Math.PI/2;
								//p1.text = (nz).toFixed(2);

								rad = 12 * p_an;
								var xs = x + Math.cos(an)*rad
								var ys = y + Math.sin(an)*rad
								var p2 = new point(xs,ys,v_random(xs,ys));

								var gh = 8 * Math.pow(Math.abs(nz),0.5) * Math.sign(nz);

								rad = ds_0/2 - 3 + gh;
								var xr = x + Math.cos(an_0)*rad
								var yr = y + Math.sin(an_0)*rad
								var p3 = new point(xr,yr,v_random(xr,yr));

								rad = 12 * Math.sign(an-an_0);
								var xr = xr + Math.cos(an_0+Math.PI/2)*rad
								var yr = yr + Math.sin(an_0+Math.PI/2)*rad
								var p4 = new point(xr,yr,v_random(xr,yr));

								rad = ds_1/2 - 3 + gh;
								var xl = x + Math.cos(an_1)*rad
								var yl = y + Math.sin(an_1)*rad
								var p5 = new point(xl,yl,v_random(xl,yl));

								rad = 12 * Math.sign(an-an_0);
								var xl = xl + Math.cos(an_1-Math.PI/2)*rad
								var yl = yl + Math.sin(an_1-Math.PI/2)*rad
								var p6 = new point(xl,yl,v_random(xl,yl));


								var d = Math.sqrt(Math.pow(curr.center.x - p1.x,2)+Math.pow(curr.center.y-p1.y,2))
								var hight = Math.min(Math.pow(1/(d/200+1),3)*100,90) //random(p1.seed)*80+20;

								hight = random(p1.seed)*hight*0.6+hight*0.4+10;
								var b = new build();

								b.hight = hight;
								rad = 1*p_an;
								b.c.x = xs;
								b.c.y = ys;
								b.seed = p1.seed+curr.seed;

								if ((ds_0/2 - 3 + gh)>10 && (ds_1/2 - 3 + gh)>10){
									if (Math.sign(an-an_0)>0){
										p1.to_connects.push(p3)
										p3.fr_connects.push(p1)

										p3.to_connects.push(p4)
										p4.fr_connects.push(p3)

										p4.to_connects.push(p2)
										p2.fr_connects.push(p4)

										p2.to_connects.push(p6)
										p6.fr_connects.push(p2)

										p6.to_connects.push(p5)
										p5.fr_connects.push(p6)

										p5.to_connects.push(p1)
										p1.fr_connects.push(p5)

										b.points.push(p1,p3,p4,p2,p6,p5);
									}
									else{
										p1.to_connects.push(p5)
										p5.fr_connects.push(p1)

										p5.to_connects.push(p6)
										p6.fr_connects.push(p5)

										p6.to_connects.push(p2)
										p2.fr_connects.push(p6)

										p2.to_connects.push(p4)
										p4.fr_connects.push(p2)

										p4.to_connects.push(p3)
										p3.fr_connects.push(p4)

										p3.to_connects.push(p1)
										p1.fr_connects.push(p3)

										b.points.push(p1,p5,p6,p2,p4,p3)
									}

									
									this.builds.push(b);
								}
							}
						}
					}
				}
			}

			console.log("state_"+this.state+": "+ (performance.now() - p_t));

			if (ind>=this.points.length) {
				this.state++; 
				ind = 0;
			}
		}
		else
		if(this.state == 6){
			this.func();
		}
		else{
			this.cx = this.sx;
			this.cy = this.sy;
			this.end = true;
		}
	}
}

function random(seed) {
	var x = Math.sin(seed) * 10000;
	return x - Math.floor(x);
}

function v_random(sx,sy) {
	var x = Math.sin((sx*61.1)+(sy*-32.8))*10000
	return x - Math.floor(x);
}

function lineIntersect(x1,y1,x2,y2, x3,y3,x4,y4) {
	var x=((x1*y2-y1*x2)*(x3-x4)-(x1-x2)*(x3*y4-y3*x4))/((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
	var y=((x1*y2-y1*x2)*(y3-y4)-(y1-y2)*(x3*y4-y3*x4))/((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
	if (isNaN(x)||isNaN(y)) {
		return {r:false,x:0,y:0};
	} else {
		if (x1>=x2) {
			if (!(x2<=x&&x<=x1)) {return {r:false,x:0,y:0};}
		} else {
			if (!(x1<=x&&x<=x2)) {return {r:false,x:0,y:0};}
		}
		if (y1>=y2) {
			if (!(y2<=y&&y<=y1)) {return {r:false,x:0,y:0};}
		} else {
			if (!(y1<=y&&y<=y2)) {return {r:false,x:0,y:0};}
		}
		if (x3>=x4) {
			if (!(x4<=x&&x<=x3)) {return {r:false,x:0,y:0};}
		} else {
			if (!(x3<=x&&x<=x4)) {return {r:false,x:0,y:0};}
		}
		if (y3>=y4) {
			if (!(y4<=y&&y<=y3)) {return {r:false,x:0,y:0};}
		} else {
			if (!(y3<=y&&y<=y4)) {return {r:false,x:0,y:0};}
		}
	}
	return {r:true,x,y};
}