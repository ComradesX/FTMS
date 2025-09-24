import common from "../common";


/**
 * 解析数据包总函数
 * @param arrayBuffer 数据包
 * @param uuid uuid
 * @returns 返回map类型的解析完成的运动数据
 */
function parserDataPacket(arrayBuffer, uuid) {
    switch (uuid) {
        case common.fitnessMachine.deviceInfo.manufacturerNameString.uuid:
            return parseManufacturerName(arrayBuffer);
        case common.fitnessMachine.deviceInfo.modelNumberString.uuid:
            return parseModelNumber(arrayBuffer);
        case common.fitnessMachine.deviceInfo.serialNumberString.uuid:
            return parseSerialNumber(arrayBuffer);
        case common.fitnessMachine.deviceInfo.hardwareRevisionString.uuid:
            return parseHardwareRevision(arrayBuffer);
        case common.fitnessMachine.deviceInfo.firmwareRevisionString.uuid:
            return parseFirmwareRevision(arrayBuffer);
        case common.fitnessMachine.deviceInfo.softwareRevisionString.uuid:
            return parseSoftwareRevision(arrayBuffer);
        case common.fitnessMachine.deviceInfo.systemID.uuid:
            return parseSystemID(arrayBuffer);
        default:
            return {};
    }
}

/**
 * 解析制造商名称
 * @param arrayBuffer 数据包
 * @returns 制造商名称字符串
 */
function parseManufacturerName(arrayBuffer) {
    return common.parseStringData(arrayBuffer);
}

/**
 * 解析型号
 * @param arrayBuffer 数据包
 * @returns 型号字符串
 */
function parseModelNumber(arrayBuffer) {
    return common.parseStringData(arrayBuffer);
}

/**
 * 解析序列号
 * @param arrayBuffer 数据包
 * @returns 序列号字符串
 */
function parseSerialNumber(arrayBuffer) {
    return common.parseStringData(arrayBuffer);
}

/**
 * 解析硬件版本
 * @param arrayBuffer 数据包
 * @returns 硬件版本字符串
 */
function parseHardwareRevision(arrayBuffer) {
    return common.parseStringData(arrayBuffer);
}

/**
 * 解析固件版本
 * @param arrayBuffer 数据包
 * @returns 固件版本字符串
 */
function parseFirmwareRevision(arrayBuffer) {
    return common.parseStringData(arrayBuffer);
}

/**
 * 解析软件版本
 * @param arrayBuffer 数据包
 * @returns 软件版本字符串
 */
function parseSoftwareRevision(arrayBuffer) {
    return common.parseStringData(arrayBuffer);
}

/**
 * 解析系统ID
 * @param arrayBuffer 数据包
 */
function parseSystemID(arrayBuffer) {
    const dataView = new Uint8Array(arrayBuffer);
    let systemID = '';
    for (let i = 0; i < dataView.length; i++) {
        const hex = dataView[i].toString(16).padStart(2, '0');
        systemID += hex.toUpperCase();
        if (i < dataView.length - 1) {
            systemID += '-';
        }
    }
    return systemID;
}



export default {
    parserDataPacket,
}
