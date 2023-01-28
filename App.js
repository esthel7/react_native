import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Fontisto } from '@expo/vector-icons';
import { theme } from './colors';

const STORAGE_KEY = "@toDos";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const travel = () => setWorking(false);
  const work = () => setWorking(true);

  const onChangeText = (event) => setText(event); // 사용자가 입력한 글을 setText에 저장
  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave)); // asyncstorage는 await 사용해야함
  };
  const loadToDos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    setToDos(JSON.parse(s)); // string을 object로 변환
  };
  const addTodo = async () => {
    if (text === "") return;
    const newToDos = { ...toDos, [Date.now()]: { text, working } };
    // 기존 toDos에 내용 더 붙여서 newToDos 만듦

    await setToDos(newToDos);
    saveToDos(newToDos);
    setText(""); // 입력하고 전송하면 다시 입력칸 공란으로 만들기
  };
  const deleteToDo = async (key) => {
    Alert.alert("Delete To Do", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "I'm Sure",
        onPress: () => {
          const newToDos = { ...toDos };
          delete newToDos[key]; // newToDos에서 key에 해당하는 데이터 지움
          setToDos(newToDos);
          saveToDos(newToDos);
        }
      }
    ]);
    // 제목, 내용, 버튼 설정(Cancel, I'm Sure 버튼 생성)
  };

  useEffect(() => {
    loadToDos();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>

        <TouchableOpacity onPress={work}>
          {/* 해당 태그 속 아이템을 누를 경우 살짝 투명해지는 효과, activateOpacity 속성으로 얼마나 투명할지 조정(0에 가까울수록 투명) */}

          <Text style={{ ...styles.btnText, color: working ? "white" : theme.grey }}>Work</Text>
          {/* btnText 스타일 적용하고 추가 적용하기 */}
        </TouchableOpacity>

        <TouchableOpacity onPress={travel}>
          <Text style={{ ...styles.btnText, color: !working ? "white" : theme.grey }}>Travel</Text>
        </TouchableOpacity>

      </View>

      <View>
        <TextInput placeholder={working ? "Add a To Do" : "Where do you want to go?"} style={styles.input}
          onChangeText={onChangeText} value={text} onSubmitEditing={addTodo} returnKeyType="done" />
        {/* onsubmitEditing은 입력 후 버튼 누르면 이벤트 발생, returnKeyType은 '완료', '다음' 등 버튼 이름 지정 */}

        <ScrollView>
          {Object.keys(toDos).map(key => (
            toDos[key].working === working ?
              <View key={key} style={styles.toDo}>
                <Text style={styles.toDoText}>{toDos[key].text}</Text>
                <TouchableOpacity onPress={() => deleteToDo(key)}>
                  <Fontisto name="trash" size={18} color={theme.grey} />
                </TouchableOpacity>
              </View>
              : null
          ))}
          {/* toDos의 key들을 map함수를 사용해 변수 key에 할당, toDos[key].text로 접근 */}

        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20, // padding 좌우값 (native에서는 paddingLeft 없음)
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100
  },
  btnText: {
    fontSize: 38,
    fontWeight: "600"
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15, // 세로
    paddingHorizontal: 20, // 가로
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  toDo: {
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500"
  }
});
