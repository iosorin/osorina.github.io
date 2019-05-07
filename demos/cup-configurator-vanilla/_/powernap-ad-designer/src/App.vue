<template>
  <div id="app" class="container">
    <div id="quickStart">
      <h1>PowerNap<sup>&reg;</sup> Ad Designer</h1>
      <h2>Quick Start Guide</h2>
      <ol>
        <li>Select either a background image or background color for your design</li>
        <li>Add text to your design</li>
        <li>Add shapes, additional images or text to your design</li>
        <li>When you are satisfied with your design, click "Save Design" to download your design to your desktop</li>
        <li>Print your design and place in your dispenser</li>
      </ol>
      <br>
      <p>Need additional help getting started? Learn more in the <a href="https://powerspaper.com/powernap-ad-designer-guide/" id="plainLink" target="_blank">Ad Designer Guide</a></p>
    </div>
    <div v-if="showUI" class="row">
      <div class="col-sm-12 col-md-5">
        <accordion title="Background" @accordion-clicked="closeAllOtherAccordions($event)">
          <p>Use the color picker to add a background color to your design</p>
          <chrome-picker :value="backgroundColor" @input="updateCanvasBackgroundColor"></chrome-picker>
          <br />
          <p>Or choose a background image:</p>
          <div id="imageWrapper">
            <img v-for="(img, i) in backgroundImages" @click="addBackgroundImage(img)" class="background-image" :key="i" :src="img"  alt="background image" />
          </div>
        </accordion>
        <accordion title="Text" @accordion-clicked="closeAllOtherAccordions($event)">
          <p>Enter your text, select your font, size, and color.</p>
          <p>Add as many text elements as your design requires.</p>
          <label for="text">Text</label>
          <input type="text" name="text" v-model="text" class="form-control" />
          <label for="font-family">Font family</label>
          <select v-model="fontFamily" name="font-family" class="form-control">
            <option v-for="family in fontFamilies" :key="family" :style="`font-family: ${family};`" :label="family">{{family}}</option>
          </select>
          <label for="font-size">Font size</label>
          <input type="number" name="font-size" v-model="fontSize" class="form-control">
          <input type="range" name="font-size" v-model="fontSize">
          <label>Text alignment</label>
          <div class="btn-group" role="group" aria-label="Text alignment">
            <button type="button" class="btn btn-secondary" :class="{active: textAlign === 'left'}" @click="textAlign = 'left'"><i class="fas fa-align-left"></i> <span class="sr-only">Left</span></button>
            <button type="button" class="btn btn-secondary" :class="{active: textAlign === 'center'}" @click="textAlign = 'center'"><i class="fas fa-align-center"></i> <span class="sr-only">Center</span></button>
            <button type="button" class="btn btn-secondary" :class="{active: textAlign === 'right'}" @click="textAlign = 'right'"><i class="fas fa-align-right"></i> <span class="sr-only">Right</span></button>
          </div>
          <label>Text color</label>
          <chrome-picker :value="textColor" @input="updateTextColor"></chrome-picker>
          <button @click="addText" type="button" name="add-text" class="btn btn-block">Add new text</button>
        </accordion>
        <accordion title="Images"  @accordion-clicked="closeAllOtherAccordions($event)">
          <p>Upload an image into your design. Supported image formats are JPG and PNG.</p>
          <p>Recommended image size is 600px x 400px</p>
          <file-upload @fileChanged="imageObj = $event" ref="fileUpload"></file-upload>
          <button type="button" name="Add image" @click="addImage" :disabled="imageObj === ''" class="btn btn-block">Add image</button>
        </accordion>
        <accordion title="Shapes" class="accordion-shapes"  @accordion-clicked="closeAllOtherAccordions($event)">
          <p>Add circles, squares, and custom shapes to your design</p>
          <button type="button" name="add-circle" @click="addShape('circle')" class="btn">
            <i class="fas fa-circle"></i> Add Circle
          </button>
          <br/>
          <button type="button" name="add-square" @click="addShape('rectangle')" class="btn">
            <i class="fas fa-square"></i> Add Square
          </button>
          <h5>Add Custom Polygons and Stars</h5>
          <p>Adjust the number of corners then choose polygon or star to apply</p>
          <div class="form-group">
            <label for="corners">Number of Corners</label>
            <input type="number" name="corners" v-model="corners" class="form-control" />
            <br/>
            <button type="button" name="add-polygon" @click="addShape('polygon')" class="btn">
              Add Polygon
            </button>
            <br/>
            <button type="button" name="add-polygon" @click="addShape('star')" class="btn">
              Add Star
            </button>
          </div>
          <chrome-picker :value="shapeColor" @input="updateShapeColor"></chrome-picker>
        </accordion>
      </div>
      <div class="col-sm-12 col-md-7 text-center">
        <canvas ref="c1" id="c1" width="442" height="298"></canvas>
        <div class="canvas-toolbar">
          <button type="button" name="bring-forward" title="Bring forward" @click="sortLayerByArrow('up')" :disabled="!isActiveObject" class="btn">
            <i class="fas fa-sort-up"></i>
          </button>
          <button type="button" name="send-backwards" title="Send backwards" @click="sortLayerByArrow('down')" :disabled="!isActiveObject" class="btn">
            <i class="fas fa-sort-down"></i>
          </button>
          <button type="button" name="delete-object" title="Delete object" @click="removeObject" :disabled="!isActiveObject" class="btn">
            <i class="fas fa-trash-alt"></i> Delete
          </button>
          <button type="button" name="unselect-object" title="Delete object" @click="deselectObject" :disabled="!isActiveObject" class="btn">
            <i class="fas fa-hand-paper"></i> Release Object
          </button>
          <button @click="save" type="button" title="Save Design" name="save" class="btn">Save Design</button>
        </div>
        <h5 v-if="layers.length > 0" class="layers-title">Layers:</h5>
        <draggable v-model="layers" @start="drag = true" @end="handleLayerDragEnd">
          <div v-for="(layer, i) in layers" :key="layer + i" class="layer">
            {{layer.type}}
            <i class="fas fa-ellipsis-v"></i>
          </div>
        </draggable>
      </div>
    </div>
    <desktop-only v-else></desktop-only>
  </div>
</template>

<script>
/* eslint-disable */
import { fabric } from 'fabric'
import Accordion from './components/Accordion.vue'
import DesktopOnly from './components/DesktopOnly.vue'
import FileUpload from './components/FileUpload.vue'
import { saveAs } from 'file-saver'
import canvasToBlob from 'canvas-toBlob'
import { Chrome } from 'vue-color'
import draggable from 'vuedraggable'

function generateId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

function regularPolygonPoints(sideCount, radius){
  var sweep=Math.PI*2/sideCount
  var cx=radius
  var cy=radius
  var points=[]
  for(var i=0;i<sideCount;i++){
    var x=cx+radius*Math.cos(i*sweep)
    var y=cy+radius*Math.sin(i*sweep)
    points.push({x:x,y:y})
  }
  return(points)
}

function starPolygonPoints(spikeCount, outerRadius, innerRadius) {
  var rot = Math.PI / 2 * 3
  var cx = outerRadius
  var cy = outerRadius
  var sweep = Math.PI / spikeCount
  var points = []
  var angle = 0
  for (var i = 0; i < spikeCount; i++) {
    var x = cx + Math.cos(angle) * outerRadius
    var y = cy + Math.sin(angle) * outerRadius
    points.push({x: x, y: y})
    angle += sweep

    x = cx + Math.cos(angle) * innerRadius
    y = cy + Math.sin(angle) * innerRadius
    points.push({x: x, y: y})
    angle += sweep
  }
  return (points)
}

export default {
  name: 'app',
  components: {
    Accordion,
    'chrome-picker': Chrome,
    DesktopOnly,
    draggable,
    FileUpload,
  },
  data () {
    return {
      backgroundColor: '#333333',
      backgroundImages: [],
      corners: 3,
      drag: false,
      fontFamily: 'Lato',
      fontFamilies: [
        'Abril FatFace',
        'Archivo',
        'Arvo',
        'Concert One',
        'Exo 2',
        'Lato',
        'Lena',
        'Lora',
        'Merriweather',
        'Montserrat',
        'Noto Sans',
        'Nunito',
        'Oswald',
        'Pacifico',
        'Playfair Display',
        'Raleway',
        'Roboto',
        'Sarina',
        'Spectral',
      ],
      fontSize: 20,
      textAlign: 'left',
      imageObj: '',
      isActiveObject: false,
      layers: [],
      shapeColor: '#333333',
      showUI: true,
      text: 'Your text',
      textColor: '#333333',
    }
  },
  mounted () {
    this.canvas = new fabric.Canvas('c1', { backgroundColor: "white" })
    this.canvas.setOverlayImage(require('./assets/art-boundaries.png'), this.canvas.renderAll.bind(this.canvas))
    this.canvas.on('mouse:down', this.checkActiveObject)

    // load background images
    this.loadBackgroundImages()

    // media queries
    if (matchMedia) {
      this.mq = window.matchMedia("(min-width: 767px)")
      this.mq.addListener(this.widthChange)
      this.widthChange(this.mq)
    }
  },
  destroyed: function() {
    this.mq.removeListener(this.widthChange)
  },
  methods: {
    closeAllOtherAccordions (title) {
      const otherAccordions = this.$children
        .filter(child => child.$options.name === 'Accordion' && child.$options.propsData.title !== title)
        .forEach(acc => acc.open = false)
    },
    addBackgroundImage (bgImage) {
      const center = this.canvas.getCenter()
      this.canvas.setBackgroundImage(bgImage, this.canvas.renderAll.bind(this.canvas))
    },
    addImage () {
      new fabric.Image.fromURL(this.imageObj, img => {
        this.canvas.add(img)
        this.getLayers()
        this.id = generateId()
      })
      this.$refs.fileUpload.clearImageData()
      this.imageObj = ''
    },
    addShape (shape, corners) {
      var object
      if (shape === 'circle') {
        object = new fabric.Circle({
          radius: 30,
          fill: this.shapeColor,
          top: 100,
          left: 100,
          id: generateId()
        })
      }
      if (shape === 'rectangle') {
        object = new fabric.Rect({
          left: 100,
          top: 100,
          fill: this.shapeColor,
          width: 100,
          height: 100,
          id: generateId()
        })
      }
      if (shape === 'polygon') {
        var points = regularPolygonPoints(this.corners, 30);
        object = new fabric.Polygon(points, {
          fill: this.shapeColor,
          left: 150,
          top: 10,
          id: generateId()
        }, false);
      }
      if (shape === 'star') {
        // make a star
        var points = starPolygonPoints(this.corners,50,25);
        object = new fabric.Polygon(points, {
          fill: this.shapeColor,
          left: 150,
          top: 10,
          id: generateId()
        }, false);
      }

      this.canvas.add(object)
      this.canvas.renderAll()
      this.getLayers()
    },
    addText () {
      this.canvas.add(new fabric.IText(this.text, {
        fontFamily: this.fontFamily,
        fontSize: this.fontSize,
        fill: this.textColor,
        textAlign: this.textAlign,
        left: 100,
        top: 100,
        id: generateId()
      }))

      this.getLayers()
    },
    deselectObject () {
      this.canvas.discardActiveObject()
      this.canvas.renderAll()
    },
    checkActiveObject (options) {
      if (options.target) {
        this.isActiveObject = true
      } else {
        this.isActiveObject = false
      }
    },
    getLayers () {
      this.layers = this.canvas.getObjects().reverse()
    },
    handleLayerDragEnd () {
      this.drag = false
      const reversedLayers = this.layers.reverse()
      this.canvas.getObjects().forEach((layer, i) => {
        const targetIndex = reversedLayers.findIndex(l => l.id === layer.id)
        layer.moveTo(targetIndex)
      })
      this.deselectObject()
      this.canvas.renderAll()
      this.getLayers()
    },
    loadBackgroundImages() {
      const fileNames = [
        'beer.jpg',
        'blueSkyBackground.jpg',
        'bowlingAlley.jpg',
        'cheeseburger.jpg',
        'coffeeCup.jpg',
        'frenchFries.jpg',
        'iceCreamFullBackground.jpg',
        'iceCreamConeWBackground.jpg',
        'mic.jpg',
        'popcornBackground.jpg',
        'tablecloth.jpg',
        'tableWithPlate.jpg',
        'theaterCurtain.png',
        'wings.jpg'
      ]
      this.backgroundImages = fileNames.map(fileName => {
        return require(`./assets/backgrounds/${fileName}`)
      })
    },
    removeObject() {
      const ao = this.canvas.getActiveObject()
      const index = this.canvas.getObjects().reverse().indexOf(ao)
      this.canvas.remove(ao)
      this.layers.splice(index, 1)
      this.isActiveObject = false
    },
    save () {
      // ensure that the saved PNG is a certain size
      var resizedCanvas = document.createElement("canvas")
      var resizedContext = resizedCanvas.getContext("2d")

      // 8.5 x 11
      resizedCanvas.width = "612"
      resizedCanvas.height = "792"

      // remove overlay image for saving
      this.canvas.setOverlayImage(null, this.canvas.renderAll.bind(this.canvas))

      var canvas = document.getElementById("c1")
      var context = canvas.getContext("2d")

      resizedContext.drawImage(canvas, 86, 80, 442, 298)
      resizedContext.drawImage(canvas, 86, 414, 442, 298)

      resizedCanvas.toBlob(blob => {
        saveAs(blob, 'my-design.png')
        // reset overlay image
        this.canvas.setOverlayImage(require('./assets/art-boundaries.png'), this.canvas.renderAll.bind(this.canvas))
      })
    },
    sortLayerByArrow(direction) {
      const ao = this.canvas.getActiveObject()
      if (ao) {
        if (direction === 'up') {
          this.canvas.bringForward(ao)
        }
        if (direction === 'down') {
          this.canvas.sendBackwards(ao)
        }
        this.getLayers()
        this.canvas.renderAll()
      }
    },
    updateCanvasBackgroundColor (color) {
      this.backgroundColor = color.hex
      this.canvas.setBackgroundColor(this.backgroundColor)
      this.canvas.renderAll()
    },
    updateShapeColor (color) {
      this.shapeColor = color.hex
    },
    updateTextColor (color) {
      this.textColor = color.hex
    },
    widthChange(mq) {
      if (mq.matches) {
        this.showUI = true
      } else {
        this.showUI = false
      }
    },
  },
  watch: {
    fontFamily: function(newVal, oldVal) {
      const ao = this.canvas.getActiveObject()
      if (ao && ao.type === 'i-text') {
        ao.set({fontFamily: newVal})
        this.canvas.renderAll()
      }
    },
    textAlign: function(newVal, oldVal) {
      const ao = this.canvas.getActiveObject()
      if (ao && ao.type === 'i-text') {
        ao.set('textAlign', this.textAlign)
        this.canvas.renderAll()
      }
    },
    textColor: function(newVal, oldVal) {
      const ao = this.canvas.getActiveObject()
      if (ao && ao.type === 'i-text') {
        ao.setColor(this.textColor)
        this.canvas.renderAll()
      }
    },
    shapeColor: function(newVal, oldVal) {
      const ao = this.canvas.getActiveObject()
      if (ao && ao.type !== 'image' && ao.type !== 'i-text') {
        ao.setColor(this.shapeColor)
        this.canvas.renderAll()
      }
    }
  }
}
</script>

<style>
#app {
  display: block;
  margin: 60px auto;
  max-width: 860px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
#app label {
  display: block;
}
#quickStart{
  background: #e6e6e6;
  border-radius: 5px;
  padding: 20px;
  margin-bottom: 50px;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, .3);
}
#plainLink{
  color: #006248;
}
#imageWrapper{
  height: 250px;
  overflow: auto;
}
canvas#c1 {
  display: block;
  box-shadow: 0px 0px 6px rgba(0,0,0,.35);
  margin: 0 auto 25px;
}
.canvas-toolbar {
  display: flex;
  margin-top: 15px;
}
.canvas-toolbar button {
  margin-right: 5px;
}
.canvas-toolbar button[name="save"] {
  margin-left: auto;
  margin-right: 0;
}
button {
  background: #006245;
  color: #fff;
  margin-bottom: 10px;
}
button:disabled {
  opacity: 1;
}
.background-image {
  display: block;
  max-width: 100%;
  cursor: pointer;
}
.layers-title {
  margin-top: 15px;
}
.layer {
  background: #bbb;
  border-bottom: 1px solid #999;
  padding: 10px;
  display: flex;
  justify-content: space-between;
}
.layer:hover {
  background: #ccc;
  cursor: grab;
}
.layer i {
  margin-top: 3px;
  color: #777;
}
</style>
