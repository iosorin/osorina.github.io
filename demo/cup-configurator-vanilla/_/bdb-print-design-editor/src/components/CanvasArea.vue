<template>
  <div>
    <div v-if="number_of_pages">
      <CanvasObject
      v-for="(item,index) in canvas_objects"
      :key="item"
      :active="canvas_activity[index]"
      :object_id="item"
      :canvas_height="canvas_height"
      :canvas_width="canvas_width"
      ref="canvasObjects"
      ></CanvasObject>
      <!-- <ViewComponent></ViewComponent> -->
      <div id="containertest"></div>

      <div id="library">
        <button id="library-btn" class="btn" @click="$modal.show('imageUpload')">Library</button>
        <modal name="imageUpload">
          <div id="existing-images">
            <img
            v-for="(item,index) in images"
            :key="'img'+index"
            :src="item"
            @click="onImageClicked"
            >
          </div>
          <form id="image-upload">
            <input type="file" @change="onFileChanged" ref="imageUpload">
          </form>
        </modal>
      </div>
      <div>
        <button id="import" @click="$modal.show('importTemplate')">Templates</button>
        <modal name="importTemplate">
          <div id="templates">
            <div
            class="template_name"
            v-for="(item,index) in template_names"
            :key="'template_name'+index"
            :src="item"
            @click="onTemplateClicked(item)"
            >{{item}}</div>
          </div>
        </modal>
      </div>
    </div>
  </div>
</template>

<script>
  import * as THREE from 'three'

  import Vue from "vue";
  import { getUrlVars } from "../common";
  import { fabric } from "fabric";
  import CanvasObject from "../components/CanvasObject.vue";
  // import ViewComponent from "../components/view.vue";
  import $ from 'jquery'
  window.$ = $

  export default {
    name: "CanvasArea",
    components: {
      CanvasObject,
      // ViewComponent
    },
    data: function() {
      return {
        camera: null,
        scene: null,
        renderer: null,
        mesh: null,

        canvas_width: 800,
        canvas_height: 800,
        canvas_objects: [],
        canvas_activity: [],

        control: String,
        
        number_of_pages: Number,
        active_canvas_id: 0,
        images: [],
        template_location: "canvas_templates/kartvizit",
        template_names: ["template1", "template2"],
        templates: []
      };
    },
    created: function() {
      this.canvas_width = 800;
      this.canvas_height = 500;
      this.number_of_pages = 1;
      if (this.number_of_pages) {
        for (var i = 0; i < this.number_of_pages; i++) {
          this.canvas_activity[i] = 0;
          this.canvas_objects[i] = "c" + i;
        }
        this.canvas_activity[0] = 1;
      }
    },
    mounted () {
      this.init();
      this.animate();
    },
    methods: {
      init: function () {
        let container = document.getElementById('containertest')

        this.camera = new THREE.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.01, 10)
        this.camera.position.z = 0.55

        this.scene = new THREE.Scene()

        let geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2)
        // let material = new THREE.MeshNormalMaterial()
        
        // var texture = new THREE.MeshLambertMaterial(drawingc0);
        // texture.needsUpdate = true;


        var material = new THREE.MeshBasicMaterial({
          // map: texture
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
      },
      onFileChanged(event) {
        var input = event.target;
        if (input.files && input.files[0]) {
          var reader = new FileReader();
          reader.onload = e => {
            this.images.push(e.target.result);
          };
          reader.readAsDataURL(input.files[0]);
        }
      },
      onImageClicked: function(event) {
        var img = event.target;
        this.$refs.canvasObjects[this.active_canvas_id].addImage(img);
        this.$modal.hide("imageUpload");
      },
      onTemplateClicked: function(name) {
        var template_url = this.template_location + "/" + name + ".json";
        var canvas = this.$refs.canvasObjects[this.active_canvas_id].canvas;
        $.getJSON(template_url).done(function(data) {
          canvas.loadFromJSON(data, canvas.renderAll.bind(canvas));
        });
        this.$modal.hide("importTemplate");
      },
      selectPage: function(i) {
        for (var k = 0; k < this.number_of_pages; k++) {
          Vue.set(this.canvas_activity, k, 0);
        }
        Vue.set(this.canvas_activity, i, 1);
        this.active_canvas_id = i;
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#page-buttons {
  margin-left: 90px;
  margin-bottom: 10px;
}
.canvas-container {
  border: 1px solid #555;
  float: left;
}
#shape-buttons {
  float: left;
  border: 1px solid #ccc;
  padding: 5px;
  margin: 5px;
}
#shape-buttons button {
  display: block;
  margin-bottom: 10px;
  width: 100%;
}
#object-controls {
  border: 1px solid #ccc;
  padding: 5px;
  margin: 5px;
  float: left;
}
#object-controls div div {
  border-bottom: 1px solid #ccc;
  display: block;
  margin: 5px 0;
  padding: 10px 10px;
}
#object-controls label {
  margin-right: 5px;
}
.vue_component__upload--image {
  clear: both;
}
#library {
  clear: both;
}
#existing-images img {
  border: 1px solid #ccc;
  width: 100px;
}
.v--modal-box {
  padding: 15px !important;
}
#templates .template_name{
  cursor: pointer;
  padding: 5px;
  margin: 5px;
  border: 1px solid #ccc;
}
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


