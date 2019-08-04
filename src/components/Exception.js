import React, {Component} from 'react'
import '../styles/Exception.css'
import img403 from '../assets/403.svg'
import img404 from '../assets/404.svg'
import img500 from '../assets/500.svg'

class Exception extends Component {
    render() {
        let info
        switch(this.props.type){
            case '403':
                info = {
                    // urlImg: "url('https://gw.alipayobjects.com/zos/rmsportal/wZcnGqRDyhPOEYFcZDnb.svg')",
                    src: img403,
                    desc: "Sorry, you don't have access to this page"
                }
                break
            case '404':
                info = {
                    // urlImg: "url('https://gw.alipayobjects.com/zos/rmsportal/KpnpchXsobRgLElEozzI.svg')",
                    src: img404,
                    desc: "Sorry, the page you visited does not exist"
                }
                break
            case '500':
                info = {
                    // urlImg: "url('https://gw.alipayobjects.com/zos/rmsportal/RVRUAYdCGeYNBWoKiIwB.svg')",
                    src: img500,
                    desc: "Sorry, the server is reporting an error"
                }
                break
            default:
                break
        }

        return (
            <div className='exception-page'>
                <div className='exception-imgBlock'>
                    {/* <div className='exception-imgEle' style={{backgroundImage:info.urlImg}}></div> */}
                    <img alt='exception-img' src={info.src} className='exception-imgEle'/>
                </div>
                <div className='exception-content'>
                    <h1>{this.props.type}</h1>
                    <div className='exception-desc'>{info.desc}</div>
                </div>
            </div>
        )
    }
}

export default Exception