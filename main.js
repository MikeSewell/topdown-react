window.addEventListener("load", e => {

    let assign = new Run();


});

class Run {
    constructor() {
        this.map = {};
        this.markers = []
        this.zipArr = []
        // this.lat = "test"
        // this.lng = 0
        this.setting()
    }
    setting() {
        let geo = document.querySelector("#geoLoc")
        // if (localStorage.getItem("geo")) {
        //     if (localStorage.getItem("geo") == "true") {
        //         geo.checked = true
        //     } else {
        //         geo.checked = false
        //     }
        // } else {
        //     localStorage.setItem("geo", "true")
        // }

        // geoLocation 
        geo.addEventListener("click", e => {
            if (geo.checked) {
                localStorage.setItem("geo", "true")
            } else {
                localStorage.setItem("geo", "false")
            }
        })
        if (localStorage.getItem("geo") == "true" || (!localStorage.getItem("geo"))) {
            // ================================
            this.dosomthing()
            // ================================
            // this.nav()
            // this.init_map()
            // this.changeZip()
        } else {
            // localStorage.setItem("geo", "false")
 
            // this.nav()
            // this.init_map()
            // this.changeZip()
        }
    }
    // navigation 
    nav() {
        let dash = document.querySelector("#dashboard")
        document.querySelector("#setIcon").addEventListener("click", e => {
            dash.classList.add("disableDash");
        })
        document.querySelector("#favIcon").addEventListener("click", e => {
            dash.classList.add("disableDash");
        })
        document.querySelector("#backIcon").addEventListener("click", e => {
            dash.classList.remove("disableDash");
        })
        document.querySelector("#fwdIcon").addEventListener("click", e => {
            dash.classList.remove("disableDash");
        })

    }
    // get geo location and populate data
    dosomthing() {
        function getHL(lat, lng) {
            let url = 'http://api.wunderground.com/api/47e6f06078fb48ae/forecast/q/' + lat + ',' + lng + '.json'
            fetch(url).then(function (response) {
                // Convert to JSON
                return response.json();
            }).then(function (j) {
                console.log(j);
                localStorage.setItem('lowF', j.forecast.simpleforecast.forecastday[0].low.fahrenheit);
                localStorage.setItem('highF', j.forecast.simpleforecast.forecastday[0].high.fahrenheit);
                localStorage.setItem('lowC', j.forecast.simpleforecast.forecastday[0].low.celsius);
                localStorage.setItem('highC', j.forecast.simpleforecast.forecastday[0].high.celsius);
                localStorage.setItem('tempformat', true);
                // console.log("test this lat",this.lat); cannot read
                
                return
            })
            
        }

        function getCurrTemp(lat, lng) {
            let url = "http://api.wunderground.com/api/47e6f06078fb48ae/conditions/q/" + lat + "," + lng + ".json"
            fetch(url).then(function (response) {
                // Convert to JSON
                return response.json();
            }).then(function (j) {
                console.log("getCurrTemp", j);
                localStorage.setItem('currIcon', j.current_observation.icon_url);
                localStorage.setItem('currTempF', j.current_observation.feelslike_f);
                localStorage.setItem('currTempC', j.current_observation.feelslike_c);
                return
            })
        }

        function getHourly(lat, lng) {
            let url = "http://api.wunderground.com/api/47e6f06078fb48ae/hourly/q/" + lat + "," + lng + ".json"
            return fetch(url).then(function (response) {
                // Convert to JSON
                return response.json();
            }).then(function (j) {
                localStorage.setItem("tempList", JSON.stringify(j))
            }).then(function () {
                showData()
            })
        }

        function showData() {
            //header
            let dash = document.querySelector("#main")
            // document.querySelector("#currTemp").src = localStorage.getItem("currIcon")
            // document.querySelector("#high").innerHTML = localStorage.getItem("highF")
            // document.querySelector("#low").innerHTML = localStorage.getItem("lowF")

            dash.insertAdjacentHTML("afterbegin", `<p id="high">${localStorage.getItem("highF")}</p>`)
            dash.insertAdjacentHTML("afterbegin", `<p id="currTemp"> <img src="${localStorage.getItem("currIcon")}" alt=""></p>`)
            dash.insertAdjacentHTML("afterbegin", `<p id="low">${localStorage.getItem("lowF")}</p>`)

            //hourly list
            let list = document.querySelector("#hourTable")
            let hour = JSON.parse(localStorage.getItem("tempList"))
            console.log(hour);

            for (var i = 0; i < 9; i++) {
                list.insertAdjacentHTML("beforeend", `<tr>
                        <td id="hrt${i}">${hour.hourly_forecast[i].FCTTIME.civil}</td>
                        <td id="temp${i}">${hour.hourly_forecast[i].temp.english} F</td>
                        <td><img src="${hour.hourly_forecast[i].icon_url}" alt="weathericon"></td>
                        <td>${hour.hourly_forecast[i].wspd.english} ${hour.hourly_forecast[i].wdir.dir}</td>
                    </tr>`)
            }

            // tempformat toggle
            let tempSelect = document.querySelector("#tempSelect")
            tempSelect.addEventListener("click", e => {
                if (tempSelect.checked) {
                    localStorage.setItem('tempformat', false);

                    document.querySelector("#low").innerHTML = localStorage.getItem("lowC")
                    document.querySelector("#high").innerHTML = localStorage.getItem("highC")


                    for (var i = 0; i < 9; i++) {
                        document.querySelector(`#temp${i}`).innerHTML = hour.hourly_forecast[i].temp.metric + " C"
                    }
                } else {
                    localStorage.setItem('tempformat', true);

                    document.querySelector("#low").innerHTML = localStorage.getItem("lowF")
                    document.querySelector("#high").innerHTML = localStorage.getItem("highF")
                    for (var i = 0; i < 9; i++) {
                        document.querySelector(`#temp${i}`).innerHTML = hour.hourly_forecast[i].temp.english + " F"
                    }
                }
            })
            //timeformat toggle
            let timeSelect = document.querySelector("#timeSelect")
            timeSelect.addEventListener("click", e => {
                if (timeSelect.checked) {
                    for (var i = 0; i < 9; i++) {
                        if (hour.hourly_forecast[i].FCTTIME.hour < 10) {
                            document.querySelector(`#hrt${i}`).innerHTML = "0" + hour.hourly_forecast[i].FCTTIME.hour + "00"
                        } else {
                            document.querySelector(`#hrt${i}`).innerHTML = hour.hourly_forecast[i].FCTTIME.hour + "00"

                        }
                    }
                } else {
                    for (var i = 0; i < 9; i++) {
                        document.querySelector(`#hrt${i}`).innerHTML = hour.hourly_forecast[i].FCTTIME.civil

                    }
                }
            })
        }

        // +++++++++++++++++++++

        let lat;
        let lng;

        const options = {
            method: 'Post'
        };
        let url = "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyAKTaI3tOSjLN-HO2XC0BOKbSWHa1zHWdY"
        fetch(url, options).then(function (response) {
            // Convert to JSON
            return response.json();
        }).then(function (d) {
            console.log('promiseGeo', d);
            lat = d.location.lat.toFixed(3)
            lng = d.location.lng.toFixed(3)
            let geo = [lat, lng]
            return geo
        }).then(function (result) {
            console.log('promisCurrtemp', result);
            return getHL(lat, lng)
        }).then(function (result) {
            // console.log('promisgetHl', result);
            return getCurrTemp(lat, lng)
        }).then(function (result) {
            // console.log('promisGetHouly', result);
            // console.log(lat);
            return getHourly(lat, lng)
        })

        // console.log(lng);
        // this.lat = lat
        // this.lng = lng
        

    }

    // change zip for both zip
    changeZip() {
        let zipInput = document.querySelector("#zipChange")
        zipInput.addEventListener("keyup", e => {
            if (zipInput.value.length == 5 && (!isNaN(zipInput.value))) {
                this.ZipToLL(zipInput.value)
                localStorage.setItem("geo", "false")
                document.querySelector("#geoLoc").checked = false
                this.getHL()
                this.getCurrTemp()
                this.getHourly()
                location.reload()
            }
        })
        let addZip = document.querySelector("#addZip")
        document.querySelector("#favZip button").addEventListener("click", e => {
            if (addZip.value.length == 5 && (!isNaN(addZip.value))) {
                this.ZipToLL(addZip.value, () => {
                    this.addMarkerToMap()
                })
            }
        })
    }
    //convert zip to lat,long
    ZipToLL(zip, callback) {

        let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${zip}&key=AIzaSyDCbLmYX5sRQJ_KgkYgD0mZ2qwBOpXuzSE`;

        fetch(url).then(function (response) {
            return response.json();
        }).then(function (d) {

            let lat = d.results[0].geometry.location.lat.toFixed(2)
            let lng = d.results[0].geometry.location.lng.toFixed(2)
            localStorage.setItem('lat', lat)
            localStorage.setItem('lng', lng)

            console.log('promiseZiptoll', d);
            lat = d.location.lat.toFixed(3)
            lng = d.location.lng.toFixed(3)
            let geo = [lat, lng]
            return geo
        })
    }
    // build map
    init_map() {
        var var_location = new google.maps.LatLng(localStorage.getItem("lat"), localStorage.getItem("lng"))
        var var_mapoptions = {
            center: var_location,
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            panControl: false,
            rotateControl: false,
            streetViewControl: false
        }
        this.map = new google.maps.Map(
            document.getElementById("map"),
            var_mapoptions
        )

        var marker = new google.maps.Marker({
            position: var_location,
            map: this.map
        })

        if (localStorage.getItem("markers")) {
            let data = localStorage.getItem("markers").split("|")
            console.log(data);
            console.log(data.length);
            console.log(data[0].length);
        }
    }


    // add marker to map
    // addMarkerToMap() {
    //     let latt = parseFloat(localStorage.getItem('userlat'))
    //     let lngt = parseFloat(localStorage.getItem('userlng'))

    //     let lat = latt.toFixed(1)
    //     let lng = lngt.toFixed(1)

    //     var myLatLng = new google.maps.LatLng(lat, lng);
    //     var marker = new google.maps.Marker({
    //         position: myLatLng,
    //         map: this.map,
    //         animation: google.maps.Animation.DROP
    //     });

    //     this.markers.push(lat, lng + "|")
    //     this.map.panTo(myLatLng)
    //     localStorage.setItem("markers", this.markers)
    // }
}