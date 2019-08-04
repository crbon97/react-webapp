import React, {Component} from 'react'
import '../styles/LoginPage.css'
import {
    Form, Icon, Input, Button, Alert, Spin
} from 'antd'
import FormItem from 'antd/lib/form/FormItem'
import logo from '../assets/login-logo.svg'
import {setAuthority} from '../utils/authority'
import axios from 'axios'

class LoginPage extends Component {
    state = {
        isSpinning: false,
        err: false,
        msgErr: ''
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Spin spinning={this.state.isSpinning} style={{maxHeight:'100vh',height:'100vh'}}>
                <div className='login-page'>
                    <div className='login-main' >
                        <div className='login-form-header'>
                            <img alt='logo' src={logo} className='login-form-header-logo' />
                            <span className='login-form-header-title'>Đăng nhập</span>
                        </div>
                        <Form onSubmit={this.handleSubmit}>
                        {
                            this.state.err &&
                            <Alert style={{ marginBottom: 24 }} message={this.state.msgErr} type="error" showIcon />
                        }
                            <Form.Item>
                            {getFieldDecorator('maNV', {
                                rules: [{ required: true, message: 'Hãy nhập mã nhân viên!' }],
                            })(
                                <Input size="large" prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Mã nhân viên" />
                            )}
                            </Form.Item>
                            <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: 'Hãy nhập mật khẩu!' }],
                            })(
                                <Input.Password size="large" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Mật khẩu" />
                            )}
                            </Form.Item>
                            <FormItem>
                                <Button size="large" type="primary" htmlType="submit" className="login-form-button">
                                    Đăng nhập
                                </Button>
                            </FormItem>
                        </Form>
                    </div>
                </div>
            </Spin>
        )
    }

    handleSubmit = (e) => {
        e.preventDefault()
        this.setSpinning(true)
        this.props.form.validateFields((err, values) => {
            if (err) {
                this.setState({
                    err: false,
                    isSpinning: false
                })
            } else {
                axios.post('/api/nguoidung/dangnhap', {
                    maNV: values.maNV,
                    password: values.password,
                    remember: true
                }).then(res => {
                    if(res.status === 200) {
                        setAuthority(res.data.maNV, res.data.token, true, res.data.maCH)
                        window.location.reload()
                    }
                }).catch(err => {
                    this.setState({
                        err: true,
                        msgErr: err.response.data.message,
                        isSpinning: false
                    })
                })
            }
        })
    }

    setSpinning = (isSpinning) => {
        this.setState({
            isSpinning: isSpinning
        })
    }
}

const WrappedLoginPage = Form.create({name:'login_page'})(LoginPage)

export default WrappedLoginPage