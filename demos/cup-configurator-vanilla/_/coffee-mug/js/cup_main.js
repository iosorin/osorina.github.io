			
var config_size = {
	width:930,
	height:530
};

var stats;
var container,controls;

var camera, scene, renderer,pointLight;
var decal_mat2;

var GUI_panel, gui, selectedobj,f1,f2,f3;

var cup_mat, decal_mat, inside_mat;
var decalTextures,crrdecal=0;

			/*var windowHalfX = window.innerWidth / 2;
			var windowHalfY = window.innerHeight / 2;*/
			var windowHalfX = config_size.width / 2;
			var windowHalfY = config_size.height / 2;

			PIXI.dontSayHello=true;

			var stage = new PIXI.Stage(0x97C56E, true);

			var Decal_size = {
				width:725,
				height:328
			};

			var DecalContainer = new PIXI.DisplayObjectContainer();

			var Canv_renderer,texture, Canv_texture;
			var lockcamera=false;
		    // create a renderer instance
		    initCanvas();				

		    function handleFileSelect(evt) {
    //var files = evt.target.files; // FileList object  
    var URL = window.webkitURL || window.URL;  
    var url = URL.createObjectURL(evt.target.files[0]);
    //console.log(url);   
    if (url!=null) {
    	createBunny(0, 0, url );   
    	GUI_panel.showcanvas = true;
    	f3.open();
    	crrdecal=decalTextures.length-1;
    	decal_mat2.map = decalTextures[crrdecal];

    }

  }

  function initCanvas(){

  	Canv_renderer = PIXI.autoDetectRenderer(Decal_size.width, Decal_size.height,{transparent:true,antialiasing:true});
  	DecalContainer.position.x = 0;
  	DecalContainer.position.y = 0;
  	DecalContainer.width=Decal_size.width;
  	DecalContainer.height=Decal_size.height;
  	stage.addChild(DecalContainer);

        // add the renderer view element to the DOM
        var x = document.createElement("INPUT");
        x.setAttribute("type", "file");
        x.setAttribute("name", "files[]");
        x.style.position = "absolute";
        x.style.top ="20px";	

//<input type="file" id="files" name="files[]" multiple />
document.body.appendChild(x);

x.addEventListener('change', handleFileSelect, false);


document.body.appendChild(Canv_renderer.view);
Canv_renderer.view.style.position = "absolute";
        //Canv_renderer.view.style.top = (window.innerHeight - Decal_size.height - 2  )+"px";
        Canv_renderer.view.style.top = (config_size.height - Decal_size.height - 2  )+"px";
        Canv_renderer.view.style.left = "0px";
        Canv_renderer.view.style.visibility="hidden";
        Canv_renderer.view.style.borderStyle = "solid"; 
        Canv_renderer.view.style.borderColor = "black";
        Canv_renderer.view.style.borderWidth = "1px";
        requestAnimFrame( animate );

        // create a texture from an image path
        texture = PIXI.Texture.fromImage("logo.png");

        for (var i = 0; i < 1; i++)
        {
        	createBunny(Math.random() * Decal_size.width, Math.random() * Decal_size.height,"")
        };

     /*   Canv_texture = new THREE.Texture(Canv_renderer.view);        
     Canv_texture.needsUpdate = true;*/


		//if(location.hostname == "localhost" || location.hostname == "23904669f7be38e915327a728db1b1def22c0fe3.googledrive.com"){
			init();
			animate();	
		//}
		//console.log(location.hostname );

		
	}

	function createBunny(x, y, _url)
	{
		var _scale =1.5;
		if (_url ==""){
	 		// create our little bunny friend..
	 		var bunny = new PIXI.Sprite(texture);
	 	}else{
	 		var _texture = PIXI.Texture.fromImage(_url);
	 		bunny = new PIXI.Sprite(_texture);
	 		_scale=0.51;
	 	}


        // enable the bunny to be interactive.. this will allow it to respond to mouse and touch events
        bunny.interactive = true;
        // this button mode will mean the hand cursor appears when you rollover the bunny with your mouse
        bunny.buttonMode = true;

        // center the bunnys anchor point
        bunny.anchor.x = 0.5;
        bunny.anchor.y = 0.5;
        // make it a bit bigger, so its easier to touch
        bunny.scale.x = bunny.scale.y = _scale;


        // use the mousedown and touchstart
        bunny.mousedown = bunny.touchstart = function(data)
        {		
        	controls.enabled=false;
        	if (GUI_panel.mmode=="delete" ){ 
        		var parent = this.parent;
        		if (this.parent) {
        			var parent = this.parent;
        			parent.removeChild(this);					
        		}

        	}else{
        		data.originalEvent.preventDefault();
        		this.data = data;
        		this.alpha = 0.9;
        		this.dragging = true;
        		if (this.parent) {
        			var parent = this.parent;
        			parent.removeChild(this);
        			parent.addChild(this);
        		}
        		this.startposition = this.data.getLocalPosition(this.parent); 		
        	}

        };

        // set the events for when the mouse is released or a touch is released
        bunny.mouseup = bunny.mouseupoutside = bunny.touchend = bunny.touchendoutside = function(data)
        {
        	this.alpha = 1
        	this.dragging = false;
        	this.data = null;
        	controls.enabled=true;

        };

        // set the callbacks for when the mouse or a touch moves
        bunny.mousemove = bunny.touchmove = function(data)
        {
        	if(this.dragging)
        	{  
        		deltax =  this.data.getLocalPosition(this.parent).x - this.startposition.x;
        		deltay =  this.data.getLocalPosition(this.parent).y - this.startposition.y;
        		if (GUI_panel.mmode=="move" ){
        			this.position.x +=deltax;
        			this.position.y += deltay;
        		}
        		if (GUI_panel.mmode=="rotate" ){
        			this.rotation += deltax*0.01;	                
        		}
        		if (GUI_panel.mmode=="scale" ){
        			this.scale.x -= deltay*0.1;	                
        			this.scale.y=this.scale.x;	                
        		}

        		this.startposition = this.data.getLocalPosition(this.parent);              
        	}
        }

        // move the sprite to its designated position
        bunny.position.x = 400;
        bunny.position.y = 150;

        // add it to the stage
        DecalContainer.addChild(bunny);
      }


      function init() {


					/*loadTexture( 'textures/cube/skybox/px.jpg' ), // right
					loadTexture( 'textures/cube/skybox/nx.jpg' ), // left
					loadTexture( 'textures/cube/skybox/py.jpg' ), // top
					loadTexture( 'textures/cube/skybox/ny.jpg' ), // bottom
					loadTexture( 'textures/cube/skybox/pz.jpg' ), // back
					loadTexture( 'textures/cube/skybox/nz.jpg' )  // front*/


					var path = "models/cube/";
					var format = '.jpg';
					var urls = [
					path + 'px' + format, path + 'nx' + format,
					path + 'py' + format, path + 'ny' + format,
					path + 'pz' + format, path + 'nz' + format
					];

					var reflectionCube = THREE.ImageUtils.loadTextureCube( urls );
					reflectionCube.format = THREE.RGBFormat;

					var refractionCube = new THREE.CubeTexture( reflectionCube.image, new THREE.CubeRefractionMapping() );
					refractionCube.format = THREE.RGBFormat;

				//var cubeMaterial3 = new THREE.MeshPhongMaterial( { color: 0x000000, specular:0xaa0000, envMap: reflectionCube, combine: THREE.MixOperation, reflectivity: 0.25 } );
				Canv_texture = new THREE.Texture(Canv_renderer.view);        
				Canv_texture.needsUpdate = true;

				var imgTexture = THREE.ImageUtils.loadTexture( "models/cup/cup_AO.jpg" );	
				decalTextures = [	
				THREE.ImageUtils.loadTexture( "models/cup/decal5.jpg" ),
				THREE.ImageUtils.loadTexture( "models/cup/decal6.jpg" ),
				THREE.ImageUtils.loadTexture( "models/cup/decal.jpg" ),										
				THREE.ImageUtils.loadTexture( "models/cup/decal2.jpg" ),
				THREE.ImageUtils.loadTexture( "models/cup/decal3.jpg" ),
				THREE.ImageUtils.loadTexture( "models/cup/decal4.jpg" ),
				THREE.ImageUtils.loadTexture( "models/cup/decal7.jpg" ),
				THREE.ImageUtils.loadTexture( "models/cup/decal8.jpg" ),
				THREE.ImageUtils.loadTexture( "models/cup/decal9.jpg" ),
				Canv_texture										
										//THREE.ImageUtils.loadTexture( "models/cup/decal5.jpg" )
										
										];	

										cup_mat = new THREE.MeshPhongMaterial( {  map: imgTexture, color: 0xFFFFFF, ambient: 0xe8e8e8,shading: THREE.SmoothShading, envMap: reflectionCube, combine: THREE.MixOperation, reflectivity: 0.2, emissive:0x222222 } );
										decal_mat = new THREE.MeshPhongMaterial( {  map: imgTexture, color: 0xFFFFFF, ambient: 0x000000,shading: THREE.SmoothShading, envMap: reflectionCube, combine: THREE.MixOperation, reflectivity: 0.2, emissive:0x222222 } );
										inside_mat = new THREE.MeshPhongMaterial( {  map: imgTexture, color: 0xFFFFFF, ambient: 0xff7bf7,shading: THREE.SmoothShading, envMap: reflectionCube, combine: THREE.MixOperation, reflectivity: 0.2, emissive:0x222222 } );

										decal_mat2 = new THREE.MeshLambertMaterial( {  
											map: decalTextures[0],
					//alphaMap: decalTexture_alpha,
					doubleSided : true,
					color: 0xFFFFFF, 
					ambient: 0xeeeeee,
					shading: THREE.SmoothShading, 
					envMap: reflectionCube, 
					combine: THREE.MixOperation, 
					reflectivity: 0.2,
					opacity: 0.95,
					//alphaTest: 0.5,					
					transparent: true , 
					emissive:0x222222 } );


										decal_mat.ambient=cup_mat.ambient;

										canvas_mat = new THREE.MeshLambertMaterial( {  
											map: Canv_texture,
					//alphaMap: decalTexture_alpha,
					doubleSided : true,
					color: 0xFFFFFF, 
					ambient: 0xeeeeee,
					shading: THREE.SmoothShading, 
					envMap: reflectionCube, 
					combine: THREE.MixOperation, 
					reflectivity: 0.2,
					//opacity: 0.5,
					//alphaTest: 0.5,					
					transparent: true , 
					emissive:0x000000 } );



										container = document.createElement( 'div' );
										document.body.appendChild( container );
				/*stats = new Stats();
				stats.domElement.style.position = 'absolute';
				stats.domElement.style.top = '0px';

				container.appendChild( stats.domElement );*/

				//GUI-----------------------------------------------------


				GUI_panel = new function() {	
					this.mmode="move";	           
					this.orbitcamera = false;
					this.showcanvas = false;
					this.message = "here ";
					this.cupcolor = [33,33,33];
					this.insidecolor =  [242,235,235];  
					this.setsetdecal = function() {		            	
						crrdecal+=1;
						if (crrdecal>=decalTextures.length) crrdecal =0;
						if (crrdecal==decalTextures.length-1){
							this.showcanvas = true;
							f3.open();
						}else{
							this.showcanvas = false;
							f3.close();
						}


		            	// console.log(crrdecal);
		            	decal_mat2.map = decalTextures[crrdecal];
		            };
		            this.captureCanvas = function() {	
				  		/*Canv_texture = new THREE.Texture(Canv_renderer.view);        
				  		Canv_texture.needsUpdate = true;*/
				  		decal_mat2.map = Canv_texture;

				  	};
				  	this.setmovemode = function() {	
				  		this.mmode="move";	 
				  	};
				  	this.setrotatemode = function() {	
				  		this.mmode="rotate";	 
				  	};
				  	this.setscalemode = function() {	
				  		this.mmode="scale";	 
				  	};
				  	this.setdeletemode = function() {	
				  		this.mmode="delete";	 
				  	};

				  }


				  gui = new dat.GUI();		        

				  f1 = gui.addFolder('Цвет/Камерa ');

				  f2 = gui.addFolder('Графика ');	
				  f1.add(GUI_panel, 'orbitcamera').name("Стоп Камерa");		       
				  f1.addColor(GUI_panel, 'cupcolor').name("Цвет Снаружи");
				  f1.addColor(GUI_panel, 'insidecolor').name("Цвет Внутри");
		        //f1.open();
		        f1.close();


		        f2.add(GUI_panel, 'setsetdecal').name("След. картинка");
		        f2.add(GUI_panel, 'showcanvas').name("Показывать свою");
		        f2.add(GUI_panel, 'captureCanvas').name("Загрузить свою картинку");
		        //f2.open(); 
		        f1.close();

		        f3 = f2.addFolder('Изменить свою');
		        f3.add(GUI_panel, 'setmovemode').name("Двигать");
		        f3.add(GUI_panel, 'setrotatemode').name("Вращать");
		        f3.add(GUI_panel, 'setscalemode').name("+/-");
		        f3.add(GUI_panel, 'setdeletemode').name("Удалить");				


				//gui.remember(gui);

				gui.add(obj, 'propertyName').options(1, 2, 3, 5, 8);

				//END GUI-----------------------------------------------------

				camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
				camera.position.z = 100;

				controls = new THREE.OrbitControls( camera );				
				controls.addEventListener( 'change', render );
				controls.target = new THREE.Vector3(0,0,0);
				controls.smooth=true;
				controls.smoothspeed=0.8;

				// scene

				scene = new THREE.Scene();

				var ambient = new THREE.AmbientLight( 0xffffff );
				scene.add( ambient );
				

				/*pointLight = new THREE.PointLight( 0x000000, 2 );
				scene.add( pointLight );

				var sphere = new THREE.SphereGeometry( 100, 16, 8 );

				var mesh = new THREE.Mesh( sphere, cubeMaterial3 );
				mesh.scale.set( 0.01, 0.01, 0.01 );
				pointLight.add( mesh );*/


				/*var directionalLight = new THREE.DirectionalLight( 0xffeedd );
				directionalLight.position.set( 0, 0, 1 );
				scene.add( directionalLight );*/

				// texture

				var manager = new THREE.LoadingManager();
				manager.onProgress = function ( item, loaded, total ) {

					console.log( item, loaded, total );

				};

				var texture = new THREE.Texture();

				var onProgress = function ( xhr ) {
					if ( xhr.lengthComputable ) {
						var percentComplete = xhr.loaded / xhr.total * 100;
						console.log( Math.round(percentComplete, 2) + '% downloaded' );
					}
				};

				var onError = function ( xhr ) {
				};


				var loader = new THREE.JSONLoader();
				var mats = [decal_mat,cup_mat,inside_mat];


				var callbackCup = function ( geometry, materials ) { createScene( geometry, mats,"cup" ); };
				var callbackDecal = function ( geometry, materials ) { createScene( geometry, mats,"decal" ); };

				loader.load( "models/cup/cup.js", callbackCup );
				loader.load( "models/cup/decal.js", callbackDecal );
				

				//

				renderer = new THREE.WebGLRenderer({ antialias: true } );
				renderer.setSize( window.innerWidth, window.innerHeight );
				//renderer.setSize(config_size.width, config_size.height);
				renderer.setClearColor( 0xeeeeee, 0.5);
				container.appendChild( renderer.domElement );


				//document.addEventListener( 'mousemove', onDocumentMouseMove, false );

				//

				window.addEventListener( 'resize', onWindowResize, false );

				//initCanvas();
			}


			function createScene( geometry, materials,_model ) {
				if (_model=="cup"){
					geometry.computeVertexNormals();
					zmesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ));				
					//zmesh = new THREE.Mesh( geometry,materials[Math.floor((Math.random() * 3) )]);				
					//zmesh = new THREE.Mesh( geometry,materials[0]);				
					zmesh.scale.set( 0.5, 0.5, 0.5 );
					zmesh.position.y=-20;
					scene.add( zmesh );
					//console.log(zmesh);	
				}else{
					geometry.computeVertexNormals();
					zmesh = new THREE.Mesh( geometry,decal_mat2);	
					//zmesh = new THREE.Mesh( geometry,canvas_mat);	
					
					zmesh.scale.set( 0.5, 0.5, 0.5 );
					zmesh.position.y=-20;
					scene.add( zmesh );
				}
				
			}

			function onWindowResize() {

				windowHalfX = window.innerWidth / 2;
				windowHalfY = window.innerHeight / 2;

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

				Canv_renderer.view.style.top = (window.innerHeight - Decal_size.height- 2 )+"px";
				
				/*windowHalfX = config_size.width/ 2;
				windowHalfY = config_size.height / 2;

				camera.aspect = config_size.width / config_size.height;
				camera.updateProjectionMatrix();

				renderer.setSize(config_size.width,  config_size.height );

				Canv_renderer.view.style.top = ( config_size.height - Decal_size.height- 2 )+"px";*/



			}


			//

			function animate(timestamp) {
				
				TWEEN.update( timestamp );
				requestAnimationFrame( animate );
				render();

				if (Canv_renderer!=undefined) Canv_renderer.render(stage);
				if (Canv_texture!=undefined)
					Canv_texture.needsUpdate=true;
			}

			function updateGUI(){
				//console.log(cup_mat.ambient);
				//console.log( GUI_panel.cupcolor);
				if (cup_mat!=undefined && inside_mat!=undefined ){
					cup_mat.ambient.r=GUI_panel.cupcolor[0]/255;
					cup_mat.ambient.g=GUI_panel.cupcolor[1]/255;
					cup_mat.ambient.b=GUI_panel.cupcolor[2]/255;
					
					inside_mat.ambient.r=GUI_panel.insidecolor[0]/255;
					inside_mat.ambient.g=GUI_panel.insidecolor[1]/255;
					inside_mat.ambient.b=GUI_panel.insidecolor[2]/255;	

				}
				
				if (!GUI_panel.orbitcamera && !lockcamera ) {
					controls.enabled=true;
				}else{
					controls.enabled=false;
				}  
				
				if (GUI_panel.showcanvas)   Canv_renderer.view.style.visibility="visible";
				else    Canv_renderer.view.style.visibility="hidden";


				//decal_mat.ambient=cup_mat.ambient = GUI_panel.cupcolor;
				//inside_mat.ambient= GUI_panel.insidecolor;

			}

			function render() {
				try{
					updateGUI();
					renderer.render( scene, camera );
					stats.update();
				}catch (e){}
				
			}