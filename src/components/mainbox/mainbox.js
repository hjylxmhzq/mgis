"use strict";

import React, { Component } from 'react';
import Charts from '../charts';
import Details from '../details';
import esriLoader from 'esri-loader';
import { Drawer, Tabs, notification, Button } from 'antd';
import './mainbox.css';
const { TabPane } = Tabs;

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
    this.pointChoose = 'origin';
    this.OD = new Array(2);
    this.Graphic = null;
    this.featureLayer = null;
    this.featureLayerView = null;
    this.highlight = null;
    this.state = {
      drawerVisible: props.drawerVisible,
      drawerContent: [],
      barData: [],
      detailVisible: false,
      destination: { x: '', y: '' },
      origin: { x: '', y: '' },
      distance: '',
      duration: ''
    };
    this.routeGraphic = null;
  }

  clearRoute() {
    if (this.routeGraphic) {
      this.view.graphics.remove(this.routeGraphic);
      this.routeGraphic = null;
    };
    if (this.OD[0]) {
      this.routeLayer.remove(this.OD[0]);
    } 
    if (this.OD[1]) {
      this.routeLayer.remove(this.OD[1]);
    }
  }

  notice(msg) {
    notification.open({
      message: '消息',
      description:
        msg,
      onClick: () => {
        console.log('Notification Clicked!');
      },
    });
  }

  selectFeature(featureLayer, objectId, callback) {
    // query feature from the server
    featureLayer
      .queryFeatures({
        objectIds: [objectId],
        outFields: ["*"],
        returnGeometry: true
      })
      .then(function (results) {
        callback(results);
      });
  }

  updateChart(barData) {
    this.setState({ barData });
  }

  handleCloseModal() {

    this.setState({ detailVisible: false });
  }

  onCloseDrawer() {
    this.props.onCloseDrawer();
  }

  clickSelected(event) {
    let content = <p>content</p>
    this.setState({ detailVisible: true, detailContent: content, detailTitle: event.target.innerText })
  }

  handleTabChange(tabsIndex) {
    this.setState({ tabsIndex });
  }

  showDrawer = () => {
    this.setState({
      drawerVisible: true,
    });
  };

  componentDidUpdate() {
    let that = this;
    if (this.props.hotmap) {
      this.hotLayer.visible = true;
    } else {
      this.hotLayer.visible = false;
    }
    if (this.props.reset) {
      this.sketch.reset();
      this.notice('范围已重置');
      for (let i = 0; i < this.selectGrphics.length; i++) {
        this.graphicsLayer2.remove(this.selectGrphics[i]);
      }
      this.selectGrphics = [];
    }
    if (this.props.createPolygon) {
      this.sketch.create("polygon", { mode: "click" });
    }
    if (this.props.createOrigin) {
      this.pointChoose = 'origin';
      if (that.OD[0]) {
        that.routeLayer.remove(that.OD[0]);
      }
      this.routeSketch.create("point", { mode: "click" });
    }
    if (this.props.createDestination) {
      this.pointChoose = 'destination';
      if (that.OD[0]) {
        that.routeLayer.remove(that.OD[0]);
      }
      this.routeSketch.create("point", { mode: "click" });
    }
    if (this.props.queryRoute) {
      if (this.state.origin.x.toString().length === 0 || this.state.destination.x.toString().length === 0) {
        this.notice('未选择起止点！');
      } else {
        fetch(`https://tony-space.top:8008/baiduroute?origin=${this.state.origin.y.toString()},${this.state.origin.x.toString()}&destination=${this.state.destination.y.toString()},${this.state.destination.x.toString()}`)
          .then(function (response) {
            return response.json();
          })
          .then(function (result) {
            if (result.status === 0) {
              let steps = result['result']['routes'][0]['steps'];

              let route = [];
              for (let step = 0; step < steps.length; step++) {
                let path = steps[step]['path'];
                let paths = path.split(';');
                for (let i of paths) {
                  route.push([parseFloat(i.split(',')[0]), parseFloat(i.split(',')[1])])
                }
              }
              var polyline = {
                type: "polyline", // autocasts as new Polyline()
                paths: route
              };
              var lineSymbol = {
                type: "simple-line", // autocasts as new SimpleLineSymbol()
                color: [226, 119, 40], // RGB color values as an array
                width: 4
              };
              var lineAtt = {
                Name: "baidu route", // The name of the pipeline
              };
              if (that.Graphic) {
                that.clearRoute();
                that.routeGraphic = new that.Graphic({
                  geometry: polyline, // Add the geometry created in step 4
                  symbol: lineSymbol, // Add the symbol created in step 5
                  attributes: lineAtt // Add the attributes created in step 6
                });
                that.view.graphics.add(that.routeGraphic);
              }
              that.setState({
                distance: result['result']['routes'][0]['distance'],
                duration: result['result']['routes'][0]['duration']
              });
            } else {
              that.notice('路径获取失败');
            }
          });
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      drawerVisible: nextProps.drawerVisible,
      tabsIndex: nextProps.tabsIndex
    });
    this.map.basemap = nextProps.basemap;
  }

  componentDidMount() {
    this.initMap()
  }

  initMap() {

    let that = this;

    const mapURL = {
      url: "https://www.tony-space.top:8001/arcgis_js_api/library/4.11/dojo/dojo.js"
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
      MapImageLayer
    ]) => {
      this.Graphic = Graphic;
      const unit = "kilometers";
      // Create layers
      const graphicsLayer = new GraphicsLayer();
      const graphicsLayer2 = new GraphicsLayer();
      const routeLayer = new GraphicsLayer();
      this.routeLayer = routeLayer;
      this.graphicsLayer2 = graphicsLayer2;
      this.hotLayer = new MapImageLayer({
        url: "https://arcserver.tony-space.top:8001/arcgis/rest/services/golfmap/MapServer",
        visible: false,
        opacity: 0.5,
        sublayers: [{
          id: 2,
          visible: true
        }]
      });
      const featureLayer = this.featureLayer = new FeatureLayer({
        // URL to the service
        url: "https://arcserver.tony-space.top:8001/arcgis/rest/services/golfmap/MapServer/0"
      });
      // Create map
      let basemap = this.props.basemap;
      this.map = new Map({
        basemap,
        layers: [featureLayer, this.hotLayer, graphicsLayer2, graphicsLayer, routeLayer]
      });
      let map = this.map;
      // Create view
      this.view = new MapView({
        container: "mapDiv",
        map,
        zoom: 6,
        center: [113.083, 27.3069],
        constraints: {
          maxScale: 0,
          minScale: 300000000
        }
      });


      let view = this.view;

      view.on('click', (event) => {
        view.hitTest(event).then(function (response) {
          // If user selects a feature, select it
          const results = response.results;
          if (
            results.length > 0 &&
            results[0].graphic &&
            results[0].graphic.layer === featureLayer
          ) {
            let objectId = results[0].graphic.attributes[featureLayer.objectIdField];

            that.selectFeature(featureLayer, objectId, function (results) {
              if (that.featureLayerView) {
                if (that.highlight) {
                  that.highlight.remove();
                }
                that.highlight = that.featureLayerView.highlight(results.features);
                that.setState({ detailVisible: true, detailTitle: results.features[0].attributes.name, detailContent: 'content' });
              }
            })
          }
        });
      });

      // Update UI
      setUpAppUI();

      function setUpAppUI() {
        // When layer is loaded, create a watcher to trigger drawing of the buffer polygon
        view.whenLayerView(featureLayer).then(function (layerView) {
          that.featureLayerView = layerView;
        });
        view.when(function () {
          // Display the chart in an Expand widget
          var compass = new Compass({
            view
          });
          const sketch = new Sketch({
            view,
            layer: graphicsLayer2
          });
          const routeSketch = new Sketch({
            view,
            layer: routeLayer
          });
          that.routeSketch = routeSketch;
          that.sketch = sketch;
          routeSketch.on("create", (event) => {
            if (event.state === "complete") {
              if (that.pointChoose === 'origin') {
                that.OD[0] = event.graphic;
                that.setState({ origin: { x: event.graphic.geometry.longitude, y: event.graphic.geometry.latitude } });
                that.notice('请选择终点')
                that.pointChoose = 'destination';
                if (that.OD[1]) {
                  that.routeLayer.remove(that.OD[1]);
                }
                that.routeSketch.create("point", { mode: "click" });
              } else {
                that.OD[1] = event.graphic;
                that.setState({ destination: { x: event.graphic.geometry.longitude, y: event.graphic.geometry.latitude } });
              }
            }
          })
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
                barData.sort((a, b) => {
                  return b[1] - a[1];
                })
                that.setState({ drawerVisible: true })
                that.updateChart(barData);
              });
            }
          });
          sketch.on("update", function (event) {
            // check if the graphics are done being moved, printout dx, dy parameters to the console.
            const eventInfo = event.toolEventInfo;
            if (eventInfo && eventInfo.type.includes("move")) {
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
                barData.sort((a, b) => {
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
          title="工具"
          placement="right"
          closable={true}
          onClose={this.onCloseDrawer.bind(this)}
          visible={this.state.drawerVisible}
          mask={false}
          width={300}
        >
          <Tabs defaultActiveKey={this.state.tabsIndex} activeKey={this.state.tabsIndex} onChange={this.handleTabChange.bind(this)}>
            <TabPane tab="查询结果" key="1">
              <Charts barData={this.state.barData} />
              {
                this.state.barData.map((item) => {
                  return <p className="selected_item" key={Math.random().toString()} onClick={this.clickSelected.bind(this)}>{item[0]}</p>;
                })
              }
            </TabPane>
            <TabPane tab="路径" key="2">
              <p>起点<br />{'X:' + this.state.origin.x.toString() + ' Y:' + this.state.origin.y.toString()}</p>
              <p>终点<br />{'X:' + this.state.destination.x.toString() + ' Y:' + this.state.destination.y.toString()}</p>
              <p>耗时<br />{this.state.duration.toString()+'秒'}</p>
              <p>距离<br />{this.state.distance.toString()+'米'}</p>
              <Button type="primary" onClick={this.clearRoute.bind(this)}>清除路径</Button>
            </TabPane>
          </Tabs>

        </Drawer>

        <Details closeModal={this.handleCloseModal.bind(this)} title={this.state.detailTitle} visible={this.state.detailVisible} content={this.state.detailContent} />
      </div>
    )
  }
}
