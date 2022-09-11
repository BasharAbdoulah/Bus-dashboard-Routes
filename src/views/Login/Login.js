import React, { useEffect } from "react";

import { Form, Input, Button, Checkbox, Alert } from "antd";
// services
import { useHistory } from "react-router-dom";
// hooks
import useFetch from "hooks/useFetch";
// redux
import { connect } from "react-redux";
// redux action
import { startLogin } from "../../redux/auth/action";
import * as constants from "../../redux/auth/constatns";
// style
import style from "./style.module.css";

const Login = ({ id, startLogin }) => {
  const [form] = Form.useForm();

  const history = useHistory();

  const { data, error, loading, executeFetch } = useFetch(
    process.env.REACT_APP_API_HOST + process.env.REACT_APP_LOGIN_POST,
    "post",
    {},
    false
  );

  useEffect(() => {
    console.log("id");
    console.log(id);
    if (id && id !== null) history.push("/");
  });

  useEffect(() => {
    if (data?.status === true && !error) {
      // Login In
      startLogin({
        token: data.description.token,
        Password: data.description.Password,
        UserName: data.description.UserName,
        id: data.description.id,
        role: data.description.role,
      });
    }
  }, [data, error, loading]);

  const onFinish = async (values) => {
    await form.validateFields(); // validate Fileds

    delete values.remember; // remove
    executeFetch(values); // start fetch
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
          {error !== null && (
            <Alert description={error} showIcon type="error" />
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
