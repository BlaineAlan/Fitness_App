import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from "expo-router";
import moment from 'moment';
import React, { useRef, useState, useEffect } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList, Touchable } from 'react-native';
import { List, Provider as PaperProvider } from 'react-native-paper';
import ColorPicker from 'react-native-wheel-color-picker';
import * as FileSystem from 'expo-file-system';
export const fileUri = FileSystem.documentDirectory + 'workouts.json';


const TitleInput = ({ value, onChangeText }) => {
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [hasSelectedOnce, setHasSelectedOnce] = useState(false);
  

  return (
    <View style={styles.TextBox}>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => {
          setIsFocused(true);
          setHasSelectedOnce(false);
        }}
        onBlur={() => setIsFocused(false)}
        style={styles.TitleText}
        textAlign='center'
        selection={
          isFocused && !hasSelectedOnce 
          ? { start: 0, end: value.length }
          : undefined
        }
        onSelectionChange={() => {
          if (isFocused && !hasSelectedOnce) setHasSelectedOnce(true);
        }}
      />
    </View>
  );
};

const SetInput = ({ value, onChangeText }) => {
  return (
    <View style={styles.setBox}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={styles.smallText}
        textAlign='center'
        keyboardType='number-pad'
      />
    </View>
  );
};

const RepInput = ({ value, onChangeText }) => {
  return (
    <View style={styles.repBox}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={styles.smallText}
        textAlign='center'
        keyboardType='number-pad'
      />
    </View>
  );
};


const WeightInput = ({ value, onChangeText }) => {
  return(
    <View style={styles.WeightBox}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={styles.smallText}
        textAlign='center'
        keyboardType='number-pad'
      />
    </View>
  );
};

const Notes = ({ value, onChangeText }) => {
  return (
    <View style={styles.Notesbox}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={styles.notestext}
        multiline={true}
        textAlignVertical='top'
        scrollEnabled={true}
      />
    </View>
  );
};

const ColorPick = ( { selectedColor = '#000', onColorChange } ) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentColor, setCurrentColor] = useState(selectedColor);
  
  const handleColorChange = (color) => {
    setCurrentColor(color);
  };

  const handleColorSelect = () => {
    onColorChange(currentColor);
    setModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={[styles.colorButton, {backgroundColor:selectedColor}]}
      />

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType='slide'
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.colorBack}>
          <View style={styles.colorWheel}>
            <ColorPicker
              color={currentColor}
              swatches={true}
              onColorChange={handleColorChange}
              thumbSize={30}
              sliderSize={30}
              noSnap={true}
              row={false}
              swatchesOnly={false}
              
            />

            <View style={{flexDirection: 'row', padding: 20}}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                <Text style={{color: 'black', fontSize: 30, bottom: 2}}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.colorSaveButton} onPress={handleColorSelect}>
                <Text style={{color: 'black', fontSize: 30, bottom: 2}}>Save</Text>
              </TouchableOpacity>

            </View>

          </View>
        </View>
    </Modal>
    </View>
  );
};

const ExerciseDropdown = ( { value, onChangeText }) => {
    const [expandedGroup, setExpandedGroup] = React.useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

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
              {value || 'Select Exercise'}
            </Text>
          </TouchableOpacity>

          {isDropdownOpen && (
            <View style={styles.dropdowncontent}>
              <View  style={{flexGrow: 1, zIndex: 2000}}>
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
                          onChangeText(exercise);
                          setIsDropdownOpen(false);
                        }}
                      />
                    ))}
                  </List.Accordion>
                ))
                }
              </View>
            </View>
          )}
        </View>
      </PaperProvider>
    );
  };




const LogWorkoutScreen = () => {
  const router = useRouter();
  const { selectedDate } = useLocalSearchParams();
  const [selectedColor, setSelectedColor] = useState('red');
  const [workoutName, setWorkoutName] = useState("New Workout Name");
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [sets, setSets] = React.useState('');
  const [reps, setReps] = React.useState('');
  const [weight, setWeight] = React.useState('');
  const [notes, setNotes] = React.useState('');

  const [exercises, setExercises] = useState([]);

  const addExercise = () => {
  if (!selectedExercise || !sets || !reps || !weight) return;

  setExercises(prev => [
    ...prev,
    {
      name: selectedExercise,
      sets,
      reps,
      weight
    }
  ]);

  setSelectedExercise(null);
  setSets('');
  setReps('');
  setWeight('');
};



  
  const handleSave = async () => {

    const workout = {
      Workoutname: workoutName,
      date: selectedDate,
      color: selectedColor,
      notes: notes,
      exercises: exercises
    }

    try {
        // Load existing
        const existing = await FileSystem.readAsStringAsync(fileUri)
          .then(JSON.parse)
          .catch(() => ({})); // fallback if file doesn't exist

        // Add/update workout
        existing[workout.date] = workout;

        await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(existing));
        //console.log('Workout saved!', fileUri);
      } catch (e) {
        console.error('Failed to save workout', e);
      }
      //console.log("Saving exercises:", exercises);
      router.replace({
      pathname: '/',
    });
    };

    const loadWorkouts = async () => {
      try {
        const contents = await FileSystem.readAsStringAsync(fileUri);
        return JSON.parse(contents);
      } catch {
        return {};
      }
  };

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


  return (

    <ScrollView scrollEnabled contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

      <View>

        <TopBorder/>

        <BackButton
          onPress={() => router.back()}
        />
        
      </View>
      

      <TitleInput value={workoutName} onChangeText={setWorkoutName}/>

      <View style={{flexDirection: 'row', marginTop: 20, justifyContent: 'space-between'}}>

        <DateInput/>

        <ColorPick
          selectedColor={selectedColor}
          onColorChange={setSelectedColor}
        />

      </View>

   


      <TouchableOpacity style={styles.AddExerciseButton} onPress={addExercise}>
        <Text style={{color: 'black', fontSize: 30, bottom: 2}}>Add</Text>
      </TouchableOpacity>


        
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginRight: 7}}>
          

          <View>
            <Text style={{color: 'white', fontSize: 24, marginRight: 5, marginBottom: 5, zIndex: 0}}>
              Sets
            </Text>
            <SetInput value={sets} onChangeText={setSets}/>
          </View>

          <View>
            <Text style={{color: 'white', fontSize: 24, marginLeft: 16, marginBottom: 5, zIndex: 0}}>
              Reps
            </Text>
            <RepInput value={reps} onChangeText={setReps}/>
          </View>
          <View>
            <Text style={{color: 'white', fontSize: 24, marginLeft: 60, marginBottom: 5, zIndex: 0}}>
              Weight
            </Text>
            <WeightInput value={weight} onChangeText={setWeight}/>
          </View>

          <Text style={{color: 'white', fontSize: 24, marginLeft: 10, marginTop: 40, zIndex: 0}}>
              lbs
          </Text>


        </View>


      <View style={{bottom: 170, right: 100, alignItems: 'center'}}>

        <View style={styles.exercisetext}>
          <Text style={{color: 'white', fontSize: 24, marginLeft: 40}}>
            Exercises
          </Text>
        <ExerciseDropdown value={selectedExercise} onChangeText={setSelectedExercise}/>
        </View>
      </View>

        {exercises.map((ex, index) => (
          <View key={index} style={styles.AddedExercises}>
            <Text style={{color: 'white', fontSize: 20}}>
              * {ex.name}: {ex.sets} sets x {ex.reps} reps @ {ex.weight} lbs
            </Text>
          </View>
        ))}
          


      <View style={{alignItems: 'center', bottom: 40, position: 'absolute'}}>

        <Notes value={notes} onChangeText={setNotes}/>


        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.savetext}>Save</Text>
        </TouchableOpacity>

      </View>



      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#220428',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  text: {
    color: 'white',
    fontSize: 24,
  },
  image: {
    height: 30,
    width: 30,
    backgroundColor: "#90EEBF",
    borderRadius: 10
  },
  border: {
    height: 50,
    width: 450,
    backgroundColor: "#19021A",
  },
  touchable: {
    height: 30,
    width: 30,
    marginTop: 20,
    marginLeft: 40
  },
  TitleText: {
    height: 50,
    width: 300,
    color: 'white',
    fontSize: 30,
    textDecorationLine: 'underline',
    marginTop: 62
  },
  TextBox: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute'
  },
   date: {
    height: 50,
    width: 200,
    justifyContent: 'center',
    alignItems: 'center'
  },
  colorButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 10,
    marginLeft: 10
  },
  colorWheel: {
    backgroundColor: '#220530',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#BD4FD3',
    margin: 10,
    height: 500,
  },
  colorBack: {
    justifyContent: 'center',
    flex: 1,
  },
  cancelButton: {
    backgroundColor: "#90EEBF",
    height: 50,
    width: 100,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 0
  },
  colorSaveButton: {
    backgroundColor: "#90EEBF",
    height: 50,
    width: 100,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 148,
  },
  exercisetext: {
    marginBottom: 200,
    marginRight: 0,
  },
  setBox: {
    marginRight: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#BD4FD3',
    height: 40,
    width: 40,
    backgroundColor: '#220530',
    borderRadius: 10,
    zIndex: 0
  },
  repBox: {
    marginLeft: 20,
    marginRight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#BD4FD3',
    height: 40,
    width: 40,
    backgroundColor: '#220530',
    borderRadius: 10,
    zIndex: 0
  },
  WeightBox: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#BD4FD3',
    height: 40,
    width: 60,
    backgroundColor: '#220530',
    borderRadius: 10,
    marginLeft: 65
  },
  smallText: {
    color: 'white',
    fontSize: 20,
    height: 40,
    width: 40,
    marginTop: 5,
    zIndex: 0
  },
  dropdown: {
    width: 170,
    backgroundColor: '#220530',
    borderWidth: 2,
    borderColor: '#BD4FD3',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 5
  },
  dropdowncontent: {
    backgroundColor: '#220428',
    width: 170,
    borderWidth: 2,
    borderColor: '#BD4FD3',
    borderRadius: 10,
    overflow: 'hidden',
  },
  AddExerciseButton: {
    backgroundColor: "#90EEBF",
    height: 50,
    width: 100,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',   
    alignSelf: 'center',
    marginLeft: 180,
    marginTop: 40
  },
  saveButton: {
    backgroundColor: "#90EEBF",
    height: 50,
    width: 100,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0
  },
  savetext: {
    color: 'black',
    fontSize: 30,
  },
  Notesbox: {
    borderWidth: 2,
    borderColor: '#BD4FD3',
    height: 100,
    width: 300,
    backgroundColor: '#220530',
    borderRadius: 10,
    marginBottom: 30,
  },
  notestext: {
    color: 'white',
    fontSize: 18,
    height: 100,
    width: 298,
  },

  AddedExercises: {
    bottom: 900,
  }
  
});

export default LogWorkoutScreen;
