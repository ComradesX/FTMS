import common from "../common";


/**
 * 解析数据包总函数
 * @param arrayBuffer 数据包
 * @param uuid uuid
 * @returns 返回map类型的解析完成的运动数据
 */
function parserDataPacket(arrayBuffer, uuid) {
    switch (uuid) {
        case common.fitnessMachine.ftms.treadmillData.uuid:
            return parserDataTreadmill(arrayBuffer);
        case common.fitnessMachine.ftms.crossTrainerData.uuid:
            return parserDataCrossTrainer(arrayBuffer);
        case common.fitnessMachine.ftms.rowerData.uuid:
            return parserDataRower(arrayBuffer);
        case common.fitnessMachine.ftms.indoorBikeData.uuid:
            return parserDataIndoorBike(arrayBuffer);
        case common.fitnessMachine.ftms.trainingStatus.uuid:
            return parseTrainingStatus(arrayBuffer);
        case common.fitnessMachine.ftms.fitnessMachineFeature.uuid:
            return parseFitnessMachineFeature(arrayBuffer);
        case common.fitnessMachine.ftms.supportedResistanceLevelRange.uuid:
            return parseSupportedResistanceRange(arrayBuffer);
        case common.fitnessMachine.ftms.supportedInclinationRange.uuid:
            return parseSupportedInclinationRange(arrayBuffer);
        case common.fitnessMachine.ftms.supportedHeartRateRange.uuid:
            return parseSupportedHeartRateRange(arrayBuffer);
        case common.fitnessMachine.ftms.supportedPowerRange.uuid:
            return parseSupportedPowerRange(arrayBuffer);
        case common.fitnessMachine.ftms.fitnessMachineStatus.uuid:
            return parseFitnessMachineStatus(arrayBuffer);
        case common.fitnessMachine.ftms.supportedSpeedRange.uuid:
            return parseSupportedSpeedRange(arrayBuffer);
        case common.fitnessMachine.ftms.fitnessMachineControlPoint.uuid:
            return parseFitnessMachineControlPointResponse(arrayBuffer);
        default:
            return {};
    }
}


function parseSupportedInclinationRange(arrayBuffer) {
    const dataView = new DataView(arrayBuffer);

    // 规范定义：字段为 SINT16（有符号16位整数），单位是 0.1%（需除以10）
    const minimumInclination = dataView.getInt16(0, true) / 10; // 最小坡度 (%)
    const maximumInclination = dataView.getInt16(2, true) / 10; // 最大坡度 (%)
    const minimumIncrement = dataView.getUint16(4, true) / 10;  // 最小增量 (%)

    // 处理特殊值：0x7FFF（32767）表示"未知"
    const isUnknown = (value) => value === 3276.7; // 0x7FFF / 10

    return {
        minimumInclination: isUnknown(minimumInclination) ? null : minimumInclination,
        maximumInclination: isUnknown(maximumInclination) ? null : maximumInclination,
        minimumIncrement: isUnknown(minimumIncrement) ? null : minimumIncrement,
        unit: '%',                                     // 单位固定为百分比
    };
}


/**
 * 解析跑步机数据
 * @param data 数据包
 */
function parserDataTreadmill(data) {
    const tempData = new Map();
    const dataView = new Uint8Array(data);
    const flag = (dataView[1] << 8) + dataView[0];
    let dataIndex = 2;

    // 特殊处理第一个标志位
    if ((flag & 0x0001) === 0) {
        tempData.set('instantaneousSpeed', {
            value: movIndex(dataView, dataIndex, 2) / 100,
            unit: 'km/h',
            name: '即时速度'
        }); // 单位 Km/h
        dataIndex += 2;
    }

    // 处理其他标志位
    for (let i = 0; i < 16; i++) {
        const flagBit = 0x0001 << i;
        if ((flag & flagBit) === flagBit) {
            switch (i) {
                case 1: // Average Speed
                    tempData.set('averageSpeed', {
                        value: movIndex(dataView, dataIndex, 2) / 100,
                        unit: 'km/h',
                        name: '平均速度'
                    }); //单位 Km/h
                    dataIndex += 2;
                    break;
                case 2: // Total Distance
                    tempData.set('totalDistance', {
                        value: movIndex(dataView, dataIndex, 3) / 1000,
                        unit: 'km',
                        name: '总距离'
                    }); // 单位 km
                    dataIndex += 3;
                    break;
                case 3: // Inclination
                    tempData.set('inclination', {
                        value: movIndex(dataView, dataIndex, 2) / 10,
                        unit: '%',
                        name: '坡度'
                    }); // 单位 percent
                    dataIndex += 2;
                    tempData.set('rampAngleSetting', {
                        value: movIndex(dataView, dataIndex, 2) / 10,
                        unit: '°C',
                        name: '坡道角度设置'
                    }); // 温度 单位 °C
                    dataIndex += 2;
                    break;
                case 4: // Elevation Gain
                    tempData.set('positiveElevationGain', {
                        value: movIndex(dataView, dataIndex, 2) / 10,
                        unit: 'm',
                        name: '正海拔增益'
                    }); // 单位 m
                    dataIndex += 2;
                    tempData.set('negativeElevationGain', {
                        value: movIndex(dataView, dataIndex, 2) / 10,
                        unit: 'm',
                        name: '负海拔增益'
                    }); // 单位 m
                    dataIndex += 2;
                    break;
                case 5: // Instantaneous Pace
                    tempData.set('instantaneousPace', {
                        value: movIndex(dataView, dataIndex, 1) / 10,
                        unit: 'Km/m',
                        name: '即时步速'
                    }); // Km/m
                    dataIndex += 1;
                    break;
                case 6: // Average Pace
                    tempData.set('averagePace', {
                        value: movIndex(dataView, dataIndex, 1) / 10,
                        unit: 'Km/m',
                        name: '平均步速'
                    }); // Km/m
                    dataIndex += 1;
                    break;
                case 7: // Expended Energy
                    tempData.set('totalEnergy', {
                        value: movIndex(dataView, dataIndex, 2),
                        unit: 'kcal',
                        name: '总能量消耗'
                    }); // kcal
                    dataIndex += 2;
                    tempData.set('energyPerHour', {
                        value: movIndex(dataView, dataIndex, 2),
                        unit: 'kcal',
                        name: '每小时能量消耗'
                    }); // kcal
                    dataIndex += 2;
                    tempData.set('energyPerMinute', {
                        value: movIndex(dataView, dataIndex, 1),
                        unit: 'kcal',
                        name: '每分钟能量消耗'
                    }); // kcal
                    dataIndex += 1;
                    break;
                case 8: // Heart Rate
                    tempData.set('heartRate', {
                        value: movIndex(dataView, dataIndex, 1),
                        unit: 'Beats/m',
                        name: '心率'
                    }); // Beats/m
                    dataIndex += 1;
                    break;
                case 9: // Metabolic Equivalent
                    tempData.set('metabolicEquivalent', {
                        value: movIndex(dataView, dataIndex, 1) / 10,
                        unit: 'meta',
                        name: '代谢当量'
                    }); // meta
                    dataIndex += 1;
                    break;
                case 10: // Elapsed Time
                    tempData.set('elapsedTime', {
                        value: movIndex(dataView, dataIndex, 2),
                        unit: 'second',
                        name: '已用时间'
                    }); // second
                    dataIndex += 2;
                    break;
                case 11: // Remaining Time
                    tempData.set('remainingTime', {
                        value: movIndex(dataView, dataIndex, 2),
                        unit: 'second',
                        name: '剩余时间'
                    }); // second
                    dataIndex += 2;
                    break;
                case 12: // Force on Belt and Power Output
                    tempData.set('forceOnBelt', {
                        value: movIndex(dataView, dataIndex, 2),
                        unit: 'newton',
                        name: '传送带上的力'
                    }); // newton
                    dataIndex += 2;
                    tempData.set('powerOutput', {
                        value: movIndex(dataView, dataIndex, 2),
                        unit: 'Watts',
                        name: '功率输出'
                    }); // Watts
                    dataIndex += 2;
                    break;
                case 13: // Steps
                    tempData.set('steps', {
                        value: movIndex(dataView, dataIndex, 3),
                        unit: 'step',
                        name: '步数'
                    }); // step
                    dataIndex += 3;
                    break;
            }
        }
    }
    return Object.fromEntries(tempData)
}


/**
 * 辅助函数：移动索引并解析数据
 * @param data 数据包
 * @param Index 当前索引
 * @param length 数据长度
 */
function movIndex(data, Index, length) {
    let result = 0;
    for (let i = 0; i < length; i++) {
        result = result | (data[Index + i] << (8 * i));
    }
    return result;
}

/**
 * 解析椭圆机数据
 * @param data 数据包
 */
/**
 * 解析椭圆机数据
 * @param data 数据包
 */
function parserDataCrossTrainer(data) {
    const tempData = new Map();
    const dataView = new Uint8Array(data);
    const flag = (dataView[1] << 8) + dataView[0];
    let dataIndex = null;
    if (isTwoOctet(data)) {
        dataIndex = 2;
    } else {
        dataIndex = 3;
    }

    // 特殊处理第一个标志位
    if ((flag & 0x0001) === 0) {
        tempData.set('instantaneousSpeed', {
            value: movIndex(dataView, dataIndex, 2) / 100,
            unit: 'km/h',
            name: '即时速度'
        }); // 单位 Km/h
        dataIndex += 2;
    }

    // 处理其他标志位
    for (let i = 0; i < 16; i++) {
        const flagBit = 0x0001 << i;
        if ((flag & flagBit) === flagBit) {
            switch (i) {
                case 1: // Average Speed
                    tempData.set('averageSpeed', {
                        value: movIndex(dataView, dataIndex, 2) / 100,
                        unit: 'km/h',
                        name: '平均速度'
                    }); // 单位 Km/h
                    dataIndex += 2;
                    break;
                case 2: // Total Distance
                    tempData.set('totalDistance', {
                        value: movIndex(dataView, dataIndex, 3) / 1000,
                        unit: 'km',
                        name: '总距离'
                    }); // 单位 km
                    dataIndex += 3;
                    break;
                case 3: // Step Count
                    tempData.set('stepPerMinute', {
                        value: movIndex(dataView, dataIndex, 2),
                        unit: 'step_per_minute',
                        name: '每分钟步数'
                    }); // step_per_minute
                    dataIndex += 2;
                    tempData.set('averageStepRate', {
                        value: movIndex(dataView, dataIndex, 2),
                        unit: 'step_per_minute',
                        name: '平均步数率'
                    }); // step_per_minute
                    dataIndex += 2;
                    break;
                case 4: // Stride Count
                    tempData.set('strideCount', {
                        value: movIndex(dataView, dataIndex, 2),
                        unit: 'Unitless',
                        name: '步幅计数'
                    }); // Unitless
                    dataIndex += 2;
                    break;
                case 5: // Elevation Gain
                    tempData.set('positiveElevationGain', {
                        value: movIndex(dataView, dataIndex, 2) / 1000,
                        unit: 'km',
                        name: '正海拔增益'
                    }); // 单位KM
                    dataIndex += 2;
                    tempData.set('negativeElevationGain', {
                        value: movIndex(dataView, dataIndex, 2) / 1000,
                        unit: 'km',
                        name: '负海拔增益'
                    }); // 单位KM
                    dataIndex += 2;
                    break;
                case 6: // Inclination and Ramp Angle Setting
                    tempData.set('inclination', {
                        value: movIndex(dataView, dataIndex, 2) / 10,
                        unit: '%',
                        name: '坡度'
                    }); // percent
                    dataIndex += 2;
                    tempData.set('rampAngleSetting', {
                        value: movIndex(dataView, dataIndex, 2) / 10,
                        unit: '%',
                        name: '坡道角度设置'
                    }); // percent
                    dataIndex += 2;
                    break;
                case 7: // Resistance Level
                    tempData.set('resistanceLevel', {
                        value: movIndex(dataView, dataIndex, 2) / 10,
                        unit: 'unitless',
                        name: '阻力等级'
                    }); // unitless
                    dataIndex += 2;
                    break;
                case 8: // Instantaneous Power
                    tempData.set('instantaneousPower', {
                        value: movIndex(dataView, dataIndex, 2),
                        unit: 'Watt',
                        name: '即时功率'
                    }); // Watt
                    dataIndex += 2;
                    break;
                case 9: // Average Power
                    tempData.set('averagePower', {
                        value: movIndex(dataView, dataIndex, 2),
                        unit: 'Watt',
                        name: '平均功率'
                    }); // Watt
                    dataIndex += 2;
                    break;
                case 10: // Expended Energy
                    tempData.set('totalEnergy', {
                        value: movIndex(dataView, dataIndex, 2),
                        unit: 'kcal',
                        name: '总能量消耗'
                    }); // kcal
                    dataIndex += 2;
                    tempData.set('energyPerHour', {
                        value: movIndex(dataView, dataIndex, 2),
                        unit: 'kcal',
                        name: '每小时能量消耗'
                    }); // kcal
                    dataIndex += 2;
                    tempData.set('energyPerMinute', {
                        value: movIndex(dataView, dataIndex, 1),
                        unit: 'kcal',
                        name: '每分钟能量消耗'
                    }); // kcal
                    dataIndex += 1;
                    break;
                case 11: // Heart Rate
                    tempData.set('heartRate', {
                        value: movIndex(dataView, dataIndex, 1),
                        unit: 'Beats/m',
                        name: '心率'
                    }); // Beats/m
                    dataIndex += 1;
                    break;
                case 12: // Metabolic Equivalent
                    tempData.set('metabolicEquivalent', {
                        value: movIndex(dataView, dataIndex, 1) / 10,
                        unit: 'meta',
                        name: '代谢当量'
                    }); // meta
                    dataIndex += 1;
                    break;
                case 13: // Elapsed Time
                    tempData.set('elapsedTime', {
                        value: movIndex(dataView, dataIndex, 2),
                        unit: 'second',
                        name: '已用时间'
                    }); // second
                    dataIndex += 2;
                    break;
                case 14: // Remaining Time
                    tempData.set('remainingTime', {
                        value: movIndex(dataView, dataIndex, 2),
                        unit: 'second',
                        name: '剩余时间'
                    }); // second
                    dataIndex += 2;
                    break;
                case 15: // Movement Direction
                    tempData.set('movementDirection', {
                        value: movIndex(dataView, dataIndex, 1),
                        unit: 'unitless',
                        name: '运动方向'
                    });
                    break;
            }
        }
    }
    return Object.fromEntries(tempData)
}


function isTwoOctet(arrayBuffer) {
    let dateView = new Uint8Array(arrayBuffer);
    let conditionFlag = (dateView[1] << 8) + dateView[0];
    let calculateLength = 0;
    for (let i = 0; i < 16; i++) {
        switch (i) {
            case 0: //More Data
                if (!isBitSet(conditionFlag, 0)) {
                    calculateLength += 2;
                }
                break;
            case 1: // Average Speed
                if (isBitSet(conditionFlag, 1)) {
                    calculateLength += 2;
                }
                break;
            case 2: // Total Distance
                if (isBitSet(conditionFlag, 2)) {
                    calculateLength += 3;
                }
                break;
            case 3: // Step Count
                if (isBitSet(conditionFlag, 3)) {
                    calculateLength += 4;
                }
                break;
            case 4: // Stride Count
                if (isBitSet(conditionFlag, 4)) {
                    calculateLength += 2;
                }
                break;
            case 5: // Elevation Gain
                if (isBitSet(conditionFlag, 5)) {
                    calculateLength += 4;
                }
                break;
            case 6: // Inclination and Ramp Angle Setting
                if (isBitSet(conditionFlag, 6)) {
                    calculateLength += 4;
                }
                break;
            case 7: // Resistance Level
                if (isBitSet(conditionFlag, 7)) {
                    calculateLength += 2;
                }
                break;
            case 8: // Instantaneous Power
                if (isBitSet(conditionFlag, 8)) {
                    calculateLength += 2;
                }
                break;
            case 9: // Average Power
                if (isBitSet(conditionFlag, 9)) {
                    calculateLength += 2;
                }
                break;
            case 10: // Expended Energy
                if (isBitSet(conditionFlag, 10)) {
                    calculateLength += 5;
                }
                break;
            case 11: // Heart Rate
                if (isBitSet(conditionFlag, 11)) {
                    calculateLength += 1;
                }
                break;
            case 12: // Metabolic Equivalent
                if (isBitSet(conditionFlag, 12)) {
                    calculateLength += 1;
                }
                break;
            case 13: // Elapsed Time
                if (isBitSet(conditionFlag, 13)) {
                    calculateLength += 2;
                }
                break;
            case 14: // Remaining Time
                if (isBitSet(conditionFlag, 14)) {
                    calculateLength += 2;
                }
                break;

            default:
                break;
        }
    }

    return dateView.length - calculateLength === 2;
}

/**
 * 解析划船机数据
 * @param data 数据包
 */
/**
 * 解析划船机数据
 * @param data 数据包
 */
function parserDataRower(data) {
    const tempData = new Map();
    const dataView = new Uint8Array(data);
    const flag = (dataView[1] << 8) + dataView[0];
    let dataIndex = 2;

    // 特殊处理第一个标志位
    if ((flag & 0x0001) === 0) {
        tempData.set('strokeRate', {
            value: movIndex(dataView, dataIndex, 1) / 2,
            unit: 'stroke/m',
            name: '划桨频率'
        }); // 单位 stroke/m
        dataIndex += 1;
        tempData.set('strokeCount', {
            value: movIndex(dataView, dataIndex, 2),
            unit: 'Unitless',
            name: '划桨次数'
        }); // 单位 Unitless
        dataIndex += 2;
    }

    // 处理其他标志位
    for (let i = 0; i < 16; i++) {
        const flagBit = 0x0001 << i;
        if ((flag & flagBit) === flagBit) {
            switch (i) {
                case 1: // Average Speed
                    tempData.set('averageStrokeRate', {
                        value: movIndex(dataView, dataIndex, 1) / 2,
                        unit: 'stroke/m',
                        name: '平均划桨频率'
                    }); // 单位 stroke/m
                    dataIndex += 1;
                    break;
                case 2: // Total Distance
                    tempData.set('totalDistance', {
                        value: movIndex(dataView, dataIndex, 3) / 1000,
                        unit: 'km',
                        name: '总距离'
                    }); // 单位 Km
                    dataIndex += 3;
                    break;
                case 3: // Instantaneous Pace
                    let instantaneousPace = movIndex(dataView, dataIndex, 2)
                    if (instantaneousPace === 0) {
                        tempData.set('instantaneousPace', {
                            value: 0,
                            unit: 's/km',
                            name: '即时配速'
                        })
                        tempData.set('instantaneousSpeed', {
                            value: 0,
                            unit: 'km/h',
                            name: '即时速度'
                        })
                    } else {
                        tempData.set('instantaneousPace', {
                            value: instantaneousPace * 2,
                            unit: 's/km',
                            name: '即时配速'
                        }) // 配速 s/Km 多少秒1km
                        tempData.set('instantaneousSpeed', {
                            value: ((500 / instantaneousPace) * 3.6).toFixed(2) * 1,
                            unit: 'km/h',
                            name: '即时速度'
                        }) // 单位 Km/H
                    }
                    dataIndex += 2;
                    break;
                case 4: // Average Pace
                    let averagePaceOrigin = movIndex(dataView, dataIndex, 2)
                    if (averagePaceOrigin === 0) {
                        tempData.set('averagePace', {
                            value: 0,
                            unit: 's/km',
                            name: '平均配速'
                        })
                        tempData.set('averageSpeed', {
                            value: 0,
                            unit: 'km/h',
                            name: '平均速度'
                        })
                    } else {
                        tempData.set('averagePace', {
                            value: averagePaceOrigin * 2,
                            unit: 's/km',
                            name: '平均配速'
                        }) // 配速 s/Km 多少秒1km
                        tempData.set('averageSpeed', {
                            value: ((500 / averagePaceOrigin) * 3.6).toFixed(2) * 1,
                            unit: 'km/h',
                            name: '平均速度'
                        }) // 单位 Km/H
                    }
                    dataIndex += 2;
                    break;
                case 5: // Instantaneous Power
                    tempData.set('instantaneousPower', {
                        value: movIndex(dataView, dataIndex, 2),
                        unit: 'watt',
                        name: '即时功率'
                    }); // watt
                    dataIndex += 2;
                    break;
                case 6: // Average Power
                    tempData.set('averagePower', {
                        value: movIndex(dataView, dataIndex, 2),
                        unit: 'watt',
                        name: '平均功率'
                    }); // watt
                    dataIndex += 2;
                    break;
                case 7: // Resistance Level
                    tempData.set('resistanceLevel', {
                        value: movIndex(dataView, dataIndex, 2),
                        unit: 'Unitless',
                        name: '阻力等级'
                    }); // Unitless
                    dataIndex += 2;
                    break;
                case 8: // Expended Energy
                    tempData.set('totalEnergy', {
                        value: movIndex(dataView, dataIndex, 2),
                        unit: 'kcal',
                        name: '总能量消耗'
                    }); // kcal
                    dataIndex += 2;
                    tempData.set('energyPerHour', {
                        value: movIndex(dataView, dataIndex, 2),
                        unit: 'kcal',
                        name: '每小时能量消耗'
                    }); // kcal
                    dataIndex += 2;
                    tempData.set('energyPerMinute', {
                        value: movIndex(dataView, dataIndex, 1),
                        unit: 'kcal',
                        name: '每分钟能量消耗'
                    }); // kcal
                    dataIndex += 1;
                    break;
                case 9: // Heart Rate
                    tempData.set('heartRate', {
                        value: movIndex(dataView, dataIndex, 1),
                        unit: 'Beats/m',
                        name: '心率'
                    }); // Beats/m
                    dataIndex += 1;
                    break;
                case 10: // Metabolic Equivalent
                    tempData.set('metabolicEquivalent', {
                        value: movIndex(dataView, dataIndex, 1) / 10,
                        unit: 'meta',
                        name: '代谢当量'
                    }); // meta
                    dataIndex += 1;
                    break;
                case 11: // Elapsed Time
                    tempData.set('elapsedTime', {
                        value: movIndex(dataView, dataIndex, 2),
                        unit: 'second',
                        name: '已用时间'
                    }); // second
                    dataIndex += 2;
                    break;
                case 12: // Remaining Time
                    tempData.set('remainingTime', {
                        value: movIndex(dataView, dataIndex, 2),
                        unit: 'second',
                        name: '剩余时间'
                    }); // second
                    dataIndex += 2;
                    break;
            }
        }
    }
    return Object.fromEntries(tempData)
}


/**
 * 解析室内自行车数据
 * @param data 数据包
 */
/**
 * 解析室内自行车数据
 * @param data 数据包
 */
function parserDataIndoorBike(data) {
    const tempData = new Map();
    const dataView = new Uint8Array(data);
    const flag = (dataView[1] << 8) + dataView[0];
    let dataIndex = 2;

    // 特殊处理第一个标志位
    if ((flag & 0x0001) === 0) {
        tempData.set('instantaneousSpeed', {
            value: movIndex(dataView, dataIndex, 2) / 100,
            unit: 'km/h',
            name: '即时速度'
        }); // km/h
        dataIndex += 2;
    }

    // 处理其他标志位
    for (let i = 0; i < 16; i++) {
        const flagBit = 0x0001 << i;
        if ((flag & flagBit) === flagBit) {
            switch (i) {
                case 1: // Average Speed
                    tempData.set('averageSpeed', {
                        value: movIndex(dataView, dataIndex, 2) / 100,
                        unit: 'km/h',
                        name: '平均速度'
                    }); // km/h
                    dataIndex += 2;
                    break;
                case 2: // Instantaneous Cadence
                    tempData.set('instantaneousCadence', {
                        value: movIndex(dataView, dataIndex, 2) / 2,
                        unit: 'rpm',
                        name: '即时踏频'
                    }); // rpm 踏频 一分钟多少次
                    dataIndex += 2;
                    break;
                case 3: // Average Cadence
                    tempData.set('averageCadence', {
                        value: movIndex(dataView, dataIndex, 2),
                        unit: 'rpm',
                        name: '平均踏频'
                    }); // rpm 踏频 一分钟多少次
                    dataIndex += 2;
                    break;
                case 4: // Total Distance
                    tempData.set('totalDistance', {
                        value: movIndex(dataView, dataIndex, 3) / 1000,
                        unit: 'km',
                        name: '总距离'
                    }); // 单位Km
                    dataIndex += 3;
                    break;
                case 5: // Resistance Level
                    tempData.set('resistanceLevel', {
                        value: movIndex(dataView, dataIndex, 2),
                        unit: 'unitless',
                        name: '阻力等级'
                    }); // unitless
                    dataIndex += 2;
                    break;
                case 6: // Instantaneous Power
                    tempData.set('instantaneousPower', {
                        value: movIndex(dataView, dataIndex, 2),
                        unit: 'watt',
                        name: '即时功率'
                    }); // watt
                    dataIndex += 2;
                    break;
                case 7: // Average Power
                    tempData.set('averagePower', {
                        value: movIndex(dataView, dataIndex, 2),
                        unit: 'watt',
                        name: '平均功率'
                    }); // watt
                    dataIndex += 2;
                    break;
                case 8: // Expended Energy
                    tempData.set('totalEnergy', {
                        value: movIndex(dataView, dataIndex, 2),
                        unit: 'kcal',
                        name: '总能量消耗'
                    }); // kcal
                    dataIndex += 2;
                    tempData.set('energyPerHour', {
                        value: movIndex(dataView, dataIndex, 2),
                        unit: 'kcal',
                        name: '每小时能量消耗'
                    }); // kcal
                    dataIndex += 2;
                    tempData.set('energyPerMinute', {
                        value: movIndex(dataView, dataIndex, 1),
                        unit: 'kcal',
                        name: '每分钟能量消耗'
                    }); // kcal
                    dataIndex += 1;
                    break;
                case 9: // Heart Rate
                    tempData.set('heartRate', {
                        value: movIndex(dataView, dataIndex, 1),
                        unit: 'Beats/m',
                        name: '心率'
                    }); // Beats/m
                    dataIndex += 1;
                    break;
                case 10: // Metabolic Equivalent
                    tempData.set('metabolicEquivalent', {
                        value: movIndex(dataView, dataIndex, 1) / 10,
                        unit: 'meta',
                        name: '代谢当量'
                    }); // meta
                    dataIndex += 1;
                    break;
                case 11: // Elapsed Time
                    tempData.set('elapsedTime', {
                        value: movIndex(dataView, dataIndex, 2),
                        unit: 'second',
                        name: '已用时间'
                    }); // second
                    dataIndex += 2;
                    break;
                case 12: // Remaining Time
                    tempData.set('remainingTime', {
                        value: movIndex(dataView, dataIndex, 2),
                        unit: 'second',
                        name: '剩余时间'
                    }); // second
                    dataIndex += 2;
                    break;
            }
        }
    }
    return Object.fromEntries(tempData)
}


/**
 * 解析健身设备状态
 * @param {ArrayBuffer} data - 设备状态数据
 * @returns {Object} 解析后的状态信息
 */
function parseFitnessMachineStatus(data) {
    const dataView = new Uint8Array(data);
    const opCode = dataView[0];

    const status = {
        definition: null,
        parameter: null,
        mean: null
    };

    switch (opCode) {
        case 0x00:
            status.definition = {en: 'RFU', zh: '预留字段'};
            status.parameter = 'N/A';
            break;
        case 0x01:
            status.definition = {en: 'Reset', zh: '重置'};
            status.parameter = 'N/A';
            break;
        case 0x02:
            status.definition = {en: 'Fitness Machine Stopped or Paused by the User', zh: '用户停止或暂停健身机'};
            status.parameter = dataView[1];
            status.mean = dataView[1] === 0x01 ? {en: 'stop', zh: '停止'} : {en: 'pause', zh: '暂停'};
            break;
        case 0x03:
            status.definition = {en: 'Fitness Machine Stopped by Safety Key', zh: '安全钥匙停止健身机'};
            status.parameter = 'N/A';
            break;
        case 0x04:
            status.definition = {en: 'Fitness Machine Started or Resumed by the User', zh: '用户启动或恢复健身机'};
            status.parameter = 'N/A';
            break;
        case 0x05:
            status.definition = {en: 'Target Speed Changed', zh: '目标速度已更改'};
            status.parameter = movIndex(dataView, 1, 2);
            break;
        case 0x06:
            status.definition = {en: 'Target Incline Changed', zh: '目标坡度已更改'};
            status.parameter = movIndex(dataView, 1, 2);
            break;
        case 0x07:
            status.definition = {en: 'Target Resistance Level Changed', zh: '目标阻力等级已更改'};
            status.parameter = movIndex(dataView, 1, 1);
            break;
    }

    return status;
}


/**
 * 解析设备状态数据
 * @param {ArrayBuffer} arrayBuffer - 设备状态数据
 * @returns {Object} 解析后的状态信息
 */

function parseTrainingStatus(arrayBuffer) {

    const dataView = new Uint8Array(arrayBuffer);

    const flag = dataView[0];
    const statusInfo = {};

    // 解析状态类型（Bits 1-7）
    const trainingStatusCode = dataView[1];
    const trainingStatusMap = {
        0x00: {en: 'Other', zh: '其他'},
        0x01: {en: 'Idle', zh: '空闲'},
        0x02: {en: 'Warming Up', zh: '热身'},
        0x03: {en: 'Low Intensity Interval', zh: '低强度间歇'},
        0x04: {en: 'High Intensity Interval', zh: '高强度间歇'},
        0x05: {en: 'Recovery Interval', zh: '恢复间歇'},
        0x06: {en: 'Isometric', zh: '等长运动'},
        0x07: {en: 'Heart Rate Control', zh: '心率控制'},
        0x08: {en: 'Fitness Test', zh: '体能测试'},
        0x09: {en: 'Speed Outside Control Region - Low', zh: '速度超出控制区域 - 过低'},
        0x0A: {en: 'Speed Outside Control Region - High', zh: '速度超出控制区域 - 过高'},
        0x0B: {en: 'Cool Down', zh: '放松'},
        0x0C: {en: 'Watt Control', zh: '瓦特控制'},
        0x0D: {en: 'Manual Mode (Quick Start)', zh: '手动模式（快速启动）'},
        0x0E: {en: 'Pre-Workout', zh: '运动前'},
        0x0F: {en: 'Post-Workout', zh: '运动后'},
    };
    statusInfo.trainingStatus = trainingStatusMap[trainingStatusCode] || {en: 'Unknown', zh: '未知'};

    // 解析状态字符串（如果存在）
    if (isBitSet(flag, 1)) {
        const stringBytes = new Uint8Array(arrayBuffer, 1); // 跳过 flag 字节
        statusInfo.statusString = new TextDecoder().decode(stringBytes);
    }

    return statusInfo;
}


/**
 * 解析设备信息和能力
 * @param {ArrayBuffer} arrayBuffer - 设备信息数据
 * @returns {Object} 解析后的设备信息
 */
/**
 * 解析设备信息和能力
 * @param {ArrayBuffer} arrayBuffer - 设备信息数据
 * @returns {Object} 解析后的设备信息
 */
function parseFitnessMachineFeature(arrayBuffer) {
    const dataView = new Uint8Array(arrayBuffer);

    const information = {
        fitnessMachineFeatures: [], // 健身机特点
        targetSettingFeatures: [] // 目标设置特性
    };

    // 解析特性标志位（4字节）
    const fitnessMachineFeaturesTag = (dataView[3] << 24) + (dataView[2] << 16) + (dataView[1] << 8) + dataView[0];
    const targetSettingFeaturesTag = (dataView[7] << 24) + (dataView[6] << 16) + (dataView[5] << 8) + dataView[4];

    // 健身机特点映射
    const machineFeatures = {
        0: {en: 'Average Speed Supported', zh: '支持平均速度'},
        1: {en: 'Cadence Supported', zh: '支持踏频'},
        2: {en: 'Total Distance Supported', zh: '支持总距离'},
        3: {en: 'Inclination Supported', zh: '支持坡度'},
        4: {en: 'Elevation Gain Supported', zh: '支持海拔增益'},
        5: {en: 'Pace Supported', zh: '支持步速'},
        6: {en: 'Step Count Supported', zh: '支持步数统计'},
        7: {en: 'Resistance Level Supported', zh: '支持阻力等级'},
        8: {en: 'Stride Count Supported', zh: '支持步幅计数'},
        9: {en: 'Expended Energy Supported', zh: '支持消耗能量'},
        10: {en: 'Heart Rate Measurement Supported', zh: '支持心率测量'},
        11: {en: 'Metabolic Equivalent Supported', zh: '支持代谢当量'},
        12: {en: 'Elapsed Time Supported', zh: '支持已用时间'},
        13: {en: 'Remaining Time Supported', zh: '支持剩余时间'},
        14: {en: 'Power Measurement Supported', zh: '支持功率测量'},
        15: {en: 'Force on Belt and Power Output Supported', zh: '支持传送带上的力和功率输出'},
        16: {en: 'User Data Retention Supported', zh: '支持用户数据保留'}
    };

    // 目标设置特性映射
    const targetFeatures = {
        0: {en: 'Speed Target Setting Supported', zh: '支持速度目标设置'},
        1: {en: 'Inclination Target Setting Supported', zh: '支持坡度目标设置'},
        2: {en: 'Resistance Target Setting Supported', zh: '支持阻力目标设置'},
        3: {en: 'Power Target Setting Supported', zh: '支持功率目标设置'},
        4: {en: 'Heart Rate Target Setting Supported', zh: '支持心率目标设置'},
        5: {en: 'Targeted Expended Energy Configuration Supported', zh: '支持目标消耗能量配置'},
        6: {en: 'Targeted Step Number Configuration Supported', zh: '支持目标步数配置'},
        7: {en: 'Targeted Stride Number Configuration Supported', zh: '支持目标步幅数配置'},
        8: {en: 'Targeted Distance Configuration Supported', zh: '支持目标距离配置'},
        9: {en: 'Targeted Training Time Configuration Supported', zh: '支持目标训练时间配置'},
        10: {en: 'Targeted Time in Two Heart Rate Zones Configuration Supported', zh: '支持两个心率区域的时间目标配置'},
        11: {
            en: 'Targeted Time in Three Heart Rate Zones Configuration Supported',
            zh: '支持三个心率区域的时间目标配置'
        },
        12: {
            en: 'Targeted Time in Five Heart Rate Zones Configuration Supported',
            zh: '支持五个心率区域的时间目标配置'
        },
        13: {en: 'Indoor Bike Simulation Parameters Supported', zh: '支持室内自行车模拟参数'},
        14: {en: 'Wheel Circumference Configuration Supported', zh: '支持车轮周长配置'},
        15: {en: 'Spin Down Control Supported', zh: '支持减速控制'}
    };

    // 解析健身机特点
    for (let i = 0; i <= 31; i++) {
        if (isBitSet(fitnessMachineFeaturesTag, i) && machineFeatures[i]) {
            information.fitnessMachineFeatures.push(machineFeatures[i]);
        }
    }

    // 解析目标设置特性
    for (let i = 0; i <= 31; i++) {
        if (isBitSet(targetSettingFeaturesTag, i) && targetFeatures[i]) {
            information.targetSettingFeatures.push(targetFeatures[i]);
        }
    }

    return information;
}


/**
 * 解析支持的阻力范围
 * @param {ArrayBuffer} arrayBuffer - 阻力范围数据
 * @returns {Object} 解析后的阻力范围信息
 */
function parseSupportedResistanceRange(arrayBuffer) {

    let dataView = new Uint8Array(arrayBuffer);
    return {
        minimumResistance: movIndex(dataView, 0, 2) / 10,
        maximumResistance: movIndex(dataView, 2, 2) / 10,
        minimumIncrement: movIndex(dataView, 4, 2) / 10,
        unit: 'unitless'
    };

}

function parseSupportedSpeedRange(arrayBuffer) {
    const dataView = new DataView(arrayBuffer);
    return {
        minimumSpeed: dataView.getUint16(0, true) / 100,       // 最小支持速度 (km/h)
        maximumSpeed: dataView.getUint16(2, true) / 100,       // 最大支持速度 (km/h)
        minimumIncrement: dataView.getUint16(4, true) / 100,   // 最小可设置的速度增量 (km/h)
        unit: 'km/h'        // 单位固定为千米每小时
    };
}

/**
 * 解析支持的功率范围
 * @param {ArrayBuffer} data - 功率范围数据
 * @returns {Object} 解析后的功率范围信息
 */
function parseSupportedPowerRange(data) {
    let dataView = new Uint8Array(data);
    return {
        minimumPower: movIndex(dataView, 0, 2),
        maximumPower: movIndex(dataView, 2, 2),
        minimumIncrement: movIndex(dataView, 4, 2),
        unit: 'Watt'
    };
}

/**
 * 解析支持的心率范围
 * @param {ArrayBuffer} data - 心率范围数据
 * @returns {Object} 解析后的心率范围信息
 */
function parseSupportedHeartRateRange(data) {
    const dataView = new Uint8Array(data);
    return {
        minimumHeartRate: movIndex(dataView, 0, 2),
        maximumHeartRate: movIndex(dataView, 2, 2),
        minimumIncrement: movIndex(dataView, 4, 2),
        unit: 'Beats/m'
    };
}

/**
 * 解析 Fitness Machine Control Point 响应数据包
 * @param {ArrayBuffer} arrayBuffer - 原始数据（长度可变）
 * @returns {Object} 解析后的控制点响应信息
 */
function parseFitnessMachineControlPointResponse(arrayBuffer) {
    const dataView = new DataView(arrayBuffer);
    const opCode = dataView.getUint8(0); // 第一个字节为Op Code

    // 0x80 是规范定义的响应码（固定值）
    if (opCode !== 0x80) {
        throw new Error(`Invalid response Op Code: expected 0x80, got ${opCode.toString(16)}`);
    }

    const requestOpCode = dataView.getUint8(1); // 第二个字节为请求的Op Code
    const resultCode = dataView.getUint8(2);    // 第三个字节为结果码
    const response = {
        opCode: opCode.toString(16).padStart(2, '0'), // 固定为0x80
        requestOpCode: requestOpCode.toString(16).padStart(2, '0'),
        resultCode: resultCode,
        resultDescription: getResultDescription(resultCode), // 结果码转文本
        parameters: null // 附加参数（根据请求类型动态解析）
    };

    // 解析附加参数（根据请求的Op Code决定格式）
    if (arrayBuffer.byteLength > 3) {
        response.parameters = parseResponseParameters(requestOpCode, dataView, 3);
    }

    return response;
}

// 结果码转文本描述
// 结果码转文本描述
function getResultDescription(resultCode) {
    const descriptions = {
        0x01: {en: 'Success', zh: '成功'},
        0x02: {en: 'Op Code Not Supported', zh: '不支持的操作码'},
        0x03: {en: 'Invalid Parameter', zh: '无效参数'},
        0x04: {en: 'Operation Failed', zh: '操作失败'},
        0x05: {en: 'Control Not Permitted', zh: '控制不被允许'},
        0x06: {en: 'Procedure Already in Progress', zh: '过程已在进行中'}
    };
    return descriptions[resultCode] || {
        en: `Unknown Error (0x${resultCode.toString(16)})`,
        zh: `未知错误 (0x${resultCode.toString(16)})`
    };
}


// 解析附加参数（根据请求的Op Code）
function parseResponseParameters(requestOpCode, dataView, offset) {
    switch (requestOpCode) {
        case 0x02: // Set Target Speed
            return {
                targetSpeed: dataView.getUint16(offset, true) / 100, // 单位：km/h
                unit: 'km/h'
            };
        case 0x03: // Set Target Inclination
            return {
                targetInclination: dataView.getInt16(offset, true) / 10, // 单位：%
                unit: '%'
            };
        case 0x04: // Set Target Resistance Level
            return {
                targetResistance: dataView.getUint8(offset) / 10, // 单位：无
                unit: 'unitless'
            };
        case 0x13: // Spin Down Control
            return {
                targetSpeedLow: dataView.getUint16(offset, true) / 100,     // 单位：km/h
                targetSpeedHigh: dataView.getUint16(offset + 2, true) / 100, // 单位：km/h
                unit: 'km/h'
            };
        // 其他Op Code的响应参数格式可在此扩展
        default:
            return null; // 无附加参数
    }
}

/**
 * 判断二进制数的指定位置是否为1
 * @param {number} binaryNumber - 要检查的二进制数
 * @param {number} location - 要检查的位置
 * @returns {boolean} 如果指定位置为1则返回true，否则返回false
 */
function isBitSet(binaryNumber, location) {
    return (binaryNumber & (1 << location)) !== 0;
}

export default {
    parserDataPacket,
}