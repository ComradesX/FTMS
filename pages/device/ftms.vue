<template>
  <view class="content">
    <!--    <view class="noticeInfoBox">-->
    <scroll-view class="noticeInfoBox" scroll-y="true"
    >

      <view class="deviceInfo">
        <view class="section-title">
          <text>设备信息</text>
          <button class="default-button" @click="readDeviceInfo">读取</button>
        </view>
        <view v-if="pageDeviceInfo && Object.keys(pageDeviceInfo).length > 0">
          <view>制造商: {{ pageDeviceInfo.manufacturerNameString }}</view>
          <view>型号: {{ pageDeviceInfo.modelNumberString }}</view>
          <view>序列号: {{ pageDeviceInfo.serialNumberString }}</view>
          <view>硬件版本: {{ pageDeviceInfo.hardwareRevisionString }}</view>
          <view>固件版本: {{ pageDeviceInfo.firmwareRevisionString }}</view>
          <view>软件版本: {{ pageDeviceInfo.softwareRevisionString }}</view>
          <view>系统ID: {{ pageDeviceInfo.systemID }}</view>
        </view>
        <view v-else>暂无设备信息</view>
      </view>
      <view class="fitnessMachineFeatureInfo">
        <view class="section-title">
          <text>设备功能特性</text>
          <button class="default-button" @click="readFitnessMachineFeature">读取</button>
        </view>
        <view
            v-if="fitnessMachineFeatureInfo.fitnessMachineFeatures && fitnessMachineFeatureInfo.fitnessMachineFeatures.length > 0">
          <view class="subtitle">健身机器功能:</view>
          <view
              v-for="(feature, index) in fitnessMachineFeatureInfo.fitnessMachineFeatures"
              :key="index"
              class="feature-item"
          >
            {{ feature.en }} | {{ feature.zh }}
          </view>
        </view>

        <view
            v-if="fitnessMachineFeatureInfo.targetSettingFeatures && fitnessMachineFeatureInfo.targetSettingFeatures.length > 0">
          <view class="subtitle">目标设置功能:</view>
          <view
              v-for="(feature, index) in fitnessMachineFeatureInfo.targetSettingFeatures"
              :key="index"
              class="feature-item"
          >
            {{ feature.en }} | {{ feature.zh }}
          </view>
        </view>

        <view
            v-if="!fitnessMachineFeatureInfo.fitnessMachineFeatures && !fitnessMachineFeatureInfo.targetSettingFeatures">
          暂无功能特性信息
        </view>
      </view>

      <view class="supportedSpeedRangeInfo">
        <view class="section-title">
          <text>速度范围</text>
          <button class="default-button" @click="readSupportedSpeedRange">读取</button>
        </view>
        <view v-if="supportedSpeedRangeInfo && Object.keys(supportedSpeedRangeInfo).length > 0">
          <view>最小速度: {{ supportedSpeedRangeInfo.minimumSpeed }} {{ supportedSpeedRangeInfo.unit }}</view>
          <view>最大速度: {{ supportedSpeedRangeInfo.maximumSpeed }} {{ supportedSpeedRangeInfo.unit }}</view>
          <view>最小增量: {{ supportedSpeedRangeInfo.minimumIncrement }} {{ supportedSpeedRangeInfo.unit }}</view>
        </view>
        <view v-else>暂无速度范围信息</view>
      </view>

      <view class="supportedHeartRateRangeInfo">
        <view class="section-title">
          <text>心率范围</text>
          <button class="default-button" @click="readSupportedHeartRateRange">读取</button>
        </view>
        <view v-if="supportedHeartRateRangeInfo && Object.keys(supportedHeartRateRangeInfo).length > 0">
          <view>最小心率: {{ supportedHeartRateRangeInfo.minimumHeartRate }} {{
              supportedHeartRateRangeInfo.unit
            }}
          </view>
          <view>最大心率: {{ supportedHeartRateRangeInfo.maximumHeartRate }} {{
              supportedHeartRateRangeInfo.unit
            }}
          </view>
          <view>最小增量: {{ supportedHeartRateRangeInfo.minimumIncrement }} {{
              supportedHeartRateRangeInfo.unit
            }}
          </view>
        </view>
        <view v-else>暂无心率范围信息</view>
      </view>

      <view class="supportedInclinationRangeInfo">
        <view class="section-title">
          <text>坡度范围</text>
          <button class="default-button" @click="readSupportedInclinationRange">读取</button>
        </view>
        <view v-if="supportedInclinationRangeInfo && Object.keys(supportedInclinationRangeInfo).length > 0">
          <view>最小坡度: {{ supportedInclinationRangeInfo.minimumInclination }} {{
              supportedInclinationRangeInfo.unit
            }}
          </view>
          <view>最大坡度: {{ supportedInclinationRangeInfo.maximumInclination }} {{
              supportedInclinationRangeInfo.unit
            }}
          </view>
          <view>最小增量: {{ supportedInclinationRangeInfo.minimumIncrement }} {{
              supportedInclinationRangeInfo.unit
            }}
          </view>
        </view>
        <view v-else>暂无坡度范围信息</view>
      </view>


      <view class="supportedResistanceLevelRangeInfo">
        <view class="section-title">
          <text>阻力等级范围信息</text>
          <button class="default-button" @click="readSupportedResistanceLevelRange">读取</button>
        </view>
        <view v-if="supportedResistanceLevelRangeInfo && Object.keys(supportedResistanceLevelRangeInfo).length > 0">
          <view>最小阻力: {{ supportedResistanceLevelRangeInfo.minimumResistance }} {{
              supportedResistanceLevelRangeInfo.unit
            }}
          </view>
          <view>最大阻力: {{ supportedResistanceLevelRangeInfo.maximumResistance }} {{
              supportedResistanceLevelRangeInfo.unit
            }}
          </view>
          <view>最小增量: {{ supportedResistanceLevelRangeInfo.minimumIncrement }} {{
              supportedResistanceLevelRangeInfo.unit
            }}
          </view>
        </view>
        <view v-else>暂无阻力范围信息</view>
      </view>


      <view class="supportedPowerRangeInfo">
        <view class="section-title">
          <text>能量范围信息</text>
          <button class="default-button" @click="readSupportedPowerRange">读取</button>
        </view>
        <view v-if="supportedPowerRangeInfo && Object.keys(supportedPowerRangeInfo).length > 0">
          <view>最小能量: {{ supportedPowerRangeInfo.minimumPower }} {{
              supportedPowerRangeInfo.unit
            }}
          </view>
          <view>最大能量: {{ supportedPowerRangeInfo.maximumPower }} {{
              supportedPowerRangeInfo.unit
            }}
          </view>
          <view>最小增量: {{ supportedPowerRangeInfo.minimumIncrement }} {{
              supportedPowerRangeInfo.unit
            }}
          </view>
        </view>
        <view v-else>暂无能量范围信息</view>
      </view>


      <view class="trainingStatus">

        <view class="section-title">
          <text>训练状态</text>
          <button class="default-button" @click="sendTrainingStatusRequest">读取</button>
        </view>
        <view v-if="trainingStatus && Object.keys(trainingStatus).length > 0">
          <view v-if="trainingStatus.trainingStatus">
            训练状态: {{ trainingStatus.trainingStatus.en }} | {{ trainingStatus.trainingStatus.zh }}
          </view>
          <view v-if="trainingStatus.statusString">
            状态字符串: {{ trainingStatus.statusString }}
          </view>
        </view>
        <view v-else>
          暂无训练状态信息
        </view>
      </view>

      <view class="fitnessMachineStatus">
        <view class="section-title">健身机状态</view>
        <view v-if="fitnessMachineStatus && Object.keys(fitnessMachineStatus).length > 0">
          <view v-if="fitnessMachineStatus.definition">
            状态定义: {{ fitnessMachineStatus.definition.en }} | {{ fitnessMachineStatus.definition.zh }}
          </view>
          <view v-if="fitnessMachineStatus.parameter !== undefined && fitnessMachineStatus.parameter !== null">
            参数值: {{ fitnessMachineStatus.parameter }}
          </view>
          <view v-if="fitnessMachineStatus.mean">
            含义: {{ fitnessMachineStatus.mean }}
          </view>
        </view>
        <view v-else>
          暂无健身机状态信息
        </view>
      </view>

      <view class="sportData">
        <view class="section-title">运动数据信息</view>
        <view v-if="sportData && Object.keys(sportData).length > 0">
          <view v-for="(value, key) in sportData" :key="key">
            {{ key }} | {{ value.name }}: {{ value.value }} {{ value.unit }}
          </view>
        </view>
        <view v-else>
          暂无运动数据信息
        </view>
      </view>

    </scroll-view>
    <!--  </view>-->

    <view class="controllerBox">
      <view class="speedController">
        <button class="subButton" @click="subController('speed')">-</button>
        <text class="testController">目标速度控制 {{ currentSpeed }}</text>
        <button class="addButton" @click="addController('speed')">+</button>
      </view>

      <view class="inclinationController">
        <button class="subButton" @click="subController('inclination')">-</button>
        <text class="testController">目标坡度控制 {{ currentInclination }}</text>
        <button class="addButton" @click="addController('inclination')">+</button>
      </view>

      <view class="resistanceLevelController">
        <button class="subButton" @click="subController('resistanceLevel')">-</button>
        <text class="testController">目标阻力控制 {{ currentResistanceLevel }}</text>
        <button class="addButton" @click="addController('resistanceLevel')">+</button>
      </view>


      <view class="powerController">
        <button class="subButton" @click="subController('power')">-</button>
        <text class="testController">目标能量控制 {{ currentPower }}</text>
        <button class="addButton" @click="addController('power')">+</button>
      </view>

      <view class="otherController">
        <button class="stop" @click="stopDevice()">停止</button>
        <button class="pause" @click="pauseDevice()">暂停</button>
        <button class="startOrResume" @click="startOrResumeDevice()">开始</button>
        <button class="reset" @click="resetDevice()">重置</button>
      </view>

    </view>

  </view>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
import ftms from '@/utils/ftms/ftms.js'

export default {
  computed: {
    ...mapState(['linkedDevice', 'sportDataList', 'controllerResponse'])
  },
  data() {
    return {
      fitnessMachineFeatureInfo: {},
      supportedSpeedRangeInfo: {},
      supportedHeartRateRangeInfo: {},
      supportedInclinationRangeInfo: {},
      supportedResistanceLevelRangeInfo: {},
      supportedPowerRangeInfo: {},
      trainingStatus: {},
      fitnessMachineStatus: {},
      sportData: {},

      currentSpeed: 1,
      currentInclination: 1,
      currentResistanceLevel: 1,
      currentPower: 1,

      minimumSpeedIncrement: 0.1,
      minimumInclinationIncrement: 0.1,
      minimumResistanceLevelIncrement: 0.1,
      minimumPower: 1,

      pageDeviceInfo: {},

    }
  },
  watch: {
    linkedDevice: {
      handler(newVal) {
        this.extractDeviceInfo(newVal)
      },
      immediate: true // 立即执行
    },
    sportDataList: {
      handler(newVal) {
        this.sportData = newVal.length > 0 ? newVal[newVal.length - 1] : {}
      },
      immediate: true // 立即执行
    },
    controllerResponse: {
      handler(newVal) {
        console.log('controllerResponse', newVal)
        if (newVal && newVal.resultDescription) {

          // 使用模态框显示结果描述的中文信息
          // uni.showModal({
          //   title: '控制结果',
          //   content: newVal.resultDescription.zh || newVal.resultDescription.en,
          // })

          uni.showToast({
            title: newVal.resultDescription.zh || newVal.resultDescription.en,
            icon: 'none',
            duration: 1000
          })
        }
      },
      immediate: true // 立即执行
    }
  },
  onLoad() {
    console.log('onLoad')

  },
  onShow() {

  },
  methods: {
    extractDeviceInfo(device) {
      this.fitnessMachineFeatureInfo = device.fitnessMachineFeature || {}
      this.supportedSpeedRangeInfo = device.supportedSpeedRange || {}
      this.supportedHeartRateRangeInfo = device.supportedHeartRateRange || {}
      this.supportedInclinationRangeInfo = device.supportedInclinationRange || {}
      this.trainingStatus = device.trainingStatus || {}
      this.fitnessMachineStatus = device.fitnessMachineStatus || {}
      this.supportedPowerRangeInfo = device.supportedPowerRange || {}
      this.supportedResistanceLevelRangeInfo = device.supportedResistanceLevelRange || {}

      this.currentSpeed = device.supportedSpeedRange?.minimumSpeed || 1;
      this.currentInclination = device.supportedInclinationRange?.minimumInclination || 1;
      this.currentResistanceLevel = device.supportedResistanceLevelRange?.minimumResistance || 1;

      this.minimumSpeedIncrement = device.supportedSpeedRange?.minimumIncrement || 0.1;
      this.minimumInclinationIncrement = device.supportedInclinationRange?.minimumIncrement || 0.1;
      this.minimumResistanceLevelIncrement = device.supportedResistanceLevelRange?.minimumIncrement || 0.1;

      this.pageDeviceInfo = device.deviceInfo;

      console.log('deviceInfo', this.pageDeviceInfo)
    },
    async readDeviceInfo() {
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
    },
    readFitnessMachineFeature() {
      // 读取设备功能特性信息
      console.log("读取设备功能特性信息");
      ftms.setMCUCommand.sendFitnessMachineFeatureRequest(this.linkedDevice)
    },
    readSupportedSpeedRange() {
      // 读取速度范围信息
      console.log("读取速度范围信息");

      ftms.setMCUCommand.sendSupportedSpeedRangeRequest(this.linkedDevice)
    },
    readSupportedHeartRateRange() {
      // 读取心率范围信息
      console.log("读取心率范围信息");

      ftms.setMCUCommand.sendSupportedHeartRateRangeRequest(this.linkedDevice)
    },
    readSupportedInclinationRange() {
      // 读取坡度范围信息
      console.log("读取坡度范围信息");
      ftms.setMCUCommand.sendSupportedInclinationRangeRequest(this.linkedDevice)
    },
    readSupportedResistanceLevelRange() {
      // 读取阻力等级范围信息
      console.log("读取阻力等级范围信息");
      ftms.setMCUCommand.sendSupportedResistanceLevelRangeRequest(this.linkedDevice)
    },
    readSupportedPowerRange() {
      // 读取能量范围信息
      console.log("读取能量范围信息");
      ftms.setMCUCommand.sendSupportedPowerRangeRequest(this.linkedDevice)
    },
    sendTrainingStatusRequest() {
      console.log("读取运行状态");
      ftms.setMCUCommand.sendTrainingStatusRequest(this.linkedDevice)
    },
    subController(type) {
      switch (type) {
        case 'speed':
          this.currentSpeed = this.currentSpeed - this.minimumSpeedIncrement;
          this.currentSpeed = this.currentSpeed.toFixed(2) * 1
          ftms.setMCUCommand.setSpeed(this.linkedDevice, this.currentSpeed)
          break;

        case 'inclination':
          this.currentInclination = this.currentInclination - this.minimumInclinationIncrement;
          this.currentInclination = this.currentInclination.toFixed(2) * 1
          ftms.setMCUCommand.setInclination(this.linkedDevice, this.currentInclination)
          break;

        case 'resistanceLevel':
          this.currentResistanceLevel = this.currentResistanceLevel - this.minimumResistanceLevelIncrement;
          this.currentResistanceLevel = this.currentResistanceLevel.toFixed(2) * 1
          ftms.setMCUCommand.setResistance(this.linkedDevice, this.currentResistanceLevel)
          break;

        case 'power':
          this.currentPower = this.currentPower - this.minimumPower;
          this.currentPower = this.currentPower.toFixed(2) * 1
          ftms.setMCUCommand.setPower(this.linkedDevice, this.currentInclination)
          break;
        default:
          return null; // 无附加参数
      }
    },

    addController(type) {
      switch (type) {
        case 'speed':
          this.currentSpeed = this.currentSpeed + this.minimumSpeedIncrement;
          this.currentSpeed = this.currentSpeed.toFixed(2) * 1
          ftms.setMCUCommand.setSpeed(this.linkedDevice, this.currentSpeed)
          break;

        case 'inclination':
          this.currentInclination = this.currentInclination + this.minimumInclinationIncrement;
          this.currentInclination = this.currentInclination.toFixed(2) * 1
          ftms.setMCUCommand.setInclination(this.linkedDevice, this.currentInclination)
          break;

        case 'resistanceLevel':
          this.currentResistanceLevel = this.currentResistanceLevel + this.minimumResistanceLevelIncrement;
          this.currentResistanceLevel = this.currentResistanceLevel.toFixed(2) * 1
          ftms.setMCUCommand.setResistance(this.linkedDevice, this.currentResistanceLevel)
          break;

        case 'power':
          this.currentPower = this.currentPower + this.minimumPower;
          this.currentPower = this.currentPower.toFixed(2) * 1
          ftms.setMCUCommand.setPower(this.linkedDevice, this.currentInclination)
          break;
      }
    },
    // 停止设备
    stopDevice() {
      console.log("停止设备");
      // 这里应该添加实际的蓝牙通信代码来发送停止指令
      ftms.setMCUCommand.stopDevice(this.linkedDevice)
    },
    // 暂停设备
    pauseDevice() {
      console.log("暂停设备");
      // 这里应该添加实际的蓝牙通信代码来发送暂停指令
      ftms.setMCUCommand.pauseDevice(this.linkedDevice)
    },
    // 开始/恢复设备
    startOrResumeDevice() {
      console.log("开始/恢复设备");
      // 这里应该添加实际的蓝牙通信代码来发送开始或恢复指令
      ftms.setMCUCommand.startOrResumeDevice(this.linkedDevice)
    },
    // 重置设备
    resetDevice() {
      console.log("重置设备");
      // 这里应该添加实际的蓝牙通信代码来发送重置指令
      ftms.setMCUCommand.resetDevice(this.linkedDevice)
    }
  }
}
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.noticeInfoBox {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 75vh;
  background-color: #999999;
}

.controllerBox {
  width: 100vw;
  background-color: #888888;
  height: 20vh;
  display: flex;
  flex-direction: column;
  margin-bottom: 5vh;
}

.speedController {
  height: 5vh;
  display: flex;
  flex-direction: row;

}

.inclinationController {
  height: 5vh;
  display: flex;
  flex-direction: row;
}


.resistanceLevelController {
  height: 5vh;
  display: flex;
  flex-direction: row;
}

.powerController {
  height: 5vh;
  display: flex;
  flex-direction: row;
}

.otherController {
  height: 5vh;
  display: flex;
  flex-direction: row;
}

.fitnessMachineFeatureInfo {
  padding: 20rpx;
  margin: 20rpx 0;
  border: 1px solid #e0e0e0;
  border-radius: 10rpx;
}

.supportedSpeedRangeInfo {
  padding: 20rpx;
  margin: 20rpx 0;
  border: 1px solid #e0e0e0;
  border-radius: 10rpx;
}

.supportedHeartRateRangeInfo {
  padding: 20rpx;
  margin: 20rpx 0;
  border: 1px solid #e0e0e0;
  border-radius: 10rpx;
}

.supportedInclinationRangeInfo {
  padding: 20rpx;
  margin: 20rpx 0;
  border: 1px solid #e0e0e0;
  border-radius: 10rpx;
}

.supportedResistanceLevelRangeInfo {
  padding: 20rpx;
  margin: 20rpx 0;
  border: 1px solid #e0e0e0;
  border-radius: 10rpx;
}

.supportedPowerRangeInfo {
  padding: 20rpx;
  margin: 20rpx 0;
  border: 1px solid #e0e0e0;
  border-radius: 10rpx;
}

.trainingStatus {
  padding: 20rpx;
  margin: 20rpx 0;
  border: 1px solid #e0e0e0;
  border-radius: 10rpx;
}

.fitnessMachineStatus {
  padding: 20rpx;

  border: 1px solid #e0e0e0;
  border-radius: 10rpx;
}

.sportData {
  padding: 20rpx;
  margin: 20rpx 0;
  border: 1px solid #e0e0e0;
  border-radius: 10rpx;
}

.testController {
  text-align: center;
  height: 5vh;
  line-height: 5vh;
}

.deviceInfo {
  padding: 20rpx;
  margin: 20rpx 0;
  border: 1px solid #e0e0e0;
  border-radius: 10rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
}


.subtitle {
  font-size: 28rpx;
  font-weight: bold;
  margin: 15rpx 0 10rpx 0;
  color: #666;
}

.feature-item {
  font-size: 24rpx;
  padding: 10rpx 0;
  margin-left: 20rpx;
  color: #555;
  border-bottom: 1px dashed #eee;
}

/* 默认按钮样式 */
.default-button {

  background-color: lemonchiffon;
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
  line-height: 24rpx;
  cursor: pointer;
  height: 50rpx;
  width: 100rpx;
}

.feature-item:last-child {
  border-bottom: none;
}
</style>