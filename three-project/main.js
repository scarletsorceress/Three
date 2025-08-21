import './style.css';
import * as THREE from 'three';

			import Stats from 'three/addons/libs/stats.module.js';

			import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
			import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

			const checkbox = document.getElementById('toggle-ui');
          	const container = document.querySelector('.container');
          	const aboutme = document.getElementById('aboutme');
          	const projects = document.querySelector('.projects');
          	checkbox.addEventListener('change', function() {
            const display = this.checked ? '' : 'none';
            container.style.display = display;
            aboutme.style.display = display;
            projects.style.display = display;
		  	controls.movementSpeed = this.checked ? 0 : 750; // Set movement speed to 0 when UI is hidden
		  	controls.lookSpeed = this.checked ? 0 : 0.05; // Set look speed to 0 when UI is hidden 

			});
			
			let camera, controls, scene, renderer, stats;

			let mesh, geometry, material, clock;

			const worldWidth = 128, worldDepth = 128;

			let shark; // Add this at the top with other let declarations

			init();
			animate();

			function init() {

				camera = new THREE.PerspectiveCamera( 120, window.innerWidth / window.innerHeight, 1, 20000 );
				camera.position.y = 200;

				clock = new THREE.Clock();

				scene = new THREE.Scene();
				scene.background = new THREE.Color( 0xaaccff );
				scene.fog = new THREE.FogExp2( 0xaaccff, 0.0007 );

				geometry = new THREE.PlaneGeometry( 20000, 20000, worldWidth - 1, worldDepth - 1 );
				geometry.rotateX( - Math.PI / 2 );

				const position = geometry.attributes.position;
				position.usage = THREE.DynamicDrawUsage;

				for ( let i = 0; i < position.count; i ++ ) {

					const y = 35 * Math.sin( i / 2 );
					position.setY( i, y );

				}

				const texture = new THREE.TextureLoader().load( 'water.jpg' );
				texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
				texture.repeat.set( 5, 5 );	

				material = new THREE.MeshBasicMaterial( { color: 0x023d37, map: texture } );

				mesh = new THREE.Mesh( geometry, material );
				scene.add( mesh );

				// Add a spotlight above the shark position
				const spotLight = new THREE.SpotLight(0xffffff, 2, 1000, Math.PI / 4, 0.5, 1);
				spotLight.position.set(0, 300, 0); // Directly above the shark's initial position
				spotLight.target.position.set(0, 40, 0); // Point at the shark
				scene.add(spotLight);
				scene.add(spotLight.target);
				
				// Load shark model
				const loader = new GLTFLoader();
				loader.load('realistic_shark.glb', function(gltf) {
					shark = gltf.scene;
					shark.position.set(0, 40, 0); // Adjust position as needed
					shark.scale.set(100, 100, 100); // Adjust scale as needed
					scene.add(shark);
				});

				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				document.body.appendChild( renderer.domElement );

				controls = new FirstPersonControls( camera, renderer.domElement );

				stats = new Stats();
				document.body.appendChild( stats.dom );

				window.addEventListener( 'resize', onWindowResize );

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

				controls.handleResize();

			}

			//

			function animate() {

				requestAnimationFrame( animate );

				render();
				stats.update();

			}

			function render() {

				const delta = clock.getDelta();
				const time = clock.getElapsedTime() * 10;

				const position = geometry.attributes.position;

				for ( let i = 0; i < position.count; i ++ ) {

					const y = 35 * Math.sin( i / 5 + ( time + i ) / 7 );
					position.setY( i, y );

				}

				position.needsUpdate = true;
				mesh.geometry.computeVertexNormals();

				controls.update( delta );
				renderer.render( scene, camera );

			}
