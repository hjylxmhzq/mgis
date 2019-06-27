"use strict";

import React, { Component } from 'react';
import { Bar, Radar } from '../charts';
import Details from '../details';
import esriLoader from 'esri-loader';
import coordtransform from 'coordtransform';
import { Drawer, Tabs, notification, Button } from 'antd';
import { debounce } from '../../utils/index';
import './mainbox.css';
const { TabPane } = Tabs;

export default class MainBox extends Component {
  constructor(props) {
    super(props)
    //地图请求url
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
      duration: '',
      clickItemLocation: { x: '', y: '' }
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

  handleCloseModalAndCreateDest(location) {
    if (this.routeLayer && this.routeSketch) {
      this.pointChoose = 'destination';
      if (this.OD[0]) {
        this.routeLayer.remove(this.OD[0]);
      }
      let that = this;
      //this.routeSketch.create("point", { mode: "click" });
      navigator.geolocation.getCurrentPosition(function (pos) {
        let lat = pos.coords.latitude;
        let lng = pos.coords.longitude;
        that.notice(`当前位置   X: ${lng.toString().substr(0, 7)},  Y:${lat.toString().substr(0, 7)}`);
        fetch(`http://tony-space.top:8007/baiduroute?origin=${lat.toString()},${lng.toString()}&destination=${location.y.toString()},${location.x.toString()}`)
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
                  route.push(coordtransform.bd09togcj02(...coordtransform.gcj02towgs84(parseFloat(i.split(',')[0]), parseFloat(i.split(',')[1]))));
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
                duration: result['result']['routes'][0]['duration'] > 3600 ? (result['result']['routes'][0]['duration'] / 3600).toString().substr(0, 6) + '小时' : result['result']['routes'][0]['duration'] + '秒',
                drawerVisible: true,
                tabsIndex: '2',
                destination: { x: location.x, y: location.y },
                origin: { x: lng, y: lat }
              });
            } else {
              that.notice('路径获取失败');
            }
          });
      }, function handle_errors(error) {
        let e = ''
        switch(error.code) {
         case error.PERMISSION_DENIED: e = "user did not share geolocation data";
         break;
       
         case error.POSITION_UNAVAILABLE: e = "could not detect current position";
         break;
       
         case error.TIMEOUT: e = "retrieving position timed out";
         break;
       
         default: e = "unknown error";
         break;
        }
        that.notice('获取位置失败，请检查浏览器设置 原因：'+e);
       })

    }
    this.setState({ detailVisible: false });
  }

  onCloseDrawer() {
    this.props.onCloseDrawer();
  }

  clickSelected(index, name, event) {
    let content = {}, clickItem = null;
    for (let item of this.state.barData) {
      if (name === item['名称']) {
        clickItem = item;
        break;
      }
    }
    for (let i in clickItem) {
      content[i] = clickItem[i];
    }
    let location = {
      x: clickItem ? clickItem['经度'] : '',
      y: clickItem ? clickItem['纬度'] : ''
    }
    console.log(clickItem)
    this.setState({ detailVisible: true, detailContent: content, detailTitle: name, clickItemLocation: location });
  }

  createCityRender(city) {
    let cityRenderer = {
      type: "unique-value",  // autocasts as new UniqueValueRenderer()
      field: "城市",
      defaultSymbol: {
        type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
        size: 6,
        color: "green",
        outline: {  // autocasts as new SimpleLineSymbol()
          width: 0.5,
          color: "white"
        }
      },  // autocasts as new SimpleFillSymbol()
      uniqueValueInfos: [{
        // All features with value of "North" will be blue
        value: city,
        symbol: {
          type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
          size: 13,
          color: "green",
          outline: {  // autocasts as new SimpleLineSymbol()
            width: 0.5,
            color: "white"
          }
        }
      }]
    };
  }

  createClassRenderer(classMethod) {
    let classRenderer = {
      type: "class-breaks",  // autocasts as new ClassBreaksRenderer()
      field: classMethod,
      classBreakInfos: [
        {
          minValue: 0,  // 0 acres
          maxValue: 2,  // 200,000 acres
          symbol: {
            type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
            size: 6,
            color: [51, 90, 51, 0.7],
            outline: {  // autocasts as new SimpleLineSymbol()
              width: 0.5,
              color: "white"
            }
          },  // will be assigned sym1
        }, {
          minValue: 2,  // 200,001 acres
          maxValue: 4,  // 500,000 acres
          symbol: {
            type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
            size: 7,
            color: [51, 120, 51, 0.8],
            outline: {  // autocasts as new SimpleLineSymbol()
              width: 0.5,
              color: "white"
            }
          },  // will be assigned sym2
        }, {
          minValue: 4,  // 500,001 acres
          maxValue: 6,  // 750,000 acres
          symbol: {
            type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
            size: 8,
            color: [51, 140, 51, 0.9],
            outline: {  // autocasts as new SimpleLineSymbol()
              width: 0.5,
              color: "white"
            }
          },  // will be assigned sym2
        }, {
          minValue: 6,  // 500,001 acres
          maxValue: 8,  // 750,000 acres
          symbol: {
            type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
            size: 9,
            color: [51, 160, 51, 1],
            outline: {  // autocasts as new SimpleLineSymbol()
              width: 0.5,
              color: "white"
            }
          },  // will be assigned sym2
        }, {
          minValue: 8,  // 500,001 acres
          maxValue: 10,  // 750,000 acres
          symbol: {
            type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
            size: 11,
            color: [51, 190, 51, 1],
            outline: {  // autocasts as new SimpleLineSymbol()
              width: 0.5,
              color: "white"
            }
          },  // will be assigned sym2
        }
      ]
    };
    return classRenderer;
  }

  createDefaultRenderer() {
    return {
      type: "simple",  // autocasts as new SimpleRenderer()
      symbol: {
        type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
        size: 6,
        color: "green",
        outline: {  // autocasts as new SimpleLineSymbol()
          width: 0.5,
          color: "white"
        }
      }
    };
  }

  handleMouseOver(mapPoint, name, id, e) {
    this.view && this.view.popup.open({
      // Set the popup's title to the coordinates of the location
      title: name,
      content: `<img style="height:200px;" src="http://www.tony-space.top:8000/wordcloud/${id}.png" alt="无评论数据" />`,
      location: mapPoint, // Set the location of the popup to the clicked location
    });
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
    if (this.hotLayer) {

      this.hotLayer.sublayers = [{
        id: this.props.hotmapIndex,
        visible: true
      }]
    }
    if (that.props.weight && that.featureLayer) {
      let searchCity = '';
      console.log(that.props.weight)

      searchCity = that.props.weight['city'] ? that.props.weight['city'][1] : '';
      searchCity = searchCity && searchCity[searchCity.length - 1] === '市' ? searchCity.substr(0, searchCity.length - 1) : searchCity;
      let weight = that.props.weight;

      let query = that.featureLayer.createQuery();
      //query.geometry = event.graphic.geometry;
      //query.spatialRelationship = "intersects";
      that.featureLayer.queryFeatures(query).then(function (results) {
        // prints an array of all the features in the service to the console
        //console.log(results)
        let features = results.features,
          barData = [];
        features.forEach((feature) => {
          if (feature.attributes['城市'] === searchCity) {
            feature.attributes.mapPoint = feature.geometry;
            barData.push(feature.attributes);
          }
        });

        barData.sort((a, b) => {
          let weightA = a['服务'] * weight['service'] + a['价格分'] * weight['pricetype'] + a['热度分'] * weight['poptype'] + a['教练'] * weight['coach'] + a['场地'] * weight['facility'];
          let weightB = b['服务'] * weight['service'] + b['价格分'] * weight['pricetype'] + b['热度分'] * weight['poptype'] + b['教练'] * weight['coach'] + b['场地'] * weight['facility'];
          return weightB - weightA;
        });
        that.view && barData.length > 0 && (that.view.center = [barData[0]['经度'], barData[0]['纬度']]);
        barData = barData.slice(0, 20);
        that.notice('正在提供推荐内容');
        that.setState({ drawerVisible: true, tabsIndex: '1' })
        that.updateChart(barData);
      }).catch(function (err) {
        console.log(err)
      });
      that.props.closeLoading();
    }
    if (this.props.hotmap) {
      this.hotLayer && (this.hotLayer.visible = true);
    } else {
      this.hotLayer && (this.hotLayer.visible = false);
    }
    if (this.props.reset && this.sketch) {
      this.sketch.reset();
      this.notice('范围已重置');
      for (let i = 0; i < this.selectGrphics.length; i++) {
        this.graphicsLayer2.remove(this.selectGrphics[i]);
      }
      this.selectGrphics = [];
    }
    if (this.props.createPolygon && this.sketch) {
      this.sketch.create("polygon", { mode: "click" });
    }
    if (this.props.createOrigin && this.routeLayer && this.routeSketch) {
      this.pointChoose = 'origin';
      if (this.OD[0]) {
        this.routeLayer.remove(that.OD[0]);
      }
      this.routeSketch.create("point", { mode: "click" });
    }
    if (this.props.createDestination && this.routeLayer && this.routeSketch) {
      this.pointChoose = 'destination';
      if (this.OD[0]) {
        this.routeLayer.remove(this.OD[0]);
      }
      this.routeSketch.create("point", { mode: "click" });
    }
    if (this.props.queryRoute) {
      if (this.state.origin.x.toString().length === 0 || this.state.destination.x.toString().length === 0) {
        this.notice('未选择起止点！');
      } else {
        fetch(`http://tony-space.top:8007/baiduroute?origin=${this.state.origin.y.toString()},${this.state.origin.x.toString()}&destination=${this.state.destination.y.toString()},${this.state.destination.x.toString()}`)
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
                  route.push(coordtransform.bd09togcj02(...coordtransform.gcj02towgs84(parseFloat(i.split(',')[0]), parseFloat(i.split(',')[1]))));
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
                duration: result['result']['routes'][0]['duration'] > 3600 ? (result['result']['routes'][0]['duration'] / 3600).toString().substr(0, 6) + '小时' : result['result']['routes'][0]['duration'] + '秒',
              });
            } else {
              that.notice('路径获取失败');
            }
          });
      }
    }
    let classField = '';
    let renderer = null;

    if (this.featureLayer) {
      switch (this.props.classMethod) {
        case 'service': renderer = this.createClassRenderer('服务'); break;
        case 'comment': renderer = this.createClassRenderer('热度'); break;
        case 'default': renderer = this.createDefaultRenderer(); break;
        default:
          renderer = this.createDefaultRenderer(); break;
      }
      this.featureLayer.renderer = renderer;
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      drawerVisible: nextProps.drawerVisible,
      tabsIndex: nextProps.tabsIndex,
      search: nextProps.search
    });
    this.map && (this.map.basemap = nextProps.basemap);
  }

  componentDidMount() {


    this.initMap();
  }

  initMap() {

    let that = this;
    that.search = that.props.search && that.props.search.params['search'] !== 'nosearch' ? true : false;
    const mapURL = {
      url: "http://tony-space.top:8007/arcgis_js_api/library/4.11/dojo/dojo.js"
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
      "esri/layers/MapImageLayer",
      "esri/renderers/SimpleRenderer",
      "esri/symbols/SimpleFillSymbol",
      "esri/Color",
      "esri/symbols/SimpleLineSymbol",
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
      MapImageLayer,
      SimpleRenderer,
      SimpleFillSymbol,
      Color,
      SimpleLineSymbol
    ]) => {
      let search = '', searchCity = '';
      try {
        search = that.props.search && that.props.search.params && that.props.search.params['search'] ? that.props.search.params['search'].split('&') : ['', '', '', '']
        searchCity = search[1].split(',')[1] ? search[1].split(',')[1] : '';
        searchCity = searchCity[searchCity.length - 1] === '市' ? searchCity.substr(0, searchCity.length - 1) : searchCity;
      } catch (e) {
        //
      }


      this.Graphic = Graphic;
      const unit = "kilometers";
      // Create layers
      const graphicsLayer = new GraphicsLayer();
      const graphicsLayer2 = new GraphicsLayer();
      const routeLayer = new GraphicsLayer();
      this.routeLayer = routeLayer;
      this.graphicsLayer2 = graphicsLayer2;
      this.hotLayer = new MapImageLayer({
        //url: "http://arcserver.tony-space.top:8000/arcgis/rest/services/golfmap/MapServer",
        url: "http://172.20.32.139:6080/arcgis/rest/services/golfmap/MapServer",
        visible: false,
        opacity: 0.5,
        sublayers: [{
          id: this.state.hotmapIndex,
          visible: true
        }]
      });

      let classField = '';
      let renderer = null;
      switch (this.props.classMethod) {
        case 'service': renderer = this.createClassRenderer('服务'); break;
        case 'comment': renderer = this.createClassRenderer('热度'); break;
        case 'default': renderer = this.createDefaultRenderer(); break;
        default:
          renderer = this.createDefaultRenderer(); break;
      }
      classField = '服务'
      const featureLayer = this.featureLayer = new FeatureLayer({
        // URL to the service
        //url: "https://arcserver.tony-space.top:8001/arcgis/rest/services/golfmap/MapServer/0",
        url: "http://172.20.32.139:6080/arcgis/rest/services/golfmap/MapServer/0",
        renderer: renderer,
        outFields: ['*']
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
                let content = [];
                for (let i in results.features[0].attributes) {
                  content[i] = results.features[0].attributes[i];
                }
                let location = {
                  x: results.features[0].attributes['经度'],
                  y: results.features[0].attributes['纬度']
                }
                that.setState({ detailVisible: true, detailTitle: results.features[0].attributes['名称'], detailContent: content, clickItemLocation: location });
              }
            })
          }
        });
      });

      const sketchUpdate = debounce((event) => {
        // check if the graphics are done being moved, printout dx, dy parameters to the console.
        const eventInfo = event.toolEventInfo;
        if (eventInfo && eventInfo.type.includes("move")) {

          let query = this.featureLayer.createQuery();
          query.geometry = eventInfo.mover.geometry;
          query.spatialRelationship = "intersects";
          let that = this;
          this.featureLayer.queryFeatures(query).then(function (results) {
            //console.log(results);
            // prints an array of all the features in the service to the console
            let features = results.features,
              barData = [];
            features.forEach((feature) => {
              feature.attributes.mapPoint = feature.geometry;
              barData.push(feature.attributes);
            });
            barData.sort((a, b) => {
              return b['平均分'] - a['平均分'];
            })
            that.updateChart(barData);
          });
        }
      }, 500, true);
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
              }
              else if (that.pointChoose === 'chooseddest') {
                that.OD[1] = event.graphic;
                that.setState({ destination: { x: event.graphic.geometry.longitude, y: event.graphic.geometry.latitude } });
                that.notice('请选择起点')
                that.pointChoose = 'originwithoutcreate';
                if (that.OD[0]) {
                  that.routeLayer.remove(that.OD[0]);
                }
                that.routeSketch.create("point", { mode: "click" });
              } else if (that.pointChoose === 'originwithoutcreate') {
                that.setState({ destination: { x: event.graphic.geometry.longitude, y: event.graphic.geometry.latitude } });
                that.pointChoose = 'origin';
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
                console.log(results)
                let features = results.features,
                  barData = [];
                features.forEach((feature) => {
                  feature.attributes.mapPoint = feature.geometry;
                  barData.push(feature.attributes);
                });
                barData.sort((a, b) => {
                  return b['平均分'] - a['平均分'];
                })
                that.setState({ drawerVisible: true, tabsIndex: '1' })
                that.updateChart(barData);
              });
            }
          });
          sketch.on("update", sketchUpdate);
          const search = new Search({
            view: view,
            sources: [
              {
                layer: featureLayer,
                searchFields: ["地址", '名称', '城市', '区'],
                displayField: "名称",
                exactMatch: false,
                outFields: ["*"],
                name: "球场信息",
                placeholder: "example: 北京",
                suggestionsEnabled: true
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
      if (that.search) {

        let search = that.props.search.params['search'].split('&'),
          searchCity = search[1].split(',')[1] ? search[1].split(',')[1] : '';
        searchCity = searchCity[searchCity.length - 1] === '市' ? searchCity.substr(0, searchCity.length - 1) : searchCity;
        //console.log(that.search)
        let query = featureLayer.createQuery();
        //query.geometry = event.graphic.geometry;
        //query.spatialRelationship = "intersects";
        featureLayer.queryFeatures(query).then(function (results) {
          // prints an array of all the features in the service to the console
          //console.log(results)
          let features = results.features,
            barData = [];
          features.forEach((feature) => {
            if (feature.attributes['城市'] === searchCity) {
              feature.attributes.mapPoint = feature.geometry;
              barData.push(feature.attributes);
            }
          });
          barData.sort((a, b) => {
            return b['平均分'] - a['平均分'];
          })
          that.view && barData.length > 0 && (that.view.center = [barData[0]['经度'], barData[0]['纬度']]);
          that.props.closeLoading();
          that.setState({ drawerVisible: true, tabsIndex: '1' })
          that.updateChart(barData);
          that.search = false;
        });
      } else {
        that.props.closeLoading();
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
          width={400}
        >
          <Tabs defaultActiveKey={this.state.tabsIndex} activeKey={this.state.tabsIndex} onChange={this.handleTabChange.bind(this)}>
            <TabPane tab="查询结果" key="1">
              {this.state.barData.length > 0 ?
              <Bar barData={this.state.barData} />
              : '无数据'
              }
              {
                this.state.barData.map((item, index) => {
                  return <div
                    className="selected_item"
                    key={Math.random().toString()}
                    onClick={this.clickSelected.bind(this, index, item['名称'])}
                    onMouseOver={() => { this.handleMouseOver(item.mapPoint, item['名称'], item['id']) }}
                  >
                    <div>{(index + 1).toString() + '. ' + item['名称']}</div>
                    <div style={{ fontSize: '12px' }}>地址：{item['地址']}</div>
                  </div>;
                })
              }
            </TabPane>
            <TabPane tab="路径" key="2">
              <p>起点<br />{'X:' + this.state.origin.x.toString().substr(0, 8) + ' Y:' + this.state.origin.y.toString().substr(0, 8)}</p>
              <p>终点<br />{'X:' + this.state.destination.x.toString().substr(0, 8) + ' Y:' + this.state.destination.y.toString().substr(0, 8)}</p>
              <p>耗时<br />{this.state.duration}</p>
              <p>距离<br />{this.state.distance.toString() + '米'}</p>
              <Button type="primary" onClick={this.clearRoute.bind(this)}>清除路径</Button>
            </TabPane>
            <TabPane tab="球场对比" key="3">
              <Bar barData={this.state.barData} />
              <Radar barData={this.state.barData} />
            </TabPane>
          </Tabs>

        </Drawer>

        <Details
          closeModal={this.handleCloseModal.bind(this)}
          closeModalAndGo={this.handleCloseModalAndCreateDest.bind(this)}
          title={this.state.detailTitle}
          visible={this.state.detailVisible}
          content={this.state.detailContent}
          location={this.state.clickItemLocation}
        />
      </div>
    )
  }
}
