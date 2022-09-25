import React from "react";
//components
import { Form, Input, Space, Button, Table, Modal, message } from "antd";
import {
    DeleteOutlined,
    EditOutlined,
    WarningOutlined,
} from "@ant-design/icons";
//redux
import { connect } from "react-redux";
//redux action
import { openModal } from "redux/modal/action";
import * as constants from "redux/modal/constants";

//hooks
import useFetch from "hooks/useFetch";
import { useEffect } from "react";

const Role = ({ openModal }) => {
    //get list of roles
    const {
        data = [],
        error,
        loading,
        executeFetch,
    } = useFetch("https://route.click68.com/api/ListRole", "get");

    const {
        data: deleteData = {},
        error: deleteError,
        loading: deleteLoading,
        executeFetch: deleteExecuteFetch,
    } = useFetch(
        process.env.REACT_APP_API_HOST + process.env.REACT_APP_DELETE_ROLE,
        "post",
        {},
        false
    );

    //useEffect for delete item
    useEffect(() => {
        if (deleteData?.status === true) {
            //refresh the table ....
            message.success("Role has been deleted succeeefully !");
            executeFetch();
        } else if (deleteData?.status === false || deleteError) {
            Modal.info({
                title: "Something went wrong !",
                content: (
                    <p>
                        Some error happend while trying to delete this role.
                        Please try again later.
                    </p>
                ),
                icon: <WarningOutlined style={{ color: "red" }} />,
            });
        }
    }, [deleteData, deleteError, deleteLoading]);

    //handle Delete item
    const handleDeleteItem = (id, name) => {
        Modal.confirm({
            title: "Are you sure about delete this role",
            content: <div>this role will be deleted forever.....!</div>,
            onOk() {
                deleteExecuteFetch({ id, Role: name });
            },
        });
    };

    //handle edit item
    const handleEditItem = (id) => {
        openModal(constants.modalType_AddRole, executeFetch, { id }, true);
    };

    //table colums
    const columns = [
        {
            title: "Roles",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Normalized name",
            dataIndex: "normalizedName",
            key: "normalizedName",
        },

        {
            title: "Actions",
            dataIndex: "",
            key: "",
            render: (data) => {
                return (
                    <Space size="large" key={data}>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                handleDeleteItem(data.id, data.name);
                            }}
                        >
                            <DeleteOutlined />
                        </a>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                handleEditItem(data.id);
                            }}
                        >
                            <EditOutlined />
                        </a>
                    </Space>
                );
            },
        },
    ];
    return (
        <div>
            <Button
                onClick={() => {
                    openModal(constants.modalType_AddRole, executeFetch);
                }}
            >
                Add Role
            </Button>
            <Table
                columns={columns}
                dataSource={data?.description}
                loading={loading}
                size="small"
            />
        </div>
    );
};
const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { openModal })(Role);
