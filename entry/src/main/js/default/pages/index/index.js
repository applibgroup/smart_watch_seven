// @ts-nocheck
import ability_featureAbility from '@ohos.ability.featureAbility'
import sensor from '@system.sensor'
import fetch from '@system.fetch';
import item from '../../i18n/weather_api.json';

export default {
    data: {
        // cloudy, windy, partly_sunny, rainy, sleeting, sun_n_rain, sun_n_windy, sunny, thunderstorm_n_rain, thunderstorm
        weather: "",
        weather_description:"",
        notification:"Team Meeting 11am",
        min_progress_calories:'50',
        min_progress_footSteps:'65',
        btnText: "",
        mySteps: '',
        sensorPermission: false
    },
    fetchDate : function(){
        const date = new Date();
        this.date_d=(String(date.getDate()))
        this.date_m=(String(date.getMonth()+1))
        const dayOfWeek = (date.getDay())
        const month=(date.getMonth())

        var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        this.date_w= days[dayOfWeek];

        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul','Aug','Sep','Oct','Nov','Dec'];
        this.date_m= months[month];
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
                console.log("fail data: " + JSON.stringify(data) + " fail code: " + code);
            },
            complete: () => {
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
               this.notification=data.notification;
               this.min_progress_calories=data.min_progress_calories;
                this.min_progress_footSteps=data.min_progress_footSteps;
            }
        })
    },

    onInit() {
        this.fetchWeather();
        this.fetchNotification();
        this.fetchDate();
        this.btnText = this.$t('strings.start_count');
    },
    async startCounting() {
        if (!this.sensorPermission) {
          this.sensorPermission = await verifyPermissions()
        } else {
          subscribePedometerSensor(this)
        }
      }
    }

function verifyPermissions() {
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
}

function subscribePedometerSensor(context) {
    sensor.subscribeStepCounter({
        success: function(ret) {
            context.mySteps = ret.steps.toString()
        },
        fail: function(data, code) {
            console.log('Subscription failed. Code: ' + code + '; Data: ' + data)
        }
    })
}
