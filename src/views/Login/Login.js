import React, { useEffect, useState } from "react";

import { Form, Input, Button, Checkbox, Alert } from "antd";
// services
import { useHistory } from "react-router-dom";

// redux
import { connect } from "react-redux";
// redux action
import { startLogin } from "../../redux/auth/action";
import * as constants from "../../redux/auth/constatns";
// style
import style from "./style.module.css";
import axios from "axios";

const Login = ({ id, startLogin }) => {
  const [form] = Form.useForm();
  const [error, setError] = useState({ state: false, desc: "" });
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (id && id !== null) history.push("/");
  });

  const onFinish = async (values) => {
    console.log(values);
    setLoading(true);
    await axios
      .post(process.env.REACT_APP_API_HOST + process.env.REACT_APP_LOGIN_POST, {
        UserName: values.UserName,
        Password: values.Password,
      })
      .then((res) => {
        console.log(res);
        if (res.data.status) {
          // Login In
          setLoading(true);
          startLogin({
            token: res.data.description.token,
            Password: res.data.description.Password,
            UserName: res.data.description.UserName,
            id: res.data.description.id,
            role: res.data.description.role,
          });
        } else {
          setLoading(false);
          setError({
            state: true,
            desc: res.data.description.message
              ? res.data.description.message
              : res.data.description,
          });
        }
      })
      .catch((err) => console.error(err));
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className={style.loginpage}>
      <div>
        {" "}
        <Form
          form={form}
          name="basic"
          labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 24,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          {error.state && (
            <Alert description={error.desc} showIcon type="error" />
          )}
          <Form.Item
            label="Username"
            name="UserName"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="Password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  id: state.auth.id,
});

export default connect(mapStateToProps, { startLogin })(Login);
