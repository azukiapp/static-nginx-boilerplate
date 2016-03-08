/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.PointerLockControls = function ( camera ) {

	var scope = this;
	var velocity = new THREE.Vector3();
	var moveForward = false;
	var moveBackward = false;
	var moveLeft = false;
	var moveRight = false;
	var moveDown = false;
	var moveUp = false;
	

	var pitchObject = new THREE.Object3D();
	pitchObject.add( camera );

	var yawObject = new THREE.Object3D();
	yawObject.add( pitchObject );

	this.speed = 40;

	camera.rotation.set( 0, 0, 0 );

	var PI_2 = Math.PI / 2;

	var onKeyDown = function ( event ) {

		switch ( event.keyCode ) {

			case 38: // up
			case 87: // w

				moveForward = true;
				break;

			case 37: // left
			case 65: // a
				moveLeft = true; break;

			case 40: // down
			case 83: // s
				moveBackward = true;
				break;

			case 39: // right
			case 68: // d
				moveRight = true;
				break;

			case 81: // q
				moveDown = true;
				break;

			case 69: // e
				moveUp = true;
				break;

		}

	};

	var onKeyUp = function ( event ) {

		switch( event.keyCode ) {

			case 38: // up
			case 87: // w
				moveForward = false;
				break;

			case 37: // left
			case 65: // a
				moveLeft = false;
				break;

			case 40: // down
			case 83: // s
				moveBackward = false;
				break;

			case 39: // right
			case 68: // d
				moveRight = false;
				break;

			case 81: // q
				moveDown = false;
				break;

			case 69: // e
				moveUp = false;
				break;

		}

	};

	
	var movementX = 0;
	var movementY = 0;

	var onMouseMove = function ( event ) {
		if ( scope.enabled === false ) return;

		movementX += (event.movementX || event.mozMovementX || event.webkitMovementX || 0)*0.003;
		movementY += (event.movementY || event.mozMovementY || event.webkitMovementY || 0)*0.003;

	};

	this.dispose = function() {

		document.removeEventListener( 'mousemove', onMouseMove, false );
		document.removeEventListener( 'keydown', onKeyDown, false );
		document.removeEventListener( 'keyup', onKeyUp, false );

	}

	document.addEventListener( 'mousemove', onMouseMove, false );
	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );

	this.enabled = false;

	this.getObject = function () {

		return yawObject;

	};


	this.getDirection = function() {

		// assumes the camera itself is not rotated

		var direction = new THREE.Vector3( 0, 0, - 1 );
		var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );

		return function( v ) {

			rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );

			v.copy( direction ).applyEuler( rotation );

			return v;

		}

	}();

	this.update = function(delta){

		velocity.x -= velocity.x * 2.0 * delta;
		velocity.y -= velocity.y * 2.0 * delta;
		velocity.z -= velocity.z * 2.0 * delta;

		movementX -= movementX  * 5.0 * delta;
		movementY -= movementY  * 5.0 * delta;

		yawObject.rotation.y   -= movementX * 2.0 * delta;
		pitchObject.rotation.x -= movementY * 2.0 * delta;

		pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );

		if ( moveDown )  	velocity.y -= this.speed * delta;
		if ( moveUp )    	velocity.y += this.speed * delta;

		if ( moveForward )  velocity.z -= this.speed * delta;
		if ( moveBackward ) velocity.z += this.speed * delta;

		if ( moveLeft ) 	velocity.x -= this.speed * delta;
		if ( moveRight ) 	velocity.x += this.speed * delta;

		yawObject.translateX( velocity.x * delta );
		yawObject.translateY( velocity.y * delta );
		yawObject.translateZ( velocity.z * delta );	
	}

};
