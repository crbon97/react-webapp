import React, {PureComponent} from 'react'
import {Route} from 'react-router-dom'
import '../styles/Content.css'
import DMNhanVienThem from '../container/DMNhanVien_Them'
import DMTienTe from '../container/DMTienTe'
import Home from '../container/Home'


class Content extends PureComponent {
    render() {
        return (
            <div className='content'>
                <Route exact path="/" component={Home}/>
                <Route path="/dmnhanvien_them" render={() => <DMNhanVienThem {...this.props}/>}/>
                <Route path="/dmtiente" render={() => <DMTienTe {...this.props}/>}/>
            </div>
        )
    }
}

export default Content