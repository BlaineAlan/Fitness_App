import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from "expo-router";
import moment from 'moment';
import React, { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { List, Provider as PaperProvider } from 'react-native-paper';

const LogWorkoutScreen = () => {
  const router = useRouter();
  const { selectedDate } = useLocalSearchParams();
  const [selectedColor, setSelectedColor] = useState('red');

  const handleSave = () => {
    router.replace({
      pathname: '/',
      params: {
        selectedDate,
        workoutColor: selectedColor
      }
    });
  };

  const TopBorder = () => {
    return (  
      <View
        style={styles.border}
      />
    );
  };

  const TitleInput = () => {
    const [workoutName, setWorkoutName] = useState("New Workout Name");
    const inputRef = useRef<TextInput>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [hasSelectedOnce, setHasSelectedOnce] = useState(false);
    

    return (
      <View style={styles.TextBox}>
        <TextInput
          ref={inputRef}
          value={workoutName}
          onChangeText={setWorkoutName}
          onFocus={() => {
            setIsFocused(true);
            setHasSelectedOnce(false);
          }}
          onBlur={() => setIsFocused(false)}
          style={styles.TitleText}
          textAlign='center'
          selection={
            isFocused && !hasSelectedOnce 
            ? { start: 0, end: workoutName.length }
            : undefined
          }
          onSelectionChange={() => {
            if (isFocused && !hasSelectedOnce) setHasSelectedOnce(true);
          }}
        />
      </View>
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

  const SetInput = () => {
    const [text, onChangeText] = React.useState('');
    return (
      <View style={styles.smallTextBox}>
        <TextInput
          value={text}
          onChangeText={onChangeText}
          style={styles.smallText}
          textAlign='center'
          keyboardType='number-pad'
        />
      </View>
    );
  };

  const RepInput = () => {
    const [text, onChangeText] = React.useState('');
    return (
      <View style={styles.smallTextBox}>
        <TextInput
          value={text}
          onChangeText={onChangeText}
          style={styles.smallText}
          textAlign='center'
          keyboardType='number-pad'
        />
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

  const ExerciseDropdown = () => {
    const [expandedGroup, setExpandedGroup] = React.useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const [selectedExercise, setSelectedExercise] = React.useState(null);

    const toggleDropdown = () => setIsDropdownOpen(prev => !prev);

    const handlePress = (group) => {
      setExpandedGroup(prev => (prev === group ? null : group));
    };

    const ExerciseData = {
      Back: {
        color: '#220530',
        exercises: ['Pull Ups', 'Deadlifts', 'Rows']
      },
      Arms: {
        color: '#220530',
        exercises: ['Bicep Curls', 'Push Ups']
      },
      Legs: {
        color: '#220530',
        exercises: ['Squats', 'Lunges', 'Leg Press']
      }
    };

    return (
      <PaperProvider>
        <View>
          <TouchableOpacity style={styles.dropdown} onPress={toggleDropdown}>
            <Text style={styles.text}>
              {selectedExercise || 'Select Exercise'}
            </Text>
          </TouchableOpacity>

          {isDropdownOpen && (
            <View style={styles.dropdowncontent}>
              <ScrollView>
                {Object.entries(ExerciseData).map(([group, data]) => (
                  <List.Accordion
                    key={group}
                    title={group}
                    expanded={expandedGroup === group}
                    onPress={() => handlePress(group)}
                    style={{
                      backgroundColor: data.color,
                      
                    }}
                  >
                    {data.exercises.map((exercise) => (
                      <List.Item
                        key={exercise}
                        title={exercise}
                        onPress={() => {
                          setSelectedExercise(exercise);
                          setIsDropdownOpen(false);
                        }}
                      />
                    ))}
                  </List.Accordion>
                ))
                }
              </ScrollView>
            </View>
          )}
        </View>
      </PaperProvider>
    );
  };

  const PurpleButton = ( { text, onPress } ) => {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <View style={{alignItems: 'center'}}>
          <Image
            source={require('../../assets/images/purple_button.png')}
            style={styles.image2}
            transition={0}
          />
          <Text style={styles.textbutton}>
            {text}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };


  return (
    <View style={styles.container}>
      
      <TopBorder/>

      <TitleInput/>

      <DateInput/>

      <BackButton
        onPress={() => router.back()}
      />

      <View style={styles.exercisetext}>
        <Text style={styles.text}>
          Exercises
        </Text>
        
      </View>
      <ExerciseDropdown/>

      <View style={styles.settext}>
        <Text style={styles.text}>
          Sets
        </Text>
        <SetInput/>
      </View>

      <View style={styles.reptext}>
        <Text style={styles.text}>
          Reps
        </Text>
        <RepInput/>
      </View>
      
      <View>
        {['red', 'blue', 'green'].map((color) => (
          <TouchableOpacity
            key={color}
            style={[styles.colorDot, { backgroundColor: color, borderWidth: selectedColor === color ? 3 : 0}]}
            onPress={() => setSelectedColor(color)}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.text}>Save</Text>
      </TouchableOpacity>

      

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
  text: {
    color: 'white',
    fontSize: 24,
    position: 'fixed',
  },
  image: {
    height: 30,
    width: 30,
    backgroundColor: "#90EEBF",
    borderRadius: 10
  },
  image2: {
    height: 116,
    width: 300,
    bottom: 200
  },
  border: {
    position: 'absolute',
    height: 50,
    width: 450,
    backgroundColor: "#19021A",
    bottom: 864,  
  },
  touchable: {
    position: 'absolute',
    height: 30,
    width: 30,
    bottom: 820,
    left: 20,
  },
  TitleText: {
    height: 50,
    width: 300,
    bottom: 320,
    color: 'white',
    fontSize: 30,
    textDecorationLine: 'underline'
  },
  TextBox: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute'
  },
  textbutton: {
    fontSize: 40, 
    color: 'white', 
    fontWeight: 'bold',
    textShadowColor: "dark gray",
    textShadowOffset: {width: 0, height: 3},
    textShadowRadius: 1,
    bottom: 295
  },
  exercisetext: {
    position: 'absolute',
    bottom: 660,
    right: 265
  },
  settext: {
    position: 'absolute',
    bottom: 660,
    right: 150,
    alignItems: 'center',
    justifyContent: 'center'
  },
  reptext: {
   position: 'absolute',
   bottom: 660,
   right: 70,
   alignItems: 'center',
   justifyContent: 'center'
  },
  smallTextBox: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#BD4FD3',
    bottom: -45,
    right: 0,
    height: 40,
    width: 40,
    backgroundColor: '#220530',
    borderRadius: 10
  },
  smallText: {
    color: 'white',
    fontSize: 20,
    height: 40,
    width: 40,
    bottom: -2
  },
  dropdown: {
    position: 'absolute',
    width: 170,
    bottom: -300,
    right: 20,
    backgroundColor: '#220530',
    borderWidth: 2,
    borderColor: '#BD4FD3',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  dropdowncontent: {
    position: 'absolute',
    backgroundColor: '#220428',
    bottom: -451,
    right: 20,
    width: 170,
    borderWidth: 2,
    borderColor: '#BD4FD3',
    borderRadius: 10,
    overflow: 'hidden'
  },
  date: {
    position: 'absolute',
    bottom: 720
  },
  colorDot: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 15,
    borderColor: 'white'
  },
  saveButton: {
    backgroundColor: "gray",
  
  }
  
});

export default LogWorkoutScreen;
