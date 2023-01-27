import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { Fontisto } from '@expo/vector-icons';

const { width:SCREEN_WIDTH } = Dimensions.get("window"); // 화면 크기 알아내도록, width를 screen_width로 사용

const API_KEY = "784ab24ff2ed5d94d4288abed9e25d13";

const icons = {
  "Clouds" : "cloudy",
  "Clear" : "day-sunny",
  "Atmosphere" : "cloudy-gusts",
  "Snow" : "snow",
  "Rain" : "rains",
  "Drizzle" : "rain",
  "Thunderstorm" : "Lightning"
}; // fontisto에 있는 아이콘 이름을 가져와야 작동함

export default function App() {
  const [district, setDistrict] = useState("Loading...")
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync(); // 해당 함수는 json 형태로 반환하는데, 그중 granted 사용
    if (!granted) setOk(false);
    const { coords:{latitude, longitude} } = await Location.getCurrentPositionAsync({accuracy:5}) // 현위치 파악
    // 해당 함수는 json 형태로 반환하는데, 그중 coords의 latitude, longitude 사용
    const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps: false}) // 위도, 경도로 주소 알아내기
    setDistrict(location[0].district)

    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`)
    const json = await response.json();
    setDays(json.daily)
  };

  useEffect(() => {
    getWeather();
  },[])

  return (
    <View style={styles.container}>
      {/* view는 div와 비슷한 역할 */}

      <StatusBar style="light" />
      {/* statusbar는 상태바 (배터리, 시계, 통신사 등), style로 색 지정 가능 */}

      <View style={styles.city}>
        <Text style={styles.cityName}>{district}</Text>
      </View>

      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}>
        {/* horizontal을 넣어 좌우로 움직이도록, pagingEnabled는 끝까지 이동시켜야 넘어가도록, 
        showsHorizaontalScrollIndicator를 false로 주어 스크롤바가 보이지 않도록, style은 contentcontainerstyle로 주기 */}

        {days.length === 0 ? 
          <View style={{...styles.day, alignItems: "center"}}>
            {/* styles.day에 추가로 alignItems 적용 */}

            <ActivityIndicator color="white" size="large" style={{marginTop:10}}/>
            {/* 로딩중 뜨도록 */}
          </View>
          :
          (days.map((day, index) => 
            <View key={index} style={styles.day}>
              {/* map 함수 후에는 key값을 고유하게 주기 */}

              <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between", width:"80%"}}>
                {/* flexDirection은 가로로 나란히 배치 */}

                <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
                {/* parseFloat으로 소수형태로 만든 후 소수점 한자리수까지만(반올림됨) */}

                <Fontisto name={icons[day.weather[0].main]} size={60} color="white" /> 
              </View>

              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>
          ))
        }

      </ScrollView>

      {/* <View style={{flex:1, backgroundColor:'tomato'}}></View>
      <View style={{flex:3, backgroundColor:'teal'}}></View>
      <View style={{flex:1, backgroundColor:'orange'}}></View> */}
      {/* flex로 화면 비율에 맞춰 조정 가능(부모태그에 flex 있어야함), height width는 다 다르게 보이므로 */}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'tomato',
  },
  city: {
    flex: 1,
    justifyContent: "center", // 상하정렬
    alignItems: "center"
  },
  cityName: {
    fontSize: 68,
    fontWeight: "500"
  },
  weather: {
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "center", //좌우정렬
  },
  temp: {
    marginTop: 50,
    fontSize: 120,
    color: 'white'
  },
  description: {
    fontSize: 45,
  },
  tinyText: {
    fontSize: 30
  }
});
