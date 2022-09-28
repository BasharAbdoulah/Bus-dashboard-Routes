import "../../styles/passengers.scss"
import { Table } from "antd";
import useFetch from "hooks/useFetch";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as signalR from "@microsoft/signalr";
import axios from "axios";
const audio = new Audio("/sounds/pristine-609.mp3");

const obj = {
    test1: "test1",
    test2: "test2"
}

function OnlinePassengers() {
    const [currentPage, setCurrentPage] = useState(1);
    const [tableData, setTableData] = useState([]);
    const state = useSelector(state => state.auth)
    const [connection, setConnection] = useState(null)
    const [connectionId, setConnectionId] = useState("");
    const [dataFromLive, setFromLive] = useState([])
    const [liveCount, setLiveCount] = useState(0)
    const [SumPayment, setSumPayment] = useState({
        type: "Sum_Payment",
        value: 0,
    });

    const {
        data ,
        error,
        loading,
        executeFetch,
    } = useFetch(
        "https://route.click68.com/api/ListPaymentWallet",
        "post",
        {},
        true
    );



    // useEffect(() => {
    //     setFromLive(data?.description)
    // }, [data])

    // console.log("all", dataFromLive?.unshift(obj))
    // Live fetching data
    useEffect(() => {
        const protocol = new signalR.JsonHubProtocol();
        const transport = signalR.HttpTransportType.WebSockets;

        const options = {
            transport,
            logMessageContent: true,
            logger: signalR.LogLevel.Trace,
            accessTokenFactory: () => state.token,
        };

        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(
                process.env.REACT_APP_API_HOST + "chathub",
                options /*{ jwtBearer: token }*/
            )
            .withHubProtocol(protocol)
            .build();
        setConnection(newConnection);
        return () => {};
    }, []);

    if (connection) {
        if (!connection.connectionStarted) {
            console.log("connectionStarted")
            connection
                .start()
                .then((result) => {
                    connection.on("RecieveConnectionId", (id) => {
                        setConnectionId(id);
                    });

                    connection.on("PaymentValueCount", (string) => {
                        audio?.play();
                        console.log("string");
                        console.log(string);
                        setSumPayment({
                            ...SumPayment,
                            value: parseFloat(string).toFixed(3),
                        });
                    });


                    connection.on("PaymentLive", (string) => {
                        audio?.play();

                    
                        dataFromLive.unshift(string)
                        console.log("PaymentLive ",  dataFromLive);
                        // insetData(string)
                    });
                })
                .catch((err) => console.error("Failed To Connect", err));
        }
    }


    useEffect(() => {
        setFromLive(data?.description)
    }, [data])


console.log("data from livee 2",  dataFromLive, liveCount);


    useEffect(() => {
        // let isFound = tableData.find((d) => d.page === currentPage);
        if (true) executeFetch({ PageNumber: currentPage });
    }, [currentPage]);

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "userName",
            dataIndex: "userName",
            key: "name",
        },
        {
            title: "Route",
            dataIndex: "routeName",
            key: "routeName",
        },
        {
            title: "value",
            dataIndex: "value",
            key: "value",
        },
        {
            title: "time",
            dataIndex: "time",
            key: "time",
        },
        {
            title: "date",
            dataIndex: "date",
            key: "date",
            render: (data) => {
                if (data)
                    return (
                        <React.Fragment key={data}>
                            {data.substring(0, 10)} {data.substring(11, 16)}{" "}
                        </React.Fragment>
                    );
            },
        },
    ];

    return (
        <div>
            <h2 className="passengers-title on">Online Passengers</h2>
            <h4>Number of passengers: <strong>{data?.total}</strong></h4>
            {/* <Table
                columns={columns}
                rowKey={"id"}
                pagination={{
                    onChange: (page) => {
                        setCurrentPage(page);
                    },
                    total: data?.total,
                    current: currentPage,
                }}

                dataSource={allData}
                loading={loading}
                size="small"
            /> */}

            {/* {dataFromLive.map(item => {

                return (
                    <>
                                        <p>{item.name}</p>
                    <p>{item.time}</p>
                    </>
                )
            })} */}

            {/* <div className="table">
                <div className="table-thead">
                    <h3>name</h3>
                    <h3>user name</h3>
                    <h3>time</h3>
                </div>
                <div className="table-tbody">
                    {dataFromLive.map((item) => {
                        return (
                        <div className="table-colomn">
                            <p className="row-item">{item.name}</p>
                            <p className="row-item">{item.userName}</p>
                            <p className="row-item">{item.time}</p>
                        </div>
                        )
                    })}

                </div>
            </div> */}
        </div>
    );
}

export default OnlinePassengers;
