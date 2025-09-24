const fitnessMachine = {
    'ftms': {
        "primary": "00001826-0000-1000-8000-00805F9B34FB",
        "trainingStatus": {
            "uuid": "00002AD3-0000-1000-8000-00805F9B34FB",
            "properties": {
                "read": true,
                "write": false,
                "notify": true,
                "indicate": false
            }
        },
        "treadmillData": {
            "uuid": "00002ACD-0000-1000-8000-00805F9B34FB",
            "properties": {
                "read": false,
                "write": false,
                "notify": true,
                "indicate": false
            }
        },
        "fitnessMachineControlPoint": {
            "uuid": "00002AD9-0000-1000-8000-00805F9B34FB",
            "properties": {
                "read": false,
                "write": true,
                "notify": true,
                "indicate": true
            }
        },
        "fitnessMachineStatus": {
            "uuid": "00002ADA-0000-1000-8000-00805F9B34FB",
            "properties": {
                "read": false,
                "write": false,
                "notify": true,
                "indicate": false
            }
        },
        "fitnessMachineFeature": {
            "uuid": "00002ACC-0000-1000-8000-00805F9B34FB",
            "properties": {
                "read": true,
                "write": false,
                "notify": false,
                "indicate": false
            }
        },
        "supportedSpeedRange": {
            "uuid": "00002AD4-0000-1000-8000-00805F9B34FB",
            "properties": {
                "read": true,
                "write": false,
                "notify": false,
                "indicate": false
            }
        },
        "supportedHeartRateRange": {
            "uuid": "00002AD7-0000-1000-8000-00805F9B34FB",
            "properties": {
                "read": true,
                "write": false,
                "notify": false,
                "indicate": false
            }
        },
        "supportedInclinationRange": {
            "uuid": "00002AD5-0000-1000-8000-00805F9B34FB",
            "properties": {
                "read": true,
                "write": false,
                "notify": false,
                "indicate": false
            }
        },
        "crossTrainerData": {
            "uuid": "00002ACE-0000-1000-8000-00805F9B34FB",
            "properties": {
                "read": false,
                "write": false,
                "notify": true,
                "indicate": false
            }
        },
        "rowerData": {
            "uuid": "00002AD1-0000-1000-8000-00805F9B34FB",
            "properties": {
                "read": false,
                "write": false,
                "notify": true,
                "indicate": false
            }
        },
        "indoorBikeData": {
            "uuid": "00002AD2-0000-1000-8000-00805F9B34FB",
            "properties": {
                "read": false,
                "write": false,
                "notify": true,
                "indicate": false
            }
        },
        "supportedResistanceLevelRange": {
            "uuid": "00002AD6-0000-1000-8000-00805F9B34FB",
            "properties": {
                "read": true,
                "write": false,
                "notify": false,
                "indicate": false
            }
        },
        "supportedPowerRange": {
            "uuid": "00002AD8-0000-1000-8000-00805F9B34FB",
            "properties": {
                "read": true,
                "write": false,
                "notify": false,
                "indicate": false
            }
        }
    },
    'deviceInfo': {
        "primary": "0000180A-0000-1000-8000-00805F9B34FB",
        "manufacturerNameString": {
            "uuid": "00002A29-0000-1000-8000-00805F9B34FB",
            "properties": {
                "read": true,
                "write": false,
                "notify": false,
                "indicate": false
            }
        },
        "modelNumberString": {
            "uuid": "00002A24-0000-1000-8000-00805F9B34FB",
            "properties": {
                "read": true,
                "write": false,
                "notify": false,
                "indicate": false
            }
        },
        "serialNumberString": {
            "uuid": "00002A25-0000-1000-8000-00805F9B34FB",
            "properties": {
                "read": true,
                "write": false,
                "notify": false,
                "indicate": false
            }
        },
        "hardwareRevisionString": {
            "uuid": "00002A27-0000-1000-8000-00805F9B34FB",
            "properties": {
                "read": true,
                "write": false,
                "notify": false,
                "indicate": false
            }
        },
        "firmwareRevisionString": {
            "uuid": "00002A26-0000-1000-8000-00805F9B34FB",
            "properties": {
                "read": true,
                "write": false,
                "notify": false,
                "indicate": false
            }
        },
        "softwareRevisionString": {
            "uuid": "00002A28-0000-1000-8000-00805F9B34FB",
            "properties": {
                "read": true,
                "write": false,
                "notify": false,
                "indicate": false
            }
        },
        "systemID": {
            "uuid": "00002A23-0000-1000-8000-00805F9B34FB",
            "properties": {
                "read": true,
                "write": false,
                "notify": false,
                "indicate": false
            }
        }
    }
}


const treadmillCharacteristics = [
    fitnessMachine.ftms.fitnessMachineFeature,
    fitnessMachine.ftms.treadmillData,
    fitnessMachine.ftms.trainingStatus,
    fitnessMachine.ftms.supportedSpeedRange,
    fitnessMachine.ftms.supportedInclinationRange,

    fitnessMachine.ftms.supportedHeartRateRange,
    fitnessMachine.ftms.fitnessMachineControlPoint,
    fitnessMachine.ftms.fitnessMachineStatus,

]
const bikeCharacteristics = [
    fitnessMachine.ftms.fitnessMachineFeature,
    fitnessMachine.ftms.indoorBikeData,
    fitnessMachine.ftms.trainingStatus,
    fitnessMachine.ftms.supportedSpeedRange,
    fitnessMachine.ftms.supportedResistanceLevelRange,

    fitnessMachine.ftms.supportedPowerRange,
    fitnessMachine.ftms.supportedHeartRateRange,
    fitnessMachine.ftms.fitnessMachineControlPoint,
    fitnessMachine.ftms.fitnessMachineStatus,

]

const rowerCharacteristics = [
    fitnessMachine.ftms.fitnessMachineFeature,
    fitnessMachine.ftms.rowerData,
    fitnessMachine.ftms.trainingStatus,
    fitnessMachine.ftms.supportedPowerRange,
    fitnessMachine.ftms.supportedHeartRateRange,

    fitnessMachine.ftms.fitnessMachineControlPoint,
    fitnessMachine.ftms.fitnessMachineStatus

]
const crossTrainerCharacteristics = [
    fitnessMachine.ftms.fitnessMachineFeature,
    fitnessMachine.ftms.crossTrainerData,
    fitnessMachine.ftms.trainingStatus,
    fitnessMachine.ftms.supportedResistanceLevelRange,
    fitnessMachine.ftms.supportedPowerRange,

    fitnessMachine.ftms.supportedHeartRateRange,
    fitnessMachine.ftms.fitnessMachineControlPoint,
    fitnessMachine.ftms.fitnessMachineStatus
]

const allFitnessMachineType = {
    "treadmill": {
        "name": "跑步机",//"跑步机"
        "type": 0x0001 << 0,
        "characteristics": treadmillCharacteristics
    },
    "crossTrainer": {
        "name": "椭圆机",//椭圆机
        "type": 0x0001 << 1,
        "characteristics": crossTrainerCharacteristics
    },
    "stepClimber": {
        "name": "StepClimber",//台阶攀爬器
        "type": 0x0001 << 2,
        "characteristics": null
    },
    "stairClimber": {
        "name": "StairClimber",//爬楼机
        "type": 0x0001 << 3,
        "characteristics": null
    },
    "rower": {
        "name": "划船机",//划船机
        "type": 0x0001 << 4,
        "characteristics": rowerCharacteristics
    },
    "indoorBike": {
        "name": "室内单车",//室内单车
        "type": 0x0001 << 5,
        "characteristics": bikeCharacteristics
    }
}

/**
 * 获取设备系统信息
 * @param deviceId
 * @param serviceId
 * @param characteristicUuid
 * @returns {*}
 */
function readAppSystemCommandMCUCharacter(deviceId, serviceId, characteristicUuid) {
    return uni.readBLECharacteristicValue({ // 初始化 通知请求修改数据
        deviceId: deviceId,
        serviceId: serviceId,
        characteristicId: characteristicUuid,
        success() {
            console.log('发送包 success', characteristicUuid)
        },
        fail(res) {
            console.error('发送包 fail', characteristicUuid)
        },
    })

}

/**
 *
 * 监听特征值
 * @param deviceId
 * @param serviceId
 * @param characteristicUuid
 * @returns {boolean|*|boolean}
 */
function notifyBLECharacteristicValueChange(deviceId, serviceId, characteristicUuid) {

    return uni.notifyBLECharacteristicValueChange({
        state: true,
        deviceId: deviceId,
        serviceId: serviceId,
        characteristicId: characteristicUuid,
        success: successInfo => {
            console.log("特征值监听时间 成功 ", characteristicUuid)
        },
        fail: res => {
            console.error("特征值监听时间失败 ", res, characteristicUuid)
        }
    })
}

/**
 * 写入特征值
 * @param deviceId
 * @param serviceId
 * @param characteristicUuid
 * @param value
 * @returns {*}
 */
function writeBLECharacteristicValue(deviceId, serviceId, characteristicUuid, value) {
    return uni.writeBLECharacteristicValue({
        deviceId: deviceId,
        serviceId: serviceId,
        characteristicId: characteristicUuid,
        value: value,
        success: function (res) {
            console.log('writeBLECharacteristicValue success', ab2hex(value), res)
        },
        fail: function (res) {
            console.error('writeBLECharacteristicValue fail', res)
        }
    })
}

/**
 * 将字符串转换为十六进制字符串
 * @param buffer
 * @returns {string}
 */
function ab2hex(buffer) {
    let hexArr = Array.prototype.map.call(new Uint8Array(buffer), function (bit) {
        return ('00' + bit.toString(16)).slice(-2)
    })
    return hexArr.join('')
}

/**
 * 字符串分割
 * @param str
 * @returns {*}
 */
function insertColon(str) {
    // 使用正则表达式按照每两个字符一组进行分割
    let parts = str.match(/.{1,2}/g);

    // 在每组中间添加冒号，并连接起来
    return parts.join('  ');
}


/**
 * 判断binaryNumber 数的二进制的第location位是否为1
 * @param binaryNumber
 * @param location
 * @returns {boolean}
 */
function isBitSet(binaryNumber, location) {
    // 将二进制数 binaryNumber 右移 location 位，并与 1 进行按位与操作
    const bitValue = (binaryNumber >> location) & 1;

    return bitValue === 1;
}
/**
 * 解析字符串类型数据
 * @param arrayBuffer 数据包
 * @returns 解析后的字符串
 */
function parseStringData(arrayBuffer) {
    // 使用兼容性更好的方法解析字符串
    const uint8Array = new Uint8Array(arrayBuffer);

    // 查找字符串结束位置（第一个为0的字节）
    let length = uint8Array.length;
    for (let i = 0; i < uint8Array.length; i++) {
        if (uint8Array[i] === 0) {
            length = i;
            break;
        }
    }

    // 手动将字节数组转换为字符串
    let result = '';
    for (let i = 0; i < length; i++) {
        result += String.fromCharCode(uint8Array[i]);
    }

    return result;
}

export default {
    fitnessMachine,
    treadmillCharacteristics,
    bikeCharacteristics,
    rowerCharacteristics,
    crossTrainerCharacteristics,
    allFitnessMachineType,
    parseStringData,
    readAppSystemCommandMCUCharacter,
    notifyBLECharacteristicValueChange,
    writeBLECharacteristicValue,
    ab2hex,
    insertColon,
    isBitSet
};
