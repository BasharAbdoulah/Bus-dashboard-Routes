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
const Map = ({ token }) => {
  const map = useRef(null);
  const mapContainer = useRef(null);

  const { id, name, from_To } = queryString.parse(window.location.search);

  const [lng, setLng] = useState(47.6453);
  const [lat, setLat] = useState(29.3288);
  const [zoom, setZoom] = useState(9);

  // inputs
  const [startInput, setStartInput] = useState("");
  const [endInput, setEndInput] = useState("");

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

    console.log("response");
    console.log(response);
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

  const getStationsByRouteID = async () => {
    const { data: res } = await axios.post(
      "https://route.click68.com/api/ListStationByRouteID",
      {
        PageSize: 1000,
        id,
        name,
        from_To,
      },

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res?.status === true) {
      if (res?.description?.length === 0) {
        message.warning("This route did not contain any station");
        return;
      }
      const directions = res?.description?.map((item) => [
        item.longitude,
        item.latitude,
      ]);

      let repeat = 1;
      // check 25 ..
      if (directions.length > 25) {
        repeat = Math.ceil(directions.length / 25);
      }
      const data = await getStationsPathFromMapBox(directions, repeat);
      console.log("data from mapBox");
      console.log(data);
      console.log("res from our backend");
      console.log(res.description);
      if (data.status === true) {
        res?.description?.map((item) => {
          const mark = new mapboxGl.Marker({
            draggable: false,
          })
            .setLngLat([item.longitude, item.latitude])
            .setPopup(
              new mapboxGl.Popup({ offset: 25, closeOnClick: false }).setHTML(
                ` 
             
                <span style=" font-size:7px;over-flow:hidden;font-weight:bold;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:1;">${item.title_Station.substring(
                  0,
                  22
                )}...</span>
            
                    <span style="text-align:center; font-size:8px;font-weight:bold;">Direction:</span>
                    <span  style="text-align:center; font-size:8px;font-weight:bold;">${
                      item.direction === 0 ? "Go" : "Back"
                    }</span>
                 
                    <span style="text-align:center; font-size:8px;font-weight:bold;">Order:</span>
                    <span   style="text-align:center; font-size:8px;font-weight:bold;">${
                      item.order
                    }</span>
                
                  `
              )
            )
            .addTo(map.current);

          mapMarkers.push({ type: "path", mark: mark });
        });

        // data?.waypoints?.map((wayArr) => {
        //   wayArr?.map((way, i) => {
        //     const mark = new mapboxGl.Marker({
        //       draggable: false,
        //     })
        //       .setLngLat(way.location)
        //       .setPopup(
        //         new mapboxGl.Popup({ offset: 25, closeOnClick: false }).setHTML(
        //           `
        //           <h4 style="text-align:center; min-width:200px;">${
        //             res?.description[i].title_Station
        //           }</h4>
        //           <div>
        //             <span style="font-weight:bold;">Direction:</span>
        //             <span>${
        //               res?.description[i].direction === 0 ? "Go" : "Back"
        //             }</span>
        //           </div>
        //           <div>
        //             <span style="font-weight:bold;">Order:</span>
        //             <span>${res?.description[i].order}</span>
        //           </div>

        //           `
        //         )
        //       )
        //       .addTo(map.current);

        //     mapMarkers.push({ type: "path", mark: mark });
        //   });
        // });
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
    }
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
      if (!id) {
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
      } else {
        await getStationsByRouteID();
      }
    });

    // var draw = new mapboxGlDraw({
    //   displayControlsDefault: false,
    //   controls: {
    //     line_string: true,
    //     trash: true,
    //   },
    //   styles: [
    //     // ACTIVE (being drawn)
    //     // line stroke
    //     {
    //       id: "gl-draw-line",
    //       type: "line",
    //       filter: [
    //         "all",
    //         ["==", "$type", "LineString"],
    //         ["!=", "mode", "static"],
    //       ],
    //       layout: {
    //         "line-cap": "round",
    //         "line-join": "round",
    //       },
    //       paint: {
    //         "line-color": "#3b9ddd",
    //         "line-dasharray": [0.2, 2],
    //         "line-width": 4,
    //         "line-opacity": 0.7,
    //       },
    //     },
    //     // vertex point halos
    //     {
    //       id: "gl-draw-polygon-and-line-vertex-halo-active",
    //       type: "circle",
    //       filter: [
    //         "all",
    //         ["==", "meta", "vertex"],
    //         ["==", "$type", "Point"],
    //         ["!=", "mode", "static"],
    //       ],
    //       paint: {
    //         "circle-radius": 10,
    //         "circle-color": "#FFF",
    //       },
    //     },
    //     // vertex points
    //     {
    //       id: "gl-draw-polygon-and-line-vertex-active",
    //       type: "circle",
    //       filter: [
    //         "all",
    //         ["==", "meta", "vertex"],
    //         ["==", "$type", "Point"],
    //         ["!=", "mode", "static"],
    //       ],
    //       paint: {
    //         "circle-radius": 6,
    //         "circle-color": "#3b9ddd",
    //       },
    //     },
    //   ],
    // });
    // // add the draw tool to the map
    // map.current.addControl(draw);

    // map.current.scrollZoom.enable();
  }, [startPoint, endPoint, id]);

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
        "https://route.click68.com/api/FindRoute",
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
        if (res?.description?.res?.length === 0) {
          message.warn("Stations not found in selected locations.");
          return { status: false, directions: [] };
        }
        await drawWalkToStartPoint(res);
        await drawWalkToEndPoint(res);
        let directions = [];
        let stations = [];
        res.description.res.map((item) => {
          directions.push([item.longitude, item.latitude]);
          stations.push(item);
        });
        return {
          status: true,
          directions,
          stations,
        };
      } else {
        message.error("No Route Founded");
        return { status: false, directions: [] };
      }
    } catch (err) {
      setLoading({
        type: "",
        value: false,
      });

      return { status: false, directions: [] };
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

  const startButtonHandler = async () => {
    const { status, directions, stations } = await getStations();
    if (status === true) {
      let repeat = 1;
      // check 25 ..
      if (directions.length > 25) {
        repeat = Math.ceil(directions.length / 25);
      }
      const data = await getStationsPathFromMapBox(directions, repeat);
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
  useEffect(() => {
    // getLocationDetails();
  }, [startPoint]);

  // handle change on start point input
  const startPointHandleChange = (e) => {
    setStartInput(e.target.value);
  };
  // handle change on end point input
  const endPointHandleChange = (e) => {
    setEndInput(e.target.value);
  };

  useEffect(() => {
    if (
      startInput.split(",").length === 2 &&
      parseFloat(startInput.split(",")[0]) &&
      parseFloat(startInput.split(",")[1])
    ) {
      setStartPoint({
        lat: parseFloat(startInput.split(",")[0]),
        lng: parseFloat(startInput.split(",")[1]),
      });
      const marker = new mapboxGl.Marker({
        draggable: true,
      })
        .setLngLat([
          parseFloat(startInput.split(",")[1]),
          parseFloat(startInput.split(",")[0]),
        ])
        .addTo(map.current);
      startMarker = marker;
      message.success("Start point taked. Please choose end point");
      marker.on("dragend", function (e) {
        const lngLat = marker.getLngLat();
        setStartPoint({
          lng: lngLat.lng,
          lat: lngLat.lat,
        });

        removeDrawRoute();
      });
    }
  }, [startInput]);
  useEffect(() => {
    if (
      endInput.split(",").length === 2 &&
      parseFloat(endInput.split(",")[0]) &&
      parseFloat(endInput.split(",")[1])
    ) {
      setEndPoint({
        lat: parseFloat(endInput.split(",")[0]),
        lng: parseFloat(endInput.split(",")[1]),
      });
      const marker = new mapboxGl.Marker({
        draggable: true,
      })
        .setLngLat([
          parseFloat(endInput.split(",")[1]),
          parseFloat(endInput.split(",")[0]),
        ])
        .addTo(map.current);
      endMarker = marker;
      message.success("Start point taked. Please choose end point");
      marker.on("dragend", function (e) {
        const lngLat = marker.getLngLat();
        setEndPoint({
          lng: lngLat.lng,
          lat: lngLat.lat,
        });

        removeDrawRoute();
      });
    }
  }, [endInput]);

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
        <div
          style={{
            position: "absolute",
            left: 10,
            top: 10,
            zIndex: 100,
            width: 200,
            height: 220,
            backgroundColor: "#fff",
            padding: 10,
            marginBottom: 10,
          }}
        >
          <Row gutter={12}>
            {id ? (
              <>
                <Col span={24}>
                  <h3>Route Name :{name}</h3>
                </Col>
                <Col span={24}>
                  <h3>From to :{from_To}</h3>
                </Col>
              </>
            ) : (
              <></>
            )}

            <br />
            <Col span={24}>
              <h4 style={{ fontWeight: "bold" }}>Start Point</h4>
              <Input
                onChange={startPointHandleChange}
                value={
                  startPoint.lng && startPoint.lat
                    ? `${startPoint.lng}, ${startPoint.lat} `
                    : startInput
                }
              />
            </Col>
            <Col span={24}>
              <h4 style={{ fontWeight: "bold" }}>End Point</h4>

              <Input
                onChange={endPointHandleChange}
                value={
                  endPoint.lng && endPoint.lat
                    ? `${endPoint.lng}, ${endPoint.lat} `
                    : endInput
                }
              />
            </Col>
          </Row>
        </div>

        <Button
          icon={<MdDirections />}
          type="primary"
          style={{ position: "absolute", left: 10, bottom: 10, zIndex: 100000 }}
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

export default connect(mapStateToProps, {})(Map);
