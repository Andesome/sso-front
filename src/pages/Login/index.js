import React, { Component } from 'react';
import { Form, Icon, Input, Button, Checkbox, message } from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';
import { DEFAULT_REDIRECT_PAGE } from '@/constant/config';
import qs from 'qs';

import './index.less';

const FormItem = Form.Item;

@connect(({ user }) => ({
  user,
}))
@Form.create()
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: qs.parse(props.location.search, { ignoreQueryPrefix: true }),
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    const { query } = this.state;
    const { setFieldsValue } = this.props.form;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.props.dispatch({
          type: 'user/login',
          payload: values,
          success: rsp => {
            message.success('登录成功');
            if (query.redirect) {
              const token = rsp.headers.authorization;
              const newQuery = {
                ...query,
                token
              }
              delete newQuery.redirect;

              window.location.href = `${query.redirect}?${qs.stringify(newQuery)}`;
            } else {
              window.location.href = DEFAULT_REDIRECT_PAGE;
            }
          },
          error: () => {
            setFieldsValue({
              pwd: '',
            });
          },
        });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <section className="login-wrap">
        <Form onSubmit={this.handleSubmit} className="login-form">
          <FormItem>
            {getFieldDecorator('account', {
              rules: [{ required: true, message: 'Please input your username!' }],
            })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Username"
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('pwd', {
              rules: [{ required: true, message: 'Please input your Password!' }],
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="Password"
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(<Checkbox>Remember me</Checkbox>)}
            <a className="login-form-forgot" href="">
              Forgot password
            </a>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
            Or <Link to="/register">现在注册!</Link>
          </FormItem>
        </Form>
      </section>
    );
  }
}

export default Login;
