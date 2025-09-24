import broadcast from './operation/broadcast.js'
import common from './common.js'
import setMCUCommand from "./command/setMCUCommand";
import setMCUCommandDeviceInfo from "./command/setMCUCommandDeviceInfo";

import fitnessInfo from "./analysisCharacter/fitnessInfo"
import deviceInfo from "./analysisCharacter/deviceInfo"

const protocol = 'ftms';

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 *
 * 选择设备主服务
 * @param device
 * @param services Array [{"uuid":"123123","isPrimary":true}]
 */
async function chooseDeviceService(device, services) {
    for (const service of services) {
        if (service.uuid === common.fitnessMachine.ftms.primary) {
            await delay(100); // 再次延迟 0.1

            uni.getBLEDeviceCharacteristics({
                deviceId: device.deviceId,
                serviceId: service.uuid,
                success: res => {
                    console.log('获取服务特征值成功', res)
                    chooseFitnessMachineNotifyCharacteristic(device, res.characteristics)
                }, fail: res => {
                    console.error('获取服务特征值失败', res)

                }
            })
        }

        if (service.uuid === common.fitnessMachine.deviceInfo.primary) {
            await delay(100); // 再次延迟 0.1

            uni.getBLEDeviceCharacteristics({
                deviceId: device.deviceId,
                serviceId: service.uuid,
                success: res => {
                    console.log('获取服务特征值成功', res)
                    chooseDeviceInfoNotifyCharacteristic(device, res.characteristics)
                }, fail: res => {
                    console.error('获取服务特征值失败', res)
                }
            })
        }
    }
    await delay(100); // 再次延迟 0.1
}


/**
 * 选择健身设备通知特征值
 * @param device
 * @param characteristicInfos
 * @returns {Promise<void>}
 */
async function chooseFitnessMachineNotifyCharacteristic(device, characteristicInfos) {

    switch (device.type.name) {
        case common.allFitnessMachineType.treadmill.name:
            let notifyTreadmillCharacteristicInfos = characteristicInfos.filter(characteristic => common.treadmillCharacteristics.some(treadmillChar => treadmillChar.uuid === characteristic.uuid));
            // let notifyTreadmillCharacteristicInfos = characteristicInfos.filter(characteristic => characteristic.properties.notify && common.treadmillCharacteristics.some(treadmillChar => treadmillChar.uuid === characteristic.uuid));
            for (const characteristicInfo of notifyTreadmillCharacteristicInfos) {
                await delay(100)
                common.notifyBLECharacteristicValueChange(device.deviceId, common.fitnessMachine.ftms.primary, characteristicInfo.uuid)
            }
            break;
        case common.allFitnessMachineType.crossTrainer.name:
            let notifyCrossTrainerCharacteristicInfos = characteristicInfos.filter(characteristic => common.crossTrainerCharacteristics.some(crossTrainerChar => crossTrainerChar.uuid === characteristic.uuid));
            // let notifyCrossTrainerCharacteristicInfos = characteristicInfos.filter(characteristic => characteristic.properties.notify && common.crossTrainerCharacteristics.some(crossTrainerChar => crossTrainerChar.uuid === characteristic.uuid));
            for (const characteristicInfo of notifyCrossTrainerCharacteristicInfos) {
                await delay(100)
                common.notifyBLECharacteristicValueChange(device.deviceId, common.fitnessMachine.ftms.primary, characteristicInfo.uuid)
            }
            break;
        case common.allFitnessMachineType.rower.name:

            let notifyRowerCharacteristicInfos = characteristicInfos.filter(characteristic => common.rowerCharacteristics.some(rowerTrainerChar => rowerTrainerChar.uuid === characteristic.uuid));
            // let notifyRowerCharacteristicInfos = characteristicInfos.filter(characteristic => characteristic.properties.notify && common.rowerCharacteristics.some(rowerTrainerChar => rowerTrainerChar.uuid === characteristic.uuid));
            for (const characteristicInfo of notifyRowerCharacteristicInfos) {
                await delay(100)
                common.notifyBLECharacteristicValueChange(device.deviceId, common.fitnessMachine.ftms.primary, characteristicInfo.uuid)
            }
            break;
        case common.allFitnessMachineType.indoorBike.name:

            let notifyIndoorBikeCharacteristicInfos = characteristicInfos.filter(characteristic => common.bikeCharacteristics.some(indoorBikeTrainerChar => indoorBikeTrainerChar.uuid === characteristic.uuid));
            for (const characteristicInfo of notifyIndoorBikeCharacteristicInfos) {
                await delay(100)
                common.notifyBLECharacteristicValueChange(device.deviceId, common.fitnessMachine.ftms.primary, characteristicInfo.uuid)
            }
            break;
    }
    await delay(100)
}

/**
 *
 * 选择设备信息通知特征值
 * @param device
 * @param characteristicInfos
 * @returns {Promise<void>}
 */
async function chooseDeviceInfoNotifyCharacteristic(device, characteristicInfos) {

    // 提取deviceInfo下的所有特征值UUID
    const deviceInfoCharacteristics = [
        common.fitnessMachine.deviceInfo.manufacturerNameString,
        common.fitnessMachine.deviceInfo.modelNumberString,
        common.fitnessMachine.deviceInfo.serialNumberString,
        common.fitnessMachine.deviceInfo.hardwareRevisionString,
        common.fitnessMachine.deviceInfo.firmwareRevisionString,
        common.fitnessMachine.deviceInfo.softwareRevisionString,
        common.fitnessMachine.deviceInfo.systemID
    ];
    // 过滤：1. 特性需支持notify；2. 特性UUID需在deviceInfo特征列表中
    const notifyCharacteristicInfos = characteristicInfos.filter(characteristic =>
        // characteristic.properties.notify &&
        deviceInfoCharacteristics.some(deviceChar => deviceChar.uuid === characteristic.uuid)
    );
    // 遍历并订阅通知
    for (const characteristicInfo of notifyCharacteristicInfos) {
        common.notifyBLECharacteristicValueChange(
            device.deviceId,
            fitnessMachine.deviceInfo.primary,
            characteristicInfo.uuid
        );
        await delay(100); // 延迟避免请求过快
    }
}

function analysisDataAllCharacteristic(characteristicInfo) {

    switch (characteristicInfo.serviceId) {
        case common.fitnessMachine.ftms.primary:
            return fitnessInfo.parserDataPacket(characteristicInfo.value, characteristicInfo.characteristicId);
        case common.fitnessMachine.deviceInfo.primary:
            return deviceInfo.parserDataPacket(characteristicInfo.value, characteristicInfo.characteristicId);
    }

}


export default {
    protocol, broadcast, setMCUCommand,setMCUCommandDeviceInfo, chooseDeviceService, analysisDataAllCharacteristic, common

}