/*
 * Copyright (C) 2022 Application Library Engineering Group
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// @ts-nocheck
import ability_featureAbility from '@ohos.ability.featureAbility'
import sensor from '@system.sensor'
import fetch from '@system.fetch';
import item from '../../i18n/weather_api.json';


export default {
    data: {
        // cloudy, windy, partly_sunny, rainy, sleeting, sun_n_rain, sun_n_windy, sunny, thunderstorm_n_rain, thunderstorm
        weather: "",
        weather_description: "",
        notification: "Team Meeting 11am",
        min_progress_calories: '50',
        min_progress_footSteps: '65',
        target_footSteps: '5000',
        Pedometer: "",
        sensorPermission: false
    },
    fetchDate: function () {
        const date = new Date();
        this.date_d = (String(date.getDate()))
        this.date_m = (String(date.getMonth() + 1))
        const dayOfWeek = (date.getDay())
        const month = (date.getMonth())

        var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        this.date_w = days[dayOfWeek];

        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        this.date_m = months[month];
    },

    fetchWeather: function () {
        var dataw = JSON.stringify(item);
        let weather_api_input = JSON.parse(dataw);
        let data;
        fetch.fetch({
            url: "https://api.openweathermap.org/data/2.5/weather?lat=" + weather_api_input[0].latitude + "&lon=" + weather_api_input[0].longitude + "&appid=" + weather_api_input[0].api_key,
            responseType: "json",
            method: 'GET',
            success: function (resp) {
                data = JSON.stringify(resp);
                console.info('Weather data fetch success. Resp: ' + data);
            },
            fail: function (data, code) {
                console.log('in Fail');
                console.log("fail data: " + JSON.stringify(data) + " fail code: " + code);
            },
            complete: () => {
                console.info('Data: ' + data);
                console.log('In Complete fetchWeather');
                const { main } = data.weather[0];
                this.weather = main;
                this.weather_description = main;
            }
        })
    },

    fetchNotification: function () {
        let data;
        fetch.fetch({
            complete: () => {
                this.notification = data.notification;
                this.min_progress_calories = data.min_progress_calories;
            }
        })
    },
    fetchPedometer: async function () {
        if (!this.sensorPermission) {
            this.sensorPermission = await verifyPermissions()
        } else {
            subscribePedometerSensor(this)
        }
    },

    onInit() {
        this.fetchWeather();
        this.fetchNotification();
        this.fetchDate();
        this.fetchPedometer();
        this.Pedometer = this.$t('strings.start_count');
    },

    verifyPermissions: function () {
        var context = ability_featureAbility.getContext()
        let permission = "ohos.permission.ACTIVITY_MOTION"
        var result = new Promise((resolve, reject) => {
            context.verifyPermission(permission)
                .then((data) => {
                    resolve(true)
                }).catch((error) => {
                reject(false)
            })
        })
        return result
    },

    subscribePedometerSensor: function (context) {
        sensor.subscribeStepCounter({
            success: function (ret) {
                this.min_progress_footSteps = ret.steps.toString()
            },
            fail: function (data, code) {
                console.log('Subscription failed. Code: ' + code + '; Data: ' + data)
            }
        })
    }
}

