import React, { Component } from 'react';
import Link from 'umi/link';
import { Form, Input, Tooltip, Icon, Select, Button, AutoComplete, message } from 'antd';
import { connect } from 'dva';
import './index.less';

const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;

@connect(({ user }) => ({
  user,
}))
@Form.create()
class Register extends Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.props.dispatch({
          type: 'user/register',
          payload: values,
          success: () => {
            message.success('登录成功');
            this.props.history.push('/login');
          },
        });
      }
    });
  };

  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('pwd')) {
      callback('两次密码不一致!');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  handleWebsiteChange = value => {
    let autoCompleteResult;
    if (!value) {
      autoCompleteResult = [];
    } else {
      autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
    }
    this.setState({ autoCompleteResult });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { autoCompleteResult } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '86',
    })(
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    );

    const websiteOptions = autoCompleteResult.map(website => (
      <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
    ));
    return (
      <div className="register-wrap">
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label={
              <span>
                大名&nbsp;
                <Tooltip title="你想让大家如何称呼你?">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            {getFieldDecorator('name', {
              rules: [
                { required: true, message: '请大侠留下名字!' },
                { whitespace: true, message: '名称不能是空字符串' },
                { pattern: /廖*/, message: '名称不能有空字符串' },
                { min: 2, message: '名字最少2个字符' },
                { max: 8, message: '名字不能超过8个字符' },
              ],
            })(<Input placeholder="可用于登录账号" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="E-mail">
            {getFieldDecorator('email', {
              rules: [
                {
                  type: 'email',
                  message: '邮箱无效，请重新输入!',
                },
                {
                  required: true,
                  message: '请输入邮箱!',
                },
              ],
            })(<Input placeholder="可用于登录账号" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="密码">
            {getFieldDecorator('pwd', {
              rules: [
                {
                  required: true,
                  message: '请输入密码!',
                },
                {
                  validator: this.validateToNextPassword,
                },
              ],
            })(<Input type="password" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="确认密码">
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: '请确认密码一致',
                },
                {
                  validator: this.compareToFirstPassword,
                },
              ],
            })(<Input type="password" onBlur={this.handleConfirmBlur} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="手机号">
            {getFieldDecorator('phone', {
              rules: [{ required: false, message: '请输入手机号!' }],
            })(<Input addonBefore={prefixSelector} style={{ width: '100%' }} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="Website">
            {getFieldDecorator('website', {
              rules: [{ required: false, message: 'Please input website!' }],
            })(
              <AutoComplete
                dataSource={websiteOptions}
                onChange={this.handleWebsiteChange}
                placeholder="个人网站网址"
              >
                <Input />
              </AutoComplete>
            )}
          </FormItem>
          {/* <FormItem
            {...formItemLayout}
            label="Captcha"
            extra="We must make sure that your are a human."
          >
            <Row gutter={8}>
              <Col span={12}>
                {getFieldDecorator('captcha', {
                  rules: [{ required: true, message: 'Please input the captcha you got!' }],
                })(<Input />)}
              </Col>
              <Col span={12}>
                <Button>Get captcha</Button>
              </Col>
            </Row>
          </FormItem> */}
          {/* <FormItem {...tailFormItemLayout}>
            {getFieldDecorator('agreement', {
              valuePropName: 'checked',
            })(
              <Checkbox>
                I have read the <a href="">agreement</a>
              </Checkbox>
            )}
          </FormItem> */}
          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              注册
            </Button>
          </FormItem>
          已有账号，立即 <Link to="/login">登录</Link>
        </Form>
      </div>
    );
  }
}

export default Register;
