<template>
  <view class="content">


    <scroll-view class="deviceListScroll" scroll-y="true"
                 @scrolltoupper="upper"
                 @scrolltolower="lower" @scroll="scroll">


      <view class="deviceItem" v-for="(device, index) in searchDeviceList" :key="index">
        <view class="deviceItemInfoBox">
          <view class="deviceItemMac">
            {{ device.deviceId || '00:00:00:00:00:00' }}
          </view>
          <view class="deviceItemName">
            {{ device.name || '未知设备' }}
          </view>
        </view>
        <view class="deviceItemDeviceType">
          {{ device.type.name || '未知类型' }}
        </view>
        <button class="deviceItemMacLinkButton" @click="linkDevice(device)">
          连 接
        </button>
      </view>

    </scroll-view>
    <view class="buttenBox">
      <button class="buttonItem" @click="startSearchedDevices()">
        开始搜索
      </button>

    </view>

  </view>
</template>

<script>
import bluetooth from '@/utils/bluetooth.js'
import {mapState, mapMutations} from 'vuex'

export default {
  computed: {
    ...mapState(['searchDeviceList', 'linkedDevice'])
  },

  data() {
    return {
      searchedDevices: [],

    }
  },
  onLoad() {
    console.log('onLoad')

  },
  onShow() {
    uni.getConnectedBluetoothDevices({
      success: async (res) => {
        if (res.devices.length > 0) {
          for (const device of res.devices) {
            await new Promise((resolve) => setTimeout(resolve, 100))
            await uni.closeBLEConnection({
              deviceId: device.deviceId,
              success: (res) => {
                store.commit('clearLinkedDevice')
              }, fail: (err) => {
                console.log('断开连接失败', err)
              },
            })
          }
        }
      },
    })
  },
  methods: {
    scroll() {

      console.log('scroll')
    },
    linkDevice(device) {
      bluetooth.linkDevice(device);
      //在起始页面跳转到test.vue页面并传递参数
      uni.navigateTo({
        url: '/pages/device/ftms'
      });

    },
    startSearchedDevices() {
      bluetooth.searchDevice()
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

.deviceListScroll {
  border-radius: 10rpx;
  width: 100vw;
  height: 90vh;
}

.deviceItem {
  border: 1px solid #999999;
  border-radius: 10rpx;
  height: 100rpx;
  width: 700rpx;
  margin: 10rpx auto;
  display: flex;
  flex-direction: row;
}

.deviceItemInfoBox {
  width: 400rpx;
  height: 100rpx;
}

.deviceItemMac {
  width: 400rpx;
  height: 50rpx;
}

.deviceItemName {
  width: 400rpx;
  height: 50rpx;
}

.deviceItemDeviceType {
  text-align: center;
  line-height: 100rpx;
  width: 200rpx;
  height: 100rpx;

}

.deviceItemMacLinkButton {
  width: 100rpx;
  height: 100rpx;
}

.deviceItemMacLinkButton {
  width: 100rpx;
  height: 100rpx;
  font-size: 20rpx;
  align-items: center;
  line-height: 100rpx
}

.buttenBox {

  height: 10vh;
  width: 100vw;
  border-radius: 10rpx;
  background-color: #999999;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
}

.buttonItem {
  height: 70rpx;
  width: 250rpx;
  font-size: 35rpx;
  line-height: 70rpx;
}


</style>
