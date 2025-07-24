import { useLocalSearchParams, useRouter } from "expo-router";
import moment from 'moment';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import * as FileSystem from 'expo-file-system';
import { useEffect, useState } from 'react';

const fileUri = FileSystem.documentDirectory + 'workouts.json';



const ViewDayScreen = () => {
    const router = useRouter();
    const params = useLocalSearchParams();

    const selectedDate = params.selectedDate;
    const workoutColor = params.workoutColor;
    const notes = params.notes;


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

    const [workoutForDate, setWorkoutForDate] = useState<Workout | null>(null);

    useEffect(() => {
      const loadWorkoutForDate = async () => {
        try {
          const contents = await FileSystem.readAsStringAsync(fileUri);
          const allWorkouts: Record<string, Workout> = JSON.parse(contents);
          const workout = allWorkouts[selectedDate as string];  // cast if needed
          setWorkoutForDate(workout || null);
        } catch (e) {
          console.error('Failed to load workouts:', e);
        }
      };

      loadWorkoutForDate();
    }, [selectedDate]);
  

    const TopBorder = () => {
        return (  
            <View
            style={styles.border}
            />
        );
    };

    const DateInput = () => {
        return (
            <View style={styles.date}>
                <Text style={styles.text}>
                    Date: {moment(selectedDate).format('MMMM D, YYYY')}
                </Text>
            </View>
        );
    };

    const BackButton = ( { onPress } ) => {
        return (
            <TouchableOpacity style={styles.touchable} onPress={onPress} activeOpacity={0.7}>
            <Image
                source={require('../../assets/images/back.png')}
                style={styles.image}
                transition={0}
                contentFit='contain'
            />
            </TouchableOpacity>
        );
    };


    //console.log('Exercises array:', workoutForDate.exercises);

    return (
        <View style={styles.container}>

        <TopBorder/>

        <BackButton
            onPress={() => router.back()}
        />

        <DateInput/>
            
       
         {workoutForDate ? (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={{height: 30, width: 30, borderRadius: 15, borderColor: '#ccc', borderWidth: 1, backgroundColor: workoutForDate.color, marginLeft: 310, marginBottom: 0}}></View>

            
            <Text style={styles.title}>{workoutForDate.Workoutname}</Text>

            <Text style={styles.subtitle}>Exercises:</Text>
            {workoutForDate.exercises?.map((exercise, index) => (
              <View key={index} style={styles.exerciseBox}>
                <Text style={{color: 'white', fontSize: 26}}>• {exercise.name}</Text>
                <Text style={styles.text}>Sets: {exercise.sets}</Text>
                <Text style={styles.text}>Reps: {exercise.reps}</Text>
                <Text style={styles.text}>Weight: {exercise.weight} lbs</Text>
              </View>
            ))}
            <Text style={{color: 'white', fontSize: 24, marginTop: 20}}>Notes: {workoutForDate.notes || 'None'}</Text>

          </ScrollView>
           
          ) : (
            <Text style={{color: 'white', fontSize: 24, marginTop: 50}}>No workout found</Text>
          )}



        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#220428',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  date: {
   marginTop: 15
  },
  text: {
    color: 'white',
    fontSize: 24,
  },
  border: {
    marginTop: 0,
    height: 50,
    width: 450,
    backgroundColor: "#19021A",
     
  },
  touchable: {
    position: 'absolute',
    height: 30,
    width: 30,
    bottom: 820,
    left: 20,
  },
  image: {
    height: 30,
    width: 30,
    backgroundColor: "#90EEBF",
    borderRadius: 10
  },
  title: {
    color: 'white',
    fontSize: 30,
    textDecorationLine: 'underline'
  },
  subtitle: {
    color: 'white',
    fontSize: 27,
    marginTop: 20
  },
  exerciseBox: {
    backgroundColor: '#220530',
    borderColor: '#BD4FD3',
    borderWidth: 2,
    borderRadius: 10,
    width: 250,
    padding: 15,
    marginTop: 10
  },
  scrollContent: {
    paddingBottom: 30,
    alignItems: 'center'
  }
});

export default ViewDayScreen;