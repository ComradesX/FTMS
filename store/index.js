import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        searchDeviceList: [],
        linkedDevice: {},
        sportDataList: [],
        controllerResponse: {},
    },
    mutations: {
        // 添加设备到列表
        addSearchedDevice(state, device) {
            let exists = state.searchDeviceList.some(item => item.deviceId === device.deviceId);
            if (!exists) {
                state.searchDeviceList.push(device);
            }
        },

        // 删除指定设备
        removeSearchedDevice(state, deviceId) {
            const index = state.searchDeviceList.findIndex(device => device.id === deviceId)
            if (index !== -1) {
                state.searchDeviceList.splice(index, 1)
            }
        },

        // 清空设备列表
        clearSearchedDevices(state) {
            state.searchDeviceList = []
        },
        // 设置已连接设备
        setLinkedDevice(state, device) {
            state.linkedDevice = device;
        },

        // 清空已连接设备
        clearLinkedDevice(state) {
            state.linkedDevice = {};
        },
        addSportDataList(state, data) {
            state.sportDataList.push(data)
        },
        clearSportDataList(state) {
            state.sportDataList = []
        },
        setControllerResponse(state, data) {
            state.controllerResponse = data
        },
        clearControllerResponse(state) {
            state.controllerResponse = {}
        }
    }
})
export default store
