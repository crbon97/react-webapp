import React, {Component} from 'react'
import {
  PageHeader, Typography, Table, Divider, Button, Modal, Form,
  Input, message, Popconfirm, Card
} from 'antd';
import axios from 'axios'

import {USER_TOKEN} from '../utils/constants'
import {getAuthorityWithKey} from '../utils/authority'
import '../styles/DMTienTe.css'

const { Paragraph } = Typography


// function hasErrors(fieldsError) {
//   return Object.keys(fieldsError).some(field => fieldsError[field]);
// }

class DMTienTe extends Component {
    constructor(props) {
        super(props)
        this.state = {
          mangTienTe: [],
          visibleEdit: false,
          visibleAdd: false,
          selectedItem: null,
          PhanQuyenMH: []
        }
        this.quyenxem= null
        this.UI_ID = 'DM_TIENTE'
    }

    getPhanQuyenMH=()=>{
      this.props.event.setSpinning(true);
       axios.get(`/api/phanquyenmanhinh/layQuyen/${this.UI_ID}`,{
          headers: {
              Authorization: `Bearer ${getAuthorityWithKey(USER_TOKEN)}`
          }
      }).then(res => {
          this.props.event.setSpinning(false);
          this.setState({PhanQuyenMH : res.data.results[0]})
          this.quyenxem = res.data.results[0].QuyenXem

          if(this.quyenxem){
            this.loadData()
          }else{            
            window.location.replace('/deny')
            this.props.event.setSpinning(false);
          }
          // this.phanquyenmh = res.data.results[0]
      }).catch(error => {
          message.error(error.request.responseText)
          this.props.event.setSpinning(false);
      });
    }

    loadData(){ 
      this.props.event.setSpinning(true);
       axios.get(`/api/tiente/getAll/${this.UI_ID}`,{
          headers: {
              Authorization: `Bearer ${getAuthorityWithKey(USER_TOKEN)}`
          }
      }).then(res => {
          this.props.event.setSpinning(false);
          this.setState({mangTienTe : res.data.results});
      }).catch(err => {
          this.props.event.setSpinning(false);
      });
    }

    showEditModal = (selectedItem) => {
      this.setState({
        visibleEdit: true,
        selectedItem: selectedItem
      });
      this.props.form.setFieldsValue({  maTT: selectedItem.MaTienTe, tenTT: selectedItem.TenTienTe});
      console.log(this.props.form.getFieldValue("tenTT"), this.props.form.getFieldValue("maTT"));
    }
  
    handleEditOk = (e) => {
      this.props.form.validateFields((err, values) => {
        if (!err) {
          this.capNhatTienTe();
          this.setState({
            visibleEdit: false,
          });
        }
      });
    }
  
    handleEditCancel = (e) => {
      this.props.form.resetFields()
      this.setState({
        visibleEdit: false,
      });
    }

    showAddModal = () => {
      this.setState({
        visibleAdd: true
      });
    }
  
    handleAddOk = (e) => {
      console.log(e);
      this.props.form.validateFields((err, values) => {
        if (!err) {
          this.themTienTe();
          this.setState({
          visibleAdd: false,
        });
        }
      });
    }
  
    handleAddCancel = (e) => {
      console.log(e);
      this.props.form.resetFields()
      this.setState({
        visibleAdd: false,
      });      
    }

    deleteConfirmCancel(e) {
      console.log(e);
    }
  
    columns = [
        {
        title: 'Ký hiệu tiền tệ',
        dataIndex: 'MaTienTe'
      },
      {
        title: 'Tên tiền tệ',
        dataIndex: 'TenTienTe'
      },
      {
        title: 'Tác vụ',
        render: (text, record) => {
        let node
        if(this.state.PhanQuyenMH.QuyenXoa){
          node =  <Popconfirm title="Bạn có chắc không?" onConfirm={(e) => {this.xoa(record)}} onCancel={this.deleteConfirmCancel} okText="Có" cancelText="Không">
                    <Button>Xóa</Button>
                  </Popconfirm>
        }else{
          node = <Button disabled>Xóa</Button>
        }
        return(
          <span>
            <Button disabled={!this.state.PhanQuyenMH.QuyenSua} onClick={(e) => {this.showEditModal(record);}}>Sửa</Button> 
            <Divider type="vertical" />
            {/* <Button type="link" onClick={(e) => {this.xoa(record)}}>Xóa</Button>*/}
            {node}
          </span>
        )}
    }];
    
    themTienTe(){
      var data = {
        maTT: this.props.form.getFieldValue("maTT"),
        tenTT: this.props.form.getFieldValue("tenTT")
      }
       axios.post(`/api/tiente/them/${this.UI_ID}`, data,{
        headers: {
            Authorization: `Bearer ${getAuthorityWithKey(USER_TOKEN)}`,
            'Content-Type': 'application/json'
        }
        }).then(res => {
            message.success('Thêm thành công!');
            this.loadData();
            // console.log(res.data)
        }).catch(err => {
            message.error(err.request.responseText);
            console.log(err)
        })
    }

    capNhatTienTe(){
      console.log(this.props.form.getFieldValue("maTT"));
      var data = {
        maTT: this.props.form.getFieldValue("maTT"),
        tenTT: this.props.form.getFieldValue("tenTT")
      }
       axios.put(`/api/tiente/capnhat/${this.UI_ID}`, data,{
        headers: {
            Authorization: `Bearer ${getAuthorityWithKey(USER_TOKEN)}`,
            'Content-Type': 'application/json'
        }
        }).then(res => {
            message.success('Cập nhật thành công!');
            this.loadData();
        }).catch(err => {
            message.error(err.request.responseText);
        })
    }

    xoa(record){
      var MaTienTe = record.MaTienTe;
       axios.delete(`/api/tiente/xoa/${MaTienTe}/${this.UI_ID}`,{
        headers: {
            Authorization: `Bearer ${getAuthorityWithKey(USER_TOKEN)}`
        }
        }).then(res => {
            this.loadData();
            console.log(res.data)
        }).catch(err => {
            message.error(err.request.responseText);
            console.log(err)
        })
    }

    render() {
        if(this.quyenxem){
          const { getFieldDecorator } = this.props.form;
        
          const formItemLayout = {
              labelCol: {
                xs: { span: 24 },
                sm: { span: 7 },
              },
              wrapperCol: {
                xs: { span: 24 },
                sm: { span: 10 },
              },
            };
  
          return (
              <div className="layout">
                  <PageHeader title="Danh sách tiền tệ">
                      <Paragraph>
                        <Button disabled={!this.state.PhanQuyenMH.QuyenThem} type="primary" onClick={this.showAddModal}>
                                Thêm 
                        </Button>
                      </Paragraph>
                  </PageHeader>
                  
                  <div className="page-content-loading">
                      <div className="page-content">
                        <Card bordered={false}>
                          <Table columns={this.columns} dataSource={this.state.mangTienTe} />
                        </Card>
                      </div>
                  </div>
  
                  <Modal
                    title="Thêm"
                    visible={this.state.visibleAdd}
                    onOk={this.handleAddOk}
                    onCancel={this.handleAddCancel}
                    footer={[
                      <Button key="back" onClick={this.handleAddCancel}>Hủy</Button>,
                      <Button key="submit" type="primary"  onClick={this.handleAddOk}>
                        Thêm
                      </Button>,
                    ]}
                  >
                  
                    <Form {...formItemLayout}> 
                      <Form.Item label="Ký hiệu tiền tệ">
                          {getFieldDecorator('maTT', {
                              rules: [{
                                required: true, message: 'Vui lòng nhập vào ký hiệu tiền tệ!',
                              },
                              {pattern: /^[a-zA-Z0-9]+$/, message: 'Ký tự không hợp lệ!'}
                            ]
                          })(
                              <Input autoComplete="off" maxLength={20}/>
                          )}
                      </Form.Item>
                      <Form.Item label="Tên tiền tệ">
                          {getFieldDecorator('tenTT', {
                              rules: [{
                                required: true, message: 'Vui lòng nhập vào tên tiền tệ!',
                              }]
                          })(
                              <Input autoComplete="off" maxLength={200}/>
                          )}
                      </Form.Item>
                    </Form>
                  </Modal>
  
                  <Modal
                    title="Sửa"
                    visible={this.state.visibleEdit}
                    onOk = {this.handleEditOk}
                    onCancel={this.handleEditCancel}
                    footer={[
                      <Button key="back" onClick={this.handleEditCancel}>Hủy</Button>,
                      <Button key="submit" type="primary"  onClick={this.handleEditOk}>
                        Sửa
                      </Button>,
                    ]}
                  >
                  
                    <Form {...formItemLayout}> 
                      <Form.Item label="Tên tiền tệ">
                          {getFieldDecorator('tenTT', {
                              rules: [{
                                required: true, message: 'Vui lòng nhập vào tên tiền tệ!',
                              }],
                              initialValue: this.props.tenTT
                          })(
                              <Input autoComplete="off" maxLength={200}/>
                          )}
                      </Form.Item>
                    </Form>
                  </Modal>
              </div>
          )
        }
        return <></>
    }

    componentDidMount() {
        // To disabled submit button at the beginning.
        //this.props.form.validateFields();
        // this.loadData()
        this.getPhanQuyenMH()
    }


}
const DMTienTe_ = Form.create({ name: 'DMTienTe' })(DMTienTe);
export default DMTienTe_
