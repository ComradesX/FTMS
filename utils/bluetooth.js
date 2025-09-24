import ftms from '@/utils/ftms/ftms.js'
import store from '@/store/index.js'
import setMCUCommandDeviceInfo from "./ftms/command/setMCUCommandDeviceInfo";

// 初始化蓝牙模块
async function searchDevice() {

    uni.openBluetoothAdapter({
        success: () => {
            store.commit('clearSearchedDevices')
            // 搜索附近蓝牙
            startBluetoothDevicesDiscovery()
        }, fail: (err) => {
            console.log('打开蓝牙适配器失败', err)
        },
    })
}

// 搜索附近蓝牙
function startBluetoothDevicesDiscovery() {
    uni.startBluetoothDevicesDiscovery({
        allowDuplicatesKey: true, // 允许重复上报同一设备
        powerLevel: 'high', // 扫描频率
        success: (res) => {
            onBluetoothDeviceFound()
            // 搜索10秒后停止搜索
            setTimeout(() => {
                stopSearchBluetoothDevicesDiscovery()
            }, 10000)
        }, fail: (err) => {
            console.error('搜索失败', err)
        },
    })
}

// 监听寻找到新设备的事件
function onBluetoothDeviceFound() {
    uni.onBluetoothDeviceFound((res) => {
        let device = res.devices[0]

        if (!device.name) return

        try {
            const deviceExists = store.state.searchDeviceList.some((d) => d.deviceId === device.deviceId)
            if (deviceExists) return
            if (ftms.broadcast.isHaveFTMSServerData(device)) {
                device.protocol = ftms.protocol
                device.type = ftms.broadcast.getFitnessMachineType(device.serviceData)
                store.commit('addSearchedDevice', device)
            }
        } catch (err) {
            console.log('广播数据解析失败', err)
        }
    })
}

// 连接设备
async function linkDevice(device) {


    await new Promise((resolve) => setTimeout(resolve, 200))
    uni.createBLEConnection({
        deviceId: device.deviceId,
        success: async (res) => {
            store.commit('setLinkedDevice', device)
            await new Promise((resolve) => setTimeout(resolve, 200))
            // 设置蓝牙最大传输单元
            uni.setBLEMTU({
                deviceId: device.deviceId,
                mtu: 64, // 接受 发送包的最大长度
                success: (res) => {
                    console.log('set MUT success', res)
                }, fail: (res) => {
                    console.error('set MUT fail', res)
                },
            })
            await new Promise((resolve) => setTimeout(resolve, 200))
            // 监听连接状态变化
            onBLEConnectionStateChange()
            // 通过deviceId获取到蓝牙设备所有服务
            uni.getBLEDeviceServices({
                deviceId: device.deviceId, success: async (res) => {
                    onBLECharacteristicValueChange()
                    // 获取指定服务中的所有特征值，并启动特征值变化通知事件
                    if (device.protocol === ftms.protocol) {
                        ftms.chooseDeviceService(device, res.services)
                        switch (device.type.name) {
                            case ftms.common.allFitnessMachineType.treadmill.name:
                                await new Promise((resolve) => setTimeout(resolve, 200))
                                ftms.setMCUCommand.sendFitnessMachineFeatureRequest(device)
                                await new Promise((resolve) => setTimeout(resolve, 200))
                                ftms.setMCUCommand.sendTrainingStatusRequest(device)
                                await new Promise((resolve) => setTimeout(resolve, 200))
                                ftms.setMCUCommand.sendSupportedSpeedRangeRequest(device)
                                await new Promise((resolve) => setTimeout(resolve, 200))
                                ftms.setMCUCommand.sendSupportedInclinationRangeRequest(device)
                                await new Promise((resolve) => setTimeout(resolve, 200))
                                ftms.setMCUCommand.sendSupportedHeartRateRangeRequest(device)
                                await new Promise((resolve) => setTimeout(resolve, 200))
                                break
                            case ftms.common.allFitnessMachineType.indoorBike.name:
                                await new Promise((resolve) => setTimeout(resolve, 200))
                                ftms.setMCUCommand.sendFitnessMachineFeatureRequest(device)
                                await new Promise((resolve) => setTimeout(resolve, 200))
                                ftms.setMCUCommand.sendTrainingStatusRequest(device)
                                await new Promise((resolve) => setTimeout(resolve, 200))
                                ftms.setMCUCommand.sendSupportedSpeedRangeRequest(device)
                                await new Promise((resolve) => setTimeout(resolve, 200))
                                ftms.setMCUCommand
                                    .sendSupportedResistanceLevelRangeRequest(device)
                                await new Promise((resolve) => setTimeout(resolve, 200))
                                ftms.setMCUCommand.sendSupportedPowerRangeRequest(device)
                                await new Promise((resolve) => setTimeout(resolve, 200))
                                ftms.setMCUCommand.sendSupportedHeartRateRangeRequest(device)
                                await new Promise((resolve) => setTimeout(resolve, 200))
                                break
                            case ftms.common.allFitnessMachineType.crossTrainer.name:
                                await new Promise((resolve) => setTimeout(resolve, 200))
                                ftms.setMCUCommand.sendFitnessMachineFeatureRequest(device)
                                await new Promise((resolve) => setTimeout(resolve, 200))
                                ftms.setMCUCommand.sendTrainingStatusRequest(device)
                                await new Promise((resolve) => setTimeout(resolve, 200))
                                ftms.setMCUCommand
                                    .sendSupportedResistanceLevelRangeRequest(device)
                                await new Promise((resolve) => setTimeout(resolve, 200))
                                ftms.setMCUCommand.sendSupportedHeartRateRangeRequest(device)
                                await new Promise((resolve) => setTimeout(resolve, 200))
                                break
                            case ftms.common.allFitnessMachineType.rower.name:
                                await new Promise((resolve) => setTimeout(resolve, 200))
                                ftms.setMCUCommand.sendFitnessMachineFeatureRequest(device)
                                await new Promise((resolve) => setTimeout(resolve, 200))
                                ftms.setMCUCommand.sendTrainingStatusRequest(device)
                                await new Promise((resolve) => setTimeout(resolve, 200))
                                ftms.setMCUCommand
                                    .sendSupportedResistanceLevelRangeRequest(device)
                                await new Promise((resolve) => setTimeout(resolve, 200))
                                ftms.setMCUCommand.sendSupportedPowerRangeRequest(device)
                                await new Promise((resolve) => setTimeout(resolve, 200))
                                ftms.setMCUCommand.sendSupportedHeartRateRangeRequest(device)
                                await new Promise((resolve) => setTimeout(resolve, 200))
                                break
                        }

                        ftms.setMCUCommandDeviceInfo.sendManufacturerNameRequest(device)
                        await new Promise((resolve) => setTimeout(resolve, 200))

                        ftms.setMCUCommandDeviceInfo.sendModelNumberRequest(device)
                        await new Promise((resolve) => setTimeout(resolve, 200))

                        ftms.setMCUCommandDeviceInfo.sendSerialNumberRequest(device)
                        await new Promise((resolve) => setTimeout(resolve, 200))

                        ftms.setMCUCommandDeviceInfo.sendHardwareRevisionRequest(device)
                        await new Promise((resolve) => setTimeout(resolve, 200))

                        ftms.setMCUCommandDeviceInfo.sendFirmwareRevisionRequest(device)
                        await new Promise((resolve) => setTimeout(resolve, 200))

                        ftms.setMCUCommandDeviceInfo.sendSoftwareRevisionRequest(device)
                        await new Promise((resolve) => setTimeout(resolve, 200))

                        ftms.setMCUCommandDeviceInfo.sendSystemIDRequest(device)
                        await new Promise((resolve) => setTimeout(resolve, 200))

                    }
                }, fail: (res) => {
                    console.error('获取蓝牙设备服务失败 ', res)
                },
            })
        }, fail: (res) => {
            console.error('蓝牙连接失败', res)
        },
    })
}

// 监听解析事件
function onBLECharacteristicValueChange() {
    return uni.onBLECharacteristicValueChange((res) => {
        try {
            let analysisData = null
            res.valueStr = ftms.common.ab2hex(res.value)
            analysisData = ftms.analysisDataAllCharacteristic(res)
            handleBluetoothCharacteristicData(res, analysisData)
        } catch (err) {
            console.log('解析数据失败', err)
        }
    })
}

function handleBluetoothCharacteristicData(res, analysisData) {

    let tempDevice = {...store.state.linkedDevice} // 创建新对象
    if (!tempDevice.deviceInfo) {
        tempDevice.deviceInfo = {};
    }
    switch (res.characteristicId) {
        case ftms.common.fitnessMachine.ftms.treadmillData.uuid:
            store.commit('addSportDataList', analysisData)
            break;
        case ftms.common.fitnessMachine.ftms.indoorBikeData.uuid:
            store.commit('addSportDataList', analysisData)
            break;
        case ftms.common.fitnessMachine.ftms.crossTrainerData.uuid:
            store.commit('addSportDataList', analysisData)
            break;
        case ftms.common.fitnessMachine.ftms.rowerData.uuid:
            store.commit('addSportDataList', analysisData)
            break;
        case ftms.common.fitnessMachine.ftms.supportedSpeedRange.uuid:
            tempDevice.supportedSpeedRange = analysisData;
            store.commit('setLinkedDevice', tempDevice)
            break;
        case ftms.common.fitnessMachine.ftms.supportedInclinationRange.uuid:
            tempDevice.supportedInclinationRange = analysisData;
            store.commit('setLinkedDevice', tempDevice)
            break;
        case ftms.common.fitnessMachine.ftms.supportedResistanceLevelRange.uuid:
            tempDevice.supportedResistanceLevelRange = analysisData;
            store.commit('setLinkedDevice', tempDevice)
            break;
        case ftms.common.fitnessMachine.ftms.supportedPowerRange.uuid:
            tempDevice.supportedPowerRange = analysisData;
            store.commit('setLinkedDevice', tempDevice)
            break;
        case ftms.common.fitnessMachine.ftms.supportedHeartRateRange.uuid:
            tempDevice.supportedHeartRateRange = analysisData;
            store.commit('setLinkedDevice', tempDevice)
            break;
        case ftms.common.fitnessMachine.ftms.fitnessMachineFeature.uuid:
            tempDevice.fitnessMachineFeature = analysisData;
            store.commit('setLinkedDevice', tempDevice)
            break;
        case ftms.common.fitnessMachine.ftms.fitnessMachineControlPoint.uuid:
            store.commit('setControllerResponse', analysisData)
            break;
        case ftms.common.fitnessMachine.ftms.trainingStatus.uuid:
            tempDevice.trainingStatus = analysisData;
            store.commit('setLinkedDevice', tempDevice)
            break;


        case ftms.common.fitnessMachine.deviceInfo.manufacturerNameString.uuid:
            tempDevice.deviceInfo.manufacturerNameString = analysisData;
            store.commit('setLinkedDevice', tempDevice)
            break;
        case ftms.common.fitnessMachine.deviceInfo.modelNumberString.uuid:
            tempDevice.deviceInfo.modelNumberString = analysisData;
            store.commit('setLinkedDevice', tempDevice)
            break;
        case ftms.common.fitnessMachine.deviceInfo.serialNumberString.uuid:
            tempDevice.deviceInfo.serialNumberString = analysisData;
            tempDevice.trainingStatus = analysisData;
            store.commit('setLinkedDevice', tempDevice)
            break;
        case ftms.common.fitnessMachine.deviceInfo.hardwareRevisionString.uuid:
            tempDevice.deviceInfo.hardwareRevisionString = analysisData;
            tempDevice.trainingStatus = analysisData;
            store.commit('setLinkedDevice', tempDevice)
            break;
        case ftms.common.fitnessMachine.deviceInfo.firmwareRevisionString.uuid:
            tempDevice.deviceInfo.firmwareRevisionString = analysisData;
            store.commit('setLinkedDevice', tempDevice)
            break;
        case ftms.common.fitnessMachine.deviceInfo.softwareRevisionString.uuid:
            tempDevice.deviceInfo.softwareRevisionString = analysisData;
            store.commit('setLinkedDevice', tempDevice)
            break;
        case ftms.common.fitnessMachine.deviceInfo.systemID.uuid:
            tempDevice.deviceInfo.systemID = analysisData;
            store.commit('setLinkedDevice', tempDevice)
            break;

    }
}

// 处理连接意外断开等意外情况
function onBLEConnectionStateChange() {
    uni.onBLEConnectionStateChange((res) => {
        console.log('连接状态改变', res)
    })
}

// 停止搜索设备
function stopSearchBluetoothDevicesDiscovery() {
    uni.stopBluetoothDevicesDiscovery({
        success: (res) => {
            console.log('停止搜索成功')
        }, fail: (res) => {
            console.error('停止搜索失败', res)
        },
    })
}

// 断开设备连接
function closeBLEConnection(device) {
    uni.closeBLEConnection({
        deviceId: device.deviceId, success: (res) => {
            store.commit('clearLinkedDevice')
        }, fail: (err) => {
            console.log('断开连接失败', err)
        },
    })
}

export default {
    searchDevice,
    linkDevice,
    closeBLEConnection
}