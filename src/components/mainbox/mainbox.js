import React, { Component } from 'react'
import esriLoader from 'esri-loader'

export default class ArcGISMap extends Component {
  constructor(props) {
    super(props)
    //地图请求url
    this.tileMapUrl = "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer";
    this.chartCanvas = React.createRef();
  }
  componentDidMount() {
    this.initMap()
  }
  initMap() {
    const mapURL = {
      url: "https://js.arcgis.com/4.11/dojo/dojo.js"
    }
    esriLoader.loadModules([
      "esri/widgets/Sketch/SketchViewModel",
      "esri/geometry/Polyline",
      "esri/geometry/Point",
      "esri/Graphic",
      "esri/Map",
      "esri/views/MapView",
      "esri/layers/FeatureLayer",
      "esri/layers/GraphicsLayer",
      "esri/geometry/geometryEngine",
      "esri/widgets/Expand",
      "esri/widgets/Legend",
      "esri/widgets/Search",
      "esri/core/watchUtils",
      "esri/widgets/Sketch"
    ], mapURL).then(([
      SketchViewModel,
      Polyline,
      Point,
      Graphic,
      Map,
      MapView,
      FeatureLayer,
      GraphicsLayer,
      geometryEngine,
      Expand,
      Legend,
      Search,
      watchUtils,
      Sketch]) => {
      let featureLayerView, pausableWatchHandle, chartExpand;

      const unit = "kilometers";

      // Create layers
      const graphicsLayer = new GraphicsLayer();
      const graphicsLayer2 = new GraphicsLayer();

      const featureLayer = new FeatureLayer({
        // URL to the service
        url: "https://172.20.32.139:6443/arcgis/rest/services/golfmap/MapServer/0"
      });
      featureLayer.queryFeatures().then(function (results) {
        // prints an array of all the features in the service to the console
        console.log(results.features);
      });
      // Create map
      const map = new Map({
        basemap: "dark-gray",
        layers: [featureLayer, graphicsLayer2, graphicsLayer]
      });

      // Create view
      const view = new MapView({
        container: "mapDiv",
        map: map,
        zoom: 6,
        center: [113.083, 27.3069],
        constraints: {
          maxScale: 0,
          minScale: 300000000
        }
      });

      // Update UI
      setUpAppUI();

      function setUpAppUI() {
        // When layer is loaded, create a watcher to trigger drawing of the buffer polygon
        view.when(function () {
          // Display the chart in an Expand widget
          chartExpand = new Expand({
            expandIconClass: "esri-icon-chart",
            expandTooltip: "关键词",
            expanded: false,
            view: view,
            content: document.getElementById("chartPanel")
          });
          const sketch = new Sketch({
            view,
            layer: graphicsLayer2
          });

          sketch.on("create", function (event) {
            // check if the create event's state has changed to complete indicating
            // the graphic create operation is completed.
            if (event.state === "complete") {
              let query = featureLayer.createQuery();
              query.geometry = event.graphic.geometry;
              query.spatialRelationship = "intersects";
              featureLayer.queryFeatures(query).then(function (results) {
                // prints an array of all the features in the service to the console
                console.log(results.features);
              });
            }
          });
          const search = new Search({
            view: view,
            sources: [
              {
                layer: featureLayer,
                searchFields: ["adderss", 'area', 'name'],
                displayField: "adderss",
                exactMatch: false,
                outFields: ["*"],
                name: "球场",
                placeholder: "example: 北京"
              }
            ]
          });

          // Legend widget
          const legend = new Legend({
            view: view,
            layerInfos: [
              {
                layer: featureLayer,
                title: "高尔夫球场位置"
              }
            ]
          });

          // Display the Legend in an Expand widget
          const legendExpand = new Expand({
            expandTooltip: "Show Legend",
            expanded: false,
            view: view,
            content: legend
          });

          // Add our components to the UI
          view.ui.add(sketch, "bottom-right");
          view.ui.add(chartExpand, "bottom-left");
          view.ui.add(search, "top-right");
        });
      }

      let chart;

      function updateChart(newData) {
        //console.log(newData);
      }

      // Label polyline with its length
      function labelLength(geom, length) {
        return new Graphic({
          geometry: geom,
          symbol: {
            type: "text",
            color: "#FFEB00",
            text: length.toFixed(2) + " kilometers",
            xoffset: 50,
            yoffset: 10,
            font: {
              // autocast as Font
              size: 14,
              family: "sans-serif"
            }
          }
        });
      }
    })
  }

  render() {
    let style = {
      width: '100%',
      height: '100%',
      position: 'relative'
    }
    return (
      <div style={style}>
        <canvas ref={this.chartCanvas} style={{ position: 'absolute', bottom: '10px', right: '10px' }}></canvas>
        <div id="mapDiv" style={style}></div>
      </div>
    )
  }
}
