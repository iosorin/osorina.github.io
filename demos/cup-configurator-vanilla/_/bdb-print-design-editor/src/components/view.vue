<template>
	<div id="containertest"></div>
</template>


<script>
	import * as THREE from 'three'
	export default {
		data: function() {
			return {
				camera: null,
				scene: null,
				renderer: null,
				mesh: null,
			}
		},
		methods: {
			init: function () {
				let container = document.getElementById('containertest')

				this.camera = new THREE.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.01, 10)
				this.camera.position.z = 0.55

				this.scene = new THREE.Scene()

				let geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2)
				// let material = new THREE.MeshNormalMaterial()
				
				var texture = new THREE.Texture(drawingc0);
				texture.needsUpdate = true;


				var material = new THREE.MeshBasicMaterial({
					map: texture
				});

				this.mesh = new THREE.Mesh(geometry, material);
				this.scene.add(this.mesh);

				// this.mesh = new THREE.Mesh(geometry, material)
				// this.scene.add(this.mesh)

				this.renderer = new THREE.WebGLRenderer({ antialias: true })
				this.renderer.setSize(container.clientWidth, container.clientHeight)
				container.appendChild(this.renderer.domElement)
			},
			animate: function () {
				requestAnimationFrame(this.animate)
				this.mesh.rotation.x += 0.01
				this.mesh.rotation.y += 0.01
				this.renderer.render(this.scene, this.camera)
			}
		},
		mounted () {
			this.init();
			this.animate();
		}
	}
</script>
<style>
body{
	overflow: hidden;
	height: 100vh;
}
#test{
	border: 1px solid black;
	background: rgba(0,0,0,.1);
	position: absolute;
	bottom: 20px;
	right: 20px;
}
#containertest{
	width: 400px;
	height: 350px;
}
#containertest{
	position: absolute;
	bottom: 50px;
	right: 50px;
}
</style>