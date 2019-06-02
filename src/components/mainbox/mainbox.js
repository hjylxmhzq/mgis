import React, { Component } from 'react';
import esriLoader from 'esri-loader';
import { Drawer } from 'antd';


export default class ArcGISMap extends Component {
  constructor(props) {
    super(props)
    //地图请求url
    this.tileMapUrl = "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer";
    this.chartCanvas = React.createRef();
    this.hotLayer = null;
    this.map = null;
    this.view = null;
    this.hotLayer = null;
    this.state = { 
      drawerVisible: props.drawerVisible,
      drawerContent: []
    };
  }

  showDrawer = () => {
    this.setState({
      drawerVisible: true,
    });
  };

  componentDidUpdate() {
    console.log(this.props);
    if (this.props.hotmap) {
      this.map.add(this.hotLayer);
    } else {
      this.map.remove(this.hotLayer);
    }

  }

  componentDidMount() {
    this.initMap()
  }

  initMap() {
    const mapURL = {
      url: "https://172.20.32.70:8889/arcgis_js_api/library/4.11/dojo/dojo.js"
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
      "esri/widgets/Compass",
      "esri/widgets/Legend",
      "esri/widgets/Search",
      "esri/core/watchUtils",
      "esri/widgets/Sketch",
      "esri/layers/MapImageLayer"
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
      Compass,
      Legend,
      Search,
      watchUtils,
      Sketch,
      MapImageLayer]) => {
      let featureLayerView, pausableWatchHandle, chartExpand;

      const unit = "kilometers";

      // Create layers
      const graphicsLayer = new GraphicsLayer();
      const graphicsLayer2 = new GraphicsLayer();

      this.hotLayer = new MapImageLayer({
        url: "https://172.20.32.139:6443/arcgis/rest/services/golfmap/MapServer"
      });
      const featureLayer = new FeatureLayer({
        // URL to the service
        url: "https://172.20.32.139:6443/arcgis/rest/services/golfmap/MapServer/0"
      });
      featureLayer.queryFeatures().then(function (results) {
        // prints an array of all the features in the service to the console
        console.log(results.features);
      });
      // Create map
      this.map = new Map({
        basemap: "dark-gray",
        layers: [featureLayer, graphicsLayer2, graphicsLayer]
      });
      let map = this.map;
      // Create view
      this.view = new MapView({
        container: "mapDiv",
        map: map,
        zoom: 6,
        center: [113.083, 27.3069],
        constraints: {
          maxScale: 0,
          minScale: 300000000
        }
      });

      let view = this.view;

      // Update UI
      setUpAppUI();

      function setUpAppUI() {
        // When layer is loaded, create a watcher to trigger drawing of the buffer polygon
        view.when(function () {
          // Display the chart in an Expand widget
          var compass = new Compass({
            view: view
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

          // Add our components to the UI
          view.ui.add(sketch, "bottom-right");
          view.ui.add(compass, "bottom-left");
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
        <Drawer
          title="统计数据"
          placement="right"
          closable={true}
          onClose={this.props.onCloseDrawer}
          visible={this.props.drawerVisible}
          mask={false}
          width={500}
        >
          {this.state.drawerContent.map(item=>{
            return <p>{item}</p>
          })}
        </Drawer>
      </div>
    )
  }
}
