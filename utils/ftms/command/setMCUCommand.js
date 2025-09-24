import common from '../common.js'

/**
 * 发送描述设备支持的能力获取指令
 * @param device
 * @returns {*}
 */
function sendFitnessMachineFeatureRequest(device) {
    let deviceId = device.deviceId;
    let serviceId = common.fitnessMachine.ftms.primary;
    let characteristicId = common.fitnessMachine.ftms.fitnessMachineFeature.uuid

    return common.readAppSystemCommandMCUCharacter(deviceId, serviceId, characteristicId);
}


/**
 * 发送 上报设备状态数据 指令
 * @param device
 * @returns {*}
 */
function sendTrainingStatusRequest(device) {
    let deviceId = device.deviceId;
    let serviceId = common.fitnessMachine.ftms.primary;
    let characteristicId = common.fitnessMachine.ftms.trainingStatus.uuid

    return common.readAppSystemCommandMCUCharacter(deviceId, serviceId, characteristicId);
}


/**
 * 发送 上报支持的速度范围 指令
 * @param device
 * @returns {*}
 */
function sendSupportedSpeedRangeRequest(device) {
    let deviceId = device.deviceId;
    let serviceId = common.fitnessMachine.ftms.primary;
    let characteristicId = common.fitnessMachine.ftms.supportedSpeedRange.uuid

    return common.readAppSystemCommandMCUCharacter(deviceId, serviceId, characteristicId);
}

/**
 * 发送 上报支持的坡度范围 指令
 * @param device
 * @returns {*}
 */
function sendSupportedInclinationRangeRequest(device) {
    let deviceId = device.deviceId;
    let serviceId = common.fitnessMachine.ftms.primary;
    let characteristicId = common.fitnessMachine.ftms.supportedInclinationRange.uuid

    return common.readAppSystemCommandMCUCharacter(deviceId, serviceId, characteristicId);
}


/**
 * 发送 上报支持的阻力范围 指令
 * @param device
 * @returns {*}
 */
function sendSupportedResistanceLevelRangeRequest(device) {
    let deviceId = device.deviceId;
    let serviceId = common.fitnessMachine.ftms.primary;
    let characteristicId = common.fitnessMachine.ftms.supportedResistanceLevelRange.uuid

    return common.readAppSystemCommandMCUCharacter(deviceId, serviceId, characteristicId);
}

/**
 * 发送 上报支持的功率范围 指令
 * @param device
 * @returns {*}
 */
function sendSupportedPowerRangeRequest(device) {
    let deviceId = device.deviceId;
    let serviceId = common.fitnessMachine.ftms.primary;
    let characteristicId = common.fitnessMachine.ftms.supportedPowerRange.uuid

    return common.readAppSystemCommandMCUCharacter(deviceId, serviceId, characteristicId);
}

/**
 * 发送 上报支持的功率范围 指令
 * @param device
 * @returns {*}
 */
function sendSupportedHeartRateRangeRequest(device) {
    let deviceId = device.deviceId;
    let serviceId = common.fitnessMachine.ftms.primary;
    let characteristicId = common.fitnessMachine.ftms.supportedHeartRateRange.uuid

    return common.readAppSystemCommandMCUCharacter(deviceId, serviceId, characteristicId);

}


/**
 * 设置阻力
 * @param device
 * @param value
 */
async function setResistance(device, value) {
    let initPacket = new Uint8Array([0x00]);
    value = Math.round(value * 10);
    let valuePacket = new Uint8Array([
        0x04,
        ...[value & 0xFF, (value >> 8) & 0xFF]
    ]);
    let deviceId = device.deviceId;
    let serviceId = common.fitnessMachine.ftms.primary;
    let characteristicId = common.fitnessMachine.ftms.fitnessMachineControlPoint.uuid
    common.writeBLECharacteristicValue(deviceId, serviceId, characteristicId, initPacket.buffer);
    await new Promise(resolve => setTimeout(resolve, 300));
    common.writeBLECharacteristicValue(deviceId, serviceId, characteristicId, valuePacket.buffer);
    await new Promise(resolve => setTimeout(resolve, 300));
}


/**
 * 设置设备坡度（Inclination）
 * @param {Object} device - 蓝牙设备对象
 * @param {number} value - 坡度值（单位：%，支持正负，如10表示10%上坡，-5表示5%下坡）
 */
async function setInclination(device, value) {
    // 校验坡度值范围（规范建议-100% ~ +100%）
    if (value < -100 || value > 100) {
        throw new Error('Invalid inclination value: must be between -100% and +100%');
    }

    const deviceId = device.deviceId;
    const serviceId = common.fitnessMachine.ftms.primary;
    const characteristicId = common.fitnessMachine.ftms.fitnessMachineControlPoint.uuid;

    // Step 1: 请求控制权限（Op Code 0x00）
    const requestControlPacket = new Uint8Array([0x00]);
    await common.writeBLECharacteristicValue(deviceId, serviceId, characteristicId, requestControlPacket.buffer);
    await new Promise(resolve => setTimeout(resolve, 300)); // 等待设备响应

    // Step 2: 发送坡度设置指令（Op Code 0x03）
    const inclinationValue = Math.round(value * 10);
    const buffer = new ArrayBuffer(3); // Op Code + SINT16
    const view = new DataView(buffer);
    view.setUint8(0, 0x03);           // Op Code
    view.setInt16(1, inclinationValue, true); // SINT16 (Little-Endian)
    await common.writeBLECharacteristicValue(deviceId, serviceId, characteristicId, buffer);

}


/**
 *
 * @param device
 * @param value  Watt
 * @returns {Promise<void>}
 */
async function setPower(device, value) {


    const deviceId = device.deviceId;
    const serviceId = common.fitnessMachine.ftms.primary;
    const characteristicId = common.fitnessMachine.ftms.fitnessMachineControlPoint.uuid;

    // Step 1: 请求控制权限（Op Code 0x00）
    const requestControlPacket = new Uint8Array([0x00]);
    await common.writeBLECharacteristicValue(deviceId, serviceId, characteristicId, requestControlPacket.buffer);
    await new Promise(resolve => setTimeout(resolve, 300)); // 等待设备响应

    const powerValue = Math.round(value);
    const buffer = new ArrayBuffer(3);
    const view = new DataView(buffer);
    view.setUint8(0, 0x05);          // Op Code: 0x05
    view.setInt16(1, powerValue, true); // SINT16 (Little-Endian)
    const powerPacket = new Uint8Array(buffer);
    await common.writeBLECharacteristicValue(deviceId, serviceId, characteristicId, powerPacket.buffer);
}

/**
 * 设置速度
 * @param device
 * @param value 单位 km/h
 */

async function setSpeed(device, value) {
    let initPacket = new Uint8Array([0x00]);
    let scaledValue = Math.round(value * 100);
    let valuePacket = new Uint8Array([
        0x02, // 操作码：设置目标速度
        scaledValue & 0xFF, // 低字节
        (scaledValue >> 8) & 0xFF // 高字节
    ]);
    let deviceId = device.deviceId;
    let serviceId = common.fitnessMachine.ftms.primary;
    let characteristicId = common.fitnessMachine.ftms.fitnessMachineControlPoint.uuid
    common.writeBLECharacteristicValue(deviceId, serviceId, characteristicId, initPacket.buffer);
    await new Promise(resolve => setTimeout(resolve, 300));
    common.writeBLECharacteristicValue(deviceId, serviceId, characteristicId, valuePacket.buffer);
    await new Promise(resolve => setTimeout(resolve, 300));
}

/**
 * 停止指令
 * @param device
 * @returns {Promise<void>}
 */
async function stopDevice(device) {
    let initPacket = new Uint8Array([0x00]);
    // 停止指令 (0x08) + 控制信息 (0x01 表示停止)
    let stopCommand = new Uint8Array([0x08, 0x01]);

    let deviceId = device.deviceId;
    let serviceId = common.fitnessMachine.ftms.primary;
    let characteristicId = common.fitnessMachine.ftms.fitnessMachineControlPoint.uuid
    common.writeBLECharacteristicValue(deviceId, serviceId, characteristicId, initPacket.buffer);
    await new Promise(resolve => setTimeout(resolve, 300));
    common.writeBLECharacteristicValue(deviceId, serviceId, characteristicId, stopCommand.buffer);
    await new Promise(resolve => setTimeout(resolve, 300));
}

/**
 * 暂停指令
 * @param device
 * @returns {Promise<void>}
 */
async function pauseDevice(device) {
    let initPacket = new Uint8Array([0x00]);
    // 停止指令 (0x08) + 控制信息 (0x01 表示停止)
    let pauseCommand = new Uint8Array([0x08, 0x02]);

    let deviceId = device.deviceId;
    let serviceId = common.fitnessMachine.ftms.primary;
    let characteristicId = common.fitnessMachine.ftms.fitnessMachineControlPoint.uuid
    common.writeBLECharacteristicValue(deviceId, serviceId, characteristicId, initPacket.buffer);
    await new Promise(resolve => setTimeout(resolve, 300));
    common.writeBLECharacteristicValue(deviceId, serviceId, characteristicId, pauseCommand.buffer);
    await new Promise(resolve => setTimeout(resolve, 300));
}


/**
 * 开始或者继续指令
 * @param device
 * @returns {Promise<void>}
 */
async function startOrResumeDevice(device) {
    let initPacket = new Uint8Array([0x00]);
    let startOrResumeCommand = new Uint8Array([0x07]);

    let deviceId = device.deviceId;
    let serviceId = common.fitnessMachine.ftms.primary;
    let characteristicId = common.fitnessMachine.ftms.fitnessMachineControlPoint.uuid
    common.writeBLECharacteristicValue(deviceId, serviceId, characteristicId, initPacket.buffer);
    await new Promise(resolve => setTimeout(resolve, 300));
    common.writeBLECharacteristicValue(deviceId, serviceId, characteristicId, startOrResumeCommand.buffer);
    await new Promise(resolve => setTimeout(resolve, 300));
}

/**
 * 重置指令
 * https://developer.huawei.com/consumer/cn/doc/HMSCore-Guides/fmcp-0000001050147089
 * @param device
 * @returns {Promise<void>}
 */
async function resetDevice(device) {
    let initPacket = new Uint8Array([0x00]);
    let resetCommand = new Uint8Array([0x01]);

    let deviceId = device.deviceId;
    let serviceId = common.fitnessMachine.ftms.primary;
    let characteristicId = common.fitnessMachine.ftms.fitnessMachineControlPoint.uuid
    common.writeBLECharacteristicValue(deviceId, serviceId, characteristicId, initPacket.buffer);
    await new Promise(resolve => setTimeout(resolve, 300));
    common.writeBLECharacteristicValue(deviceId, serviceId, characteristicId, resetCommand.buffer);
    await new Promise(resolve => setTimeout(resolve, 300));
}


export default {
    sendFitnessMachineFeatureRequest,
    sendTrainingStatusRequest,
    sendSupportedSpeedRangeRequest,
    sendSupportedInclinationRangeRequest,
    sendSupportedResistanceLevelRangeRequest,
    sendSupportedPowerRangeRequest,
    sendSupportedHeartRateRangeRequest,
    resetDevice,
    pauseDevice,
    startOrResumeDevice,
    setResistance,
    setInclination,
    setSpeed,
    setPower,
    stopDevice,
}