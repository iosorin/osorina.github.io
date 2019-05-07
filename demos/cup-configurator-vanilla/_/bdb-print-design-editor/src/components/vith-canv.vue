<template>
  <div v-show="active" @mouseup="objectSelected()">
    <div id="shape-buttons">
      <button class="shape-btn line" @click="addLine()">Line</button>
      <button class="shape-btn rectangle" @click="addRect()">Rectangle</button>
      <button class="shape-btn circle" @click="addCircle()">Circle</button>
      <button class="shape-btn triangle" @click="addTriangle()">Triangle</button>
      <button class="shape-btn text" @click="addText()">Text</button>
    </div>
    <canvas :id="'drawing'+object_id" width="800" height="600" class="bla"></canvas>

    <div id="containertest"></div>

    <div id="object-controls" v-show="control != 'none'">
      <div id="shape-controls" v-show="control == 'shape'" ref="shapeControls">
        <div>
          <label for="fill-color">Fill color</label>
          <input
          type="color"
          class="shape-ctrl"
          id="fill-color"
          @input="fillColor($event.target.value)"
          >
        </div>
        <div>
          <label for="border-color">Border color</label>
          <input
          type="color"
          class="shape-ctrl"
          id="border-color"
          @input="borderColor($event.target.value)"
          >
        </div>
        <div>
          <label for="border-size">Border size</label>
          <select
          class="text-ctrl"
          id="border-size"
          name="border-size"
          @input="borderSize($event.target.value)"
          >
          <option v-for="item in 21" :key="'border'+(item-1)">{{item-1}}</option>
        </select>
      </div>
    </div>
    <div id="text-controls" v-show="control == 'text'" ref="textControls">
      <div>
        <label for="font-size">Font size</label>
        <select
        class="text-ctrl"
        id="font-size"
        name="font-size"
        @input="setFontSize($event.target.value)"
        >
        <option v-for="item in font_sizes" :key="'font'+item">{{item}}</option>
      </select>
    </div>
    <div>
      <label for="font-family">Font family</label>
      <select
      class="text-ctrl"
      id="font-family"
      name="font-family"
      @input="setFontFamily($event.target.value)"
      >
      <option v-for="item in font_families" :key="'fontfamily'+item">{{item}}</option>
    </select>
  </div>
  <div>
    <label for="fill-color">Fill color</label>
    <input
    type="color"
    class="shape-ctrl"
    id="fill-color"
    name="fill-color"
    @input="fillColor($event.target.value)"
    >
  </div>
</div>
<div id="common-controls" ref="commonControls">
  <div>
    <label for="opacity">Opacity</label>
    <input
    type="range"
    min="0"
    max="100"
    value="100"
    name="opacity"
    id="opacity"
    class="common-ctrl"
    @input="setOpacity($event.target.value)"
    >
  </div>
  <div>
    <button id="bring-front" class="common-ctrl" @click="bringToFront()">Bring to front</button>
  </div>
  <div>
    <button id="send-back" class="common-ctrl" @click="sendToBack()">Send to back</button>
  </div>
  <div>
    <button id="delete-item" class="common-ctrl" @click="deleteItem()">Delete</button>
  </div>
</div>
</div>
</div>
</template>

<script>
  import { fabric } from "fabric";
  import * as THREE from 'three'

  export default {
    name: "CanvasObject",
    props: {
      object_id: String,
      canvas_width: Number,
      canvas_height: Number,
      active: Number
    },
    data: function() {
      return {
        canvas: Object,
        control: "none",
        camera: null,
        scene: null,
        renderer: null,
        mesh: null,
        font_sizes: [
        9,
        10,
        11,
        12,
        13,
        14,
        16,
        18,
        20,
        22,
        24,
        28,
        32,
        36,
        40,
        44,
        48,
        60,
        72,
        80,
        90
        ],
        font_families: [
        "Times New Roman",
        "Arial",
        "Comic Sans",
        "Verdana",
        "Courier New",
        "Trebuchet MS",
        "Book Antiqua",
        "Georgia",
        "Copperplate",
        "Papyrus"
        ]
      };
    },
    created: function() {},
    mounted: function() {
      this.init();
      this.animate();
      this.canvas = new fabric.Canvas("drawing" + this.object_id, {
        width: this.canvas_width,
        height: this.canvas_height,
        backgroundColor: "#fff"
      });
      // this.canvas.on("after:render", function() {
      //   this.mesh.material.map.needsUpdate = true;
      // });
      this.canvas.preserveObjectStacking = true;
    },
    methods: {
      init: function () {
        let container = document.getElementById('containertest')

        this.camera = new THREE.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.01, 10)
        this.camera.position.z = 0.5

        this.scene = new THREE.Scene()

        let geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2)
        // let material = new THREE.MeshNormalMaterial()
        
        var texture = new THREE.Texture(drawingc0);
        texture.needsUpdate = true;


        var material = new THREE.MeshStandardMaterial({
          map: texture
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.scene.add(this.mesh);

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

      objectSelected: function() {
        var active_object = this.canvas.getActiveObject();
        if (!active_object) {
          this.control = "none";
          return
        } else if (
          ["rect", "circle", "triangle", "line"].includes(active_object.type)
          ) {
          this.control = "shape";
          this.$refs.shapeControls.querySelector("#fill-color").value =
          active_object.fill;
          this.$refs.shapeControls.querySelector("#border-color").value =
          active_object.stroke;
          this.$refs.shapeControls.querySelector("#border-size").value =
          active_object.strokeWidth;
        } else if ("i-text" == active_object.type) {
          this.control = "text";
          this.$refs.textControls.querySelector("#font-size").value =
          active_object.fontSize;
          this.$refs.textControls.querySelector("#font-family").value =
          active_object.fontFamily;
          this.$refs.textControls.querySelector("#fill-color").value =
          active_object.fill;
        }
        this.$refs.commonControls.querySelector("#opacity").value = active_object.opacity*100;
      },
      setActiveObject: function(obj) {
        this.canvas.setActiveObject(obj);
        this.objectSelected();
      },
      addLine: function() {
        var line = new fabric.Line([20, 20, 80, 80], {
          fill: "#00ffff",
          stroke: "#00ffff",
          strokeWidth: 2
        });
        this.canvas.add(line);
        this.setActiveObject(line);
      },
      addRect: function() {
        var rect = new fabric.Rect({
          fill: "#00ff00",
          left: 20,
          top: 20,
          width: 90,
          height: 60,
          stroke: "#00ff00",
          strokeWidth: 1
        });
        this.canvas.add(rect);
        this.setActiveObject(rect);
      },
      addCircle: function() {
        var circle = new fabric.Circle({
          fill: "#ff0000",
          radius: 50,
          left: 20,
          top: 20,
          stroke: "#ff0000",
          strokeWidth: 1
        });
        this.canvas.add(circle);
        this.setActiveObject(circle);
      },
      addTriangle: function() {
        var triangle = new fabric.Triangle({
          fill: "#0000ff",
          left: 20,
          top: 20,
          width: 60,
          height: 60,
          stroke: "#0000ff",
          strokeWidth: 1
        });
        this.canvas.add(triangle);
        this.setActiveObject(triangle);
      },
      addText: function() {
        var text = new fabric.IText("your text here", {
          fill: "#000000",
          fontFamily: "Times New Roman",
          fontSize: "14",
          left: 20,
          top: 20
        });
        this.canvas.add(text);
        this.setActiveObject(text);
      },
      addImage: function(img) {
        var imgInstance = new fabric.Image(img, {
          left: 20,
          top: 20
        });
        this.canvas.add(imgInstance);
        this.setActiveObject(imgInstance);
      },
      fillColor: function(color) {
        var active_object = this.canvas.getActiveObject();
        active_object.set("fill", color);
        this.canvas.renderAll();
      },
      borderColor: function(color) {
        var active_object = this.canvas.getActiveObject();
        active_object.set("stroke", color);
        this.canvas.renderAll();
      },
      borderSize: function(num) {
        var active_object = this.canvas.getActiveObject();
        active_object.set("strokeWidth", parseInt(num));
        this.canvas.renderAll();
      },
      setFontSize: function(size) {
        var active_object = this.canvas.getActiveObject();
        active_object.set("fontSize", parseInt(size));
        this.canvas.renderAll();
      },
      setFontFamily: function(family) {
        var active_object = this.canvas.getActiveObject();
        active_object.set("fontFamily", family);
        this.canvas.renderAll();
      },
      bringToFront: function() {
        var active_object = this.canvas.getActiveObject();
        active_object.bringToFront(active_object);
        this.canvas.renderAll();
      },
      sendToBack: function() {
        var active_object = this.canvas.getActiveObject();
        active_object.sendToBack(active_object);
        this.canvas.renderAll();
      },
      deleteItem: function() {
        var active_object = this.canvas.getActiveObject();
        this.canvas.remove(active_object);
        this.canvas.renderAll();
        this.control = "none";
      },
      setOpacity: function(val) {
        var active_object = this.canvas.getActiveObject();
        active_object.set("opacity", parseInt(val) / 100);
        this.canvas.renderAll();
      }
    }
  };
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