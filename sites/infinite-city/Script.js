
const C_ANTIALIAS_ON = false;
const C_PIXEL_RATIO = 1;
const C_CAMERA_FOV = 45;
const C_ROAD_CONST_PER_FRAME =75;
const C_BUILD_CONST_PER_FRAME = 100;


var cam_control
//Cursor hiding
{
	var blocker = document.getElementById( 'blocker' );
	var instructions = document.getElementById( 'instructions' );
	var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

	if ( havePointerLock ) {
		var element = document.body;
		var pointerlockchange = function ( event ) {

			if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
				controlsEnabled = true;
				cam_control.enabled = true;
				blocker.style.display = 'none';
			} else {
				cam_control.enabled = false;
				blocker.style.display = '-webkit-box';
				blocker.style.display = '-moz-box';
				blocker.style.display = 'box';
				instructions.style.display = '';
			}
		};

		var pointerlockerror = function ( event ) {
			instructions.style.display = '';
		};

		// Hook pointer lock state change events
		document.addEventListener( 'pointerlockchange', pointerlockchange, false );
		document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
		document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

		document.addEventListener( 'pointerlockerror', pointerlockerror, false );
		document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
		document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

		instructions.addEventListener( 'click', function ( event ) {
			instructions.style.display = 'none';
			// Ask the browser to lock the pointer
			element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

			if ( /Firefox/i.test( navigator.userAgent ) ) {
				var fullscreenchange = function ( event ) {
					if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {
						document.removeEventListener( 'fullscreenchange', fullscreenchange );
						document.removeEventListener( 'mozfullscreenchange', fullscreenchange );
						element.requestPointerLock();
					}
				};

				document.addEventListener( 'fullscreenchange', fullscreenchange, false );
				document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );
				element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
				element.requestFullscreen();
			} else {
				element.requestPointerLock();
			}
		}, false );
	} else {
		instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
	}
}

var pos_x = Math.round(Math.random()*100-50);
var pos_y = Math.round(Math.random()*100-50);

var c_pos_x = pos_x;
var c_pos_y = pos_y;

var trs =0;
var bls =0;
var lgs =0;
var gls =0;

var city;

function initStats() {
	var stats = new Stats();
	stats.setMode(0);
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.left = '0px';
	stats.domElement.style.top = '0px';
	$("#Stats-output").append(stats.domElement );
	return stats;
}

var clock = new THREE.Clock();
$(function () {
	//Deffault colors
	var l_fogColor = 0x220052; //bottom fog, sky and light color
	var m_fogColor = 0x996060; //middle fog and sky color
	var h_fogColor = 0x331E28; //top fog and sky color
	var mlt_Color = 0x221833; //light mix color

	//randomize colors
	var seed = Math.random();
	l_fogColor = "hsl("+random(seed)*360+", 100%,32%)";
	m_fogColor = "hsl("+Math.random()*360+", 37%, 60%)";
	h_fogColor = "hsl("+Math.random()*360+", 41%, 20%)";
	mlt_Color  = "hsl("+random(seed)*360+", 50%,20%)";


	var stats = initStats();
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(C_CAMERA_FOV , 
		window.innerWidth / window.innerHeight, 0.1, 950);
	var renderer = new THREE.WebGLRenderer({antialias:C_ANTIALIAS_ON});
	scene.fog = new THREE.Fog(l_fogColor, 0.01);
	renderer.setClearColor(0x000000);
	renderer.setPixelRatio(C_PIXEL_RATIO);
	renderer.setSize(window.innerWidth, window.innerHeight);

	var v3 = new THREE.Vector3( 0, 50, 1000)
	camera.lookAt(v3);

	//camera control
	cam_control = new THREE.PointerLockControls( camera );
	scene.add( cam_control.getObject() );

	var vertexShader = document.getElementById( 'vertexShader' ).textContent;
	var fragmentShader = document.getElementById( 'fragmentShader' ).textContent;
	var uniforms = {
		topColor: 	 { type: "c", value: new THREE.Color(h_fogColor) }, 
		middleColor: { type: "c", value: new THREE.Color(m_fogColor) },
		bottomColor: { type: "c", value: new THREE.Color(l_fogColor) },
		offset:		 { type: "f", value: 0 },
		exponent:	 { type: "f", value: 0.8 }
	};

	var skyGeo = new THREE.SphereGeometry( 750, 32, 15 );
	var skyMat = new THREE.ShaderMaterial( { vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniforms, side: THREE.BackSide } );

	var sky = new THREE.Mesh( skyGeo, skyMat );
	scene.add( sky );
	
	
	
	for (var i=0;i<600; i++){
		var color = new THREE.Color("hsl("+random(i)*360+", 100%, 70%)");
		var starMat = new THREE.MeshBasicMaterial({
			color: color, fog: false
		});
		var size = 0.5 + random(i)*1;
		var starGeo = new THREE.PlaneGeometry( size, size, 1 , 1);
		var star = new THREE.Mesh(starGeo,starMat);
		var beta = random(i-39482)*Math.PI*0.96-Math.PI/2*0.96
		var teta = random(i+38403)*Math.PI
		var rad = 740;

		star.position.x = Math.sin(beta)*Math.cos(teta)*rad
		star.position.z = Math.sin(beta)*Math.sin(teta)*rad
		star.position.y = Math.cos(beta)*rad

		star.lookAt(new THREE.Vector3( 0, 1, 0 ));
		sky.add( star );
	}
	
	
	var wnds_tex = []; 
	var phgs_tex = [];
	var stps_tex = [];
	var lgt;
	var glw;
	var cgt;

	var light_tex = new THREEx.DynamicTexture(1024,1024);
	var l_canvas = light_tex.canvas;
	var l_context = light_tex.context;
	l_context.fillStyle="black";
	l_context.fillRect(0, 0, l_canvas.width, l_canvas.height);

	var phong_tex = new THREEx.DynamicTexture(1024,1024);
	var r_canvas = phong_tex.canvas; 
	var r_context = phong_tex.context; 
	r_context.fillStyle="black";
	r_context.fillRect(0, 0, r_canvas.width, r_canvas.height);
	

	var mat_vertShader = document.getElementById( 'mat_vertShader' ).textContent;
	var mat_fragShader = document.getElementById( 'mat_fragShader' ).textContent;
	var part_vertShader = document.getElementById( 'part_vertShader' ).textContent;
	var part_fragShader = document.getElementById( 'part_fragShader' ).textContent;

	var white_tex  = new THREE.DataTexture(new Uint8Array([255,255,255,255]), 1, 1, THREE.RGBAFormat );
	white_tex .needsUpdate = true;
	var black_tex  = new THREE.DataTexture(new Uint8Array([0,0,0,255]), 1, 1, THREE.RGBAFormat );
	black_tex .needsUpdate = true;

	

	var ufrms_x = {
		a_texture: 	 { type: "tv", value: [black_tex] },
		a_phong_tex: { type: "tv", value: [black_tex] },  
		a_steps: 	 { type: "v2v",value: [new THREE.Vector2(1,1)] },
		light_tex: 	 { type: "t", value: black_tex },  
		light_offset:{ type: "v2",value: new THREE.Vector2(0,0) }, 
		camPos: 	 { type: "v3",value: new THREE.Vector3(0,150,0) }, 
		l_fogColor:  { type: "c", value: new THREE.Color(l_fogColor) },
		m_fogColor:  { type: "c", value: new THREE.Color(m_fogColor) },
		h_fogColor:  { type: "c", value: new THREE.Color(h_fogColor) },
		l_Color: 	 { type: "c", value: new THREE.Color(mlt_Color) },
		scale: 		 { type: "v2",value: new THREE.Vector2(1,1) },
		offset:		 { type: "v2",value: new THREE.Vector2(0,0) },
		fog:		 { type: "f", value: 1 }
	};
	var planeGeometry = new THREE.PlaneGeometry(5000,5000,1,1);
	var planeMaterial = new THREE.ShaderMaterial( { vertexShader: mat_vertShader, fragmentShader: mat_fragShader, uniforms:ufrms_x});
	planeGeometry.rotateX(-Math.PI/2);
	var b_plane = new THREE.Mesh(planeGeometry,planeMaterial);
	b_plane.position.set( 0, -1, 0);
	scene.add(b_plane);


	var ufrms = {
		a_texture: 	 { type: "tv", value: [black_tex] },
		a_phong_tex: { type: "tv", value: [phong_tex.texture] }, 
		a_steps: 	 { type: "v2v",value: [new THREE.Vector2(1,1)] },
		light_tex: 	 { type: "t", value: light_tex.texture }, 
		light_offset:{ type: "v2",value: new THREE.Vector2(0,0) },  
		camPos: 	 { type: "v3",value: new THREE.Vector3(0,150,0) }, 
		l_fogColor:  { type: "c", value: new THREE.Color(l_fogColor) },
		m_fogColor:  { type: "c", value: new THREE.Color(m_fogColor) },
		h_fogColor:  { type: "c", value: new THREE.Color(h_fogColor) },
		l_Color: 	 { type: "c", value: new THREE.Color(mlt_Color) },
		scale: 		 { type: "v2",value: new THREE.Vector2(1,1) },
		offset:		 { type: "v2",value: new THREE.Vector2(0,0) },
		fog:		 { type: "f", value: 1 }
	};
	var planeGeometry = new THREE.PlaneGeometry(2048,2048,1,1);
	var planeMaterial = new THREE.ShaderMaterial( { vertexShader: mat_vertShader, fragmentShader: mat_fragShader, uniforms:ufrms});
	planeGeometry.rotateX(-Math.PI/2);
	var plane = new THREE.Mesh(planeGeometry,planeMaterial);
	plane.position.set( 0, 0, 0);
	scene.add(plane);

	var loader = new THREE.TextureLoader();
	loader.crossOrigin = '';
	var filter = THREE.LinearFilter; 

	//windows textures
	loader.load( 'http://i.imgur.com/6Ep7TLh.png?1', function ( texture ) {
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.minFilter = filter;
		texture.needsUpdate = true;
		wnds_tex[0] = texture;
		stps_tex[0] = new THREE.Vector2(6,6);
	} );

	loader.load( 'http://i.imgur.com/hPYcQGS.png?1', function ( texture ) {
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.minFilter = filter;
		phgs_tex[0] = texture;
	} );

	
	loader.load( 'http://i.imgur.com/2Ha62gu.jpg?1', function ( texture ) {
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.minFilter = filter;
		texture.needsUpdate = true;
		wnds_tex[1] = texture;
		stps_tex[1] = new THREE.Vector2(10,8);
	} );

	loader.load( 'http://i.imgur.com/dSZAisP.png?1', function ( texture ) {
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.minFilter = filter;
		texture.needsUpdate = true;
		phgs_tex[1] = texture;
	} );


	loader.load( 'http://i.imgur.com/cYQ3IEb.jpg?1', function ( texture ) {
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.minFilter = filter;
		texture.needsUpdate = true;
		wnds_tex[2] = texture;
		stps_tex[2] = new THREE.Vector2(8,4);
	} );

	loader.load( 'http://i.imgur.com/Zc783pY.jpg?1', function ( texture ) {
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.minFilter = filter;
		texture.needsUpdate = true;
		phgs_tex[2] = texture;
	} );


	
	//Streetlights glow
	loader.load( 'http://i.imgur.com/m6bpRF7.png?1', function ( texture ) {
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.minFilter = THREE.NearestFilter;
		texture.needsUpdate = true;
		glw = texture;
	} );


	//LIGHT from streetlights 
	loader.load( 'http://i.imgur.com/kg8DjTm.png?1', function ( texture ) {
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.minFilter = THREE.NearestFilter;
		texture.needsUpdate = true;
		lgt = texture;
	} );


	cam_control.getObject().position.set(pos_x*375,120,pos_y*375);
	var city = new City_generator();
	city.initiate_city(pos_x,pos_y);
	

	var particleSystem  = null;

	var mesh = null;

	var f_state = 0;
	var buildings_geo = new THREE.BufferGeometry();
	var geometry = new THREE.BufferGeometry();

	var max = 50000;
	var positions = new Float32Array(max * 3);
	var colors = new Float32Array(max * 3);
	var sizes = new Float32Array(max);

	var max_triangles = 350000;
	var buildings_pos = new Float32Array( max_triangles * 3 * 3 );
	var buildings_nrm = new Float32Array( max_triangles * 3 * 3 );
	var buildings_uVu = new Float32Array( max_triangles * 3 * 2 );
	var buildings_scale = new Float32Array( max_triangles * 2 );
	var buildings_shift = new Float32Array( max_triangles * 1 );

	var positions_b;
	var normals_b;
	var uv_b;
	var scale_b;
	var shift_b;


	var i = 0;
	var b_i = 0;

	var c_b = 0;
	var c_r = 0;
	var rend_func = function(){

		//draw road/add lights function

		var len = 15;
		var rad = 10;
		var d_road_light = function (r) {
			var s = new Object();
			var e = new Object();

			s.x = r.s.x-pos_x*375;
			s.y = r.s.y-pos_y*375;

			e.x = r.e.x-pos_x*375;
			e.y = r.e.y-pos_y*375;

			r.r = Math.sqrt(Math.pow(r.s.x-r.e.x,2) + Math.pow(r.s.y-r.e.y,2))+6;
			r.a = Math.atan2(r.e.y-r.s.y, r.e.x-r.s.x);

			s.x = s.x - 3 * Math.cos(r.a);
			s.y = s.y - 3 * Math.sin(r.a);


			r_context.beginPath();
			r_context.moveTo(s.x/2 + r_canvas.width/2, s.y/2+ r_canvas.height/2);
			r_context.lineTo(s.x/2 + r.r/2 * Math.cos(r.a)+ r_canvas.width/2, s.y/2 + r.r/2 * Math.sin(r.a)+ r_canvas.height/2);
			r_context.strokeStyle = "#333";
			r_context.lineWidth = 12/2;
			r_context.stroke();

			for ( var j = 1; j < r.r/len-1; j ++ ) {
				gls +=2;
				lgs +=2;
				var px = r.s.x + j * Math.cos(r.a) * len + Math.cos(r.a + Math.PI/2) *5;
				var py = 8;
				var pz = r.s.y + j * Math.sin(r.a) * len + Math.sin(r.a + Math.PI/2) *5;


				var col = v_random(px,pz)*360;
				var rgb 

				rgb = hslToRgb(col/360,1,0.8);

				var t_rgb = Math.round(rgb[0]) + ","+
							Math.round(rgb[1]) + ","+
							Math.round(rgb[2]);

				positions[ i ]     = px;
				positions[ i + 1 ] = py;
				positions[ i + 2 ] = pz;

				colors[ i ]   = rgb[0]/255;
				colors[ i+1 ] = rgb[1]/255;
				colors[ i+2 ] = rgb[2]/255; 

				sizes[i/3] = 10;

				i+=3;

				px = px/2 - pos_x*375/2;
				pz = pz/2 - pos_y*375/2;

				l_context.beginPath();
				var grd=l_context.createRadialGradient(px + l_canvas.width/2,-pz + l_canvas.height/2,rad/2,px + l_canvas.width/2,-pz + l_canvas.height/2,1);	
				grd.addColorStop(0,"rgba("+t_rgb+", 0)");
				grd.addColorStop(1,"rgba("+t_rgb+", 1)");	
				l_context.arc(px + l_canvas.width/2, -pz + l_canvas.height/2, rad/2, 0, 2 * Math.PI);
				l_context.fillStyle=grd;
				l_context.fill();


				var px = r.s.x + j * Math.cos(r.a) * len + Math.cos(r.a - Math.PI/2) *5;
				var py = 8;
				var pz = r.s.y + j * Math.sin(r.a) * len + Math.sin(r.a - Math.PI/2) *5;

				positions[ i ]     = px;
				positions[ i + 1 ] = py;
				positions[ i + 2 ] = pz;

				colors[ i ]   = rgb[0]/255;
				colors[ i+1 ] = rgb[1]/255;
				colors[ i+2 ] = rgb[2]/255; 

				sizes[i/3] = 10;

				i+=3;

				px = px/2 - pos_x*375/2;
				pz = pz/2 - pos_y*375/2;

				l_context.beginPath();
				var grd=l_context.createRadialGradient(px + l_canvas.width/2,-pz + l_canvas.height/2,rad/2,px + l_canvas.width/2,-pz + l_canvas.height/2,1);	
				grd.addColorStop(0,"rgba("+t_rgb+", 0)");
				grd.addColorStop(1,"rgba("+t_rgb+", 1)");			
				l_context.arc(px + l_canvas.width/2, -pz + l_canvas.height/2, rad/2, 0, 2 * Math.PI);
				l_context.fillStyle=grd;
				l_context.fill();
			}
		}

		//create buildings geometry
		var pA = new THREE.Vector3();
		var pB = new THREE.Vector3();
		var pC = new THREE.Vector3();

		var cb = new THREE.Vector3();
		var ab = new THREE.Vector3();

		var c_building = function (b) {
			bls +=1;

			b.points.forEach(function (point) {	
					trs +=2;

					var point_to = point.to_connects[0];
					var point_fr = point.fr_connects[0];

					var vs = [];
					var p_an_0 = Math.atan2(point_fr.y-point.y,point_fr.x-point.x);
					var c_an_0 = Math.atan2(point_to.y-point.y,point_to.x-point.x);
					var an_0 = (p_an_0+c_an_0)/2;
					if ((an_0-p_an_0)>0) an_0 = (an_0-p_an_0) - Math.PI + p_an_0;

					var hight = Math.round(b.hight/5)*5; 
				
					var p = new THREE.Vector2(	point.x , 
												point.y )
					var c = new THREE.Vector2(	point_to.x , 
												point_to.y )

					var j = 0;
					var s_h = hight/10*(j+1)
					var s_w = Math.round(Math.sqrt(Math.pow(p.y-c.y,2) + Math.pow(p.x-c.x,2))/10);
					s_w = Math.max(0.1,s_w);

					var ind = Math.round(random(hight)*1);

					vs = [];
					vs.push(	new THREE.Vector3(p.x, hight*j, p.y), 
								new THREE.Vector3(c.x, hight*j, c.y))
					vs.push(	new THREE.Vector3(p.x, hight*(j+1), p.y), 
								new THREE.Vector3(c.x, hight*(j+1), c.y));
					vs.push(	new THREE.Vector3(b.c.x, hight*(j+1), b.c.y));

					var d1 = vs[0].distanceTo(vs[1]);
					var d2 = vs[2].distanceTo(vs[3]);
					var ratio = d2/d1;

					var faces = [2,1,0, 1,2,3, 4,3,2];
					var nrms  = [1,1,1, 1,1,1, 0,1,0];
					var uv 	  = [	ratio,ratio, 	0,0, 			1,0, 
									0,0,			ratio,ratio, 	0,ratio, 	
									0,0,			0,0, 			0,0
								];

					for (var k=0; k<faces.length;k+=3){
						for (var l=0; l<3;l++){
							buildings_scale[(b_i/3+l)*2 ] = s_w;
							buildings_scale[(b_i/3+l)*2+1] = s_h;
							buildings_shift[(b_i/3+l)] = b.seed*10000;
						}


						buildings_pos[ b_i ]     = vs[faces[k]].x;
						buildings_pos[ b_i + 1 ] = vs[faces[k]].y;
						buildings_pos[ b_i + 2 ] = vs[faces[k]].z;

						buildings_pos[ b_i + 3 ] = vs[faces[k+1]].x;
						buildings_pos[ b_i + 4 ] = vs[faces[k+1]].y;
						buildings_pos[ b_i + 5 ] = vs[faces[k+1]].z;

						buildings_pos[ b_i + 6 ] = vs[faces[k+2]].x;
						buildings_pos[ b_i + 7 ] = vs[faces[k+2]].y;
						buildings_pos[ b_i + 8 ] = vs[faces[k+2]].z;

						var u_i = b_i/3*2;
						var kk = k/3*6;

						buildings_uVu[ u_i ]     = uv[kk];
						buildings_uVu[ u_i + 1 ] = uv[kk+1];

						buildings_uVu[ u_i + 2 ] = uv[kk+2];
						buildings_uVu[ u_i + 3 ] = uv[kk+3];

						buildings_uVu[ u_i + 4 ] = uv[kk+4];
						buildings_uVu[ u_i + 5 ] = uv[kk+5];

						pA.set( vs[0].x, vs[0].y, vs[0].z );
						pB.set( vs[1].x, vs[1].y, vs[1].z );
						pC.set( vs[2].x, vs[2].y, vs[2].z );

						ab.subVectors( pC, pB );
						cb.subVectors( pA, pB );
						cb.cross( ab );

						cb.normalize();
						
						var nx = cb.x;
						var ny = cb.y;
						var nz = cb.z;

						buildings_nrm[ b_i ]     = nx * nrms[k];
						buildings_nrm[ b_i + 1 ] = ny * nrms[k];
						buildings_nrm[ b_i + 2 ] = nz * nrms[k];

						buildings_nrm[ b_i + 3 ] = nx * nrms[k+1];
						buildings_nrm[ b_i + 4 ] = ny * nrms[k+1];
						buildings_nrm[ b_i + 5 ] = nz * nrms[k+1];

						buildings_nrm[ b_i + 6 ] = nx * nrms[k+2];
						buildings_nrm[ b_i + 7 ] = ny * nrms[k+2];
						buildings_nrm[ b_i + 8 ] = nz * nrms[k+2];

						b_i+=9;
					}
					
					
					if (random(vs[2].x*vs[2].z-21)<0.1)
					{
						gls +=1;
						var col = random(vs[2].x*vs[2].z+64)*360;
						var rgb = hslToRgb(col/360,1,0.7);

						var px = vs[2].x + Math.cos(an_0)*4;
						var py = hight*1.01+0.2;
						var pz = vs[2].z + Math.sin(an_0)*4;

						positions[ i ]     = px;
						positions[ i + 1 ] = py;
						positions[ i + 2 ] = pz;
						
						colors[ i ]   = rgb[0]/255;
						colors[ i+1 ] = rgb[1]/255;
						colors[ i+2 ] = rgb[2]/255;

						sizes[i/3] = 3+Math.random()*5;

						i+=3;
					}
			});
		}

		if (f_state==0) 
		{
			var p_t = performance.now();

			trs =0;
			bls =0;
			lgs =0;
			gls =0;

			c_b=0;
			c_r=0;

			var color = new THREE.Color();

			var n = 1000, n2 = n / 2; 

			r_context.fillStyle="#111";
			r_context.fillRect(0, 0, r_canvas.width, r_canvas.height);

			l_context.fillStyle="black";
			l_context.fillRect(0, 0, l_canvas.width, l_canvas.height);

			console.log("f_state_"+f_state+": "+ (performance.now() - p_t));
			f_state++;
		}
		else
		if (f_state==1) //it divided on steps to save high performance rendering
		{
			var p_t = performance.now();

			if (c_r ==0 ) i = 0;

			var s = c_r;
			var e = c_r + C_ROAD_CONST_PER_FRAME;
			if (e>city.roads.length) e = city.roads.length;
			
			for (var k = s; k < e; k++) {
				d_road_light(city.roads[k]);
			}
			c_r = e;

			console.log("f_state_"+f_state+": "+ (performance.now() - p_t));
			if (c_r == city.roads.length) f_state++;
		}
		else
		if (f_state==2){
			var p_t = performance.now();
			
			if (c_b ==0 ) b_i = 0;

			var s = c_b;
			var e = c_b + C_BUILD_CONST_PER_FRAME;
			if (e>city.builds.length) e = city.builds.length;
			
			for (var k = s; k < e; k++) {
				c_building(city.builds[k]);
			}
			c_b = e;


			console.log("f_state_"+f_state+": "+ (performance.now() - p_t));
			if (c_b == city.builds.length) f_state++;
		}
		else
		if (f_state==3){
			var p_t = performance.now();

			positions_b = buildings_pos.slice(0, b_i);

			console.log("f_state_"+f_state+": "+ (performance.now() - p_t));
			f_state++;
		}
		else
		if (f_state==4){
			var p_t = performance.now();

			normals_b = buildings_nrm.slice(0, b_i);

			console.log("f_state_"+f_state+": "+ (performance.now() - p_t));
			f_state++;
		}
		else
		if (f_state==5){
			var p_t = performance.now();

			uv_b = buildings_uVu.slice(0, b_i/3*2);

			console.log("f_state_"+f_state+": "+ (performance.now() - p_t));
			f_state++;
		}
		else
		if (f_state==6){
			var p_t = performance.now();

			scale_b = buildings_scale.slice(0, b_i/9*2);

			console.log("f_state_"+f_state+": "+ (performance.now() - p_t));
			f_state++;
		}
		else
		if (f_state==7){
			var p_t = performance.now();

			shift_b = buildings_shift.slice(0, b_i/9);

			console.log("f_state_"+f_state+": "+ (performance.now() - p_t));
			f_state++;
		}
		else
		if (f_state==8){
			var p_t = performance.now();

			buildings_geo.addAttribute( 'position', new THREE.BufferAttribute( positions_b, 3 ) );
			buildings_geo.addAttribute( 'normal', new THREE.BufferAttribute( normals_b, 3 ) );
			buildings_geo.addAttribute( 'uv', new THREE.BufferAttribute( uv_b, 2 ) );
			buildings_geo.addAttribute( 'scale_', new THREE.BufferAttribute( buildings_scale, 2 ) );
			buildings_geo.addAttribute( 'shift_', new THREE.BufferAttribute( buildings_shift, 1 ) );

			buildings_geo.computeBoundingSphere();

			console.log("f_state_"+f_state+": "+ (performance.now() - p_t));
			f_state++;
		}
		else
		if (f_state==9){
			c_pos_x = pos_x;
			c_pos_y = pos_y;

			var p_t = performance.now();
			var ufrm = {
				a_texture: 	 { type: "tv", value: wnds_tex }, 
				a_phong_tex: { type: "tv", value: phgs_tex },
				a_steps: 	 { type: "v2v",value: stps_tex }, 
				light_tex: 	 { type: "t", value: light_tex.texture },
				light_offset:{ type: "v2",value: new THREE.Vector2(c_pos_x*375,c_pos_y*375) },
				camPos: 	 { type: "v3",value: cam_control.getObject().position }, 
				l_fogColor:  { type: "c", value: new THREE.Color(l_fogColor) },
				m_fogColor:  { type: "c", value: new THREE.Color(m_fogColor) },
				h_fogColor:  { type: "c", value: new THREE.Color(h_fogColor) },
				l_Color: 	 { type: "c", value: new THREE.Color(mlt_Color) },
				offset:		 { type: "v2",value: new THREE.Vector2(0,0) },
				fog:		 { type: "f", value: 1 },
			};

			var material = new THREE.ShaderMaterial( { vertexShader: mat_vertShader, fragmentShader: mat_fragShader, uniforms:ufrm} );
			

			scene.remove( city.mesh );
			city.mesh = new THREE.Mesh( buildings_geo, material );
			scene.add( city.mesh );

			var positions_n = positions.slice(0, i);
			var colors_n = colors.slice(0, i);
			var sizes_n = sizes.slice(0, i/3);

			geometry.addAttribute( 'position', 	new THREE.BufferAttribute( positions_n, 3 ) );
			geometry.addAttribute( 'col', 		new THREE.BufferAttribute( colors_n, 3 ) );
			geometry.addAttribute( 'size', 		new THREE.BufferAttribute( sizes_n, 1 ) );

			geometry.computeBoundingSphere();

			var ufrm_x = {
				color:     { type: "c", value: new THREE.Color( 0xffffff ) },
				texture:   { type: "t", value: glw }
			};

			var material = new THREE.ShaderMaterial( { 
				vertexShader: 	part_vertShader, 
				fragmentShader: part_fragShader, 
				blending:       THREE.AdditiveBlending,
				transparent:    true,
				depthTest:      true,
				uniforms: 		ufrm_x} );

			
			scene.remove( particleSystem );
			particleSystem = new THREE.Points( geometry, material );
			scene.add( particleSystem );
			
			phong_tex.texture.needsUpdate = true;
			light_tex.texture.needsUpdate = true;
	
			console.log("f_state_"+f_state+": "+ (performance.now() - p_t));
			f_state++;
		}
		else{
			f_state = 0;
			city.state++;
		}
	}

	city.func = rend_func;

	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	}
	window.addEventListener( 'resize', onWindowResize, false );

	function renderScene() {
		var delta = clock.getDelta();

		var x = cam_control.getObject().position.x;
		var y = cam_control.getObject().position.z;
		
		//print inf0
		document.getElementById("info").innerHTML =
		"x: "+x.toFixed(2)+
		"</br> y: "+y.toFixed(2)+
		"</br> Triangles: "+trs+
		"</br> Buildings: "+bls+
		"</br> Lights: "+lgs+
		"</br> Glow points: "+gls;


		stats.update();
			
		
		cam_control.update(delta);


		var n_pos_x=Math.round(x/375);
		var n_pos_y=Math.round(y/375);


		//reconstruct city when it need
		if (!city.end) {
			city.calculate_city();
		}
		else
		if (pos_x != n_pos_x || pos_y != n_pos_y){
			city.initiate_city(n_pos_x,n_pos_y);
			f_state = 0;

			pos_x = n_pos_x;
			pos_y = n_pos_y;
		}

		//set sky and ground at the camera position		
		sky.position.x = x;
		sky.position.z = y;

		plane.position.x = c_pos_x*375;
		plane.position.z = c_pos_y*375;
		ufrms.camPos.value = new THREE.Vector3( x-c_pos_x*375, cam_control.getObject().position.y, y-c_pos_y*375);

		b_plane.position.x = x;
		b_plane.position.z = y;

		//sortPoints();		
		renderer.render(scene, camera);
		requestAnimationFrame(renderScene);
	}

	function sortPoints() {
		if (particleSystem!=null) {
			var vector = new THREE.Vector3();

			// Model View Projection matrix
			var matrix = new THREE.Matrix4();
			matrix.multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse );
			matrix.multiply( sphere.matrixWorld );

			var geometry = particleSystem.geometry;

			var index = geometry.getIndex();
			var positions = geometry.getAttribute( 'position' ).array;
			var length = positions.length / 3;

			if ( index === null ) {
				var array = new Uint16Array( length );
				for ( var i = 0; i < length; i ++ ) {
					array[ i ] = i;
				}
				index = new THREE.BufferAttribute( array, 1 );
				geometry.setIndex( index );
			}

			var sortArray = [];

			for ( var i = 0; i < length; i ++ ) {
				vector.fromArray( positions, i * 3 );
				vector.applyProjection( matrix );
				sortArray.push( [ vector.z, i ] );
			}

			function numericalSort( a, b ) {
				return b[ 0 ] - a[ 0 ];
			}

			sortArray.sort( numericalSort );

			var indices = index.array;

			for ( var i = 0; i < length; i ++ ) {
				indices[ i ] = sortArray[ i ][ 1 ];
			}

			geometry.index.needsUpdate = true;
		}
	}

	//document.body.appendChild( renderer.domElement );
	$("#WebGL-output").append(renderer.domElement);
	renderScene();
});

function lerp(a, b, t) {
    var x = a + t * (b - a);
    return x;
}

function v_lerp(a, b, t) {
    var len = a.length;
    if(b.length != len) return;

    var x = [];
    for(var i = 0; i < len; i++)
        x.push(a[i] + t * (b[i] - a[i]));
    return x;
}

function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; 
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
