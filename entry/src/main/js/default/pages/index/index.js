import ability_featureAbility from '@ohos.ability.featureAbility'
import sensor from '@system.sensor'
import fetch from '@system.fetch';
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
        const month=(date.getMonth()+1)
        if (dayOfWeek==1)
        this.date_w="Mon"
        else if (dayOfWeek==2)
        this.date_w="Tue"
        else if (dayOfWeek==3)
        this.date_w="Wed"
        else if (dayOfWeek==4)
        this.date_w="Thu"
        else if (dayOfWeek==5)
        this.date_w="Fri"
        else if (dayOfWeek==6)
        this.date_w="Sat"
        else
        this.date_w="Sun"

        if (month==1)
        this.date_m="Jan"
        else if (month==2)
        this.date_m="Feb"
        else if (month==3)
        this.date_m="Mar"
        else if (month==4)
        this.date_m="Apr"
        else if (month==5)
        this.date_m="May"
        else if (month==6)
        this.date_m="Jun"
        else if (month==7)
        this.date_m="Jul"
        else if (month==8)
        this.date_m="Aug"
        else if (month==9)
        this.date_m="Sep"
        else if (month==10)
        this.date_m="Oct"
        else if (month==11)
        this.date_m="Nov"
        else
        this.date_m="Dec"
    },
    fetchWeather: function () {
        let dataw;
        fetch.fetch({
            url:'https://api.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid=55e15ebc8fdd929dd4c16583773384f3',
            responseType:"json",
            method: 'GET',
            success:function(resp)
            {
                dataw = JSON.parse(resp.data);
            },
            fail:(err,code) => {
                console.log("fail data:"+ JSON.stringify(err));
                console.log("fail code:"+ code)
            },
            complete: () => {
                const {main}=dataw.weather[0];
                const {description}=dataw.weather[0];
                this.weather = main;
                this.weather_description =main;
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
