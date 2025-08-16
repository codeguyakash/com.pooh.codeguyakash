package com.pooh.codeguyakash

import android.app.Activity
import android.content.pm.PackageManager
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat

object PermissionHelper {

    // List of all permissions your app may need
    val REQUIRED_PERMISSIONS = arrayOf(
        android.Manifest.permission.CAMERA,
        android.Manifest.permission.READ_EXTERNAL_STORAGE,
        android.Manifest.permission.WRITE_EXTERNAL_STORAGE,
        android.Manifest.permission.ACCESS_FINE_LOCATION,
        android.Manifest.permission.ACCESS_COARSE_LOCATION,
        android.Manifest.permission.RECORD_AUDIO,
        android.Manifest.permission.READ_CONTACTS,
        android.Manifest.permission.WRITE_CONTACTS,
        android.Manifest.permission.READ_CALENDAR,
        android.Manifest.permission.WRITE_CALENDAR,
        android.Manifest.permission.READ_CALL_LOG,
        android.Manifest.permission.WRITE_CALL_LOG,
        android.Manifest.permission.CALL_PHONE,
        android.Manifest.permission.READ_PHONE_STATE,
        android.Manifest.permission.SEND_SMS,
        android.Manifest.permission.RECEIVE_SMS,
        android.Manifest.permission.READ_SMS,
        android.Manifest.permission.NFC,
        android.Manifest.permission.BLUETOOTH,
        android.Manifest.permission.BLUETOOTH_ADMIN
    )

    private const val REQUEST_CODE = 101

    // Function to check if all permissions are granted
    fun hasAllPermissions(activity: Activity): Boolean {
        return REQUIRED_PERMISSIONS.all { permission ->
            ContextCompat.checkSelfPermission(activity, permission) == PackageManager.PERMISSION_GRANTED
        }
    }

    // Function to request all permissions at once
    fun requestAllPermissions(activity: Activity) {
        ActivityCompat.requestPermissions(activity, REQUIRED_PERMISSIONS, REQUEST_CODE)
    }
}