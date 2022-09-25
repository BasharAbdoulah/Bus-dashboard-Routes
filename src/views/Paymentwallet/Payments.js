import React, { useEffect, useState } from "react";
//component
import { Row, Col, Input, Checkbox, Table, Form, Select, Alert } from "antd";

import useFetch from "hooks/useFetch";
const { Option } = Select;

const Paymentwallet = () => {
    const onSearch = (value) => console.log(value);
    const [currentPage, setCurrentPage] = useState(1);
    const [tableData, setTableData] = useState([]);

    const [form] = Form.useForm();
    const {
        data = [],
        error,
        loading,
        executeFetch,
    } = useFetch(
        "https://route.click68.com/api/ListPaymentWallet",
        "post",
        {},
        true
    );
    useEffect(() => {
        if (data?.status === true && !loading) {
            // {
            //   page: ,
            //   data: [],
            // }
            let found = false;
            for (let i = 0; i < tableData.length; i++) {
                if (tableData[i].page === currentPage) {
                    found = true;
                    break;
                }
            }

            if (found === false) {
                setTableData((prev) => {
                    let newData = prev;
                    newData.push({
                        page: currentPage,
                        data: data?.description,
                    });
                    return [...newData];
                });
            }
        }
    }, [data, error, loading]);

    const {
        data: dataByRoute = {},
        error: errorByroute,
        loading: loadingByroute,
        executeFetch: executeFetchByroute,
    } = useFetch(
        "https://route.click68.com/api/ListPaymentWalletByRouyeID",
        "post",
        {},
        true
    );

    const {
        data: dataByUser = {},
        error: errorByUser,
        loading: loadingByUser,
        executeFetch: executeFetchByuserId,
    } = useFetch(
        "https://route.click68.com/api/ListPaymentWalletByUserID",
        "post",
        {},
        true
    );
    console.log("data");
    console.log(data);
    const {
        data: routedata,
        error: routeError,
        loading: routeloading,
        executeFetch: routeexecuteFetch,
    } = useFetch(
        process.env.REACT_APP_API_HOST + process.env.REACT_APP_LIST_ROUTE,
        "post",
        {},
        false
    );
    const {
        data: userData = {},
        error: userError,
        loading: userLoading,
        executeFetch: executeFetchByuser,
    } = useFetch("https://route.click68.com/api/ListUser", "post", {}, true);

    const columns = [
        {
            title: "User Name",
            dataIndex: "name",
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
            title: "date",
            dataIndex: "date",
            key: "date",
            render: (data) => {
                if (data.length > 20)
                    return (
                        <React.Fragment key={data}>
                            {data.substring(0, 10)} {data.substring(11, 16)}{" "}
                        </React.Fragment>
                    );
            },
        },
    ];
    console.log("formmmm");
    console.log(form.getFieldsValue("RouteID"));
    console.log(form.getFieldsValue("UserID"));
    useEffect(() => {
        let isFound = tableData.find((d) => d.page === currentPage);
        if (!isFound) executeFetch({ PageNumber: currentPage });
    }, [currentPage]);

    let tab_data = tableData.find((i) => i.page === currentPage);

    return (
        <div>
            <h2>Payments</h2>
            <Form form={form} layout="vertical">
                <Row gutter={24}>
                    <Col span={8}>
                        <Form.Item name="RouteID" label="select route">
                            <Select
                                showSearch
                                placeholder="Select a route"
                                optionFilterProp="children"
                                allowClear
                                // onChange={onChange}
                                onFocus={() => {
                                    if (routedata?.description?.length > 0)
                                        return false;
                                    routeexecuteFetch({
                                        PageNumber: 1,
                                        PageSize: 60,
                                    });
                                }}
                                onSearch={onSearch}
                                filterOption={(input, option) =>
                                    option.children
                                        .toLowerCase()
                                        .indexOf(input.toLocaleLowerCase()) > 0
                                }
                                onChange={(value) => {
                                    executeFetchByroute({ id: value });
                                }}
                            >
                                {routedata?.description.map((item) => {
                                    // if (item.id === getData?.description?.routeId )
                                    return (
                                        <Option value={item.id}>
                                            {item.name}
                                        </Option>
                                    );
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="UserID" label="select User">
                            <Select
                                showSearch
                                placeholder="Select a user"
                                optionFilterProp="children"
                                allowClear
                                // onChange={onChange}
                                onFocus={() => {
                                    if (userData?.description?.length > 0)
                                        return false;
                                    executeFetchByuser();
                                }}
                                onSearch={onSearch}
                                filterOption={(input, option) =>
                                    option.children
                                        .toLowerCase()
                                        .indexOf(input.toLocaleLowerCase()) > 0
                                }
                                onChange={(value) => {
                                    executeFetchByuserId({ id: value });
                                }}
                            >
                                {userData?.description.map((item) => {
                                    // if (item.id === getData?.description?.routeId )
                                    return (
                                        <Option value={item.id}>
                                            {item.userName}
                                        </Option>
                                    );
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Table
                    columns={columns}
                    rowKey={"id"}
                    pagination={{
                        onChange: (page) => {
                            setCurrentPage(page);
                        },
                        total: data?.total,
                        current: currentPage,
                    }}
                    dataSource={
                        form.getFieldValue("RouteID")
                            ? dataByRoute?.description
                            : form.getFieldValue("UserID")
                            ? dataByUser?.description
                            : tab_data?.data
                    }
                    loading={loading || loadingByroute || userLoading}
                    size="small"
                />
            </Form>
        </div>
    );
};

export default Paymentwallet;
