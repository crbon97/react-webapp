import React, {Component} from 'react'
import '../styles/Header.css'
import {
    Drawer, Menu, Icon, Avatar, Dropdown, Spin, Modal, Button,
    Form, Input, Statistic, Upload, message
} from 'antd'
import {Link} from 'react-router-dom'
import logo from '../assets/login-logo.svg'
// import menuData, {rootSubmenuKeys} from '../data/menu'
import {removeAuthority} from '../utils/authority'
import axios from 'axios'
import {USER_TOKEN} from '../utils/constants'
import {getAuthorityWithKey} from '../utils/authority'
// import { isNull } from 'util';
import {resizePNGImageFn, resizeJPGImageFn} from '../utils/commons'

const { SubMenu } = Menu
const Countdown = Statistic.Countdown
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />

/*function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}*/

class Header extends Component {
    state = {
        visible: false,
        openKeys: [], 
        hoTen: null,
        changePassVisible: false,
        changeAvatarVisible: false,
        avatar: null,
        loading: false,
        file: null
    }

    beforeUpload=(file)=> {
        if(file.type === "image/jpeg"){
            resizeJPGImageFn(file).then(result => {
                this.setState({
                  imageUrl: result.imgPreviewUrl,
                  loading: false,  
                  file: result.newFile
                });
            }, err => {
                message.error('File tải lên bị lỗi!');
            });
        }else if(file.type === "image/png"){
            resizePNGImageFn(file).then(result => {
                this.setState({
                  imageUrl: result.imgPreviewUrl,
                  loading: false,  
                  file: result.newFile
                });
            }, err => {
                message.error('File tải lên bị lỗi!');
            });
        }
        /*getBase64(file, imageUrl =>
            this.setState({
              imageUrl,
              loading: false,  
              file
            }),
          );    */   
        return false
    }

    handleChange = info => {
        if (info.file.status === 'uploading') {
          this.setState({ loading: true });
          return;
        }
        if (info.file.status === 'done') {
          // Get this url from response in real world.
          /*getBase64(info.file.originFileObj, imageUrl =>
            this.setState({
              imageUrl,
              loading: false,
            }),
          );*/
        }
    };

    loadTenUser(){
        axios.get(`/api/nhanvien/getCurrentUserInfo`,{
            headers: {
                Authorization: `Bearer ${getAuthorityWithKey(USER_TOKEN)}`
            }
        }).then(res => {
            this.setState({
                hoTen : res.data.results[0].HoTen,
                avatar: res.data.results[0].Hinh,
            })
        }).catch(err => {
            console.log(err)
        })
    }
    
    componentDidMount(){
        this.loadTenUser()
    }

    render() {
        const menu = (
            <Menu onClick={this.onMenuUserInfoClick}>
                <Menu.Item key="changePassword">
                    <Icon type="interaction" />
                    <span>Đổi mật khẩu</span>
                </Menu.Item>
                <Menu.Item key="avatar">
                    <Icon type="camera" />
                    <span>Ảnh đại diện</span>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="logout">
                    <Icon type="logout" />
                    <span>Đăng xuất</span>
                </Menu.Item>               
            </Menu>
        )
        const { getFieldDecorator } = this.props.form

        const uploadButton = (
            <div>
              <Icon type={this.state.loading ? 'loading' : 'plus'} />
              <div className="ant-upload-text">Upload</div>
            </div>
        );
        const imageUrl = this.state.imageUrl;
        const avatarSrc = this.state.avatar ? {src:`/api/image/getAvatar/${this.state.avatar}`} : {icon:'user'}
 
        return (           
            <div className='header'>
                <Drawer
                    visible={this.state.visible}
                    closable={false} placement="left"
                    className='header-drawer'
                    onClose={this.onClose}
                >
                    <div className='header-menu-logo'>
                        <img src={logo} alt="logo" />
                        <h1>Menu</h1>
                    </div>
                    <Spin spinning={this.props.loading} indicator={antIcon} tip="Loading...">
                        <Menu mode="inline" className='header-menu' theme="dark"
                            onClick={this.onItemClick}
                            openKeys={this.state.openKeys}
                            onOpenChange={this.onOpenChange}
                        >
                            {this.createMenu(this.props.menuData.menuDetail)}
                        </Menu>
                    </Spin>
                </Drawer>
                <span className='icon-collapsed' onClick={this.toggleCollapsed}>
                    <Icon type='menu-unfold'/>
                </span>
                <span className="header-title">QUẢN LÝ CỬA HÀNG TIẾP THỊ</span>
                <div className='header-right'>
                    <Dropdown overlay={menu}>
                        <div className='user-info'>
                            <Avatar size={40} className='avatar' {...avatarSrc}/>
                            <span>{this.state.hoTen}</span>
                        </div>
                    </Dropdown>                  
                </div>
                <Modal title='Đổi mật khẩu' visible={this.state.changePassVisible}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>Hủy</Button>,
                        <Button key="submit" type="primary" onClick={this.handleOk}>Lưu</Button>
                    ]}
                >
                    <Form>
                        <Form.Item label="Mật khẩu mới"
                            labelCol={{xs:{ span: 24 },sm:{ span: 7 }}}
                            wrapperCol={{xs:{ span: 24 },sm:{ span: 15 }}}
                        >
                            {getFieldDecorator('newPassword', {
                                rules: [{required: true, message: 'Hãy nhập mật khẩu mới!'}]
                            })(
                                <Input.Password autoComplete="off" maxLength={100}/>
                            )}
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal title='Đối ảnh đại diện' visible={this.state.changeAvatarVisible}
                    onCancel={this.handleAvatarCancel}
                    footer={[
                        <Button key="back" onClick={this.handleAvatarCancel}>Hủy</Button>,
                        <Button key="submit" type="primary" onClick={this.handleAvatarOk}>Lưu</Button>
                    ]}
                    className="modal-avatar"
                >
                    <Upload
                        name="avatar"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        beforeUpload={this.beforeUpload}
                        // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                        // onChange={this.handleChange}
                    >
                        {/* {this.state.avatar ? <img src={`/api/image/getAvatar/${this.state.avatar}`} alt="avatar" /> : uploadButton} */}
                        {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
                    </Upload>
                </Modal>
            </div>
        )
    }

    createMenu = menuData => {
        return menuData.map(item => this.getSubMenuOrItem(item))
    }

    getSubMenuOrItem = item => {
        if (item.child) {
            return (
                <SubMenu key={item.key} title={
                    <span>
                        <Icon type={item.icon} />
                        <span>{item.title}</span>
                    </span>
                }>
                    {item.child.map(itemChild => this.getSubMenuOrItem(itemChild))}
                </SubMenu>
            )
        }
        return (
            <Menu.Item key={item.key}>
                {item.icon && <Icon type={item.icon} />}
                <span><Link to={item.linkto}>{item.title}</Link></span>
            </Menu.Item>
        )
    }

    onClose = () => {
        this.setState({
            visible: false,
        })
    }

    toggleCollapsed = () => {
        this.setState({
            visible: !this.state.visible,
        })
    }

    onItemClick = () => {
        this.setState({
            visible: !this.state.visible,
        })
    }

    onOpenChange = (openKeys) => {
        const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
        if (this.props.menuData.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            this.setState({ openKeys });
        }
        else {
            this.setState({
                openKeys: latestOpenKey ? [latestOpenKey] : [],
            });
        }
    }

    onMenuUserInfoClick = ({key}) => {
        switch(key) {
            case 'logout':
                removeAuthority()
                window.location.replace("/")
                break
            case 'changePassword':
                this.setState({changePassVisible:true})
                break
            case 'avatar':
                this.setState({changeAvatarVisible:true})
                break
            default:
                break
        }
    }

    handleOk = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if(!err){
                this.props.setSpinning(true)
                let data = {
                    password: values.newPassword
                }
                axios.put('/api/nguoidung/doimatkhau', data,{
                    headers: {
                        Authorization: `Bearer ${getAuthorityWithKey(USER_TOKEN)}`,
                        'Content-Type': 'application/json'
                    }
                }).then(() => {
                    removeAuthority()
                    this.props.setSpinning(false)
                    Modal.success({
                        title: 'Đổi mật khẩu thành công!',
                        keyboard: false,
                        okText: 'Đăng xuất',
                        content: (
                            <div className='auto-logout'>
                                <span>Còn </span>
                                <Countdown value={Date.now() + 6000} onFinish={this.onFinish} format="s giây"/>
                                <span> sẽ tự động đăng xuất.</span>
                            </div>
                        ),
                        onOk: () => window.location.replace("/")
                    })
                }).catch(err => {
                    this.props.setSpinning(false)
                    message.error(err.request.responseText)
                })
            }
            this.setState({
                changePassVisible: false,
                changeAvatarVisible: false
            })
        })
    }

    handleCancel = () => {
        this.setState({
            changePassVisible: false,
            changeAvatarVisible: false
        })
        this.props.form.resetFields()
    }
    handleAvatarCancel = () => {
        this.setState({
            changePassVisible: false,
            changeAvatarVisible: false,
            imageUrl: null,
            file: null
        })
        this.props.form.resetFields()
    }
    handleAvatarOk = (e) => {
        this.props.setSpinning(true)
        if(this.state.file){
            let data = new FormData()
                data.append('Hinh',this.state.file)
                data.append('AvatarOld', this.state.avatar)
                
                axios.put('/api/nhanvien/capnhatAvatar', data,{
                    headers: {
                        Authorization: `Bearer ${getAuthorityWithKey(USER_TOKEN)}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }).then((res) => {
                    this.props.setSpinning(false)                    
                    message.success('Đối Avatar thành công!');                                      
                    this.setState({
                        avatar: res.data.avatar
                    })
                }).catch(err => {
                    this.props.setSpinning(false)
                    message.error(err.request.responseText)
                })
        }else{
            if(this.state.avatar){
                var data = {
                    AvatarOld: this.state.avatar
                }
                axios.put(`/api/nhanvien/capnhatAvatarNull`, data,{
                headers: {
                    Authorization: `Bearer ${getAuthorityWithKey(USER_TOKEN)}`
                }
                }).then(res => {
                    this.props.setSpinning(false) 
                    this.setState({
                        avatar: null
                    })
                    message.success('Xóa Avatar thành công!');
                }).catch(err => {
                    this.props.setSpinning(false) 
                    console.log("Xóa Avatar thất bại!")
                })
            }
            this.props.setSpinning(false)
        }
                
        this.setState({
            changePassVisible: false,
            changeAvatarVisible: false
        })

    }

    onFinish = () => {
        window.location.replace("/")
    }
}

const WrappedHeader = Form.create({ name: 'header_page' })(Header)
export default WrappedHeader