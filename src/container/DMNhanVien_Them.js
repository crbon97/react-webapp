import React from 'react'
import '../styles/DMNhanVien_Them.css'
import {
    Card, PageHeader, Typography, Form, Input, Row, Col, 
     Select,  Button, Switch , message, DatePicker, InputNumber
  } from 'antd';
import axios from 'axios'
import {USER_TOKEN} from '../utils/constants'
import {getAuthorityWithKey} from '../utils/authority'

const { Paragraph } = Typography
const { Option } = Select;
const { TextArea } = Input;
// const AutoCompleteOption = AutoComplete.Option;

class DMNhanVien_Them extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            requiredCH: true
        }       
        this.UI_ID = 'DM_NHANVIEN'
        this.mangTenCV= []
        this.mangTenDT= []
        this.mangTenTG= []
        this.mangTenCH= []
        this.mangTrinhDoVH=[]
        this.mangQuocTich = []
        this.mangTinhThanh = []
        this.quyenthem= null
    }  

    getPhanQuyenMH=()=>{
        this.props.event.setSpinning(true);
         axios.get(`/api/phanquyenmanhinh/layQuyen/${this.UI_ID}`,{
            headers: {
                Authorization: `Bearer ${getAuthorityWithKey(USER_TOKEN)}`
            }
        }).then(res => {           
            //this.setState({PhanQuyenMH : res.data.results[0]})
            this.quyenthem = res.data.results[0].QuyenThem 
            if(this.quyenthem){
                this.loadDataTrinhDoVH()
                this.loadDataQuocTich()
                this.loadDataTinhThanh()
                this.loadDataChucVu()
                this.loadDataCuaHang()
                this.loadDataDanToc()
                this.loadDataTonGiao()
            }else{            
              window.location.replace('/deny')
            }
            this.props.event.setSpinning(false);
        }).catch(error => {
            message.error(error.request.responseText)
            this.props.event.setSpinning(false);
        });
      }

    filterData = (data) => {
        let result = {...data}

        result.NgayNhanViec = data.NgayNhanViec ? data.NgayNhanViec.format('YYYY-MM-DD') : null
        result.NgaySinh = data.NgaySinh ? data.NgaySinh.format('YYYY-MM-DD') : null
        result.NgayCap = data.NgayCap ? data.NgayCap.format('YYYY-MM-DD') : null

        result.MaCV = data.MaCV.split('-')[0]
        result.MaCH = data.MaCH === undefined ? null : data.MaCH
        return result
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
           if(!err){
                const data = this.filterData(values)
                this.themNhanVien(data);
           }
        });
    }   
    themNhanVien(values){
        this.props.event.setSpinning(true)
        let data = {...values}
            data.GioiTinh = data.GioiTinh === "1" ? true : false
            data.Hinh = null
            // data.trangThaiLV = data.trangThaiLV === true ? 0 : 1

        axios.post(`/api/nhanvien/them/${this.UI_ID}`, data,{
          headers: {
              Authorization: `Bearer ${getAuthorityWithKey(USER_TOKEN)}`,
              'Content-Type': 'application/json'
          }
          }).then(res => {
              this.props.event.setSpinning(false)
              this.props.form.resetFields()
              message.success('Thêm thành công!');
          }).catch(err => {
              this.props.event.setSpinning(false)
              message.error(err.request.responseText);
              console.log(err);
          })
      }
    //   load select box
    loadDataChucVu(){ 
     axios.get(`/api/chucvu/getALL/${this.UI_ID}`,{
        headers: {
            Authorization: `Bearer ${getAuthorityWithKey(USER_TOKEN)}`
        }
    }).then(res => {   
        res.data.results.forEach(element => {
            this.mangTenCV.push(<Option key={`${element.MaCV}-${element.QuyenDacBiet}`}>{element.TenCV}</Option>);
        });
    }).catch(err => {
        console.log(err)
    });
    }

    loadDataTrinhDoVH(){ 
        axios.get(`/api/trinhdovh/getALL/${this.UI_ID}`,{
           headers: {
               Authorization: `Bearer ${getAuthorityWithKey(USER_TOKEN)}`
           }
       }).then(res => {   
           res.data.results.forEach(element => {
               this.mangTrinhDoVH.push(<Option key={element.MaTrinhDoVH}>{element.TrinhDoVH}</Option>);
           });
       }).catch(err => {
           console.log(err)
       });
    }

    loadDataQuocTich(){ 
        axios.get(`/api/quoctich/getALL/${this.UI_ID}`,{
           headers: {
               Authorization: `Bearer ${getAuthorityWithKey(USER_TOKEN)}`
           }
       }).then(res => {   
           res.data.results.forEach(element => {
               this.mangQuocTich.push(<Option key={element.MaQuocTich}>{element.TenQuocTich}</Option>);
           });
       }).catch(err => {
           console.log(err)
       });
    }
    
    loadDataTinhThanh(){ 
        axios.get(`/api/tinhthanh/getALL/${this.UI_ID}`,{
           headers: {
               Authorization: `Bearer ${getAuthorityWithKey(USER_TOKEN)}`
           }
       }).then(res => {   
           res.data.results.forEach(element => {
               this.mangTinhThanh.push(<Option key={element.MaTinhThanh}>{element.TenTinhThanh}</Option>);
           });
       }).catch(err => {
           console.log(err)
       });
    }

    loadDataDanToc(){ 
         axios.get(`/api/dantoc/getALL/${this.UI_ID}`,{
            headers: {
                Authorization: `Bearer ${getAuthorityWithKey(USER_TOKEN)}`
            }
        }).then(res => {   
            res.data.results.forEach(element => {
                this.mangTenDT.push(<Option key={element.MaDT}>{element.TenDT}</Option>);
            });
        }).catch(err => {
            console.log(err)
        });
    }

    loadDataTonGiao(){ 
         axios.get(`/api/tongiao/getALL/${this.UI_ID}`,{
            headers: {
                Authorization: `Bearer ${getAuthorityWithKey(USER_TOKEN)}`
            }
        }).then(res => {   
            res.data.results.forEach(element => {
                this.mangTenTG.push(<Option key={element.MaTG}>{element.TenTG}</Option>);
            });
        }).catch(err => {
            console.log(err)
        });
    }

    loadDataCuaHang(){ 
         axios.get(`/api/cuahang/getALL/${this.UI_ID}`,{
            headers: {
                Authorization: `Bearer ${getAuthorityWithKey(USER_TOKEN)}`
            }
        }).then(res => {   
            res.data.results.forEach(element => {
                this.mangTenCH.push(<Option key={element.MaCH}>{element.TenCH}</Option>);
            });
        }).catch(err => {
            console.log(err)
        });
        }

    cvChange = (value) => {
        const specialRole = value.split('-')[1]
        if(specialRole === 'true') {
            this.props.form.resetFields(['maCH'])
            this.setState({requiredCH:false})
        }
        else {
            this.setState({requiredCH:true})
        }
    }


    render() {
        if(this.quyenthem){
        const { getFieldDecorator } = this.props.form;
        // const formItemLayout = {
        //   labelCol: {
        //     xs: { span: 24 },
        //     sm: { span: 7 },
        //   },
        //   wrapperCol: {
        //     xs: { span: 24 },
        //     sm: { span: 10 },
        //   },
        // };
        // const tailFormItemLayout = {
        //     wrapperCol: {
        //       xs: {
        //         span: 24,
        //         offset: 0,  
        //       },
        //       sm: {
        //         span: 2,
        //         offset: 11,
        //       },
        //     },
        // };

        let maCHSetting = {}
        if(this.state.requiredCH) {
            maCHSetting = {
                rules: [{
                    required: true, message: 'Hãy chọn cửa hàng!'
                }],
                initialValue: null
            }
        }
        return (
          <div className="layout_themnhanvien">
                <PageHeader title="Thêm  nhân viên"
                onBack={()=> window.location.replace('/dmnhanvien')}>
                    <Paragraph>
                    </Paragraph>
                </PageHeader>
                <div className="nv-them-page-content-loading">
                    <Card bordered={false}>                  
                        <Form onSubmit={this.handleSubmit}>
                            <Row>
                                <Col sm={{span:24}} md={{span:12}} lg={{span:8}}>
                                    <Form.Item label="Mã nhân viên">
                                        {getFieldDecorator('MaNV', {
                                            rules: [ 
                                                {required: true, message: 'Hãy nhập mã nhân viên!'},
                                                {pattern: /^[a-zA-Z0-9]+$/, message: 'Ký tự không hợp lệ!'}
                                            ],
                                            initialValue: null
                                        })(
                                            <Input autoComplete="off" maxLength={20}/>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col sm={{span:24}} md={{span:12}} lg={{span:8}}>
                                    <Form.Item label="Tên nhân viên">
                                        {getFieldDecorator('HoTen', {
                                            rules:[{required: true, message: 'Hãy nhập họ tên nhân viên!'}],                           
                                            initialValue: null
                                        })(
                                            <Input autoComplete="off" maxLength={250}/>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col sm={{span:24}} md={{span:12}} lg={{span:8}}>
                                    <Form.Item label="Chức vụ">
                                        {getFieldDecorator('MaCV', {
                                            rules: [{
                                            required: true, message: 'Hãy chọn chức vụ!',
                                            }],
                                            initialValue: null
                                        })(
                                            <Select onChange={this.cvChange} >
                                                {this.mangTenCV}
                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={{span:24}} md={{span:12}} lg={{span:8}}>
                                    <Form.Item label="Cửa hàng">
                                        {getFieldDecorator('MaCH', maCHSetting)(
                                            <Select allowClear>
                                                {this.mangTenCH}
                                            </Select>
                                        )}
                                    </Form.Item>                               
                                </Col>
                                <Col sm={{span:24}} md={{span:12}} lg={{span:8}}>
                                    <Form.Item label="Chức danh">
                                        {getFieldDecorator('ChucDanh', {
                                            rules: [{ required: false, message: '' }],
                                            initialValue: null
                                        })(
                                            <Input autoComplete="off" maxLength={200}/>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col sm={{span:24}} md={{span:12}} lg={{span:8}}>                    
                                    <Form.Item label="Dân tộc">
                                        {getFieldDecorator('MaDT', {
                                            rules: [{
                                            required: false, message: 'Hãy chọn dân tộc!'
                                            }],
                                            initialValue: null
                                        })(
                                            <Select>
                                                {this.mangTenDT}
                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={{span:24}} md={{span:12}} lg={{span:8}}>
                                    <Form.Item label="Tôn giáo">
                                        {getFieldDecorator('MaTG', {
                                            rules: [{
                                                required: false, message: 'Hãy chọn tôn giáo!',
                                            }],
                                            initialValue: null
                                        })(
                                            <Select>
                                                {this.mangTenTG}
                                            </Select>
                                        )}
                                    </Form.Item>                                
                                </Col>
                                <Col sm={{span:24}} md={{span:12}} lg={{span:8}}>                          
                                    <Form.Item label="Ngày sinh">
                                        {getFieldDecorator('NgaySinh', {
                                            rules: [{
                                                required: false, message: 'Hãy nhập ngày sinh!',
                                            }],
                                            initialValue: null
                                        })(<DatePicker format='DD-MM-YYYY' placeholder='Chọn ngày' />)
                                        }
                                    </Form.Item>                                   
                                </Col>
                                <Col sm={{span:24}} md={{span:12}} lg={{span:8}}>
                                    <Form.Item label="Nơi sinh">
                                        {getFieldDecorator('NoiSinh', {
                                            rules: [{ required: false, message: '' }],
                                            initialValue: null
                                        })(
                                            <Input autoComplete="off" maxLength={250}/>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>                   
                                <Col sm={{span:24}} md={{span:12}} lg={{span:8}}>
                                    <Form.Item label="Ngày nhận việc">
                                        {getFieldDecorator('NgayNhanViec', {
                                            rules: [{ required: false, message: '' }],
                                            initialValue: null
                                        })(<DatePicker format='DD-MM-YYYY' placeholder='Chọn ngày' />)}
                                    </Form.Item>
                                </Col>
                                <Col sm={{span:24}} md={{span:12}} lg={{span:8}}>
                                    <Form.Item label="Hôn nhân">
                                        {getFieldDecorator('HonNhan', {
                                            rules: [{ required: false, message: '' }],
                                            initialValue: null
                                        })(
                                            <Select>
                                                <Option value="Độc thân">Độc thân</Option>
                                                <Option value="Đã lập gia đình">Đã lập gia đình</Option>
                                            </Select>   
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col sm={{span:24}} md={{span:12}} lg={{span:8}}>
                                    <Form.Item label="Giới tính">
                                        {getFieldDecorator('GioiTinh', {
                                            rules: [{ required: false, message: 'Hãy chọn giới tính!' }],
                                            initialValue: null
                                        })(
                                        <Select>
                                            <Option value="1">Nam</Option>
                                            <Option value="0">Nữ</Option>
                                        </Select>
                                        )}
                                    </Form.Item>                                
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={{span:24}} md={{span:12}} lg={{span:8}}>
                                    <Form.Item label="Trình độ VH">
                                        {getFieldDecorator('MaTrinhDoVH', {
                                            rules: [{ required: false, message: '' }],
                                            initialValue: null
                                        })(
                                            <Select>
                                                {this.mangTrinhDoVH}
                                            </Select>
                                        )}
                                    </Form.Item>                              
                                </Col>
                                <Col sm={{span:24}} md={{span:12}} lg={{span:8}}>
                                    <Form.Item label="Điện thoại">
                                        {getFieldDecorator('DienThoai', {
                                            rules: [{type: '' ,required: false, message: '' },
                                                    {pattern: /^[0-9]+$/, message: 'Số điện thoại không hợp lệ!'}
                                        ],
                                            initialValue: null
                                        })(
                                            <Input maxLength={11}/>
                                        )}      
                                    </Form.Item>
                                </Col>
                                <Col sm={{span:24}} md={{span:12}} lg={{span:8}}>
                                    <Form.Item label="Email">
                                        {getFieldDecorator('Email', {
                                            rules: [{type: 'email', required: false, message: 'Vui lòng nhập đúng email!' }],
                                            initialValue: null
                                        })(
                                            <Input  autoComplete="off" maxLength={150}/>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={{span:24}} md={{span:12}} lg={{span:8}}>
                                    <Form.Item label="Quốc tịch">
                                        {getFieldDecorator('MaQuocTich', {
                                            rules: [{ required: false, message: '' }],
                                            initialValue: null
                                        })(
                                            <Select>
                                                {this.mangQuocTich}
                                            </Select>
                                        )}
                                    </Form.Item>                               
                                </Col>
                                <Col sm={{span:24}} md={{span:12}} lg={{span:8}}>
                                    <Form.Item label="Số tài khoản">
                                        {getFieldDecorator('SoTaiKhoan', {
                                            rules: [{ required: false, message: '' }],
                                            initialValue: null
                                        })(
                                            <Input autoComplete="off" maxLength={50}/>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col sm={{span:24}} md={{span:12}} lg={{span:8}}>
                                    <Form.Item label="Loại lao động">
                                        {getFieldDecorator('LoaiLaoDong', {
                                            rules: [{ required: false, message: '' }],
                                            initialValue: "2"
                                        })(
                                            <Select disabled>
                                                {/* <Option value="1">Trực tiếp</Option> */}
                                                <Option value="2">Gián tiếp</Option>
                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={{span:24}} md={{span:12}} lg={{span:8}}>
                                    <Form.Item label="CMND số">
                                        {getFieldDecorator('CMND', {
                                            rules: [{ required: false, message: '' }],
                                            initialValue: null
                                        })(
                                            <Input autoComplete="off" maxLength={15}/>
                                        )}
                                    </Form.Item>                               
                                </Col>
                                <Col sm={{span:24}} md={{span:12}} lg={{span:8}}>
                                    <Form.Item label="Ngày cấp">
                                        {getFieldDecorator('NgayCap', {
                                            rules: [{ required: false, message: '' }],
                                            initialValue: null
                                        })(<DatePicker format='DD-MM-YYYY' placeholder='Chọn ngày' />)}
                                    </Form.Item>
                                </Col>
                                <Col sm={{span:24}} md={{span:12}} lg={{span:8}}>
                                    <Form.Item label="Nơi cấp ">
                                        {getFieldDecorator('NoiCap', {
                                            rules: [{ required: false, message: '' }],
                                            initialValue: null
                                        })(
                                            <Input autoComplete="off" maxLength={100}/>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={{span:24}} md={{span:12}} lg={{span:8}}>
                                    <Form.Item label="Mã số thẻ từ">
                                        {getFieldDecorator('MaSoTheTu', {
                                            rules: [{ required: false, message: '' }],
                                            initialValue: null
                                        })(
                                            <Input autoComplete="off" maxLength={15}/>
                                        )}
                                    </Form.Item>                              
                                </Col>
                                <Col sm={{span:24}} md={{span:12}} lg={{span:8}}>
                                    <Form.Item label="Kiêm nhiệm">
                                        {getFieldDecorator('KiemNhiem', {
                                            rules: [{ required: false, message: '' }],
                                            initialValue: null
                                        })(
                                            <Input autoComplete="off" maxLength={250}/>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col sm={{span:24}} md={{span:12}} lg={{span:8}}>
                                    <Form.Item label="Chuyên môn">
                                        {getFieldDecorator('ChuyenMon', {
                                            rules: [{ required: false, message: '' }],
                                            initialValue: null
                                        })(
                                            <Input autoComplete="off" maxLength={250}/>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={{span:24}} md={{span:12}} lg={{span:8}}>
                                    <Form.Item label="Lương">
                                        {getFieldDecorator('Luong', {
                                            rules: [{ required: false, message: '' }],
                                            initialValue: null
                                        })(<InputNumber autoComplete="off" min={0} max={2000000000} 
                                        style={{width:'100%'}} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                        precision={0}/>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col sm={{span:24}} md={{span:12}} lg={{span:8}}>
                                    <Form.Item className="trangthai-lv" label="Trạng thái làm việc ">
                                        {getFieldDecorator('TrangThaiLV', {
                                            rules: [{ required: false, message: '' }],
                                            initialValue: true,
                                        })(  
                                            <Switch defaultChecked />                       
                                        )}                           
                                    </Form.Item>                               
                                </Col>     
                            </Row>
                            <Row>
                                {/* <Col sm={{span:24}} md={{span:24}} lg={{span:24}}>
                                    <Form.Item label="Ghi chú">
                                        {getFieldDecorator('GhiChu', {
                                            rules: [{ required: false, message: '' }],
                                            initialValue: null, 
                                            className: 'gtru'
                                        })(
                                            <Input className="width-ghichu" autoComplete="off" maxLength={500}/>
                                        )}
                                    </Form.Item>                               
                                </Col>              */}
                                <Col sm={{span:24}} md={{span:12}} lg={{span:8}}>
                                    <Form.Item label="Ghi chú">
                                        {getFieldDecorator('GhiChu', {
                                            rules: [{ required: false, message: '' }],
                                            initialValue: null
                                        })(
                                            <Input autoComplete="off" maxLength={500}/>
                                        )}
                                    </Form.Item>                              
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={{span:24}} md={{span:12}} lg={{span:8}}>
                                    <Form.Item label="Thường trú">
                                        {getFieldDecorator('ThuongTru', {
                                            rules: [{ required: false, message: '' }],
                                            initialValue: null
                                        })(
                                            <Input className="width-tamtru" autoComplete="off" maxLength={250}/>
                                        )}
                                    </Form.Item> 
                                </Col>
                                <Col sm={{span:24}} md={{span:12}} lg={{span:8}} offset={8}>
                                    <Form.Item label="Tỉnh/Thành" className="hide-tt">
                                    {getFieldDecorator('MaTinhThanhThuongTru', {
                                        rules: [{ required: false, message: '' }],
                                        initialValue: null
                                    })(
                                        <Select>
                                            {this.mangTinhThanh}
                                        </Select>
                                    )}
                                    </Form.Item>
                                </Col>
                            </Row>                           
                            <Row>
                                <Col sm={{span:24}} md={{span:12}} lg={{span:8}}>
                                    <Form.Item label="Tạm trú">
                                        {getFieldDecorator('TamTru', {
                                            rules: [{ required: false, message: '' }],
                                            initialValue: null
                                        })(
                                            <Input className="width-tamtru" autoComplete="off" maxLength={250}/>
                                        )}
                                    </Form.Item> 
                                </Col>
                                <Col sm={{span:24}} md={{span:12}} lg={{span:8}} offset={8}>
                                    <Form.Item label="Tỉnh/Thành" className="hide-tt">
                                    {getFieldDecorator('MaTinhThanhTamTru', {
                                        rules: [{ required: false, message: '' }],
                                        initialValue: null
                                    })(
                                        <Select>
                                            {this.mangTinhThanh}
                                        </Select>
                                    )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={{span:24}} md={{span:12}} lg={{span:8}}>
                                    <Form.Item label="Lý lịch" className="lylich-width">
                                        {getFieldDecorator('LyLich', {
                                            rules: [{ required: false, message: '' }],
                                            initialValue: null
                                        })(
                                            <TextArea rows={3} />   
                                        )}
                                    </Form.Item>                               
                                </Col>
                            </Row>            
                            <div className="themnv_btn">
                                <Button className="themnv_btn" type="primary" htmlType="submit">
                                    Thêm
                                </Button>
                            </div>
                        </Form>
                    </Card>
                </div>
            </div>
        )
        }
        return <></>
    }
    componentDidMount() {
        this.getPhanQuyenMH()
    }
}
const DMNhanVien_Themm = Form.create({ name: 'DMNhanVien_them' })(DMNhanVien_Them);
export default DMNhanVien_Themm