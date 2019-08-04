import axios from 'axios'
import {USER_TOKEN} from '../utils/constants'
import {getAuthorityWithKey} from '../utils/authority'

export const rootSubmenuKeys = ['baocaohinhanh', 'danhmuc', 'phanquyen']

var dsGroupMH = [];
var dsManhinhDuocCap = [];
var menuData = {
    isLoading: true,
    menus: []
}
getMenuData();
function getMenuData(){
    axios.get(`/api/groupmanhinh/getall`,{
        headers: {
            Authorization: `Bearer ${getAuthorityWithKey(USER_TOKEN)}`
        }
    }).then(res => { 
        dsGroupMH = res.data.results;
        axios.get(`/api/phanquyenmanhinh/layDSMHUserDuocCap`,{
            headers: {
                Authorization: `Bearer ${getAuthorityWithKey(USER_TOKEN)}`
            }
        }).then(res => {  
            dsManhinhDuocCap = res.data.results;
            for(var i = 0; i < dsManhinhDuocCap.length; i++){
                for(var j =0 ; j < dsGroupMH.length; j++){
                    if(dsGroupMH[j].IDGroupMH === dsManhinhDuocCap[i].IDGroupMH){
                        //Push các menu item tiếp theo
                        if( menuData.menus[j] && menuData.menus[j].child && menuData.menus[j].child.length >= 0){
                            menuData.menus[j].child.push({
                                key: dsManhinhDuocCap[i].IDManHinh,
                                linkto: dsManhinhDuocCap[i].Link,
                                title: dsManhinhDuocCap[i].TenManHinh
                            });
                        }else{
                            //Push menu group đầu tiên và push menu item đầu tiên
                            menuData.menus[j] = {
                                key: dsGroupMH[j].IDGroupMH,
                                icon: dsGroupMH[j].Icon,
                                title: dsGroupMH[j].TenGroupMH,
                                child: []
                            }
                            menuData.menus[j].child.push({
                                key: dsManhinhDuocCap[i].IDManHinh,
                                linkto: dsManhinhDuocCap[i].Link,
                                title: dsManhinhDuocCap[i].TenManHinh
                            });
        
                        }                    
                    }
                }
            }
            menuData.isLoading = false;
        }).catch(err => {
            console.log(err);
            menuData.isLoading = false;
        });
    }).catch(err => {
        console.log(err);
        menuData.isLoading = false;
    });
}

export default menuData;