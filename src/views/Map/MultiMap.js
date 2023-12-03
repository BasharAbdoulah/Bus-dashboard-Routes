import React, { useEffect, useState, useRef, useCallback } from "react";

import { Helmet } from "react-helmet";
import mapboxGl from "mapbox-gl/dist/mapbox-gl";
import axios from "axios";
import { Button, message, Row, Col, Input, Form } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { MdDirections } from "react-icons/md";
import queryString from "query-string";
import { connect } from "react-redux";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
// import MapboxDirections from "@mapbox/mapbox-gl-directions/src/directions";
// import MapboxWorker from "mapbox-gl/dist/mapbox-gl-csp-worker";
// mapboxGl.workerClass = MapboxWorker;

// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from "worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker";
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxGl.workerClass = MapboxWorker;
mapboxGl.accessToken =
  "pk.eyJ1IjoiaGFtdWRlc2hhaGluIiwiYSI6ImNrempnc2JzcjA2bmQyb3RhdnRxd2hsbnUifQ.OeXesE3wZ5B_V42D79rjJQ";
let isStartPoint = false;
let isEndPoint = false;
let mapMarkers = [];
let startMarker = null;
let endMarker = null;
const MultiMap = ({ token }) => {
  const map = useRef(null);
  const mapContainer = useRef(null);

  const [lng, setLng] = useState(47.6453);
  const [lat, setLat] = useState(29.3288);
  const [zoom, setZoom] = useState(9);

  const [loading, setLoading] = useState({
    type: "",
    value: true,
  });

  const [startPoint, setStartPoint] = useState({
    taked: false,
    lng: null,
    lat: null,
  });
  const [endPoint, setEndPoint] = useState({
    taked: false,
    lng: null,
    lat: null,
  });

  const getDirection = async (longitude, latitude) => {
    const url =
      "https://api.mapbox.com/directions/v5/mapbox/driving/-117.17334%2C32.71254%3B-117.17314%2C32.71259?alternatives=true&geometries=geojson&language=en&overview=simplified&steps=true&access_token=pk.eyJ1IjoiaGFtdWRlc2hhaGluIiwiYSI6ImNrempnc2JzcjA2bmQyb3RhdnRxd2hsbnUifQ.OeXesE3wZ5B_V42D79rjJQ";
    const { data: response } = await axios.get(url, {
      // coordinates:
      //   "117.17282,32.71204;-117.17288,32.71225;-117.17293,32.71244;-117.17292,32.71256;-117.17298,32.712603;-117.17314,32.71259;-117.17334,32.71254",
      headers: {},
    });
  };

  const removeDrawRoute = () => {
    // remove stations markers
    removeStationsMark();
    const startPoint = map.current.getLayer("startPoint");
    const route = map.current.getLayer("route");
    const endPoint = map.current.getLayer("endPoint");

    if (startPoint) {
      map.current.removeLayer("startPoint");
      map.current.removeSource("startPoint");
    }
    if (route) {
      map.current.removeLayer("route");
      map.current.removeSource("route");
    }
    if (endPoint) {
      map.current.removeLayer("endPoint");
      map.current.removeSource("endPoint");
    }
  };

  const removeStationsMark = () => {
    const arr = mapMarkers.filter((mark) => {
      if (mark.type === "path") {
        mark.mark.remove();
      } else {
        return mark;
      }
    });
    mapMarkers = arr;
  };

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxGl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });
    map.current.on("load", async function () {
      map.current.on("click", function (e) {
        // handleSetMarker(e);
        if (!isStartPoint) {
          isStartPoint = true;
          setStartPoint({
            lng: e.lngLat.lng,
            lat: e.lngLat.lat,
          });
          if (startMarker) startMarker.remove();
          removeDrawRoute();
          const marker = new mapboxGl.Marker({
            draggable: true,
          })
            .setLngLat([e.lngLat.lng, e.lngLat.lat])
            .addTo(map.current);
          message.success("Start point taked. Please choose end point");
          marker.on("dragend", function (e) {
            const lngLat = marker.getLngLat();
            setStartPoint({
              lng: lngLat.lng,
              lat: lngLat.lat,
            });

            removeDrawRoute();
          });
        } else if (isStartPoint && !isEndPoint) {
          isEndPoint = true;
          setEndPoint({
            lng: e.lngLat.lng,
            lat: e.lngLat.lat,
          });
          if (endMarker) endMarker.remove();
          removeDrawRoute();
          const marker = new mapboxGl.Marker({
            draggable: true,
          })
            .setLngLat([e.lngLat.lng, e.lngLat.lat])
            .addTo(map.current);
          marker.on("dragend", function (e) {
            const lngLat = marker.getLngLat();
            setEndPoint({
              lng: lngLat.lng,
              lat: lngLat.lat,
            });
            removeDrawRoute();
          });
        }
      });
    });

    // map.current.scrollZoom.enable();
  }, [startPoint, endPoint]);

  // get stations location from our backend
  const getStations = async () => {
    if (!startPoint.lng || !startPoint.lat || !endPoint.lng || !endPoint.lat) {
      message.error("Start or end point not selected!");
      return { status: false, directions: [] };
    }

    try {
      setLoading({
        type: "getStations",
        value: true,
      });
      const { data: res } = await axios.post(
        `${process.env.REACT_APP_API_HOST}api/FindMultiRoute1`,
        {
          Longitude1: startPoint.lng,
          Latitude1: startPoint.lat,
          Longitude2: endPoint.lng,
          Latitude2: endPoint.lat,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading({
        type: "",
        value: false,
      });
      if (res?.status === true) {
        if (
          res?.description?.route1?.length === 0 &&
          res?.description?.route2 === 0
        ) {
          message.warn("Stations not found in selected locations.");
          return { status: false, directions: [] };
        }
        await drawWalkToStartPoint(res);
        await drawWalkToEndPoint(res);
        let directions = [];
        let directions2 = [];
        let stations = [];
        let stations2 = [];
        res.description.route1.map((item) => {
          directions.push([item.longitude, item.latitude]);
          stations.push(item);
        });
        res.description.route2.map((item) => {
          directions2.push([item.longitude, item.latitude]);
          stations2.push(item);
        });
        return {
          status: true,
          directions,
          directions2,
          stations,
          stations2,
        };
      } else {
        message.error("No Route Founded");
        return { status: false, directions: [], directions2: [] };
      }
    } catch (err) {
      setLoading({
        type: "",
        value: false,
      });

      return { status: false, directions: [], directions2: [] };
      console.log(err);
    }
  };

  const drawWalkToStartPoint = async (res) => {
    const { data: response } = await axios.get(
      `https://api.mapbox.com/directions/v5/mapbox/walking/${
        res?.description?.startPoint.longitude +
        "," +
        res?.description?.startPoint.latitude +
        ";" +
        res?.description?.startStation.longitude +
        "," +
        res?.description?.startStation.latitude
      }?alternatives=true&annotations=distance%2Cduration%2Cspeed%2Ccongestion&geometries=geojson&language=en&overview=full&access_token=pk.eyJ1IjoiaGFtdWRlc2hhaGluIiwiYSI6ImNrempnc2JzcjA2bmQyb3RhdnRxd2hsbnUifQ.OeXesE3wZ5B_V42D79rjJQ`
    );

    let geometries = response?.routes[0]?.geometry?.coordinates;
    map.current.addLayer({
      id: "startPoint",
      type: "line",
      source: {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: geometries,
          },
        },
      },
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        // "line-color": "#3b9ddd",
        "line-color": "red",
        "line-width": 3,
        "line-opacity": 0.8,
      },
    });
  };
  const drawWalkToEndPoint = async (res) => {
    const { data: response } = await axios.get(
      `https://api.mapbox.com/directions/v5/mapbox/walking/${
        res?.description?.endPoint.longitude +
        "," +
        res?.description?.endPoint.latitude +
        ";" +
        res?.description?.endStation.longitude +
        "," +
        res?.description?.endStation.latitude
      }?alternatives=true&annotations=distance%2Cduration%2Cspeed%2Ccongestion&geometries=geojson&language=en&overview=full&access_token=pk.eyJ1IjoiaGFtdWRlc2hhaGluIiwiYSI6ImNrempnc2JzcjA2bmQyb3RhdnRxd2hsbnUifQ.OeXesE3wZ5B_V42D79rjJQ`
    );

    let geometries = response?.routes[0]?.geometry?.coordinates;
    map.current.addLayer({
      id: "endPoint",
      type: "line",
      source: {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: geometries,
          },
        },
      },
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        // "line-color": "#3b9ddd",
        "line-color": "red",
        "line-width": 3,
        "line-opacity": 0.8,
      },
    });
  };

  // get road lat and lag and draw path..
  const getStationsPathFromMapBox = async (directions, repeat) => {
    let data = { status: false, points: [], waypoints: [] };
    if (directions.length === 0) {
      message.error("Something went wrong! directions is null array");
      return data;
    }
    for (let i = 1; i <= repeat; i++) {
      const { data: response } = await axios.get(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${directions
          .slice((i - 1) * 24, i * 24)
          .join(
            ";"
          )}?alternatives=true&annotations=distance%2Cduration%2Cspeed%2Ccongestion&geometries=geojson&language=en&overview=full&access_token=pk.eyJ1IjoiaGFtdWRlc2hhaGluIiwiYSI6ImNrempnc2JzcjA2bmQyb3RhdnRxd2hsbnUifQ.OeXesE3wZ5B_V42D79rjJQ`
      );

      if (response?.code === "Ok") {
        let waypoints = response?.waypoints;
        let geometries = response?.routes[0]?.geometry?.coordinates;
        data.points.push(geometries);
        data.waypoints.push(waypoints);
      } else {
        alert(
          "Response not ok from mapbox. maybe we have more than 25 location"
        );
        break;
      }
      if (i === repeat) data.status = true;
    }
    return data;
  };
  const getStationsPathFromMapBox2 = async (directions2, repeat) => {
    let data = { status: false, points: [], waypoints: [] };
    if (directions2.length === 0) {
      message.error("Something went wrong! directions is null array");
      return data;
    }
    for (let i = 1; i <= repeat; i++) {
      const { data: response } = await axios.get(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${directions2
          .slice((i - 1) * 24, i * 24)
          .join(
            ";"
          )}?alternatives=true&annotations=distance%2Cduration%2Cspeed%2Ccongestion&geometries=geojson&language=en&overview=full&access_token=pk.eyJ1IjoiaGFtdWRlc2hhaGluIiwiYSI6ImNrempnc2JzcjA2bmQyb3RhdnRxd2hsbnUifQ.OeXesE3wZ5B_V42D79rjJQ`
      );

      if (response?.code === "Ok") {
        let waypoints = response?.waypoints;
        let geometries = response?.routes[0]?.geometry?.coordinates;
        data.points.push(geometries);
        data.waypoints.push(waypoints);
      } else {
        alert(
          "Response not ok from mapbox. maybe we have more than 25 location"
        );
        break;
      }
      if (i === repeat) data.status = true;
    }
    return data;
  };

  const startButtonHandler = async () => {
    const { status, directions, directions2, stations2, stations } =
      await getStations();
    if (status === true) {
      let repeat = 1;
      let repeat1 = 1;
      // check 25 ..
      if (directions.length > 25) {
        repeat = Math.ceil(directions.length / 25);
      }
      if (directions2.length > 25) {
        repeat1 = Math.ceil(directions2.length / 25);
      }
      const data = await getStationsPathFromMapBox(directions, repeat);
      const data2 = await getStationsPathFromMapBox2(directions2, repeat1);
      if (data.status === true) {
        stations?.map((item) => {
          const mark = new mapboxGl.Marker({
            draggable: false,
          })
            .setLngLat([item.longitude, item.latitude])
            .setPopup(
              new mapboxGl.Popup({ offset: 25, closeOnClick: false }).setHTML(
                `
             

                <span style=" font-size:7px;over-flow:hidden;font-weight:bold;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:1;">${item.station.substring(
                  0,
                  20
                )}...
                  </span>
               
                    <span style="text-align:center; font-size:8px;font-weight:bold;">Direction:</span>
                    <span style="text-align:center; font-size:8px;font-weight:bold;">${
                      item.direction === 0 ? "Go" : "Back"
                    }</span>
               
                    <span style="text-align:center; font-size:8px;font-weight:bold;">Order:</span>
                    <span style="text-align:center; font-size:8px;font-weight:bold;">${
                      item.order
                    }</span>
                 
                  
                  `
              )
            )

            .addTo(map.current);
          mapMarkers.push({ type: "path", mark: mark });
        });

        let points = [];
        for (let i = 0; i < repeat; i++) {
          for (let j = 0; j < data?.points[i].length; j++) {
            points.push(data.points[i][j]);
          }
        }

        map.current.addLayer({
          id: "route",
          type: "line",
          source: {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: points,
              },
            },
          },
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            // "line-color": "#3b9ddd",
            "line-color": "yellow",
            "line-width": 3,
            "line-opacity": 0.8,
          },
        });
      }
      if (data.status === true) {
        stations?.map((item) => {
          const mark = new mapboxGl.Marker({
            draggable: false,
          })
            .setLngLat([item.longitude, item.latitude])
            .setPopup(
              new mapboxGl.Popup({ offset: 25, closeOnClick: false }).setHTML(
                `
             

                <span style=" font-size:7px;over-flow:hidden;font-weight:bold;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:1;">${item.station.substring(
                  0,
                  20
                )}...
                  </span>
               
                    <span style="text-align:center; font-size:8px;font-weight:bold;">Direction:</span>
                    <span style="text-align:center; font-size:8px;font-weight:bold;">${
                      item.direction === 0 ? "Go" : "Back"
                    }</span>
               
                    <span style="text-align:center; font-size:8px;font-weight:bold;">Order:</span>
                    <span style="text-align:center; font-size:8px;font-weight:bold;">${
                      item.order
                    }</span>
                 
                  
                  `
              )
            )

            .addTo(map.current);
          mapMarkers.push({ type: "path", mark: mark });
        });

        let points = [];
        for (let i = 0; i < repeat; i++) {
          for (let j = 0; j < data?.points[i].length; j++) {
            points.push(data.points[i][j]);
          }
        }

        map.current.addLayer({
          id: "route",
          type: "line",
          source: {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: points,
              },
            },
          },
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            // "line-color": "#3b9ddd",
            "line-color": "yellow",
            "line-width": 3,
            "line-opacity": 0.8,
          },
        });
      }
      if (data2.status === true) {
        stations2?.map((item) => {
          const mark = new mapboxGl.Marker({
            draggable: false,
          })
            .setLngLat([item.longitude, item.latitude])
            .setPopup(
              new mapboxGl.Popup({ offset: 25, closeOnClick: false }).setHTML(
                `
             

                <span style=" font-size:7px;over-flow:hidden;font-weight:bold;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:1;">${item.station.substring(
                  0,
                  20
                )}...
                  </span>
               
                    <span style="text-align:center; font-size:8px;font-weight:bold;">Direction:</span>
                    <span style="text-align:center; font-size:8px;font-weight:bold;">${
                      item.direction === 0 ? "Go" : "Back"
                    }</span>
               
                    <span style="text-align:center; font-size:8px;font-weight:bold;">Order:</span>
                    <span style="text-align:center; font-size:8px;font-weight:bold;">${
                      item.order
                    }</span>
                 
                  
                  `
              )
            )

            .addTo(map.current);
          mapMarkers.push({ type: "path", mark: mark });
        });

        let points = [];
        for (let i = 0; i < repeat1; i++) {
          for (let j = 0; j < data?.points[i].length; j++) {
            points.push(data.points[i][j]);
          }
        }

        map.current.addLayer({
          id: "route",
          type: "line",
          source: {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: points,
              },
            },
          },
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            // "line-color": "#3b9ddd",
            "line-color": "yellow",
            "line-width": 3,
            "line-opacity": 0.8,
          },
        });
      }
    }
  };
  async function getLocationDetails() {
    if (startPoint.lng && startPoint.lat) {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${startPoint.lng},${endPoint.lat}.json?types=address&access_token=pk.eyJ1IjoiaGFtdWRlc2hhaGluIiwiYSI6ImNrempnc2JzcjA2bmQyb3RhdnRxd2hsbnUifQ.OeXesE3wZ5B_V42D79rjJQ`;
      const { data: res } = await axios.get(url);
      console.log("start point res");
      console.log(res);
    }
  }

  return (
    <div>
      <Helmet>
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v2.3.1/mapbox-gl.css"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-directions/v4.1.0/mapbox-gl-directions.css"
          type="text/css"
        />
      </Helmet>
      <div
        ref={mapContainer}
        style={{ width: "80vw", height: "100vh", position: "relative" }}
        id="map"
      >
        {loading.value === true && loading.type === "getStations" && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              gap: 20,
              zIndex: 1000,
              color: "white",
              background: "rgba(0, 0, 0, 0.3)",
            }}
          >
            <h2 style={{ color: "white" }}>Getting Stations ...</h2>
            <LoadingOutlined style={{ fontSize: 28 }} />
          </div>
        )}

        <Button
          icon={<MdDirections />}
          type="primary"
          style={{
            position: "absolute",
            left: 10,
            bottom: 10,
            zIndex: 100000,
          }}
          onClick={startButtonHandler}
        >
          Start
        </Button>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps, {})(MultiMap);
