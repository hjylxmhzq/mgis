import React, { Component } from 'react';
import Charts from '../charts';
import Details from '../details';
import esriLoader from 'esri-loader';
import { Drawer } from 'antd';
import './mainbox.css';

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
    this.updateChart = this.updateChart.bind(this);
    this.selectGrphics = [];
    this.sketch = null;
    this.state = { 
      drawerVisible: props.drawerVisible,
      drawerContent: [],
      barData: [],
      detailVisible: false
    };
  }

  updateChart(barData) {
    this.setState({barData});
  }

  handleCloseModal() {
    this.setState({detailVisible: false});
  }

  clickSelected(event) {
    let content = <p>content</p>
    this.setState({detailVisible: true, detailContent: content, detailTitle: event.target.innerText})
  }

  showDrawer = () => {
    this.setState({
      drawerVisible: true,
    });
  };

  componentDidUpdate() {
    if (this.props.hotmap) {
      this.map.add(this.hotLayer);
    } else {
      this.map.remove(this.hotLayer);
    }
    if (this.props.reset) {
      this.sketch.reset();
      for (let i=0;i<this.selectGrphics.length;i++) {
        this.graphicsLayer2.remove(this.selectGrphics[i]);
      }
      this.selectGrphics = [];
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      drawerVisible: nextProps.drawerVisible
    });
    this.map.basemap = nextProps.basemap;
  }

  componentDidMount() {
    this.initMap()
  }

  initMap() {

    let that = this;

    const mapURL = {
      url: "http://www.tony-space.top:8000/arcgis_js_api/library/4.11/dojo/dojo.js"
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
      this.graphicsLayer2 = graphicsLayer2;
      this.hotLayer = new MapImageLayer({
        url: "https://arcserver.tony-space.top:8001/arcgis/rest/services/golfmap/MapServer"
      });
      const featureLayer = new FeatureLayer({
        // URL to the service
        url: "https://arcserver.tony-space.top:8001/arcgis/rest/services/golfmap/MapServer/0"
      });
      // Create map
      let basemap = this.props.basemap;
      this.map = new Map({
        basemap,
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
          that.sketch = sketch;

          sketch.on("create", (event) => {
            // check if the create event's state has changed to complete indicating
            // the graphic create operation is completed.
            if (event.state === "complete") {
              let query = featureLayer.createQuery();
              that.selectGrphics.push(event.graphic);
              query.geometry = event.graphic.geometry;
              query.spatialRelationship = "intersects";
              featureLayer.queryFeatures(query).then(function (results) {
                // prints an array of all the features in the service to the console
                let features = results.features,
                    barData = [];
                features.forEach((feature) => {
                  barData.push([feature.attributes.name, feature.attributes['avg_score']]);
                });
                barData.sort((a,b)=>{
                  return b[1] - a[1];
                })
                that.setState({drawerVisible: true})
                that.updateChart(barData);
              });
            }
          });
          sketch.on("update", function(event){
            // check if the graphics are done being moved, printout dx, dy parameters to the console.
            const eventInfo = event.toolEventInfo;
            if (eventInfo && eventInfo.type.includes("move")){
              let query = featureLayer.createQuery();
              query.geometry = eventInfo.mover.geometry;
              query.spatialRelationship = "intersects";
              featureLayer.queryFeatures(query).then(function (results) {
                // prints an array of all the features in the service to the console
                let features = results.features,
                    barData = [];
                features.forEach((feature) => {
                  barData.push([feature.attributes.name, feature.attributes['avg_score']]);
                });
                barData.sort((a,b)=>{
                  return b[1] - a[1];
                })
                that.updateChart(barData);
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
          view.ui.add(sketch, "bottom-left");
          view.ui.add(compass, "bottom-right");
          view.ui.add(search, "top-right");
        });
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
          title="查询结果"
          placement="right"
          closable={true}
          onClose={this.props.onCloseDrawer}
          visible={this.state.drawerVisible}
          mask={false}
          width={300}
        >
          <Charts barData={this.state.barData} />
          {
            this.state.barData.map((item) => {
              return <p className="selected_item" key={item[0]} onClick={this.clickSelected.bind(this)}>{item[0]}</p>;
            })
          }
        </Drawer>
        <Details closeModal={this.handleCloseModal.bind(this)} title={this.state.detailTitle} visible={this.state.detailVisible} content={this.state.detailContent} />
      </div>
    )
  }
}
