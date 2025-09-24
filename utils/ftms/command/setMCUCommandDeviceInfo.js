import common from '../common.js'

/**
 * 发送读取制造商名称指令
 * @param device 设备对象
 * @returns {*}
 */
function sendManufacturerNameRequest(device) {
    let deviceId = device.deviceId;
    let serviceId = common.fitnessMachine.deviceInfo.primary;
    let characteristicId = common.fitnessMachine.deviceInfo.manufacturerNameString.uuid;

    return common.readAppSystemCommandMCUCharacter(deviceId, serviceId, characteristicId);
}

/**
 * 发送读取型号指令
 * @param device 设备对象
 * @returns {*}
 */
function sendModelNumberRequest(device) {
    let deviceId = device.deviceId;
    let serviceId = common.fitnessMachine.deviceInfo.primary;
    let characteristicId = common.fitnessMachine.deviceInfo.modelNumberString.uuid;

    return common.readAppSystemCommandMCUCharacter(deviceId, serviceId, characteristicId);
}

/**
 * 发送读取序列号指令
 * @param device 设备对象
 * @returns {*}
 */
function sendSerialNumberRequest(device) {
    let deviceId = device.deviceId;
    let serviceId = common.fitnessMachine.deviceInfo.primary;
    let characteristicId = common.fitnessMachine.deviceInfo.serialNumberString.uuid;

    return common.readAppSystemCommandMCUCharacter(deviceId, serviceId, characteristicId);
}

/**
 * 发送读取硬件版本指令
 * @param device 设备对象
 * @returns {*}
 */
function sendHardwareRevisionRequest(device) {
    let deviceId = device.deviceId;
    let serviceId = common.fitnessMachine.deviceInfo.primary;
    let characteristicId = common.fitnessMachine.deviceInfo.hardwareRevisionString.uuid;

    return common.readAppSystemCommandMCUCharacter(deviceId, serviceId, characteristicId);
}

/**
 * 发送读取固件版本指令
 * @param device 设备对象
 * @returns {*}
 */
function sendFirmwareRevisionRequest(device) {
    let deviceId = device.deviceId;
    let serviceId = common.fitnessMachine.deviceInfo.primary;
    let characteristicId = common.fitnessMachine.deviceInfo.firmwareRevisionString.uuid;

    return common.readAppSystemCommandMCUCharacter(deviceId, serviceId, characteristicId);
}

/**
 * 发送读取软件版本指令
 * @param device 设备对象
 * @returns {*}
 */
function sendSoftwareRevisionRequest(device) {
    let deviceId = device.deviceId;
    let serviceId = common.fitnessMachine.deviceInfo.primary;
    let characteristicId = common.fitnessMachine.deviceInfo.softwareRevisionString.uuid;

    return common.readAppSystemCommandMCUCharacter(deviceId, serviceId, characteristicId);
}

/**
 * 发送读取系统ID指令
 * @param device 设备对象
 * @returns {*}
 */
function sendSystemIDRequest(device) {
    let deviceId = device.deviceId;
    let serviceId = common.fitnessMachine.deviceInfo.primary;
    let characteristicId = common.fitnessMachine.deviceInfo.systemID.uuid;

    return common.readAppSystemCommandMCUCharacter(deviceId, serviceId, characteristicId);
}

export default {

    sendManufacturerNameRequest,
    sendModelNumberRequest,
    sendSerialNumberRequest,
    sendHardwareRevisionRequest,
    sendFirmwareRevisionRequest,
    sendSoftwareRevisionRequest,
    sendSystemIDRequest,

}
