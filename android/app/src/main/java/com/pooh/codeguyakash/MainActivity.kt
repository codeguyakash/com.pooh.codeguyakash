package com.pooh.codeguyakash

import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    // Runtime permissions are Activity-scoped — request them here.
    if (!PermissionHelper.hasAllPermissions(this)) {
      PermissionHelper.requestAllPermissions(this)
    }

    // Bootstrap channel once; then push a sample notification (optional).
    NotificationHelper.ensureChannel(this)
    NotificationHelper.showSample(this) // remove if you don’t want auto-fire on launch
  }

  /** Name of the main RN component. */
  override fun getMainComponentName(): String = "pooh.codeguyakash"

  /** Keep RN new-arch wiring as-is. */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
    DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
