package com.pooh.codeguyakash

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.app.ActivityCompat
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat

object NotificationHelper {

    private const val CHANNEL_ID = "app_default_channel"
    private const val CHANNEL_NAME = "General"
    private const val CHANNEL_DESC = "General notifications"
    private const val DEFAULT_NOTIFICATION_ID = 1001

    /** Create channel once (Android 8.0+). Safe to call multiple times. */
    fun ensureChannel(context: Context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val importance = NotificationManager.IMPORTANCE_DEFAULT
            val channel = NotificationChannel(CHANNEL_ID, CHANNEL_NAME, importance).apply {
                description = CHANNEL_DESC
            }
            val nm = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            nm.createNotificationChannel(channel)
        }
    }

    /**
     * Show a notification.
     * Android 13+ requires POST_NOTIFICATIONS runtime permission; we no-op if not granted.
     */
    fun show(
        context: Context,
        title: String,
        message: String,
        intent: Intent? = null,
        requestCode: Int = 0,
        notificationId: Int? = null
    ) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            val granted = ActivityCompat.checkSelfPermission(
                context, android.Manifest.permission.POST_NOTIFICATIONS
            ) == PackageManager.PERMISSION_GRANTED
            if (!granted) return
        }

        val pendingIntent = intent?.let {
            val flags =
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M)
                    PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
                else
                    PendingIntent.FLAG_UPDATE_CURRENT
            PendingIntent.getActivity(context, requestCode, it, flags)
        }

        val builder = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_stat_notify)
            .setContentTitle(title)
            .setContentText(message)
            .setStyle(NotificationCompat.BigTextStyle().bigText(message))
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .setAutoCancel(true)

        pendingIntent?.let { builder.setContentIntent(it) }

        NotificationManagerCompat.from(context)
            .notify(notificationId ?: DEFAULT_NOTIFICATION_ID, builder.build())
    }

    /** Quick smoke test. */
    fun showSample(context: Context) {
        val tapIntent = Intent(context, MainActivity::class.java).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
        }
        show(
            context = context,
            title = "Hello from Pooh 🐻",
            message = "Your notification pipeline is operational.",
            intent = tapIntent,
            requestCode = 42,
            notificationId = 4242
        )
    }
}
