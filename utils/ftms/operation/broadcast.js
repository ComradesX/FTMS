import common from '../common.js'


function isHaveFTMSServerData(device) {
    try {
        if (!device.serviceData) {
            return false;
        }
        if (getFitnessMachineType(device.serviceData) == null) {
            return false;
        }
        let advertisServiceUUIDs = device.advertisServiceUUIDs;
        for (let i = 0; i < advertisServiceUUIDs.length; i++) {
            if (advertisServiceUUIDs[i] === common.fitnessMachine.ftms.primary) {
                return true;
            }
        }
    } catch (error) {
        return false;
    }


}

// 设备类型定义

/**
 * 获取器材类型
 * @returns {{cn_name: string, name: string, type: number}|null} null 表示没有获取到数据
 * @param serverDatas
 */
function getFitnessMachineType(serverDatas) {
    const ftmsPrimary = common.fitnessMachine.ftms.primary;
    if (!serverDatas || !serverDatas[ftmsPrimary]) return null; // 统一返回null表示无效

    const serverData = new Uint8Array(serverDatas[ftmsPrimary]);
    let fitnessMachineType = (serverData[1] | (serverData[2] << 8)); // 直接按小端模式解析

    // 处理大端模式（仅当低字节为0时）
    if ((fitnessMachineType & 0xFF) === 0) {
        fitnessMachineType = (serverData[2] | (serverData[1] << 8));
    }

    // 使用对象查找替代switch-case
    const matchedType = Object.values(common.allFitnessMachineType).find(
        type => type.type === fitnessMachineType
    );
    return matchedType || null; // 明确返回null表示未匹配
}


export default {
    isHaveFTMSServerData,
    getFitnessMachineType,
};



