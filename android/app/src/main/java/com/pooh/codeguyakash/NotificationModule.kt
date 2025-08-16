package com.pooh.codeguyakash

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = NotificationModule.NAME)
class NotificationModule(private val reactContext: ReactApplicationContext)
  : ReactContextBaseJavaModule(reactContext) {

  companion object {
    const val NAME = "NotificationModule"
  }

  override fun getName() = NAME

  @ReactMethod
  fun fire(title: String, message: String) {
    NotificationHelper.ensureChannel(reactContext)
    NotificationHelper.show(reactContext, title, message)
  }
}
