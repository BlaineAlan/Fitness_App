import { useLocalSearchParams, useRouter } from "expo-router";
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Calendar } from 'react-native-calendars';
import * as FileSystem from 'expo-file-system';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from "react";


const HomeScreen = () => {
  const router = useRouter();
  const today = moment().format('YYYY-MM-DD');
  const [selectedDate, setSelectedDate] = useState(today);
  const [workoutDots, setWorkoutDots] = useState({});
  const [currentMonth, setCurrentMonth] = useState(moment().format("YYYY-MM-DD"));

  const { selectedDate: newWorkoutDate, workoutColor} = useLocalSearchParams();

  const fileUri = FileSystem.documentDirectory + 'workouts.json';


  /**
   * Used for erasing all existing workout data
   */

  // useEffect(() => {
  //   const clearWorkoutData = async () => {
  //     try {
  //       await FileSystem.deleteAsync(fileUri, { idempotent: true });
  //       console.log('Workout data cleared!');
  //     } catch (e) {
  //       console.error('Failed to clear workout data:', e);
  //     }
  //   };
  //   clearWorkoutData();
  // }, []);

  const loadWorkouts = async (): Promise<Record<string, Workout>> => {
    try {
      const contents = await FileSystem.readAsStringAsync(fileUri);
      const data = JSON.parse(contents);
      return data;
    } catch (e) {
      console.warn("No Workouts found or failed to load", e);
    }
  };


useFocusEffect(
  useCallback(() => {
    const fetchWorkouts = async () => {
      const loadedWorkouts = await loadWorkouts();
      const dots = mapWorkoutsToDots(loadedWorkouts);
      setWorkoutDots(dots);
    };

    fetchWorkouts();
  }, [])
);


type Workout = {
  Workoutname?: string;
  date?: string;
  color?: string;
  notes?: string;
  exercises?: Array<{
    name: string;
    sets: string | number;
    reps: string | number;
    weight: string | number;
  }>;
};

  const mapWorkoutsToDots = (workouts) => {
    const dots = {};
    for(const [date, workout] of Object.entries(workouts)) {
      const typedWorkout = workout as Workout;

      dots[date] = {
        marked:true,
        dots: [{ color: typedWorkout.color || '#000'}]
      };
    }
    return dots;
  };


  const getMarkedDates = () => {
    const marked = {...workoutDots};

    if(!marked[selectedDate]) {
      marked[selectedDate] = {};
    }

    
      marked[selectedDate] = {
        ...marked[selectedDate],
        selected: true,
        
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
      };
      return marked;
  };

  const TopBorder = () => {
    return (  
      <View
        style={styles.border}
      />
    );
  };

  const MainCalendar = ( { selectedDate, setSelectedDate, markedDates, markingType }) => {
    
    return (
        <View style={styles.calendar_box}>
          <Calendar
            current={currentMonth}

            onDayPress={(day) => {
              setSelectedDate(day.dateString);
              setCurrentMonth(day.dateString);
            }}
            markedDates={markedDates}
            markingType={markingType}

            theme={{
              calendarBackground: "#220530",
              arrowColor: "#90EEBF",
              monthTextColor: "white",
              dayTextColor: "white",
              textDisabledColor: "purple",
              selectedDayBackgroundColor: "#90EEBF",
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
        })}      
        />
      
      
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