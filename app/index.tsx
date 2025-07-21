import { useLocalSearchParams, useRouter } from "expo-router";
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Calendar } from 'react-native-calendars';


/**
 * To-do list:
 * 
 *Add your own categories and exercises
 *Add multiple exercises 
 *Color code the workout and save ~
 *See the correct color dot on the calender ~
 *Click view day and see the workouts for that day and add more if you want ~
 * 
 * More features can be added later if I want but I just need to get it done for now
 * 
 */

const HomeScreen = () => {
  const router = useRouter();
  const today = moment().format('YYYY-MM-DD');
  const [selectedDate, setSelectedDate] = useState(today);
  const [workoutDots, setWorkoutDots] = useState({});
  const [currentMonth, setCurrentMonth] = useState(moment().format("YYYY-MM-DD"));

  const { selectedDate: newWorkoutDate, workoutColor} = useLocalSearchParams();

  useEffect(() => {
    if (newWorkoutDate && workoutColor) {
      setWorkoutDots(prev => ({
        ...prev, 
        [newWorkoutDate]: {
          marked: true,
          dots: [{ color: workoutColor }]
        }
      }));
    }
  }, [newWorkoutDate, workoutColor]);

  const getMarkedDates = () => {
    const base = workoutDots[selectedDate] || {};
    return {
      ...workoutDots,
      [selectedDate]: {
        ...base,
        selected: true,
        selectedColor: '#90EEBF',
        selectedTextColor: "black",
        customStyles: {
          container: {
          backgroundColor: '#90EEBF',
          borderRadius: 16,
          },
          text: {
            color: 'black',
          },
        },
      },
    };
  };

  const TopBorder = () => {
    return (  
      <View
        style={styles.border}
      />
    );
  };

  const MainCalendar = ( { selectedDate, setSelectedDate }) => {
    
    return (
        <View style={styles.calendar_box}>
          <Calendar
            current={currentMonth}

            onDayPress={(day) => {
              setSelectedDate(day.dateString);
              setCurrentMonth(day.dateString);
            }}
            markedDates={getMarkedDates()}
            markingType={'custom'}

            theme={{
              calendarBackground: "#220530",
              arrowColor: "#90EEBF",
              monthTextColor: "white",
              dayTextColor: "white",
              textDisabledColor: "purple",
              selectedDayBackgroundColor: "white",
              selectedDayTextColor: "white",
              selectedDotColor: "white",
              todayTextColor: "white",
              textSectionTitleColor: "#BD4FD3",
              textMonthFontSize: 30,
              textDayFontSize: 15,

            }}
          />
        
        
        </View>
    );
  };

  const PurpleButton = ( { text, style = {}, onPress } ) => {
    return (
        <TouchableOpacity style={{...style}} activeOpacity={0.7} onPress={onPress}>
          <View style={{alignItems:'center'}}>
            <Text style={styles.text_buttons}>
              {text}
            </Text>
          </View>
        </TouchableOpacity>
    );
  };



  return (
    <View style={styles.container}>

      <TopBorder/>


      <MainCalendar
        markedDates={getMarkedDates()}
        markingType={"multi-dot"}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      
      <PurpleButton 
        text="Add Workout"
        style={styles.button1}
        onPress={() => router.push({
          pathname: '/main/LogWorkoutScreen',
          params: { selectedDate }
        })}
      />

      <PurpleButton 
        text="View Day"
        style={styles.button2}
        onPress={() => router.push({
          pathname: '/main/ViewDayScreen',
          params: { selectedDate }
        })}      />
      
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#220428',
    alignItems: 'center',
    justifyContent: 'center'
  },
  border: {
    position: 'absolute',
    height: 50,
    width: 450,
    backgroundColor: "#19021A",
    bottom: 865,  
  },
  text_buttons: {
    fontSize: 40, 
    color: 'white', 
    bottom: -20
  },
  calendar_box: {
    position: 'fixed',
    bottom: 100, 
    width: 350, 
    borderWidth: 3, 
    borderColor: "#BD4FD3", 
    borderRadius: 10, 
    overflow: 'hidden',
  },
  button1: {
    position: 'fixed',
    backgroundColor: "#220530",
    height: 100,
    width: 300,
    borderRadius: 10,
    borderColor: "#BD4FD3",
    borderWidth: 3,
    bottom: 60
  },
  button2: {
    position: 'fixed',
    backgroundColor: "#220530",
    height: 100,
    width: 300,
    borderRadius: 10,
    borderColor: "#BD4FD3",
    borderWidth: 3,
    bottom: 30
  },
 
 

});

export default HomeScreen;