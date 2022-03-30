@echo off
chcp 65001 >nul

:top
cls
echo.
set /p input="Type "amen" to proceed> "
if /i "%input%"=="amen" goto :amen
goto :top

:amen
echo Bixby Wakeup.
adb shell pm uninstall -k --user 0 com.samsung.android.bixby.wakeup

echo Bixby homepage on experience launcher.
adb shell pm uninstall -k --user 0 com.samsung.android.app.spage

echo Bixby Routines, located in settings. Needed for automated tasks.
adb shell pm uninstall -k --user 0 com.samsung.android.app.routines

echo Likely needed for Bixby features.
adb shell pm uninstall -k --user 0 com.samsung.android.bixby.service

echo Bixby vision is a camera feature.
adb shell pm uninstall -k --user 0 com.samsung.android.visionintelligence

echo Bixby voice.
adb shell pm uninstall -k --user 0 com.samsung.android.bixby.agent

echo Test or debug app (?).
adb shell pm uninstall -k --user 0 com.samsung.android.bixby.agent.dummy

echo Core part of Bixby vision.
adb shell pm uninstall -k --user 0 com.samsung.android.bixbyvision.framework

echo Ant components are related to bluetooth and accessories like watches, or fitness tracking.
adb shell pm uninstall -k --user 0 com.dsi.ant.sample.acquirechannels
adb shell pm uninstall -k --user 0 com.dsi.ant.service.socket
adb shell pm uninstall -k --user 0 com.dsi.ant.server
adb shell pm uninstall -k --user 0 com.dsi.ant.plugins.antplus

echo Android Easter egg.
adb shell pm uninstall -k --user 0 com.android.egg

echo Homescreen widget. Not crucial.
adb shell pm uninstall -k --user 0 com.sec.android.widgetapp.samsungapps

echo Galaxy Friends. Junk.
adb shell pm uninstall -k --user 0 com.samsung.android.mateagent

echo Galaxy Wearable. Junk.
adb shell pm uninstall -k --user 0 com.samsung.android.app.watchmanagerstub

echo S Weather. Odd name.
adb shell pm uninstall -k --user 0 com.sec.android.daemonapp

echo What's New. Junk.
adb shell pm uninstall -k --user 0 com.samsung.android.app.social

echo Samsung push service.
adb shell pm uninstall -k --user 0 com.sec.spp.push

echo Galaxy App Store.
adb shell pm uninstall -k --user 0 com.sec.android.app.samsungapps

echo Samsung phone tips. Junk.
adb shell pm uninstall -k --user 0 com.samsung.android.app.tips

echo Samsung Health.
adb shell pm uninstall -k --user 0 com.sec.android.service.health

echo Samsung Customization Service.
adb shell pm uninstall -k --user 0 com.samsung.android.rubin.app

echo Samsung Blockchain Keystore.
adb shell pm uninstall -k --user 0 com.samsung.android.coldwalletservice

echo Samsung Checkout.
adb shell pm uninstall -k --user 0 com.sec.android.app.billing

echo Samsung Cloud.
adb shell pm uninstall -k --user 0 com.samsung.android.scloud

echo Microsoft Office.
adb shell pm uninstall -k --user 0 com.microsoft.office.officehubhl

echo Sprint bloat.
adb shell pm uninstall -k --user 0 com.sprint.ms.smf.services

echo Link to Windows Service.
adb shell pm uninstall -k --user 0 com.samsung.android.mdx

echo Your Phone Companion.
adb shell pm uninstall -k --user 0 com.microsoft.appmanager

echo TMobile App.
adb shell pm uninstall -k --user 0 com.tmobile.pr.mytmobile

echo TMobile Device Manager.
adb shell pm uninstall -k --user 0 com.tmobile.pr.adapt

echo TMobile Telemetry.
adb shell pm uninstall -k --user 0 com.tmobile.echolocate

echo Google Chrome.
adb shell pm uninstall -k --user 0 com.android.chrome

echo Google Chrome Customizations.
adb shell pm uninstall -k --user 0 com.sec.android.app.chromecustomizations

echo Regular YouTube app.
adb shell pm uninstall -k --user 0 com.google.android.youtube

echo Google Duo.
adb shell pm uninstall -k --user 0 com.google.android.apps.tachyon

echo Ok Google assistant.
adb shell pm uninstall -k --user 0 com.android.hotwordenrollment.okgoogle

echo Ok Google assistant.
adb shell pm uninstall -k --user 0 com.android.hotwordenrollment.xgoogle

echo Google Quick Search Box.
adb shell pm uninstall -k --user 0 com.google.android.googlequicksearchbox

echo Google Speech Services.
adb shell pm uninstall -k --user 0 com.google.android.tts

echo Samsung Pass. Auto fill app.
adb shell pm uninstall -k --user 0 com.samsung.android.samsungpassautofill
adb shell pm uninstall -k --user 0 com.samsung.android.authfw
adb shell pm uninstall -k --user 0 com.samsung.android.samsungpass

echo Payment app. Samsung Pay and its framework.
adb shell pm uninstall -k --user 0 com.samsung.android.spay
adb shell pm uninstall -k --user 0 com.samsung.android.spayfw

echo Create an AR avatar.
adb shell pm uninstall -k --user 0 com.samsung.android.aremoji

echo Google AR core platform for camera. Possibly needed to allow AR emoji or chars to interact with environment.
adb shell pm uninstall -k --user 0 com.google.ar.core

echo News app. Flipboard.
adb shell pm uninstall -k --user 0 flipboard.boxer.app

echo Digital wellbeing. Tracks phone usage and has grayscale.
adb shell pm uninstall -k --user 0 com.samsung.android.wellbeing

echo emoji stickers. Needs AR emoji app.
adb shell pm uninstall -k --user 0 com.sec.android.mimage.avatarstickers

echo Deco Pic, Photo decoration app.
adb shell pm uninstall -k --user 0 com.samsung.android.livestickers

echo Facebook.
adb shell pm uninstall -k --user 0 com.facebook.katana
adb shell pm uninstall -k --user 0 com.facebook.system
adb shell pm uninstall -k --user 0 com.facebook.appmanager
adb shell pm uninstall -k --user 0 com.facebook.services

echo Samsung Email.
adb shell pm uninstall -k --user 0 com.samsung.android.email.provider
adb shell pm uninstall -k --user 0 com.wsomacp

echo Samsung Internet.
adb shell pm uninstall -k --user 0 com.sec.android.app.sbrowser

echo Edge lanel for Internet.
adb shell pm uninstall -k --user 0 com.samsung.android.app.sbrowseredge

echo AR Doodle, drawing on photos and video in 3D.
adb shell pm uninstall -k --user 0 com.samsung.android.ardrawing

echo Customize your own emoji with the AR Emoji Editor.
adb shell pm uninstall -k --user 0 com.samsung.android.aremojieditor

echo AR Zone, Provides AR features.
adb shell pm uninstall -k --user 0 com.samsung.android.arzone

echo Samsung Vision AR Apps.
adb shell pm uninstall -k --user 0 com.samsung.android.visionarapps

echo 3 parts for Samsung's Gear VR accessories.
adb shell pm uninstall -k --user 0 com.samsung.android.hmt.vrsvc
adb shell pm uninstall -k --user 0 com.samsung.android.app.vrsetupwizardstub
adb shell pm uninstall -k --user 0 com.samsung.android.hmt.vrshell

echo Google VR core. Their VR platform.
adb shell pm uninstall -k --user 0 com.google.vr.vrcore

echo Kids mode: https://www.samsung.com/global/galaxy/apps/kids-mode/
adb shell pm uninstall -k --user 0 com.samsung.android.kidsinstaller

echo Face decorations. AR emoji related; might be the mask function.
adb shell pm uninstall -k --user 0 com.samsung.android.app.camera.sticker.facearavatar.preload

echo Samsung LED case. Barely anyone owns one.
adb shell pm uninstall -k --user 0 com.samsung.android.app.ledbackcover
adb shell pm uninstall -k --user 0 com.sec.android.cover.ledcover

echo People edge. Junk.
adb shell pm uninstall -k --user 0 com.samsung.android.service.peoplestripe

adb kill-server
echo Server killed.

::RMDIR /S /Q %USERPROFILE%/.android
::RMDIR /S /Q %USERPROFILE%/.dbus-keyrings
pause